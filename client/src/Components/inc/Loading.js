import React from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress
} from "@material-ui/core";

export const Loading = ({ page }) => {
  return (
    <Card style={{ backgroundColor: "transparent" }}>
      <CardContent>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid xs={12} container item justify="center">
            <Typography variant="subtitle1" gutterBottom>
              {page}
            </Typography>
          </Grid>
          <Grid xs={12} container item justify="center">
            <Typography variant="overline" id="range-slider" gutterBottom>
              Loading
            </Typography>
          </Grid>
          <Grid xs={12} container item justify="center">
            <CircularProgress disableShrink style={{ color: "#e74c3c" }} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
