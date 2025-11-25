import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
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
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  IconButton,
  Slide,
  Snackbar,
  Divider,
  Tooltip,
  Slider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import {
  Search,
  Edit,
  Delete,
  ArrowBack,
  Update,
  Psychology as PsychologyIcon,
  MoodBad as MoodBadIcon,
  HourglassEmpty as HourglassEmptyIcon,
  LocalHotel as LocalHotelIcon,
  Restaurant as RestaurantIcon,
  WbSunny as WbSunnyIcon,
  WbCloudy as WbCloudyIcon,
  Cloud as CloudIcon,
  BeachAccess as BeachAccessIcon,
  BlurOn as BlurOnIcon,
  Air as AirIcon,
  AcUnit as AcUnitIcon,
  Whatshot as WhatshotIcon,
  Grain as GrainIcon,
  Opacity as OpacityIcon,
  WbTwilight as WbTwilightIcon,
  CalendarToday,
  LocationOn,
  Lightbulb,
  FilterList,
  EmojiEmotions,
  TrendingUp,
  Place,
  WbSunny,
  Notes,
  CheckCircle,
} from "@mui/icons-material";
import { InfoOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { motion, AnimatePresence } from "framer-motion";

const GestionSintomas = () => {
  const [idUsuario, setIdUsuario] = useState("");
  const [idPaciente, setIdPaciente] = useState(null);
  const [sintomas, setSintomas] = useState([]);
  const [criterioBusqueda, setCriterioBusqueda] = useState("emocion");
  const [valorBusqueda, setValorBusqueda] = useState("");
  const [sintomaSeleccionado, setSintomaSeleccionado] = useState(null);


  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("success");
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
      obtenerTodosLosSintomas();
    }
  }, [idPaciente]);

  const emocionesSaludMental = [
    {
      categoria: "🔴 Ansiedad",
      color: "#ff4444",
      emociones: [
        { id: 1, nombre: "Ansiedad Generalizada", icono: <PsychologyIcon /> },
        { id: 2, nombre: "Ataque de Pánico", icono: <MoodBadIcon /> },
        { id: 3, nombre: "Inquietud", icono: <HourglassEmptyIcon /> },
        { id: 4, nombre: "Evitación", icono: <PsychologyIcon /> },
      ],
    },
    {
      categoria: "🟠 Estrés",
      color: "#ff8800",
      emociones: [
        { id: 5, nombre: "Estrés Agudo", icono: <MoodBadIcon /> },
        { id: 6, nombre: "Irritabilidad", icono: <PsychologyIcon /> },
        { id: 7, nombre: "Agobio", icono: <MoodBadIcon /> },
        { id: 8, nombre: "Tensión Muscular", icono: <HourglassEmptyIcon /> },
      ],
    },
    {
      categoria: "🔵 Depresión",
      color: "#4444ff",
      emociones: [
        { id: 9, nombre: "Tristeza Persistente", icono: <MoodBadIcon /> },
        { id: 10, nombre: "Apatía", icono: <PsychologyIcon /> },
        { id: 11, nombre: "Desesperanza", icono: <MoodBadIcon /> },
        { id: 12, nombre: "Fatiga Crónica", icono: <HourglassEmptyIcon /> },
      ],
    },
    {
      categoria: "🟢 Síntomas Físicos",
      color: "#00aa44",
      emociones: [
        { id: 13, nombre: "Problemas de Sueño", icono: <LocalHotelIcon /> },
        { id: 14, nombre: "Cambios Apetito", icono: <RestaurantIcon /> },
        { id: 15, nombre: "Dificultad Concentración", icono: <PsychologyIcon /> },
        { id: 16, nombre: "Síntomas Somáticos", icono: <PsychologyIcon /> },
      ],
    },
  ];

  //Función para obtener las emociones dentro de cada grupo
  const findEmocionById = (id) => {
    for (const grupo of emocionesSaludMental) {
        // Buscamos la emoción dentro del array 'emociones' de ese grupo
        const emocionEncontrada = grupo.emociones.find(e => e.id === id);
        
        // Si encontramos la emoción, devolvemos un objeto con todos los datos necesarios
        if (emocionEncontrada) {
            return {
                value: emocionEncontrada.id, 
                label: emocionEncontrada.nombre,
                icon: emocionEncontrada.icono,
                color: grupo.color 
            };
        }
    }
    return undefined;
};

  const climaOptions = [
    { value: 1, icon: <WbSunnyIcon />, label: "Soleado", color: "#ffb300" },
    { value: 2, icon: <WbCloudyIcon />, label: "Parc. Nublado", color: "#90a4ae" },
    { value: 3, icon: <CloudIcon />, label: "Nublado", color: "#607d8b" },
    { value: 4, icon: <BeachAccessIcon />, label: "Lluvioso", color: "#2196f3" },
    { value: 5, icon: <BlurOnIcon />, label: "Neblina", color: "#bdbdbd" },
    { value: 6, icon: <AirIcon />, label: "Ventoso", color: "#80deea" },
    { value: 7, icon: <AcUnitIcon />, label: "Frío", color: "#29b6f6" },
    { value: 8, icon: <WhatshotIcon />, label: "Cálido", color: "#ff7043" },
    { value: 9, icon: <GrainIcon />, label: "Granizo", color: "#e0e0e0" },
    { value: 10, icon: <OpacityIcon />, label: "Húmedo", color: "#42a5f5" },
    { value: 11, icon: <WbTwilightIcon />, label: "Seco", color: "#8d6e63" },
  ];

  //Funciones auxiliares para obtener el nombre, los iconos y colres, de los maps de emcion y clima
  const getNombreEmocion = (id) => {
    const emocion = emocionesSaludMental
      .flatMap((grupo) => grupo.emociones)
      .find((emo) => emo.id === Number(id));
    return emocion ? emocion.nombre : `Desconocido (${id})`;
  };

  const getIconoEmocion = (id) => {
    const emocion = emocionesSaludMental
      .flatMap((grupo) => grupo.emociones)
      .find((emo) => emo.id === Number(id));
    return emocion ? emocion.icono : null;
  };

  const getColorEmocion = (id) => {
    const grupo = emocionesSaludMental.find(grupo =>
      grupo.emociones.some(emo => emo.id === Number(id))
    );
    return grupo ? grupo.color : "#666";
  };

  const getNombreClima = (value) => {
    const clima = climaOptions.find((c) => c.value === Number(value));
    return clima ? clima.label : `Desconocido (${value})`;
  };

  const getIconoClima = (value) => {
    const clima = climaOptions.find((c) => c.value === Number(value));
    return clima ? clima.icon : null;
  };

  const getColorClima = (value) => {
    const clima = climaOptions.find((c) => c.value === Number(value));
    return clima ? clima.color : "#666";
  };


  const obtenerTodosLosSintomas = () => {
    axios
      .get(`http://localhost:4000/api/sintomas/by-idPaciente/${idPaciente}`)
      .then((res) => {
        setSintomas(res.data);
        setSintomaSeleccionado(null);
      })
      .catch((err) => {
        console.error("Error al cargar síntomas:", err);
      });
  };

const handleBuscar = async () => {
  const termino = String(valorBusqueda).trim();

  if (!termino) {
    await obtenerTodosLosSintomas();
    mostrarMensaje("Mostrando todos los síntomas.", "info");
    return;
  }

  try {
    const res = await axios.get(
      `http://localhost:4000/api/sintomas/by-attribute/${criterioBusqueda}/${encodeURIComponent(
        termino
      )}/${idPaciente}`
    );

    if (res.data && res.data.length > 0) {
      setSintomas(res.data);
      mostrarMensaje("Síntomas encontrados exitosamente.", "success");
    } else {
      mostrarMensaje("No se encontraron síntomas con ese criterio.", "warning");
      await obtenerTodosLosSintomas();
    }
  } catch (error) {
    console.error(error);
    mostrarMensaje("Ocurrió un error al buscar los síntomas.", "error");
    await obtenerTodosLosSintomas();
  } finally {
    // Limpiar los campos siempre al final
    setValorBusqueda("");
    setSintomaSeleccionado(null);
  }
};


  const handleActualizar = () => {
    const payload = {
      fecha: sintomaSeleccionado.fecha,
      emocion: Number(sintomaSeleccionado.emocion),
      clima: Number(sintomaSeleccionado.clima),
      intensidad: sintomaSeleccionado.intensidad,
      detonante: sintomaSeleccionado.detonante,
      ubicacion: sintomaSeleccionado.ubicacion,
      actividadReciente: sintomaSeleccionado.actividadReciente,
      nota: sintomaSeleccionado.nota,
    };

    axios
      .put(
        `http://localhost:4000/api/sintomas/actualizar-sintoma/${sintomaSeleccionado.idSintoma}`,
        payload
      )
      .then(() => {
        mostrarMensaje("Síntoma actualizado correctamente", "success");
        //openSnackbar(true)
        obtenerTodosLosSintomas();
      })
      .catch((err) => {
         //Log completo del error para depuración
        console.error("Error completo de Axios:", err);
        let mensajeError = "Error al actualizar el síntoma.";
         // Verificar que la respuesta 400 tenga datos estructurados
         if (err.response && err.response.data) {
            const dataError = err.response.data;
            
       
            if (dataError.errores && Array.isArray(dataError.errores) && dataError.errores.length > 0) {
                // Unir  los errores de validación en una sola cadena
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

  const handleEliminar = async () => {
    const url =
      `http://localhost:4000/api/sintomas/eliminar-sintoma/${sintomaSeleccionado.idSintoma}`;
    try {
      await axios.delete(url);
      setOpenConfirm(false); // cerrar confirmación
      setOpenSuccess(true); // abrir modal de éxito
      setTimeout(() => navigate("/dashboard"), 2000); // redirigir después de 2 seg
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al eliminar la cuenta");
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return "";
    const date = new Date(fecha);
    return !isNaN(date) ? date.toISOString().split("T")[0] : "";
  };

  const getIntensidadColor = (intensidad) => {
    const num = parseInt(intensidad);
    if (num > 7) return "#f44336";
    if (num > 3) return "#ff9800";
    return "#4caf50";
  };

  //Función para hacer la búsqueda al seleccionar un valor de la lista deplegable
const handleSelectSearch = async (newValue) => {
  setValorBusqueda(newValue);
  
  const termino = String(newValue).trim();

  setValorBusqueda(newValue);

  if (!termino) {
    await obtenerTodosLosSintomas();
    mostrarMensaje("Mostrando todos los síntomas.", "info");
    return;
  }

  try {
    const res = await axios.get(
      `http://localhost:4000/api/sintomas/by-attribute/${criterioBusqueda}/${encodeURIComponent(
        termino
      )}/${idPaciente}`
    );

    if (res.data && res.data.length > 0) {
      setSintomas(res.data);
      mostrarMensaje("Síntomas encontradas exitosamente.", "success");
    } else {
      mostrarMensaje("No se encontraron síntomas con ese criterio.", "warning");
      await obtenerTodosLosSintomas();
    }
  } catch (error) {
    console.error(error);
    mostrarMensaje("Ocurrió un error al buscar los síntomas.", "error");
    await obtenerTodosLosSintomas();
  } finally {
    setSintomaSeleccionado(null);
  }
};

  return (
    <Layout>
      <Container maxWidth="lg" sx={{
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
            p: 4,
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            backgroundColor: "#F4F6F8",
            maxWidth: "75%",
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >

          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{
                color: "#092181",
                fontWeight: "bold",
                mb: 4,
                background: " #2D5D7B",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Gestión de Síntomas
            </Typography>
            <Typography variant="h6" sx={{ color: "#666", opacity: 0.8 }}>
              Monitorea y gestiona tu bienestar emocional
            </Typography>
          </Box>

          {/* Panel de Búsqueda */}
          {!sintomaSeleccionado && (
            <Slide in timeout={600} direction="up">
              <Card
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: "center",
                  gap: 2,
                  p: 3,
                  backgroundColor: "#f8f9ff",
                  border: "1px solid #e0e7ff",
                  borderRadius: 3,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <FilterList sx={{ color: "#092181", mr: 1 }} />
                    <Typography variant="h6" sx={{ color: "#092181", fontWeight: "bold" }}>
                      Búsqueda Avanzada
                    </Typography>
                  </Box>

                  <Box sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    alignItems: { xs: "stretch", sm: "flex-end" }
                  }}>
                    <FormControl sx={{
                      flex: { xs: "1", sm: "0.3" },
                      minWidth: { xs: "100%", sm: "280px", md: "320px" }, 
                      maxWidth: { sm: "380px" }, 
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: "#ffffff",
                        "& fieldset": { borderColor: "#e0e7ff" },
                        "&:hover fieldset": { borderColor: "#092181" },
                        "&.Mui-focused fieldset": { borderColor: "#092181", borderWidth: 2 },
                      },
                    }}>
                      <InputLabel sx={{ color: "#2D5D7B", fontWeight: "bold" }}>
                        Criterio de búsqueda
                      </InputLabel>
                      <Select
                        value={criterioBusqueda}
                        onChange={(e) => setCriterioBusqueda(e.target.value)}
                        label="Criterio de búsqueda"
                      >
                        <MenuItem value="emocion">Emoción</MenuItem>
                        <MenuItem value="intensidad">Intensidad</MenuItem>
                        <MenuItem value="fecha">Fecha</MenuItem>
                        <MenuItem value="detonante">Detonante</MenuItem>
                        <MenuItem value="ubicacion">Ubicación</MenuItem>
                        <MenuItem value="clima">Clima</MenuItem>
                        <MenuItem value="actividadReciente">Actividad</MenuItem>
                      </Select>
                    </FormControl>
                    {/* Campo de búsqueda dinámico */}
                    {criterioBusqueda === "emocion" || criterioBusqueda === "clima" ? (
                      // Si es emoción o clima, mostrar lista desplegable
                      <FormControl
                        sx={{
                          flex: { xs: "1", sm: "0.5" },
                          minWidth: { xs: "100%", sm: "280px", md: "320px" },
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            backgroundColor: "#ffffff",
                            "& fieldset": { borderColor: "#e0e7ff" },
                            "&:hover fieldset": { borderColor: "#092181" },
                            "&.Mui-focused fieldset": { borderColor: "#092181", borderWidth: 2 },
                          },
                        }}
                      >
                        <InputLabel sx={{ color: "#2D5D7B", fontWeight: "bold" }}>
                          {criterioBusqueda === "emocion" ? "Selecciona una emoción" : "Selecciona el clima"}
                        </InputLabel>
                        <Select
                          value={valorBusqueda}
                          onChange={(e) => handleSelectSearch(e.target.value)}
                          label={
                            criterioBusqueda === "emocion"
                              ? "Selecciona una emoción"
                              : "Selecciona el clima"
                          }
                          renderValue={(selectedValue) => {
                            let selectedOption;

                            if (criterioBusqueda === "emocion") {
                              selectedOption = findEmocionById(selectedValue);
                            } else if (criterioBusqueda === "clima") {
                              selectedOption = climaOptions.find(
                                (clima) => clima.value === selectedValue
                              );
                            }

                            if (selectedOption) {
                              return (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Box sx={{ color: selectedOption.color, display: 'flex' }}>
                                    {selectedOption.icon}
                                  </Box>
                                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {selectedOption.label}
                                  </Typography>
                                </Box>
                              );
                            }
                            return "";
                          }}
                        >
                          {/* Si el criterio de búqueda es emoción  */}
                          {criterioBusqueda === "emocion"
                            ? // Aplanamos todas las emociones en una sola lista
                            emocionesSaludMental.flatMap((grupo) =>
                              grupo.emociones.map((emocion) => (
                                <MenuItem key={emocion.id} value={emocion.id}>
                                  <ListItemIcon>
                                    <Box sx={{ color: grupo.color }}>{emocion.icono}</Box>
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={emocion.nombre}
                                    primaryTypographyProps={{
                                      sx: { fontWeight: 500 },
                                    }}
                                  />
                                </MenuItem>
                              ))
                            )
                            : /* Si el criterio de búsqueda es clima  */
                            climaOptions.map((clima) => (
                              <MenuItem key={clima.value} value={clima.value}>
                                <ListItemIcon>
                                  <Box sx={{ color: clima.color }}>{clima.icon}</Box>
                                </ListItemIcon>
                                <ListItemText
                                  primary={clima.label}
                                  primaryTypographyProps={{ sx: { fontWeight: 500 } }}
                                />
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    ) : (

                      <TextField
                        sx={{
                          flex: { xs: "1", sm: "0.5" },
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            backgroundColor: "#ffffff",
                            "& fieldset": { borderColor: "#e0e7ff" },
                            "&:hover fieldset": { borderColor: "#092181" },
                            "&.Mui-focused fieldset": { borderColor: "#092181", borderWidth: 2 },
                          },
                        }}
                        label={`Buscar por ${criterioBusqueda}`}
                        placeholder={criterioBusqueda === "fecha" ? "Ej: 2025-10-29" : ""}
                        value={valorBusqueda}
                        onChange={(e) => setValorBusqueda(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleBuscar()}
                      />
                    )}

                    <Button
                      variant="contained"
                      startIcon={<Search />}
                      onClick={handleBuscar}
                      sx={{
                        borderRadius: 3,
                        height: 56,
                        flex: { xs: "1", sm: "0.2" },
                        backgroundColor: "#092181",
                        textTransform: "capitalize",
                        fontWeight: "bold",
                        "&:hover": { backgroundColor: "#1a3a9d" },
                      }}
                    >
                      Buscar
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Slide>
          )}



          {/* Contenido Principal */}
          {!sintomaSeleccionado ? (
            <Tooltip
              title="Selecciona una tarjeta para poder actualizar o eliminar"
              placement="top"
              arrow
            >
              <Box sx={{ width: "100%" }}>

                {/* Header de Síntomas */}
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
                  <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    flex: 1,
                    justifyContent: { xs: "center", sm: "flex-start" },
                    textAlign: { xs: "center", sm: "left" },
                  }}

                  >
                    <PsychologyIcon sx={{ color: "#092181", fontSize: 32 }} />
                    <Typography variant="h5" sx={{ color: "#092181", fontWeight: "bold" }}>
                      Síntomas Registrados
                    </Typography>
                  </Box>
                  <Chip
                    label={`${sintomas.length} registros`}
                    sx={{
                      backgroundColor: "#092181",
                      color: "white",
                      fontWeight: "bold",
                      alignSelf: { xs: "center", sm: "auto" },
                      px: 2,
                      py: 1,
                      fontSize: { xs: "0.8rem", sm: "0.9rem" },
                    }}
                  />
                </Box>

                {sintomas.length === 0 ? (
                  <Card
                    sx={{
                      p: 6,
                      textAlign: "center",
                      borderRadius: 3,
                      backgroundColor: "#f8f9ff",
                      border: "1px solid #e0e7ff",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                      flex: 1,
                      minHeight: 300,
                    }}
                  >
                    <PsychologyIcon sx={{ fontSize: 64, color: "#666", mb: 2 }} />
                    <Typography variant="h6" sx={{ color: "#666", mb: 1, fontWeight: "bold" }}>
                      No se han registrado síntomas aún
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Comienza registrando tu primer síntoma para llevar un seguimiento de tu bienestar emocional.
                    </Typography>
                  </Card>
                ) : (
                  <Box sx={{
                    display: "flex",
                    flexWrap: "wrap", 
                    justifyContent: "center",
                    alignItems: "stretch",
                    gap: 2,
                  }}>
                    {sintomas.map((sintoma, index) => (
                      <Slide key={sintoma.idSintoma} in timeout={800 + index * 100} direction="up">
                        <Card
                          onClick={() => setSintomaSeleccionado(sintoma)}
                          sx={{
                            flex: "1 1 320px", 
                            maxWidth: 400,
                            borderRadius: 3,
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            backgroundColor: sintomaSeleccionado?.idSintoma === sintoma.idSintoma ? "#f0f4ff" : "#ffffff",
                            border: sintomaSeleccionado?.idSintoma === sintoma.idSintoma
                              ? `2px solid ${getColorEmocion(sintoma.emocion)}`
                              : "1px solid #e0e7ff",
                            transform: sintomaSeleccionado?.idSintoma === sintoma.idSintoma
                              ? "translateY(-8px) scale(1.02)"
                              : "translateY(0)",
                            boxShadow: sintomaSeleccionado?.idSintoma === sintoma.idSintoma
                              ? "0 12px 32px rgba(9, 33, 129, 0.25)"
                              : "0 2px 8px rgba(9, 33, 129, 0.1)",
                            position: "relative",
                            zIndex: sintomaSeleccionado?.idSintoma === sintoma.idSintoma ? 1 : 0,
                            "&:hover": {
                              transform: sintomaSeleccionado?.idSintoma === sintoma.idSintoma
                                ? "translateY(-8px) scale(1.02)"
                                : "translateY(-4px)",
                              boxShadow: sintomaSeleccionado?.idSintoma === sintoma.idSintoma
                                ? "0 12px 32px rgba(34, 38, 55, 0.25)"
                                : "0 8px 24px rgba(45, 47, 57, 0.15)",
                              border: `2px solid ${getColorEmocion(sintoma.emocion)}`,
                            },
                          }}
                        >
                          <CardContent
                            sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}
                          >
                            {/* Header del Card */}
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                flexWrap: "wrap",
                                alignItems: "flex-start",
                                justifyContent: "space-between",
                                gap: 2,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                  flex: 1,
                                  minWidth: 220,
                                }}
                              >
                                <Avatar sx={{ backgroundColor: getColorEmocion(sintoma.emocion), width: 50, height: 50 }}>
                                  {getIconoEmocion(sintoma.emocion)}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="h6" sx={{ color: "#092181", fontWeight: "bold", mb: 0.5 }}>
                                    {getNombreEmocion(sintoma.emocion)}
                                  </Typography>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <CalendarToday sx={{ fontSize: 16, color: "#666" }} />
                                    <Typography variant="body2" sx={{ color: "#666" }}>
                                      {formatFecha(sintoma.fecha)}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                              <Chip
                                label={`Intensidad: ${sintoma.intensidad}`}
                                sx={{
                                  backgroundColor: getIntensidadColor(sintoma.intensidad),
                                  color: "white",
                                  fontWeight: "bold",
                                  minWidth: 100,
                                  alignSelf: "center",
                                }}
                              />
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Información Adicional */}
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                              <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                                <Box sx={{ color: getColorClima(sintoma.clima) }}>
                                  {getIconoClima(sintoma.clima)}
                                </Box>
                                <Typography variant="body2" sx={{ color: "#666" }}>
                                  {getNombreClima(sintoma.clima)}
                                </Typography>
                                {sintoma.ubicacion && (
                                  <>
                                    <Box sx={{ width: 4, height: 4, backgroundColor: "#ccc", borderRadius: "50%" }} />
                                    <LocationOn sx={{ fontSize: 16, color: "#666" }} />
                                    <Typography variant="body2" sx={{ color: "#666" }}>
                                      {sintoma.ubicacion}
                                    </Typography>
                                  </>
                                )}
                              </Box>

                              {sintoma.detonante && (
                                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                                  <Lightbulb sx={{ fontSize: 16, color: "#092181", mt: 0.25 }} />
                                  <Typography variant="body2" sx={{ color: "#666" }}>
                                    <strong>Detonante:</strong> {sintoma.detonante}
                                  </Typography>
                                </Box>
                              )}

                              {sintoma.actividadReciente && (
                                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                                  <Lightbulb sx={{ fontSize: 16, color: "#092181", mt: 0.25 }} />
                                  <Typography variant="body2" sx={{ color: "#666" }}>
                                    <strong>Actividad:</strong> {sintoma.actividadReciente}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Slide>
                    ))}
                  </Box>
                )}
              </Box>
            </Tooltip>
          ) : (
            <Slide in timeout={500} direction="left">
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Header Edición */}
                <Card sx={{
                  borderRadius: 3,
                  backgroundColor: "#f8f9ff",
                  border: "2px solid #092181",
                  boxShadow: "0 4px 12px rgba(9, 33, 129, 0.15)"
                }}>
                  <CardContent sx={{
                    p: 2.5,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                  >
                    <Box sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                    }}>
                      <IconButton
                        onClick={() => setSintomaSeleccionado(null)}
                        sx={{
                          backgroundColor: "#092181",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#1a3a9d",
                            transform: "scale(1.05)"
                          },
                          transition: "all 0.2s ease",
                          flexShrink: 0,
                        }}
                      >
                        <ArrowBack />
                      </IconButton>
                      <Box sx={{
                        flex: 1,
                        minWidth: 200,
                      }}>
                        <Typography variant="h5" sx={{ color: "#092181", fontWeight: "bold", mb: 0.5 }}>
                          Editando Síntoma
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#666" }}>
                          Modifica la información del síntoma seleccionado
                        </Typography>
                      </Box>
                      <Chip
                        icon={<Edit sx={{ fontSize: 18 }} />}
                        label="Modo Edición"
                        sx={{
                          backgroundColor: "#092181",
                          color: "white",
                          fontWeight: "bold",
                          "& .MuiChip-icon": { color: "white" },
                          alignSelf: { xs: "center", sm: "auto" },
                          px: 2,
                          py: 0.5,
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>

                {/* Grid Principal */}
                <Box sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 2,
                  alignItems: "flex-start"
                }}>

                  {/* Columna Izquierda */}
                  <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    flex: 1,
                    minWidth: { md: 0 }
                  }}>
                    {/* Información Básica */}
                    <Card sx={{
                      borderRadius: 3,
                      border: "1px solid #e0e7ff",
                      transition: "all 0.2s ease",
                      "&:hover": { borderColor: "#092181" }
                    }}>
                      <CardContent sx={{ p: 2.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                          <CalendarToday sx={{ color: "#092181", fontSize: 20 }} />
                          <Typography variant="h6" sx={{ color: "#092181", fontWeight: "bold" }}>
                            Información Básica
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <TextField
                            sx={{
                              flex: 1,
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "12px",
                                backgroundColor: "#f5f5f5",
                                "& fieldset": {
                                  borderColor: "#CBD4D8",
                                },
                                "&:hover fieldset": {
                                  borderColor: "#355C7D",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#092181",
                                  borderWidth: 2,
                                },
                              },
                            }}
                            type="date"
                            label="Fecha"
                            InputLabelProps={{ shrink: true }}
                            value={formatFecha(sintomaSeleccionado.fecha)}
                            InputProps={{
                              readOnly: true,
                              sx: {
                                backgroundColor: "#f5f5f5",

                              }
                            }}
                            helperText="⚠️ La fecha no puede ser modificada"
                            FormHelperTextProps={{
                              sx: { color: "#d32f2f", fontStyle: "italic", mt: 0.5, fontSize: 12 },
                            }}
                          />
                          <Tooltip title="Campo bloqueado — la fecha no puede ser editada">
                            <InfoOutlined sx={{ color: "#d32f2f", fontSize: 20, cursor: "help" }} />
                          </Tooltip>
                        </Box>
                      </CardContent>
                    </Card>

                    {/* Intensidad con Slider */}
                    <Card sx={{
                      borderRadius: 3,
                      border: "1px solid #e0e7ff",
                      transition: "all 0.2s ease",
                      "&:hover": { borderColor: "#092181" }
                    }}>
                      <CardContent sx={{ p: 2.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                          <TrendingUp sx={{ color: "#092181", fontSize: 20 }} />
                          <Typography variant="h6" sx={{ color: "#092181", fontWeight: "bold" }}>
                            Nivel de Intensidad
                          </Typography>
                        </Box>
                        <Box sx={{ px: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                            <Typography variant="body2" sx={{ color: "#666", minWidth: 30 }}>
                              1
                            </Typography>
                            <Slider
                              value={sintomaSeleccionado.intensidad || 5}
                              onChange={(_, newValue) =>
                                setSintomaSeleccionado({
                                  ...sintomaSeleccionado,
                                  intensidad: newValue,
                                })
                              }
                              min={1}
                              max={10}
                              step={1}
                              sx={{
                                color: getIntensidadColor(sintomaSeleccionado.intensidad || 5),
                                '& .MuiSlider-thumb': {
                                  backgroundColor: getIntensidadColor(sintomaSeleccionado.intensidad || 5),
                                  width: 20,
                                  height: 20,
                                  '&:hover': {
                                    boxShadow: `0 0 0 8px ${getIntensidadColor(sintomaSeleccionado.intensidad || 5)}22`,
                                  },
                                },
                              }}
                            />
                            <Typography variant="body2" sx={{ color: "#666", minWidth: 30 }}>
                              10
                            </Typography>
                          </Box>
                          <Box sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: 1
                          }}>
                            <Typography variant="body2" sx={{ color: "#666" }}>
                              Valor actual:
                            </Typography>
                            <Chip
                              label={sintomaSeleccionado.intensidad || 5}
                              size="small"
                              sx={{
                                backgroundColor: getIntensidadColor(sintomaSeleccionado.intensidad || 5),
                                color: "white",
                                fontWeight: "bold",
                                minWidth: 40
                              }}
                            />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>

                    {/* Estado Emocional */}
                    <Card sx={{
                      borderRadius: 3,
                      border: "1px solid #e0e7ff",
                      transition: "all 0.2s ease",
                      "&:hover": { borderColor: "#092181" }
                    }}>
                      <CardContent sx={{ p: 2.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                          <EmojiEmotions sx={{ color: "#092181", fontSize: 20 }} />
                          <Typography variant="h6" sx={{ color: "#092181", fontWeight: "bold" }}>
                            Estado Emocional
                          </Typography>
                        </Box>
                        <FormControl fullWidth
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
                          <InputLabel>Emoción Principal</InputLabel>
                          <Select
                            value={sintomaSeleccionado.emocion || ""}
                            onChange={(e) =>
                              setSintomaSeleccionado({
                                ...sintomaSeleccionado,
                                emocion: Number(e.target.value),
                              })
                            }
                            label="Emoción Principal"
                            sx={{ borderRadius: 2 }}
                          >
                            {emocionesSaludMental.flatMap((grupo) =>
                              grupo.emociones.map((emo) => (
                                <MenuItem key={emo.id} value={emo.id}>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    <Box sx={{ color: grupo.color, fontSize: 20 }}>{emo.icono}</Box>
                                    <Box>
                                      <Typography variant="body1">{emo.nombre}</Typography>
                                      <Typography variant="caption" sx={{ color: "#666" }}>
                                        {grupo.grupo}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </MenuItem>
                              ))
                            )}
                          </Select>
                        </FormControl>
                      </CardContent>
                    </Card>
                  </Box>

                  {/* Columna Derecha */}
                  <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    flex: 1,
                    minWidth: { md: 0 }
                  }}>
                    {/* Contexto y Ambiente */}
                    <Card sx={{
                      borderRadius: 3,
                      border: "1px solid #e0e7ff",
                      transition: "all 0.2s ease",
                      "&:hover": { borderColor: "#092181" }
                    }}>
                      <CardContent sx={{ p: 2.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                          <Place sx={{ color: "#092181", fontSize: 20 }} />
                          <Typography variant="h6" sx={{ color: "#092181", fontWeight: "bold" }}>
                            Contexto y Ambiente
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <TextField
                            label="Detonante"
                            value={sintomaSeleccionado.detonante || ""}
                            onChange={(e) =>
                              setSintomaSeleccionado({
                                ...sintomaSeleccionado,
                                detonante: e.target.value,
                              })
                            }
                            placeholder="¿Qué desencadenó este síntoma?"
                            size="small"
                            sx={{
                              borderRadius: 2,
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
                            label="Ubicación"
                            value={sintomaSeleccionado.ubicacion || ""}
                            onChange={(e) =>
                              setSintomaSeleccionado({
                                ...sintomaSeleccionado,
                                ubicacion: e.target.value,
                              })
                            }
                            placeholder="¿Dónde te encontrabas?"
                            size="small"
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

                          />
                          <TextField
                            label="Actividad Reciente"
                            value={sintomaSeleccionado.actividadReciente || ""}
                            onChange={(e) =>
                              setSintomaSeleccionado({
                                ...sintomaSeleccionado,
                                actividadReciente: e.target.value,
                              })
                            }
                            placeholder="¿Qué estabas haciendo?"
                            size="small"
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
                          />
                        </Box>
                      </CardContent>
                    </Card>

                    {/* Condiciones Climáticas */}
                    <Card sx={{
                      borderRadius: 3,
                      border: "1px solid #e0e7ff",
                      transition: "all 0.2s ease",
                      "&:hover": { borderColor: "#092181" }
                    }}>
                      <CardContent sx={{ p: 2.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                          <WbSunny sx={{ color: "#092181", fontSize: 20 }} />
                          <Typography variant="h6" sx={{ color: "#092181", fontWeight: "bold" }}>
                            Condiciones Climáticas
                          </Typography>
                        </Box>
                        <FormControl fullWidth size="small"
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
                          <InputLabel>Estado del Clima</InputLabel>
                          <Select
                            value={sintomaSeleccionado.clima || ""}
                            onChange={(e) =>
                              setSintomaSeleccionado({
                                ...sintomaSeleccionado,
                                clima: Number(e.target.value),
                              })
                            }
                            label="Estado del Clima"
                          >
                            {climaOptions.map((c) => (
                              <MenuItem key={c.value} value={c.value}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                  <Box sx={{ color: c.color, fontSize: 20 }}>{c.icon}</Box>
                                  {c.label}
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </CardContent>
                    </Card>

                    {/* Notas Adicionales */}
                    <Card sx={{
                      borderRadius: 3,
                      border: "1px solid #e0e7ff",
                      transition: "all 0.2s ease",
                      "&:hover": { borderColor: "#092181" }
                    }}>
                      <CardContent sx={{ p: 2.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                          <Notes sx={{ color: "#092181", fontSize: 20 }} />
                          <Typography variant="h6" sx={{ color: "#092181", fontWeight: "bold" }}>
                            Notas Adicionales
                          </Typography>
                        </Box>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          label="Observaciones y Comentarios"
                          value={sintomaSeleccionado.nota || ""}
                          onChange={(e) =>
                            setSintomaSeleccionado({
                              ...sintomaSeleccionado,
                              nota: e.target.value,
                            })
                          }
                          placeholder="Describe cualquier detalle adicional, sensaciones, pensamientos o estrategias que te ayudaron..."
                          size="small"
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
                        />
                      </CardContent>
                    </Card>
                  </Box>
                </Box>

                <Box sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "stretch", sm: "center" },
                  justifyContent: { xs: "center", sm: "space-between" },
                  flexWrap: "wrap",
                  gap: 2,
                  width: "100%",
                }}
                >
                  <Box sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: { xs: "center", sm: "flex-start" },
                    gap: 1.5,
                    flex: "1 1 auto",
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
                      Actualizar Síntoma
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
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: { xs: "center", sm: "flex-end" },
                      flex: "1 1 auto",
                    }}
                  >
                    <Button
                      variant="text"
                      onClick={() => setSintomaSeleccionado(null)}
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
              </Box>
            </Slide>)}

        </Paper>

        {/* Animate para el mensaje o el dialogo de eliminación */}
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
                    ¿Estás seguro de que quieres eliminar esté Síntoma?
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
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                <CheckCircle
                  sx={{ color: "#2E7D32", fontSize: 60, mb: 2 }}
                />
                <Typography variant="h6" sx={{ color: "#092181", fontWeight: 600 }}>
                  Síntoma eliminado correctamente
                </Typography>
                <Typography variant="body2" sx={{ color: "#555", mt: 1 }}>
                  Serás redirigido al Menú Principal...
                </Typography>
              </Dialog>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Snackbar  para mensajes */}
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

export default GestionSintomas;