import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#667eea", // Modern blue
      light: "#9fa8da",
      dark: "#303f9f",
    },
    secondary: {
      main: "#764ba2", // Purple
      light: "#ba68c8",
      dark: "#4a148c",
    },
    background: {
      default: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      paper: "rgba(255, 255, 255, 0.95)",
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
    },
    success: {
      main: "#4caf50",
    },
    error: {
      main: "#f44336",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
      fontWeight: 500,
    },
    h2: {
      fontSize: "clamp(1.25rem, 4vw, 2rem)",
      fontWeight: 500,
    },
    h3: {
      fontSize: "clamp(1.125rem, 3vw, 1.75rem)",
      fontWeight: 500,
    },
    h4: {
      fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
      fontWeight: 500,
    },
    h5: {
      fontSize: "clamp(0.875rem, 2vw, 1.25rem)",
      fontWeight: 500,
    },
    h6: {
      fontSize: "clamp(0.75rem, 1.5vw, 1rem)",
      fontWeight: 500,
    },
    body1: {
      fontSize: "clamp(0.875rem, 2vw, 1rem)",
    },
    body2: {
      fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)",
    },
    button: {
      fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)",
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          transition: "box-shadow 0.3s ease-in-out",
          "&:hover": {
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
          padding: "8px 16px",
          minHeight: 40,
          "@media (max-width: 600px)": {
            padding: "10px 20px",
            minHeight: 44, // Better touch target for mobile
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            "& fieldset": {
              borderColor: "#e0e0e0",
            },
            "&:hover fieldset": {
              borderColor: "#1976d2",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1976d2",
            },
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 16,
          paddingRight: 16,
          "@media (min-width: 600px)": {
            paddingLeft: 24,
            paddingRight: 24,
          },
          "@media (min-width: 960px)": {
            paddingLeft: 32,
            paddingRight: 32,
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          width: 280,
          "@media (max-width: 600px)": {
            width: "80vw",
            maxWidth: 300,
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default theme;
