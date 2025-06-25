import { useContext } from 'react';
import { DatabaseContext } from './DatabaseContext';
import type { DatabaseContextType } from './types';

export const useDatabaseContext = (): DatabaseContextType => {
  const context = useContext(DatabaseContext);
  if (context === null) {
    throw new Error('useDatabaseContext must be used within a DatabaseProvider');
  }
  return context;
};
