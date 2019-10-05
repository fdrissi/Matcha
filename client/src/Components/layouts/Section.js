import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Image from "material-ui-image";

const useStyle = makeStyles({
  section: {
    width: "100%",
    color: "#2e3c43",
    marginTop: "5%"
  },
  widget: {
    display: "inline-block",
    padding: "2% 5%",
    width: "20%",
    marginRight: "5%"
  }
});

const images = [
  {
    id: 1,
    img: "./img/members.png",
    title: "1611",
    text: "Total Members"
  },
  {
    id: 2,
    img: "./img/online.png",
    title: "500",
    text: "Members online"
  },
  {
    id: 3,
    img: "./img/men.png",
    title: "300",
    text: "Men online"
  },
  {
    id: 4,
    img: "./img/women.png",
    title: "200",
    text: "Women online"
  }
];

const Widget = ({ classes, img, title, text }) => {
  return (
    <div className={classes}>
      <Image src={img.img} aspectRatio={2} />
      <Typography variant='h6' align='center'>
        {title}
      </Typography>
      <Typography variant='subtitle2' align='center'>
        {text}
      </Typography>
    </div>
  );
};

const Title = () => {
  return (
    <>
      <Typography variant='h4' align='center'>
        Welcome to <span style={{ color: "#e74c3c" }}>Mat</span>Cha
      </Typography>
      <Image
        src='./img/underTitleLine.png'
        aspectRatio={50}
        imageStyle={{ width: "10%", marginLeft: "45%" }}
      />
    </>
  );
};

const Section = () => {
  const classes = useStyle();
  return (
    <div className={classes.section}>
      <Title />
      {images.map(img => (
        <Widget
          key={img.id}
          classes={classes.widget}
          img={img}
          title={img.title}
          text={img.text}
        />
      ))}
    </div>
  );
};

export default Section;
