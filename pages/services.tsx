import React from "react";
import { Typography, Container, Grid, Card, CardContent } from "@mui/material";
import { styled } from "@mui/material/styles";

// Custom styles using Material-UI's styled function
const Section = styled("section")(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
}));

const Services = () => {
  return (
    <Section>
      <Container maxWidth="lg">
        <Typography variant="h2" align="center" gutterBottom>
          CRM Services
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Service 1
                </Typography>
                <Typography variant="body1" paragraph>
                  Description of service 1.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Service 2
                </Typography>
                <Typography variant="body1" paragraph>
                  Description of service 2.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Service 3
                </Typography>
                <Typography variant="body1" paragraph>
                  Description of service 3.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Section>
  );
};

export default Services;
