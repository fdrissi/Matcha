import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import Image from "material-ui-image";
import axios from "axios";
import { useSocketStore } from "../../Context/appStore";

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
  const socket = useSocketStore();
  const [totalMembers, setTotalMembers] = useState(0);
  const [online, setOnline] = useState(0);
  useEffect(() => {
    async function setTotal() {
      let res = await axios.get("/api/users/getTotal");
      setTotalMembers(res.data.total);
      res = await axios.get("/api/profile/online");
      if (res.data.success) setOnline(res.data.count);
    }
    setTotal();
  }, []);

  if (socket.listeners("login").length < 1) {
    socket.on("login", users => {
      setOnline(Object.keys(users).length);
    });
  }

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
          title={online}
          text={"Online"}
        />
      </Grid>
      <Grid item sm={3} xs={6}>
        <Widget
          classes={classes}
          img="./img/men.png"
          title={Math.floor(online * 0.4)}
          text={"Men Online"}
        />
      </Grid>
      <Grid item sm={3} xs={6}>
        <Widget
          classes={classes}
          img="./img/women.png"
          title={Math.ceil(online * 0.6)}
          text={"Women  Online"}
        />
      </Grid>
    </Grid>
  );
};

export default Section;
