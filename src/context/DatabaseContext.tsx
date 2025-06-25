import { createContext } from 'react';
import type { DatabaseContextType } from './types';

export const DatabaseContext = createContext<DatabaseContextType | null>(null);
