import React, { useState, useEffect, useCallback } from "react";
import { useUserStore } from "../../Context/appStore";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Draggable from "react-draggable";
import Paper from "@material-ui/core/Paper";
import { updateUser, loadUser } from "../../actions/userAction";
import Alert from "../inc/Alert";
import {
  REMOVE_ERRORS,
  REMOVE_ALERT,
  REMOVE_SPECIFIC_ERROR
} from "../../actions/actionTypes";

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
  const [{ auth, alert, operations }, dispatch] = useUserStore();
  const stableDispatch = useCallback(dispatch, []);
  const classes = useStyles();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    open: false
  });

  const {
    firstName,
    lastName,
    userName,
    email,
    oldPassword,
    newPassword,
    confirmPassword,
    open
  } = formData;

  const handleOpen = () => setFormData({ ...formData, open: true });

  const handleClose = () => setFormData({ ...formData, open: false });

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    dispatch({
      type: REMOVE_SPECIFIC_ERROR,
      payload: {
        name: e.target.name
      }
    });
    dispatch({
      type: REMOVE_ALERT
    });
  };

  const handleSubmit = form => {
    form.preventDefault();
    if (oldPassword) {
      updateUser(formData, dispatch);
    }
  };

  useEffect(() => {
    if (!firstName && !lastName && !userName && !email) {
      setFormData(formData => ({
        ...formData,
        firstName: auth.userInfo.first_name || "",
        lastName: auth.userInfo.last_name || "",
        userName: auth.userInfo.username || "",
        email: auth.userInfo.email || ""
      }));
    }
  }, [auth, email, userName, lastName, firstName]);

  useEffect(() => {
    setFormData(formData => ({
      ...formData,
      newPassword: "",
      confirmPassword: "",
      oldPassword: ""
    }));
    loadUser(stableDispatch);
  }, [alert.msg, stableDispatch]);

  useEffect(() => {
    return () => {
      stableDispatch({
        type: REMOVE_ALERT
      });
      stableDispatch({
        type: REMOVE_ERRORS
      });
    };
  }, [stableDispatch]);

  if (auth.loading) return null;
  return auth.loading ? null : (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {alert.msg && <Alert message={alert.msg} type={alert.alertType} />}
        <Avatar className={classes.avatar}>
          <AccountCircle />
        </Avatar>
        <Typography component="h1" variant="h5">
          Update Account Informations
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              error={operations.errors.firstName ? true : false}
              helperText={operations.errors.firstName}
              variant="standard"
              margin="normal"
              fullWidth
              id="first-name"
              label="First Name"
              name="firstName"
              value={!firstName ? auth.userInfo.first_name || "" : firstName}
              onChange={e => onChange(e)}
              autoFocus
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              error={operations.errors.lastName ? true : false}
              helperText={operations.errors.lastName}
              variant="standard"
              margin="normal"
              fullWidth
              id="last-name"
              label="Last Name"
              name="lastName"
              value={!lastName ? auth.userInfo.last_name || "" : lastName}
              onChange={e => onChange(e)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              error={operations.errors.userName ? true : false}
              helperText={operations.errors.userName}
              variant="standard"
              margin="normal"
              fullWidth
              id="username"
              label="Username"
              name="userName"
              autoComplete="username"
              value={!userName ? auth.userInfo.userName || "" : userName}
              onChange={e => onChange(e)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              error={operations.errors.email ? true : false}
              helperText={operations.errors.email}
              variant="standard"
              margin="normal"
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={!email ? auth.userInfo.email || "" : email}
              onChange={e => onChange(e)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              error={operations.errors.newPassword ? true : false}
              helperText={operations.errors.newPassword}
              variant="standard"
              margin="normal"
              fullWidth
              name="newPassword"
              label="New Password"
              type="password"
              id="newpassword"
              value={newPassword}
              onChange={e => onChange(e)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              error={operations.errors.confirmPassword ? true : false}
              helperText={operations.errors.confirmPassword}
              variant="standard"
              margin="normal"
              fullWidth
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={e => onChange(e)}
            />
          </Grid>

          <Dialog
            open={open}
            onClose={handleClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
          >
            <form
              className={classes.form}
              onSubmit={form => handleSubmit(form)}
            >
              <DialogContent>
                <Grid item xs={12} id="draggable-dialog-title">
                  <TextField
                    autoFocus
                    variant="standard"
                    margin="normal"
                    fullWidth
                    name="oldPassword"
                    label="Password"
                    type="password"
                    id="oldPassword"
                    value={oldPassword}
                    onChange={e => onChange(e)}
                  />
                </Grid>
              </DialogContent>
              <DialogActions>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={handleClose}
                  >
                    Update
                  </Button>
                </Grid>
              </DialogActions>
            </form>
          </Dialog>

          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleOpen}
            >
              Confirm
            </Button>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

function PaperComponent(props) {
  return (
    <Draggable cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

const Setting = () => {
  return (
    <div style={{ flex: 1 }}>
      <Form />
    </div>
  );
};

export default Setting;
