import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { getAuth, updateProfile } from "firebase/auth";
import { db } from "../firebase.config";
import { FaEdit, FaArrowAltCircleRight } from "react-icons/fa";
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import ListingItem from "../components/ListingItem";
import "../styles/myproducts.css"
import { url } from "./links";
import { onDeleteUtil } from "../components/utilOnDelete";


const MyProducts = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);

  //useeffect for getting data
  useEffect(() => {
    const fetchUserListings = async () => {
      // setLoading(true);
      let listings = [];

      fetch(`${url}/get_my_prod`, {
        method: 'POST',
        body: JSON.stringify({
          useRef: auth.currentUser.uid
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
       .then((response) => response.json())
       .then((data) => {
          console.log(data)
          console.log("successfully fetched the doc from elasticsearch");
          data['hits']['hits'].forEach((doc) => {
            return listings.push({
              id: doc['_id'],
              productdiv: doc['_source']['productdiv'],
              data: doc['_source'],
            });
          });
          setListings(listings);
          console.log("listings:", listings);
          setLoading(false);
       })
       .catch((err) => {
          console.log(err.message);
       });
    };
    fetchUserListings();
  }, [auth.currentUser.uid]);
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  // delete handler
  const onDelete = async (listingId, listingCat) => {
    await onDeleteUtil(listingId, listingCat);
    const updatedListings = listings.filter(
      (listing) => listing.id !== listingId
    );
    setListings(updatedListings);
  }


  //edit handler
  const onEdit = (listingId, listingCat) => {
    navigate(`/editlisting/${listingCat}/${listingId}`);
  };
  return (
    <Layout>
      <div className="container mt-4 w-50 d-flex justify-content-between">
        <Link to="/create-listing">
          <FaArrowAltCircleRight color="primary" /> Sell or Rent Your Product
        </Link>
      </div>
      <div className="container">
        {listings && listings?.length > 0 && (
          <>
            <div className="center">
              <h4>Your Listings:</h4>
            </div>
            <div>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  productdiv = {listing.productdiv}
                  id={listing.id}
                  onDelete={() => onDelete(listing.id, listing.productdiv)}
                  onEdit={() => onEdit(listing.id, listing.productdiv)}
                />
              ))}
            </div>
          </>
        )}
        {listings && listings?.length == 0 && (
          <>
            <div>
              <h4>You have no produts uploaded</h4>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default MyProducts;
