import { useState, useCallback, useEffect } from "react";
import { openDB } from "idb";
import { DatabaseContextType, DatabaseSchema } from "./types";

const DB_URL = import.meta.env.VITE_DB_URL;

// Load SQL.js with proper error handling and fallbacks
const loadSQL = async () => {
  try {
    // Try ESM import first
    try {
      const sql = await import("sql.js");
      const initSqlJs = sql.default || sql;
      return await initSqlJs({
        locateFile: (file: string) => `/${file}`,
      });
    } catch (e) {
      console.warn("ESM import failed, trying alternative import...", e);
      // Fallback to UMD/global approach
      const SQL = await import("sql.js/dist/sql-wasm.js");
      return await SQL.default({
        locateFile: (file: string) => `/${file}`,
      });
    }
  } catch (error) {
    console.error("Failed to load SQL.js:", error);
    throw new Error(
      "Failed to initialize SQL.js. Please check the console for details."
    );
  }
};

interface DatabaseProgress {
  status: "idle" | "loading" | "downloading" | "processing" | "ready" | "error";
  loaded: number;
  total: number;
  percentage: number;
}

export const useDatabase = (): DatabaseContextType & {
  progress: DatabaseProgress;
} => {
  const [db, setDb] = useState<DatabaseContextType["db"]>(null);
  const [dbError, setDbError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [progress, setProgress] = useState<DatabaseProgress>({
    status: "idle",
    loaded: 0,
    total: 0,
    percentage: 0,
  });

  const initializeDatabase = useCallback(async () => {
    try {
      setProgress((prev) => ({
        ...prev,
        status: "loading",
        percentage: 0,
      }));

      // Load SQL.js
      const SQL = await loadSQL();

      // Open or create IndexedDB
      const idb = await openDB<DatabaseSchema>("zpevnikatorDb", 1, {
        upgrade(database) {
          database.createObjectStore("database");
        },
      });

      // Try to get the database from IndexedDB
      let dbData = await idb.get("database", "main");

      if (!dbData) {
        // If not in IndexedDB, fetch from file
        console.log("Database not found in IndexedDB, importing from file...");
        setProgress((prev) => ({
          ...prev,
          status: "downloading",
          loaded: 0,
          total: 0,
          percentage: 0,
        }));

        const response = await new Promise<Response>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("GET", DB_URL, true);
          xhr.responseType = "arraybuffer";

          xhr.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentage = Math.round((event.loaded / event.total) * 100);
              setProgress({
                status: "downloading",
                loaded: event.loaded,
                total: event.total,
                percentage,
              });
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(new Response(xhr.response, { status: xhr.status }));
            } else {
              reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
            }
          };

          xhr.onerror = () => {
            reject(new Error("Network error while downloading database"));
          };

          xhr.send();
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch database file: ${response.status}`);
        }

        setProgress((prev) => ({
          ...prev,
          status: "processing",
          percentage: 100,
        }));

        dbData = await response.arrayBuffer();

        // Save to IndexedDB for future use
        await idb.put("database", dbData, "main");
      }

      const newDb = new SQL.Database(new Uint8Array(dbData as ArrayBuffer));
      setDb(newDb);
      setIsInitialized(true);

      setProgress((prev) => ({
        ...prev,
        status: "ready",
        loaded: prev.total,
        percentage: 100,
      }));
    } catch (error) {
      const errorObj =
        error instanceof Error
          ? error
          : new Error("Unknown error initializing database");
      console.error("Error initializing database:", errorObj);
      setDbError(errorObj);
      setProgress((prev) => ({
        ...prev,
        status: "error",
        percentage: 0,
      }));
    }
  }, []);

  useEffect(() => {
    initializeDatabase();
  }, [initializeDatabase]);

  return {
    db,
    dbError,
    isInitialized,
    progress: isInitialized
      ? { status: "ready" as const, loaded: 0, total: 0, percentage: 100 }
      : progress,
  };
};
