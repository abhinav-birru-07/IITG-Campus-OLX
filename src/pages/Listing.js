import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import { getAuth } from "firebase/auth";
import { useNavigate, Link, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import SwipeCore, { EffectCoverflow, Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/swiper-bundle.min.css";
// import "swiper/swiper.min.css";
import "swiper/css";
import "swiper/css/bundle";

//config
SwipeCore.use([EffectCoverflow, Pagination]);

const Listing = () => {
  const [listing, setListing] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, `${params.categoryName}s`, params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // console.log(docSnap.data());
        setListing(docSnap.data());
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Layout>
      <div className="container d-flex align-items-center justify-content-center mt-4">
        <div className="card" style={{ width: "600px" }}>
          <div className="card-header">
            {listing.imgUrls === undefined ? (
              <Spinner />
            ) : (
              <Swiper
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={1}
                coverflowEffect={{
                  rotate: 50,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: true,
                }}
                pagination={true}
                className="mySwipe"
              >
                {listing.imgUrls.map((url, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={listing.imgUrls[index]}
                      height={300}
                      width={580}
                      alt={listing.name}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
          <div className="card-body">
            <h3>{listing.name}</h3>
            <h6>
              Price : Rs. {" "}
              {listing.price}
              
            </h6>
            <p>Property For : {listing.type === "rent" ? "Rent" : "Sale"}</p>
            
            <Link
              className="btn btn-success"
              to={`/contact/${listing.useRef}?listingName=${listing.name}`}
            >
              Contact Landlord
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Listing;
