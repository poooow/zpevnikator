import { createContext, useContext } from "react";
import type { AppSettingsContextType } from "./types";

// Create context with a default value that matches the AppSettingsContextType
export const AppSettingsContext = createContext<AppSettingsContextType>({
  transposition: 0,
  song: null,
  liked: [],
  setTranspositionUp: () => {},
  setTranspositionDown: () => {},
  resetTransposition: () => {},
  setSong: () => {},
  addLiked: () => {},
  removeLiked: () => {},
  isLiked: () => false,
});

// Custom hook to use the context
export const useAppSettings = (): AppSettingsContextType => {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useAppSettings must be used within an AppSettingsProvider"
    );
  }
  return context;
};
