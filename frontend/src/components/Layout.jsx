
import React from "react";
import { Box, Toolbar } from "@mui/material";
import Header from "./Header";
import CerrarSesion from "../hooks/cerrarSesion";

export default function Layout({ children }) {

  return (
    <>
      <Header  />
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
