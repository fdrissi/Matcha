import React, { useState, useEffect, useCallback } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useUserStore } from "../../Context/appStore";
import Alert from "../inc/Alert";
import { passwordEdit, checktoken } from "../../actions/userAction";
import { REMOVE_ALERT, REMOVE_ERRORS } from "../../actions/actionTypes";
import { FormHelperText } from "@material-ui/core";
import { Redirect } from "react-router-dom";

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
  },
  helperText: {
    color: "#F32013",
    fontWeight: "fontWeightBold"
  }
}));

const Editpass = params => {
  const classes = useStyles();
  const [MyForm, setMyFormData] = useState({
    password: "",
    confirmPassword: ""
  });

  const [state, dispatch] = useUserStore();
  const stableDispatch = useCallback(dispatch, []);

  const { is_loading, token_valide, token_valide_message } = state.token;

  const submitForm = async form => {
    form.preventDefault();
    let token = params.params.token;

    await passwordEdit(
      MyForm.password,
      MyForm.confirmPassword,
      token,
      dispatch
    );
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
    checktoken(token, stableDispatch);
  }, [params.params.token, stableDispatch]);
  useEffect(() => {
    return () => {
      if (state.alert.msg === "Error") {
        stableDispatch({
          type: REMOVE_ALERT
        });
      }
    };
  }, [state.alert.msg, stableDispatch]);

  if (is_loading) {
    return null;
  } else {
    if (!token_valide || token_valide_message === "done") {
      return <Redirect to="/login" />;
    } else
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
