import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const slides = [
  {
    label: "Couples",
    imgPath: "./img/slide1.jpg"
  },
  {
    label: "Love",
    imgPath: "./img/slide2.jpg"
  },
  {
    label: "Dating",
    imgPath: "./img/slide3.jpg"
  }
];

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: "100%",
    flexGrow: 1
  },
  header: {
    display: "flex",
    alignItems: "center",
    height: "50%",
    paddingLeft: theme.spacing(4),
    backgroundColor: theme.palette.background.default
  },
  img: {
    maxHeight: "50%",
    display: "block",
    maxWidth: "100%",
    overflow: "hidden",
    width: "100%"
  }
}));

function Slider() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleStepChange = step => {
    setActiveStep(step);
  };

  return (
    <div className={classes.root}>
      <AutoPlaySwipeableViews
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {slides.map((step, index) => (
          <div key={step.label}>
            {Math.abs(activeStep - index) <= 2 ? (
              <img
                className={classes.img}
                src={step.imgPath}
                alt={step.label}
              />
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>
    </div>
  );
}

export default Slider;
