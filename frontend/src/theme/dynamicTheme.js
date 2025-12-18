import { createTheme } from "@mui/material/styles";

export const createDynamicTheme = (branding) => {
  const isDark = branding.darkMode || false;

  return createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
      primary: {
        main: branding.primaryColor || "#667eea",
      },
      secondary: {
        main: branding.secondaryColor || "#764ba2",
      },
      background: {
        default: isDark ? "#121212" : "#f5f5f5",
        paper: isDark ? "#1e1e1e" : "#ffffff",
      },
    },
    typography: {
      fontFamily:
        branding.fontFamily || '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? "#121212" : "#f5f5f5",
          },
        },
      },
    },
  });
};
