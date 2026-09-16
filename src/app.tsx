import 'katex/dist/katex.min.css';
import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/home.css';
import './styles/play.css';
import './styles/recap.css';
import './styles/panel.css';

import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { Course, CourseCode, Mode, Progress, Question } from '@/lib/types';
import { bank as defaultBank, bankVersion as defaultBankVersion } from '@/content/bank';
import { courses as defaultCourses } from '@/content/courses';
import {
  isTopicOn,
  levelProgress,
  loadProgress,
  mastery,
  resetProgress,
  saveProgress,
  setTopic,
  streak,
  toggleFlag,
  xp,
} from '@/lib/progress';
import { applyAnswer, mulberry32, nextQuestion } from '@/lib/scheduler';
import { checkSyncCode, formatSyncCode, generateSyncCode, normalizeSyncCode, syncNow } from '@/lib/sync';
import { applyUpdate, onUpdateReady } from '@/lib/pwa';
import {
  answer,
  isAnswered,
  newRound,
  playable,
  reveal,
  reviewCount,
  roundOver,
  withQuestion,
  type Answer,
  type Round,
} from '@/lib/ui-game';
import { keyAction, type Screen } from '@/lib/ui-keys';
import { setCourseTopics, toggleCourse, withSettings } from '@/lib/ui-select';
import { copyText, followThemeColor, isOnline, isStandalone, requestPersistence, vibrate } from '@/lib/ui-env';
import { Banner } from '@/components/Banner';
import type { LevelInfo } from '@/components/CourseChips';
import { Empty, type EmptyReason } from '@/components/Empty';
import { Home } from '@/components/Home';
import { InstallBanner } from '@/components/InstallBanner';
import { Play } from '@/components/Play';
import { Recap, type LevelUp } from '@/components/Recap';
import { Settings, type SyncStatus } from '@/components/Settings';
import { Stats } from '@/components/Stats';

/** Mode à relancer après une mise à jour appliquée depuis le bilan (« Encore 5 »). */
export const RESUME_KEY = 'pause-maths:resume-mode';

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

export interface AppProps {
  bank?: Question[];
  courses?: Course[];
  bankVersion?: { builtAt: string; count: number };
  storage?: StorageLike;
  clock?: () => number;
  seed?: number;
}

function browserStorage(): StorageLike {
  try {
    return window.localStorage;
  } catch {
    const mem = new Map<string, string>();
    return { getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => void mem.set(k, v) };
  }
}

export function App({
  bank = defaultBank,
  courses = defaultCourses,
  bankVersion = defaultBankVersion,
  storage: storageProp,
  clock = Date.now,
  seed,
}: AppProps = {}) {
  const storage = useMemo(() => storageProp ?? browserStorage(), [storageProp]);
  const rng = useMemo(() => mulberry32(seed ?? (Date.now() ^ Math.floor(Math.random() * 2 ** 32)) >>> 0), [seed]);
  const courseByCode = useMemo(
    () => Object.fromEntries(courses.map((c) => [c.code, c])) as Record<CourseCode, Course>,
    [courses],
  );
  const questionById = useMemo(() => {
    const m = new Map(bank.map((q) => [q.id, q]));
    return (id: string) => m.get(id);
  }, [bank]);
  const topicLabel = useMemo(() => {
    const m = new Map(courses.flatMap((c) => c.topics.map((t) => [t.id, t.label] as const)));
    return (id: string) => m.get(id) ?? id;
  }, [courses]);
  const allCodes = useMemo(() => courses.map((c) => c.code), [courses]);

  // ---------- progression ----------
  const [boot] = useState(() => loadProgress(storage, clock(), courses));
  const [progress, setProgress] = useState<Progress>(boot.progress);
  const [recovered, setRecovered] = useState(boot.recovered ? { backupKey: boot.backupKey } : null);
  const [saveFailed, setSaveFailed] = useState(false);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    setSaveFailed(!saveProgress(storage, progress).ok);
  }, [progress, storage]);

  useEffect(() => requestPersistence(), []);
  useEffect(() => followThemeColor(), []);

  // ---------- écrans et partie ----------
  const [screen, setScreen] = useState<Screen>('home');
  const [round, setRound] = useState<Round | null>(null);
  const [roundStart, setRoundStart] = useState<Progress | null>(null);
  const [emptyReason, setEmptyReason] = useState<EmptyReason>('selection');
  const [installDismissed, setInstallDismissed] = useState(false);
  const [standalone] = useState(isStandalone);

  function startRound(mode: Mode) {
    const p = progressRef.current;
    const r = newRound(mode);
    const q = nextQuestion(bank, p, r.session, mode, clock(), rng, courses);
    if (!q) {
      setEmptyReason(bank.length === 0 ? 'bank' : mode === 'aRevoir' ? 'review' : 'selection');
      setRound(null);
      setScreen('empty');
      return;
    }
    setRoundStart(p);
    setRound(withQuestion(r, q, rng));
    setScreen('play');
  }

  function finishRound(r: Round, ended: Round['ended']) {
    if (r.results.length === 0) return goHome();
    setRound({ ...r, ended });
    setScreen('recap');
  }

  function advance(r: Round) {
    if (roundOver(r)) return finishRound(r, 'done');
    const q = nextQuestion(bank, progressRef.current, r.session, r.mode, clock(), rng, courses);
    if (!q) return finishRound(r, 'done');
    setRound(withQuestion(r, q, rng));
  }

  function onPick(pick: Answer) {
    if (!round?.question || isAnswered(round)) return;
    const r = answer(round, pick);
    if (r === round) return;
    const now = clock();
    const id = round.question.id;
    const next = applyAnswer(progressRef.current, id, r.ok!, now);
    progressRef.current = next;
    setProgress(next);
    if (round.question.type === 'flash') {
      // pas de feedback pour une carte flash : on enchaîne directement
      advance(r);
    } else {
      vibrate(r.ok ? 12 : [24, 40, 24]);
      setRound(r);
    }
  }

  function onNext() {
    if (round && isAnswered(round)) advance(round);
  }

  function onReveal() {
    if (round) setRound(reveal(round));
  }

  function onQuit() {
    if (round) finishRound(round, 'quit');
    else goHome();
  }

  function goHome() {
    setRound(null);
    setScreen('home');
  }

  // ---------- synchro ----------
  const [sync, setSync] = useState<SyncStatus>({ state: 'idle' });
  const syncing = useRef(false);

  const runSync = useCallback(async (): Promise<void> => {
    const p = progressRef.current;
    if (!p.syncCode || syncing.current) return;
    if (!isOnline()) {
      setSync({ state: 'offline' });
      return;
    }
    syncing.current = true;
    setSync({ state: 'syncing' });
    const res = await syncNow(p);
    syncing.current = false;
    if (!res.ok) {
      setSync({ state: 'error', message: res.error });
      return;
    }
    if (progressRef.current !== p) {
      // une réponse est arrivée pendant l'aller-retour : on repousse l'état le plus récent
      return runSync();
    }
    progressRef.current = res.progress;
    setProgress(res.progress);
    setSync({ state: 'ok', at: clock() });
  }, [clock]);

  useEffect(() => {
    void runSync();
    const onVisible = () => {
      if (document.visibilityState === 'visible') void runSync();
    };
    const onOnline = () => void runSync();
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('online', onOnline);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('online', onOnline);
    };
  }, [runSync]);

  useEffect(() => {
    if (screen === 'recap') void runSync();
  }, [screen, runSync]);

  function setSyncCode(code: string | undefined) {
    const { syncCode: _old, ...rest } = progressRef.current;
    const next: Progress = code ? { ...rest, syncCode: code } : rest;
    progressRef.current = next;
    setProgress(next);
  }

  function activateSync() {
    setSyncCode(generateSyncCode());
    void runSync();
  }

  async function linkCode(input: string): Promise<string | null> {
    const code = normalizeSyncCode(input);
    if (!code) return 'Ce code n’est pas valide : il a 12 caractères, comme K7F2-9QXD-M3PA.';
    const res = await checkSyncCode(code);
    if (!res.ok) return res.error;
    if (!res.exists) return 'Aucun appareil n’utilise ce code. Vérifie-le dans Réglages → Synchro sur ton autre appareil.';
    setSyncCode(code);
    void runSync();
    return null;
  }

  // ---------- mises à jour de l'app ----------
  const [updateReady, setUpdateReady] = useState(false);
  useEffect(() => onUpdateReady(() => setUpdateReady(true)), []);
  useEffect(() => {
    if (updateReady && screen === 'home') applyUpdate();
  }, [updateReady, screen]);

  useEffect(() => {
    try {
      const mode = sessionStorage.getItem(RESUME_KEY) as Mode | null;
      if (mode) {
        sessionStorage.removeItem(RESUME_KEY);
        startRound(mode);
      }
    } catch {
      /* sessionStorage indisponible */
    }
  }, []);

  function again() {
    const mode = round?.mode ?? 'rafale';
    if (updateReady) {
      try {
        sessionStorage.setItem(RESUME_KEY, mode);
      } catch {
        /* on relancera sans reprise */
      }
      applyUpdate();
      return;
    }
    startRound(mode);
  }

  // ---------- clavier ----------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName;
      const action = keyAction(
        {
          screen,
          type: round?.question?.type,
          answered: round ? isAnswered(round) : false,
          revealed: round?.revealed ?? false,
        },
        {
          key: e.key,
          ctrlKey: e.ctrlKey,
          metaKey: e.metaKey,
          altKey: e.altKey,
          inField: tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || t?.isContentEditable === true,
          onControl: tag === 'BUTTON' || tag === 'A' || tag === 'SUMMARY',
        },
      );
      if (!action) return;
      e.preventDefault();
      switch (action.kind) {
        case 'choose': {
          const idx = round?.order[action.index];
          if (idx !== undefined) onPick(idx);
          return;
        }
        case 'vf':
          return onPick(action.value);
        case 'grade':
          return onPick(action.knew);
        case 'reveal':
          return onReveal();
        case 'next':
          return onNext();
        case 'primary':
          return screen === 'recap' ? again() : goHome();
        case 'back':
          return screen === 'play' ? onQuit() : goHome();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // ---------- données dérivées ----------
  const levels = useMemo(
    () =>
      Object.fromEntries(courses.map((c) => [c.code, levelProgress(xp(progress, bank, c.code))])) as Record<
        CourseCode,
        LevelInfo
      >,
    [courses, progress, bank],
  );

  const xpByCourse = useMemo(
    () => Object.fromEntries(courses.map((c) => [c.code, xp(progress, bank, c.code)])) as Record<CourseCode, number>,
    [courses, progress, bank],
  );

  const setSettings = (patch: Parameters<typeof withSettings>[1]) => {
    const next = withSettings(progressRef.current, patch, clock());
    progressRef.current = next;
    setProgress(next);
  };

  const updateProgress = (fn: (p: Progress) => Progress) => {
    const next = fn(progressRef.current);
    progressRef.current = next;
    setProgress(next);
  };

  let view = null;
  switch (screen) {
    case 'play':
      if (round?.question) {
        const id = round.question.id;
        view = (
          <Play
            round={round}
            courseByCode={courseByCode}
            topicLabel={topicLabel}
            flagged={progress.flagged.includes(id)}
            onFlag={() => updateProgress((p) => toggleFlag(p, id))}
            onPick={onPick}
            onReveal={onReveal}
            onNext={onNext}
            onQuit={onQuit}
          />
        );
      }
      break;

    case 'recap':
      if (round && roundStart) {
        const played = [...new Set(round.results.map((r) => r.course))];
        const levelUps: LevelUp[] = played.flatMap((code) => {
          const before = levelProgress(xp(roundStart, bank, code)).level;
          const after = levels[code].level;
          return after > before ? [{ course: courseByCode[code], level: after }] : [];
        });
        view = (
          <Recap
            round={round}
            questionById={questionById}
            courseByCode={courseByCode}
            xpGained={Math.max(0, xp(progress, bank) - xp(roundStart, bank))}
            levelUps={levelUps}
            onAgain={again}
            onHome={goHome}
          />
        );
      }
      break;

    case 'empty':
      view = <Empty reason={emptyReason} onHome={goHome} onSettings={() => setScreen('settings')} />;
      break;

    case 'settings':
      view = (
        <Settings
          courses={courses}
          isTopicOn={(topic) => isTopicOn(progress.settings, topic)}
          syncCode={progress.syncCode}
          sync={sync}
          formatCode={formatSyncCode}
          onSetTopic={(id, on) => updateProgress((p) => setTopic(p, id, on, clock()))}
          onCourseTopics={(course, on) => updateProgress((p) => setCourseTopics(p, course, on, clock()))}
          onActivateSync={activateSync}
          onLinkCode={linkCode}
          onSyncNow={() => void runSync()}
          onUnlinkSync={() => {
            setSyncCode(undefined);
            setSync({ state: 'idle' });
          }}
          onReset={() => {
            updateProgress((p) => resetProgress(p, clock()));
            setSync({ state: 'idle' });
          }}
          onCopy={copyText}
          onBack={goHome}
        />
      );
      break;

    case 'stats':
      view = (
        <Stats
          courses={courses}
          bank={bank}
          flagged={progress.flagged}
          streakDays={streak(progress, clock())}
          totalXp={xp(progress, bank)}
          seen={bank.filter((q) => progress.cards[q.id]).length}
          levels={levels}
          xpByCourse={xpByCourse}
          masteryOf={(id) => mastery(progress, bank, id)}
          bankVersion={bankVersion}
          onUnflag={(id) => updateProgress((p) => toggleFlag(p, id))}
          onCopy={copyText}
          onBack={goHome}
        />
      );
      break;
  }

  if (!view) {
    view = (
      <Home
        courses={courses}
        selected={progress.settings.courses}
        levels={levels}
        xpByCourse={xpByCourse}
        streakDays={streak(progress, clock())}
        challenge={progress.settings.challenge}
        available={playable(bank, progress, courses).length}
        review={reviewCount(bank, progress, courses)}
        bankEmpty={bank.length === 0}
        onToggleCourse={(code) => setSettings({ courses: toggleCourse(progress.settings.courses, code, allCodes) })}
        onAll={() => setSettings({ courses: [...allCodes] })}
        onChallenge={(on) => setSettings({ challenge: on })}
        onStart={startRound}
        onSettings={() => setScreen('settings')}
        onStats={() => setScreen('stats')}
        banners={
          <>
            {recovered && (
              <Banner tone="warn" title="Ta progression était illisible" onDismiss={() => setRecovered(null)}>
                On l’a mise de côté{recovered.backupKey ? ` (copie « ${recovered.backupKey} »)` : ''} et tu repars de
                zéro sur cet appareil.
              </Banner>
            )}
            {!standalone && !installDismissed && <InstallBanner onDismiss={() => setInstallDismissed(true)} />}
          </>
        }
      />
    );
  }

  return (
    <>
      {saveFailed && (
        <div class="global-banner">
          <Banner tone="danger" title="Impossible d’enregistrer sur cet appareil">
            La mémoire est pleine ou la navigation est privée. Tes réponses restent en mémoire tant que l’app est
            ouverte.
          </Banner>
        </div>
      )}
      {view}
    </>
  );
}
