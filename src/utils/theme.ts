import { createTheme, Theme } from "@mui/material/styles";

export const CustomTheme: Theme = createTheme({
  palette: {
    primary: {
      main: "#2E3B55",
      contrastText: "#FFFFFF",
      dark: "#1D273A",
    },
    secondary: {
      main: "#FFB347   ",
      light: "#87CEFA",
      contrastText: "#000000",
      dark: "#C77C02",
    },
    text: {
      primary: "#333333",
      secondary: "#D3D3D3",
    },
    background: {
      default: "#F7F7F7", // a light gray shade for the background
    },
    action: {
      hover: "#E0E0E0",
    },
    divider: "#E0E0E0",
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    h3: {
      fontSize: "2rem",
      fontWeight: 700,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 700,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 700,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // disable uppercase text on buttons
          fontWeight: 500, // set a slightly heavier font weight on buttons
        },
        containedPrimary: {
          backgroundColor: "#2E3B55", // set a deeper blue background color for primary buttons
          "&:hover": {
            backgroundColor: "#47556C", // darken the primary button background on hover
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          backgroundColor: "#2E3B55", // set a deeper blue background color for primary buttons
          "&:hover": {
            backgroundColor: "#D3D3D3",
            color: "#2E3B55",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF", // set a white background color for text fields
          borderRadius: "4px", // add a slight border radius to text fields
        },
      },
    },
  },
});
