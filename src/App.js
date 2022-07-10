import Gamepage from "./pages/Gamepage";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import app from "./app.module.css";
import { React, useState } from "react";
import { signOut, signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase-config";
import Gameover from "./pages/Gameover";
import Leaderboard from "./pages/Leaderboard";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import {
  ThemeProvider,
  createTheme,
  IconButton,
  Button,
  AppBar,
  Toolbar,
  CssBaseline,
  Typography,
  Stack,
  Avatar,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { CatchingPokemon } from "@mui/icons-material";
import { Paper } from "@mantine/core";
import YouTubeIcon from "@mui/icons-material/YouTube";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

function App() {
  //determines if you are logged in or not
  const [isAuth, setIsAuth] = useState(false);
  const [mode, setMode] = useState(false);

  const signUserOut = () => {
    signOut(auth).then(() => {
      setIsAuth(false);
      window.location.pathname = "/";
    });
  };

  const signUserIn = () => {
    signInWithPopup(auth, provider).then((result) => {
      setIsAuth(true);
      const profilePic = result.user.photoURL;
      localStorage.setItem("profilePic", profilePic);
    });
  };

  const theme = createTheme({
    palette: {
      mode: mode ? "light" : "dark",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <AppBar position="static" color="common">
          <Toolbar>
            <Stack direction="row" spacing={4} sx={{ flexGrow: 1 }}>
              <Stack direction="row" spacing={0.75}>
                <Typography variant="h6" component="div">
                  Higher or Lower
                </Typography>
                <YouTubeIcon fontSize="large" />
              </Stack>
              <Button component={Link} to="/" disableElevation>
                Play!
              </Button>
              <Button component={Link} to="/leaderboard" disableElevation>
                leaderboard
              </Button>
            </Stack>

            <Stack direction="row" spacing={2}>
              {!isAuth ? (
                <button className={app.loginGoogle} onClick={signUserIn}>
                  Sign in with Google
                </button>
              ) : (
                <>
                  <Avatar
                    alt="Profile Picture"
                    src={localStorage.getItem("profilePic")}
                  />
                  <Button
                    variant="contained"
                    onClick={() => {
                      signUserOut();
                    }}
                  >
                    Log Out
                  </Button>
                </>
              )}

              {mode ? (
                <IconButton onClick={() => setMode(!mode)}>
                  <Brightness4Icon />
                </IconButton>
              ) : (
                <IconButton onClick={() => setMode(!mode)}>
                  <Brightness7Icon />
                </IconButton>
              )}
            </Stack>
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" element={<Gamepage />} />
          <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
          <Route path="/gameover" element={<Gameover isAuth={isAuth} />} />
          <Route
            path="/leaderboard"
            element={<Leaderboard isAuth={isAuth} />}
          />
        </Routes>
      </Router>
    </ThemeProvider>

    // <Router>
    //   <nav className={app.globalColor}>
    //     <Link to="/">Game</Link>
    //     <Link to="/leaderboard">Leaderboard</Link>
    //     {!isAuth ? (
    //       <button className={app.loginGoogle} onClick={signUserIn}>
    //         Sign in with Google
    //       </button>
    //     ) : (
    //       <button
    //         onClick={() => {
    //           signUserOut();
    //         }}
    //       >
    //         Log Out
    //       </button>
    //     )}
    //   </nav>
    //   <Routes>
    //     <Route path="/" element={<Gamepage />} />
    //     <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
    //     <Route path="/gameover" element={<Gameover />} />
    //     <Route path="/leaderboard" element={<Leaderboard isAuth={isAuth} />} />
    //   </Routes>
    // </Router>
  );
}

export default App;
