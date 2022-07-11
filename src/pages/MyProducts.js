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
      var listingRef = collection(db, "cycles");
      var q = query(
        listingRef,
        where("useRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      var querySnap = await getDocs(q);
      // console.log("query snap here, ", querySnap);
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          productdiv: "cycle",
          data: doc.data(),
        });
      });
      listingRef = collection(db, "books");
      q = query(
        listingRef,
        where("useRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      querySnap = await getDocs(q);
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          productdiv: "book",
          data: doc.data(),
        });
      });
      listingRef = collection(db, "electronics");
      q = query(
        listingRef,
        where("useRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      querySnap = await getDocs(q);
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          productdiv: "electronic",
          data: doc.data(),
        });
      });
      listingRef = collection(db, "fashions");
      q = query(
        listingRef,
        where("useRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      querySnap = await getDocs(q);
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          productdiv: "fashion",
          data: doc.data(),
        });
      });
      listingRef = collection(db, "matresss");
      q = query(
        listingRef,
        where("useRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      querySnap = await getDocs(q);
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          productdiv: "matress",
          data: doc.data(),
        });
      });
      listingRef = collection(db, "others");
      q = query(
        listingRef,
        where("useRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      querySnap = await getDocs(q);
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          productdiv: "other",
          data: doc.data(),
        });
      });
      // console.log(listings);
      setListings(listings);
      setLoading(false);
    };
    fetchUserListings();
  }, [auth.currentUser.uid]);
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  //delete handler
  const onDelete = async (listingId, listingCat) => {
    if (window.confirm("Are You Sure  want to delete ?")) {
      // await deleteDoc(doc, (db, "listings", listingId));
      await deleteDoc(doc(db, `${listingCat}s`, listingId));
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      );
      setListings(updatedListings);
      toast.success("Listing Deleted Successfully");
    }
  };

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