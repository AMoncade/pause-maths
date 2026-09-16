// Propriété du lot PWA. Tests de la logique de api/sync.ts (GET/PUT/merge/CAS/
// rate-limit), avec @vercel/blob mocké par un store en mémoire (pas d'appel
// réseau réel). Le mock modélise l'essentiel du contrat réel : etag par
// écriture, ifMatch/allowOverwrite conditionnels (BlobPreconditionFailedError
// sinon), et une file `__getQueue` pour scripter une lecture "périmée" et
// simuler un entrelacement de deux écrivains concurrents.
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Progress } from '@/lib/types';

vi.mock('@vercel/blob', () => {
  class BlobError extends Error {}
  class BlobPreconditionFailedError extends BlobError {
    constructor() {
      super('The specified precondition failed for one of the conditionals.');
    }
  }

  const store = new Map<string, { text: string; etag: string }>();
  const getQueue: Array<'ABSENT' | { text: string; etag: string }> = [];
  let etagCounter = 0;

  function makeGetResult(text: string, etag: string) {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(text));
        controller.close();
      },
    });
    return {
      statusCode: 200,
      stream,
      headers: new Headers(),
      blob: {
        url: '',
        downloadUrl: '',
        pathname: '',
        contentDisposition: '',
        cacheControl: '',
        uploadedAt: new Date(),
        etag,
        contentType: 'application/json',
        size: text.length,
      },
    };
  }

  return {
    BlobError,
    BlobPreconditionFailedError,
    __store: store,
    __getQueue: getQueue,
    get: vi.fn(async (pathname: string) => {
      if (getQueue.length > 0) {
        const scripted = getQueue.shift()!;
        if (scripted === 'ABSENT') return null;
        return makeGetResult(scripted.text, scripted.etag);
      }
      const entry = store.get(pathname);
      return entry ? makeGetResult(entry.text, entry.etag) : null;
    }),
    put: vi.fn(async (pathname: string, body: string, opts: { ifMatch?: string; allowOverwrite?: boolean }) => {
      const existing = store.get(pathname);
      if (opts?.ifMatch) {
        if (!existing || existing.etag !== opts.ifMatch) throw new BlobPreconditionFailedError();
      } else if (existing && opts?.allowOverwrite !== true) {
        throw new BlobPreconditionFailedError();
      }
      const etag = `etag-${++etagCounter}`;
      store.set(pathname, { text: body, etag });
      return { pathname, url: '', downloadUrl: '', contentType: 'application/json', contentDisposition: '' };
    }),
  };
});

const { default: handler } = await import('../../api/sync');
const blob = (await import('@vercel/blob')) as unknown as {
  __store: Map<string, { text: string; etag: string }>;
  __getQueue: Array<'ABSENT' | { text: string; etag: string }>;
  get: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
};

function makeReq(opts: { method: string; key?: string; body?: unknown; contentLength?: number; ip?: string }) {
  const headers: Record<string, string> = { 'x-sync-key': opts.key ?? '', 'x-forwarded-for': opts.ip ?? opts.key ?? 'no-key' };
  if (opts.contentLength !== undefined) headers['content-length'] = String(opts.contentLength);
  return { method: opts.method, query: {}, headers, body: opts.body } as any;
}

function makeRes() {
  const res: any = {
    statusCode: 200,
    body: undefined,
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(body: unknown) {
      res.body = body;
      return res;
    },
    setHeader() {
      return res;
    },
  };
  return res;
}

function progress(over: Partial<Progress> = {}): Progress {
  return {
    v: 1,
    cards: {},
    activeDays: [],
    settings: { courses: ['MAT1400'], topicOverrides: {}, challenge: false, updatedAt: 1 },
    flagged: [],
    ...over,
  };
}

const card = (box: 1 | 2 | 3 | 4 | 5, due: number, at: number) => ({ box, due, n: 1, k: 1, wrongLast: false, at });

const KEY_A = 'a'.repeat(64);
const KEY_B = 'b'.repeat(64);

describe('api/sync', () => {
  beforeEach(() => {
    blob.__store.clear();
    blob.__getQueue.length = 0;
    vi.clearAllMocks();
  });

  it('rejette une clé mal formée', async () => {
    const res = makeRes();
    await handler(makeReq({ method: 'GET', key: 'trop-court' }), res);
    expect(res.statusCode).toBe(400);
  });

  it('GET sur un code inconnu renvoie 404', async () => {
    const res = makeRes();
    await handler(makeReq({ method: 'GET', key: KEY_A }), res);
    expect(res.statusCode).toBe(404);
  });

  it('PUT puis GET renvoie la même progression', async () => {
    const p = progress({ cards: { q1: { box: 2, due: 100, n: 1, k: 1, wrongLast: false, at: 10 } } });
    const putRes = makeRes();
    await handler(makeReq({ method: 'PUT', key: KEY_A, body: p }), putRes);
    expect(putRes.statusCode).toBe(200);

    const getRes = makeRes();
    await handler(makeReq({ method: 'GET', key: KEY_A }), getRes);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toEqual(p);
  });

  it('fusionne deux PUT successifs (carte la plus récente gagne, activeDays unis)', async () => {
    const first = progress({
      cards: { q1: { box: 1, due: 100, n: 1, k: 0, wrongLast: true, at: 10 } },
      activeDays: ['2026-09-15'],
      flagged: ['q9'],
    });
    const second = progress({
      cards: { q1: { box: 2, due: 200, n: 2, k: 1, wrongLast: false, at: 20 } },
      activeDays: ['2026-09-16'],
      flagged: ['q7'],
    });

    await handler(makeReq({ method: 'PUT', key: KEY_B, body: first }), makeRes());
    const res2 = makeRes();
    await handler(makeReq({ method: 'PUT', key: KEY_B, body: second }), res2);

    expect(res2.body.cards.q1).toEqual(second.cards.q1);
    expect(res2.body.activeDays.sort()).toEqual(['2026-09-15', '2026-09-16']);
    expect(res2.body.flagged.sort()).toEqual(['q7', 'q9']);
  });

  it('garde la carte la plus récente même si elle vient du blob stocké', async () => {
    const stored = progress({ cards: { q1: { box: 3, due: 500, n: 3, k: 2, wrongLast: false, at: 99 } } });
    await handler(makeReq({ method: 'PUT', key: KEY_A, body: stored }), makeRes());

    const stale = progress({ cards: { q1: { box: 1, due: 100, n: 1, k: 0, wrongLast: true, at: 5 } } });
    const res = makeRes();
    await handler(makeReq({ method: 'PUT', key: KEY_A, body: stale }), res);

    expect(res.body.cards.q1).toEqual(stored.cards.q1);
  });

  it('rejette un corps trop gros (content-length)', async () => {
    const res = makeRes();
    await handler(makeReq({ method: 'PUT', key: KEY_A, body: progress(), contentLength: 300_000 }), res);
    expect(res.statusCode).toBe(413);
  });

  it('rejette un corps invalide', async () => {
    const res = makeRes();
    await handler(makeReq({ method: 'PUT', key: KEY_A, body: { not: 'progress' } }), res);
    expect(res.statusCode).toBe(400);
  });

  it('limite le débit après trop de PUT rapides sur la même clé', async () => {
    const key = 'c'.repeat(64);
    let last = makeRes();
    for (let i = 0; i < 25; i++) {
      last = makeRes();
      await handler(
        makeReq({ method: 'PUT', key, body: progress({ settings: { courses: [], topicOverrides: {}, challenge: false, updatedAt: i } }) }),
        last,
      );
    }
    expect(last.statusCode).toBe(429);
  });

  it('405 sur une méthode non supportée', async () => {
    const res = makeRes();
    await handler(makeReq({ method: 'DELETE', key: KEY_A }), res);
    expect(res.statusCode).toBe(405);
  });

  // --- Relecture Engine : points 1, 2, 3 ---

  it('deux PUT entrelacés convergent sans perte (conflit détecté, nouvelle tentative)', async () => {
    const key = 'd'.repeat(64);
    const p1 = progress({ cards: { qa: card(1, 100, 10) } });
    const p2 = progress({ cards: { qb: card(1, 200, 20) } });

    const res1 = makeRes();
    await handler(makeReq({ method: 'PUT', key, body: p1 }), res1);
    expect(res1.statusCode).toBe(200);

    // Le deuxième écrivain a lu l'état AVANT l'écriture ci-dessus (comme s'il
    // tournait en parallèle) : sa première lecture voit encore "absent".
    blob.__getQueue.push('ABSENT');

    const res2 = makeRes();
    await handler(makeReq({ method: 'PUT', key, body: p2 }), res2);
    expect(res2.statusCode).toBe(200);
    expect(res2.body.cards).toMatchObject({ qa: p1.cards.qa, qb: p2.cards.qb });
    // 1 écriture pour res1, 2 tentatives pour res2 (échec précondition puis succès).
    expect(blob.put).toHaveBeenCalledTimes(3);

    const getRes = makeRes();
    await handler(makeReq({ method: 'GET', key }), getRes);
    expect(getRes.body.cards).toMatchObject({ qa: p1.cards.qa, qb: p2.cards.qb });
  });

  it('ne stocke ni ne renvoie jamais syncCode', async () => {
    const key = 'e'.repeat(64);
    const p = progress({ syncCode: 'SECRET12345' });

    const putRes = makeRes();
    await handler(makeReq({ method: 'PUT', key, body: p }), putRes);
    expect(putRes.statusCode).toBe(200);
    expect(putRes.body.syncCode).toBeUndefined();

    const stored = blob.__store.get(`sync/${key}.json`)!;
    expect(stored.text).not.toContain('SECRET12345');
    expect(stored.text).not.toContain('syncCode');

    const getRes = makeRes();
    await handler(makeReq({ method: 'GET', key }), getRes);
    expect(getRes.body.syncCode).toBeUndefined();
  });

  it("ne réécrit jamais un blob illisible sans le sauvegarder d'abord", async () => {
    const key = 'f'.repeat(64);
    const pathname = `sync/${key}.json`;
    const oldShapeText = JSON.stringify({
      v: 1,
      cards: {},
      activeDays: [],
      settings: { courses: ['MAT1400'], topics: [], challenge: false, updatedAt: 1 }, // ancien contrat
      flagged: [],
    });
    blob.__store.set(pathname, { text: oldShapeText, etag: 'etag-seed' });

    const getRes = makeRes();
    await handler(makeReq({ method: 'GET', key }), getRes);
    expect(getRes.statusCode).toBe(422); // ni 200 (silencieux) ni 404 ("code inexistant", faux)

    const incoming = progress({ cards: { qz: card(2, 300, 30) } });
    const putRes = makeRes();
    await handler(makeReq({ method: 'PUT', key, body: incoming }), putRes);
    expect(putRes.statusCode).toBe(200);
    expect(putRes.body.cards.qz).toEqual(incoming.cards.qz);

    const backupPathname = [...blob.__store.keys()].find((k) => k.startsWith(`sync/${key}.backup-`));
    expect(backupPathname).toBeDefined();
    expect(blob.__store.get(backupPathname!)!.text).toBe(oldShapeText);
  });
});
