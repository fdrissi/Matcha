import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useUserStore } from "../../Context/appStore";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import { register } from "../../actions/authAction";
import Alert from "../layouts/Alert";
import { createMuiTheme } from "@material-ui/core/styles";
import { promises } from "fs";

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  helperText: {
    color: "red"
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
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: "transparent",
    backgroundColor: "#e74c3c",
    "&:hover": {
      backgroundColor: "transparent",
      color: "#e74c3c",
      border: "1px solid #e74c3c"
    }
  },
  input: {
    "&:onFocus": {
      backgroundColor: "#32a852",
      color: "#32a852"
    },
    MuiFormHelperText: {
      color: "#e74c3c"
    }
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
    confirmPassword: "",
    errors: {}
  });

  const [MyErrors, setErrors] = useState({});

  const [state, dispatch] = useUserStore();

  const submitForm = async form => {
    setMyFormData({
      errors: {}
    });
    form.preventDefault();
    const [errors] = await register(MyForm);
    setMyFormData({
      errors
    });
    console.log(MyForm);
    //register(MyForm, dispatch).then(() => {}, ({ res }) => console.log("res"));
  };

  const handleInputChange = event => {
    event.persist();
    setMyFormData(MyForm => ({
      ...MyForm,
      [event.target.name]: event.target.value.trim()
    }));
  };
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
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={form => submitForm(form)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                errorText={false}
                className={classes.input}
                variant="outlined"
                required
                fullWidth
                label="Usear Name"
                name="userName"
                onChange={handleInputChange}
                autoFocus
              />
              <FormHelperText className={classes.helperText}>
                USER NAME MUST BE BETWEEN 3 AND 10 CHARACTERS
              </FormHelperText>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                variant="outlined"
                required
                fullWidth
                onChange={handleInputChange}
                label="First Name"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm  Password"
                type="password"
                onChange={handleInputChange}
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
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
const Register = () => {
  return (
    <div
      style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}
    >
      <Navbar />
      <div style={{ flex: 1 }}>
        <SignUp />
      </div>
      <Footer />
    </div>
  );
};

export default Register;
