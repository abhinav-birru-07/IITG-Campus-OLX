import React, { useState } from "react";
import Layout from "../components/Layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const onSubmitHandler = async(event) => {
    event.preventDefault()
    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth, email)
      toast.success("Email was sent")
      navigate("/signin")
    } catch (error) {
      toast.error("Something Went Wrong")
    }
  }
  return (
    <Layout>
      <div className="container mt-4">
        <h1>Reset Password</h1>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-primary">
              Reset
            </button>
            <Link to="/signin">Sign In</Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
