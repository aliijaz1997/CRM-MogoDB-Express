import React from "react";
import { Typography, Container, Grid, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

// Custom styles using Material-UI's styled function
const Section = styled("section")(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
}));

const Image = styled("img")(({ theme }) => ({
  width: "100%",
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const AboutPage = () => {
  return (
    <Section>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Image
              src="https://media.istockphoto.com/id/486916254/photo/web-design-concept.jpg?s=612x612&w=0&k=20&c=M899cMPf8EQwp_B2WjbeiEmPytGc2KmpGIgUhtWj6FA="
              alt="About Image"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h4" gutterBottom>
                About Us
              </Typography>
              <Typography variant="body1" paragraph>
                Add your text content here describing your company or yourself.
              </Typography>
              <Typography variant="body1" paragraph>
                You can customize the styles and content according to your
                requirements.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Section>
  );
};

export default AboutPage;
