'use client';

import { Fragment, ReactNode, createContext, useContext } from 'react';

import { useControllableState } from '../hooks/useControllableState';
import { Icon } from './Icon';
import { Txt } from './Txt';
import {
  Listbox,
  ListboxButton,
  ListboxButtonProps,
  ListboxOption,
  ListboxOptionProps,
  ListboxOptions,
  ListboxOptionsProps,
  ListboxProps,
  Transition,
} from '@headlessui/react';
import { twMerge } from 'tailwind-merge';

const SelectContext = createContext<{ value?: string; error?: boolean }>({});

export interface SelectRootProps extends ListboxProps {
  bottomText?: string;
  children: ReactNode;
  error?: boolean;
}

export function Root({
  bottomText,
  children,
  error,
  value: valueProp,
  defaultValue: defaultValueProp = '',
  onChange: onChangeProp,
  ...props
}: SelectRootProps) {
  const [value, onChange] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValueProp,
    onChange: onChangeProp,
  });

  return (
    <SelectContext.Provider value={{ value, error }}>
      <div className="relative flex flex-col gap-1">
        <Listbox {...props} onChange={onChange}>
          {children}
        </Listbox>

        {bottomText && (
          <Txt
            name="body-2"
            className={twMerge('transition-colors duration-200', error ? 'text-txt-error' : 'text-txt-black-tertiary')}
          >
            {bottomText}
          </Txt>
        )}
      </div>
    </SelectContext.Provider>
  );
}

export interface SelectTriggerProps extends Omit<ListboxButtonProps, 'children'> {
  className?: string;
  children?: ReactNode | ((_props: { value: string }) => ReactNode);
  placeholder?: string;
}

export function Trigger({ className, children, placeholder, ...props }: SelectTriggerProps) {
  const context = useContext(SelectContext);

  if (!context) {
    throw new Error('Select.Trigger는 Select.Root 내부에서 사용해야 합니다.');
  }

  const getBorderStyle = ({ error, disabled, focused }: { error: boolean; disabled: boolean; focused: boolean }) => {
    if (error) {
      return 'border-border-error';
    } else if (disabled) {
      return 'border-border-button bg-shape-depth2 text-txt-black-placeholder';
    } else if (focused) {
      return 'border-border-brand';
    } else {
      return 'border-border-button';
    }
  };

  return (
    <ListboxButton
      className={({ disabled, open }) =>
        twMerge(
          'relative flex items-center justify-between w-full outline-none rounded text-base py-3 px-4 border border-solid bg-shape-white transition-all duration-200',
          context.value ? 'text-txt-black-primary' : 'text-txt-black-placeholder',
          getBorderStyle({ error: context.error ?? false, disabled, focused: open }),
          className,
        )
      }
      {...props}
    >
      {({ open }) => (
        <>
          <div className="h-6">
            {context.value
              ? children && typeof children === 'function'
                ? children({ value: context.value })
                : (children ?? context.value)
              : placeholder}
          </div>
          <span className={twMerge('transition-all duration-150 ease-in-out', open ? '-rotate-90' : 'rotate-90')}>
            <Icon name="arrow" size={16} />
          </span>
        </>
      )}
    </ListboxButton>
  );
}

export interface SelectContentsProps extends ListboxOptionsProps {
  className?: string;
  children: ReactNode;
}

export function Contents({ className, children, ...props }: SelectContentsProps) {
  return (
    <Transition
      as={Fragment}
      enter="transition duration-75 ease-in"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <ListboxOptions
        className={twMerge(
          'overflow-y-auto absolute top-14 min-w-full max-h-80 rounded border border-border-button bg-shape-white focus:outline-none',
          className,
        )}
        {...props}
      >
        {children}
      </ListboxOptions>
    </Transition>
  );
}

export interface SelectItemProps extends ListboxOptionProps {
  className?: string;
}

export function Item({ className, children, ...props }: SelectItemProps) {
  return (
    <ListboxOption
      className={({ selected }) =>
        twMerge('cursor-pointer p-4', selected ? 'text-txt-point' : 'text-txt-black-primary', className)
      }
      {...props}
    >
      {children ?? props.value}
    </ListboxOption>
  );
}
