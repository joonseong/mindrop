'use client';

import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';

import { Txt } from './Txt';

const BottomTabContext = createContext<{
  selected: string | undefined;
  handleSelect: (_value: string) => void;
}>({
  selected: undefined,
  handleSelect: () => {},
});

export function Root({ defaultValue, children }: { defaultValue: string; children: ReactNode }) {
  const [selected, setSelected] = useState<string>(defaultValue);

  const handleSelect = useCallback((tab: string) => setSelected(tab), []);

  useEffect(() => {
    setSelected(defaultValue);
  }, [defaultValue]);

  return (
    <BottomTabContext.Provider value={{ selected, handleSelect }}>
      <div className="mt-auto flex items-center justify-between w-full h-16 px-12 bg-shape-white border-t-[1px] border-t-[#F4F5FB]">
        {children}
      </div>
    </BottomTabContext.Provider>
  );
}

export function Item({
  value,
  label,
  renderIcon,
}: {
  value: string;
  label: string;
  renderIcon: (_active: boolean) => ReactNode;
}) {
  const context = useContext(BottomTabContext);

  if (!context) {
    throw new Error('BottomTab.Item must be used within a BottomTab');
  }

  const { selected, handleSelect } = context;

  return (
    <div onClick={() => handleSelect(value)} className="flex flex-col items-center">
      {renderIcon(selected === value)}
      <Txt className="text-txt-black-secondary" name={`label-${value === selected ? 'bold' : 'regular'}`}>
        {label}
      </Txt>
    </div>
  );
}
