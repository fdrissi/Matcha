import React, { useState, useEffect, useRef } from "react";
import PropTypes, { array } from "prop-types";
import SwipeableViews from "react-swipeable-views";
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
import PhoneInput from "react-phone-input-2";
import AccountBox from "@material-ui/icons/AccountBox";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { IconButton } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { useUserStore } from "../../Context/appStore";

const axios = require("axios");

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
    width: 500
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
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
  divider: {
    margin: theme.spacing(2, 0)
  }
}));

export default function FullWidthTabs() {
  const My_tags = [{ tags: "Khouribga" }, { tags: "1337" }];
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

  const relationship_status = [
    {
      value: "Single",
      label: "Single"
    },
    {
      value: "In a relationship",
      label: "In a relationship"
    },
    {
      value: "Engaged",
      label: "Engaged"
    },
    {
      value: "Married",
      label: "Married"
    },
    {
      value: "Its complicated ",
      label: "Its complicated "
    },
    {
      value: "In an open relationship",
      label: "In an open relationship"
    },
    {
      value: "Widowed",
      label: "Widowed"
    },
    {
      value: "Separated",
      label: "Separated"
    },
    {
      value: "9",
      label: "September"
    },
    {
      value: "Divorced",
      label: "Divorced"
    },
    {
      value: "In a civil union",
      label: "In a civil union"
    },
    {
      value: "In a domestic partnership",
      label: "In a domestic partnership"
    }
  ];
  const classes = useStyles();
  const theme = useTheme();
  const [index, setIndex] = useState(0);
  const isFirstRun = useRef(true);
  const [myPhoto, setPhoto] = useState({
    id: "",
    file: "",
    profile_Image: "place-holder.png",
    first_Image: "place-holder.png",
    second_Image: "place-holder.png",
    third_Image: "place-holder.png",
    fourth_Image: "place-holder.png"
  });
  const [mydata, setData] = useState({
    gender: "male",
    day: "",
    months: "",
    year: "",
    phoneNumber: "",
    tags: [],
    relationship: ""
  });

  const handleChange = event => {
    setData({
      ...mydata,
      [event.target.name]: event.target.value
    });
  };

  const submitForm = form => {
    form.preventDefault();
    const formData = new FormData();
    formData.append("image", myPhoto.file);
    // for (var pair of formData.entries()) {
    //   console.log(pair[1]);
    // }
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };
    axios
      .post("api/profile/upload", formData, config)
      .then(response => {
        alert("The file is successfully uploaded");
      })
      .catch(error => {});
  };

  const handleIndexChange = (event, newValue) => {
    setIndex(newValue);
  };

  function handleInputUpdate(event, values) {
    if (values.includes(undefined)) {
      values.pop();
    }
    if (!mydata.tags.includes(values[values.length - 1].tags))
      setData({
        ...mydata,
        tags: values
      });
  }
  const handleChangeIndex = index => {
    setIndex(index);
  };
  const handlePhoneOnChange = value => {
    setData({
      ...mydata,
      phoneNumber: value
    });
  };
  const [state, dispatch] = useUserStore();

  const onImageChange = event => {
    event.persist();
    if (event.target.files && event.target.files[0]) {
      let filee = event.target.files[0];
      setPhoto({
        ...myPhoto,
        file: filee,
        id: event.target.name
      });
    }
  };
  useEffect(() => {
    if (!isFirstRun.current) {
      const formData = new FormData();
      formData.append("myImage", myPhoto.file);
      const config = {
        headers: {
          "content-type": "multipart/form-data"
        }
      };
      axios
        .post(`api/profile/upload/${myPhoto.id}`, formData, config)
        .then(response => {
          alert("The file is successfully uploaded");
        })
        .catch(error => {});
    }
    isFirstRun.current = false;
  }, [myPhoto.file]);
  console.log(state);
  return (
    <Container component="main" maxWidth="md">
      <div className={classes.paper}>
        <CssBaseline />
        <Avatar className={classes.avatar}>
          <AccountCircle />
        </Avatar>
        <Typography variant="h5">Edit Profile</Typography>
        <Box textAlign="center">
          Tempor ad excepteur irure officia in labore velit.
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
                <FormControl
                  component="fieldset"
                  className={classes.formControl}
                >
                  <RadioGroup
                    row
                    aria-label="gender"
                    name="gender"
                    value={mydata.gender}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="male"
                      control={<Radio color="secondary" />}
                      label="👨Male"
                      labelPlacement="start"
                    />
                    <FormControlLabel
                      value="female"
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
                className={classes.input}
                select
                variant="outlined"
                label="Your Relationship status"
                value={mydata.months}
                name="relationship"
                fullWidth
                onChange={handleChange}
                SelectProps={{
                  native: true,
                  MenuProps: {
                    className: classes.menu
                  }
                }}
              >
                {relationship_status.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>

              <Divider className={classes.divider} />
              <Grid xs={12} container item justify="center">
                <Typography variant="subtitle1" gutterBottom>
                  Details About You:
                </Typography>
              </Grid>
              <Grid xs={12} container item justify="center">
                <Typography
                  variant="overline"
                  gutterBottom
                  className={classes.Typography}
                >
                  Birthday:
                </Typography>
              </Grid>
              <Grid item xs={12} container direction="row" justify="center">
                <Grid item xs={2}>
                  <TextField
                    name="day"
                    variant="outlined"
                    fullWidth
                    onChange={handleChange}
                    label="Day"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    className={classes.input}
                    select
                    variant="outlined"
                    label="Month"
                    value={mydata.months}
                    name="months"
                    fullWidth
                    onChange={handleChange}
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
                    name="year"
                    variant="outlined"
                    fullWidth
                    onChange={handleChange}
                    label="YYYY"
                  />
                </Grid>
              </Grid>
              {/* Next Gride */}

              <Grid xs={12} container item justify="center" pt={5}>
                <Typography
                  variant="overline"
                  gutterBottom
                  className={classes.Typography}
                >
                  Phone Number
                </Typography>
              </Grid>
              <Grid container xs={12} item justify="center">
                <Grid>
                  <PhoneInput
                    defaultCountry={"us"}
                    onChange={handlePhoneOnChange}
                    value={mydata.phoneNumber}
                  />
                </Grid>
              </Grid>
              <Grid xs={12} container item justify="center">
                <Typography variant="overline" className={classes.Typography}>
                  Interests:
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={My_tags}
                  getOptionLabel={option => option.tags}
                  filterSelectedOptions
                  onChange={handleInputUpdate}
                  renderInput={params => (
                    <TextField
                      className={classes.input}
                      {...params}
                      variant="outlined"
                      placeholder="Favorites"
                      margin="normal"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              {/* Next Gride */}
              <Divider className={classes.divider} />
            </form>
          </TabPanel>
          <TabPanel value={index} index={1} dir={theme.direction}>
            {/* Next Tab */}
            <form onSubmit={form => submitForm(form)}>
              <Grid xs={12} container item justify="center">
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
              <Grid container item justify="center" xs={12}>
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
                      src={`./uploads/${myPhoto.profile_Image}`}
                      style={{
                        margin: "10px",
                        width: "200px",
                        height: "200px"
                      }}
                    />
                  </IconButton>
                </label>
              </Grid>
              <Divider className={classes.divider} />

              {/* first Container Grid */}
              <Grid container direction="row" justify="center">
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
                        src={`./uploads/${myPhoto.first_Image}`}
                        style={{
                          borderRadius: 0,
                          width: "100%",
                          height: "auto"
                        }}
                      />
                    </IconButton>
                  </label>
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
                        src={`./uploads/${myPhoto.second_Image}`}
                        style={{
                          borderRadius: 0,
                          width: "100%",
                          height: "auto"
                        }}
                      />
                    </IconButton>
                  </label>
                </Grid>
              </Grid>
              {/* Second Container */}
              <Grid container direction="row" justify="center">
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
                        src={`./uploads/${myPhoto.third_Image}`}
                        style={{
                          borderRadius: 0,
                          width: "100%",
                          height: "auto"
                        }}
                      />
                    </IconButton>
                  </label>
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
                        src={`./uploads/${myPhoto.fourth_Image}`}
                        style={{
                          borderRadius: 0,
                          width: "100%",
                          height: "auto"
                        }}
                      />
                    </IconButton>
                  </label>
                </Grid>
              </Grid>
              <Grid xs={12} container justify="center" item>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Save Changes
                </Button>
              </Grid>
            </form>
          </TabPanel>
        </SwipeableViews>
      </div>
    </Container>
  );
}
