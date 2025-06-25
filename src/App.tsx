import PWABadge from "./PWABadge.tsx";
import AppRoutes from "./routes/AppRoutes";
import { DatabaseProvider } from "./context/DatabaseContextProvider";
import { AppSettingsProvider } from "./context/AppSettingsContextProvider";
import { ThemeProvider } from "./context/ThemeContext.tsx";

function App() {
  return (
    <ThemeProvider>
      <DatabaseProvider>
        <AppSettingsProvider>
          <AppRoutes />
          <PWABadge />
        </AppSettingsProvider>
      </DatabaseProvider>
    </ThemeProvider>
  );
}

export default App;
