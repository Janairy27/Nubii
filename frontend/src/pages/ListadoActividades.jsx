import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Select,
  InputLabel,
  FormControl,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Divider,
  Card,
  CardContent,
  Chip,
  CardActions,
  Paper,
  Tooltip,
  CardMedia,
  Slide,
  Alert,
  Snackbar,
  Modal,
  IconButton,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  Backdrop,
} from "@mui/material";
import {
  Search,
  RestartAlt,
  Person,
  ArrowBack,
  FilterList,
  Group,
  LocationOn,
  Favorite,
  MedicalServices,
  Close,
  ZoomIn,
  AccessTime,
  SentimentSatisfied,
  SentimentDissatisfied,
  SentimentVerySatisfied,
  SentimentNeutral,
  Update,
  Delete,
  CheckCircle,
  CalendarToday,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
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
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import SignalCellular1BarIcon from "@mui/icons-material/SignalCellular1Bar";
import SignalCellular2BarIcon from "@mui/icons-material/SignalCellular2Bar";
import SignalCellular3BarIcon from "@mui/icons-material/SignalCellular3Bar";
import SignalCellular4BarIcon from "@mui/icons-material/SignalCellular4Bar";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AddTaskIcon from "@mui/icons-material/AddTask";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const ListadoActividades = () => {
  const [idUsuario, setIdUsuario] = useState("");
  const [idProfesional, setIdProfesional] = useState(null);
  const [nombreProfesional, setNombreProfesional] = useState("");
  const [idPaciente, setIdPaciente] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [filtrosActivos, setFiltrosActivos] = useState({
    profesional: false,
    nombre: false,
    tipo: false,
    duracion: false,
    dificultad: false,
  });

  const [valoresFiltro, setValoresFiltro] = useState({
    profesional: "",
    nombre: "",
    tipo: "",
    duracion: "",
    dificultad: "",
  });

  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("success");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [archivoModal, setArchivoModal] = useState(null);
  const [tipoArchivoModal, setTipoArchivoModal] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  const abrirModalImagen = (url) => {
    setArchivoModal(url);
    if (url.match(/\.(mp4|webm|ogg)$/i)) {
      setTipoArchivoModal("video");
    } else {
      setTipoArchivoModal("imagen");
    }
    setModalAbierto(true);
  };

  const mostrarMensaje = (msg, severity = "info") => {
    setMensaje(msg);
    setTipo(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  // Abrir diálogo de confirmación
  const handleOpenConfirm = () => setOpenConfirm(true);

  // Cancelar
  const handleCloseConfirm = () => setOpenConfirm(false);

  const [vista, setVista] = useState("actividades");

  const [evidencias, setEvidencias] = useState([]);
  const [evidenciaSeleccionada, setEvidenciaSeleccionada] = useState(null);
  const [fechaRealizada, setFechaRea] = useState("");
  const [filtrosActivosEvid, setFiltrosActivosEvid] = useState({
    actividad: false,
    fecha_sugerida: false,
    fecha_realizada: false,
    completada: false,
    satisfaccion: false,
  });

  const [valoresFiltroEvid, setValoresFiltroEvid] = useState({
    actividad: "",
    fecha_sugerida: "",
    fecha_realizada: "",
    completada: "",
    satisfaccion: "",
  });

  const navigate = useNavigate();

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

  const completadaMap = [
    {
      text: "Completada",
      icon: <CheckCircleIcon />,
      value: 2,
      color: "#4caf50",
    },
    { text: "No completada", icon: <CancelIcon />, value: 1, color: "#f44336" },
  ];

  const satisfaccionMap = [
    {
      value: 1,
      icon: <SentimentDissatisfied sx={{ fontSize: 32 }} />,
      label: "Muy insatisfecho",
      color: "#f44336",
    },
    {
      value: 2,
      icon: <SentimentDissatisfied sx={{ fontSize: 32 }} />,
      label: "Insatisfecho",
      color: "#ff9800",
    },
    {
      value: 3,
      icon: <SentimentNeutral sx={{ fontSize: 32 }} />,
      label: "Neutral",
      color: "#ffeb3b",
    },
    {
      value: 4,
      icon: <SentimentSatisfied sx={{ fontSize: 32 }} />,
      label: "Satisfecho",
      color: "#4caf50",
    },
    {
      value: 5,
      icon: <SentimentVerySatisfied sx={{ fontSize: 32 }} />,
      label: "Muy satisfecho",
      color: "#2196f3",
    },
  ];

  // Funciones para obtener nombre, icono y color según valor seleccionado para actividad
  const getNombreAct = (value) => {
    const act = tiposActividad.find((a) => a.value === Number(value));
    return act ? act.text : `Desconocido (${value})`;
  };
  const getIconoAct = (value) => {
    const act = tiposActividad.find((a) => a.value === Number(value));
    return act ? act.icon : null;
  };
  const getColorAct = (value) => {
    const act = tiposActividad.find((a) => a.value === Number(value));
    return act ? act.color : "#666";
  };

  // Funciones para obtener nombre, icono y color según valor seleccionado para dificultad
  const getNombreDif = (value) => {
    const dif = nivelesDificultad.find((n) => n.value === Number(value));
    return dif ? dif.text : `Desconocido (${value})`;
  };
  const getIconoDif = (value) => {
    const dif = nivelesDificultad.find((n) => n.value === Number(value));
    return dif ? dif.icon : null;
  };
  const getColorDif = (value) => {
    const dif = nivelesDificultad.find((a) => a.value === Number(value));
    return dif ? dif.color : "#666";
  };

  // Funciones para obtener nombre, icono y color según valor seleccionado para completada
  const getNombreCompleto = (value) => {
    const comp = completadaMap.find((c) => c.value === Number(value));
    return comp ? comp.text : `Desconocido (${value})`;
  };
  const getIconoCompleto = (value) => {
    const comp = completadaMap.find((n) => n.value === Number(value));
    return comp ? comp.icon : null;
  };
  const getColorCompleto = (value) => {
    const comp = completadaMap.find((a) => a.value === Number(value));
    return comp ? comp.color : "#666";
  };

  // Funciones para obtener nombre, icono y color según valor seleccionado para satisfaccion

  const getNombreSatisfaccion = (value) => {
    const satis = satisfaccionMap.find((n) => n.value === Number(value));
    return satis ? satis.label : `Desconocido (${value})`;
  };
  const getIconoSatisfaccion = (value) => {
    const satis = satisfaccionMap.find((n) => n.value === Number(value));
    return satis ? satis.icon : null;
  };
  const getColorSatisfaccion = (value) => {
    const satis = satisfaccionMap.find((a) => a.value === Number(value));
    return satis ? satis.color : "#666";
  };

  useEffect(() => {
    const storedIdUsuario = localStorage.getItem("idUsuario");
    if (storedIdUsuario) {
      setIdUsuario(storedIdUsuario);
      axios
        .get(`http://localhost:4000/api/auth/paciente/${storedIdUsuario}`)
        .then((res) => {
          const paciente = res.data;
          setIdPaciente(paciente.idPaciente);
        })
        .catch((err) => {
          console.error("Error al obtener idPaciente:", err);
        });
    }
  }, []);

  useEffect(() => {
    if (idPaciente) {
      obtenerActividades();
    }
  }, [idPaciente]);

  const obtenerActividades = () => {
    axios
      .get(`http://localhost:4000/api/actividades/by-filter/`, {
        params: { idPaciente },
      })
      .then((res) => {
        setActividades(res.data);
        setActividadSeleccionada(null);
      })
      .catch((err) => {
        console.error("Error al cargar actividades:", err);
        setActividades([]);
      });
  };

  const handleBuscar = async () => {
    const filtrosAplicados = {};

    if (filtrosActivos.profesional && valoresFiltro.profesional.trim()) {
      filtrosAplicados.nombreProfesional = valoresFiltro.profesional;
    }
    if (filtrosActivos.nombre && valoresFiltro.nombre.trim()) {
      filtrosAplicados.nombreAct = valoresFiltro.nombre;
    }
    if (filtrosActivos.tipo && valoresFiltro.tipo) {
      filtrosAplicados.tipoAct = valoresFiltro.tipo;
    }
    if (filtrosActivos.duracion && valoresFiltro.duracion) {
      filtrosAplicados.duracion_minutos = valoresFiltro.duracion;
    }
    if (filtrosActivos.dificultad && valoresFiltro.dificultad) {
      filtrosAplicados.dificultad = valoresFiltro.dificultad;
    }

    if (Object.keys(filtrosAplicados).length === 0) {
      return obtenerActividades();
    }
    try {
      const queryParams = new URLSearchParams(filtrosAplicados).toString();
      const res = await axios.get(
        `http://localhost:4000/api/actividades/by-filterUser?${queryParams}`
      );

      if (res.data.length === 0) {
        mostrarMensaje(
          "No se encontraron actividades con esos filtros.",
          "warning"
        );
        obtenerActividades();
      } else {
        setActividades(res.data);
        mostrarMensaje("Búsqueda realizada correctamente.", "success");
      }
    } catch (error) {
      console.error("Error en búsqueda:", error);
      mostrarMensaje("Error al realizar la búsqueda.", "error");
    } finally {
    }
  };
  const handleLimpiarFiltros = () => {
    // Desactivar los filtros
    setFiltrosActivos({
      profesional: false,
      nombre: false,
      tipo: false,
      duracion: false,
      dificultad: false,
    });

    // Reseteo de valores
    setValoresFiltro({
      profesional: "",
      nombre: "",
      tipo: "",
      duracion: "",
      dificultad: "",
    });

    // Carga de todas las actividades
    obtenerActividades();
  };

  const handleSeleccionar = (actividad) => {
    setActividadSeleccionada(actividad);
  };

  useEffect(() => {
    if (idPaciente) {
      obtenerEvidencias();
    }
  }, [idPaciente]);

  const obtenerEvidencias = () => {
    if (!idPaciente) {
      console.warn("No se puede obtener evidencias: idPaciente no definido");
      return;
    }

    axios
      .get(`http://localhost:4000/api/evidencia/by-filter`, {
        params: { idPaciente },
      })
      .then((res) => {
        setEvidencias(res.data);
        setEvidenciaSeleccionada(null);
      })
      .catch((err) => {
        console.log("Error al cargar evidencias:", err);
      });
  };

  const handleBuscarEvid = () => {
    const filtrosAplicadosEvid = {};

    if (filtrosActivosEvid.actividad && valoresFiltroEvid.actividad.trim()) {
      filtrosAplicadosEvid.nombreActividad = valoresFiltroEvid.actividad;
    }
    if (filtrosActivosEvid.fecha_sugerida && valoresFiltroEvid.fecha_sugerida) {
      filtrosAplicadosEvid.fecha_sugerida = valoresFiltroEvid.fecha_sugerida;
    }
    if (
      filtrosActivosEvid.fecha_realizada &&
      valoresFiltroEvid.fecha_realizada
    ) {
      filtrosAplicadosEvid.fecha_realizada = valoresFiltroEvid.fecha_realizada;
    }
    if (filtrosActivosEvid.completada && valoresFiltroEvid.completada) {
      filtrosAplicadosEvid.completada = valoresFiltroEvid.completada;
    }
    if (filtrosActivosEvid.satisfaccion && valoresFiltroEvid.satisfaccion) {
      filtrosAplicadosEvid.satisfaccion = valoresFiltroEvid.satisfaccion;
    }

    if (Object.keys(filtrosAplicadosEvid).length === 0) {
      obtenerEvidencias();
      return;
    }

    const queryParamsE = new URLSearchParams(filtrosAplicadosEvid).toString();

    axios
      .get(`http://localhost:4000/api/evidencia/by-filter?${queryParamsE}`, {
        params: { idPaciente },
      })
      .then((res) => {
        mostrarMensaje(
          "Búsqueda de evidencias realizada correctamente.",
          "success"
        );
        setEvidencias(res.data);
        setActividadSeleccionada(null);
      })
      .catch(() => {
        mostrarMensaje(
          "No se encontraron evidencias con estos filtros.",
          "warning"
        );
        obtenerEvidencias();
      });
  };

  const handleLimpiarFiltrosEvid = () => {
    setFiltrosActivosEvid({
      actividad: false,
      fecha_sugerida: false,
      fecha_realizada: false,
      completada: false,
      satisfaccion: false,
    });

    setValoresFiltroEvid({
      actividad: "",
      fecha_sugerida: "",
      fecha_realizada: "",
      completada: "",
      satisfaccion: "",
    });

    obtenerEvidencias();
  };

  const handleSeleccionarEvid = (evidencia) => {
    setEvidenciaSeleccionada(evidencia);
  };

  // Función de actualizar fecha de forma automatica
  const setFechaSinExistir = () => {
    if (!fechaRealizada || !(fechaRealizada instanceof Date)) {
      setFechaRea(new Date());
    }
  };

  const handleActualizar = () => {
    let formattedFecha = null;

    if (fechaRealizada instanceof Date && !isNaN(fechaRealizada)) {
      formattedFecha = fechaRealizada.toISOString().split("T")[0];
    } else {
      console.error("La fecha es inválida");
      return;
    }

    axios
      .put(
        `http://localhost:4000/api/evidencia/actualizar-evidencia/${evidenciaSeleccionada.idEvidencia}`,
        evidenciaSeleccionada
      )
      .then(() => {
        mostrarMensaje("Evidencia actualizada correctamente", "success");
        obtenerEvidencias();
      })
      .catch((err) => {
        //Log completo del error para depuración
        console.error("Error completo de Axios:", err);
        let mensajeError = "Error al actualizar la evidencia.";

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
    const url = `http://localhost:4000/api/evidencia/eliminar-evidencia/${evidenciaSeleccionada.idEvidencia}`;
    try {
      await axios.delete(url);
      setOpenConfirm(false); // cerrar confirmación
      setOpenSuccess(true); // abrir modal de éxito
      setTimeout(() => navigate("/dashboard"), 2000); // redirigir después de 2 seg
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al eliminar la evidencia");
    }
  };
  const InfoItem = ({ icon, label, value }) => (
    <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
      <Box
        sx={{
          mr: 2,
          color: "#355C7D",
          display: "flex",
          alignItems: "center",
          minWidth: "24px",
          mt: 0.5,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: "0.8rem" }}
        >
          {label}
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontWeight: "medium", wordBreak: "break-word" }}
        >
          {value || "No especificado"}
        </Typography>
      </Box>
    </Box>
  );

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
            width: "100%",
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                mb: 3,
              }}
            >
              {[
                {
                  key: "actividades",
                  label: "Actividades",
                  count: actividades?.length || 0,
                },
                {
                  key: "evidencias",
                  label: "Evidencias",
                  count: evidencias?.length || 0,
                },
              ].map((item) => (
                <Button
                  key={item.key}
                  onClick={() => setVista(item.key)}
                  variant={vista === item.key ? "contained" : "outlined"}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "1rem",
                    borderColor: vista === item.key ? "#092181" : "#b0bec5",
                    color: vista === item.key ? "#fff" : "#092181",
                    backgroundColor: vista === item.key ? "#092181" : "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                    transition: "all 0.3s ease",
                    boxShadow:
                      vista === item.key
                        ? "0 4px 10px rgba(9, 33, 129, 0.2)"
                        : "none",
                    "&:hover": {
                      backgroundColor:
                        vista === item.key
                          ? "#06175f"
                          : "rgba(9, 33, 129, 0.08)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 12px rgba(9, 33, 129, 0.15)",
                    },
                  }}
                >
                  {item.label}
                  <Box
                    component="span"
                    sx={{
                      backgroundColor: vista === item.key ? "#fff" : "#092181",
                      color: vista === item.key ? "#092181" : "#fff",
                      borderRadius: "50%",
                      minWidth: 26,
                      height: 26,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      transition: "all 0.3s ease",
                    }}
                  >
                    {item.count}
                  </Box>
                </Button>
              ))}
            </Box>
          </Box>
          {vista === "actividades" ? (
            <>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{
                    color: "#092181",
                    fontSize: { xs: "1.5rem", md: "2rem" },
                  }}
                >
                  Listado de actividades
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ opacity: 0.9, fontSize: { xs: "1rem", md: "1.25rem" } }}
                >
                  Visualiza todas las actividades
                </Typography>
              </Box>

              {/* Filtros dinámicos */}
              {!actividadSeleccionada && (
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    p: { xs: 2, md: 3 },
                    backgroundColor: "#f8f9ff",
                    border: "1px solid #e0e7ff",
                    borderRadius: 3,
                  }}
                >
                  <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
                    <FilterList sx={{ mr: 1, color: "#092181" }} />
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="#092181"
                      sx={{ flex: 1 }}
                    >
                      Selecciona filtros de búsqueda:
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    {Object.entries(filtrosActivos).map(([key, value]) => (
                      <FormControlLabel
                        key={key}
                        control={
                          <Checkbox
                            checked={value}
                            onChange={() =>
                              setFiltrosActivos((prev) => ({
                                ...prev,
                                [key]: !prev[key],
                              }))
                            }
                            sx={{
                              color: "#5A6ACF",
                              "&.Mui-checked": { color: "#092181" },
                              "& .MuiSvgIcon-root": { fontSize: 26 },
                            }}
                          />
                        }
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                      />
                    ))}
                  </Box>
                  <Divider sx={{ mb: 2 }} />

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    {filtrosActivos.profesional && (
                      <TextField
                        sx={{
                          width: "100%",
                          maxWidth: "400px",
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
                        label="Nombre del profesional"
                        onChange={(e) =>
                          setValoresFiltro({
                            ...valoresFiltro,
                            profesional: e.target.value,
                          })
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                    {filtrosActivos.nombre && (
                      <TextField
                        sx={{
                          width: "100%",
                          maxWidth: "400px",
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
                        label="Nombre de la actividad"
                        value={valoresFiltro.nombre}
                        onChange={(e) =>
                          setValoresFiltro({
                            ...valoresFiltro,
                            nombre: e.target.value,
                          })
                        }
                      />
                    )}

                    {filtrosActivos.tipo && (
                      <FormControl
                        sx={{
                          width: "100%",
                          maxWidth: "400px",
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
                      >
                        <InputLabel>Tipo de actividad</InputLabel>
                        <Select
                          value={valoresFiltro.tipo}
                          onChange={(e) =>
                            setValoresFiltro({
                              ...valoresFiltro,
                              tipo: e.target.value,
                            })
                          }
                          label="Tipo de actividad"
                          renderValue={(selectedValue) => {
                            //  Encuentrar el objeto 'tipo' correspondiente al valor seleccionado
                            const selectedTipo = tiposActividad.find(
                              (tipo) => tipo.value === selectedValue
                            );

                            // Si se encuentra, renderiza el icono y el texto en la misma línea
                            // Usamos Box con display: flex para asegurar la alineación horizontal
                            if (selectedTipo) {
                              return (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      color: selectedTipo.color,
                                      display: "flex",
                                    }}
                                  >
                                    {selectedTipo.icon}
                                  </Box>
                                  <Typography
                                    variant="body1"
                                    sx={{ fontWeight: 500 }}
                                  >
                                    {selectedTipo.text}
                                  </Typography>
                                </Box>
                              );
                            }
                            return "";
                          }}
                        >
                          {tiposActividad.map((tipo) => (
                            <MenuItem key={tipo.value} value={tipo.value}>
                              <ListItemIcon sx={{ color: tipo.color }}>
                                {tipo.icon}
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
                    )}

                    {filtrosActivos.duracion && (
                      <TextField
                        sx={{
                          width: "100%",
                          maxWidth: "400px",
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
                        label="Duración (min)"
                        type="number"
                        value={valoresFiltro.duracion}
                        onChange={(e) =>
                          setValoresFiltro({
                            ...valoresFiltro,
                            duracion: e.target.value,
                          })
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">min</InputAdornment>
                          ),
                        }}
                      />
                    )}

                    {filtrosActivos.dificultad && (
                      <FormControl
                        sx={{
                          width: "100%",
                          maxWidth: "400px",
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
                      >
                        <InputLabel>Dificultad</InputLabel>
                        <Select
                          value={valoresFiltro.dificultad}
                          onChange={(e) =>
                            setValoresFiltro({
                              ...valoresFiltro,
                              dificultad: e.target.value,
                            })
                          }
                          label="Dificultad"
                          renderValue={(selectedValue) => {
                            const selectedDifi = nivelesDificultad.find(
                              (dificultad) => dificultad.value === selectedValue
                            );
                            if (selectedDifi) {
                              return (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      color: selectedDifi.color,
                                      display: "flex",
                                    }}
                                  >
                                    {selectedDifi.icon}
                                  </Box>
                                  <Typography
                                    variant="body1"
                                    sx={{ fontWeight: 500 }}
                                  >
                                    {selectedDifi.text}
                                  </Typography>
                                </Box>
                              );
                            }
                            return "";
                          }}
                        >
                          {nivelesDificultad.map((dificultad) => (
                            <MenuItem
                              key={dificultad.value}
                              value={dificultad.value}
                            >
                              <ListItemIcon>
                                <Box sx={{ color: dificultad.color }}>
                                  {dificultad.icon}
                                </Box>
                              </ListItemIcon>
                              <ListItemText
                                primary={dificultad.text}
                                primaryTypographyProps={{
                                  sx: { fontWeight: 500 },
                                }}
                              />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}
                    >
                      <Button
                        variant="contained"
                        startIcon={<Search />}
                        onClick={handleBuscar}
                        sx={{
                          minWidth: 150,
                          textTransform: "none",
                          background: "#092181",
                          "&:hover": { background: "#1c3cc9" },
                          borderRadius: 2,
                          fontWeight: "bold",
                        }}
                      >
                        Buscar
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<RestartAlt />}
                        onClick={handleLimpiarFiltros}
                        sx={{
                          minWidth: 150,
                          textTransform: "none",
                          borderColor: "#092181",
                          color: "#092181",
                          borderRadius: 2,
                          fontWeight: "bold",
                          "&:hover": {
                            backgroundColor: "#eef2ff",
                            borderColor: "#092181",
                          },
                        }}
                      >
                        Limpiar filtros
                      </Button>
                    </Box>
                  </Box>
                </Card>
              )}

              {/* Listado o Detalle */}
              {!actividadSeleccionada ? (
                <Tooltip
                  title="Selecciona una tarjeta para ver más información"
                  arrow
                >
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
                        <AssignmentIndIcon
                          sx={{ color: "#092181", fontSize: 32 }}
                        />
                        <Typography
                          variant="h5"
                          sx={{ color: "#092181", fontWeight: "bold" }}
                        >
                          {actividades.length > 0
                            ? "Actividades registradas:"
                            : "No se han registrado actividades aún."}
                        </Typography>
                      </Box>
                      <Chip
                        label={`${actividades.length} actividade(s) pendiente(s)`}
                        sx={{
                          backgroundColor: "#092181",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 3,

                        justifyContent: { xs: "center", sm: "center" },
                      }}
                    >
                      {actividades.map((actividad) => (
                        <Card
                          key={actividad.idActividad}
                          onClick={() => handleSeleccionar(actividad)}
                          sx={{
                            cursor: "pointer",
                            borderRadius: 3,
                            border: "1px solid #e0e7ff",
                            backgroundColor: "#f9fafc",
                            width: {
                              xs: "100%",
                              sm: "calc(50% - 12px)",
                              md: "350px",
                            },
                            maxWidth: "400px",
                            minWidth: "280px",
                            flex: {
                              xs: "1 1 100%",
                              sm: "1 1 calc(50% - 12px)",
                              md: "0 1 350px",
                            },
                            transition: "all 0.3s ease",
                            "&:hover": {
                              boxShadow: "0 8px 20px rgba(9, 33, 129, 0.15)",
                              transform: "translateY(-4px)",
                              borderColor: "#092181",
                            },
                          }}
                        >
                          {/* Multimedia de la actividad */}
                          {actividad.multimedia ? (
                            <Box sx={{ position: "relative" }}>
                              {actividad.multimedia.match(
                                /\.(mp4|webm|ogg)$/i
                              ) ? (
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
                              display: "flex",
                              flexDirection: "column",
                              gap: 2,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <PsychologyIcon
                                sx={{ fontSize: 20, color: "#6a94bfff" }}
                              />
                              <Typography
                                variant="body1"
                                sx={{
                                  color: "#6a94bfff",
                                  fontWeight: 600,
                                  fontSize: "0.9rem",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}
                              >
                                {actividad.nombreProfesional}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <AssignmentIndIcon
                                sx={{ fontSize: 18, color: "#67121A" }}
                              />
                              <Typography
                                variant="h6"
                                sx={{
                                  color: "#67121A",
                                  fontWeight: 600,
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
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                color: getColorAct(actividad.tipoAct),
                              }}
                            >
                              {getIconoAct(actividad.tipoAct)}
                              <Typography variant="body2">
                                {getNombreAct(actividad.tipoAct)}
                              </Typography>
                            </Box>
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
                                sx={{ color: "text.primary", fontWeight: 500 }}
                              >
                                {actividad.duracion_minutos} minutos
                              </Typography>
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
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    {/*  
                    <Typography variant="h6" fontWeight="bold" sx={{ color: "#092181", textAlign: "center" }}>
                      Detalle de la actividad
                    </Typography> */}

                    <Divider sx={{ width: "80%" }} />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mt: 3,
                      }}
                    >
                      {/* Información del Profesional */}
                      <Card
                        sx={{
                          flex: 1,
                          p: 3,
                          borderRadius: 3,
                          backgroundColor: "#f8f9ff",
                          border: "2px solid #092181",
                          boxShadow: "0 4px 12px rgba(9, 33, 129, 0.15)",
                          minWidth: { xs: "100%", md: "300px" },
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          <PeopleAltIcon color="primary" />
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{ color: "#092181" }}
                          >
                            Información del profesional
                          </Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />
                        <InfoItem
                          icon={<Person />}
                          label="Profesional de la Salud"
                          value={actividadSeleccionada.nombreProfesional}
                        />
                      </Card>

                      {/* Información de la Actividad */}
                      <Card
                        sx={{
                          flex: 2,
                          p: 3,
                          borderRadius: 3,
                          backgroundColor: "#f8f9ff",
                          border: "2px solid #092181",
                          boxShadow: "0 4px 12px rgba(9, 33, 129, 0.15)",
                          minWidth: { xs: "100%", md: "400px" },
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          <AssignmentIndIcon color="primary" />
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{ color: "#092181" }}
                          >
                            Información de la actividad
                          </Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />

                        <InfoItem
                          icon={<AssignmentIndIcon />}
                          label="Nombre de la actividad"
                          value={actividadSeleccionada.nombreAct}
                        />

                        <InfoItem
                          icon={<MenuBookIcon />}
                          label="Descripción de la actividad"
                          value={actividadSeleccionada.descripcionAct}
                        />

                        <InfoItem
                          icon={<Favorite />}
                          label="Objetivo de la actividad"
                          value={actividadSeleccionada.objetivo}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 3,
                            mt: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              color: getColorAct(actividadSeleccionada.tipoAct),
                            }}
                          >
                            {getIconoAct(actividadSeleccionada.tipoAct)}
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Tipo de actividad
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: "medium" }}
                              >
                                {getNombreAct(actividadSeleccionada.tipoAct)}
                              </Typography>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <AccessTime sx={{ color: "#2D5D7B" }} />
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Duración
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: "medium" }}
                              >
                                {actividadSeleccionada.duracion_minutos} minutos
                              </Typography>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              color: getColorDif(
                                actividadSeleccionada.dificultad
                              ),
                            }}
                          >
                            {getIconoDif(actividadSeleccionada.dificultad)}
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Dificultad
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: "medium" }}
                              >
                                {getNombreDif(actividadSeleccionada.dificultad)}
                              </Typography>
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
                          startIcon={<AddTaskIcon />}
                          onClick={() => {
                            console.log(
                              "ID",
                              actividadSeleccionada.idActividad
                            );
                            navigate(
                              `/registroEvidencia/${actividadSeleccionada.idActividad}`
                            );
                          }}
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
                          Realizar actividad
                        </Button>

                        <Button
                          variant="outlined"
                          startIcon={<ArrowBack />}
                          onClick={() => setActividadSeleccionada(null)}
                          sx={{
                            textTransform: "capitalize",
                            borderColor: "#092181",
                            color: "#092181",
                            px: 4,
                            "&:hover": {
                              backgroundColor: "#f0f4ff",
                              borderColor: "#092181",
                            },
                          }}
                        >
                          Volver al listado
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
            </>
          ) : (
            <>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{
                    color: "#092181",
                    fontSize: { xs: "1.5rem", md: "2rem" },
                  }}
                >
                  Listado evidencias realizadas
                </Typography>
              </Box>

              {/* Filtros dinámicos */}
              {!evidenciaSeleccionada && (
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    p: { xs: 2, md: 3 },
                    backgroundColor: "#f8f9ff",
                    border: "1px solid #e0e7ff",
                    borderRadius: 3,
                  }}
                >
                  <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
                    <FilterList sx={{ mr: 1, color: "#092181" }} />
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="#092181"
                      sx={{ flex: 1 }}
                    >
                      Selecciona filtros de búsqueda:
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    {Object.entries(filtrosActivosEvid).map(([key, value]) => (
                      <FormControlLabel
                        key={key}
                        control={
                          <Checkbox
                            checked={value}
                            onChange={() =>
                              setFiltrosActivosEvid((prev) => ({
                                ...prev,
                                [key]: !prev[key],
                              }))
                            }
                            sx={{
                              color: "#5A6ACF",
                              "&.Mui-checked": { color: "#092181" },
                              "& .MuiSvgIcon-root": { fontSize: 26 },
                            }}
                          />
                        }
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                      />
                    ))}
                  </Box>
                  <Divider sx={{ mb: 2 }} />

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    {filtrosActivosEvid.actividad && (
                      <TextField
                        sx={{
                          width: "100%",
                          maxWidth: "400px",
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
                        label="Nombre de la actividad"
                        onChange={(e) =>
                          setValoresFiltroEvid({
                            ...valoresFiltroEvid,
                            actividad: e.target.value,
                          })
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                    {filtrosActivosEvid.fecha_sugerida && (
                      <LocalizationProvider
                        dateAdapter={AdapterDateFns}
                        adapterLocale={es}
                      >
                        <DatePicker
                          label="Fecha de sugerencia"
                          value={valoresFiltroEvid.fecha_sugerida}
                          onChange={(newValue) =>
                            setValoresFiltroEvid({
                              ...valoresFiltroEvid,
                              fecha_sugerida: newValue,
                            })
                          }
                          format="dd/MM/yyyy"
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              InputLabelProps: { shrink: true },
                              sx: {
                                width: "100%",
                                maxWidth: "400px",
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
                                  color: "#777",
                                  opacity: 1,
                                },
                              },
                            },
                          }}
                        />
                      </LocalizationProvider>
                    )}

                    {filtrosActivosEvid.fecha_realizada && (
                      <LocalizationProvider
                        dateAdapter={AdapterDateFns}
                        adapterLocale={es}
                      >
                        <DatePicker
                          label="Fecha en que se realizo"
                          value={valoresFiltroEvid.fecha_realizada}
                          onChange={(newValue) =>
                            setValoresFiltroEvid({
                              ...valoresFiltroEvid,
                              fecha_realizada: newValue,
                            })
                          }
                          format="dd/MM/yyyy"
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              InputLabelProps: { shrink: true },
                              sx: {
                                width: "100%",
                                maxWidth: "400px",
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
                                  color: "#777",
                                  opacity: 1,
                                },
                              },
                            },
                          }}
                        />
                      </LocalizationProvider>
                    )}

                    {filtrosActivosEvid.completada && (
                      <FormControl
                        sx={{
                          width: "100%",
                          maxWidth: "400px",
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
                      >
                        <InputLabel>Estado de la evidencia</InputLabel>
                        <Select
                          value={valoresFiltroEvid.completada}
                          onChange={(e) =>
                            setValoresFiltroEvid({
                              ...valoresFiltroEvid,
                              completada: e.target.value,
                            })
                          }
                          label="Estado"
                          renderValue={(selectedValue) => {
                            const selectedComp = completadaMap.find(
                              (completada) => completada.value === selectedValue
                            );
                            if (selectedComp) {
                              return (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      color: selectedComp.color,
                                      display: "flex",
                                    }}
                                  >
                                    {selectedComp.icon}
                                  </Box>
                                  <Typography
                                    variant="body1"
                                    sx={{ fontWeight: 500 }}
                                  >
                                    {selectedComp.text}
                                  </Typography>
                                </Box>
                              );
                            }
                            return "";
                          }}
                        >
                          {completadaMap.map((completada) => (
                            <MenuItem
                              key={completada.value}
                              value={completada.value}
                            >
                              <ListItemIcon>
                                <Box sx={{ color: completada.color }}>
                                  {completada.icon}
                                </Box>
                              </ListItemIcon>
                              <ListItemText
                                primary={completada.text}
                                primaryTypographyProps={{
                                  sx: { fontWeight: 500 },
                                }}
                              />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}

                    {filtrosActivosEvid.satisfaccion && (
                      <FormControl
                        sx={{
                          width: "100%",
                          maxWidth: "400px",
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
                      >
                        <InputLabel>Satisfaccion</InputLabel>
                        <Select
                          value={valoresFiltroEvid.satisfaccion}
                          onChange={(e) =>
                            setValoresFiltroEvid({
                              ...valoresFiltroEvid,
                              satisfaccion: e.target.value,
                            })
                          }
                          label="Satisfaccion"
                          renderValue={(selectedValue) => {
                            const selectedSast = satisfaccionMap.find(
                              (satisfaccion) =>
                                satisfaccion.value === selectedValue
                            );
                            if (selectedSast) {
                              return (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      color: selectedSast.color,
                                      display: "flex",
                                    }}
                                  >
                                    {selectedSast.icon}
                                  </Box>
                                  <Typography
                                    variant="body1"
                                    sx={{ fontWeight: 500 }}
                                  >
                                    {selectedSast.label}
                                  </Typography>
                                </Box>
                              );
                            }
                            return "";
                          }}
                        >
                          {satisfaccionMap.map((satisfaccion) => (
                            <MenuItem
                              key={satisfaccion.value}
                              value={satisfaccion.value}
                            >
                              <ListItemIcon>
                                <Box sx={{ color: satisfaccion.color }}>
                                  {satisfaccion.icon}
                                </Box>
                              </ListItemIcon>
                              <ListItemText
                                primary={satisfaccion.label}
                                primaryTypographyProps={{
                                  sx: { fontWeight: 500 },
                                }}
                              />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}
                    >
                      <Button
                        variant="contained"
                        startIcon={<Search />}
                        onClick={handleBuscarEvid}
                        sx={{
                          minWidth: 150,
                          textTransform: "none",
                          background: "#092181",
                          "&:hover": { background: "#1c3cc9" },
                          borderRadius: 2,
                          fontWeight: "bold",
                        }}
                      >
                        Buscar
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<RestartAlt />}
                        onClick={handleLimpiarFiltrosEvid}
                        sx={{
                          minWidth: 150,
                          textTransform: "none",
                          borderColor: "#092181",
                          color: "#092181",
                          borderRadius: 2,
                          fontWeight: "bold",
                          "&:hover": {
                            backgroundColor: "#eef2ff",
                            borderColor: "#092181",
                          },
                        }}
                      >
                        Limpiar filtros
                      </Button>
                    </Box>
                  </Box>
                </Card>
              )}

              {/* Listado o Detalle */}
              {!evidenciaSeleccionada ? (
                <Tooltip
                  title="Selecciona una tarjeta para ver más información"
                  arrow
                >
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
                        <AssignmentTurnedInIcon
                          sx={{ color: "#092181", fontSize: 30 }}
                        />

                        <Typography
                          variant="h6"
                          sx={{ color: "#092181", fontWeight: "bold" }}
                        >
                          {evidencias.length > 0
                            ? "Evidencias registradas:"
                            : "No se han registrado evidencias aún."}
                        </Typography>
                      </Box>
                      <Chip
                        label={`${evidencias.length} actividade(s) completada(s)`}
                        sx={{
                          backgroundColor: "#092181",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 3,

                        justifyContent: { xs: "center", sm: "center" },
                      }}
                    >
                      {evidencias.map((evidencia) => (
                        <Card
                          key={evidencia.idEvidencia}
                          onClick={() => handleSeleccionarEvid(evidencia)}
                          sx={{
                            cursor: "pointer",
                            borderRadius: 4,
                            border: "1px solid #e3e8ff",
                            background: " #f9fafc ",
                            width: {
                              xs: "100%",
                              sm: "calc(50% - 12px)",
                              md: "350px",
                            },
                            maxWidth: "400px",
                            minWidth: "280px",
                            flex: {
                              xs: "1 1 100%",
                              sm: "1 1 calc(50% - 12px)",
                              md: "0 1 350px",
                            },
                            transition: "all 0.3s ease",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                            "&:hover": {
                              boxShadow: "0 8px 20px rgba(9, 33, 129, 0.15)",
                              transform: "translateY(-5px)",
                              borderColor: "#092181",
                              background: " #f1f5ff",
                            },
                          }}
                        >
                          <CardContent
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 2,
                              p: 3,
                            }}
                          >
                            {/* Título */}
                            <Typography
                              variant="h6"
                              sx={{
                                color: "#092181",
                                fontWeight: 700,
                                fontSize: "1rem",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {evidencia.nombreActividad}
                            </Typography>

                            {/* Fecha sugerida */}
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <CalendarToday
                                sx={{ fontSize: 20, color: "#67121A" }}
                              />
                              <Typography
                                variant="body1"
                                sx={{
                                  color: "#67121A",
                                  fontWeight: 600,
                                  fontSize: "0.95rem",
                                }}
                              >
                                {
                                  new Date(evidencia.fecha_sugerida)
                                    .toISOString()
                                    .split("T")[0]
                                }
                              </Typography>
                            </Box>

                            <Divider sx={{ my: 1.5, borderColor: "#e0e7ff" }} />

                            {/* Estado de completado */}
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                color: getColorCompleto(evidencia.completada),
                              }}
                            >
                              {getIconoCompleto(evidencia.completada)}
                              <Typography sx={{ fontWeight: 500 }}>
                                {getNombreCompleto(evidencia.completada)}
                              </Typography>
                            </Box>

                            {/*Nivel de satisfacción */}
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                color: getColorSatisfaccion(
                                  evidencia.satisfaccion
                                ),
                              }}
                            >
                              {getIconoSatisfaccion(evidencia.satisfaccion)}
                              <Typography sx={{ fontWeight: 500 }}>
                                {getNombreSatisfaccion(evidencia.satisfaccion)}
                              </Typography>
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
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    {/*}
                    <Typography variant="h4" fontWeight="bold" sx={{ color: "#092181", textAlign: "center" }}>
                      Detalle de la evidencia
                    </Typography> */}
                    <Divider sx={{ width: "80%" }} />

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mt: 3,
                      }}
                    >
                      {/* Información del paciente */}
                      <Card
                        sx={{
                          flex: 1,
                          p: 3,
                          borderRadius: 3,
                          backgroundColor: "#f8f9ff",
                          border: "2px solid #092181",
                          boxShadow: "0 4px 12px rgba(9, 33, 129, 0.15)",
                          minWidth: { xs: "100%", md: "300px" },
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          <PeopleAltIcon color="primary" />
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{ color: "#092181" }}
                          >
                            Información del paciente
                          </Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />
                        <InfoItem
                          icon={<Person />}
                          label="Paciente"
                          value={evidenciaSeleccionada.nombrePaciente}
                        />
                      </Card>
                      {/* Información de la Actividad */}
                      <Card
                        sx={{
                          flex: 2,
                          p: 3,
                          borderRadius: 3,
                          backgroundColor: "#f8f9ff",
                          border: "2px solid #092181",
                          boxShadow: "0 4px 12px rgba(9, 33, 129, 0.15)",
                          minWidth: { xs: "100%", md: "400px" },
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          <AssignmentIndIcon color="primary" />
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{ color: "#092181" }}
                          >
                            Información de la actividad
                          </Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />
                        <InfoItem
                          icon={<AssignmentIndIcon />}
                          label="Nombre de la actividad"
                          value={evidenciaSeleccionada.nombreActividad}
                        />

                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 2,
                            mt: 2,
                            justifyContent: "space-between",
                          }}
                        >
                          {[
                            ["fecha_sugerida", "Fecha de sugerencia"],
                            ["fecha_realizada", "Fecha en que se realizo"],
                            ["completada", "¿Fue completada?"],
                            ["satisfaccion", "Nivel de satisfaccion"],
                            ["comentario_Evidencia", "Comentarios"],
                          ].map(([key, label]) => {
                            // Detectar si se trata de un campo especial que requiere un select
                            const isSelect = [
                              "completada",
                              "satisfaccion",
                            ].includes(key);
                            const isEditableField = [
                              "completada",
                              "satisfaccion",
                              "comentario_Evidencia",
                            ].includes(key);
                            const isDateField = [
                              "fecha_sugerida",
                              "fecha_realizada",
                            ].includes(key);
                            // Obtener las opciones según el campo
                            let options = {};
                            if (key === "completada") options = completadaMap;
                            if (key === "satisfaccion")
                              options = satisfaccionMap;
                            const value = evidenciaSeleccionada[key];
                            return (
                              <Box
                                key={key}
                                sx={{
                                  flex: "1 1 48%",
                                  minWidth: "250px",
                                }}
                              >
                                {isSelect ? (
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
                                    <InputLabel>{label}</InputLabel>
                                    <Select
                                      value={value || ""}
                                      label={label}
                                      onChange={(e) => {
                                        setEvidenciaSeleccionada({
                                          ...evidenciaSeleccionada,
                                          [key]: parseInt(e.target.value),
                                        });
                                        setFechaSinExistir();
                                      }}
                                    >
                                      {options.map((opt) => (
                                        <MenuItem
                                          key={opt.value}
                                          value={opt.value}
                                        >
                                          <ListItemIcon>
                                            <Box
                                              sx={{
                                                color: opt.color,
                                              }}
                                            >
                                              {opt.icon}
                                            </Box>
                                          </ListItemIcon>
                                          <Typography sx={{ color: opt.color }}>
                                            {opt.text || opt.label}
                                          </Typography>
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                ) : (
                                  <TextField
                                    sx={{
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
                                    }}
                                    label={label}
                                    type="text"
                                    rows={4}
                                    value={
                                      isDateField && value
                                        ? new Date(value)
                                            .toISOString()
                                            .split("T")[0]
                                        : value || ""
                                    }
                                    onChange={(e) =>
                                      setEvidenciaSeleccionada({
                                        ...evidenciaSeleccionada,
                                        [key]: e.target.value,
                                      })
                                    }
                                    disabled={!isEditableField}
                                    InputLabelProps={
                                      isDateField ? { shrink: true } : {}
                                    }
                                  />
                                )}
                              </Box>
                            );
                          })}
                        </Box>
                      </Card>
                    </Box>
                  </Box>

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
                      Actualizar
                    </Button>

                    <Button
                      variant="outlined"
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
                      startIcon={<ArrowBack />}
                      onClick={() => setEvidenciaSeleccionada(null)}
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
            </>
          )}
        </Paper>

        {/* Animate para el mensaje de eliminación  */}
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
                    ¿Estás seguro de que quieres eliminar está evidencia?
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

        {/* Modal de éxito animado */}
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
                  Evidencia eliminada correctamente
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

export default ListadoActividades;
