import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { useUserStore } from '../../Context/appStore';
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";

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

const Form = () => {
  const { state, dispatch } = useUserStore();
  
  // useEffect(() => {
  //   const currentUser = async () => {
  //     const config = {
  //       headers: {
  //         'x-auth-token': localStorage.token
  //       }
  //     }
  //     const res = await axios.get('/api/users/current', config);
  //     dispatch({ type: 'login', user: res.data.user});
  //   }
  //   currentUser();
  // }, [])

  const classes = useStyles();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    newPassword2: ""
  });

  const {
    firstName,
    lastName,
    username,
    email,
    oldPassword,
    newPassword,
    newPassword2
  } = formData;

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AccountCircle />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Update Account Informations
        </Typography>
        <form className={classes.form}>
          <Grid container spacing={2}>
            <Grid item sx={12} sm={6}>
              <TextField
                variant='standard'
                margin='normal'
                fullWidth
                id='first-name'
                label='First Name'
                name='firstName'
                value={firstName}
                onChange={e => handleChange(e)}
                autoFocus
              />
            </Grid>

            <Grid item sx={12} sm={6}>
              <TextField
                variant='standard'
                margin='normal'
                fullWidth
                id='last-name'
                label='Last Name'
                name='lastName'
                value={lastName}
                onChange={e => handleChange(e)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant='standard'
                margin='normal'
                fullWidth
                id='username'
                label='Username'
                name='username'
                autoComplete='username'
                value={username}
                onChange={e => handleChange(e)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant='standard'
                margin='normal'
                fullWidth
                id='email'
                label='Email'
                name='email'
                autoComplete='email'
                value={email}
                onChange={e => handleChange(e)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant='standard'
                margin='normal'
                fullWidth
                name='oldPassword'
                label='Old Password'
                type='password'
                id='oldpassword'
                value={oldPassword}
                onChange={e => handleChange(e)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant='standard'
                margin='normal'
                fullWidth
                name='newPassword'
                label='New Password'
                type='password'
                id='newpassword'
                value={newPassword}
                onChange={e => handleChange(e)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant='standard'
                margin='normal'
                fullWidth
                name='newPassword2'
                label='Confirm New Password'
                type='password'
                id='newpassword2'
                value={newPassword2}
                onChange={e => handleChange(e)}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type='submit'
                fullWidth
                variant='contained'
                color='primary'
                className={classes.submit}
              >
                Update
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

const Setting = () => {
  return (
    <div
      style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}
    >
      <Navbar />
      <div style={{ flex: 1 }}>
        <Form />
      </div>
      <Footer />
    </div>
  );
};

export default Setting;
