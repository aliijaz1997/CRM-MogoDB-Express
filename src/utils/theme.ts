import { createTheme } from "@mui/material/styles";
import { red, blueGrey, purple } from "@mui/material/colors";

export const CustomTheme = createTheme({
  palette: {
    primary: {
      main: purple[800],
    },
    secondary: {
      main: red[700],
    },
  },
});
