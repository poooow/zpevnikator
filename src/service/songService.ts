import { Database } from "sql.js";
import type { Song } from "../types/song";

export function getSong(songId: string, db: Database): Song | null {
  try {
    const results = db.exec(
      "SELECT rowid as id, groupname as groupName, title, text FROM zpevnikator WHERE rowid = ?",
      [songId]
    );

    if (results.length === 0 || !results[0]?.values?.[0]) {
      return null;
    }

    const [id, groupName, title, text] = results[0].values[0] as [
      number,
      string,
      string,
      string
    ];

    return {
      id,
      groupName,
      title,
      text,
    };
  } catch (error) {
    console.error("Error fetching song details:", error);
    throw error;
  }
}

export function getLikedSongs(liked: number[], db: Database): Song[] | null {
  if (!liked.length) return [];

  try {
    const results = db.exec(
      "SELECT rowid as id, groupname as groupName, title, text FROM zpevnikator WHERE rowid IN (" +
        liked.join(",") +
        ")"
    );

    if (results.length === 0 || !results[0]?.values) return [];

    // Transform the SQL results into Song[]
    return results[0].values.map((row) => {
      const [id, groupName, title, text] = row as [
        number, // id
        string, // groupName
        string, // title
        string // text
      ];
      return {
        id,
        groupName,
        title,
        text,
      };
    });
  } catch (error) {
    console.error("Error fetching liked songs:", error);
    throw error;
  }
}

export function searchSongs(query: string, db: Database): Song[] | null {
  if (!query) return null;

  const queryWithWildcard = query + '*';

  const results = db.exec(
    `SELECT rowid as id, 
       groupname as groupName, 
      title, 
      text, 
      snippet(zpevnikator, "<b>", "</b>","...", 4, 10) as snippet 
    FROM zpevnikator
    WHERE title MATCH ? OR groupname MATCH ? OR zpevnikator MATCH ?
    LIMIT 42`,
    [queryWithWildcard, queryWithWildcard, queryWithWildcard]
  );

  if (results.length === 0 || !results[0]?.values) return [];

  // Transform the SQL results into Song[]
  return results[0].values.map((row) => {
    const [id, groupName, title, text, snippet] = row as [
      number, // id
      string, // groupName
      string, // title
      string, // text
      string // snippet
    ];
    return {
      id,
      groupName,
      title,
      text,
      snippet,
    };
  });
}
