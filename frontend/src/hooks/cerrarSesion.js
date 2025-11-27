import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Typography,
  Box,
  LinearProgress,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const CerrarSesion = ({ tiempoSalida = 30 }) => {
  const navegar = useNavigate();
  const [mostrarDialogo, setMostrarDialogo] = useState(false);
  const [contador, setContador] = useState(5);
  const [progreso, setProgreso] = useState(100);

  const temporizadorInactividad = useRef(null);
  const temporizadorContador = useRef(null);
  const temporizadorProgreso = useRef(null);

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem("token");
    setMostrarDialogo(true);
    setContador(5);
    setProgreso(100);

    temporizadorContador.current = setInterval(() => {
      setContador((prev) => {
        if (prev <= 1) {
          clearInterval(temporizadorContador.current);
          clearInterval(temporizadorProgreso.current);
          navegar("/login");
        }
        return prev - 1;
      });
    }, 1000);

    const duracion = 5000;
    const pasos = 50;
    const decremento = 100 / pasos;
    let progresoActual = 100;

    temporizadorProgreso.current = setInterval(() => {
      progresoActual -= decremento;
      setProgreso(progresoActual);
    }, duracion / pasos);
  }, [navegar]);

  const reinicioTiempo = useCallback(() => {
    clearTimeout(temporizadorInactividad.current);
    temporizadorInactividad.current = setTimeout(
      cerrarSesion,
      tiempoSalida * 60 * 1000
    );
  }, [cerrarSesion, tiempoSalida]);

  useEffect(() => {
    const eventos = ["mousemove", "keydown", "click"];
    eventos.forEach((event) => window.addEventListener(event, reinicioTiempo));
    reinicioTiempo();

    return () => {
      eventos.forEach((event) =>
        window.removeEventListener(event, reinicioTiempo)
      );
      clearTimeout(temporizadorInactividad.current);
      clearInterval(temporizadorContador.current);
      clearInterval(temporizadorProgreso.current);
    };
  }, [reinicioTiempo]);

  const handleCerrarDialogo = () => {
    setMostrarDialogo(false);
    clearInterval(temporizadorContador.current);
    clearInterval(temporizadorProgreso.current);
    navegar("/login");
  };

  return (
    <AnimatePresence>
      {mostrarDialogo && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4 }}
        >
          <Dialog
            open={mostrarDialogo}
            onClose={handleCerrarDialogo}
            PaperProps={{
              sx: {
                borderRadius: "16px",
                backgroundColor: "#fff",
                boxShadow: "0 6px 25px rgba(0,0,0,0.2)",
              },
            }}
            BackdropProps={{
              sx: {
                backgroundColor: "rgba(9, 33, 129, 0.2)",
                backdropFilter: "blur(3px)",
              },
            }}
          >
            <DialogTitle
              sx={{ fontWeight: "bold", textAlign: "center", pb: 0 }}
            >
              Sesión Expirada
            </DialogTitle>

            <DialogContent>
              <DialogContentText
                sx={{ textAlign: "center", mb: 2, color: "#333" }}
              >
                Tu sesión ha expirado por inactividad. Serás redirigido al
                inicio de sesión en unos segundos.
              </DialogContentText>

              {/*  Contador numérico */}
              <Box display="flex" justifyContent="center" mb={1}>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                      color: "#092181",
                    }}
                  >
                    {contador}s
                  </Typography>
                </motion.div>
              </Box>

              <LinearProgress
                variant="determinate"
                value={progreso}
                sx={{
                  height: 8,
                  borderRadius: "5px",
                  backgroundColor: "#e0e0e0",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#092181",
                    transition: "width 0.2s linear",
                  },
                }}
              />
            </DialogContent>

            <DialogActions sx={{ justifyContent: "center", p: 2 }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleCerrarDialogo}
                  variant="contained"
                  color="primary"
                  sx={{
                    textTransform: "capitalize",
                    fontWeight: "bold",
                    backgroundColor: "#092181",
                    "&:hover": { backgroundColor: "#07165a" },
                  }}
                >
                  Ir al inicio de sesión ahora
                </Button>
              </motion.div>
            </DialogActions>
          </Dialog>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CerrarSesion;
