import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import Image from "material-ui-image";
import axios from "axios";

const useStyle = makeStyles({
  section: {
    width: "100%",
    color: "#2e3c43",
    marginTop: "10%"
  },
  widget: {
    display: "inline-block",
    padding: "2% 5%",
    width: "15%",
    marginRight: "5%"
  },
  image: {
    display: "block",
    margin: "0 auto"
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
    text: "Online"
  },
  {
    id: 3,
    img: "./img/men.png",
    title: "300",
    text: "Men Online"
  },
  {
    id: 4,
    img: "./img/women.png",
    title: "200",
    text: "Women  Online"
  }
];

const Widget = ({ classes, img, title, text }) => {
  return (
    <>
      <img src={img} alt={title} className={classes.image} />
      <Typography variant="h6" align="center">
        {title}
      </Typography>
      <Typography variant="subtitle2" align="center">
        {text}
      </Typography>
    </>
  );
};

const Title = () => {
  return (
    <>
      <Typography variant="h4" align="center">
        Welcome to <span style={{ color: "#e74c3c" }}>Mat</span>Cha
      </Typography>

      <Image
        src="./img/underTitleLine.png"
        aspectRatio={50}
        imageStyle={{ width: "10%", marginLeft: "45%" }}
      />
    </>
  );
};

const Section = () => {
  const classes = useStyle();
  const [totalMembers, setTotalMembers] = useState();
  useEffect(() => {
    async function setTotal() {
      const res = await axios.get("/api/users/getTotal");
      setTotalMembers(res.data.total);
    }
    setTotal();
  }, [totalMembers]);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Title />
      </Grid>
      <Grid item sm={3} xs={6}>
        <Widget
          classes={classes}
          img="./img/members.png"
          title={totalMembers}
          text="Total Members"
        />
      </Grid>
      <Grid item sm={3} xs={6}>
        <Widget
          classes={classes}
          img="./img/online.png"
          title={"500"}
          text={"Online"}
        />
      </Grid>
      <Grid item sm={3} xs={6}>
        <Widget
          classes={classes}
          img="./img/men.png"
          title={"300"}
          text={"Men Online"}
        />
      </Grid>
      <Grid item sm={3} xs={6}>
        <Widget
          classes={classes}
          img="./img/women.png"
          title={"200"}
          text={"Women  Online"}
        />
      </Grid>
    </Grid>
  );
};

export default Section;
