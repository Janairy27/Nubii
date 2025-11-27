import React from "react";
import { Box } from "@mui/material";
import HeaderProf from "./HeaderProf";
import CerrarSesion from "../hooks/cerrarSesion";

export default function Layout({ children }) {
  return (
    <>
      <HeaderProf />
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
