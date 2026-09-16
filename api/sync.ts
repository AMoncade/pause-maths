// Propriété du lot PWA. Fonction Vercel (Node) : GET/PUT d'un blob de progression
// par clé = SHA-256(code de synchro), calculée côté client. Le serveur ne voit
// jamais le code lui-même.
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { get, put } from '@vercel/blob';
import type { Progress } from '../src/lib/types';
import { ProgressSchema } from '../src/lib/schema';
import { merge } from '../src/lib/merge';

const MAX_BODY_BYTES = 200_000;
const KEY_RE = /^[0-9a-f]{64}$/;

// Rate limit basique, en mémoire par instance (best-effort : une instance
// froide repart à zéro, ce n'est pas une garantie stricte).
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;
const hits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > RATE_LIMIT_MAX;
}

async function readStoredProgress(pathname: string): Promise<Progress | null> {
  const result = await get(pathname, { access: 'private' });
  if (!result || result.statusCode !== 200) return null;
  const text = await new Response(result.stream).text();
  const parsed: unknown = JSON.parse(text);
  const validated = ProgressSchema.safeParse(parsed);
  return validated.success ? validated.data : null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const key = typeof req.query.key === 'string' ? req.query.key : '';
  if (!KEY_RE.test(key)) {
    res.status(400).json({ error: 'Clé invalide.' });
    return;
  }
  const pathname = `sync/${key}.json`;

  if (req.method === 'GET') {
    try {
      const stored = await readStoredProgress(pathname);
      if (!stored) {
        res.status(404).json({ error: 'Aucune progression pour ce code.' });
        return;
      }
      res.status(200).json(stored);
    } catch {
      res.status(502).json({ error: 'Erreur de lecture du stockage.' });
    }
    return;
  }

  if (req.method === 'PUT') {
    if (isRateLimited(key)) {
      res.status(429).json({ error: 'Trop de synchros récentes, réessaie dans un instant.' });
      return;
    }

    const contentLength = Number(req.headers['content-length'] ?? 0);
    if (contentLength > MAX_BODY_BYTES) {
      res.status(413).json({ error: 'Progression trop grosse.' });
      return;
    }

    const incoming: unknown = req.body;
    const incomingBytes = Buffer.byteLength(JSON.stringify(incoming ?? {}));
    if (incomingBytes > MAX_BODY_BYTES) {
      res.status(413).json({ error: 'Progression trop grosse.' });
      return;
    }
    const parsedIncoming = ProgressSchema.safeParse(incoming);
    if (!parsedIncoming.success) {
      res.status(400).json({ error: 'Corps invalide.' });
      return;
    }

    try {
      const stored = await readStoredProgress(pathname);
      const merged = stored ? merge(stored, parsedIncoming.data) : parsedIncoming.data;
      await put(pathname, JSON.stringify(merged), {
        access: 'private',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'application/json',
      });
      res.status(200).json(merged);
    } catch {
      res.status(502).json({ error: 'Erreur d\'écriture du stockage.' });
    }
    return;
  }

  res.setHeader('Allow', 'GET, PUT');
  res.status(405).json({ error: 'Méthode non supportée.' });
}
