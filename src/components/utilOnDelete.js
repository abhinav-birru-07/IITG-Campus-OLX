import { url } from "../pages/links";
import { toast } from "react-toastify";


export const onDeleteUtil = async (listingId, listingCat) => {
    console.log("listing id: ", listingId);
    if (window.confirm("Are You Sure  want to delete ?")) {
      fetch(`${url}/del_my_prod`, {
        method: 'POST',
        body: JSON.stringify({
          prodId: listingId
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
       .then((response) => response.json())
       .then((data) => {
          console.log(data);
       })
       .catch((err) => {
          console.log(err.message);
       });
      // await deleteDoc(doc, (db, "listings", listingId));
      // await deleteDoc(doc(db, `${listingCat}s`, listingId));
      toast.success("Listing Deleted Successfully");
    }
  };