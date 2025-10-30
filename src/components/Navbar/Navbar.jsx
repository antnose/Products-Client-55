import { use } from "react";
import { Link, NavLink } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";

const Navbar = () => {
  const { loading, user, signOutUser } = use(AuthContext);
  const links = (
    <>
      <NavLink to={"/"}>Home</NavLink>
      <NavLink to={"/allProducts"}>All Products</NavLink>
    </>
  );

  if (loading) {
    return;
  }

  const handleSignOut = () => {
    signOutUser()
      .then(() => {
        // Success! Use a beautiful SweetAlert2 dialog
        Swal.fire({
          title: "Signed Out!",
          text: "You have been successfully logged out. Come back soon!",
          icon: "success", // Green checkmark
          confirmButtonText: "OK",
          timer: 3000, // Auto-close after 3 seconds
          timerProgressBar: true,
        });
      })
      .catch((error) => {
        // Failure! A slightly less awesome, but still helpful, dialog
        Swal.fire({
          title: "Logout Failed",
          text:
            "We couldn't log you out. Please try again. (Details: " +
            error.message +
            ")",
          icon: "error", // Red 'X'
          confirmButtonText: "Understood",
        });
        console.error("Failed to logout:", error); // Use console.error for actual errors
      });
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {links}
          </ul>
        </div>
        <a className="btn btn-ghost text-xl text-purple-600">Smart Deals</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-x-5">{links}</ul>
      </div>
      <div className="navbar-end">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="avatar placeholder cursor-pointer"
              >
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center ring-2 ring-purple-200 hover:ring-purple-400 transition-all">
                  <img
                    src={user.photoURL}
                    alt={user.displayName.charAt(0)}
                    className="rounded-full"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-50 menu p-2 shadow bg-base-100 rounded-box w-52 mt-4"
              >
                <li className="px-4 py-2 border-b">
                  <span className="text-sm font-semibold">
                    {user.displayName || user.email}
                  </span>
                </li>
                <li>
                  <a>My Profile</a>
                </li>
                <li>
                  <a>My Bids</a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li className="border-t mt-2">
                  <button
                    onClick={handleSignOut}
                    className="text-red-500 hover:text-red-600 font-medium"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to={"/login"}
              className="btn btn-outline border-purple-500 text-purple-600 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-300"
            >
              Login
            </Link>
            <Link
              to={"/register"}
              className="btn bg-gradient-to-r from-purple-600 to-blue-600 text-white border-none hover:from-purple-700 hover:to-blue-700 shadow-md hover:shadow-lg transition-all"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
