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
    maxHeight: "50%"
  },
  imgDiv: {
    height: "400px",
    backgroundSize: "100% 100%",
    backgroundRepeat: "no-repeat"
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
        {slides.map((step, index) =>
          Math.abs(activeStep - index) <= 2 ? (
            <div
              key={step.label}
              className={classes.imgDiv}
              style={{ backgroundImage: `url(${step.imgPath})` }}
            ></div>
          ) : null
        )}
      </AutoPlaySwipeableViews>
    </div>
  );
}

export default Slider;
