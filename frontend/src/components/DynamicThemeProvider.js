import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useBranding } from "../contexts/BrandingContext";
import { createDynamicTheme } from "../theme/dynamicTheme";

const DynamicThemeProvider = ({ children }) => {
  const { branding } = useBranding();
  const theme = createDynamicTheme(branding);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default DynamicThemeProvider;
