/**
 * CONTRAT PARTAGÉ — propriété de l'admin (adrie-59). Ne pas modifier sans lui écrire.
 * Toutes les sessions (engine, UI, PWA, contenu) codent contre ces types.
 * Le schéma Zod de src/lib/schema.ts doit inférer exactement ces formes.
 */

export type CourseCode = 'MAT1400' | 'MAT1500' | 'MAT1600' | 'STT1700';
export type Exam = 'intra' | 'final';

/** Un thème d'un cours. `id` est globalement unique, préfixé par le cours en minuscules: "mat1600-diag". */
export interface Topic {
  id: string;
  label: string;
  exam: Exam;
  /** coché par défaut = déjà vu en classe à la date du build */
  defaultOn: boolean;
}

export interface Course {
  code: CourseCode;
  title: string;
  /** couleur CSS du cours, ex. "#f59e0b" */
  color: string;
  /** ordre pédagogique */
  topics: Topic[];
}

export type Difficulty = 1 | 2 | 3;

export interface Choice {
  text: string;
  correct: boolean;
  /** montré quand ce mauvais choix est tapé */
  why?: string;
}

interface QuestionBase {
  /** stable pour toujours; forme "<topicId>-<nnn>", ex. "mat1600-diag-007" */
  id: string;
  course: CourseCode;
  /** doit exister dans courses[course].topics */
  topic: string;
  difficulty: Difficulty;
  /** ≤ 280 caractères; maths en $…$ ou $$…$$ */
  prompt: string;
  /** 1 à 3 phrases; nomme le piège classique */
  explanation: string;
  /** question Défi (visible seulement si le commutateur Défi est activé) */
  challenge?: true;
  /** obligatoire si challenge: solution pas à pas en Markdown */
  solution?: string;
}

/** Exactement 4 choix, exactement 1 correct. Mélangés à l'affichage. */
export interface QcmQuestion extends QuestionBase {
  type: 'qcm';
  choices: [Choice, Choice, Choice, Choice];
}

/** Vrai/Faux. Affichage toujours "Vrai" puis "Faux". */
export interface VfQuestion extends QuestionBase {
  type: 'vf';
  answer: boolean;
}

/** Carte flash: taper pour révéler, puis auto-évaluation "Je savais" / "Pas su". Ne compte pas dans le combo. */
export interface FlashQuestion extends QuestionBase {
  type: 'flash';
  answer: string;
  /** 1 à 3 points clés */
  keyPoints: string[];
}

export type Question = QcmQuestion | VfQuestion | FlashQuestion;
export type QuestionType = Question['type'];

/** Fichier src/content/<cours>/<topic>.json = Question[] */
export type QuestionFile = Question[];

// ---------- Progression (localStorage "pause-maths:progress") ----------

export type Box = 1 | 2 | 3 | 4 | 5;

export interface CardState {
  box: Box;
  /** epoch ms */
  due: number;
  /** nombre de fois vue */
  n: number;
  /** nombre de bonnes réponses */
  k: number;
  wrongLast: boolean;
  /** epoch ms de la dernière réponse */
  at: number;
}

export interface Settings {
  courses: CourseCode[];
  /** ids de thèmes cochés */
  topics: string[];
  challenge: boolean;
  /** epoch ms */
  updatedAt: number;
}

export interface Progress {
  v: 1;
  cards: Record<string, CardState>;
  /** jours actifs "YYYY-MM-DD" (heure locale); le streak en est dérivé */
  activeDays: string[];
  settings: Settings;
  /** ids de questions signalées par l'utilisateur */
  flagged: string[];
  syncCode?: string;
}

// ---------- Session de jeu (mémoire seulement) ----------

export type Mode = 'rafale' | 'sansFin' | 'aRevoir';

export interface GameSession {
  /** ids déjà montrés dans cette session */
  shown: string[];
  lastCourse?: CourseCode;
  lastTopic?: string;
}

/** Générateur pseudo-aléatoire [0,1), injecté (mulberry32 seedé en tests) */
export type Rng = () => number;

/** Morceau de texte après découpage des formules */
export type MathPart =
  | { kind: 'text'; value: string }
  | { kind: 'inline'; value: string }
  | { kind: 'display'; value: string };
