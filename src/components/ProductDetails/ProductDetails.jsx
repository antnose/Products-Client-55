import { use } from "react";
import { useRef } from "react";
import { useLoaderData } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { useState } from "react";

const ProductDetails = () => {
  const [bids, setBids] = useState([]);
  const product = useLoaderData();
  const bidModalRef = useRef(null);
  const { user } = use(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      await fetch(`http://localhost:3001/products/bids/${product._id}`, {
        headers: {
          authorization: `Bearer ${user.accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Bids for this product", data);
          setBids(data);
        });
    };

    fetchData();
  }, [product._id, user]);

  const handleBidModalOpen = () => {
    bidModalRef.current.showModal();
  };

  const handleBidSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const bid = form.bid.value;
    const productId = product._id;
    console.log(name, email, bid, productId);
    const newBid = {
      productId,
      buyer_name: name,
      buyer_email: email,
      buyer_image: user?.photoURL,
      bid_pirce: bid,
      status: "pending",
    };

    fetch(`http://localhost:3001/bids`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newBid),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("After placing bid", data);
        if (data.insertedId) {
          bidModalRef.current.close();
        }
        Swal.fire({
          title: "Bid Place Successfully",
          icon: "success",
          draggable: true,
        });

        // Add the new bid to the state
        newBid._id = data.insertedId;
        setBids([...bids, newBid].sort((a, b) => b.bid_pirce - a.bid_pirce));
      });
  };

  return (
    <div>
      {/* Product Info */}
      <div>
        <div></div>
        <div>
          <button onClick={handleBidModalOpen} className="btn bg-purple-600">
            I want to Buy This Product
          </button>

          {/* Open the modal using document.getElementById('ID').showModal() method */}
          <dialog
            ref={bidModalRef}
            className="modal modal-bottom sm:modal-middle"
          >
            <div className="modal-box">
              <h3 className="font-bold text-lg">Give the best offer seller!</h3>
              <p className="py-4">Offer something seller can not resist</p>

              <form onSubmit={handleBidSubmit}>
                <fieldset className="fieldset">
                  <label className="label">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="input"
                    defaultValue={user?.displayName}
                    readOnly={true}
                  />

                  <label className="label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="input"
                    defaultValue={user?.email}
                    readOnly={true}
                  />

                  <label className="label">Bid Amount</label>
                  <input
                    name="bid"
                    type="number"
                    className="input"
                    placeholder="Enter your amount"
                  />

                  <button type="submit" className="btn btn-neutral mt-4">
                    Place your bid
                  </button>
                </fieldset>
              </form>

              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>

      {/* bids for this product */}
      <div>
        <h3 className="text-3xl font-bold">
          Bids for this Product:{" "}
          <span className="text-purple-600"> {bids.length} </span>
        </h3>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>SL No.</th>
                <th>Buyer Name</th>
                <th>Buyer Email</th>
                <th>Bid Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {bids.map((bid, idx) => (
                <tr>
                  <th> {idx + 1} </th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img
                            src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                            alt="Avatar Tailwind CSS Component"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold"> {bid?.buyer_name} </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    {bid?.buyer_email}
                    <br />
                  </td>

                  <td>{bid?.bid_pirce} </td>
                  <th>
                    <button className="btn btn-ghost btn-xs">details</button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
