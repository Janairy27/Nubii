import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/LayoutProf";
import {
  Container,
  TextField,
  Typography,
  Button,
  Box,
  InputAdornment,
  Card,
  CardContent,
  Fade,
  Paper,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { Snackbar, Alert } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SettingsIcon from "@mui/icons-material/Settings";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import LinkIcon from "@mui/icons-material/Link";
import SaveIcon from "@mui/icons-material/Save";

// Íconos para botones
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

import { useNavigate } from "react-router-dom";

export default function RegistroActSug() {
  const [idUsuario, setIdUsuario] = useState("");
  const [idProfesional, setIdProfesional] = useState(null);
  const [nombre, setNombre] = useState("");
  const [nombreAct, setNombreAct] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState(null);
  const [duracion, setDuracion] = useState(null);
  const [nivelDificultad, setNivelDif] = useState(null);
  const [objetivo, setObjetivo] = useState("");
  const [multimedia, setMultimedia] = useState(null);
  const [publico, setPublico] = useState("");
  const [fechaPublicado, setfechaPublicado] = useState(new Date());

  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [tipoM, setTipoM] = useState("success");

  const mostrarMensaje = (msg, severity = "info") => {
    setMensaje(msg);
    setTipoM(severity);
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
        .get(`http://localhost:4000/api/auth/profesional/${storedIdUsuario}`)
        .then((res) => {
          const profesional = res.data;
          setNombre(profesional.nombre);
          setIdProfesional(profesional.idProfesional);
        })
        .catch((err) => {
          console.error("Error al obtener idProfesional:", err);
        });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Usamos FormData para mandar archivo + datos
    const formattedFecha = fechaPublicado.toISOString().split("T")[0];
    const formData = new FormData();
    formData.append("nombreAct", nombreAct);
    formData.append("descripcionAct", descripcion);
    formData.append("tipoAct", tipo);
    formData.append("duracion_minutos", duracion);
    formData.append("dificultad", nivelDificultad);
    formData.append("objetivo", objetivo);
    formData.append("publico", publico);
    formData.append("idProfesional", idProfesional);
    formData.append("fechaPublicado", formattedFecha);

    if (multimedia) {
      formData.append("multimedia", multimedia); // Aquí se envía el archivo
    }

    axios
      .post(
        "http://localhost:4000/api/actividades/registro-actividad",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )
      .then(() => {
        mostrarMensaje("Actividad registrada exitosamente.", "success");
        setOpenSnackbar(true);
        setTimeout(() => navigate("/dashboardProf"), 2000);
      })
      .catch((err) => {
        //Log completo del error para depuración
        console.error("Error completo de Axios:", err);
        let mensajeError = "Error al registrar la actividad.";
        if (err.response && err.response.data) {
          const dataError = err.response.data;

          // Verificar que la respuesta 400 tenga datos estructurados
          if (
            dataError.errores &&
            Array.isArray(dataError.errores) &&
            dataError.errores.length > 0
          ) {
            // Unir  los errores de validación en una sola cadena
            mensajeError = `Errores de validación: ${dataError.errores.join(
              "; "
            )}`;
          }
          // Mostrar el mensaje de error específico o el genérico
          else if (dataError.message) {
            mensajeError = dataError.message;
          }
        }
        mostrarMensaje(mensajeError, "error");
      });
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
          <Fade in={true} timeout={800}>
            <Box display="flex" flexDirection="column" gap={3}>
              {/* Card principal */}
              <Card
                elevation={10}
                sx={{
                  p: { xs: 3, md: 5 },
                  borderRadius: 4,
                  background: "rgba(255, 254, 254, 1)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                <Box textAlign="center" mb={4}>
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
                    Registro de Actividades
                  </Typography>
                </Box>

                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  display="flex"
                  flexDirection="column"
                  gap={3}
                >
                  {/* Profesional */}
                  <Card
                    variant="outlined"
                    sx={{
                      flex: "1 1 100%",
                      minWidth: "280px",
                      flexBasis: "48%",
                      alignContent: "center",
                      borderRadius: 3,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      background: " #F4F6F8",
                      border: "1px solid #b6c6f9ff",
                    }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <PersonIcon color="primary" />
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{
                            background: "#092181",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          Información del Profesional
                        </Typography>
                      </Box>
                      <TextField
                        label="Profesional"
                        value={nombre}
                        disabled
                        fullWidth
                        sx={{
                          "& .Mui-disabled": { WebkitTextFillColor: "#2D5D7B" },
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
                      <LocalizationProvider
                        dateAdapter={AdapterDateFns}
                        adapterLocale={es}
                      >
                        <DatePicker
                          label="Fecha de creación"
                          value={fechaPublicado}
                          onChange={(newValue) => setfechaPublicado(newValue)}
                          disabled
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: "small",
                              sx: {
                                mt: 2,
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
                              },
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </CardContent>
                  </Card>

                  {/* Actividad */}
                  <Card
                    variant="outlined"
                    sx={{
                      flex: "1 1 100%",
                      minWidth: "280px",
                      flexBasis: "48%",
                      alignContent: "center",
                      borderRadius: 3,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      background: " #F4F6F8",
                      border: "1px solid #b6c6f9ff",
                    }}
                  >
                    <CardContent>
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
                      <TextField
                        //required
                        fullWidth
                        label="Nombre de la actividad"
                        value={nombreAct}
                        onChange={(e) => setNombreAct(e.target.value)}
                        placeholder="Ingresa el nombre de la actividad"
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
                        //required
                        fullWidth
                        multiline
                        rows={3}
                        label="Descripción"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Ingresa la descripción de la actividad"
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

                  {/* Configuración */}
                  <Card
                    variant="outlined"
                    sx={{
                      flex: "1 1 100%",
                      minWidth: "280px",
                      flexBasis: "48%",
                      alignContent: "center",
                      borderRadius: 3,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      background: " #F4F6F8",
                      border: "1px solid #b6c6f9ff",
                      p: 2,
                    }}
                  >
                    <CardContent>
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

                      {/* Tipo */}
                      <Typography
                        sx={{
                          mb: 1,
                          fontWeight: 600,
                          background: " #2D5D7B",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        Tipo de Actividad
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={2}>
                        {[
                          {
                            text: "Respiración guiada",
                            icon: <AirIcon fontSize="large" />,
                            value: 1,
                            color: "#4caf50",
                          },
                          {
                            text: "Relajación",
                            icon: <SelfImprovementIcon fontSize="large" />,
                            value: 2,
                            color: "#2196f3",
                          },
                          {
                            text: "Movimiento físico suave",
                            icon: <DirectionsRunIcon fontSize="large" />,
                            value: 3,
                            color: "#ff9800",
                          },
                          {
                            text: "Aire libre",
                            icon: <ParkIcon fontSize="large" />,
                            value: 4,
                            color: "#009688",
                          },
                          {
                            text: "Actividad física activa",
                            icon: <FitnessCenterIcon fontSize="large" />,
                            value: 5,
                            color: "#9c27b0",
                          },
                          {
                            text: "Desahogo emocional",
                            icon: (
                              <SentimentSatisfiedAltIcon fontSize="large" />
                            ),
                            value: 6,
                            color: "#e91e63",
                          },
                          {
                            text: "Actividad creativa",
                            icon: <BrushIcon fontSize="large" />,
                            value: 7,
                            color: "#ff5722",
                          },
                          {
                            text: "Social",
                            icon: <GroupIcon fontSize="large" />,
                            value: 8,
                            color: "#03a9f4",
                          },
                          {
                            text: "Organización",
                            icon: <ChecklistIcon fontSize="large" />,
                            value: 9,
                            color: "#607d8b",
                          },
                          {
                            text: "Descanso",
                            icon: <BedtimeIcon fontSize="large" />,
                            value: 10,
                            color: "#795548",
                          },
                          {
                            text: "Estimulación cognitiva",
                            icon: <PsychologyIcon fontSize="large" />,
                            value: 11,
                            color: "#673ab7",
                          },
                          {
                            text: "Visualización positiva",
                            icon: <WbSunnyIcon fontSize="large" />,
                            value: 12,
                            color: "#ffc107",
                          },
                        ].map((item) => (
                          <Button
                            key={item.value}
                            onClick={() => setTipo(item.value)}
                            variant={
                              tipo === item.value ? "contained" : "outlined"
                            }
                            sx={{
                              cursor: "pointer",
                              borderRadius: 3,
                              textTransform: "none",
                              fontWeight: "bold",
                              p: 2,
                              flex: "1 1 100px",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 1,
                              backgroundColor:
                                tipo === item.value ? item.color : "#f0f0f0",
                              color: tipo === item.value ? "white" : item.color,
                              borderColor: item.color,
                              boxShadow:
                                tipo === item.value
                                  ? "0 4px 12px rgba(0,0,0,0.25)"
                                  : "0 2px 6px rgba(0,0,0,0.1)",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "translateY(-3px)",
                                boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                              },
                            }}
                          >
                            {item.icon}
                            <span>{item.text}</span>
                          </Button>
                        ))}
                      </Box>

                      {/* Duración */}
                      <TextField
                        sx={{
                          mt: 2,
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
                        //required
                        type="number"
                        label="Duración (min)"
                        placeholder="Ingresa la duración"
                        value={duracion}
                        onChange={(e) => setDuracion(e.target.value)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">min</InputAdornment>
                          ),
                        }}
                      />

                      {/* Nivel */}
                      <Typography
                        sx={{
                          mt: 2,
                          mb: 1,
                          fontWeight: 600,
                          background: " #2D5D7B",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        Nivel de Dificultad
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={2}>
                        {[
                          {
                            text: "Muy baja",
                            icon: <SignalCellular1BarIcon />,
                            value: 1,
                            gradient: " #56ab2f",
                          },
                          {
                            text: "Baja",
                            icon: <SignalCellular2BarIcon />,
                            value: 2,
                            gradient: " #ffcc33",
                          },
                          {
                            text: "Media",
                            icon: <SignalCellular3BarIcon />,
                            value: 3,
                            gradient: " #8e24aa",
                          },
                          {
                            text: "Alta",
                            icon: <SignalCellular4BarIcon />,
                            value: 4,
                            gradient: " #c51162",
                          },
                        ].map((item) => (
                          <Box
                            key={item.value}
                            onClick={() => setNivelDif(item.value)}
                            sx={{
                              cursor: "pointer",
                              borderRadius: 3,
                              p: 2,
                              flex: "1 1 120px",
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              justifyContent: "center",
                              fontWeight: "bold",
                              color:
                                nivelDificultad === item.value
                                  ? "white"
                                  : "#333",
                              background:
                                nivelDificultad === item.value
                                  ? item.gradient
                                  : "#f0f0f0",
                              boxShadow:
                                nivelDificultad === item.value
                                  ? "0 4px 12px rgba(0,0,0,0.25)"
                                  : "0 2px 6px rgba(0,0,0,0.1)",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "translateY(-3px)",
                                boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                              },
                            }}
                          >
                            {item.icon}
                            {item.text}
                          </Box>
                        ))}
                      </Box>

                      {/* Publicación */}
                      <Typography
                        sx={{
                          mt: 2,
                          mb: 1,
                          fontWeight: 600,
                          background: " #2D5D7B",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        Publicación
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {[
                          {
                            text: "Borrador",
                            icon: <DraftsIcon />,
                            value: 1,
                            color: "#9e9e9e",
                          },
                          {
                            text: "Publicar",
                            icon: <PublicIcon />,
                            value: 2,
                            color: "#43a047",
                          },
                        ].map((item) => (
                          <Button
                            key={item.value}
                            startIcon={item.icon}
                            variant={
                              publico === item.value ? "contained" : "outlined"
                            }
                            onClick={() => setPublico(item.value)}
                            sx={{
                              cursor: "pointer",
                              borderRadius: 3,
                              textTransform: "none",
                              fontWeight: "bold",
                              p: 2,
                              flex: "1 1 100px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 1,
                              backgroundColor:
                                publico === item.value
                                  ? item.color
                                  : "transparent",
                              color:
                                publico === item.value ? "white" : item.color,
                              borderColor: item.color,
                              boxShadow:
                                publico === item.value
                                  ? "0 4px 12px rgba(0,0,0,0.25)"
                                  : "0 2px 6px rgba(0,0,0,0.1)",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "translateY(-3px)",
                                backgroundColor:
                                  publico === item.value
                                    ? item.color
                                    : `${item.color}22`,
                              },
                            }}
                          >
                            {item.text}
                          </Button>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>

                  {/* Objetivo y Multimedia */}
                  <Card
                    variant="outlined"
                    sx={{
                      flex: "1 1 100%",
                      minWidth: "280px",
                      flexBasis: "48%",
                      alignContent: "center",
                      borderRadius: 3,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      background: " #F4F6F8",
                      border: "1px solid #b6c6f9ff",
                    }}
                  >
                    <CardContent>
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
                      <TextField
                        //required
                        fullWidth
                        multiline
                        rows={2}
                        label="Objetivo terapéutico"
                        value={objetivo}
                        onChange={(e) => setObjetivo(e.target.value)}
                        placeholder="Ingresa el objetivo terapéutico de la actividad"
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
                      <Typography
                        sx={{
                          mb: 1,
                          fontWeight: 600,
                          textTransform: "capitalize",
                          background: " #2D5D7B",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
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
                        Seleccionar archivo
                        <input
                          type="file"
                          hidden
                          accept="image/*,video/*"
                          onChange={(e) => setMultimedia(e.target.files[0])}
                        />
                      </Button>
                      {multimedia && (
                        <Box sx={{ mt: 2 }}>
                          {multimedia.type.startsWith("image/") ? (
                            <img
                              src={URL.createObjectURL(multimedia)}
                              alt="Vista previa"
                              style={{ width: "100px", borderRadius: "8px" }}
                            />
                          ) : (
                            <Typography
                              variant="body2"
                              sx={{ color: "#2D5D7B" }}
                            >
                              Archivo seleccionado: {multimedia.name}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </CardContent>
                  </Card>

                  {/* Botón Guardar */}
                  <Box textAlign="center">
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={<SaveIcon />}
                      sx={{
                        minWidth: 150,
                        textTransform: "none",
                        background: "#092181",
                        "&:hover": { background: "#1c3cc9" },
                        borderRadius: 2,
                      }}
                    >
                      Guardar Actividad
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Box>
          </Fade>
        </Paper>
        {/*  Snackbar para mensajes */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={tipoM}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {mensaje}
          </Alert>
        </Snackbar>
      </Container>
    </Layout>
  );
}
