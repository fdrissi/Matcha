import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import { Redirect } from "react-router-dom";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useUserStore } from "../../Context/appStore";
import { register } from "../../actions/authAction";
import { FormHelperText } from "@material-ui/core";
import Alert from "../layouts/Alert";
import { REMOVE_ALERT, REMOVE_ERRORS } from "../../actions/actionTypes";
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
  },
  helperText: {
    color: "#F32013",
    fontWeight: "fontWeightBold"
  }
}));

function SignUp() {
  const classes = useStyles();

  const [MyForm, setMyFormData] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [toLogin, setToHome] = useState(false);
  const [state, dispatch] = useUserStore();

  const submitForm = async form => {
    form.preventDefault();
    register(MyForm, dispatch);
  };

  const handleInputChange = event => {
    event.persist();

    setMyFormData(MyForm => ({
      ...MyForm,
      [event.target.name]: event.target.value.trim()
    }));
  };
  useEffect(() => {
    return () => {
      const payload = {};
      dispatch({
        type: REMOVE_ERRORS,
        payload
      });
      dispatch({
        type: REMOVE_ALERT
      });
    };
  }, []);
  if (state.register.register_success === "ok") {
    let time = setTimeout(() => test(time), 5000);
    const payload = {};
    dispatch({
      type: REMOVE_ERRORS,
      payload
    });
  }
  const test = timer => {
    setToHome(true);
    clearTimeout(timer);
  };
  return (
    <>
      {toLogin ? (
        <Redirect to="/login" />
      ) : (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            {state.alert.msg && (
              <Alert message={state.alert.msg} type={state.alert.alertType} />
            )}
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <form className={classes.form} onSubmit={form => submitForm(form)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    error={
                      state.register.errors.userName.length > 0 ? true : false
                    }
                    className={classes.input}
                    variant="outlined"
                    required
                    fullWidth
                    label="Usear Name"
                    name="userName"
                    onChange={handleInputChange}
                    autoFocus
                  />
                  {state.register.errors.userName.length > 0 && (
                    <FormHelperText className={classes.helperText}>
                      <sup>*</sup> {state.register.errors.userName}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    error={
                      state.register.errors.firstName.length > 0 ? true : false
                    }
                    name="firstName"
                    variant="outlined"
                    required
                    fullWidth
                    onChange={handleInputChange}
                    label="First Name"
                  />
                  {state.register.errors.firstName.length > 0 && (
                    <FormHelperText className={classes.helperText}>
                      <sup>*</sup>
                      {state.register.errors.firstName}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    error={
                      state.register.errors.lastName.length > 0 ? true : false
                    }
                    variant="outlined"
                    required
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    autoComplete="lname"
                    onChange={handleInputChange}
                  />
                  {state.register.errors.lastName.length > 0 && (
                    <FormHelperText className={classes.helperText}>
                      <sup>*</sup> {state.register.errors.lastName}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={
                      state.register.errors.email.length > 0 ? true : false
                    }
                    variant="outlined"
                    required
                    fullWidth
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={handleInputChange}
                  />
                  {state.register.errors.email.length > 0 && (
                    <FormHelperText className={classes.helperText}>
                      <sup>*</sup> {state.register.errors.email}
                    </FormHelperText>
                  )}
                </Grid>
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
                      <sup>*</sup> {state.register.errors.password}
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
                Sign Up
              </Button>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link to="/login">Already have an account? Sign in</Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>
      )}
    </>
  );
}
const Register = () => {
  return (
    <div style={{ flex: 1 }}>
      <SignUp />
    </div>
  );
};

export default Register;
