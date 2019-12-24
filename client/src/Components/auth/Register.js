import React, { useState, useEffect, useCallback } from "react";
import Avatar from "@material-ui/core/Avatar";
import { Redirect } from "react-router-dom";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useUserStore } from "../../Context/appStore";
import { register } from "../../actions/userAction";
import { FormHelperText } from "@material-ui/core";
import Alert from "../inc/Alert";
import {
  REMOVE_ALERT,
  REMOVE_ERRORS,
  REMOVE_SPECIFIC_ERROR
} from "../../actions/actionTypes";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

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
  const [toLogin, setToHome] = useState(false);
  const [{ auth, alert, operations }, dispatch] = useUserStore();
  const stableDispatch = useCallback(dispatch, []);

  const classes = useStyles();

  const [MyForm, setMyFormData] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfPassword: false
  });

  const submitForm = async form => {
    form.preventDefault();
    register(MyForm, dispatch);
  };
  const handleClickShowPassword = () => {
    setMyFormData({ ...MyForm, showPassword: !MyForm.showPassword });
  };
  const handleClickShowConfPassword = () => {
    setMyFormData({ ...MyForm, showConfPassword: !MyForm.showConfPassword });
  };
  const handleMouseDownPassword = event => {
    event.preventDefault();
  };
  const handleInputChange = event => {
    event.persist();
    dispatch({
      type: REMOVE_SPECIFIC_ERROR,
      payload: {
        name: event.target.name
      }
    });
    setMyFormData(MyForm => ({
      ...MyForm,
      [event.target.name]: event.target.value.trim()
    }));
  };
  const handlePasswordChange = event => {
    event.persist();
    dispatch({
      type: REMOVE_SPECIFIC_ERROR,
      payload: {
        name: event.target.name
      }
    });
    setMyFormData(MyForm => ({
      ...MyForm,
      [event.target.name]: event.target.value
    }));
  };
  useEffect(() => {
    return () => {
      stableDispatch({
        type: REMOVE_ERRORS
      });
      stableDispatch({
        type: REMOVE_ALERT
      });
    };
  }, [stableDispatch]);
  if (operations.success) {
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
  const { firstName, lastName, userName, email } = MyForm;
  if (auth.loading) return null;
  if (auth.isAuthenticated && !auth.loading) return <Redirect to="/profile" />;
  return (
    <>
      {toLogin ? (
        <Redirect to="/login" />
      ) : (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            {alert.msg && <Alert message={alert.msg} type={alert.alertType} />}
            <Avatar className={classes.avatar}>
              <AccountCircle />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <form className={classes.form} onSubmit={form => submitForm(form)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    error={operations.errors.userName ? true : false}
                    className={classes.input}
                    variant="outlined"
                    required
                    fullWidth
                    label="Usear Name"
                    name="userName"
                    onChange={handleInputChange}
                    value={userName}
                    autoFocus
                    inputProps={{ maxLength: 15 }}
                  />
                  {operations.errors.userName && (
                    <FormHelperText className={classes.helperText}>
                      <sup>*</sup> {operations.errors.userName}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    error={operations.errors.firstName ? true : false}
                    name="firstName"
                    variant="outlined"
                    required
                    fullWidth
                    onChange={handleInputChange}
                    value={firstName}
                    label="First Name"
                    inputProps={{ maxLength: 20 }}
                  />
                  {operations.errors.firstName && (
                    <FormHelperText className={classes.helperText}>
                      <sup>*</sup>
                      {operations.errors.firstName}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    error={operations.errors.lastName ? true : false}
                    variant="outlined"
                    required
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    autoComplete="lname"
                    onChange={handleInputChange}
                    value={lastName}
                    inputProps={{ maxLength: 20 }}
                  />
                  {operations.errors.lastName && (
                    <FormHelperText className={classes.helperText}>
                      <sup>*</sup> {operations.errors.lastName}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={operations.errors.email ? true : false}
                    variant="outlined"
                    required
                    fullWidth
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={handleInputChange}
                    value={email}
                    inputProps={{ maxLength: 100 }}
                  />
                  {operations.errors.email && (
                    <FormHelperText className={classes.helperText}>
                      <sup>*</sup> {operations.errors.email}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={operations.errors.password ? true : false}
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={MyForm.showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    onChange={handlePasswordChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {MyForm.showPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  {operations.errors.password && (
                    <FormHelperText className={classes.helperText}>
                      <sup>*</sup> {operations.errors.password}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={operations.errors.confirmPassword ? true : false}
                    variant="outlined"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm  Password"
                    autoComplete="new-password"
                    type={MyForm.showConfPassword ? "text" : "password"}
                    onChange={handlePasswordChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {MyForm.showConfPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  {operations.errors.confirmPassword && (
                    <FormHelperText className={classes.helperText}>
                      <sup>*</sup> {operations.errors.confirmPassword}
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
              <Grid container justify="center">
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
