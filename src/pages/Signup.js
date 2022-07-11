import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { toast } from "react-toastify";
import { BsFillEyeFill } from "react-icons/bs";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase.config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import OAuth from "../components/OAuth";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });
  const { name, email, password } = formData;
  const navigate = useNavigate();

  const onChange = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // console.log("USER : ->");
      // console.log(user);
      updateProfile(auth.currentUser, { displayName: name });
      console.log("current user  ");
      // console.log( auth.currentUser);
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timeStamp = serverTimestamp();
      await setDoc(doc(db, "users", user.uid), formDataCopy);
      toast.success("Signup Successfully!");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <div className="d-flex align-items-center justify-content-center w-100 mt-4" id="signupid">
        <form className="bg-light p-4" onSubmit={onSubmitHandler}>
          <h4 className="bg-dark p-2 mt-2 text-light text-center">Sign Up</h4>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Enter Name
            </label>
            <input
              type="text"
              value={name}
              className="form-control"
              id="name"
              onChange={onChange}
              aria-describedby="nameHelp"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={onChange}
              aria-describedby="emailHelp"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="password"
              value={password}
              onChange={onChange}
            />
            <span>
              Show Password
              <BsFillEyeFill
                className="ms-2"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setShowPassword((prevState) => !prevState);
                }}
              />
            </span>
          </div>
          <button type="submit" className="btn btn-primary">
            Sign Up
          </button>
          <div>
            <OAuth />
            <span>Already User ? </span> <Link to="/signin">Login</Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Signup;
