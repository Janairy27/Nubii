import React, { useEffect, useState } from "react";
import Layout from "../components/LayoutProf";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Alert,
  Select,
  InputLabel,
  FormControl,
  ToggleButton,
  ToggleButtonGroup,
  InputAdornment,
  Divider,
  Slide,
  Snackbar,
  Tooltip,
  Chip,
  Card,
  CardContent,
  CardMedia,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  IconButton,
  Fade,
  Backdrop,
} from "@mui/material";
import {
  Search,
  Update,
  Delete,
  ArrowBack,
  FilterList,
  AccessTime,
  FitnessCenter,
  CheckCircle,
  Close,
  ZoomIn,
} from "@mui/icons-material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SettingsIcon from "@mui/icons-material/Settings";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import LinkIcon from "@mui/icons-material/Link";

import AirIcon from "@mui/icons-material/Air";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import ParkIcon from "@mui/icons-material/Park";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import BrushIcon from "@mui/icons-material/Brush";
import GroupIcon from "@mui/icons-material/Group";
import ChecklistIcon from "@mui/icons-material/Checklist";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import PsychologyIcon from "@mui/icons-material/Psychology";
import WbSunnyIcon from "@mui/icons-material/WbSunny";

import SignalCellular1BarIcon from "@mui/icons-material/SignalCellular1Bar";
import SignalCellular2BarIcon from "@mui/icons-material/SignalCellular2Bar";
import SignalCellular3BarIcon from "@mui/icons-material/SignalCellular3Bar";
import SignalCellular4BarIcon from "@mui/icons-material/SignalCellular4Bar";

import DraftsIcon from "@mui/icons-material/Drafts";
import PublicIcon from "@mui/icons-material/Public";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const GestionActividades = () => {
  const [idUsuario, setIdUsuario] = useState("");
  const [idProfesional, setIdProfesional] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [criterioBusqueda, setCriterioBusqueda] = useState("nombreAct");
  const [valorBusqueda, setValorBusqueda] = useState("");
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const [modoVista, setModoVista] = useState("publicados");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("success");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [archivoModal, setArchivoModal] = useState(null);
  const [tipoArchivoModal, setTipoArchivoModal] = useState(null);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const navigate = useNavigate();

  // Abrir diálogo de confirmación
  const handleOpenConfirm = () => setOpenConfirm(true);

  // Cancelar
  const handleCloseConfirm = () => setOpenConfirm(false);

  const mostrarMensaje = (msg, severity = "info") => {
    setMensaje(msg);
    setTipo(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const abrirModalImagen = (url) => {
    setArchivoModal(url);
    // Detecta si es video por extensión
    if (url.match(/\.(mp4|webm|ogg)$/i)) {
      setTipoArchivoModal("video");
    } else {
      setTipoArchivoModal("imagen");
    }
    setModalAbierto(true);
  };

  const tiposActividad = [
    {
      text: "Respiración guiada",
      icon: <AirIcon />,
      value: 1,
      color: "#4caf50",
    },
    {
      text: "Relajación",
      icon: <SelfImprovementIcon />,
      value: 2,
      color: "#2196f3",
    },
    {
      text: "Movimiento físico suave",
      icon: <DirectionsRunIcon />,
      value: 3,
      color: "#ff9800",
    },
    { text: "Aire libre", icon: <ParkIcon />, value: 4, color: "#009688" },
    {
      text: "Actividad física activa",
      icon: <FitnessCenterIcon />,
      value: 5,
      color: "#9c27b0",
    },
    {
      text: "Desahogo emocional",
      icon: <SentimentSatisfiedAltIcon />,
      value: 6,
      color: "#e91e63",
    },
    {
      text: "Actividad creativa",
      icon: <BrushIcon />,
      value: 7,
      color: "#ff5722",
    },
    { text: "Social", icon: <GroupIcon />, value: 8, color: "#03a9f4" },
    {
      text: "Organización",
      icon: <ChecklistIcon />,
      value: 9,
      color: "#607d8b",
    },
    { text: "Descanso", icon: <BedtimeIcon />, value: 10, color: "#795548" },
    {
      text: "Estimulación cognitiva",
      icon: <PsychologyIcon />,
      value: 11,
      color: "#673ab7",
    },
    {
      text: "Visualización positiva",
      icon: <WbSunnyIcon />,
      value: 12,
      color: "#ffc107",
    },
  ];

  const nivelesDificultad = [
    {
      text: "Muy baja",
      icon: <SignalCellular1BarIcon />,
      value: 1,
      color: "#56ab2f",
    },
    {
      text: "Baja",
      icon: <SignalCellular2BarIcon />,
      value: 2,
      color: "#ffcc33",
    },
    {
      text: "Media",
      icon: <SignalCellular3BarIcon />,
      value: 3,
      color: "#8e24aa",
    },
    {
      text: "Alta",
      icon: <SignalCellular4BarIcon />,
      value: 4,
      color: "#c51162",
    },
  ];

  const estadoPublicacion = [
    { text: "Borrador", icon: <DraftsIcon />, value: 1, color: "#9e9e9e" },
    { text: "Publicado", icon: <PublicIcon />, value: 2, color: "#43a047" },
  ];

  // Función para renderizar el valor seleccionado en los Select
  const renderSelectedValue = (value, options) => {
    const selectedOption = options.find((option) => option.value === value);
    if (!selectedOption) return null;

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ color: selectedOption.color, display: "flex" }}>
          {selectedOption.icon}
        </Box>
        <Typography>{selectedOption.text}</Typography>
      </Box>
    );
  };

  useEffect(() => {
    const storedIdUsuario = localStorage.getItem("idUsuario");
    if (storedIdUsuario) {
      setIdUsuario(storedIdUsuario);
      axios
        .get(`http://localhost:4000/api/auth/profesional/${storedIdUsuario}`)
        .then((res) => {
          const profesional = res.data;
          setIdProfesional(profesional.idProfesional);
        })
        .catch((err) => console.error("Error al obtener idProfesional:", err));
    }
  }, []);

  useEffect(() => {
    if (idProfesional) {
      obtenerActividades();
    }
  }, [idProfesional, modoVista]);

  const obtenerActividades = () => {
    const publico = modoVista === "publicados" ? 2 : 1;
    axios
      .get(
        `http://localhost:4000/api/actividades/by-idProfesional/${idProfesional}/${publico}`
      )
      .then((res) => {
        setActividades(res.data);
        setActividadSeleccionada(null);
      })
      .catch((err) => console.error("Error al cargar actividades:", err));
  };

  const handleBuscar = () => {
    if (!valorBusqueda.trim()) return obtenerActividades();
    const publico = modoVista === "publicados" ? 2 : 1;

    axios
      .get(
        `http://localhost:4000/api/actividades/by-attribute/${criterioBusqueda}/${encodeURIComponent(
          valorBusqueda
        )}/${idProfesional}/${publico}`
      )
      .then((res) => {
        setActividades(res.data);
        setCriterioBusqueda("");
        setValorBusqueda("");
        setActividadSeleccionada(null);
        mostrarMensaje("Actividad encontrada exitosamente", "success");
      })
      .catch(() => {
        mostrarMensaje(
          "No se encontraron actividades con ese criterio.",
          "warning"
        );
        obtenerActividades();
        setCriterioBusqueda("");
        setValorBusqueda("");
      });
  };

  const handleSeleccionar = (actividad) => {
    setActividadSeleccionada(actividad);
  };

  const handleActualizar = async () => {
    const formData = new FormData();

    formData.append("nombreAct", actividadSeleccionada.nombreAct);
    formData.append("descripcionAct", actividadSeleccionada.descripcionAct);
    formData.append("objetivo", actividadSeleccionada.objetivo);
    formData.append("tipoAct", actividadSeleccionada.tipoAct);
    formData.append("duracion_minutos", actividadSeleccionada.duracion_minutos);
    formData.append("dificultad", actividadSeleccionada.dificultad);
    formData.append("publico", actividadSeleccionada.publico);

    if (actividadSeleccionada.multimedia instanceof File) {
      formData.append("multimedia", actividadSeleccionada.multimedia);
    }

    axios
      .put(
        `http://localhost:4000/api/actividades/actualizar-actividad/${actividadSeleccionada.idActividad}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        mostrarMensaje("Actividad actualizada correctamente ", "success");
        obtenerActividades();
      })
      .catch((err) => {
        //Log completo del error para depuración
        console.error("Error completo de Axios:", err);
        let mensajeError = "Error al actualizar la recomendación.";

        // Verificar que la respuesta 400 tenga datos estructurados
        if (err.response && err.response.data) {
          const dataError = err.response.data;

          if (
            dataError.errores &&
            Array.isArray(dataError.errores) &&
            dataError.errores.length > 0
          ) {
            // Unir  los errores de validación en una sola cadena
            mensajeError = `Errores de validación: ${dataError.errores.join(
              "; "
            )}`;
          } else if (dataError.message) {
            mensajeError = dataError.message;
          }
        }
        // Mostrar el mensaje de error específico o el genérico
        mostrarMensaje(mensajeError, "error");
      });
  };

  const handleEliminar = async () => {
    const url = `http://localhost:4000/api/actividades/eliminar-actividad/${actividadSeleccionada.idActividad}`;
    try {
      await axios.delete(url);
      setOpenConfirm(false); // cerrar confirmación
      setOpenSuccess(true); // abrir modal de éxito
      setTimeout(() => navigate("/dashboardProf"), 2000); // redirigir después de 2 seg
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al eliminar la cuenta");
    }
  };

  const handleModoVistaChange = (event, newModo) => {
    if (newModo !== null) {
      setModoVista(newModo);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleBuscar();
    }
  };

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
        {/* Header Principal */}
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            backgroundColor: "#F4F6F8",

            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              variant="h4"
              sx={{
                color: "#092181",
                fontWeight: "bold",
                fontSize: { xs: "1.75rem", md: "2.25rem" },
                mb: 1,
              }}
            >
              Gestión de Actividades
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            >
              Administra y organiza todas tus actividades terapéuticas
            </Typography>
          </Box>

          {/* Controles Superiores */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", md: "center" },
              gap: 2,
            }}
          >
            <ToggleButtonGroup
              value={modoVista}
              exclusive
              onChange={handleModoVistaChange}
              sx={{
                textTransform: "capitalize",
                alignSelf: { xs: "stretch", md: "flex-start" },
                "& .MuiToggleButton-root": {
                  flex: 1,
                  px: 3,
                  py: 1.5,
                  textTransform: "capitalize",
                  fontWeight: 600,
                  borderRadius: 2,
                  border: "2px solid #e0e7ff",
                  color: "#2D5D7B",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: "#EEF5FF",
                  },
                },
                "& .Mui-selected": {
                  backgroundColor: "#2D5D7B !important",
                  color: "#FFFFFF !important",
                  borderColor: "#2D5D7B",
                  "& .MuiTypography-root": {
                    color: "#FFFFFF !important",
                  },
                },
              }}
            >
              <ToggleButton value="publicados">
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="button"
                    fontWeight="bold"
                    sx={{ textTransform: "capitalize" }}
                  >
                    Publicados
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {actividades.filter((a) => a.publico === 2).length}{" "}
                    actividades
                  </Typography>
                </Box>
              </ToggleButton>

              <ToggleButton value="borradores">
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="button"
                    fontWeight="bold"
                    sx={{ textTransform: "capitalize" }}
                  >
                    Borradores
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {actividades.filter((a) => a.publico === 1).length}{" "}
                    actividades
                  </Typography>
                </Box>
              </ToggleButton>
            </ToggleButtonGroup>

            {actividadSeleccionada && (
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => setActividadSeleccionada(null)}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  borderColor: "#2D5D7B",
                  color: "#2D5D7B",
                  "&:hover": {
                    borderColor: "#092181",
                    backgroundColor: "#f0f4ff",
                  },
                }}
              >
                Volver al listado
              </Button>
            )}
          </Box>

          {/* Panel de Búsqueda */}
          {!actividadSeleccionada && (
            <Slide in timeout={600} direction="up">
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  backgroundColor: "#f8faff",
                  border: "1px solid #e0e7ff",
                  mt: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <FilterList sx={{ color: "#092181", mr: 1 }} />
                  <Typography
                    variant="h6"
                    sx={{ color: "#092181", fontWeight: "bold" }}
                  >
                    Búsqueda Avanzada
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    alignItems: { xs: "stretch", sm: "flex-end" },
                  }}
                >
                  <FormControl
                    sx={{
                      flex: { xs: "1", sm: "0.3" },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: "#ffffff",
                        "& fieldset": { borderColor: "#e0e7ff" },
                        "&:hover fieldset": { borderColor: "#092181" },
                        "&.Mui-focused fieldset": {
                          borderColor: "#092181",
                          borderWidth: 2,
                        },
                      },
                    }}
                  >
                    <InputLabel sx={{ color: "#2D5D7B", fontWeight: "500" }}>
                      Criterio de búsqueda
                    </InputLabel>
                    <Select
                      value={criterioBusqueda}
                      onChange={(e) => setCriterioBusqueda(e.target.value)}
                      label="Criterio de búsqueda"
                    >
                      <MenuItem value="nombreAct">Nombre</MenuItem>
                      <MenuItem value="descripcionAct">Descripción</MenuItem>
                      <MenuItem value="objetivo">Objetivo</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    sx={{
                      flex: { xs: "1", sm: "0.5" },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: "#ffffff",
                        "& fieldset": { borderColor: "#e0e7ff" },
                        "&:hover fieldset": { borderColor: "#092181" },
                        "&.Mui-focused fieldset": {
                          borderColor: "#092181",
                          borderWidth: 2,
                        },
                      },
                    }}
                    label={`Buscar por ${
                      criterioBusqueda === "nombreAct"
                        ? "nombre"
                        : criterioBusqueda === "descripcionAct"
                        ? "descripción"
                        : "objetivo"
                    }`}
                    value={valorBusqueda}
                    onChange={(e) => setValorBusqueda(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />

                  <Button
                    variant="contained"
                    startIcon={<Search />}
                    onClick={handleBuscar}
                    sx={{
                      borderRadius: 3,
                      height: 56,
                      flex: { xs: "1", sm: "0.2" },
                      backgroundColor: "#092181",
                      textTransform: "none",
                      fontWeight: "bold",
                      "&:hover": { backgroundColor: "#1a3a9d" },
                    }}
                  >
                    Buscar
                  </Button>
                </Box>
              </Card>
            </Slide>
          )}

          {!actividadSeleccionada ? (
            <Box>
              {/* Header del Listado */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  mb: 4,
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    flex: 1,
                    justifyContent: { xs: "center", sm: "flex-start" },
                    textAlign: { xs: "center", sm: "left" },
                  }}
                >
                  <MenuBookIcon sx={{ color: "#092181", fontSize: 32 }} />
                  <Typography
                    variant="h5"
                    sx={{ color: "#092181", fontWeight: "bold" }}
                  >
                    Actividades{" "}
                    {modoVista === "publicados" ? "Publicadas" : "en Borrador"}
                  </Typography>
                </Box>
                <Chip
                  label={`${actividades.length} ${
                    actividades.length === 1 ? "actividad" : "actividades"
                  }`}
                  sx={{
                    backgroundColor: "#092181",
                    color: "white",
                    fontWeight: "bold",
                  }}
                />
              </Box>
              {actividades.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <MenuBookIcon sx={{ fontSize: 64, color: "#666", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No hay actividades{" "}
                    {modoVista === "publicados" ? "publicadas" : "en borrador"}
                  </Typography>
                </Box>
              ) : (
                <Tooltip title="Haz clic en una actividad para editarla" arrow>
                  <Box sx={{ width: "100%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "flex-start", sm: "center" },
                        justifyContent: { xs: "center", sm: "space-between" },
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 3,
                      }}
                    >
                      {actividades.map((actividad, index) => (
                        <Slide
                          in
                          timeout={600 + index * 100}
                          direction="up"
                          key={actividad.idActividad}
                        >
                          <Card
                            onClick={() => handleSeleccionar(actividad)}
                            sx={{
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              borderRadius: 3,
                              border: "1px solid #e0e7ff",
                              width: {
                                xs: "100%",
                                sm: "calc(50% - 12px)",
                                lg: "calc(33.333% - 16px)",
                              },
                              maxWidth: "400px",
                              display: "flex",
                              flexDirection: "column",
                              minHeight: "320px",
                              "&:hover": {
                                boxShadow: "0 8px 25px rgba(41, 98, 255, 0.15)",
                                transform: "translateY(-4px)",
                                borderColor: "#092181",
                              },
                            }}
                          >
                            {/* Multimedia de la actividad (imagen o video) con botón de zoom */}
                            {actividad.multimedia ? (
                              <Box sx={{ position: "relative" }}>
                                {actividad.multimedia.match(
                                  /\.(mp4|webm|ogg)$/i
                                ) ? (
                                  // Si es un video
                                  <Box
                                    component="video"
                                    src={`http://localhost:4000/uploads/${actividad.multimedia}`}
                                    controls
                                    sx={{
                                      width: "100%",
                                      height: 140,
                                      objectFit: "cover",
                                      borderTopLeftRadius: 12,
                                      borderTopRightRadius: 12,
                                      cursor: "pointer",
                                      transition: "all 0.3s ease",
                                      "&:hover": { opacity: 0.9 },
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      abrirModalImagen(
                                        `http://localhost:4000/uploads/${actividad.multimedia}`
                                      );
                                    }}
                                  />
                                ) : (
                                  // Si es una imagen
                                  <CardMedia
                                    component="img"
                                    height="140"
                                    image={`http://localhost:4000/uploads/${actividad.multimedia}`}
                                    alt={actividad.nombreAct}
                                    sx={{
                                      cursor: "pointer",
                                      objectFit: "cover",
                                      borderTopLeftRadius: 12,
                                      borderTopRightRadius: 12,
                                      transition: "all 0.3s ease",
                                      "&:hover": { opacity: 0.9 },
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      abrirModalImagen(
                                        `http://localhost:4000/uploads/${actividad.multimedia}`
                                      );
                                    }}
                                  />
                                )}

                                {/*  Botón de zoom */}
                                <IconButton
                                  sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                                    "&:hover": {
                                      backgroundColor: "rgba(255, 255, 255, 1)",
                                    },
                                    width: 32,
                                    height: 32,
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    abrirModalImagen(
                                      `http://localhost:4000/uploads/${actividad.multimedia}`
                                    );
                                  }}
                                >
                                  <ZoomIn
                                    sx={{ fontSize: 18, color: "#092181" }}
                                  />
                                </IconButton>
                              </Box>
                            ) : (
                              // Cuando no hay multimedia
                              <Box
                                sx={{
                                  height: "140px",
                                  backgroundColor: "#f0f4ff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderTopLeftRadius: 12,
                                  borderTopRightRadius: 12,
                                  position: "relative",
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Sin archivo multimedia
                                </Typography>
                              </Box>
                            )}

                            <CardContent
                              sx={{
                                p: 2.5,
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                  mb: 1.5,
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    color: "#2D5D7B",
                                    fontWeight: 600,
                                    flex: 1,
                                    mr: 1,
                                    fontSize: "1rem",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    lineHeight: 1.2,
                                  }}
                                >
                                  {actividad.nombreAct}
                                </Typography>
                                <Chip
                                  label={
                                    actividad.publico === 2
                                      ? "Publicada"
                                      : "Borrador"
                                  }
                                  size="small"
                                  sx={{
                                    backgroundColor:
                                      actividad.publico === 2
                                        ? "#4CAF50"
                                        : "#FF9800",
                                    color: "white",
                                    fontWeight: "bold",
                                    fontSize: "0.7rem",
                                    flexShrink: 0,
                                  }}
                                />
                              </Box>

                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 1,
                                  mb: 2,
                                  flex: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <AccessTime
                                    sx={{ fontSize: 16, color: "#2D5D7B" }}
                                  />
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: "text.primary",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {actividad.duracion_minutos} minutos
                                  </Typography>
                                </Box>

                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <FitnessCenter
                                    sx={{ fontSize: 16, color: "#2D5D7B" }}
                                  />
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color:
                                        actividad.dificultad === 4
                                          ? "#D32F2F"
                                          : actividad.dificultad === 3
                                          ? "#FF9800"
                                          : "#388E3C",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {nivelesDificultad[actividad.dificultad - 1]
                                      ?.text || "Sin definir"}
                                  </Typography>
                                </Box>

                                {actividad.descripcionAct && (
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: "text.secondary",
                                      display: "-webkit-box",
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: "vertical",
                                      overflow: "hidden",
                                      lineHeight: 1.4,
                                      mt: 1,
                                    }}
                                  >
                                    {actividad.descripcionAct}
                                  </Typography>
                                )}
                              </Box>
                            </CardContent>
                          </Card>
                        </Slide>
                      ))}
                    </Box>
                  </Box>
                </Tooltip>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                color="#2D5D7B"
                sx={{ textAlign: "center" }}
              >
                Editar Actividad
              </Typography>

              <Divider />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", lg: "row" },
                  gap: 3,
                }}
              >
                {/* Información de la Actividad */}
                <Card
                  sx={{
                    flex: 1,
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: "#f8f9ff",
                    border: "2px solid #092181",
                    boxShadow: "0 4px 12px rgba(9, 33, 129, 0.15)",
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <AssignmentIcon color="primary" />
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{
                        background: "#092181",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Información de la Actividad
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <TextField
                      fullWidth
                      label="Nombre de la actividad"
                      value={actividadSeleccionada.nombreAct || ""}
                      onChange={(e) =>
                        setActividadSeleccionada({
                          ...actividadSeleccionada,
                          nombreAct: e.target.value,
                        })
                      }
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: "#fff",
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
                        "& .MuiInputBase-input::placeholder": {
                          color: "#777777",
                          opacity: 1,
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Descripción"
                      value={actividadSeleccionada.descripcionAct || ""}
                      onChange={(e) =>
                        setActividadSeleccionada({
                          ...actividadSeleccionada,
                          descripcionAct: e.target.value,
                        })
                      }
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: "#fff",
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
                        "& .MuiInputBase-input::placeholder": {
                          color: "#777777",
                          opacity: 1,
                        },
                      }}
                    />
                  </Box>
                </Card>

                {/* Configuración */}
                <Card
                  sx={{
                    flex: 1,
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: "#f8f9ff",
                    border: "2px solid #092181",
                    boxShadow: "0 4px 12px rgba(9, 33, 129, 0.15)",
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <SettingsIcon color="primary" />
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{
                        background: "#092181",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Configuración
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 2,
                      }}
                    >
                      <FormControl
                        fullWidth
                        sx={{
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
                        }}
                      >
                        <InputLabel>Tipo de actividad</InputLabel>
                        <Select
                          value={actividadSeleccionada.tipoAct || ""}
                          label="Tipo de actividad"
                          onChange={(e) =>
                            setActividadSeleccionada({
                              ...actividadSeleccionada,
                              tipoAct: parseInt(e.target.value),
                            })
                          }
                          renderValue={(value) =>
                            renderSelectedValue(value, tiposActividad)
                          }
                        >
                          {tiposActividad.map((tipo) => (
                            <MenuItem key={tipo.value} value={tipo.value}>
                              <ListItemIcon>
                                <Box sx={{ color: tipo.color }}>
                                  {tipo.icon}
                                </Box>
                              </ListItemIcon>
                              <ListItemText
                                primary={tipo.text}
                                primaryTypographyProps={{
                                  sx: { fontWeight: 500 },
                                }}
                              />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            backgroundColor: "#fff",
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
                          "& .MuiInputBase-input::placeholder": {
                            color: "#777777",
                            opacity: 1,
                          },
                        }}
                        fullWidth
                        type="number"
                        label="Duración (min)"
                        value={actividadSeleccionada.duracion_minutos || ""}
                        onChange={(e) =>
                          setActividadSeleccionada({
                            ...actividadSeleccionada,
                            duracion_minutos: e.target.value,
                          })
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">min</InputAdornment>
                          ),
                        }}
                      />

                      <FormControl
                        fullWidth
                        sx={{
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
                        }}
                      >
                        <InputLabel>Nivel de dificultad</InputLabel>
                        <Select
                          value={actividadSeleccionada.dificultad || ""}
                          label="Nivel de dificultad"
                          onChange={(e) =>
                            setActividadSeleccionada({
                              ...actividadSeleccionada,
                              dificultad: parseInt(e.target.value),
                            })
                          }
                          renderValue={(value) =>
                            renderSelectedValue(value, nivelesDificultad)
                          }
                        >
                          {nivelesDificultad.map((nivel) => (
                            <MenuItem key={nivel.value} value={nivel.value}>
                              <ListItemIcon>
                                <Box sx={{ color: nivel.color }}>
                                  {nivel.icon}
                                </Box>
                              </ListItemIcon>
                              <ListItemText
                                primary={nivel.text}
                                primaryTypographyProps={{
                                  sx: { fontWeight: 500 },
                                }}
                              />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>

                    <FormControl
                      sx={{
                        mt: 2,
                        width: "200px",
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
                      }}
                    >
                      <InputLabel>Estado de publicación</InputLabel>
                      <Select
                        value={actividadSeleccionada.publico || ""}
                        label="Estado de publicación"
                        onChange={(e) =>
                          setActividadSeleccionada({
                            ...actividadSeleccionada,
                            publico: parseInt(e.target.value),
                          })
                        }
                        renderValue={(value) =>
                          renderSelectedValue(value, estadoPublicacion)
                        }
                      >
                        {estadoPublicacion.map((estado) => (
                          <MenuItem key={estado.value} value={estado.value}>
                            <ListItemIcon>
                              <Box sx={{ color: estado.color }}>
                                {estado.icon}
                              </Box>
                            </ListItemIcon>
                            <ListItemText
                              primary={estado.text}
                              primaryTypographyProps={{
                                sx: { fontWeight: 500 },
                              }}
                            />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Card>
              </Box>

              {/* Recursos y Objetivo */}
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: "#f8f9ff",
                  border: "2px solid #092181",
                  boxShadow: "0 4px 12px rgba(9, 33, 129, 0.15)",
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <EmojiObjectsIcon color="primary" />
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      background: "#092181",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Objetivo y Recursos
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Objetivo terapéutico"
                    value={actividadSeleccionada.objetivo || ""}
                    onChange={(e) =>
                      setActividadSeleccionada({
                        ...actividadSeleccionada,
                        objetivo: e.target.value,
                      })
                    }
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: "#fff",
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
                      "& .MuiInputBase-input::placeholder": {
                        color: "#777777",
                        opacity: 1,
                      },
                    }}
                  />

                  <Box>
                    <Typography
                      sx={{ mb: 1, fontWeight: 600, color: "#2D5D7B" }}
                    >
                      Archivo multimedia (opcional)
                    </Typography>

                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<LinkIcon />}
                      sx={{
                        borderRadius: 3,
                        textTransform: "capitalize",
                      }}
                    >
                      {actividadSeleccionada.vistaPrevia ||
                      actividadSeleccionada.multimedia
                        ? "Reemplazar archivo"
                        : "Subir archivo"}
                      <input
                        hidden
                        accept="image/*,video/*"
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const vistaPrevia = URL.createObjectURL(file);
                            const tipoArchivo = file.type.startsWith("video")
                              ? "video"
                              : "imagen";
                            setActividadSeleccionada({
                              ...actividadSeleccionada,
                              multimedia: file,
                              vistaPrevia,
                              tipoArchivo,
                            });
                          }
                        }}
                      />
                    </Button>

                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      {/*  Vista previa del archivo */}
                      {actividadSeleccionada.vistaPrevia ? (
                        actividadSeleccionada.tipoArchivo === "video" ? (
                          <Box
                            component="video"
                            src={actividadSeleccionada.vistaPrevia}
                            controls
                            sx={{
                              maxWidth: "250px",
                              maxHeight: "160px",
                              borderRadius: 3,
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <CardMedia
                            component="img"
                            image={actividadSeleccionada.vistaPrevia}
                            alt="Vista previa nueva"
                            sx={{
                              maxWidth: "250px",
                              maxHeight: "160px",
                              borderRadius: 3,
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                              objectFit: "cover",
                            }}
                          />
                        )
                      ) : actividadSeleccionada.multimedia ? (
                        actividadSeleccionada.multimedia.endsWith(".mp4") ||
                        actividadSeleccionada.multimedia.endsWith(".webm") ||
                        actividadSeleccionada.multimedia.endsWith(".ogg") ? (
                          <Box
                            component="video"
                            src={`http://localhost:4000${
                              actividadSeleccionada.multimedia.startsWith(
                                "/uploads"
                              )
                                ? actividadSeleccionada.multimedia
                                : `/uploads/${actividadSeleccionada.multimedia}`
                            }`}
                            controls
                            sx={{
                              maxWidth: "250px",
                              maxHeight: "160px",
                              borderRadius: 3,
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <CardMedia
                            component="img"
                            image={`http://localhost:4000${
                              actividadSeleccionada.multimedia.startsWith(
                                "/uploads"
                              )
                                ? actividadSeleccionada.multimedia
                                : `/uploads/${actividadSeleccionada.multimedia}`
                            }`}
                            alt="Imagen actual"
                            sx={{
                              maxWidth: "250px",
                              maxHeight: "160px",
                              borderRadius: 2,
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                              objectFit: "cover",
                            }}
                          />
                        )
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textAlign: "center" }}
                        >
                          No se ha cargado ningún archivo
                        </Typography>
                      )}

                      {/* Botón para quitar archivo */}
                      {(actividadSeleccionada.vistaPrevia ||
                        actividadSeleccionada.multimedia) && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() =>
                            setActividadSeleccionada({
                              ...actividadSeleccionada,
                              multimedia: null,
                              vistaPrevia: null,
                              tipoArchivo: null,
                            })
                          }
                          sx={{
                            textTransform: "none",
                            borderRadius: 2,
                            fontWeight: "bold",
                            borderColor: "#d32f2f",
                            "&:hover": { backgroundColor: "#fdecea" },
                          }}
                        >
                          Quitar archivo
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Card>

              {/* Botones de acción */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  mt: 4,
                  pt: 3,
                  borderTop: "1px solid #E0E0E0",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<Update />}
                  onClick={handleActualizar}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    backgroundColor: "#092181",
                    color: "white",
                    textTransform: "capitalize",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#1a3a9d",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(9, 33, 129, 0.3)",
                    },
                    transition: "all 0.2s ease",
                    flex: { xs: "1 1 100%", sm: "0 0 auto" },
                  }}
                >
                  Actualizar Actividad
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Delete />}
                  onClick={handleOpenConfirm}
                  sx={{
                    borderRadius: 4,
                    px: 4,
                    textTransform: "capitalize",

                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(211, 47, 47, 0.3)",
                    },
                    transition: "all 0.2s ease",
                    flex: { xs: "1 1 100%", sm: "0 0 auto" },
                  }}
                >
                  Eliminar
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => setActividadSeleccionada(null)}
                  sx={{
                    borderRadius: 3,
                    color: "#1f1f1fff",
                    textTransform: "capitalize",
                    backgroundColor: "#8a8989ff",

                    "&:hover": {
                      backgroundColor: "#aec1daff",
                      color: "#092181",
                    },
                    transition: "all 0.2s ease",
                    flex: { xs: "1 1 100%", sm: "0 0 auto" },
                  }}
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          )}
        </Paper>

        {/* Animación para confirmación de eliminación */}
        <AnimatePresence>
          {openConfirm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <Dialog
                open={openConfirm}
                onClose={handleCloseConfirm}
                PaperProps={{
                  sx: {
                    borderRadius: "16px",
                    p: 1,
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
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    pb: 0,
                  }}
                >
                  <WarningAmberIcon sx={{ color: "#C62828", fontSize: 32 }} />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#092181" }}
                  >
                    Confirmar eliminación
                  </Typography>
                </DialogTitle>

                <DialogContent>
                  <DialogContentText sx={{ color: "#333", mt: 1 }}>
                    ¿Estás seguro de que quieres eliminar está acttividad?
                    <br />
                    <strong>Esta acción no se puede deshacer.</strong>
                  </DialogContentText>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                  <Button
                    onClick={handleCloseConfirm}
                    sx={{
                      color: "#2D5D7B",
                      fontWeight: 600,
                      borderRadius: "10px",
                      textTransform: "capitalize",
                    }}
                  >
                    Cancelar
                  </Button>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={handleEliminar}
                      variant="contained"
                      sx={{
                        backgroundColor: "#C62828",
                        "&:hover": { backgroundColor: "#A31515" },
                        fontWeight: 600,
                        borderRadius: "10px",
                        textTransform: "capitalize",
                      }}
                    >
                      Eliminar
                    </Button>
                  </motion.div>
                </DialogActions>
              </Dialog>
            </motion.div>
          )}
        </AnimatePresence>

        {/*  Modal de éxito animado */}
        <AnimatePresence>
          {openSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
            >
              <Dialog
                open={openSuccess}
                PaperProps={{
                  sx: {
                    borderRadius: "16px",
                    textAlign: "center",
                    p: 3,
                    backgroundColor: "#F4F6F8",
                  },
                }}
              >
                <CheckCircle sx={{ color: "#2E7D32", fontSize: 60, mb: 2 }} />
                <Typography
                  variant="h6"
                  sx={{ color: "#092181", fontWeight: 600 }}
                >
                  Actividad eliminada correctamente
                </Typography>
                <Typography variant="body2" sx={{ color: "#555", mt: 1 }}>
                  Serás redirigido al Menú Principal...
                </Typography>
              </Dialog>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal para visualizar multimedia (imagen o video) */}
        <Modal
          open={modalAbierto}
          onClose={() => setModalAbierto(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          <Fade in={modalAbierto}>
            <Box
              sx={{
                position: "relative",
                maxWidth: "90vw",
                maxHeight: "90vh",
                outline: "none",
                borderRadius: 2,
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
                overflow: "hidden",
                backgroundColor: "black",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Botón de cierre */}
              <IconButton
                onClick={() => setModalAbierto(false)}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                  },
                  zIndex: 2,
                }}
              >
                <Close />
              </IconButton>

              {/* Contenido dinámico según tipo de archivo */}
              {archivoModal ? (
                tipoArchivoModal === "video" ? (
                  <video
                    src={archivoModal}
                    controls
                    autoPlay={false}
                    style={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "90vh",
                      borderRadius: "8px",
                      objectFit: "contain",
                      backgroundColor: "black",
                    }}
                  />
                ) : (
                  <img
                    src={archivoModal}
                    alt="Vista ampliada"
                    style={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "90vh",
                      borderRadius: "8px",
                      objectFit: "contain",
                      backgroundColor: "black",
                    }}
                  />
                )
              ) : (
                <Typography
                  variant="body1"
                  sx={{ color: "white", textAlign: "center", p: 2 }}
                >
                  No hay archivo para mostrar
                </Typography>
              )}
            </Box>
          </Fade>
        </Modal>

        {/* Snackbar para mensajes */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={tipo}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {mensaje}
          </Alert>
        </Snackbar>
      </Container>
    </Layout>
  );
};

export default GestionActividades;
