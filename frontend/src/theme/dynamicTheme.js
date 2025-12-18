import { createTheme } from "@mui/material/styles";

export const createDynamicTheme = (branding) => {
  return createTheme({
    palette: {
      primary: {
        main: branding.primaryColor || "#667eea",
      },
      secondary: {
        main: branding.secondaryColor || "#764ba2",
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
            backgroundColor: "#f5f5f5",
          },
        },
      },
    },
  });
};
