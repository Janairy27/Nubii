import React, { useEffect, useState } from "react";
import { Box, Toolbar, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HeaderAd from "./HeaderAdmin";
import CerrarSesion from "../hooks/cerrarSesion";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (role !== "1" || !token) {
      navigate("/login");
      return;
    }
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  return (
    <>
      <HeaderAd />
      <Box
        component="main"
        sx={{
          minHeight: "100vh",
          width: "100%",
          overflowX: "hidden",
        }}
      >
        {children}
      </Box>
      <CerrarSesion tiempoSalida={30} />
    </>
  );
}
