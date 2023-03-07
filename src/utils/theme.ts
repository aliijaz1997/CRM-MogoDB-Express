import { createTheme } from "@mui/material/styles";
import { red, blueGrey } from "@mui/material/colors";

export const CustomTheme = createTheme({
  palette: {
    primary: {
      main: blueGrey[800],
    },
    secondary: {
      main: red[500],
    },
  },
});
