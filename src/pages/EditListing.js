import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "./../components/Layout/Layout";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Spinner from "../components/Spinner";
import { AiOutlineFileAdd } from "react-icons/ai";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { db } from "../firebase.config";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { url } from "./links";

const EditListing = () => {
  const [loading, setLoading] = useState(false);
  const [listing, setLisitng] = useState(null);
  const params = useParams();
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    productdiv: "cycle",
    description: "",
    address: "",
    price: 100,
    images: {},
  });

  const {
    type,
    name,
    description,
    address,
    price,
    images,
  } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        setFormData({
          ...formData,
          useRef: user.uid,
        });
      });
    } else {
      navigate("/signin");
    }

    // eslint-disable-next-line
  }, []);
  //useEffect to check logi user
  useEffect(() => {
    if (listing && listing.useRef !== auth.currentUser.uid) {
      toast.error("You Can Not Edit This Lisitng");
      navigate("/");
    }
  }, [listing, auth.currentUser.uid, navigate]);

  useEffect(() => {
    setLoading(true);
    const fetchListing = async () => {
      fetch(`${url}/fetch_doc_id`, {
        method: 'POST',
        body: JSON.stringify({
          doc_id: params.listingId
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then((response) => response.json())
      .then((data) => {
        if(data){
          console.log("fetched based on id")
          console.log(data)
          setLisitng(data['_source'])
          setFormData({
            type: data['_source']['type'],
            name: data['_source']['name'],
            productdiv: data['_source']['productdiv'],
            description: data['_source']['description'],
            address: data['_source']['address'],
            price: data['_source']['price'],
            images: null,
          })
          setLoading(false)
        }else{
          navigate("/");
          toast.error("Product does not exist");
        }
      })
    };
    fetchListing();
  }, [navigate, params.listingId]);

  if (loading) {
    return <Spinner />;
  }

  //mutate func
  const onChangeHandler = (e) => {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    //files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    //text/booleans/number
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  //form submit
  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    // console.log(formData);
    if (images > 6) {
      setLoading(false);
      toast.error("Max 6 Images can be selected");
      return;
    }

    //store images to firebase storage
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, "images/" + fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("upload is" + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                // console.log("upload is paused");
                break;
              case "running":
                // console.log("upload is runnning");
                break;
              default:
                break;
            }
          },
          (error) => {
            reject(error);
          },
          //success
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };
    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });
    let timeAdded = (new Date()).toISOString()
    timeAdded = timeAdded.split('T')[0] + ' ' + timeAdded.split('T')[1].slice(0, -1);
    //save form data
    const formDataCopy = {
      ...formData,
      imgUrls,
      // geoLocation,
      // timestamp: serverTimestamp(),
      timeAdded: timeAdded
    };
    formData.location = address;
    delete formDataCopy.images;
    fetch(`${url}/update_prod`, {
      method: 'POST',
      body: JSON.stringify({
        ...formDataCopy,
        prodId: params.listingId
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    })
    // .then((response) => response.json())
    .then((data) => {
      console.log(data);
      setLoading(false);
      toast.success("Listing updated!!");
      navigate(`/category/${formDataCopy.productdiv}/${params.listingId}`);
    })
    .catch((err) => {
      console.log("issue in editing the required product!");
      console.log(err.message);
    })
    // const docRef = doc(db, `${params.listingCat}s`, params.listingId);
    // await updateDoc(docRef, formDataCopy);
  };

  return (
    <Layout>
      <div className="container d-flex flex-column align-items-center justify-content-center mb-4">
        <h3 className="mt-3 w-50 bg-dark text-light p-2 text-center">
          Update Listing &nbsp;
          <AiOutlineFileAdd />
        </h3>
        {/* sell rent button */}
        <form className="w-50 bg-light p-4" onSubmit={onSubmit}>
        <p>Product For:</p>
          <div className="d-flex flex-row mt-4">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                value="rent"
                onChange={onChangeHandler}
                defaultChecked
                name="type"
                id="type"
              />
              <label className="form-check-label" htmlFor="rent">
                Rent
              </label>
            </div>
            <div className="form-check ms-3">
              <input
                className="form-check-input"
                type="radio"
                name="type"
                value="sale"
                onChange={onChangeHandler}
                id="type"
              />
              <label className="form-check-label" htmlFor="sale">
                Sale
              </label>
            </div>
          </div>
          {/* name */}
          <div className="mb-3 mt-4">
            <label htmlFor="name" className="form-label">
              Product Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={onChangeHandler}
              required
            />
          </div>






          <p>Product For:</p>
          <div className="">
            <div className="form-check ms-3">
              <input
                className="form-check-input"
                type="radio"
                value="cycle"
                onChange={onChangeHandler}
                defaultChecked
                name="productdiv"
                id="productdiv"
              />
              <label className="form-check-label" htmlFor="cycle">
                Cycle
              </label>
            </div>
            <div className="form-check ms-3">
              <input
                className="form-check-input"
                type="radio"
                value="book"
                onChange={onChangeHandler}
                name="productdiv"
                id="productdiv"
              />
              <label className="form-check-label" htmlFor="book">
                Book
              </label>
            </div>
            <div className="form-check ms-3">
              <input
                className="form-check-input"
                type="radio"
                value="electronic"
                onChange={onChangeHandler}
                name="productdiv"
                id="productdiv"
              />
              <label className="form-check-label" htmlFor="electronic">
                electronic
              </label>
            </div>
            <div className="form-check ms-3">
              <input
                className="form-check-input"
                type="radio"
                value="fashion"
                onChange={onChangeHandler}
                name="productdiv"
                id="productdiv"
              />
              <label className="form-check-label" htmlFor="fashion">
                fashion
              </label>
            </div>
            <div className="form-check ms-3">
              <input
                className="form-check-input"
                type="radio"
                value="matress"
                onChange={onChangeHandler}
                name="productdiv"
                id="productdiv"
              />
              <label className="form-check-label" htmlFor="matress">
                matress
              </label>
            </div>
            <div className="form-check ms-3">
              <input
                className="form-check-input"
                type="radio"
                value="other"
                onChange={onChangeHandler}
                name="productdiv"
                id="productdiv"
              />
              <label className="form-check-label" htmlFor="other">
                other
              </label>
            </div>
          </div>
          

          






          <div className="mb-3">
            <label htmlFor="address">About the Product</label>
            <textarea
              className="form-control"
              placeholder="Describe the product..."
              id="description"
              value={description}
              onChange={onChangeHandler}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="address">Address :</label>
            <textarea
              className="form-control"
              placeholder="Enter Your Address (Hostel name & Room number)"
              id="address"
              value={address}
              onChange={onChangeHandler}
              required
            />
          </div>
          <div className="mb-3 mt-4">
            <label htmlFor="name" className="form-label">
              Price :
            </label>
            <div className=" d-flex flex-row ">
              <input
                type="number"
                className="form-control w-50 "
                id="price"
                name="price"
                value={price}
                onChange={onChangeHandler}
                required
              />
              {type === "rent" && <p className="ms-4 mt-2">per day</p>}
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="formFile" className="form-label">
              select images :
            </label>
            <input
              className="form-control"
              type="file"
              id="images"
              name="images"
              onChange={onChangeHandler}
              max="6"
              accept=".jpg,.png,.jpeg"
              multiple
              required
            />
          </div>
          {/* submit button */}
          <div className="mb-3">
            <input
              className="btn btn-primary w-100"
              type="submit"
              value="Update Listing"
            />
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditListing;