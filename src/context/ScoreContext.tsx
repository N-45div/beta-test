// ScoreContext.tsx
import { createContext, useContext, useState } from 'react';

type ScoreContextType = {
  totalScore: number;
  updateScore: (delta: number) => void;
  resetScore: () => void;
};

const ScoreContext = createContext<ScoreContextType>({
  totalScore: 0,
  updateScore: () => {},
  resetScore: () => {},
});

export const ScoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [totalScore, setTotalScore] = useState(0);

  const updateScore = (delta: number) => {
    setTotalScore(prev => Math.max(0, prev + delta)); // Ensure score doesn't go negative
  };

  const resetScore = () => {
    setTotalScore(0);
  };

  return (
    <ScoreContext.Provider value={{ totalScore, updateScore, resetScore }}>
      {children}
    </ScoreContext.Provider>
  );
};

export const useScore = () => useContext(ScoreContext);
