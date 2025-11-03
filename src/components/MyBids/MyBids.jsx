import React from "react";
import { use } from "react";
import { useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useState } from "react";
import Swal from "sweetalert2";

const MyBids = () => {
  const { user } = use(AuthContext);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:3001/bids?email=${user?.email}`, {
        headers: {
          authorization: `Bearer ${user?.accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setBids(data);
        });
    }
  }, [user]);

  const handleDeleteBid = (id) => {
    console.log(id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3001/bids/${id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            if (data.acknowledged) {
              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
              });

              // Set data in ui
              const remainingBids = bids.filter((bid) => bid._id !== id);
              setBids(remainingBids);
            } else {
              Swal.fire({
                title: "Cant Delete Try again please!",
                text: "Your file can't deleted.",
                icon: "error",
              });
            }
          });
      }
    });
  };

  return (
    <div>
      <h3>My Bids : {bids.length} </h3>

      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Seller</th>
              <th>Bid Price</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {bids.map((bid, idx) => (
              <tr key={bid?._id}>
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
                <td>{bid?.buyer_email}</td>

                <td> {bid?.bid_pirce} </td>
                <td>
                  <div className="badge badge-warning">{bid.status}</div>
                </td>

                <th>
                  <button
                    onClick={() => handleDeleteBid(bid?._id)}
                    className="btn btn-outline btn-xs"
                  >
                    Remove Bid
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyBids;
