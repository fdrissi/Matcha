import React, { useState, useEffect, useCallback } from "react";
import { useUserStore } from "../../Context/appStore";
import { useSocketStore } from "../../Context/appStore";
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
import { AccountCircle } from "@material-ui/icons/";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import axios from "axios";
import { unseenCountGlobal } from "../../actions/chatAction";

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
    fontWeight: 600
  },
  brand: {
    color: "#e74c3c"
  },
  actions: {
    fontSize: "25px",
    color: "white",
    [theme.breakpoints.down("sm")]: {
      fontSize: "25px",
      color: "black"
    }
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
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
      verticalAlign: "middle"
    }
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  }
}));

const NavNotifications = () => {
  const classes = useStyles();
  const [dbNotif, setDbNotif] = useState(0);
  const socket = useSocketStore();

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

  //if (socket.listeners("notification").length < 1) {

  useEffect(() => {
    (async () => {
      const result = await axios.get("/api/profile/unseenNotificationsCount");
      if (result.data.success) {
        setDbNotif(result.data.count);
      }
    })();
  }, []);

  socket.on("clearNotifications", data => {
    setDbNotif(0);
  });

  return (
    <>
      <Link
        to={"/notifications"}
        style={{ color: "white", textDecoration: "none" }}
      >
        <IconButton
          aria-label="show 11 new notifications"
          color="inherit"
          style={{ height: "100%" }}
        >
          <Badge badgeContent={dbNotif} color="secondary">
            <NotificationsIcon className={classes.actions} />
          </Badge>
        </IconButton>
      </Link>
    </>
  );
};

const NavMessage = () => {
  const classes = useStyles();
  const [{ auth, chat }, dispatch] = useUserStore();
  const stableDispatch = useCallback(dispatch, []);
  const socket = useSocketStore();

  if (socket.listeners("newMessage").length < 1)
    socket.on("notifMessage", data => {
      unseenCountGlobal(auth.userInfo.id, stableDispatch, socket);
    });

  useEffect(() => {
    if (auth.userInfo.id)
      unseenCountGlobal(auth.userInfo.id, stableDispatch, socket);
  }, [auth.userInfo.id, stableDispatch, socket]);

  return (
    <>
      <Link to={"/chat"} style={{ color: "white", textDecoration: "none" }}>
        <IconButton
          aria-label="show 4 new mails"
          color="inherit"
          style={{ height: "100%" }}
        >
          <Badge badgeContent={chat.unseenGlobal} color="secondary">
            <MailIcon className={classes.actions} />
          </Badge>
        </IconButton>
      </Link>
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

  const handleLogout = async () => {
    handleClose();
    const result = await axios.get("/api/users/logout");
    if (result.data.success) window.location.reload();
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
        <Link
          to={`/profile/${auth.userInfo.id}`}
          style={{ color: "black", textDecoration: "none" }}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
        </Link>
        <Link to={`/browse`} style={{ color: "black", textDecoration: "none" }}>
          <MenuItem onClick={handleClose}>Browse</MenuItem>
        </Link>
        <Link to={`/search`} style={{ color: "black", textDecoration: "none" }}>
          <MenuItem onClick={handleClose}>Search</MenuItem>
        </Link>
        <Link
          to={`/setting`}
          style={{ color: "black", textDecoration: "none" }}
        >
          <MenuItem onClick={handleClose}>Setting</MenuItem>
        </Link>
        <Link
          to={`/edit-profile`}
          style={{ color: "black", textDecoration: "none" }}
        >
          <MenuItem onClick={handleClose}>Edit Profile</MenuItem>
        </Link>
        <Link
          to={`/history`}
          style={{ color: "black", textDecoration: "none" }}
        >
          <MenuItem onClick={handleClose}>History</MenuItem>
        </Link>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default function PrimarySearchAppBar() {
  const classes = useStyles();
  const [{ auth }] = useUserStore();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <>
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      >
        <MenuItem>
          <NavNotifications />
          <p>Notifications</p>
        </MenuItem>

        <MenuItem>
          <NavMessage />
          <p>Messages</p>
        </MenuItem>

        <MenuItem>
          <NavCircle user={auth.userInfo.username} />
          <p>Profile</p>
        </MenuItem>
      </Menu>
    </>
  );

  if (auth.loading) return null;
  return (
    <div>
      <AppBar position="static" className={classes.bar}>
        <Toolbar>
          <NavBrand style={classes.title}>
            <span className={classes.brand}>Mat</span>Cha
          </NavBrand>
          <div className={classes.sectionDesktop}>
            {auth.isAuthenticated ? (
              <>
                <NavNotifications />
                <NavMessage />
                <NavCircle user={auth.userInfo.username} />
              </>
            ) : (
              <>
                <Route>
                  <NavBtn text="Login" link="/Login" />
                  <NavBtn text="Register" link="/register" />
                </Route>
              </>
            )}
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}
