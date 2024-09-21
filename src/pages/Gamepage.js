import Videos from "../components/Videos";
import gamepage from "./gamepage.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import CountUp from "react-countup";
import {
  collection,
  getDocs,
  where,
  query,
  setDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { Paper, Typography, Button } from "@mui/material";
import useSound from "use-sound";
import errorSound from "../audio/error.mp3";
import correctSound from "../audio/correct.mp3";

function Gamepage() {
  let navigate = useNavigate();

  //Error and correct sound after answer
  const [playError] = useSound(errorSound, { volume: 0.1 });
  const [playCorrect] = useSound(correctSound, { volume: 0.1 });

  const [numViews1, setNumViews1] = useState();
  const [numViews2, setNumViews2] = useState();
  const [Video1, setVideo1] = useState();
  const [Video2, setVideo2] = useState();
  const [conditionButton, setConditionButton] = useState(true);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [vs, setVs] = useState("");
  const [highscore, setHighscore] = useState(0);

  const scoresCollectionRef = collection(db, "UserScores"); //reference to the collection in firebase

  const storeScore = async () => {
    await setDoc(doc(db, "UserScores", auth.currentUser.uid), {
      score, //same thing as score: score (same variable)
      name: auth.currentUser.displayName,
      id: auth.currentUser.uid,
    });
  };

  const UpdateScore = async () => {
    const q = query(
      scoresCollectionRef,
      where("id", "==", auth.currentUser.uid)
    );
    const snapshot = await getDocs(q);
    if (
      snapshot.docs[0] === undefined ||
      snapshot.docs[0].data().score < score // if the user has no score or if the user's score is lower than the current score then we store score as new high score
    ) {
      storeScore();
    }
  };

  const getHighScore = async () => {
    const q = query(
      scoresCollectionRef,
      where("id", "==", auth.currentUser.uid)
    );
    const snapshot = await getDocs(q);
    if (snapshot.docs[0] !== undefined) {
      localStorage.setItem("current high score", snapshot.docs[0].data().score);
    }
  };

  const getVideos = (newgame) => {
    if (newgame === true) {
      //if new game is true then we get new videos for both video 1 and video 2
      setVs("VS");
      setIsLoading(true);
      axios
        .get("https://higherlowerapifinal-production.up.railway.app/")
        .then((res) => {
          setNumViews1(res.data["video1_views"]);
          setNumViews2(res.data["video2_views"]);
          setVideo1(res.data["video1_id"]);
          setVideo2(res.data["video2_id"]);
          setConditionButton(true);
          setAnswer("");
          setIsLoading(false);
        });
    } else {
      //if new game is false then we set video 1 and video 1 views to previous video 2 and video 2 views
      setVs("⬅"); // left arrow represents that previous video 2 is now video 1
      setVideo1(Video2);
      setNumViews1(numViews2);
      setIsLoading(true); //we set isLoading to true so that we can see the spinner
      axios
        .get("https://higherlowerapifinal-production.up.railway.app/")
        .then((res) => {
          setNumViews2(res.data["video2_views"]); // only getting data for new video 2 as video 1 is the previous video 2
          setVideo2(res.data["video2_id"]);
          setConditionButton(true); //we set conditionButton to true so that we can see the button
          setAnswer(""); //right not answer is empty because the user hasn't selected an answer yet
          setIsLoading(false); //stop spinner
          setVs("VS"); //show vs between the two videos now that they have finished switching and loading
        });
    }
  };

  useEffect(() => {
    getVideos(true); // fetch video data for both video 1 and video 2. since its a new game there isn't any previous video 2 for video 1 to become
    getHighScore();
  }, []);

  const CorrectIncorrect = () => {
    //function to display correct or incorrect depending on the answer
    if (answer === "Correct") {
      console.log(localStorage.getItem("current high score"));
      return (
        <Typography variant="h3" color="success.main">
          Correct
        </Typography>
      );
    } else if (answer === "Incorrect") {
      console.log(localStorage.getItem("current high score"));
      return (
        <Typography variant="h3" color="error">
          Incorrect
        </Typography>
      );
    }
  };

  return (
    <Paper variant="outlined">
      <div className={gamepage.container}>
        <div className={gamepage.title}>
          <Typography variant="h5">Higher or Lower 📽️</Typography>
        </div>
        <div className={gamepage.vs}>{vs}</div>
        {/*Answer*/}
        <div className={gamepage.answer}>{CorrectIncorrect()}</div>
        {/*Score*/}
        <div className={gamepage.score}>
          <h1> Score: {score}</h1>
        </div>

        <div className={gamepage.videoone}>
          <Videos videoid={Video1} />{" "}
          {/*video component takes in the url of the video1*/}
        </div>

        <div className={gamepage.views1}>
          <h1>
            <CountUp end={numViews1} separator="," duration={0.01} />{" "}
            {/*number of views for  video1*/}
          </h1>
        </div>
        {isLoading ? ( //if isLoading is true then we show the spinner where video2 is
          <>
            <div className={gamepage.videotwo}>
              <TailSpin color="#00BFFF" height={80} width={80} />
            </div>
          </>
        ) : (
          //if isLoading is false then we show the following:
          <>
            {/*video 2 embedded*/}
            <div className={gamepage.videotwo}>
              <Videos videoid={Video2} />
            </div>

            <div className={gamepage.buttons}>
              {conditionButton ? (
                <>
                  {/*Higher button*/}
                  <Button
                    onClick={() => {
                      setConditionButton(false); //shows the h1 for views2 below
                      console.log(numViews1, numViews2);
                      if (parseInt(numViews2, 10) >= parseInt(numViews1, 10)) {
                        console.log("Correct");
                        setTimeout(() => {
                          setAnswer("Correct");
                        }, 1000);
                        playCorrect();
                        setTimeout(() => {
                          getVideos(false);
                          setScore(score + 1);
                        }, 1750);
                      } else {
                        console.log("Incorrect");
                        UpdateScore();
                        setTimeout(() => {
                          setAnswer("Incorrect");
                        }, 1000);

                        playError();

                        setTimeout(() => {
                          navigate("/gameover", {
                            state: { score: score },
                          });
                        }, 2000);
                      }
                    }}
                  >
                    Higher
                  </Button>
                  {/*Lower button*/}
                  <Button
                    onClick={() => {
                      setConditionButton(false); //shows the h1 for views2 below
                      if (parseInt(numViews2, 10) < parseInt(numViews1, 10)) {
                        console.log(numViews1, numViews2);
                        console.log("Correct");
                        setTimeout(() => {
                          setAnswer("Correct");
                        }, 1000);
                        playCorrect();

                        setTimeout(() => {
                          getVideos(false);
                          setScore(score + 1);
                        }, 1750);
                      } else {
                        console.log("Incorrect");
                        UpdateScore();
                        setTimeout(() => {
                          setAnswer("Incorrect");
                        }, 1000);
                        playError();
                        setTimeout(() => {
                          navigate("/gameover", {
                            state: { score: score },
                          });
                        }, 2000);
                      }
                    }}
                  >
                    Lower
                  </Button>
                </>
              ) : (
                <h1>
                  {<CountUp end={numViews2} separator="," duration={0.5} />}
                </h1>
              )}
            </div>
          </>
        )}
      </div>
    </Paper>
  );
}

export default Gamepage;
