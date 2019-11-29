import React, { useState, useEffect, useCallback } from "react";
import { useUserStore } from "../../Context/appStore";
import {
  getUserInfo,
  getUserImages,
  likeProfile,
  likedProfile
} from "../../actions/profileAction";
import Moment from "react-moment";
import {
  makeStyles,
  Avatar,
  Container,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  CssBaseline,
  Fab,
  Box,
  Dialog,
  DialogContent
} from "@material-ui/core";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbDownAltIcon from "@material-ui/icons/ThumbDownAlt";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import Image from "material-ui-image";
import io from "socket.io-client";
const socket = io("http://localhost:5000");

const useStyles = makeStyles(() => ({
  cover: {
    width: "100%",
    minHeight: "421px",
    position: "relative",
    backgroundColor: "#5199FF",
    marginBottom: "5%"
  },
  Userallinfocontainer: {
    width: "100%",
    position: "absolute",
    bottom: "-30px",
    right: "0px"
  },
  Infocontainer: {
    color: "#FFF",
    width: "100%",
    display: "inline-block",
    padding: "20px 20px",
    textAlign: "center"
  },
  avatar: {
    margin: "0 auto",
    width: "200px",
    height: "200px"
  },
  name: {
    display: "inline-block",
    fontSize: "30px",
    fontWeight: "bold",
    color: "#FFF",
    marginRight: "5%"
  },
  info: {
    display: "inline-block",
    fontSize: "20px",
    fontWeight: "500",
    color: "#FFF"
  },
  btn: {
    display: "inline-block",
    margin: "0% 1%",
    fontSize: "16px",
    fontWeight: "bold",
    border: "1px solid #e74c3c",
    textTransform: "capitalize",
    backgroundColor: "#e74c3c",
    "&:hover": {
      backgroundColor: "transparent",
      color: "#e74c3c",
      border: "1px solid #e74c3c"
    }
  },
  border: {
    border: "2px solid #e0e0e0",
    borderRadius: "5px",
    padding: "30px 22px",
    marginBottom: "5%"
  },
  normalli: {
    fontWeight: "normal",
    fontSize: "16px",
    color: "#000"
  },
  boldli: {
    fontWeight: "bold",
    fontSize: "16px",
    color: "##334249"
  },
  title: {
    fontWeight: "bold",
    color: "#2e3c43",
    fontSize: "30px",
    paddingBottom: "10px"
  }
}));

const UserInfo = () => {
  const classes = useStyles();
  const [{ auth, profile }] = useUserStore();
  let date =
    profile.info.user_birth_year &&
    `${profile.info.user_birth_year}-${profile.info.user_birth_month}-${profile.info.user_birth_day}`;
  return (
    <>
      <h3 className={classes.name}>{auth.userInfo.first_name}</h3>
      <h4 className={classes.info}>
        {date && (
          <Moment format="YYYY-MM-DD" fromNow ago>
            {date}
          </Moment>
        )}
      </h4>
      <br />
      <h4 className={classes.info} style={{ marginRight: "5%" }}>
        Morocco, {profile.info.user_city}
      </h4>
      <h4 className={classes.info}>FameRate</h4>
    </>
  );
};

const ProfileImage = () => {
  const classes = useStyles();
  const [{ profile }] = useUserStore();
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const getBlocked = async () => {
      const result = await likedProfile(profile.info.id);
      setBlocked(result);
    };
    getBlocked();
  }, [profile]);

  return (
    <>
      <Avatar
        alt="Profile"
        src={`/uploads/${profile.photo.profile_Image}`}
        className={classes.avatar}
        style={{ border: blocked && "red 5px solid" }}
      />
    </>
  );
};

const ITEM_HEIGHT = 48;

const LongMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [{ profile }] = useUserStore();
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const getBlocked = async () => {
      setBlocked(await likedProfile(profile.info.id));
    };
    getBlocked();
  }, [profile]);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        style={{ width: "16%" }}
      >
        <MoreHorizIcon style={{ color: "#FFF" }} />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: 80,
            marginTop: "50px"
          }
        }}
      >
        <MenuItem onClick={handleClose}>
          {blocked ? "Unblock" : "Block"}
        </MenuItem>
        <MenuItem onClick={handleClose}>{"Report"}</MenuItem>
      </Menu>
    </>
  );
};

export const ButtonRed = ({ icon = false }) => {
  const classes = useStyles();
  return (
    <Fab
      variant="extended"
      color="primary"
      aria-label="add"
      className={classes.btn}
    >
      <div style={{ width: "100%" }}>
        <span style={{ verticalAlign: "center", fontSize: "28px" }}>
          {icon}
        </span>
      </div>
    </Fab>
  );
};

const InfoContainer = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.Infocontainer}>{children}</div>;
};

const UserAllInfoContainer = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.Userallinfocontainer}>{children}</div>;
};

export const Cover = ({ children, img = "/img/banner-brwose.jpg" }) => {
  const classes = useStyles();
  return (
    <div
      className={classes.cover}
      style={{
        backgroundImage: `url(${img})`,
        backgroundSize: "cover",
        backgroundPosition: "center center"
      }}
    >
      {children}
    </div>
  );
};

const ProfileHeader = () => {
  const [{ auth, profile }] = useUserStore();
  const [liked, setLiked] = useState(false);

  const handleClick = async () => setLiked(await likeProfile(profile.info.id));

  useEffect(() => {
    (async () => {
      const result = await likedProfile(profile.info.id);
      setLiked(result);
    })();
  }, [profile]);

  return (
    <Cover img={"/uploads/" + profile.photo.cover_Image}>
      <UserAllInfoContainer>
        <Container>
          <Box display="flex" flexWrap="wrap" alignItems="center">
            <Box flexGrow={1}>
              <InfoContainer>
                <ProfileImage />
              </InfoContainer>
            </Box>
            <Box flexGrow={1}>
              <InfoContainer>
                <UserInfo />
              </InfoContainer>
            </Box>
            <Box flexGrow={1}>
              <InfoContainer>
                {auth.userInfo.id === parseInt(profile.info.id) && (
                  <>
                    <ButtonRed
                      icon={
                        liked ? (
                          <ThumbDownAltIcon onClick={handleClick} />
                        ) : (
                          <ThumbUpAltIcon onClick={handleClick} />
                        )
                      }
                    />
                    <ButtonRed icon={<QuestionAnswerIcon />} />
                    <LongMenu />
                  </>
                )}
              </InfoContainer>
            </Box>
          </Box>
        </Container>
      </UserAllInfoContainer>
    </Cover>
  );
};

const Parameters = ({ values = [], liClassName }) => {
  return (
    <div style={{ display: "inline-block" }}>
      <ul style={{ listStyle: "none" }}>
        <li className={liClassName}>{values[0]}</li>
        <li className={liClassName}>{values[1]}</li>
        <li className={liClassName}>{values[2]}</li>
        <li className={liClassName}>{values[3]}</li>
      </ul>
    </div>
  );
};

const ProfileContent = ({ classes }) => {
  const [{ profile }] = useUserStore();
  const {
    user_gender,
    user_city,
    user_relationship,
    user_gender_interest,
    user_current_occupancy,
    user_tags
  } = profile.info;

  const values = [
    user_gender,
    "Morocco",
    user_city,
    user_relationship,
    user_gender_interest,
    user_current_occupancy,
    user_tags
  ];

  const params = [
    "Gender",
    "Country",
    "City",
    "relationship",
    "Interest",
    "Occupancy",
    "Tags"
  ];

  return (
    <Grid container className={classes.border}>
      <ProfileContentContainer>
        <Parameters
          values={params.slice(0, 4)}
          liClassName={classes.normalli}
        />
      </ProfileContentContainer>
      <ProfileContentContainer>
        <Parameters values={values.slice(0, 4)} liClassName={classes.boldli} />
      </ProfileContentContainer>
      <ProfileContentContainer>
        <Parameters
          values={params.slice(4, 8)}
          liClassName={classes.normalli}
        />
      </ProfileContentContainer>
      <ProfileContentContainer>
        <Parameters values={values.slice(4, 8)} liClassName={classes.boldli} />
      </ProfileContentContainer>
    </Grid>
  );
};

const ProfileContentContainer = ({ children }) => {
  return (
    <>
      <Grid item md={3} sm={6} xs={6}>
        {children}
      </Grid>
    </>
  );
};

const AboutMe = ({ classes, text }) => {
  return (
    <div className={classes.border}>
      <h4 className={classes.title}>About Me</h4>
      <img
        src={"/img/widget-title-border.png"}
        alt="wrap"
        style={{ display: "block", marginBottom: "1%" }}
      />
      <p>{text}</p>
    </div>
  );
};

const Gallery = ({ images }) => {
  const [open, setOpen] = React.useState(false);
  const [src, setSrc] = React.useState(null);

  const handleOpen = e => {
    setSrc(e.target.src);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ margin: "4% auto 5%", width: "100%" }}>
      <h3>Photo</h3>
      <img
        src={"/img/widget-title-border.png"}
        alt="wrap"
        style={{ display: "block", marginBottom: "2%" }}
      />
      {images.map(img => {
        return (
          <div
            key={img.id}
            style={{
              width: "76px",
              height: "76px",
              display: "inline-block",
              marginRight: "16%"
            }}
          >
            <Image src={img.src} alt="Gallery" onClick={e => handleOpen(e)} />
            {open && (
              <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogContent>
                  <Image src={src} alt="Show Image" />
                </DialogContent>
              </Dialog>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const Profile = ({ match }) => {
  const classes = useStyles();
  const [{ auth, profile }, dispatch] = useUserStore();
  const stableDispatch = useCallback(dispatch, []);
  let id = match.params.id;

  useEffect(() => {
    socket.emit("login", profile.info.id);
    socket.on("login", data => console.log("user", data));
  }, [profile]);

  useEffect(() => {
    (async () => {
      await getUserInfo(stableDispatch, id);
      await getUserImages(stableDispatch, id);
    })();
  }, [stableDispatch, id]);

  const imgs = [
    {
      id: 1,
      src: `/uploads/${profile.photo.cover_Image}`
    },
    {
      id: 2,
      src: `/uploads/${profile.photo.first_Image}`
    },
    {
      id: 3,
      src: `/uploads/${profile.photo.second_Image}`
    },
    {
      id: 4,
      src: `/uploads/${profile.photo.third_Image}`
    }
  ];

  if (profile.photo.loading || profile.info.loading) return null;
  return (
    <div style={{ flex: 1 }}>
      <CssBaseline />
      <div>
        <ProfileHeader />
      </div>
      <Container>
        <Grid container spacing={2}>
          <Grid item lg={8} sm={12}>
            <h4 className={classes.title}>Profile Info</h4>
            <img
              src={"/img/widget-title-border.png"}
              alt="wrap"
              style={{ display: "block", marginBottom: "1%" }}
            />
            <ProfileContent classes={classes} />
            {profile.info.user_biography && (
              <AboutMe classes={classes} text={profile.info.user_biography} />
            )}
          </Grid>
          <Grid item lg={4} xs={12}>
            <Gallery images={imgs} />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};
