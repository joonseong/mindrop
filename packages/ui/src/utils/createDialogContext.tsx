import { ReactNode, createContext, useContext as useReactContext } from 'react';

export interface DialogContext {
  open: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (_open: boolean) => void;
  onExited?: () => void;
}

interface ProviderProps {
  children: ReactNode;
  value: DialogContext;
}

export function createDialogContext(name: string) {
  const Context = createContext<DialogContext>({ open: false });

  const Provider = ({ children, value }: ProviderProps) => {
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  const useContext = () => {
    const context = useReactContext(Context);

    if (!context) {
      throw new Error(`${name} 컨텍스트 외부에서 useContext를 사용할 수 없습니다.`);
    }

    return context;
  };

  return { Provider, useContext };
}
