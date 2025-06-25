import { useState, useCallback, useEffect } from 'react';
import { openDB } from 'idb';
import { DatabaseContextType, DatabaseSchema } from './types';

// Load SQL.js with proper error handling and fallbacks
const loadSQL = async () => {
  try {
    // Try ESM import first
    try {
      const sql = await import('sql.js');
      const initSqlJs = sql.default || sql;
      return await initSqlJs({
        locateFile: (file: string) => `/${file}`
      });
    } catch (e) {
      console.warn('ESM import failed, trying alternative import...', e);
      // Fallback to UMD/global approach
      const SQL = await import('sql.js/dist/sql-wasm.js');
      return await SQL.default({
        locateFile: (file: string) => `/${file}`
      });
    }
  } catch (error) {
    console.error('Failed to load SQL.js:', error);
    throw new Error('Failed to initialize SQL.js. Please check the console for details.');
  }
};

export const useDatabase = (): DatabaseContextType => {
  const [db, setDb] = useState<DatabaseContextType['db']>(null);
  const [dbError, setDbError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const initializeDatabase = useCallback(async () => {
    try {
      // Load SQL.js
      const SQL = await loadSQL();
      
      // Open or create IndexedDB
      const idb = await openDB<DatabaseSchema>('myAppDatabase', 1, {
        upgrade(database) {
          database.createObjectStore('database');
        },
      });

      // Try to get the database from IndexedDB
      let dbData = await idb.get('database', 'main');
      
      if (!dbData) {
        // If not in IndexedDB, fetch from file
        console.log('Database not found in IndexedDB, importing from file...');
        const response = await fetch('/inet.db');
        if (!response.ok) {
          throw new Error(`Failed to fetch database file: ${response.status}`);
        }
        dbData = await response.arrayBuffer();
        
        // Save to IndexedDB for future use
        await idb.put('database', dbData, 'main');
      }

      const newDb = new SQL.Database(new Uint8Array(dbData as ArrayBuffer));
      setDb(newDb);
      setIsInitialized(true);
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Unknown error initializing database');
      console.error("Error initializing database:", errorObj);
      setDbError(errorObj);
    }
  }, []);

  useEffect(() => {
    initializeDatabase();
  }, [initializeDatabase]);

  return { db, dbError, isInitialized };
};
