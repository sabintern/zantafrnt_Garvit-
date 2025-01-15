import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
const SecureRoute = ({ children }) => {
  // You can replace this with your actual authentication check logic
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  //  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated || isAuthenticated === "false") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default SecureRoute;
