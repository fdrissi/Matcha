import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { useUserStore } from "../../Context/appStore";
import Alert from "../inc/Alert";
import { recover } from "../../actions/userAction";
import { REMOVE_ALERT } from "../../actions/actionTypes";

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },

  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)"
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",

    "&:hover": {
      backgroundColor: "transparent",
      border: "1px solid #e74c3c"
    }
  }
}));

function Editpass() {
  const classes = useStyles();

  const [MyForm, setMyFormData] = useState({
    password: "",
    confirm
  });

  const [state, dispatch] = useUserStore();

  const submitForm = async form => {
    form.preventDefault();
    //recover(MyForm.data, dispatch);
  };
  const handleInputChange = event => {
    event.persist();
    setMyFormData(MyForm => ({
      ...MyForm,
      data: event.target.value.trim()
    }));
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {state.alert.msg && (
          <Alert message={state.alert.msg} type={state.alert.alertType} />
        )}
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5">Password Reset</Typography>
        <Box textAlign="center" m={2}>
          Enter your Matcha username, or the email address that you used to
          register. We'll send you an email with your username and a link to
          reset your password.
        </Box>

        <form className={classes.form} onSubmit={form => submitForm(form)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                className={classes.input}
                variant="outlined"
                required
                fullWidth
                label="Email address or username"
                name="text"
                type="text"
                onChange={handleInputChange}
                autoFocus
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            SEND
          </Button>
        </form>
      </div>
    </Container>
  );
}
const passedit = () => {
  return (
    <div style={{ flex: 1 }}>
      <Editpass />
    </div>
  );
};

export default passedit;
