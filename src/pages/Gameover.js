import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import gameover from "./gameover.module.css";
import { Button, Stack, Typography } from "@mui/material";

export default function Gameover({ isAuth }) {
  let navigate = useNavigate();

  const { state } = useLocation();
  const { score } = state;

  const [dataloser, setDataLoser] = useState([]);
  const [datahighscore, setDataHighscore] = useState([]);

  useEffect(() => {
    const fetchDataLoser = async () => {
      const results = await axios(
        "https://api.giphy.com/v1/gifs/search?q=loser",
        {
          params: {
            api_key: process.env.REACT_APP_API_KEY,
          },
        }
      );
      //create random number between 0 and the length of the array
      const random = Math.floor(Math.random() * results.data.data.length);
      setDataLoser(results.data.data[random].images.original.url);
    };

    const fetchDataHighscore = async () => {
      const results = await axios(
        "https://api.giphy.com/v1/gifs/search?q=winner",
        {
          params: {
            api_key: process.env.REACT_APP_API_KEY,
          },
        }
      );
      //create random number between 0 and the length of the array
      const random = Math.floor(Math.random() * results.data.data.length);
      setDataHighscore(results.data.data[random].images.original.url);
    };
    fetchDataHighscore();
    fetchDataLoser();
  }, []);

  const renderGifs = () => {
    if (score > localStorage.getItem("current high score") && isAuth === true) {
      return (
        <Stack justifyContent="center">
          <h1>New High Score! 🏆🏆</h1>
          <div>
            <img src={datahighscore} alt="" />
          </div>
        </Stack>
      );
    } else {
      return (
        <div>
          <img src={dataloser} alt="" />
        </div>
      );
    }
  };

  return (
    <div className={gameover.container2}>
      <div className={gameover.center2}>{renderGifs()}</div>

      <div className={gameover.again}>
        <Button onClick={() => navigate("/")}>Play again</Button>
      </div>
      <Typography variant="h5" className={gameover.score}>
        Score: {score}
      </Typography>
    </div>
  );
}
