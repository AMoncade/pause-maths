import { describe, expect, it } from 'vitest';
import {
  BACKUP_PREFIX,
  dayKey,
  emptyProgress,
  level,
  levelProgress,
  loadProgress,
  markActive,
  mastery,
  migrate,
  saveProgress,
  STORAGE_KEY,
  streak,
  toggleFlag,
  xp,
} from '@/lib/progress';
import { ProgressSchema } from '@/lib/schema';
import { testCourses } from './fixtures/courses';
import { card, deepFreeze, makeQuestion, MemoryStorage, local, progressWith } from './helpers';

const NOW = local(2026, 9, 16, 18, 30);

describe('emptyProgress', () => {
  it('tous les cours, thèmes cochés par défaut, Défi désactivé, valide pour Zod', () => {
    const p = emptyProgress(NOW, testCourses);
    expect(p).toEqual({
      v: 1,
      cards: {},
      activeDays: [],
      settings: { courses: ['MAT1600', 'STT1700'], topics: ['mat1600-syst', 'stt1700-desc'], challenge: false, updatedAt: NOW },
      flagged: [],
    });
    expect(ProgressSchema.safeParse(p).success).toBe(true);
  });
});

describe('loadProgress / saveProgress', () => {
  it('stockage vide : état neuf, rien de récupéré, rien d\'écrit', () => {
    const s = new MemoryStorage();
    expect(loadProgress(s, NOW, testCourses)).toEqual({ progress: emptyProgress(NOW, testCourses), recovered: false });
    expect(s.data.size).toBe(0);
  });

  it('aller-retour save → load', () => {
    const s = new MemoryStorage();
    const p = progressWith({
      cards: { 'mat1600-syst-001': card({ box: 3, n: 3, k: 2, due: NOW, at: NOW }) },
      activeDays: ['2026-09-16'],
      flagged: ['mat1600-syst-001'],
      syncCode: 'K7F2-9QXD-M3PA',
    });
    expect(saveProgress(s, p)).toEqual({ ok: true });
    expect(loadProgress(s, NOW, testCourses)).toEqual({ progress: p, recovered: false });
  });

  it('JSON corrompu : copie brute dans pause-maths:backup-<ts>, état neuf, original retiré', () => {
    const s = new MemoryStorage();
    s.data.set(STORAGE_KEY, '{"v":1,"cards":{oops');
    const r = loadProgress(s, NOW, testCourses);
    expect(r).toEqual({ progress: emptyProgress(NOW, testCourses), recovered: true, backupKey: `${BACKUP_PREFIX}${NOW}` });
    expect(s.data.get(`${BACKUP_PREFIX}${NOW}`)).toBe('{"v":1,"cards":{oops');
    expect(s.data.has(STORAGE_KEY)).toBe(false);
  });

  it('JSON valide mais refusé par Zod (box 9) : copie + état neuf', () => {
    const s = new MemoryStorage();
    const raw = JSON.stringify(progressWith({ cards: { x: card({ box: 9 as never }) } }));
    s.data.set(STORAGE_KEY, raw);
    const r = loadProgress(s, NOW, testCourses);
    expect(r.recovered).toBe(true);
    expect(s.data.get(r.backupKey!)).toBe(raw);
  });

  it.each([
    ['version plus récente que l\'app', { ...progressWith(), v: 2 }],
    ['version 0', { ...progressWith(), v: 0 }],
    ['version absente', { cards: {} }],
    ['version en chaîne', { ...progressWith(), v: '1' }],
    ['tableau', [1, 2]],
    ['null', null],
  ])('%s : copie + état neuf, jamais d\'écrasement silencieux', (_label, value) => {
    const s = new MemoryStorage();
    const raw = JSON.stringify(value);
    s.data.set(STORAGE_KEY, raw);
    const r = loadProgress(s, NOW, testCourses);
    expect(r.recovered).toBe(true);
    expect(r.progress).toEqual(emptyProgress(NOW, testCourses));
    expect(s.data.get(r.backupKey!)).toBe(raw);
  });

  it('ne réécrit pas une copie existante au même instant', () => {
    const s = new MemoryStorage();
    s.data.set(`${BACKUP_PREFIX}${NOW}`, 'ancienne copie');
    s.data.set(STORAGE_KEY, 'pas du json');
    const r = loadProgress(s, NOW, testCourses);
    expect(r.backupKey).toBe(`${BACKUP_PREFIX}${NOW}-1`);
    expect(s.data.get(`${BACKUP_PREFIX}${NOW}`)).toBe('ancienne copie');
    expect(s.data.get(`${BACKUP_PREFIX}${NOW}-1`)).toBe('pas du json');
  });

  it('removeItem optionnel : la copie est faite, l\'original reste', () => {
    const inner = new MemoryStorage();
    const s = { getItem: (k: string) => inner.getItem(k), setItem: (k: string, v: string) => inner.setItem(k, v) };
    inner.data.set(STORAGE_KEY, 'pas du json');
    const r = loadProgress(s, NOW, testCourses);
    expect(r.recovered).toBe(true);
    expect(inner.data.get(r.backupKey!)).toBe('pas du json');
    expect(inner.data.get(STORAGE_KEY)).toBe('pas du json');
  });

  it('copie impossible (quota) : recovered sans backupKey, original intact', () => {
    const s = new MemoryStorage();
    s.data.set(STORAGE_KEY, 'pas du json');
    s.failSet = true;
    const r = loadProgress(s, NOW, testCourses);
    expect(r).toEqual({ progress: emptyProgress(NOW, testCourses), recovered: true });
    expect(s.data.get(STORAGE_KEY)).toBe('pas du json');
  });

  it('lecture impossible (stockage bloqué) : état neuf signalé', () => {
    const s = new MemoryStorage();
    s.failGet = true;
    expect(loadProgress(s, NOW, testCourses)).toEqual({ progress: emptyProgress(NOW, testCourses), recovered: true });
  });

  it('save qui échoue : ok false, sans exception', () => {
    const s = new MemoryStorage();
    s.failSet = true;
    expect(saveProgress(s, progressWith())).toEqual({ ok: false });
  });
});

describe('migrate', () => {
  const steps = {
    1: (s: Record<string, unknown>) => ({ ...s, v: 2, a: 1 }),
    2: (s: Record<string, unknown>) => ({ ...s, v: 3, b: (s.a as number) + 1 }),
  };

  it('applique les migrations pas à pas depuis la version stockée', () => {
    expect(migrate({ v: 1 }, steps, 3)).toEqual({ v: 3, a: 1, b: 2 });
    expect(migrate({ v: 2, a: 5 }, steps, 3)).toEqual({ v: 3, a: 5, b: 6 });
    expect(migrate({ v: 3, x: true }, steps, 3)).toEqual({ v: 3, x: true });
  });

  it('refuse une version inconnue, une migration manquante ou qui lève', () => {
    expect(migrate({ v: 4 }, steps, 3)).toBeUndefined();
    expect(migrate({ v: 1 }, { 2: steps[2] }, 3)).toBeUndefined();
    expect(migrate({ v: 1 }, { 1: () => { throw new Error('boom'); } }, 2)).toBeUndefined();
    expect(migrate({ v: 1.5 }, steps, 3)).toBeUndefined();
  });

  it('v1 sans migration : l\'état passe tel quel', () => {
    const p = progressWith();
    expect(migrate(p)).toBe(p);
  });
});

describe('jours actifs et streak', () => {
  it('dayKey suit l\'heure locale, pas UTC', () => {
    expect(dayKey(local(2026, 9, 16, 23, 59))).toBe('2026-09-16');
    expect(dayKey(local(2026, 9, 17, 0, 1))).toBe('2026-09-17');
    expect(dayKey(local(2026, 1, 5, 20))).toBe('2026-01-05');
  });

  it('markActive ajoute le jour trié, sans doublon, et rend p inchangé s\'il y est', () => {
    const p = deepFreeze(progressWith({ activeDays: ['2026-09-17'] }));
    const q = markActive(p, local(2026, 9, 16));
    expect(q.activeDays).toEqual(['2026-09-16', '2026-09-17']);
    expect(markActive(q, local(2026, 9, 16, 8))).toBe(q);
  });

  const withDays = (...days: string[]) => progressWith({ activeDays: days });

  it('0 sans jour actif, 1 si joué aujourd\'hui seulement', () => {
    expect(streak(withDays(), NOW)).toBe(0);
    expect(streak(withDays('2026-09-16'), NOW)).toBe(1);
  });

  it('se termine aujourd\'hui ou hier ; avant-hier ne compte plus', () => {
    expect(streak(withDays('2026-09-13', '2026-09-14', '2026-09-15', '2026-09-16'), NOW)).toBe(4);
    expect(streak(withDays('2026-09-14', '2026-09-15'), NOW)).toBe(2);
    expect(streak(withDays('2026-09-13', '2026-09-14'), NOW)).toBe(0);
  });

  it('un trou coupe la série', () => {
    expect(streak(withDays('2026-09-10', '2026-09-11', '2026-09-13', '2026-09-15', '2026-09-16'), NOW)).toBe(2);
  });

  it('traverse un changement de mois et le passage à l\'heure normale (1er novembre 2026)', () => {
    const days = withDays('2026-10-30', '2026-10-31', '2026-11-01', '2026-11-02');
    expect(streak(days, local(2026, 11, 2, 0, 30))).toBe(4);
    expect(streak(days, local(2026, 11, 3, 23, 30))).toBe(4);
    expect(streak(withDays('2026-02-28', '2026-03-01', '2026-03-08', '2026-03-09'), local(2026, 3, 9, 1))).toBe(2);
  });
});

describe('XP, niveau, maîtrise, signalements', () => {
  const bank = [
    makeQuestion('mat1600-syst-001'),
    makeQuestion('mat1600-syst-002'),
    makeQuestion('mat1600-syst-003'),
    makeQuestion('mat1600-syst-004'),
    makeQuestion('stt1700-desc-001'),
  ];
  const p = deepFreeze(
    progressWith({
      cards: {
        'mat1600-syst-001': card({ box: 3, k: 4, n: 5 }),
        'mat1600-syst-002': card({ box: 5, k: 6, n: 6 }),
        'mat1600-syst-003': card({ box: 2, k: 1, n: 3 }),
        'stt1700-desc-001': card({ box: 1, k: 0, n: 2 }),
        'mat1600-syst-999': card({ box: 5, k: 50, n: 50 }),
      },
    }),
  );

  it('xp = 10 par bonne réponse + 5 par box au-dessus de 1, cartes hors banque ignorées', () => {
    // 001: 40 + 10 ; 002: 60 + 20 ; 003: 10 + 5 ; stt: 0 ; 999 ignorée
    expect(xp(p, bank)).toBe(145);
    expect(xp(p, bank, 'MAT1600')).toBe(145);
    expect(xp(p, bank, 'STT1700')).toBe(0);
    expect(xp(p, bank, 'MAT1400')).toBe(0);
  });

  it('level = floor(sqrt(xp/100)) + 1, exact aux seuils', () => {
    expect([0, 99, 100, 399, 400, 899, 900, 2500].map(level)).toEqual([1, 1, 2, 2, 3, 3, 4, 6]);
    for (let l = 1; l < 200; l++) {
      expect(level(100 * l * l)).toBe(l + 1);
      expect(level(100 * l * l - 1)).toBe(l);
    }
  });

  it('levelProgress donne la position dans le niveau courant', () => {
    expect(levelProgress(0)).toEqual({ level: 1, into: 0, span: 100 });
    expect(levelProgress(150)).toEqual({ level: 2, into: 50, span: 300 });
    expect(levelProgress(400)).toEqual({ level: 3, into: 0, span: 500 });
    expect(levelProgress(899)).toEqual({ level: 3, into: 499, span: 500 });
  });

  it('mastery = cartes du thème en box ≥ 3 / questions du thème', () => {
    expect(mastery(p, bank, 'mat1600-syst')).toBe(0.5);
    expect(mastery(p, bank, 'stt1700-desc')).toBe(0);
    expect(mastery(p, bank, 'mat1600-det')).toBe(0);
  });

  it('toggleFlag ajoute (trié) puis retire, sans muter', () => {
    const a = toggleFlag(p, 'mat1600-syst-002');
    const b = toggleFlag(a, 'mat1600-syst-001');
    expect(b.flagged).toEqual(['mat1600-syst-001', 'mat1600-syst-002']);
    expect(toggleFlag(b, 'mat1600-syst-002').flagged).toEqual(['mat1600-syst-001']);
    expect(p.flagged).toEqual([]);
  });
});
