import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slide from "@material-ui/core/Slide";
import Fab from "@material-ui/core/Fab";
import { Loading } from "../inc/Loading";
import { useUserStore } from "../../Context/appStore";

const slides = [
  {
    label: "Couples",
    imgPath: "./img/slide1.jpg"
  }
];

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: "100%",
    maxHeight: "50%"
  },
  imgDiv: {
    height: "600px",
    position: "relative"
  },
  img: {
    width: "100%",
    height: "100%"
  },
  slideText: {
    position: "absolute",
    top: "35%",
    left: "5%",
    color: "white",
    fontSize: "50px"
  },
  redText: {
    fontWeight: 600,
    color: "#e74c3c"
  },
  registerButton: {
    display: "block",
    margin: "2% auto 0",
    fontSize: "20px",
    border: "1px solid #e74c3c",
    textTransform: "capitalize",
    backgroundColor: "#e74c3c",
    "&:hover": {
      backgroundColor: "transparent",
      color: "#e74c3c",
      border: "1px solid #e74c3c"
    }
  }
}));

const TextOnSlide = ({ classes, animation, children }) => {
  return (
    <Slide direction={animation} in={true} mountOnEnter unmountOnExit>
      <Typography
        variant="h4"
        color="textSecondary"
        align="center"
        className={classes.slideText}
      >
        Are You <span className={classes.redText}>Waiting</span>
        <br />
        For <span className={classes.redText}>Dating ?</span>
        {children}
      </Typography>
    </Slide>
  );
};

const TextOnSlideAuth = ({ classes, animation, children }) => {
  return (
    <Slide direction={animation} in={true} mountOnEnter unmountOnExit>
      <Typography
        variant="h4"
        color="textSecondary"
        align="center"
        className={classes.slideText}
      >
        Browse, <span className={classes.redText}>Match</span>
        <br />
        Chat, <span className={classes.redText}>Date</span>
        {children}
      </Typography>
    </Slide>
  );
};

export const FabButton = ({ className, text }) => {
  return (
    <Fab
      variant="extended"
      color="primary"
      aria-label="add"
      size="large"
      className={className}
    >
      {text}
    </Fab>
  );
};

export const Slider = () => {
  const classes = useStyles();
  const [{ auth }] = useUserStore();
  const image = slides[Math.floor(Math.random() * slides.length)];

  if (auth.loading) return <Loading text="Landing" />;
  return (
    <div className={classes.imgDiv}>
      <img src={image.imgPath} alt={image.label} className={classes.img} />
      {auth.isAuthenticated ? (
        <TextOnSlideAuth classes={classes} animation="up">
          <Link to="/browse" style={{ textDecoration: "none" }}>
            <FabButton className={classes.registerButton} text="Browse" />
          </Link>
        </TextOnSlideAuth>
      ) : (
        <TextOnSlide classes={classes} animation="up">
          <Link to="/register" style={{ textDecoration: "none" }}>
            <FabButton
              className={classes.registerButton}
              text="Registeration"
            />
          </Link>
        </TextOnSlide>
      )}
    </div>
  );
};
