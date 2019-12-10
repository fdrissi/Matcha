import React from "react";
import { Typography, Container, CssBaseline, Grid } from "@material-ui/core/";
import ErrorIcon from "@material-ui/icons/Error";

const Notfound = () => {
  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={12}>
          <Typography variant="h1" component="h2" align="center">
            <ErrorIcon style={{ fontSize: "100px", verticalAlign: "middle" }} />
            Page not found!
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};
export default Notfound;
