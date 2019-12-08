import React, { useState } from "react";
import { useUserStore } from "../../Context/appStore";
import { Route, Link } from "react-router-dom";
import {
  IconButton,
  Menu,
  Button,
  Typography,
  Toolbar,
  AppBar,
  makeStyles,
  MenuItem,
  Badge
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import io from "socket.io-client";
import axios from "axios";
const socket = io("http://localhost:5000");

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
  },
  actions: {
    fontSize: "25px"
  },
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
}));

const NavActions = () => {
  const classes = useStyles();
  const [dbNotif, setDbNotif] = useState(0);

  if (socket.listeners("notification").length <= 1) {
    socket.on("notification", data => {
      (async () => {
        const result = await axios.get("/api/profile/unseenNotificationsCount");
        if (result.data.success) {
          setDbNotif(result.data.count);
        }
      })();
    });
  }

  return (
    <>
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={0} color="secondary">
            <MailIcon className={classes.actions} />
          </Badge>
        </IconButton>
      </MenuItem>
      <MenuItem>
        <Link
          to={"/notifications"}
          style={{ color: "white", textDecoration: "none" }}
        >
          <IconButton aria-label="show 11 new notifications" color="inherit">
            <Badge badgeContent={dbNotif} color="secondary">
              <NotificationsIcon className={classes.actions} />
            </Badge>
          </IconButton>
        </Link>
      </MenuItem>
    </>
  );
};

const NavBrand = ({ style, children }) => (
  <Typography variant="h4" className={style}>
    <Link to="/" style={{ color: "white", textDecoration: "none" }}>
      {children}
    </Link>
  </Typography>
);

const NavBtn = ({ text, link }) => (
  <Link to={link} style={{ color: "white", textDecoration: "none" }}>
    <Button color="inherit">{text}</Button>
  </Link>
);

const NavCircle = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [{ auth }] = useUserStore();

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (auth.loading) return null;
  return (
    <div>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <AccountCircle style={{ fontSize: "40px" }} />
      </IconButton>
      <Menu
        style={{ top: "35px" }}
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        open={open}
        onClose={handleClose}
      >
        <Link to={`/profile/${auth.userInfo.id}`}>
          <MenuItem onClick={handleClose}>Profile</MenuItem>
        </Link>
        <MenuItem onClick={handleClose}>My account</MenuItem>
      </Menu>
    </div>
  );
};

export default function Navbar() {
  const classes = useStyles();
  const [{ auth }] = useUserStore();
  if (auth.loading) return null;
  return (
    <>
      <AppBar position="static" className={classes.bar}>
        <div className="container">
          <Toolbar>
            <NavBrand style={classes.title}>
              <span className={classes.brand}>Mat</span>Cha
            </NavBrand>
            <Route>
              {auth.isAuthenticated ? (
                <>
                  <NavActions />
                  <NavCircle user={auth.userInfo.username} />
                </>
              ) : (
                <>
                  <NavBtn text="Login" link="/Login" />
                  <NavBtn text="Register" link="/register" />
                </>
              )}
            </Route>
          </Toolbar>
        </div>
      </AppBar>
    </>
  );
}
