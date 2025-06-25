import { useState, useMemo, useEffect } from "react";
import { AppSettingsContext } from "./AppSettingsContext";
import type { SettingsState } from "./types";

const STORAGE_KEY = "appSettings";

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<SettingsState>(() => {
    const defaultSettings: SettingsState = {
      transposition: 0,
      song: null,
      liked: [],
    };

    if (typeof window === "undefined") {
      return defaultSettings;
    }

    // Load from localStorage on initial render
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return defaultSettings;

      const parsed = JSON.parse(saved);
      // Ensure liked is always an array
      if (!Array.isArray(parsed.liked)) {
        parsed.liked = [];
      }
      return { ...defaultSettings, ...parsed };
    } catch (error) {
      console.error("Error parsing saved settings:", error);
      return defaultSettings;
    }
  });

  // Save to localStorage whenever settings change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
  }, [settings]);

  // Update individual settings
  const updateSetting = <T extends keyof SettingsState>(
    key: T,
    value: SettingsState[T]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const contextValue = useMemo(
    () => ({
      ...settings,
      setTranspositionUp: () => {
        if (settings.transposition < 12)
          updateSetting("transposition", settings.transposition + 1);
      },
      setTranspositionDown: () => {
        if (settings.transposition > -12)
          updateSetting("transposition", settings.transposition - 1);
      },
      resetTransposition: () => {
        updateSetting("transposition", 0);
      },
      setSong: (
        song: {
          id: number;
          groupName: string;
          title: string;
          text: string;
          snippet?: string;
        } | null
      ) => updateSetting("song", song),
      addLiked: (value: number) =>
        updateSetting("liked", [...settings.liked, value]),
      removeLiked: (value: number) =>
        updateSetting(
          "liked",
          settings.liked.filter((id) => id !== value)
        ),
      isLiked: (value: number) => settings.liked.includes(value),
    }),
    [settings]
  );

  return (
    <AppSettingsContext.Provider value={contextValue}>
      {children}
    </AppSettingsContext.Provider>
  );
};
