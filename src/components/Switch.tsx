import type { ComponentChildren } from 'preact';

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ComponentChildren;
  hint?: ComponentChildren;
  icon?: ComponentChildren;
}

/** Ligne entière cliquable avec un interrupteur (role="switch"). */
export function Switch({ checked, onChange, label, hint, icon }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      class="switch-row"
      onClick={() => onChange(!checked)}
    >
      {icon && <span class="switch-row__icon">{icon}</span>}
      <span class="switch-row__text">
        <span class="switch-row__label">{label}</span>
        {hint && <span class="switch-row__hint">{hint}</span>}
      </span>
      <span class="switch" aria-hidden="true">
        <span class="switch__knob" />
      </span>
    </button>
  );
}
