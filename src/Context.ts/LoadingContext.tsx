import React, { createContext, useState, useContext, ReactNode } from 'react';

interface LoadingContextProps {
  loading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextProps | undefined>(
  undefined
);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);

  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  return (
    <LoadingContext.Provider value={{ loading, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextProps => {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }

  return context;
};
