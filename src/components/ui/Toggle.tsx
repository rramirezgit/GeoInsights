import * as Switch from '@radix-ui/react-switch';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, disabled = false }: ToggleProps) {
  return (
    <label className="flex items-center justify-between gap-3">
      <span
        className={`text-sm font-medium ${
          disabled ? 'text-slate-600' : 'text-slate-300'
        }`}
      >
        {label}
      </span>

      <Switch.Root
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        className="relative h-6 w-10 shrink-0 cursor-pointer rounded-full bg-slate-600 transition-colors data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[state=checked]:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
      >
        <Switch.Thumb className="block h-4 w-4 translate-x-1 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-5" />
      </Switch.Root>
    </label>
  );
}
