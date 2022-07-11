import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { async } from "@firebase/util";

const OAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const onGoogleAuthHandler = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const docRef = doc(db, "users", user.uid);
      console.log("userrr  ", docRef.data());
      // console.log("test  --  ", user.data());
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (error) {
      toast.error("Problem with Google Auth");
    }
  };

  return (
    <div>
      <h6 className="mt-2">
        Sign {location.pathname === "/signup" ? "Up " : "In "}With &nbsp;
        <button onClick={onGoogleAuthHandler}>
          <FcGoogle />
        </button>
      </h6>
    </div>
  );
};

export default OAuth;
