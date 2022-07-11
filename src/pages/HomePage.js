import React from "react";
import Layout from "../components/Layout/Layout";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <Layout>
      <div className="container mt-3">
        <div className="row">
          <h1>Categories</h1>
          <div className="col-md-5">
            <div className="Imagecontainer">
              <img src="/rentbike.jpg" alt="cycles" />
              <button
                className="btn"
                onClick={() => navigate("/category/cycle")}
              >
                Cycles
              </button>
            </div>
          </div>
          <div className="col-md-5">
            <div className="Imagecontainer">
              <img src="/books2.jpg" alt="books" />
              <button
                className="btn"
                onClick={() => navigate("/category/book")}
              >
                Books
              </button>
            </div>
          </div>
          <div className="col-md-5">
            <div className="Imagecontainer">
              <img src="/saleimg.jpg" alt="electronics" />
              <button
                className="btn"
                onClick={() => navigate("/category/electronic")}
              >
                Electronics
              </button>
            </div>
          </div>
          <div className="col-md-5">
            <div className="Imagecontainer">
              <img src="/fash.jpg" alt="fashion" />
              <button
                className="btn"
                onClick={() => navigate("/category/fashion")}
              >
                Fashion
              </button>
            </div>
          </div>
          <div className="col-md-5">
            <div className="Imagecontainer">
              <img src="/matt.jpg" alt="mattress" />
              <button
                className="btn"
                onClick={() => navigate("/category/matress")}
              >
                Matress
              </button>
            </div>
          </div>
          <div className="col-md-5">
            <div className="Imagecontainer">
              <img src="/other.png" alt="other" />
              <button
                className="btn"
                onClick={() => navigate("/category/other")}
              >
                Others
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
