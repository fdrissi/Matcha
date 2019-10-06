import React from "react";
import { Route, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
    fontWeight: 600
  }
}));

const style = {
  bar: {
    backgroundColor: "rgba(0, 0, 0, 0.68)",
    borderBottom: "1px solid #e74c3c",
    opacity: "0.9"
  },
  link: {
    color: "white",
    textDecoration: "none"
  },
  brand: {
    color: "#e74c3c"
  }
};

const NavBrand = ({ style, children }) => (
  <Typography variant='h4' className={style}>
    <Link to='/' style={{ color: "white", textDecoration: "none" }}>
      {children}
    </Link>
  </Typography>
);

const NavBtn = ({ text, link }) => (
  <Button color='inherit'>
    {" "}
    <Link to={link} style={{ color: "white", textDecoration: "none" }}>
      {text}
    </Link>
  </Button>
);

export default function Navbar() {
  const classes = useStyles();

  return (
    <>
      <AppBar position='static' style={style.bar}>
        <div className='container'>
          <Toolbar>
            <NavBrand style={classes.title}>
              <span style={style.brand}>Mat</span>Cha
            </NavBrand>
            <Route>
              <NavBtn text='Login' link='/Login' />
              <NavBtn text='Register' link='/register' />
            </Route>
          </Toolbar>
        </div>
      </AppBar>
    </>
  );
}
