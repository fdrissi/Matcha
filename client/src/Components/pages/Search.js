import React, { useEffect, useState, useCallback } from "react";
import { Cover } from "../profile/Profile";
import NavigationIcon from "@material-ui/icons/Navigation";
import Alert from "../inc/Alert";
import { REMOVE_ALERT, CLEAR_PROFILE_INIT } from "../../actions/actionTypes";
import Places from "../inc/GoogleMaps";

import { getSearch, sortProfiles } from "../../actions/browseAction";

import {
  Box,
  Container,
  Avatar,
  makeStyles,
  Dialog,
  DialogActions,
  DialogContent,
  CssBaseline,
  DialogTitle,
  Slide,
  Grid,
  Fab
} from "@material-ui/core";

import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import RadioGroup from "@material-ui/core/RadioGroup";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Slider from "@material-ui/core/Slider";
import Rating from "@material-ui/lab/Rating";
import { useUserStore } from "../../Context/appStore";
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  avatar: {
    margin: "0 auto",
    width: "125px",
    height: "125px",
    "&:hover": {
      background: "black",
      opacity: 0.8
    }
  },
  slider: {
    color: "rgb(231, 76, 60)"
  },
  divider: {
    margin: theme.spacing(3, 0)
  },
  button: {
    color: "white",
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)"
  },
  title: {
    fontSize: "30px",
    fontWeight: "bolder",
    letterSpacing: "2px",
    display: "inline-block"
  },
  card: {
    backgroundColor: "transparent"
  },
  submit: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)"
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ProfileDialog = ({ open, handleClose, info, classes }) => {
  return (
    <>
      {open && (
        <div>
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle
              id="alert-dialog-slide-title"
              style={{
                backgroundColor: "#e74c3c",
                height: "70px",
                textAlign: "center"
              }}
            >
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <Grid item xs={12}>
                  <div>
                    <h5
                      style={{
                        color: "#FFF"
                      }}
                    >
                      {info.first_name} {info.last_name}
                    </h5>
                    <p
                      style={{
                        display: "inline-block",
                        color: "#FFF",
                        fontSize: "24px",
                        fontWeight: "700"
                      }}
                    >
                      {info.fameRate}
                    </p>
                  </div>
                </Grid>
              </Grid>
            </DialogTitle>
            <DialogContent>
              <Grid container justify="center" alignItems="center">
                <Grid item xs={12}>
                  <Avatar
                    src={`./uploads/${info.profile_Image}`}
                    alt={info.first_name}
                    className={classes.avatar}
                  />
                </Grid>
                <Grid item xs={4}>
                  <p style={{ textAlign: "center", fontWeight: "700" }}>
                    {info.user_birth} years old
                  </p>
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
              >
                <Grid item xs={4}>
                  <p style={{ textAlign: "center", fontWeight: "700" }}>
                    {info.user_city}
                  </p>
                </Grid>
                <Grid item xs={4}>
                  <p style={{ textAlign: "center", fontWeight: "700" }}>
                    {info.destination} KM
                  </p>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions
              style={{ justifyContent: "center", backgroundColor: "#e74c3c" }}
            >
              <Link
                to={"/profile/" + info.id}
                style={{ textDecoration: "none" }}
              >
                <Fab variant="extended" className={classes.button}>
                  <NavigationIcon />
                  Porfile
                </Fab>
              </Link>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </>
  );
};

const Profile = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [{ profile }] = useUserStore();

  const [showCard, setShowCard] = React.useState({
    myinfo: {}
  });

  const handleClickOpen = e => {
    setShowCard({
      showCard: e
    });
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      {profile.browser.result.map(inf => {
        return (
          <Box key={inf.id} width={300} style={{ margin: "0 4%" }} flexGrow={1}>
            <Avatar
              src={`./uploads/${inf.profile_Image}`}
              alt={inf.first_name}
              className={classes.avatar}
              onClick={() => handleClickOpen(inf)}
            />
            <h5 style={{ textAlign: "center" }}>
              {inf.first_name} {inf.last_name}
            </h5>
            <p style={{ textAlign: "center" }}>{inf.user_birth} years old</p>
          </Box>
        );
      })}
      <ProfileDialog
        open={open}
        handleClose={handleClose}
        info={showCard.showCard}
        classes={classes}
      />
    </>
  );
};

const ProfilesContainer = ({ children }) => {
  const [{ alert }, dispatch] = useUserStore();
  if (alert.msg !== "")
    setTimeout(() => {
      dispatch({
        type: REMOVE_ALERT
      });
    }, 2000);
  return (
    <>
      <Grid
        xs={12}
        container
        item
        justify="center"
        style={{ paddingTop: "20px" }}
      >
        <Typography variant="subtitle1">Members</Typography>
        {alert.msg && <Alert message={alert.msg} type={alert.alertType} />}
      </Grid>
      <Grid xs={12} container item justify="center">
        <img src={"img/underTitleLine.png"} alt="wrap" />
      </Grid>

      <Box display="flex" flexWrap="wrap" alignItems="center" pt={5}>
        {children}
      </Box>
    </>
  );
};
const Sort = () => {
  const classes = useStyles();
  const [sort, setSort] = useState({
    sort_by: ""
  });
  const [{ profile }, dispatch] = useUserStore();
  const stableDispatch = useCallback(dispatch, []);

  const handleChange = event => {
    setSort({
      ...sort,
      [event.target.name]: event.target.value
    });
  };

  useEffect(() => {
    sortProfiles(profile.browser.result, stableDispatch, sort);
  }, [sort, stableDispatch, profile.browser.result]);
  return (
    <Card style={{ backgroundColor: "transparent" }}>
      <CardContent style={{ height: "264px" }}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid xs={12} container item justify="center">
            <Typography variant="overline" gutterBottom>
              <img
                src="./img/widget-title-border.png"
                alt="left"
                style={{ color: "rgb(231, 76, 60)" }}
              />
              {" Sort By "}
              <img
                src="./img/widget-title-border.png"
                alt="left"
                style={{ color: "rgb(231, 76, 60)", transform: "scaleX(-1)" }}
              />
            </Typography>
          </Grid>
          <Divider className={classes.divider} />

          <Grid item xs={12}>
            <FormControl component="fieldset" style={{ display: "block" }}>
              <RadioGroup
                row
                aria-label="gender"
                style={{ justifyContent: "center" }}
                name="sort_by"
                onChange={handleChange}
                value={profile.browser.sort_by}
              >
                <FormControlLabel
                  value="Age"
                  control={<Radio color="secondary" />}
                  label="Age"
                  labelPlacement="start"
                />
                <FormControlLabel
                  value="Location"
                  control={<Radio color="secondary" />}
                  label="Location"
                  labelPlacement="start"
                />
                <FormControlLabel
                  value="Fame rating"
                  control={<Radio color="secondary" />}
                  label="Fame rating"
                  labelPlacement="start"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
      {/* <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions> */}
    </Card>
  );
};
function valuetext(value) {
  return `${value}`;
}

const SearchBy = () => {
  const classes = useStyles();
  const [filter, setFilter] = React.useState({
    age_range: [16, 80],
    tags: 0,
    location: "",
    fame_rating: 1
  });
  const [, dispatch] = useUserStore();
  const submitForm = form => {
    form.preventDefault();
    async function searchFunc() {
      await getSearch(filter, dispatch);
    }
    searchFunc();
  };
  console.log(filter);

  const handleChange = name => (event, newValue) => {
    setFilter({
      ...filter,
      [name]: newValue
    });
  };
  return (
    <form className={classes.form} onSubmit={form => submitForm(form)}>
      <Card style={{ backgroundColor: "transparent" }}>
        <CardContent
          style={{
            paddingBottom: 10
          }}
        >
          <Grid
            container
            direction="row"
            justify="space-around"
            alignItems="center"
          >
            <Grid xs={12} container item justify="center">
              <Typography variant="overline" gutterBottom>
                <img
                  src="./img/widget-title-border.png"
                  alt="left"
                  style={{ color: "rgb(231, 76, 60)" }}
                />
                {" Filter "}
                <img
                  src="./img/widget-title-border.png"
                  alt="left"
                  style={{ color: "rgb(231, 76, 60)", transform: "scaleX(-1)" }}
                />
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Grid xs={12} container item justify="center">
                <Typography variant="overline" id="range-slider" gutterBottom>
                  Age range
                </Typography>
              </Grid>

              <Slider
                className={classes.slider}
                max={80}
                min={16}
                step={1}
                value={filter.age_range}
                onChange={handleChange("age_range")}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                getAriaValueText={valuetext}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Grid xs={12} container item justify="center">
                <Typography variant="overline" id="range-slider" gutterBottom>
                  Tags
                </Typography>
              </Grid>

              <Slider
                className={classes.slider}
                max={10}
                min={0}
                step={1}
                value={filter.tags}
                onChange={handleChange("tags")}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                getAriaValueText={valuetext}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Grid xs={12} container item justify="center">
                <Typography variant="overline" id="range-slider" gutterBottom>
                  Fame Rating
                </Typography>
              </Grid>
              <Grid xs={12} container item justify="center">
                <Rating
                  name="simple-controlled"
                  value={filter.fame_rating}
                  onChange={handleChange("fame_rating")}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid xs={12} container item justify="center">
            <Typography variant="overline" id="range-slider" gutterBottom>
              Location
            </Typography>
          </Grid>

          <Grid
            xs={12}
            container
            item
            justify="center"
            style={{ paddingBottom: "10px" }}
          >
            <Places search={filter} setFilter={setFilter} />
          </Grid>
          <Grid xs={12} container item justify="center">
            <Button
              type="submit"
              size="medium"
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Search
            </Button>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};

const Header = () => {
  return (
    <>
      <Cover img={"/img/banner-brwose.jpg"} style={{ postion: "relative" }}>
        <Grid xs={12} container item justify="center">
          <div style={{ position: "absolute", top: "80%", opacity: "0.7" }}>
            <Typography
              variant="h5"
              id="range-slider"
              gutterBottom
              style={{ color: "#FFF", fontWeight: "900", fontSize: "30px" }}
            >
              <img src="./img/t-left-img.png" alt="left" />
              Search
              <img src="./img/t-right-img.png" alt="right" />
            </Typography>
          </div>
        </Grid>
      </Cover>

      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="flex-end"
        style={{ marginTop: "-5%" }}
      >
        <Grid item xs={12} md={6}>
          <SearchBy />
        </Grid>
        <Grid item xs={12} md={6}>
          <Sort />
        </Grid>
      </Grid>
    </>
  );
};

const Search = () => {
  const [{ profile }, dispatch] = useUserStore();
  console.log(profile);
  // dont remove it im gonna work with later for clearing result when leaving page
  const stableDispatch = useCallback(dispatch, []);
  useEffect(() => {
    return () => {
      stableDispatch({
        type: CLEAR_PROFILE_INIT
      });
    };
  }, [stableDispatch]);

  return (
    <div>
      <CssBaseline />
      <Header />
      <Container>
        <ProfilesContainer>
          <Profile />
        </ProfilesContainer>
      </Container>
    </div>
  );
};

export default Search;
