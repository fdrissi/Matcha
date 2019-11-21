import React from "react";
import { Cover } from "../profile/Profile";
import { Title } from "./Notifications";
import {
  Box,
  Container,
  Avatar,
  makeStyles,
  Dialog,
  DialogActions,
  DialogContent,
  CssBaseline,
  DialogTitle,
  Slide,
  Grid,
  Fab
} from "@material-ui/core";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";

const useStyles = makeStyles(() => ({
  avatar: {
    margin: "0 auto",
    width: "125px",
    height: "125px",
    "&:hover": {
      background: "black",
      opacity: 0.8
    }
  },
  title: {
    fontSize: "30px",
    fontWeight: "bolder",
    letterSpacing: "2px",
    display: "inline-block"
  }
}));

const info = [
  {
    id: "1",
    name: "Fadel Drissi",
    age: "27",
    img: "./img/profiletest.png",
    fameRate: "90%",
    city: "Khouribga",
    tags: "#shopping, #traveling"
  },
  {
    id: "2",
    name: "Fadel Drissi",
    age: "27",
    img: "./img/profiletest.png",
    fameRate: "90%",
    city: "Khouribga",
    tags: "#shopping, #traveling"
  },
  {
    id: "3",
    name: "Fadel Drissi",
    age: "27",
    img: "./img/profiletest.png",
    fameRate: "90%",
    city: "Khouribga",
    tags: "#shopping, #traveling"
  },
  {
    id: "4",
    name: "Fadel Drissi",
    age: "27",
    img: "./img/profiletest.png",
    fameRate: "90%",
    city: "Khouribga",
    tags: "#shopping, #traveling"
  },
  {
    id: "5",
    name: "Fadel Drissi",
    age: "27",
    img: "./img/profiletest.png",
    fameRate: "90%",
    city: "Khouribga",
    tags: "#shopping, #traveling"
  },
  {
    id: "6",
    name: "Fadel Drissi",
    age: "27",
    img: "./img/profiletest.png",
    fameRate: "90%",
    city: "Khouribga",
    tags: "#shopping, #traveling"
  },
  {
    id: "7",
    name: "Fadel Drissi",
    age: "27",
    img: "./img/profiletest.png",
    fameRate: "90%",
    city: "Khouribga",
    tags: "#shopping, #traveling"
  },
  {
    id: "8",
    name: "Fadel Drissi",
    age: "27",
    img: "./img/profiletest.png",
    fameRate: "90%",
    city: "Khouribga",
    tags: "#shopping, #traveling"
  },
  {
    id: "9",
    name: "Fadel Drissi",
    age: "27",
    img: "./img/profiletest.png",
    fameRate: "90%",
    city: "Khouribga",
    tags: "#shopping, #traveling"
  },
  {
    id: "10",
    name: "Fadel Drissi",
    age: "27",
    img: "./img/profiletest.png",
    fameRate: "90%",
    city: "Khouribga",
    tags: "#shopping, #traveling"
  },
  {
    id: "11",
    name: "Fadel Drissi",
    age: "27",
    img: "./img/profiletest.png",
    fameRate: "90%",
    city: "Khouribga",
    tags: "#shopping, #traveling"
  },
  {
    id: "12",
    name: "Fadel Drissi",
    age: "27",
    img: "./img/profiletest.png",
    fameRate: "90%",
    city: "Khouribga",
    tags: "#shopping, #traveling"
  }
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ProfileDialog = ({ open, handleClose, inf, classes }) => {
  return (
    <>
      {open && (
        <div>
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle
              id="alert-dialog-slide-title"
              style={{ backgroundColor: "#e74c3c", height: "70px" }}
            >
              <Grid container>
                <Grid item xs={12}>
                  <div>
                    <h5
                      style={{
                        display: "inline-block",
                        marginRight: "30%",
                        color: "#FFF",
                        fontSize: "24px",
                        fontWeight: "700"
                      }}
                    >
                      {inf.name}
                    </h5>
                    <p
                      style={{
                        display: "inline-block",
                        color: "#FFF",
                        fontSize: "24px",
                        fontWeight: "700"
                      }}
                    >
                      {inf.fameRate}
                    </p>
                  </div>
                </Grid>
              </Grid>
            </DialogTitle>
            <DialogContent>
              <Grid container>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={6}>
                      <Avatar
                        src={inf.img}
                        alt={inf.name}
                        className={classes.avatar}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <p style={{ textAlign: "center", fontWeight: "700" }}>
                        {inf.age} years old
                      </p>
                      <p style={{ textAlign: "center", fontWeight: "700" }}>
                        {inf.city}
                      </p>
                      <p style={{ textAlign: "center", fontWeight: "700" }}>
                        {inf.tags}
                      </p>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions style={{ justifyContent: "flex-start" }}>
              <Fab style={{ color: "#e74c3c" }}>
                <ThumbUpAltIcon />
              </Fab>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </>
  );
};

const Profile = ({ infos }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      {infos.map(inf => {
        return (
          <Box
            key={inf.id}
            style={{ margin: "0 4%" }}
            flexGrow={1}
            onMouseEnter={handleClickOpen}
          >
            <Avatar src={inf.img} alt={inf.name} className={classes.avatar} />
            <h5 style={{ textAlign: "center" }}>{inf.name}</h5>
            <p style={{ textAlign: "center" }}>{inf.age} years old</p>
            <ProfileDialog
              open={open}
              handleClose={handleClose}
              inf={inf}
              classes={classes}
            />
          </Box>
        );
      })}
    </>
  );
};

const ProfilesContainer = ({ children }) => {
  return (
    <>
      <Title text={"Members"} />
      <img
        src={"img/underTitleLine.png"}
        alt="wrap"
        style={{ display: "block", margin: "2% auto" }}
      />
      <Box display="flex" flexWrap="wrap" alignItems="center">
        {children}
      </Box>
    </>
  );
};

const Filter = () => {
  return <div>Filter By Age, Locations, FameRate, Common Tags</div>;
};

const Sort = () => {
  return <div>Sort By Age, Locations, FameRate, Common Tags</div>;
};

const Header = () => {
  const classes = useStyles();
  return (
    <Cover img={"/img/banner-brwose.jpg"}>
      <Container>
        <div>
          <img src="./img/t-left-img.png" alt="left" />
          <Title text={"Browse"} color="#FFF" classes={classes.title} />
          <img src="./img/t-right-img.png" alt="right" />
        </div>

        <Sort />
        <Filter />
      </Container>
    </Cover>
  );
};

const Browse = () => {
  return (
    <div>
      <CssBaseline />
      <Header />
      <Container>
        <ProfilesContainer>
          <Profile infos={info} />
        </ProfilesContainer>
      </Container>
    </div>
  );
};

export default Browse;
