import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "../../Context/appStore";
import { login } from "../../actions/users";
import { REMOVE_ALERT } from "../../actions/actionTypes";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Alert from "../layouts/Alert";

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
    backgroundColor: "#e74c3c"
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: "#e74c3c",
    "&:hover": {
      backgroundColor: "transparent",
      color: "#e74c3c",
      border: "1px solid #e74c3c"
    }
  }
}));

function SignIn() {
  const classes = useStyles();

  const [state, dispatch] = useUserStore();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const { email, password } = formData;

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });

  const submitForm = async form => {
    form.preventDefault();

    login(email, password, dispatch);
  };

  useEffect(() => {
    dispatch({ type: REMOVE_ALERT });
  }, [email, password]);

  // useEffect(() => {
  //   console.log(state.auth.user.isAuthenticated);
  // }, [state.auth.user.isAuthenticated]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {state.alert.payload && (
          <Alert
            message={state.alert.payload.msg}
            type={state.alert.payload.type}
          />
        )}
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={form => submitForm(form)}>
          <TextField
            variant="standard"
            margin="normal"
            fullWidth
            id="email"
            label="Email Address or Username"
            name="email"
            autoComplete="email"
            value={email}
            onChange={e => handleChange(e)}
            autoFocus
          />

          <TextField
            variant="standard"
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={e => handleChange(e)}
            autoComplete="current-password"
          />

          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/recovery">Forgot password?</Link>
            </Grid>
            <Grid item>
              <Link to="/register">{"Don't have an account? Sign Up"}</Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

const Login = () => {
  return (
    <div
      style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}
    >
      <Navbar />
      <div style={{ flex: 1 }}>
        <SignIn />
      </div>
      <Footer />
    </div>
  );
};

export default Login;
