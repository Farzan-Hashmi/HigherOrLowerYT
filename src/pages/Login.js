import React from "react";
import GoogleButton from "react-google-button";
import { auth, provider } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login({ setIsAuth }) {
  let navigate = useNavigate();

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      setIsAuth(true);
      navigate("/");
    }); //result contains all the information about the user that is logged in
  };
  return (
    <div>
      <p>Sign in with Google</p>
      <GoogleButton onClick={signInWithGoogle} />
    </div>
  );
}
