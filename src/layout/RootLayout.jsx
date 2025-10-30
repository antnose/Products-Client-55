import { Outlet } from "react-router";
import Navbar from "../components/Navbar/Navbar";
import { use } from "react";
import { AuthContext } from "../context/AuthContext";
import LoadingPage from "../components/LoadingPage/LoadingPage";

const RootLayout = () => {
  const { loading } = use(AuthContext);
  if (loading) {
    return <LoadingPage />;
  }
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default RootLayout;
