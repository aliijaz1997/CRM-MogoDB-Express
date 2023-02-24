import { createTheme } from "@mui/material/styles";
import { red, grey } from "@mui/material/colors";

export const CustomTheme = createTheme({
  palette: {
    primary: {
      main: grey[500],
    },
    secondary: {
      main: red[500],
    },
  },
});
