import { useState, useCallback, useEffect } from "react";
import { openDB } from "idb";
import { DatabaseContextType, DatabaseSchema } from "./types";

const DB_URL = import.meta.env.VITE_DB_URL;

/** Whether the browser supports native gzip decompression. */
const supportsDecompression = typeof DecompressionStream !== "undefined";

/**
 * Decompress a gzip ArrayBuffer using the native browser DecompressionStream API.
 * Supported in Chrome 80+, Firefox 113+, Safari 16.4+.
 */
async function decompressGzip(compressed: ArrayBuffer): Promise<ArrayBuffer> {
  const ds = new DecompressionStream("gzip");
  const writer = ds.writable.getWriter();
  writer.write(new Uint8Array(compressed));
  writer.close();
  return new Response(ds.readable).arrayBuffer();
}

/** Check if the buffer is a valid SQLite database by inspecting its magic header. */
function isSQLite(buffer: ArrayBuffer): boolean {
  if (buffer.byteLength < 15) return false;
  const arr = new Uint8Array(buffer, 0, 15);
  const chars = Array.from(arr).map((b) => String.fromCharCode(b));
  return chars.join("") === "SQLite format 3";
}

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

      if (dbData && !isSQLite(dbData)) {
        console.warn("Cached database is invalid or corrupt. Clearing cache and redownloading...");
        await idb.delete("database", "main");
        dbData = undefined;
      }

      if (!dbData) {
        // Pick compressed or uncompressed URL based on browser support
        const useCompressed = supportsDecompression;
        const downloadUrl = useCompressed ? `${DB_URL}.gz` : DB_URL;
        console.log(
          `Database not found in IndexedDB, downloading ${
            useCompressed ? "compressed" : "uncompressed"
          } database...`
        );

        setProgress((prev) => ({
          ...prev,
          status: "downloading",
          loaded: 0,
          total: 0,
          percentage: 0,
        }));

        // Use XHR so we can track download progress
        const downloadedBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("GET", downloadUrl, true);
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
              resolve(xhr.response as ArrayBuffer);
            } else {
              reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
            }
          };

          xhr.onerror = () => {
            reject(new Error("Network error while downloading database"));
          };

          xhr.send();
        });

        const isAlreadyDecompressed = isSQLite(downloadedBuffer);

        if (useCompressed && !isAlreadyDecompressed) {
          // Decompress gzip → raw SQLite bytes using the native browser API
          setProgress((prev) => ({
            ...prev,
            status: "processing",
            percentage: 100,
          }));
          dbData = await decompressGzip(downloadedBuffer);
        } else {
          dbData = downloadedBuffer;
        }

        if (!isSQLite(dbData)) {
          throw new Error("Downloaded data is not a valid SQLite database.");
        }

        // Store the decompressed SQLite file in IndexedDB for future visits
        await idb.put("database", dbData, "main");
      }

      if (!isSQLite(dbData)) {
        throw new Error("Cached database data is not a valid SQLite database.");
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
