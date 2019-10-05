import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyle = makeStyles(theme => ({
  footer: {
    backgroundColor: "#2e3c43",
    position: "absolute",
    bottom: "0",
    width: "100%",
    height: "15rem"
  },
  widget: {
    display: "inline-block",
    padding: "2% 5%",
    color: "#fff",
    width: "30%",
    marginRight: "3%"
  }
}));

const Widget = ({ classes, title, text }) => {
  return (
    <div className={classes}>
      <Typography variant='h5' align='center' color='secondary'>
        {title}
      </Typography>
      <Typography variant='body' align='justify'>
        {text}
      </Typography>
    </div>
  );
};

const Footer = () => {
  const classes = useStyle();
  return (
    <div className={classes.footer}>
      <Widget classes={classes.widget} title='About' text='lorem ipsum dolor sit amet, consecteur adipiscing elit blanditiis tenetur unde '/>
      <Widget classes={classes.widget} title='Contact' text='lorem ipsum dolor sit amet, consecteur adipiscing elit blanditiis tenetur unde '/>
      <Widget classes={classes.widget} title='Links' text='lorem ipsum dolor sit amet, consecteur adipiscing elit blanditiis tenetur unde '/>
    </div>
  );
};

export default Footer;
