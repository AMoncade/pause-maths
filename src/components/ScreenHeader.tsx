import { Icon } from './Icon';

export function ScreenHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header class="screen-head">
      <button type="button" class="icon-btn" onClick={onBack} aria-label="Retour à l’accueil">
        <Icon name="back" />
      </button>
      <h1 class="screen-head__title">{title}</h1>
    </header>
  );
}
