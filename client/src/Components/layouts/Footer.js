import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyle = makeStyles({
  footer: {
    backgroundColor: "#2e3c43",
    width: "100%"
  },
  widget: {
    display: "inline-block",
    padding: "2% 5%",
    color: "#fff",
    width: "30%",
    marginRight: "3%"
  }
});

const Widget = ({ classes, title, text }) => {
  return (
    <div className={classes}>
      <Typography variant='h5' align='center' gutterBottom={true}>
        {title}
      </Typography>
      <Typography variant='subtitle1' align='justify'>
        {text}
      </Typography>
    </div>
  );
};

const CopyRight = () => (
  <div
    style={{
      width: "20%",
      margin: "0 auto",
      color: "#fff",
      fontSize: "12px",
      fontWeight: "600"
    }}
  >
    &copy; CopyRight 2019
  </div>
);

const Footer = () => {
  const classes = useStyle();
  return (
    <div className={classes.footer}>
      <div className='container'>
        <Widget
          classes={classes.widget}
          title='About'
          text='An app allowing two potential lovers to meet,
          from the registration to the final encounter.'
        />
        <Widget
          classes={classes.widget}
          title='Contact'
          text='For business enquiries, for Ads or for any complaints, contact us: admin@matcha.com'
        />
        <Widget
          classes={classes.widget}
          title='Links'
          text='lorem ipsum dolor sit amet, consecteur adipiscing elit blanditiis tenetur unde '
        />
        <CopyRight />
      </div>
    </div>
  );
};

export default Footer;
