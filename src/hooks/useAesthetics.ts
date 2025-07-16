// src/hooks/useAesthetics.ts
import { useContext } from 'react';
import { ThemingContext } from '../contexts/ThemingContext';

export const useAesthetics = () => {
  const context = useContext(ThemingContext);
  if (!context) {
    throw new Error('useAesthetics must be used within a ThemingProvider');
  }
  return context;
};
