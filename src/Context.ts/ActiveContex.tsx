import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ActiveState =
  | 'jarvisMarch'
  | 'bruteForce'
  | 'quickElimination'
  | 'quickHull'
  | 'grahamScan'
  | 'line';

interface ActiveStateContextProps {
  active: string;
  setIsActive: React.Dispatch<React.SetStateAction<string>>;
}

const ActiveStateContext = createContext<ActiveStateContextProps>({
  active: 'bruteForce',
  setIsActive: () => {},
});

interface ActiveStateProviderProps {
  children: ReactNode;
}

export function ActiveStateProvider({ children }: ActiveStateProviderProps) {
  const [active, setIsActive] = useState<string>('bruteForce');

  return (
    <ActiveStateContext.Provider value={{ active, setIsActive }}>
      {children}
    </ActiveStateContext.Provider>
  );
}

export function useActiveState() {
  const context = useContext(ActiveStateContext);
  if (!context) {
    throw new Error(
      'useActiveState must be used within an ActiveStateProvider'
    );
  }
  return context;
}
