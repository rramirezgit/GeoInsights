import * as Slider from '@radix-ui/react-slider';

interface RangeSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  label: string;
  step?: number;
  formatValue?: (v: number) => string;
}

export function RangeSlider({
  min,
  max,
  value,
  onChange,
  label,
  step = 1,
  formatValue,
}: RangeSliderProps) {
  const displayValue = formatValue ? formatValue(value) : String(value);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {label}
        </label>
        <span className="text-xs font-semibold text-white">{displayValue}</span>
      </div>

      <Slider.Root
        className="relative flex h-5 w-full touch-none select-none items-center"
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([v]) => {
          if (v !== undefined) onChange(v);
        }}
      >
        <Slider.Track className="relative h-1.5 grow rounded-full bg-slate-700">
          <Slider.Range className="absolute h-full rounded-full bg-emerald-500" />
        </Slider.Track>
        <Slider.Thumb
          className="block h-4 w-4 rounded-full border-2 border-emerald-500 bg-white shadow-md shadow-black/30 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 hover:scale-110"
          aria-label={label}
        />
      </Slider.Root>
    </div>
  );
}
