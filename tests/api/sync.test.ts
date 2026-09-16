// Propriété du lot PWA. Tests de la logique de api/sync.ts (GET/PUT/merge/rate-limit),
// avec @vercel/blob mocké par un store en mémoire (pas d'appel réseau réel).
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Progress } from '@/lib/types';

const blobStore = new Map<string, string>();

vi.mock('@vercel/blob', () => {
  return {
    get: vi.fn(async (pathname: string) => {
      const text = blobStore.get(pathname);
      if (text === undefined) return null;
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
          pathname,
          contentDisposition: '',
          cacheControl: '',
          uploadedAt: new Date(),
          etag: '',
          contentType: 'application/json',
          size: text.length,
        },
      };
    }),
    put: vi.fn(async (pathname: string, body: string) => {
      blobStore.set(pathname, body);
      return { pathname, url: '', downloadUrl: '', contentType: 'application/json', contentDisposition: '' };
    }),
  };
});

const { default: handler } = await import('../../api/sync');

function makeReq(opts: {
  method: string;
  key?: string;
  body?: unknown;
  contentLength?: number;
}) {
  return {
    method: opts.method,
    query: { key: opts.key ?? '' },
    headers: opts.contentLength !== undefined ? { 'content-length': String(opts.contentLength) } : {},
    body: opts.body,
  } as any;
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
    settings: { courses: ['MAT1400'], topics: [], challenge: false, updatedAt: 1 },
    flagged: [],
    ...over,
  };
}

const KEY_A = 'a'.repeat(64);
const KEY_B = 'b'.repeat(64);

describe('api/sync', () => {
  beforeEach(() => {
    blobStore.clear();
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
    await handler(
      makeReq({ method: 'PUT', key: KEY_A, body: progress(), contentLength: 300_000 }),
      res,
    );
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
      await handler(makeReq({ method: 'PUT', key, body: progress({ settings: { courses: [], topics: [], challenge: false, updatedAt: i } }) }), last);
    }
    expect(last.statusCode).toBe(429);
  });

  it('405 sur une méthode non supportée', async () => {
    const res = makeRes();
    await handler(makeReq({ method: 'DELETE', key: KEY_A }), res);
    expect(res.statusCode).toBe(405);
  });
});
