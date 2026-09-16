import { useEffect, useState } from 'preact/hooks';
import { canPromptInstall, isIOS, onInstallAvailability, promptInstall } from '@/lib/ui-env';
import { Icon } from './Icon';

interface Props {
  onDismiss: () => void;
}

/** Affiché hors mode standalone : installer, puis toujours ouvrir depuis l'icône. */
export function InstallBanner({ onDismiss }: Props) {
  const ios = isIOS();
  const [promptable, setPromptable] = useState(canPromptInstall);

  useEffect(() => onInstallAvailability(() => setPromptable(canPromptInstall())), []);

  return (
    <aside class="install" aria-labelledby="install-title">
      <div class="install__head">
        <span class="install__icon" aria-hidden="true">
          <Icon name={ios ? 'addSquare' : 'install'} size={22} />
        </span>
        <h2 id="install-title" class="install__title">
          Installe Pause Maths
        </h2>
        <button type="button" class="icon-btn icon-btn--small" onClick={onDismiss} aria-label="Plus tard">
          <Icon name="close" size={18} />
        </button>
      </div>

      {ios ? (
        <ol class="install__steps">
          <li>
            Touche <Icon name="share" size={18} class="inline-icon" label="Partager" /> <strong>Partager</strong> dans
            Safari.
          </li>
          <li>
            Choisis <strong>« Sur l’écran d’accueil »</strong>.
          </li>
        </ol>
      ) : promptable ? (
        <button type="button" class="btn btn--small btn--accent install__cta" onClick={() => void promptInstall()}>
          <Icon name="install" size={18} />
          Installer
        </button>
      ) : (
        <p class="install__text">
          Dans le menu du navigateur, choisis <strong>« Installer Pause Maths »</strong>.
        </p>
      )}

      <p class="install__warn">
        Ouvre-la ensuite <strong>toujours depuis l’icône</strong>
        {ios
          ? ' : sur iPhone, Safari et l’app installée ne partagent pas leur mémoire, ta progression serait coupée en deux.'
          : ' : elle marche hors ligne et garde ta progression au même endroit.'}
      </p>
    </aside>
  );
}
