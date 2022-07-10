import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import { query, orderBy, limit, getDocs, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase-config";

export default function Leaderboard({ isAuth }) {
  const scoresCollectionRef = collection(db, "UserScores");
  const [scoreList, setScoreList] = useState([]);

  useEffect(() => {
    const getScoresLeaderBoard = async () => {
      const data = await getDocs(
        query(scoresCollectionRef, orderBy("score", "desc"))
      );
      setScoreList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getScoresLeaderBoard();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            {isAuth ? (
              <TableCell>Player id (your id: {auth.currentUser.uid})</TableCell>
            ) : (
              <TableCell>Player id (sign in to see your id)</TableCell>
            )}
            <TableCell>HighScore</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {scoreList.map((score) => (
            <TableRow key={score.id}>
              <TableCell>{score.id}</TableCell>
              <TableCell>{score.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    /* // <div>
    //   {isAuth ? (
    //     <div>Your user id is: {auth.currentUser.uid}</div>
    //   ) : (
    //     <div>You are not logged in, login to save highscore!</div>
    //   )}

    //   {scoreList.map((entry) => (
    //     <div>
    //       <br />
    //       <div>Player id: {entry.id}</div>
    //       <div>Player highscore: {entry.score}</div>
    //     </div>
    //   ))}
    // </div> */
  );
}
