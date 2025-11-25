import React, { useState, useEffect, useCallback } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Divider,
  Snackbar,
  Alert,
  Tooltip,
  Chip,
} from "@mui/material";
import {
  AssignmentInd,
  Assignment,
  Person2,
  CheckCircle,
  Close,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
// Mapa de recomendaciones
const recomendacionMap = {
  1: { label: "No", color: "#E53935", icon: <Close /> },
  2: { label: "Sí", color: "#43A047", icon: <CheckCircle /> },
};

//Mapa de mejoramiento
const mejoramientoMap = {
  1: {
    label: "No ayudó mucho",
    color: "#E53935",
    icon: <SentimentVeryDissatisfiedIcon />,
  },
  2: {
    label: "Mejora moderada",
    color: "#FBC02D",
    icon: <SentimentSatisfiedIcon />,
  },
  3: {
    label: "Mejora significativa",
    color: "#2E7D32",
    icon: <SentimentVerySatisfiedIcon />,
  },
};

export default function ActividadPersonalizadaPac() {
  const [idUsuario, setIdUsuario] = useState(null);
  const [idPaciente, setIdPaciente] = useState(null);
  const [nombrePaciente, setNombrePaciente] = useState("");
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [mejoramiento, setMejoramiento] = useState("");

  const [msg, setMsg] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensajeSnackbar, setMensajeSnackbar] = useState("");
  const [tipoSnackbar, setTipoSnackbar] = useState("success");

  const mostrarMensaje = (msg, severity = "info") => {
    setMensajeSnackbar(msg);
    setTipoSnackbar(severity);
    setOpenSnackbar(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const navigate = useNavigate();

  //  Obtener datos del usuario
  useEffect(() => {
    const storedIdUsuario = localStorage.getItem("idUsuario");
    if (storedIdUsuario) {
      setIdUsuario(storedIdUsuario);
      axios
        .get(`http://localhost:4000/api/auth/paciente/${storedIdUsuario}`)
        .then((res) => {
          const paciente = res.data;
          setNombrePaciente(paciente.nombre);
          setIdPaciente(paciente.idPaciente);
        })
        .catch(() => console.error("Error al obtener paciente"));
    }
  }, []);

  // Obtener actividades recomendadas
  const obtenerActividades = useCallback(() => {
    if (!idPaciente) return;
    axios
      .get(
        `http://localhost:4000/api/recomendacion/obtener-recomendacionesPac/${idPaciente}`
      )
      .then((res) => {
        setActividades(res.data || []);
        setActividadSeleccionada(null);
      })
      .catch(() => setActividades([]));
  }, [idPaciente]);

  useEffect(() => {
    obtenerActividades();
  }, [obtenerActividades]);

  const estaCalificada =
    actividadSeleccionada?.mejoramiento != null &&
    actividadSeleccionada?.mejoramiento !== 0 &&
    actividadSeleccionada?.mas_recomendacion != null &&
    actividadSeleccionada?.mas_recomendacion !== 0;
  //  Manejo de selección y actualización

  const handleSeleccionar = (recomendacion) => {
    setActividadSeleccionada(recomendacion);
    console.log("Datos de la recomendación seleccionada:", recomendacion); // <-- ¡Verifica esto!

    // Si ya está calificada, mostramos mensaje
    if (recomendacion.mejoramiento != null && recomendacion.mas_recomendacion != null) {
      mostrarMensaje("Esta actividad ya fue calificada", "info");
    }
  };


  const handleActualizar = () => {
    if (!actividadSeleccionada) return;
    const { idRecomendacion, mejoramiento, mas_recomendacion } = actividadSeleccionada;

    console.log("Datos a enviar:", { mejoramiento, mas_recomendacion });

    //if (!mejoramiento || !mas_recomendacion) {
    // mostrarMensaje("Por favor completa todos los campos antes de calificar.");
    // setOpenSnackbar(true);
    //return;
    //}
    axios.put(
      `http://localhost:4000/api/recomendacion/calificar-recomendacion/${actividadSeleccionada.idRecomendacion}`,
      { mejoramiento: Number(mejoramiento), mas_recomendacion: Number(mas_recomendacion) }
    )
      .then(() => {
        mostrarMensaje("Recomendación actualizada correctamente.", "success");
        setOpenSnackbar(true);
        obtenerActividades();
      })
      .catch((err) => {
        //Log completo del error para depuración
        console.error("Error completo de Axios:", err);

        let mensajeError = "Error al registrar la recomendacion.";
        // Verificar que la respuesta 400 tenga datos estructurados
        if (err.response && err.response.data) {
          const dataError = err.response.data;

          // Verificar que la respuesta 400 tenga datos estructurados
          if (dataError.errores && Array.isArray(dataError.errores) && dataError.errores.length > 0) {
            // Unir los errores de validación en una sola cadena
            mensajeError = `Errores de validación: ${dataError.errores.join('; ')}`;
          }

          else if (dataError.message) {
            mensajeError = dataError.message;
          }
        }
        // Mostrar el mensaje de error específico o el genérico 
        mostrarMensaje(mensajeError, "error");
      });
  };
  const isFormComplete = actividadSeleccionada &&
    actividadSeleccionada.mejoramiento &&
    actividadSeleccionada.mas_recomendacion;

  // Campos del detalle
  const campos = [
    { key: "actividad", label: "Actividad a realizar" },
    { key: "descripcion", label: "Descripción de la actividad" },
    {
      key: "mejoramiento",
      label: "¿Qué tanto te ayudó esta actividad?",
      isSelect: true,
      map: mejoramientoMap,
    },
    {
      key: "mas_recomendacion",
      label: "¿Deseas recibir más recomendaciones?",
      isSelect: true,
      map: recomendacionMap,
    },
  ];

  return (
    <Layout>
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          mt: 4,
          pb: 4,
          minHeight: "100vh",
        }}
      >
        <Paper
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#F4F6F8",
          }}
        >
          {/* Encabezado */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              mb: 3,
            }}
          >
            <AssignmentInd sx={{ color: "#092181", fontSize: 36 }} />
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ color: "#092181", textAlign: "center" }}
            >
              Actividades personalizadas
            </Typography>
          </Box>

          {/*  Listado  */}
          {!actividadSeleccionada ? (
            <Tooltip
              title="Selecciona una tarjeta para ver más detalles"
              placement="top"
              arrow
            >
              <Box sx={{ width: "100%", px: { xs: 2, sm: 4 } }}>
                {/* Header */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    gap: 2,
                    mb: 4,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      flex: 1,
                      justifyContent: { xs: "center", sm: "flex-start" },
                    }}
                  >
                    <Assignment sx={{ color: "#0A2472", fontSize: 36 }} />
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: "#0A2472",
                        letterSpacing: 0.5,
                      }}
                    >
                      {actividades.length > 0 ?
                        "Actividades recomendadas :" : "No se han registrado actividades recomendadas aún."}
                    </Typography>
                  </Box>
                  <Chip
                    label={`${actividades.length} registradas`}
                    sx={{
                      backgroundColor: "#0A2472",
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 3,
                  }}
                >
                  {actividades.map((rec) => (
                    <Card
                      key={rec.idRecomendacion}
                      onClick={() => handleSeleccionar(rec)}
                      sx={{
                        cursor: "pointer",
                        flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 45%" },
                        maxWidth: 400,
                        minHeight: 200,
                        borderRadius: 4,
                        border: "1px solid #E0E6F1",
                        background: " #F7F9FF ",
                        boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-6px)",
                          boxShadow: "0 12px 24px rgba(9,33,129,0.15)",
                          borderColor: "#0A2472",
                        },
                      }}
                    >
                      <CardContent
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2.5,
                          p: 3,
                        }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: "#0A2472",
                            mb: 1,
                          }}
                        >
                          {rec.actividad}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#4A5568",
                            textAlign: "justify",
                          }}
                        >
                          <strong>Descripción:</strong> {rec.descripcion}
                        </Typography>
                        <Divider sx={{ my: 1.5 }} />
                        <Box display="flex" alignItems="center" gap={1}>
                          <Person2 sx={{ color: "#0A2472" }} />
                          <Typography>{rec.nombreProfesional}</Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            </Tooltip>
          ) : (
            <Box
              sx={{
                mt: 5,
                p: 4,
                borderRadius: 4,
                background: "#F9FAFF ",
                boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                border: "1px solid #E0E6F1",
                transition: "all 0.3s ease",
              }}
            >

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "#0A2472",
                  mb: 1.5,
                  textAlign: { xs: "center", sm: "left" },
                }}
              >
                Detalle de la recomendación
              </Typography>

              <Box display="flex" alignItems="center" gap={1}>
                <Person2 sx={{ color: "#0A2472", mb: 3 }} />
                <Typography variant="subtitle1"
                  sx={{
                    mb: 3,
                    color: "#4A5568",
                    textAlign: { xs: "center", sm: "left" },
                  }}>
                  <strong>Profesional:</strong> {actividadSeleccionada.nombreProfesional}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 3,
                  justifyContent: "space-between",
                }}
              >
                {campos.map(({ key, label, isSelect, map }) => {
                  const value = actividadSeleccionada[key] ?? "";
                  const disabled = isSelect ? estaCalificada : true; // Solo los select se deshabilitan si ya está calificada

                  return (
                    <Box key={key} sx={{
                      flex: { xs: "1 1 100%", sm: "1 1 47%" },
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }} >
                      {isSelect ? (
                        <FormControl disabled={disabled}
                          sx={{
                            width: "100%",
                            maxWidth: "400px",
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              backgroundColor: "#FFFFFF",
                              "& fieldset": { borderColor: "#CBD4D8" },
                              "&:hover fieldset": { borderColor: "#355C7D" },
                              "&.Mui-focused fieldset": {
                                borderColor: "#092181",
                                borderWidth: "2px",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#2D5D7B",
                              fontWeight: "bold",
                            },
                          }} >
                          <InputLabel>{label}</InputLabel>
                          <Select
                            value={value}
                            onChange={(e) =>
                              setActividadSeleccionada({ ...actividadSeleccionada, [key]: Number(e.target.value) })
                            }
                            label={label}
                            sx={{
                              borderRadius: 2,
                              "& .MuiSelect-select": { py: 1.2 },
                            }}
                          >
                            {Object.entries(map).map(([val, { label: l, color, icon }]) => (
                              <MenuItem key={val} value={val}>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Box sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1, color
                                  }}>{icon}</Box>
                                  {l}
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <TextField
                          fullWidth
                          label={label}
                          value={value}
                          disabled={disabled}
                          onChange={(e) =>
                            setActividadSeleccionada({
                              ...actividadSeleccionada,
                              [key]: e.target.value,
                            })
                          }
                          sx={{
                            width: "100%",
                            maxWidth: "400px",
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              backgroundColor: "#FFFFFF",
                              "& fieldset": { borderColor: "#CBD4D8" },
                              "&:hover fieldset": { borderColor: "#355C7D" },
                              "&.Mui-focused fieldset": {
                                borderColor: "#092181",
                                borderWidth: "2px",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#2D5D7B",
                              fontWeight: "bold",
                            },
                          }}
                        />
                      )}
                    </Box>
                  );
                })}

              </Box>



              <Box sx={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 2,
                mt: 1,
              }}
              >
                <Button
                  variant="contained"
                  onClick={handleActualizar}
                  //disabled={estaCalificada || !isFormComplete }
                  startIcon={<SaveIcon />}
                  sx={{
                    backgroundColor: "#0A2472",
                    color: "#fff",
                    px: 3,
                    py: 1.2,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { backgroundColor: "#081A56" },
                  }}
                >
                  Guardar calificación
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => setActividadSeleccionada(null)}
                  sx={{
                    borderColor: "#0A2472",
                    color: "#0A2472",
                    px: 3,
                    py: 1.2,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                      borderColor: "#081A56",
                      color: "#081A56",
                      backgroundColor: "rgba(10,36,114,0.05)",
                    },
                  }}
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          )}
        </Paper>

        {/* Snackbar de mensaje */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={tipoSnackbar}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {mensajeSnackbar}
          </Alert>
        </Snackbar>
      </Container>
    </Layout>
  );
}
