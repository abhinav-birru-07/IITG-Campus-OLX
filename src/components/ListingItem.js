import React from "react";
import { Link } from "react-router-dom";
// import {FcElectronics} from "react-icons/fc";
// import { BsBicycle } from "react-icons/bs";
const ListingItem = ({ listing, productdiv, id, onDelete, onEdit }) => {
  return (
    <>
      <div className="d-flex align-items-center justify-content-center">
        <div className="card category-link mb-2" style={{ width: "800px" }}>
          <Link to={`/category/${productdiv}/${id}`}>
            <div className="row container p-2">
              <div className="col-md-5">
                <img
                  src={listing.imgUrls[0]}
                  className="img-thumbnail"
                  alt={listing.name}
                  height={200}
                  width={300}
                />
              </div>
              <div className="col-md-5">
                <h2>{listing.name}</h2>
                <p>
                  Rs : {listing.price}
                </p>
              </div>
            </div>
          </Link>
          <div>
            {onDelete && (
              <button
                className="btn btn-danger"
                onClick={() => onDelete(listing.id, listing.productdiv)}
              >
                Delete Listing
              </button>
            )}
            {onEdit && (
              <button
                className="btn btn-info ms-3"
                onClick={() => onEdit(listing.id, listing.productdiv)}
              >
                Edit Listing
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingItem;