import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for points and lines
export type Point = { x: number; y: number };
type Line = { start: Point; end: Point };

// Define types for the context
type DrawingContextType = {
  points: Point[];
  linePoints: Point[];
  addPoints: (points: Point[]) => void;
  addLinePoint: (point: Point) => void;
  resetLinePoints: () => void;
  addDupLinePoint: (point: Point) => void;
  addLinePoints: (point: Point[]) => void;
  toggleRetry: () => void;
  popLinePoint: () => void;
  addPoint: (point: Point) => void;
  retry: boolean;
  setSolve: () => void;
  quickHullPoints: Point[];
  resetSolve: () => void;
  addQuickHullPoints: (p: Point[]) => void;
  resetQuickHullPoints: () => void;
};

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

type DrawingProviderProps = { children: ReactNode };

const DrawingProvider: React.FC<DrawingProviderProps> = ({ children }) => {
  const [points, setPoints] = useState<Point[]>([]);
  const [linePoints, setlinePoints] = useState<Point[]>([]);
  const [retry, setRetry] = useState<boolean>(false);
  const [quickHullPoints, setQuickHullPoints] = useState<Point[]>([]);
  const toggleRetry = () => {
    setRetry((retry) => !retry);
  };
  const setSolve = () => {
    setRetry(() => true);
  };
  const resetSolve = () => {
    setRetry(() => false);
  };
  const addPoints = (points: Point[]) => {
    setPoints(() => points);
  };
  const addPoint = (point: Point) => {
    setPoints((points) => [...points, point]);
  };
  const addLinePoint = (point: Point) => {
    setlinePoints((points) => [...new Set([...points, point])]);
  };
  const resetLinePoints = () => {
    setlinePoints(() => []);
  };
  const addDupLinePoint = (point: Point) => {
    setlinePoints((points) => [...points, point]);
  };
  const addLinePoints = (points: Point[]) => {
    setlinePoints(() => points);
  };
  const popLinePoint = () => {
    // to pop last element
    const arr = [...linePoints].slice(0, -1);
    setlinePoints(() => arr);
  };
  const addQuickHullPoints = (p: Point[]) => {
    setQuickHullPoints(p);
  };
  const resetQuickHullPoints = () => {
    setQuickHullPoints([]);
  };
  const contextValue: DrawingContextType = {
    points,
    linePoints,
    addPoints,
    addLinePoint,
    resetLinePoints,
    addDupLinePoint,
    addLinePoints,
    toggleRetry,
    retry,
    popLinePoint,
    quickHullPoints,
    addPoint,
    setSolve,
    resetSolve,
    addQuickHullPoints,
    resetQuickHullPoints,
  };

  return (
    <DrawingContext.Provider value={contextValue}>
      {children}
    </DrawingContext.Provider>
  );
};

// Define a custom hook to consume the context
const useDrawingContext = () => {
  const context = useContext(DrawingContext);
  if (!context) {
    throw new Error('useDrawingContext must be used within a DrawingProvider');
  }
  return context;
};

export { DrawingProvider, useDrawingContext };
