import { useControllableState } from '../hooks/useControllableState';
import { twMerge } from 'tailwind-merge';

export interface SwitchProps {
  defaultValue?: boolean;
  value?: boolean;
  disabled?: boolean;
  className?: string;
  onChange?: (_value: boolean) => void;
}

export function Switch({
  defaultValue: defaultValueProp = false,
  value: valueProp,
  onChange: onChangeProp,
  className,
  ...props
}: SwitchProps) {
  const [value, onChange] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValueProp,
    onChange: onChangeProp,
  });

  return (
    <label className="cursor-pointer">
      <input type="checkbox" className="hidden" checked={value} onChange={e => onChange(e.target.checked)} {...props} />
      <div
        className={twMerge(
          'relative w-10 h-6 rounded-full transition-all duration-200',
          value ? 'bg-shape-brand' : 'bg-shape-depth1',
          props.disabled && 'opacity-40 cursor-not-allowed',
          className,
        )}
      >
        <div
          className={twMerge(
            'absolute top-1 left-1 size-4 rounded-full transition-transform duration-200 bg-shape-white',
            value ? 'translate-x-4' : 'translate-x-0',
          )}
        />
      </div>
    </label>
  );
}
