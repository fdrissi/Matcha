import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { useUserStore } from "../../Context/appStore";
import Alert from "../inc/Alert";
import { recover } from "../../actions/userAction";
import { positions } from "@material-ui/system";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/dist/style.css";
import Divider from "@material-ui/core/Divider";
import { IconButton } from "@material-ui/core";

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
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  IconButton: {
    margin: theme.spacing.unit
  },
  inputImage: {
    display: "none"
  }
}));

function Edit_Profile() {
  const classes = useStyles();

  const [MyForm, setMyFormData] = useState({
    files: []
  });
  const months = [
    {
      value: "1",
      label: "January"
    },
    {
      value: "2",
      label: "February"
    },
    {
      value: "3",
      label: "March"
    },
    {
      value: "4",
      label: "April"
    },
    {
      value: "5",
      label: "May"
    },
    {
      value: "6",
      label: "June"
    },
    {
      value: "7",
      label: "July"
    },
    {
      value: "8",
      label: "August"
    },
    {
      value: "9",
      label: "September"
    },
    {
      value: "10",
      label: "October"
    },
    {
      value: "11",
      label: "November"
    },
    {
      value: "12",
      label: "December"
    }
  ];
  const [values, setValues] = React.useState({
    name: "Cat in the Hat",
    age: "",
    multiline: "Controlled",
    currency: "EUR"
  });

  const [state, dispatch] = useUserStore();

  const submitForm = async form => {
    form.preventDefault();
    //recover(MyForm.data, dispatch);
  };

  const [value, setValue] = React.useState("female");

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };
  const handleOnChange = value => {
    this.setState({ phone: value });
  };
  const handleInputChange = event => {
    event.persist();
    setMyFormData(MyForm => ({
      ...MyForm,
      data: event.target.value.trim()
    }));
  };
  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <div className={classes.paper}>
        {state.alert.msg && (
          <Alert message={state.alert.msg} type={state.alert.alertType} />
        )}
        <Avatar className={classes.avatar}>
          <AccountCircle />
        </Avatar>
        <Typography variant="h5">Edit Profile</Typography>
        <Box textAlign="center">
          Tempor ad excepteur irure officia in labore velit.
        </Box>
        <input
          accept="image/*"
          className={classes.inputImage}
          id="contained-button-file"
          multiple
          type="file"
        />
        <label htmlFor="contained-button-file">
          <IconButton>
            <Avatar
              src="https://d2x5ku95bkycr3.cloudfront.net/App_Themes/Common/images/profile/0_200.png"
              style={{
                margin: "10px",
                width: "200px",
                height: "200px"
              }}
            />
          </IconButton>
        </label>
        <Divider className={classes.divider} />
        <Divider className={classes.divider} />
        <Grid container item xs={12} direction="row" justify="space-between">
          <Grid item xs={4}>
            <TextField
              className={classes.input}
              variant="outlined"
              disabled
              label="Usear Name"
              name="userName"
              fullWidth
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              error={state.register.errors.firstName.length > 0 ? true : false}
              name="firstName"
              variant="outlined"
              disabled
              fullWidth
              onChange={handleInputChange}
              label="First Name"
            />
          </Grid>
        </Grid>
        {/* next gride  */}
        <form
          className={classes.form}
          onSubmit={form => submitForm(form)}
          border={1}
        >
          <Divider className={classes.divider} />
          <Grid xs={12} container justify="center">
            <Typography variant="subtitle1" gutterBottom>
              Your Gender:
            </Typography>
          </Grid>
          <Grid item xs={12} container justify="center">
            <FormControl component="fieldset" className={classes.formControl}>
              <RadioGroup
                row
                aria-label="gender"
                name="gender1"
                value={value}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="👩Female"
                />
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="👨Male"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          {/*next Gride*/}
          <Divider className={classes.divider} />
          <Grid xs={12} container justify="center">
            <Typography variant="subtitle1" gutterBottom>
              Birthday
            </Typography>
          </Grid>
          <Grid item xs={12} container direction="row" justify="space-between">
            <Grid item xs={2}>
              <TextField
                error={
                  state.register.errors.firstName.length > 0 ? true : false
                }
                name="day"
                variant="outlined"
                fullWidth
                onChange={handleInputChange}
                label="Day"
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                className={classes.input}
                select
                variant="outlined"
                label="Month"
                value={values.currency}
                name="userName"
                fullWidth
                onChange={handleChange("currency")}
                SelectProps={{
                  native: true,
                  MenuProps: {
                    className: classes.menu
                  }
                }}
              >
                {months.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={5}>
              <TextField
                error={
                  state.register.errors.firstName.length > 0 ? true : false
                }
                name="firstName"
                variant="outlined"
                fullWidth
                onChange={handleInputChange}
                label="YYYY"
              />
            </Grid>
          </Grid>
          <Divider className={classes.divider} />
          <Grid xs={12} container justify="center">
            <Typography variant="subtitle1" gutterBottom>
              Phone Number
            </Typography>
          </Grid>
          <Grid container container justify="center">
            <Grid>
              <PhoneInput
                defaultCountry={"ma"}
                value=""
                onChange={handleOnChange}
              />
            </Grid>
          </Grid>
          <Divider className={classes.divider} />

          <Grid container item xs={12} direction="row" justify="space-between">
            <Grid item xs={4}>
              <TextField
                className={classes.input}
                variant="outlined"
                required
                fullWidth
                label="Usear Name"
                name="userName"
                onChange={handleInputChange}
                autoFocus
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                error={
                  state.register.errors.firstName.length > 0 ? true : false
                }
                name="firstName"
                variant="outlined"
                required
                onChange={handleInputChange}
                label="First Name"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Save Changes
          </Button>
        </form>
      </div>
    </Container>
  );
}
const editProfile = () => {
  return (
    <div style={{ flex: 1 }}>
      <Edit_Profile />
    </div>
  );
};

export default editProfile;
