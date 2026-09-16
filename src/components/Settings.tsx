import { useState } from 'preact/hooks';
import type { Course } from '@/lib/types';
import { Icon } from './Icon';
import { ScreenHeader } from './ScreenHeader';

export type SyncStatus =
  | { state: 'idle' }
  | { state: 'syncing' }
  | { state: 'ok'; at: number }
  | { state: 'offline' }
  | { state: 'error'; message: string };

interface Props {
  courses: Course[];
  topics: string[];
  syncCode?: string;
  sync: SyncStatus;
  formatCode: (code: string) => string;
  onToggleTopic: (id: string) => void;
  onCourseTopics: (course: Course, on: boolean) => void;
  onActivateSync: () => void;
  /** résout un message d'erreur, ou null si le code est accepté */
  onLinkCode: (input: string) => Promise<string | null>;
  onSyncNow: () => void;
  onUnlinkSync: () => void;
  onReset: () => void;
  onCopy: (text: string) => Promise<boolean>;
  onBack: () => void;
}

const time = new Intl.DateTimeFormat('fr-CA', { hour: 'numeric', minute: '2-digit' });

function syncLine(sync: SyncStatus): { tone: 'muted' | 'good' | 'bad'; text: string } {
  switch (sync.state) {
    case 'idle':
      return { tone: 'muted', text: 'Synchro automatique après chaque Rafale.' };
    case 'syncing':
      return { tone: 'muted', text: 'Synchro en cours…' };
    case 'ok':
      return { tone: 'good', text: `Synchronisé à ${time.format(sync.at)}.` };
    case 'offline':
      return { tone: 'muted', text: 'Hors ligne : la synchro reprendra au retour du réseau.' };
    case 'error':
      return { tone: 'bad', text: `Synchro impossible : ${sync.message}` };
  }
}

export function Settings(props: Props) {
  const { courses, topics, syncCode, sync } = props;
  const [linking, setLinking] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const submitCode = async (e: Event) => {
    e.preventDefault();
    if (checking) return;
    setChecking(true);
    const err = await props.onLinkCode(codeInput);
    setChecking(false);
    setCodeError(err);
    if (!err) {
      setLinking(false);
      setCodeInput('');
    }
  };

  const line = syncLine(sync);

  return (
    <main class="screen panel">
      <ScreenHeader title="Réglages" onBack={props.onBack} />

      <section class="panel-section" aria-labelledby="topics-title">
        <h2 id="topics-title" class="section-title">
          Thèmes vus en classe
        </h2>
        <p class="hint">Décoche ce que tu n’as pas encore vu : ces questions ne sortiront pas.</p>

        {courses.map((course) => {
          const on = course.topics.filter((t) => topics.includes(t.id)).length;
          const allOn = course.topics.length > 0 && on === course.topics.length;
          return (
            <fieldset key={course.code} class="topic-group tint" style={{ '--c': course.color }}>
              <legend class="topic-group__legend">
                <span class="topic-group__code">{course.code}</span>
                <span class="topic-group__title">{course.title}</span>
              </legend>
              {course.topics.length === 0 ? (
                <p class="hint topic-group__empty">Thèmes à venir.</p>
              ) : (
                <>
                  <div class="topic-group__bar">
                    <span class="topic-group__count">
                      {on}/{course.topics.length} cochés
                    </span>
                    <button
                      type="button"
                      class="link-btn link-btn--small"
                      onClick={() => props.onCourseTopics(course, !allOn)}
                    >
                      {allOn ? 'Tout décocher' : 'Tout cocher'}
                    </button>
                  </div>
                  <ul class="checklist">
                    {course.topics.map((t) => (
                      <li key={t.id}>
                        <label class="check">
                          <input
                            type="checkbox"
                            checked={topics.includes(t.id)}
                            onChange={() => props.onToggleTopic(t.id)}
                          />
                          <span class="check__box" aria-hidden="true">
                            <Icon name="check" size={16} />
                          </span>
                          <span class="check__label">{t.label}</span>
                          <span class={`exam-tag exam-tag--${t.exam}`}>{t.exam === 'intra' ? 'Intra' : 'Final'}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </fieldset>
          );
        })}
      </section>

      <section class="panel-section" aria-labelledby="sync-title">
        <h2 id="sync-title" class="section-title">
          Synchro
        </h2>
        {syncCode ? (
          <div class="sync">
            <p class="hint">Entre ce code sur ton autre appareil pour partager ta progression.</p>
            <div class="sync__code-row">
              <output class="sync__code" aria-label="Code de synchro">
                {props.formatCode(syncCode)}
              </output>
              <button
                type="button"
                class="btn btn--small"
                onClick={async () => {
                  setCopied(await props.onCopy(props.formatCode(syncCode)));
                  setTimeout(() => setCopied(false), 1800);
                }}
              >
                <Icon name={copied ? 'check' : 'copy'} size={18} />
                {copied ? 'Copié' : 'Copier'}
              </button>
            </div>
            <p class={`sync__status sync__status--${line.tone}`} role="status">
              <Icon name={sync.state === 'error' ? 'alert' : 'cloud'} size={18} />
              {line.text}
            </p>
            <div class="button-row">
              <button
                type="button"
                class="btn btn--small"
                disabled={sync.state === 'syncing'}
                onClick={props.onSyncNow}
              >
                Synchroniser maintenant
              </button>
              <button type="button" class="link-btn link-btn--small" onClick={props.onUnlinkSync}>
                Désactiver sur cet appareil
              </button>
            </div>
          </div>
        ) : (
          <div class="sync">
            <p class="hint">Garde ta progression entre ton téléphone et ton ordi, sans compte.</p>
            <div class="button-row">
              <button type="button" class="btn btn--small btn--accent" onClick={props.onActivateSync}>
                Activer la synchro
              </button>
              <button
                type="button"
                class="btn btn--small"
                aria-expanded={linking}
                onClick={() => {
                  setLinking((l) => !l);
                  setCodeError(null);
                }}
              >
                J’ai déjà un code
              </button>
            </div>
            {linking && (
              <form class="code-form" onSubmit={submitCode}>
                <label class="field-label" for="sync-code">
                  Code de ton autre appareil
                </label>
                <div class="code-form__row">
                  <input
                    id="sync-code"
                    class={`field ${codeError ? 'is-invalid' : ''}`}
                    value={codeInput}
                    onInput={(e) => setCodeInput((e.target as HTMLInputElement).value)}
                    placeholder="K7F2-9QXD-M3PA"
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellcheck={false}
                    aria-invalid={codeError !== null}
                    aria-describedby={codeError ? 'sync-code-error' : undefined}
                  />
                  <button type="submit" class="btn btn--small btn--accent" disabled={checking}>
                    {checking ? 'Vérification…' : 'Relier'}
                  </button>
                </div>
                {codeError && (
                  <p id="sync-code-error" class="field-error" role="alert">
                    {codeError}
                  </p>
                )}
              </form>
            )}
          </div>
        )}
      </section>

      <section class="panel-section" aria-labelledby="reset-title">
        <h2 id="reset-title" class="section-title">
          Réinitialiser
        </h2>
        <p class="hint">
          Efface la progression de cet appareil : cartes, série, XP et signalements. La synchro y est désactivée ; tes
          autres appareils gardent la leur.
        </p>
        {confirmReset ? (
          <div class="button-row">
            <button
              type="button"
              class="btn btn--small btn--bad"
              onClick={() => {
                props.onReset();
                setConfirmReset(false);
              }}
            >
              Oui, tout effacer
            </button>
            <button type="button" class="btn btn--small" onClick={() => setConfirmReset(false)}>
              Annuler
            </button>
          </div>
        ) : (
          <button type="button" class="btn btn--small btn--bad-soft" onClick={() => setConfirmReset(true)}>
            Réinitialiser la progression
          </button>
        )}
      </section>
    </main>
  );
}
