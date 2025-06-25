import { DatabaseContext } from "./DatabaseContext";
import { useDatabase } from "./useDatabase";

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const database = useDatabase();

  return (
    <DatabaseContext.Provider value={database}>
      {children}
    </DatabaseContext.Provider>
  );
};
