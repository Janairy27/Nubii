import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/LayoutAdmin";
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
} from "@mui/material";
import {
  Search,
  RestartAlt,
  Person,
  ArrowBack,
  FilterList,
  Favorite,
  ZoomIn,
  AccessTime,
} from "@mui/icons-material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import { useNavigate } from "react-router-dom";
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

import SignalCellular1BarIcon from "@mui/icons-material/SignalCellular1Bar";
import SignalCellular2BarIcon from "@mui/icons-material/SignalCellular2Bar";
import SignalCellular3BarIcon from "@mui/icons-material/SignalCellular3Bar";
import SignalCellular4BarIcon from "@mui/icons-material/SignalCellular4Bar";

import DraftsIcon from "@mui/icons-material/Drafts";
import PublicIcon from "@mui/icons-material/Public";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const FiltroActividades = () => {
  const [idUsuario, setIdUsuario] = useState("");
  const [nombreProfesional, setNombreProfesional] = useState("");
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("success");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [archivoModal, setArchivoModal] = useState(null);
  const [tipoArchivoModal, setTipoArchivoModal] = useState(null);

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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

  //Funciones auxiliares para obtener el nombre, icono y color de los maps de tipo de actividad, niveles de dificultad y el estado de publicación
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

  const getNombrePub = (value) => {
    const pub = estadoPublicacion.find((p) => p.value === Number(value));
    return pub ? pub.text : `Desconocido (${value})`;
  };
  const getIconoPub = (value) => {
    const pub = estadoPublicacion.find((p) => p.value === Number(value));
    return pub ? pub.icon : null;
  };
  const getColorPub = (value) => {
    const pub = nivelesDificultad.find((p) => p.value === Number(value));
    return pub ? pub.color : "#666";
  };

  useEffect(() => {
    const storedIdUsuario = localStorage.getItem("idUsuario");
    if (storedIdUsuario) {
      setIdUsuario(storedIdUsuario);
      axios
        .get(`http://localhost:4000/api/auth/usuario/${storedIdUsuario}`)
        .then((res) => {
          const usuario = res.data;
          setIdUsuario(usuario.idUsuario);
        })
        .catch((err) => {
          console.error("Error al obtener idUsuario:", err);
        });
    }
  }, []);

  useEffect(() => {
    obtenerActividades();
  }, []);

  const obtenerActividades = () => {
    axios
      .get(`http://localhost:4000/api/actividades/by-filterUser/`)
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
      setLoading(true);
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
      setLoading(false);
    }
  };

  const handleLimpiarFiltros = () => {
    setFiltrosActivos({
      profesional: false,
      nombre: false,
      tipo: false,
      duracion: false,
      dificultad: false,
    });

    setValoresFiltro({
      profesional: "",
      nombre: "",
      tipo: "",
      duracion: "",
      dificultad: "",
    });

    obtenerActividades();
  };

  const handleSeleccionar = (actividad) => {
    setActividadSeleccionada(actividad);
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
            <Slide in={!actividadSeleccionada} timeout={600} direction="up">
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
                      value={valoresFiltro.profesional}
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
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AssignmentIndIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
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
                          // Encuentra el objeto 'tipo' correspondiente al valor seleccionado
                          const selectedTipoAc = tiposActividad.find(
                            (tipo) => tipo.value === selectedValue
                          );

                          // Si se encuentra, renderiza el icono y el texto en la misma línea
                          // Usamos Box con display: flex para asegurar la alineación horizontal
                          if (selectedTipoAc) {
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
                                    color: selectedTipoAc.color,
                                    display: "flex",
                                  }}
                                >
                                  {selectedTipoAc.icon}
                                </Box>
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {selectedTipoAc.text}
                                </Typography>
                              </Box>
                            );
                          }
                          return "";
                        }}
                      >
                        {tiposActividad.map((tipo) => (
                          <MenuItem key={tipo.value} value={tipo.value}>
                            <ListItemIcon>
                              <Box sx={{ color: tipo.color }}>{tipo.icon}</Box>
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
                          //  Encuentra el objeto 'dificultad' correspondiente al valor seleccionado
                          const selectedDificultad = nivelesDificultad.find(
                            (dificultad) => dificultad.value === selectedValue
                          );

                          // Si se encuentra, renderiza el icono y el texto en la misma línea
                          // Usamos Box con display: flex para asegurar la alineación horizontal
                          if (selectedDificultad) {
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
                                    color: selectedDificultad.color,
                                    display: "flex",
                                  }}
                                >
                                  {selectedDificultad.icon}
                                </Box>
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {selectedDificultad.text}
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
                      sx={{ minWidth: "140px" }}
                    >
                      Buscar
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<RestartAlt />}
                      onClick={handleLimpiarFiltros}
                      sx={{ minWidth: "140px" }}
                    >
                      Limpiar
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Slide>
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
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {actividades.length > 0
                        ? "Actividades registradas:"
                        : "No se han registrado actividades aún."}
                    </Typography>
                  </Box>
                  <Chip
                    label={`${actividades.length} registros`}
                    sx={{
                      backgroundColor: "#092181",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                </Box>

                {/* Lista de actividades  */}
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
                          {actividad.multimedia.match(/\.(mp4|webm|ogg)$/i) ? (
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
                            <ZoomIn sx={{ fontSize: 18, color: "#092181" }} />
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
                          <Typography variant="body2" color="text.secondary">
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
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
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
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
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
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <AccessTime sx={{ fontSize: 16, color: "#2D5D7B" }} />
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
            /* Vista de detalle de la actividad */
            <Card
              sx={{
                borderRadius: 3,
                p: { xs: 2, md: 4 },
                backgroundColor: "#f8f9ff",
                border: "2px solid #092181",
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
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ color: "#092181", textAlign: "center" }}
                >
                  Detalle de la actividad
                </Typography>

                <CardActions>
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
                    Regresar al listado
                  </Button>
                </CardActions>

                <Divider sx={{ width: "100%" }} />

                {/* Contenedor principal de información  */}
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
                      sx={{ display: "flex", flexWrap: "wrap", gap: 3, mt: 2 }}
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
                          <Typography variant="body2" color="text.secondary">
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
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <AccessTime sx={{ color: "#2D5D7B" }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
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
                          color: getColorDif(actividadSeleccionada.dificultad),
                        }}
                      >
                        {getIconoDif(actividadSeleccionada.dificultad)}
                        <Box>
                          <Typography variant="body2" color="text.secondary">
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
                </Box>
              </Box>
            </Card>
          )}
        </Paper>

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

        {/* Modal para multimedia */}
        <Modal
          open={modalAbierto}
          onClose={() => setModalAbierto(false)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          <Box
            sx={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              outline: "none",
            }}
          >
            {tipoArchivoModal === "video" ? (
              <video
                controls
                autoPlay
                src={archivoModal}
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "90vh",
                  borderRadius: "8px",
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
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
            )}
          </Box>
        </Modal>
      </Container>
    </Layout>
  );
};

export default FiltroActividades;
