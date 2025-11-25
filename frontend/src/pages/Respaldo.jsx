import React, { useEffect, useState } from "react";
import Layout from "../components/LayoutAdmin";
import {
  Box,
  Button,
  Typography,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
  Container,
  Card
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackupIcon from '@mui/icons-material/Backup';
import RestoreIcon from '@mui/icons-material/Restore';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const RespaldoRestauracion = () => {
  const navigate = useNavigate();
  const [respaldo, setRespaldo] = useState([]);
  const [seleccionarRespaldo, setSeleccionarRespaldo] = useState("");
  const [cargar, setCargar] = useState(false);
  // Estados para el Snackbar/Mensajes
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("info"); // Cambiado a 'info' como default

  // Función para mostrar mensajes
  const mostrarMensaje = (msg, severity = "info") => {
    setMensaje(msg);
    setTipo(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };
  const obtenerRespaldo = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/respaldo/obtener-respaldos");
      setRespaldo(res.data);
    } catch (error) {
      console.error(error);
      mostrarMensaje("Error al obtener la lista de respaldos.", "error");
    }
  };

  const hacerRespaldo = async () => {
    setCargar(true);
    try {
      await axios.post("http://localhost:4000/api/respaldo/crear-respaldo");
      mostrarMensaje("Respaldo creado correctamente.", "success");
      obtenerRespaldo();
    } catch (error) {
      mostrarMensaje("Error al crear el respaldo.", "error");
    } finally {
      setCargar(false);
    }
  };

  const seleccionarRestauracion = async () => {
    if (!seleccionarRespaldo) {
      mostrarMensaje("Selecciona un respaldo para restaurar.", "warning");
      return;
    }

    setCargar(true);
    try {
      await axios.post(`http://localhost/api/respaldo/restaurar`, {
        nombreDocumento: seleccionarRespaldo,
      });
      mostrarMensaje("Restauración completada correctamente.", "success");
    } catch (error) {
      mostrarMensaje("Error al restaurar el respaldo.", "error");
    } finally {
      setCargar(false);
    }
  };

  useEffect(() => {
    obtenerRespaldo();
  }, []);

  return (
    <Layout>
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          mt: 4,
          pb: 4,
          minHeight: "100vh",
        }}>
        <Paper
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#F4F6F8",
            width: "100%",
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {/* Título y Cabecera */}
          <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
            mb: 4,
            position: "relative",
          }}>
            <BackupIcon sx={{
              color: "#092181",
              fontSize: 36,
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
            }} />
            <Typography
              variant="h5"
              component="h1"
              fontWeight="bold"
              sx={{
                color: "#092181",
                textAlign: "center",
                letterSpacing: 0.5,

              }}
            >
              Gestión de Respaldo y Restauración
            </Typography>
          </Box>

          {/* Sección de Creación de Respaldo */}
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              p: { xs: 2, md: 3 },
              backgroundColor: "#f8f9ff",
              border: "1px solid #e0e7ff",
              borderRadius: 3,
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <BackupIcon sx={{ mr: 1, color: "#092181" }} />
              <Typography
                variant="h6"
                fontWeight="bold"
                color="#092181"
              >
                Crear Nuevo Respaldo
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                mt: 2,
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Button
                variant="contained"
                onClick={hacerRespaldo}
                disabled={cargar}
                startIcon={cargar ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                sx={{
                  minWidth: 150,
                  height: 50,
                  textTransform: "none",
                  background: "#092181",
                  "&:hover": { background: "#1c3cc9" },
                  borderRadius: 2,
                }}
              >
                {cargar ? "Creando Respaldo..." : "Crear Respaldo Ahora"}
              </Button>
            </Box>
          </Card>


          {/* Sección de Restauración */}
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              p: { xs: 2, md: 3 },
              backgroundColor: "#f8f9ff",
              border: "1px solid #e0e7ff",
              borderRadius: 3,
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <RestoreIcon sx={{ mr: 1, color: "#092181" }} />
              <Typography
                variant="h6"
                fontWeight="bold"
                color="#092181"
              >
                Restaurar Base de Datos
              </Typography>
            </Box>

            <FormControl sx={{
              width: "100%",
              maxWidth: "400px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#FFFFFF",
                "& fieldset": {
                  borderColor: "#CBD4D8",
                },
                "&:hover fieldset": {
                  borderColor: "#355C7D",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#092181",
                  borderWidth: "2px",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#2D5D7B",
                fontWeight: "bold",
              },
            }} disabled={cargar}>
              <InputLabel id="backup-select-label">Selecciona un archivo de respaldo</InputLabel>
              <Select
                labelId="backup-select-label"
                value={seleccionarRespaldo}
                label="Selecciona un archivo de respaldo"
                onChange={(e) => setSeleccionarRespaldo(e.target.value)}
                MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }} // Limita la altura del menú
              >
                {respaldo.length > 0 ? (
                  respaldo.map((b) => (
                    <MenuItem key={b} value={b}>
                      {b}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No hay respaldos disponibles</MenuItem>
                )}
              </Select>
            </FormControl>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                mt: 2,
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Button
                variant="contained"
                onClick={seleccionarRestauracion}
                disabled={cargar || !seleccionarRespaldo}
                startIcon={cargar ? <CircularProgress size={20} color="inherit" /> : <RestoreIcon />}
                sx={{
                  minWidth: 150,
                  height: 50,
                  textTransform: "none",
                  background: "#092181",
                  "&:hover": { background: "#1c3cc9" },
                  borderRadius: 2,
                }}
              >
                {cargar ? "Restaurando..." : "Restaurar Base de Datos"}
              </Button>
            </Box>
          </Card>
        </Paper>
      </Container>

      {/* Snackbar unificado para mensajes */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={tipo}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {mensaje}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default RespaldoRestauracion;
