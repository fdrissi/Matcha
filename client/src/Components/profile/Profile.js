import React from "react";
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
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import Image from "material-ui-image";

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
    minWidth: "80px",
    width: "40%",
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
    color: "#000",
    letterSpacing: "5px"
  },
  boldli: {
    fontWeight: "bold",
    fontSize: "16px",
    color: "##334249",
    letterSpacing: "5px"
  }
}));

const UserInfo = () => {
  const classes = useStyles();
  return (
    <>
      <h3 className={classes.name}>First Name</h3>
      <h4 className={classes.info}>Age</h4>
      <br />
      <h4 className={classes.info} style={{ marginRight: "5%" }}>
        Country, City
      </h4>
      <h4 className={classes.info}>FameRate</h4>
    </>
  );
};

const ProfileImage = () => {
  const classes = useStyles();
  return (
    <>
      <Avatar
        alt="Profile"
        src="./img/profile.png"
        className={classes.avatar}
      />
    </>
  );
};

const options = ["Block", "Report"];

const ITEM_HEIGHT = 20;

const LongMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

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
            width: 200
          }
        }}
      >
        {options.map(option => (
          <MenuItem key={option} onClick={handleClose}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export const ButtonRed = ({ text, icon = false }) => {
  const classes = useStyles();
  return (
    <Fab
      variant="extended"
      color="primary"
      aria-label="add"
      size="large"
      className={classes.btn}
    >
      <div style={{ width: "100%" }}>
        {text}
        <span style={{ verticalAlign: "middle", fontSize: "22px" }}>
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

export const Cover = ({ children, img = null }) => {
  const classes = useStyles();
  return (
    <div className={classes.cover} style={{ backgroundImage: `url(${img})` }}>
      {children}
    </div>
  );
};

const ProfileHeader = () => {
  return (
    <Cover>
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
                <ButtonRed text={"Like"} icon={<ThumbUpAltIcon />} />
                <ButtonRed text={"Chat"} icon={<QuestionAnswerIcon />} />
                <LongMenu />
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
  const values = [
    "Male",
    "Morocco",
    "Khouribga",
    "Single",
    "Women",
    "Student",
    "French, Arabic",
    "#Surfing #Computer"
  ];
  const params = [
    "Gender",
    "Country",
    "City",
    "relationship",
    "Looking for",
    "Working as",
    "Languages",
    "Interests"
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
      <h4
        style={{
          fontWeight: "bold",
          color: "#2e3c43",
          fontSize: "30px",
          paddingBottom: "10px"
        }}
      >
        About Me
      </h4>
      <p>{text}</p>
    </div>
  );
};

const Gallery = ({ images }) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ margin: "0 auto 5%", width: "100%" }}>
      <h3>Photo</h3>
      <img
        src={"img/widget-title-border.png"}
        alt="wrap"
        style={{ display: "block", marginBottom: "5%" }}
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
            <Image src={img.src} alt="Gallery" onClick={handleOpen} />
            {open && (
              <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogContent>
                  <Image src={img.src} alt="Show Image" />
                </DialogContent>
              </Dialog>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const Profile = () => {
  const classes = useStyles();
  const imgs = [
    {
      id: 1,
      src: "https://via.placeholder.com/200x200"
    },
    {
      id: 2,
      src: "https://via.placeholder.com/200x200"
    },
    {
      id: 3,
      src: "https://via.placeholder.com/200x200"
    },
    {
      id: 4,
      src: "https://via.placeholder.com/200x200"
    }
  ];
  return (
    <div style={{ flex: 1 }}>
      <CssBaseline />
      <div>
        <ProfileHeader />
      </div>
      <Container>
        <Grid container spacing={2}>
          <Grid item lg={8} sm={12}>
            <ProfileContent classes={classes} />
            <AboutMe
              classes={classes}
              text={
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
              }
            />
          </Grid>
          <Grid item lg={4} xs={12}>
            <Gallery images={imgs} style={{ zIndex: "1" }} />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};
