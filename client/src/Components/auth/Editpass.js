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
import { passwordEdit, checktoken } from "../../actions/userAction";
import { REMOVE_ALERT } from "../../actions/actionTypes";
import { FormHelperText } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Redirect } from "react-router-dom";

import { stat } from "fs";

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
  progress: {
    margin: theme.spacing(2)
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

const Editpass = params => {
  const classes = useStyles();
  const [MyForm, setMyFormData] = useState({
    password: "",
    confirmPassword: ""
  });

  const [state, dispatch] = useUserStore();

  const submitForm = async form => {
    form.preventDefault();
    let token = params.params.token;

    passwordEdit(MyForm.password, MyForm.confirmPassword, token, dispatch);
  };
  const handleInputChange = event => {
    event.persist();
    setMyFormData(MyForm => ({
      ...MyForm,
      [event.target.name]: event.target.value.trim()
    }));
  };
  useEffect(() => {
    let token = params.params.token;
    checktoken(token, dispatch);
  }, []);
  const { is_loading, token_valide } = state.token;
  if (is_loading) {
    return null;
  } else {
    if (!token_valide) return <Redirect to="/register" />;
    else console.log(state);
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
          <Typography variant="h5">Change your password</Typography>

          <form className={classes.form} onSubmit={form => submitForm(form)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  error={
                    state.register.errors.password.length > 0 ? true : false
                  }
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  onChange={handleInputChange}
                />
                {state.register.errors.password.length > 0 && (
                  <FormHelperText className={classes.helperText}>
                    <sup>*</sup> {state.data.errors.password}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={
                    state.register.errors.confirmPassword.length > 0
                      ? true
                      : false
                  }
                  variant="outlined"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm  Password"
                  autoComplete="new-password"
                  type="password"
                  onChange={handleInputChange}
                />
                {state.register.errors.confirmPassword.length > 0 && (
                  <FormHelperText className={classes.helperText}>
                    <sup>*</sup> {state.register.errors.confirmPassword}
                  </FormHelperText>
                )}
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
};
const passedit = props => {
  return (
    <div style={{ flex: 1 }}>
      <Editpass params={props.match.params} />
    </div>
  );
};

export default passedit;
