import { createTheme, ThemeOptions } from "@mui/material/styles";

// Common theme settings
const commonSettings: ThemeOptions = {
  typography: {
    fontFamily: '"IBM Plex Sans", sans-serif',
    button: {
      textTransform: "none" as "none",
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
};

// Light theme
export const lightTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: "light",
    primary: {
      main: "#0079D3", // Reddit blue
    },
    secondary: {
      main: "#FF4500", // Reddit orange
    },
    background: {
      default: "#DAE0E6", // Reddit light background
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1C1C1C",
      secondary: "#7C7C7C",
    },
    divider: "#EDEFF1",
  },
});

// Dark theme
export const darkTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: "dark",
    primary: {
      main: "#0079D3", // Reddit blue
    },
    secondary: {
      main: "#FF4500", // Reddit orange
    },
    background: {
      default: "#1A1A1B", // Reddit dark background
      paper: "#2D2D2E",
    },
    text: {
      primary: "#D7DADC",
      secondary: "#818384",
    },
    divider: "#343536",
  },
});
