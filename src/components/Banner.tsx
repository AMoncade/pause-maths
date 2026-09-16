import type { ComponentChildren } from 'preact';
import { Icon, type IconName } from './Icon';

interface Props {
  tone: 'info' | 'warn' | 'danger';
  icon?: IconName;
  title: ComponentChildren;
  children?: ComponentChildren;
  action?: { label: string; onClick: () => void };
  onDismiss?: () => void;
}

export function Banner({ tone, icon = 'alert', title, children, action, onDismiss }: Props) {
  return (
    <div class={`banner banner--${tone}`} role={tone === 'info' ? 'note' : 'alert'}>
      <span class="banner__icon">
        <Icon name={icon} size={22} />
      </span>
      <div class="banner__body">
        <p class="banner__title">{title}</p>
        {children && <div class="banner__text">{children}</div>}
        {action && (
          <button type="button" class="btn btn--small btn--banner" onClick={action.onClick}>
            {action.label}
          </button>
        )}
      </div>
      {onDismiss && (
        <button type="button" class="icon-btn icon-btn--small" onClick={onDismiss} aria-label="Fermer">
          <Icon name="close" size={18} />
        </button>
      )}
    </div>
  );
}
