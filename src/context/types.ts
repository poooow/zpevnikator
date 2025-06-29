import { Database } from "sql.js";

export interface DatabaseProgress {
  status: 'idle' | 'loading' | 'downloading' | 'processing' | 'ready' | 'error';
  loaded: number;
  total: number;
  percentage: number;
}

export interface DatabaseContextType {
  db: Database | null;
  dbError: Error | null;
  isInitialized: boolean;
  progress: DatabaseProgress;
}

export interface DatabaseSchema {
  database: {
    key: string;
    value: ArrayBuffer;
  };
}

import { Song } from "../types/song";

export type SettingsState = {
  transposition: number;
  song: Song | null;
  liked: number[];
};

export type AppSettingsContextType = SettingsState & {
  setTranspositionUp: () => void;
  setTranspositionDown: () => void;
  resetTransposition: () => void;
  setSong: (song: Song | null) => void;
  addLiked: (value: number) => void;
  removeLiked: (value: number) => void;
  isLiked: (value: number) => boolean;
};
