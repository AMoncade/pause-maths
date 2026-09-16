import { useEffect, useRef } from 'preact/hooks';
import { Icon, type IconName } from './Icon';

export type EmptyReason = 'bank' | 'selection' | 'review';

const COPY: Record<EmptyReason, { icon: IconName; title: string; text: string }> = {
  bank: {
    icon: 'cloud',
    title: 'La banque est encore vide',
    text: 'Les questions s’ajoutent cours par cours. Elles apparaîtront à la prochaine mise à jour de l’app.',
  },
  selection: {
    icon: 'sliders',
    title: 'Aucune question ici',
    text: 'Rien ne correspond aux cours et aux thèmes choisis. Coche d’autres thèmes, choisis « Tout » ou active Défi.',
  },
  review: {
    icon: 'check',
    title: 'Rien à revoir',
    text: 'Les questions ratées reviennent ici jusqu’à ce que tu les réussisses. Joue une Rafale pour en trouver !',
  },
};

interface Props {
  reason: EmptyReason;
  onSettings: () => void;
  onHome: () => void;
}

export function Empty({ reason, onSettings, onHome }: Props) {
  const { icon, title, text } = COPY[reason];
  const primaryRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    primaryRef.current?.focus({ preventScroll: true });
  }, []);
  return (
    <main class="screen empty">
      <div class="empty__body">
        <span class={`empty__icon empty__icon--${reason}`} aria-hidden="true">
          <Icon name={icon} size={40} />
        </span>
        <h1 class="empty__title">{title}</h1>
        <p class="empty__text">{text}</p>
      </div>
      <div class="recap__actions">
        <button ref={primaryRef} type="button" class="btn btn--block btn--accent" onClick={onHome}>
          Retour à l’accueil
        </button>
        {reason === 'selection' && (
          <button type="button" class="btn btn--block btn--quiet" onClick={onSettings}>
            Choisir les thèmes
          </button>
        )}
      </div>
    </main>
  );
}
