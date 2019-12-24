import {
  setUserImages,
  getUserImages,
  removeUserImage,
  setUserCover,
  getUserInfo,
  updateUserInfo,
  getpreedefined,
  setUserLocation
} from "../../actions/profileAction";
import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { REMOVE_ALERT } from "../../actions/actionTypes";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CssBaseline from "@material-ui/core/CssBaseline";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import AccountBox from "@material-ui/icons/AccountBox";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import { IconButton } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { useUserStore } from "../../Context/appStore";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ClearIcon from "@material-ui/icons/Clear";
import ChipInput from "material-ui-chip-input";
import GoogleApiWrapper from "../inc/MapContainer";
import CircularProgress from "@material-ui/core/CircularProgress";
import DeleteIcon from "@material-ui/icons/Delete";
import Alert from "../inc/Alert";
import { FormHelperText } from "@material-ui/core";
import { usePosition } from "../inc/usePosition";
import Autosuggest from "react-autosuggest";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
let _ = require("lodash");

/* autocomplete */

const suggestions = [
  "Afghanistan",
  "Aland Islands",
  "Albania",
  "Algeria",
  "American Samoa",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antarctica",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia, Plurinational State of",
  "Bonaire, Sint Eustatius and Saba",
  "Bosnia and Herzegovina",
  "Botswana",
  "Bouvet Island",
  "Brazil",
  "British Indian Ocean Territory",
  "Brunei Darussalam"
];

function renderInput(inputProps) {
  const { value, onChange, chips, ref, ...other } = inputProps;

  return (
    <ChipInput
      clearInputValueOnChange
      onUpdateInput={onChange}
      value={chips}
      inputRef={ref}
      {...other}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion, query);
  const parts = parse(suggestion, matches);

  return (
    <MenuItem
      selected={isHighlighted}
      component="div"
      onMouseDown={e => e.preventDefault()} // prevent the click causing the input to be blurred
    >
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </span>
          ) : (
            <span key={String(index)}>{part.text}</span>
          );
        })}
      </div>
    </MenuItem>
  );
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion;
}

function getSuggestions(value, suggestions) {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
        const keep =
          count < 5 &&
          suggestion.toLowerCase().slice(0, inputLength) === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: "relative"
  },
  suggestionsContainerOpen: {
    position: "absolute",
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 3,
    left: 0,
    right: 0,
    zIndex: 1
  },
  suggestion: {
    display: "block"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  textField: {
    width: "100%"
  }
});

class ReactAutosuggest extends React.Component {
  state = {
    // value: '',
    suggestions: [],
    value: [],
    textFieldInput: ""
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    const suggestions = ["hello", "world", "this", "Fadel"];
    this.setState({
      suggestions: getSuggestions(value, suggestions)
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  handletextFieldInputChange = (event, { newValue }) => {
    this.setState({
      textFieldInput: newValue
    });
  };

  handleAddChip(chip) {
    if (this.props.allowDuplicates || this.state.value.indexOf(chip) < 0) {
      this.setState(({ value }) => ({
        value: [...value, chip],
        textFieldInput: ""
      }));
    }
  }

  render() {
    const { classes, value, onAdd, onDelete, ...other } = this.props;

    return (
      <Autosuggest
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion
        }}
        renderInputComponent={renderInput}
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        renderSuggestionsContainer={renderSuggestionsContainer}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        onSuggestionSelected={(e, { suggestionValue }) => {
          this.handleAddChip(suggestionValue);
          onAdd(suggestionValue);
          e.preventDefault();
        }}
        focusInputOnSuggestionClick
        inputProps={{
          chips: value,
          value: this.state.textFieldInput,
          onChange: this.handletextFieldInputChange,
          onAdd: chip => onAdd(chip),
          onDelete: (chip, index) => onDelete(chip, index),
          ...other
        }}
      />
    );
  }
}

/* finish auto complete */

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 800
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    alignItems: "center"
  },
  tab: {
    marginTop: theme.spacing(4)
  },
  button: {
    "&:hover": {
      backgroundColor: "transparent"
    }
  },
  buttonMark: {
    color: "#5cb85c",
    border: "1px solid #5cb85c"
  },
  buttonUnMark: {
    color: "gray",
    border: "1px solid gray"
  },
  submit: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)"
  },
  avatar: {
    margin: theme.spacing(1),
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)"
  },
  IconButton: {
    margin: theme.spacing(1)
  },
  inputImage: {
    display: "none"
  },
  Typography: {
    padding: theme.spacing(3, 0, 0, 0)
  },

  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`
  },
  helperText: {
    color: "#F32013",
    fontWeight: "fontWeightBold"
  },
  divider: {
    margin: theme.spacing(4, 0)
  }
}));

function EditProfile() {
  const classes = useStyles();
  const theme = useTheme();
  const [index, setIndex] = useState(0);
  const [predefined_cities, setCities] = useState([]);
  const [predefined_months, setMonths] = useState([]);
  const [predefined_occupancy, setOcupancy] = useState([]);
  const [predefined_rlationship, setRelation] = useState([]);
  const isFirstRun = useRef(true);
  const [isLoading, setisLoading] = useState(true);
  const [{ alert, profile, auth, operations }, dispatch] = useUserStore();
  const stableDispatch = useCallback(dispatch, []);
  const { latitude, longitude, error } = usePosition();

  const [myPhoto, setPhoto] = useState({
    id: "",
    file: "",
    profile_Image: "",
    first_Image: "",
    second_Image: "",
    third_Image: "",
    fourth_Image: ""
  });

  const [mydata, setData] = useState({
    user_gender: "",
    user_relationship: "",
    user_birth_day: "",
    user_birth_month: "",
    user_gender_interest: "",
    user_birth_year: "",
    user_tags: [],
    user_city: "",
    user_current_occupancy: "",
    user_biography: "",
    user_set_from_map: "",
    user_location: {
      lat: "",
      lng: ""
    }
  });

  const handleChange = event => {
    stableDispatch({
      type: REMOVE_ALERT
    });
    setData({
      ...mydata,
      [event.target.name]: event.target.value
    });
  };

  const submitForm = form => {
    form.preventDefault();
    async function update() {
      await updateUserInfo(mydata, stableDispatch);
    }
    update();
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleIndexChange = (event, newValue) => {
    stableDispatch({
      type: REMOVE_ALERT
    });
    setIndex(newValue);
  };

  const handleChangeIndex = index => {
    stableDispatch({
      type: REMOVE_ALERT
    });
    setIndex(index);
  };

  const onImageChange = event => {
    event.persist();
    stableDispatch({
      type: REMOVE_ALERT
    });
    if (event.target.files && event.target.files[0]) {
      let filee = event.target.files[0];
      setPhoto({
        ...myPhoto,
        file: filee,
        id: event.target.name
      });
      event.target.value = null;
    }
  };

  const handleCoverSet = filed => {
    setUserCover(filed, dispatch);
  };
  const handleClick = (photo, filed) => {
    removeUserImage(photo, filed, dispatch);
  };

  const handleAddChip = chip => {
    chip = _.startCase(_.toLower(chip));
    stableDispatch({
      type: REMOVE_ALERT
    });
    if (chip.length > 10 || _.includes(mydata.user_tags, chip)) return false;
    setData(previousData => ({
      ...previousData,
      user_tags: previousData.user_tags.concat(chip)
    }));
  };

  const handleDeleteChip = (chip, index) => {
    stableDispatch({
      type: REMOVE_ALERT
    });
    if (index > -1) {
      const res = mydata.user_tags;
      res.splice(index, 1);
      setData(previousData => ({
        ...previousData,
        user_tags: res
      }));
    }
  };

  useEffect(() => {
    return () => {
      stableDispatch({
        type: REMOVE_ALERT
      });
    };
  }, [stableDispatch]);

  useEffect(() => {
    async function getUser() {
      await getUserImages(stableDispatch);
      await getUserInfo(stableDispatch);
      const predefined = await getpreedefined();
      setCities(predefined[0]);
      setMonths(predefined[1]);
      setOcupancy(predefined[2]);
      setRelation(predefined[3]);
      setisLoading(false);
    }
    // stableDispatch({
    //   type: REMOVE_ALERT
    // });
    if (auth.isAuthenticated) getUser();
  }, [stableDispatch, auth]);

  useEffect(() => {
    setData(profile.info);
  }, [profile.info]);

  useEffect(() => {
    async function testt() {
      if (!isFirstRun.current) {
        const formData = new FormData();
        formData.append("myImage", myPhoto.file);
        await setUserImages(formData, myPhoto.id, stableDispatch);
      }
    }
    testt();
    isFirstRun.current = false;
  }, [myPhoto.file, myPhoto.id, stableDispatch]);

  useEffect(() => {
    if (latitude || longitude || error) {
      setUserLocation(latitude, longitude, error, stableDispatch);
    }
  }, [latitude, longitude, error, stableDispatch]);
  if (isLoading)
    return (
      <Container component="main" maxWidth="md">
        <div className={classes.paper}>
          <CircularProgress />
        </div>
      </Container>
    );
  return (
    <Container component="main" maxWidth="md">
      <div className={classes.paper}>
        <CssBaseline />
        <Avatar className={classes.avatar}>
          <AccountCircle />
        </Avatar>
        <Typography variant="h5">Edit Profile</Typography>
        <Box textAlign="center">Edit Your Personnal info:</Box>
        <Box variant="h5">
          <sup>*</sup>You need to set all your info and at least profile image
          so u can start using our website Thank You
        </Box>

        <Divider className={classes.divider} />

        <AppBar position="static" color="default">
          <Tabs
            value={index}
            onChange={handleIndexChange}
            indicatorColor="secondary"
            textColor="secondary"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab icon={<AccountBox />} label="Profile Info" {...a11yProps(0)} />
            <Tab
              icon={<PhotoCamera />}
              label="Profile Photos"
              {...a11yProps(1)}
            />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={index}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel
            value={index}
            index={0}
            dir={theme.direction}
            className={classes.tab}
          >
            {alert.msg && <Alert message={alert.msg} type={alert.alertType} />}

            {/* NEXT GRIDE */}
            <form
              className={classes.form}
              onSubmit={form => submitForm(form)}
              border={1}
            >
              <Grid xs={12} container item justify="center">
                <Typography variant="subtitle1" gutterBottom>
                  Gender & RELATIONSHIP:
                </Typography>
              </Grid>
              <Grid xs={12} container item justify="center">
                <Typography
                  variant="overline"
                  gutterBottom
                  className={classes.Typography}
                >
                  Gender:
                </Typography>
              </Grid>
              <Grid item xs={12} container justify="center">
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    aria-label="gender"
                    name="user_gender"
                    value={mydata.user_gender}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="Male"
                      control={<Radio color="secondary" />}
                      label="👨Male"
                      labelPlacement="start"
                    />
                    <FormControlLabel
                      value="Female"
                      control={<Radio color="secondary" />}
                      label="👩Female"
                      labelPlacement="start"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              {/* Next Gride */}
              <Grid xs={12} container item justify="center">
                <Typography
                  variant="overline"
                  gutterBottom
                  className={classes.Typography}
                >
                  RELATIONSHIP:
                </Typography>
              </Grid>
              <TextField
                error={operations.errors.relationship ? true : false}
                className={classes.input}
                select
                variant="outlined"
                label="Your Relationship status"
                value={mydata.user_relationship}
                name="user_relationship"
                fullWidth
                onChange={handleChange}
                SelectProps={{
                  native: true,
                  MenuProps: {
                    className: classes.menu
                  }
                }}
              >
                {predefined_rlationship.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
              {operations.errors.relationship && (
                <FormHelperText className={classes.helperText}>
                  <sup>*</sup>
                  {operations.errors.relationship}
                </FormHelperText>
              )}
              {/* Next Gride */}
              <Divider className={classes.divider} />
              <Grid xs={12} container item justify="center" pt={2}>
                <Typography variant="subtitle1" pt={3}>
                  Details About You:
                </Typography>
              </Grid>
              <Grid xs={12} container item justify="center">
                <Typography variant="overline" className={classes.Typography}>
                  Interests:
                </Typography>
              </Grid>
              <Grid item xs={12} container justify="center">
                <FormControl error component="fieldset">
                  <RadioGroup
                    row
                    aria-label="gender"
                    name="user_gender_interest"
                    value={mydata.user_gender_interest}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="Male"
                      control={<Radio color="secondary" />}
                      label="👨Male"
                      labelPlacement="start"
                    />
                    <FormControlLabel
                      value="Female"
                      control={<Radio color="secondary" />}
                      label="👩Female"
                      labelPlacement="start"
                    />
                    <FormControlLabel
                      value="Bisexual"
                      control={<Radio color="secondary" />}
                      label="🏳️‍🌈Bisexual"
                      labelPlacement="start"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              {/* Next Gride */}
              <Grid container alignItems="center" justify="center">
                <Grid item xs={12}>
                  <Typography
                    variant="overline"
                    gutterBottom
                    className={classes.Typography}
                  >
                    Current Occupancy:
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    className={classes.input}
                    select
                    variant="outlined"
                    value={mydata.user_current_occupancy}
                    name="user_current_occupancy"
                    size="medium"
                    onChange={handleChange}
                    SelectProps={{
                      native: true,
                      MenuProps: {
                        className: classes.menu
                      }
                    }}
                  >
                    {predefined_occupancy.map(option => (
                      <option key={option.id} value={option.value}>
                        {option.value}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                {operations.errors.current_occupancy && (
                  <FormHelperText className={classes.helperText}>
                    <sup>*</sup> {operations.errors.current_occupancy}
                  </FormHelperText>
                )}
              </Grid>
              {/* Next Gride */}
              <Grid container alignItems="center" justify="center">
                <Grid item xs={12}>
                  <Typography
                    variant="overline"
                    gutterBottom
                    className={classes.Typography}
                  >
                    Country:
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    className={classes.input}
                    disabled
                    variant="outlined"
                    label="Country"
                    value="Morocco"
                    size="small"
                  ></TextField>
                </Grid>
              </Grid>
              {/* Next Gride */}
              <Grid container alignItems="center" justify="center">
                <Grid xs={12} item>
                  <Typography
                    variant="overline"
                    gutterBottom
                    className={classes.Typography}
                  >
                    City:
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={operations.errors.city ? true : false}
                    className={classes.input}
                    select
                    variant="outlined"
                    label="Your City"
                    value={mydata.user_city}
                    name="user_city"
                    size="medium"
                    onChange={handleChange}
                    SelectProps={{
                      native: true,
                      MenuProps: {
                        className: classes.menu
                      }
                    }}
                  >
                    {predefined_cities.map(option => (
                      <option key={option.id} value={option.value}>
                        {option.value}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                {operations.errors.city && (
                  <FormHelperText className={classes.helperText}>
                    <sup>*</sup> {operations.errors.city}
                  </FormHelperText>
                )}
              </Grid>
              {/* Next Gride */}
              <Grid container alignItems="center" justify="center">
                <Grid xs={12} item>
                  <Typography
                    variant="overline"
                    gutterBottom
                    className={classes.Typography}
                  >
                    Birthday:
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    error={operations.errors.birth_day ? true : false}
                    name="user_birth_day"
                    variant="outlined"
                    fullWidth
                    value={mydata.user_birth_day}
                    onChange={handleChange}
                    label="Day"
                    inputProps={{ maxLength: 2 }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    error={operations.errors.birth_month ? true : false}
                    className={classes.input}
                    select
                    variant="outlined"
                    label="Month"
                    value={mydata.user_birth_month}
                    name="user_birth_month"
                    fullWidth
                    onChange={handleChange}
                    SelectProps={{
                      native: true,
                      MenuProps: {
                        className: classes.menu
                      }
                    }}
                  >
                    {predefined_months.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    error={operations.errors.birth_year ? true : false}
                    name="user_birth_year"
                    variant="outlined"
                    value={mydata.user_birth_year}
                    fullWidth
                    onChange={handleChange}
                    label="YYYY"
                    inputProps={{ maxLength: 4 }}
                  />
                </Grid>
              </Grid>
              {operations.errors.birthday && (
                <Grid xs={12} container item justify="center">
                  <FormHelperText className={classes.helperText}>
                    <sup>*</sup> {operations.errors.birthday}
                  </FormHelperText>
                </Grid>
              )}

              {/* Next Gride */}
              {/* Next Gride */}
              <Grid xs={12} container item justify="center">
                <Typography
                  variant="overline"
                  gutterBottom
                  className={classes.Typography}
                >
                  biography:
                </Typography>
              </Grid>
              <Grid container direction="row" justify="center">
                <Grid item xs={12}>
                  <TextField
                    error={operations.errors.biography ? true : false}
                    id="outlined-multiline-static"
                    label="Your Biography"
                    multiline
                    rows="4"
                    name="user_biography"
                    fullWidth
                    onChange={handleChange}
                    value={mydata.user_biography}
                    className={classes.textField}
                    margin="normal"
                    variant="outlined"
                    inputProps={{ maxLength: 200 }}
                  />
                </Grid>
                {operations.errors.biography && (
                  <FormHelperText className={classes.helperText}>
                    <sup>*</sup> {operations.errors.biography}
                  </FormHelperText>
                )}
              </Grid>
              {/* Next Gride */}
              <Grid container alignItems="center" justify="center">
                <Grid xs={12} item>
                  <Typography variant="subtitle1" gutterBottom>
                    Tags:
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <ReactAutosuggest
                    value={mydata.user_tags}
                    onAdd={chip => handleAddChip(chip)}
                    onDelete={(chip, index) => handleDeleteChip(chip, index)}
                    classes={styles}
                  />
                  {/* <ChipInput
                    value={mydata.user_tags}
                    onAdd={chip => handleAddChip(chip)}
                    onDelete={(chip, index) => handleDeleteChip(chip, index)}
                  /> */}
                </Grid>
                {operations.errors.tags && (
                  <FormHelperText className={classes.helperText}>
                    <sup>*</sup> {operations.errors.tags}
                  </FormHelperText>
                )}
              </Grid>
              {/* Next Gride */}
              {/* {next Gride } */}
              <Grid xs={12} container item justify="center">
                <Grid
                  item
                  xs={12}
                  style={{
                    position: "relative",
                    marginBottom: "2vh",
                    marginTop: "2vh"
                  }}
                >
                  <GoogleApiWrapper data={mydata} setData={setData} />
                </Grid>
              </Grid>
              <Divider className={classes.divider} />
              <Button
                type="submit"
                size="medium"
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Save
              </Button>
            </form>
          </TabPanel>
          <TabPanel value={index} index={1} dir={theme.direction}>
            {/* Next Tab */}
            {alert.msg && <Alert message={alert.msg} type={alert.alertType} />}
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Grid xs={12} item>
                <Typography
                  variant="overline"
                  gutterBottom
                  className={classes.Typography}
                >
                  profile Photo:
                </Typography>
              </Grid>
              <Divider className={classes.divider} />

              {/* Profile Gride */}
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  onChange={onImageChange}
                  className={classes.inputImage}
                  id="profileImage-button-file"
                  multiple
                  name="profile_Image"
                  type="file"
                />
                <label htmlFor="profileImage-button-file">
                  <IconButton component="span">
                    <Avatar
                      src={`/uploads/${profile.photo.profile_Image}`}
                      style={{
                        margin: "10px",
                        width: "200px",
                        height: "200px"
                      }}
                    />
                  </IconButton>
                </label>
                {profile.photo.profile_Image !== "photo_holder.png" && (
                  <Grid xs={12} container item justify="center">
                    <Button
                      size="small"
                      variant="contained"
                      color="secondary"
                      startIcon={<DeleteIcon />}
                      onClick={() =>
                        handleClick(
                          profile.photo.profile_Image,
                          "profile_Image"
                        )
                      }
                    >
                      Remove
                    </Button>
                  </Grid>
                )}
              </Grid>
              <Divider className={classes.divider} />

              {/* first Container Grid */}
              <Grid container direction="row" justify="space-around">
                <Grid
                  item
                  xs={12}
                  sm={6}
                  style={{
                    maxWidth: "200px"
                  }}
                >
                  <input
                    accept="image/*"
                    onChange={onImageChange}
                    className={classes.inputImage}
                    id="firstImage-button-file"
                    multiple
                    name="first_Image"
                    type="file"
                  />
                  <label htmlFor="firstImage-button-file">
                    <IconButton
                      className={classes.button}
                      component="span"
                      aria-label="Delete"
                    >
                      <Avatar
                        variant="square"
                        src={`/uploads/${profile.photo.first_Image}`}
                        style={{
                          borderRadius: 0,
                          width: "100%",
                          height: "200px"
                        }}
                      />
                    </IconButton>
                  </label>
                  {profile.photo.first_Image !== "photo_holder.png" && (
                    <Grid container>
                      <Grid item xs={6}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<DeleteIcon />}
                          onClick={() =>
                            handleClick(
                              profile.photo.first_Image,
                              "first_Image"
                            )
                          }
                        >
                          Remove
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          className={
                            profile.photo.first_Image ===
                            profile.photo.cover_Image
                              ? classes.buttonMark
                              : classes.buttonUnMark
                          }
                          size="small"
                          variant="outlined"
                          startIcon={
                            profile.photo.first_Image ===
                            profile.photo.cover_Image ? (
                              <CheckCircleIcon />
                            ) : (
                              <ClearIcon />
                            )
                          }
                          onClick={() => handleCoverSet("first_Image")}
                        >
                          Cover
                        </Button>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  style={{
                    maxWidth: "200px"
                  }}
                >
                  <input
                    accept="image/*"
                    onChange={onImageChange}
                    className={classes.inputImage}
                    id="secondImage-button-file"
                    multiple
                    name="second_Image"
                    type="file"
                  />
                  <label htmlFor="secondImage-button-file">
                    <IconButton
                      className={classes.button}
                      component="span"
                      aria-label="Delete"
                    >
                      <Avatar
                        variant="square"
                        src={`/uploads/${profile.photo.second_Image}`}
                        style={{
                          borderRadius: 0,
                          width: "100%",
                          height: "200px"
                        }}
                      />
                    </IconButton>
                  </label>
                  {profile.photo.second_Image !== "photo_holder.png" && (
                    <Grid container>
                      <Grid item xs={6}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<DeleteIcon />}
                          onClick={() =>
                            handleClick(
                              profile.photo.second_Image,
                              "second_Image"
                            )
                          }
                        >
                          Remove
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          className={
                            profile.photo.second_Image ===
                            profile.photo.cover_Image
                              ? classes.buttonMark
                              : classes.buttonUnMark
                          }
                          size="small"
                          variant="outlined"
                          startIcon={
                            profile.photo.second_Image ===
                            profile.photo.cover_Image ? (
                              <CheckCircleIcon />
                            ) : (
                              <ClearIcon />
                            )
                          }
                          onClick={() => handleCoverSet("second_Image")}
                        >
                          Cover
                        </Button>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
            {/* Second Container */}
            <Grid container direction="row" justify="space-around">
              <Grid
                item
                xs={12}
                sm={6}
                style={{
                  maxWidth: "200px"
                }}
              >
                <input
                  accept="image/*"
                  onChange={onImageChange}
                  className={classes.inputImage}
                  id="thirdImage-button-file"
                  multiple
                  name="third_Image"
                  type="file"
                />
                <label htmlFor="thirdImage-button-file">
                  <IconButton
                    className={classes.button}
                    component="span"
                    aria-label="Delete"
                  >
                    <Avatar
                      variant="square"
                      src={`/uploads/${profile.photo.third_Image}`}
                      style={{
                        borderRadius: 0,
                        width: "100%",
                        height: "200px"
                      }}
                    />
                  </IconButton>
                </label>
                {profile.photo.third_Image !== "photo_holder.png" && (
                  <Grid container>
                    <Grid item xs={6}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        onClick={() =>
                          handleClick(profile.photo.third_Image, "third_Image")
                        }
                      >
                        Remove
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        className={
                          profile.photo.third_Image ===
                          profile.photo.cover_Image
                            ? classes.buttonMark
                            : classes.buttonUnMark
                        }
                        size="small"
                        variant="outlined"
                        startIcon={
                          profile.photo.third_Image ===
                          profile.photo.cover_Image ? (
                            <CheckCircleIcon />
                          ) : (
                            <ClearIcon />
                          )
                        }
                        onClick={() => handleCoverSet("third_Image")}
                      >
                        Cover
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                style={{
                  maxWidth: "200px"
                }}
              >
                <input
                  accept="image/*"
                  onChange={onImageChange}
                  className={classes.inputImage}
                  id="fourthImage-button-file"
                  multiple
                  name="fourth_Image"
                  type="file"
                />
                <label htmlFor="fourthImage-button-file">
                  <IconButton
                    className={classes.button}
                    component="span"
                    aria-label="Delete"
                  >
                    <Avatar
                      variant="square"
                      key="1"
                      src={`/uploads/${profile.photo.fourth_Image}`}
                      style={{
                        borderRadius: 0,
                        width: "100%",
                        height: "200px"
                      }}
                    />
                  </IconButton>
                </label>
                {profile.photo.fourth_Image !== "photo_holder.png" && (
                  <Grid container>
                    <Grid item xs={6}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        onClick={() =>
                          handleClick(
                            profile.photo.fourth_Image,
                            "fourth_Image"
                          )
                        }
                      >
                        Remove
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        className={
                          profile.photo.fourth_Image ===
                          profile.photo.cover_Image
                            ? classes.buttonMark
                            : classes.buttonUnMark
                        }
                        size="small"
                        variant="outlined"
                        startIcon={
                          profile.photo.fourth_Image ===
                          profile.photo.cover_Image ? (
                            <CheckCircleIcon />
                          ) : (
                            <ClearIcon />
                          )
                        }
                        onClick={() => handleCoverSet("fourth_Image")}
                      >
                        Cover
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </TabPanel>
        </SwipeableViews>
      </div>
    </Container>
  );
}
const editProfile = () => {
  return (
    <div style={{ flex: 1, marginBottom: "2%" }}>
      <EditProfile />
    </div>
  );
};

export default editProfile;
