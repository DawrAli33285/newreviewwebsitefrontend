import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import AdminLayout from "./components/adminLayout";

const Middleware = () => {
  const token = localStorage.getItem("token");

  return token ? <AdminLayout>
    <Outlet />
  </AdminLayout> : <Navigate to="/" />;
};

export default Middleware;
