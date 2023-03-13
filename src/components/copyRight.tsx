import { Link, Typography } from "@mui/material";

export default function Copyright(props: any) {
  return (
    <Typography variant="body2" align="center" {...props}>
      {"Copyright © "}
      <Link color="primary" href="https://mui.com/">
        CRM management
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
