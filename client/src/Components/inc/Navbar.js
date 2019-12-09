import React, { useState } from "react";
import { useUserStore } from "../../Context/appStore";
import { loadUser } from "../../actions/userAction";
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
import io from "socket.io-client";
import axios from "axios";
const socket = io("http://localhost:5000");

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

  return (
    <>
      <Link
        to={"/notifications"}
        style={{ color: "white", textDecoration: "none" }}
      >
        <IconButton
          aria-label="show 4 new mails"
          color="inherit"
          style={{ height: "100%" }}
        >
          <Badge badgeContent={0} color="secondary">
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
  const [{ auth }, dispatch] = useUserStore();

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    const result = await axios.get("/api/users/logout");
    if (result.data.success) {
      await loadUser(dispatch);
    }
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
        <MenuItem onClick={handleClose}>My account</MenuItem>
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
