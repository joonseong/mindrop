import { ReactNode } from 'react';

import {
  Field,
  Label as HeadlessLabel,
  LabelProps as HeadlessLabelProps,
  Radio as HeadlessRadio,
  RadioGroup as HeadlessRadioGroup,
  RadioGroupProps as HeadlessRadioGroupProps,
  RadioProps as HeadlessRadioProps,
} from '@headlessui/react';
import { twMerge } from 'tailwind-merge';

export interface RadioProps extends HeadlessRadioGroupProps {}

export function Root({ children, className, ...props }: RadioProps) {
  return (
    <HeadlessRadioGroup className={className} {...props}>
      {children}
    </HeadlessRadioGroup>
  );
}

export interface RadioItemProps extends Omit<HeadlessRadioProps, 'children'> {
  children?: ReactNode;
  className?: string;
}

export function Item({ children, className, ...props }: RadioItemProps) {
  return (
    <Field className="flex items-center gap-2">
      <HeadlessRadio
        className={twMerge(
          'group flex items-center justify-center size-6 rounded-full bg-shape-white border border-border-button outline-none data-[checked]:border-border-brand data-[disabled]:bg-shape-depth2',
          className,
        )}
        {...props}
      >
        <span className="invisible size-3 rounded-full bg-shape-brand group-data-[checked]:visible" />
      </HeadlessRadio>

      <>{children}</>
    </Field>
  );
}

export interface RadioLabelProps extends HeadlessLabelProps {}

export function Label({ children, ...props }: RadioLabelProps) {
  return <HeadlessLabel {...props}>{children}</HeadlessLabel>;
}
