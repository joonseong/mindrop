import { useControllableState } from '../hooks/useControllableState';
import { Icon } from './Icon';
import { twMerge } from 'tailwind-merge';

export type CheckboxValueType = boolean | 'indeterminate';

export interface CheckboxProps {
  defaultValue?: CheckboxValueType;
  value?: CheckboxValueType;
  disabled?: boolean;
  className?: string;
  onChange?: (_value: CheckboxValueType) => void;
}

export function Checkbox({
  defaultValue: defaultValueProp = false,
  value: valueProp,
  onChange: onChangeProp,
  className,
  ...props
}: CheckboxProps) {
  const [value, onChange] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValueProp,
    onChange: onChangeProp,
  });

  const handleGetStyle = () => {
    if (props.disabled) {
      return 'bg-shape-depth1';
    } else if (value === true || value === 'indeterminate') {
      return 'border-none bg-shape-brand flex items-center justify-center';
    } else {
      return 'bg-shape-white';
    }
  };

  const handleGetIcon = () => {
    if (props.disabled) {
      return null;
    } else if (value === true) {
      return <Icon name="checked" size={16} color="#ffffff" />;
    } else if (value === 'indeterminate') {
      return <Icon name="indeterminated" size={16} color="#ffffff" />;
    } else {
      return null;
    }
  };

  return (
    <div>
      <input
        type="checkbox"
        className="hidden"
        checked={value === true}
        onChange={e => onChange(e.target.checked)}
        {...props}
      />
      <div className={twMerge('size-6 border border-solid rounded border-border-button', handleGetStyle(), className)}>
        {handleGetIcon()}
      </div>
    </div>
  );
}
