import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import {
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Box,
  Slider,
  ToggleButton,
  Card,
  CardContent,
  Chip,
  Grid
} from "@mui/material";
import { Snackbar, Alert } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

// Íconos
import PsychologyIcon from "@mui/icons-material/Psychology";
import MoodBadIcon from "@mui/icons-material/MoodBad";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import LocalHotelIcon from "@mui/icons-material/LocalHotel";
import RestaurantIcon from "@mui/icons-material/Restaurant";

// Íconos clima
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import WbCloudyIcon from "@mui/icons-material/WbCloudy";
import CloudIcon from "@mui/icons-material/Cloud";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import BlurOnIcon from "@mui/icons-material/BlurOn";
import AirIcon from "@mui/icons-material/Air";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import GrainIcon from "@mui/icons-material/Grain";
import OpacityIcon from "@mui/icons-material/Opacity";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";


// Catálogo de emociones
const emocionesSaludMental = [
  {
    categoria: "🔴 Ansiedad",
    emociones: [
      { id: 1, nombre: "Ansiedad Generalizada", icono: <PsychologyIcon />, descripcion: "Preocupación constante y excesiva", color: "#af564cff" },
      { id: 2, nombre: "Ataque de Pánico", icono: <MoodBadIcon />, descripcion: "Miedo intenso con síntomas físicos", color: "#d65e51ff" },
      { id: 3, nombre: "Inquietud", icono: <HourglassEmptyIcon />, descripcion: "Dificultad para estar tranquilo", color: "#881a0eff" },
      { id: 4, nombre: "Evitación", icono: <PsychologyIcon />, descripcion: "Escapar de situaciones temidas", color: "#af3e31ff" },
    ],
  },
  {
    categoria: "🟠 Estrés",
    emociones: [
      { id: 5, nombre: "Estrés Agudo", icono: <MoodBadIcon />, descripcion: "Respuesta inmediata a presión", color: "#ff9800" },
      { id: 6, nombre: "Irritabilidad", icono: <PsychologyIcon />, descripcion: "Baja tolerancia a frustraciones", color: "#c6811bff" },
      { id: 7, nombre: "Agobio", icono: <MoodBadIcon />, descripcion: "Sensación de estar sobrepasado", color: "#rgba(238, 158, 36, 1)" },
      { id: 8, nombre: "Tensión Muscular", icono: <HourglassEmptyIcon />, descripcion: "Rigidez y dolor corporal", color: "#f3a838ff" },
    ],
  },
  {
    categoria: "🔵 Depresión",
    emociones: [
      { id: 9, nombre: "Tristeza Persistente", icono: <MoodBadIcon />, descripcion: "Melancolía prolongada en el tiempo", color: "#1d70b4ff" },
      { id: 10, nombre: "Apatía", icono: <PsychologyIcon />, descripcion: "Falta de interés o motivación", color: "#087ddeff" },
      { id: 11, nombre: "Desesperanza", icono: <MoodBadIcon />, descripcion: "Pérdida de expectativas futuras", color: "#3e64e4ff" },
      { id: 12, nombre: "Fatiga Crónica", icono: <HourglassEmptyIcon />, descripcion: "Cansancio persistente", color: "#207ac3ff" },
    ],
  },
  {
    categoria: "🟢 Síntomas Físicos",
    emociones: [
      { id: 13, nombre: "Problemas de Sueño", icono: <LocalHotelIcon />, descripcion: "Insomnio o exceso de sueño", color: "#1d9821ff" },
      { id: 14, nombre: "Cambios Apetito", icono: <RestaurantIcon />, descripcion: "Aumento o disminución alimenticia", color: "#069c0bff" },
      { id: 15, nombre: "Dificultad Concentración", icono: <PsychologyIcon />, descripcion: "Problemas para enfocarse", color: "#18b00eff" },
      { id: 16, nombre: "Síntomas Somáticos", icono: <PsychologyIcon />, descripcion: "Molestias físicas sin causa médica", color: "#4eb91dff" },
    ],
  },
];

const climaOptions = [
  { value: 1, icon: <WbSunnyIcon />, label: "Soleado", color: "#FFB74D" },
  { value: 2, icon: <WbCloudyIcon />, label: "Parc. Nublado", color: "#90A4AE" },
  { value: 3, icon: <CloudIcon />, label: "Nublado", color: "#78909C" },
  { value: 4, icon: <BeachAccessIcon />, label: "Lluvioso", color: "#4FC3F7" },
  { value: 5, icon: <BlurOnIcon />, label: "Neblina", color: "#B0BEC5" },
  { value: 6, icon: <AirIcon />, label: "Ventoso", color: "#80DEEA" },
  { value: 7, icon: <AcUnitIcon />, label: "Frío", color: "#81D4FA" },
  { value: 8, icon: <WhatshotIcon />, label: "Cálido", color: "#FF8A65" },
  { value: 9, icon: <GrainIcon />, label: "Granizo", color: "#E0E0E0" },
  { value: 10, icon: <OpacityIcon />, label: "Húmedo", color: "#4DB6AC" },
  { value: 11, icon: <WbTwilightIcon />, label: "Seco", color: "#D7CCC8" },
];

const RegistroSintomas = () => {
  const [idUsuario, setIdUsuario] = useState("");
  const [idPaciente, setIdPaciente] = useState(null);
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState(new Date());
  const [emocion, setEmocion] = useState("");
  const [intensidad, setIntensidad] = useState(5);
  const [detonante, setDetonante] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [clima, setClima] = useState(null);
  const [actividad, setActividad] = useState("");
  const [notas, setNotas] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedIdUsuario = localStorage.getItem("idUsuario");
    if (storedIdUsuario) {
      setIdUsuario(storedIdUsuario);
      axios
        .get(`http://localhost:4000/api/auth/paciente/${storedIdUsuario}`)
        .then((res) => {
          console.log("Paciente obtenido:", res.data);
          const paciente = res.data;
          setNombre(paciente.nombre);
          setIdPaciente(paciente.idPaciente);
        })
        .catch((err) => console.error("Error al obtener idPaciente:", err));
    }
  }, []);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("success");

  const mostrarMensaje = (msg, severity = "info") => {
    setMensaje(msg);
    setTipo(severity);
    setOpenSnackbar(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const getSliderColor = (value) => {
    if (value > 7) return "#67121A";
    if (value > 3) return "#2D5D7B";
    return "#092181";
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedFecha = fecha.toISOString().split("T")[0];
    const data = {
      idPaciente,
      fecha: formattedFecha,
      emocion,
      intensidad,
      detonante,
      ubicacion,
      clima,
      actividadReciente: actividad,
      nota: notas,
    };

    axios
      .post("http://localhost:4000/api/sintomas/registrar-sintoma", data)
      .then(() => {

        mostrarMensaje("Síntoma registrado exitosamente.", "success");
        setOpenSnackbar(true);
        setTimeout(() => navigate("/dashboard"), 2000);
      })
      .catch((err) => {
        //Log completo del error para depuración
        console.error("Error completo de Axios:", err);
        let mensajeError = "Error al regsitrar el síntoma.";
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


  return (
    <Layout>
      <Container maxWidth="lg" sx={{ minHeight: "100vh", pt: 0, pb: 4 }}>
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            backgroundColor: "#F4F6F8",
            maxWidth: "75%",
            mx: "auto",
          }}
        >
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
            Registro de Síntomas
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            {/* Info Básica + Intensidad */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              <Card sx={{
                flex: "1 1 100%", minWidth: "280px", flexBasis: "48%",
                alignContent: "center",
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                background: " #f8f9ff",
                border: "1px solid #e0e7ff",
              }}>
                <CardContent>
                  <Typography variant="h6"
                    sx={{
                      color: "#092181",
                      mb: 2,
                      fontWeight: "bold",

                    }}>
                    👤 Información Básica
                  </Typography>
                  <TextField
                    fullWidth l
                    abel="Paciente"
                    value={nombre}
                    disabled
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
                    size="small" />
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                    <DatePicker
                      label="Fecha del registro"
                      value={fecha}
                      disabled
                      onChange={(newValue) => setFecha(newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true, size: "small",
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

              <Card sx={{
                flex: "1 1 100%",
                minWidth: "280px",
                borderRadius: 3,
                flexBasis: "48%",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                background: " #f8f9ff",
                border: "1px solid #e0e7ff",
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: "#092181", mb: 2, fontWeight: "bold" }}>
                    📊 Intensidad del Síntoma
                  </Typography>
                  <Box sx={{ textAlign: "center", mb: 2 }}>
                    <Chip
                      label={`Nivel ${intensidad}/10`}
                      color={intensidad > 7 ? "error" : intensidad > 3 ? "warning" : "primary"}
                      sx={{
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        px: 2,
                        py: 1
                      }}

                    />
                  </Box>
                  <Slider
                    value={intensidad}
                    onChange={(e, newValue) => setIntensidad(newValue)}
                    min={1}
                    max={10}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                    sx={{ color: getSliderColor(intensidad) }}
                  />
                  <Box sx={{ display: "flex", justifyContent: "space-between", px: 1 }}>
                    <Typography variant="caption" sx={{ color: "#092181", fontWeight: "bold" }}>Leve</Typography>
                    <Typography variant="caption" sx={{ color: "#2D5D7B", fontWeight: "bold" }}>Moderado</Typography>
                    <Typography variant="caption" sx={{ color: "#67121A", fontWeight: "bold" }}>Severo</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Emociones */}
            <Card
              sx={{
                alignContent: "center",
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                background: "#f8f9ff",
                border: "1px solid #e0e7ff",
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ color: "#092181", mb: 3, fontWeight: "bold" }}>
                  💭 Selecciona tu Estado Emocional
                </Typography>

                {emocionesSaludMental.map((grupo, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: grupo.categoria.includes("🔴") ? "#d32f2f" :
                          grupo.categoria.includes("🟠") ? "#f57c00" :
                            grupo.categoria.includes("🔵") ? "#1976d2" : "#388e3c",
                        mb: 2,
                        fontWeight: "bold",
                        fontSize: "1rem"
                      }}
                    >
                      {grupo.categoria}
                    </Typography>

                    <Grid container spacing={1.5}>
                      {grupo.emociones.map((emo) => (
                        <Grid item xs={6} sm={4} md={3} key={emo.id}>
                          <ToggleButton
                            value={emo.id}
                            selected={emocion === emo.id}
                            onChange={() => setEmocion(emocion === emo.id ? "" : emo.id)}
                            sx={{
                              cursor: "pointer",
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: "bold",
                              p: 1.5,
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 0.5,
                              borderColor: emo.color,
                              backgroundColor: emocion === emo.id ? emo.color : "transparent",
                              color: emocion === emo.id ? "white" : emo.color,
                              borderWidth: 2,
                              boxShadow: emocion === emo.id
                                ? `0 4px 12px ${emo.color}40`
                                : "0 2px 4px rgba(0,0,0,0.08)",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: emocion === emo.id
                                  ? `0 6px 16px ${emo.color}60`
                                  : `0 4px 8px ${emo.color}30`,
                                backgroundColor: emocion === emo.id ? emo.color : `${emo.color}10`,
                              },
                            }}
                          >
                            <Box sx={{
                              fontSize: "1.5rem",
                              color: emocion === emo.id ? "#363535ff" : emo.color
                            }}>
                              {emo.icono}
                            </Box>
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: "bold",
                                textAlign: "center",
                                lineHeight: 1.2
                              }}
                            >
                              {emo.nombre}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                textAlign: "center",
                                opacity: 0.8,
                                fontSize: "0.65rem",
                                lineHeight: 1.1,
                                color: emocion === emo.id ? "#363535ff" : "#666",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden"
                              }}
                            >
                              {emo.descripcion}
                            </Typography>
                          </ToggleButton>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ))}
              </CardContent>
            </Card>
            {/* Contexto */}
            <Card
              sx={{
                alignContent: "center",
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                background: " #f8f9ff",
                border: "1px solid #e0e7ff",
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ color: "#092181", mb: 2, fontWeight: "bold" }}>
                  🏠 Contexto y Ambiente
                </Typography>
                <TextField
                  fullWidth
                  //required
                  label="¿Qué detonó este estado?"
                  value={detonante}
                  onChange={(e) => setDetonante(e.target.value)}
                  placeholder="Describe la situación o pensamiento que provocó esta emoción..."
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
                  size="small"
                  multiline
                />
                <TextField
                  fullWidth
                  //required
                  label="Ubicación"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  placeholder="¿Dónde te encontrabas?"
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
                  size="small"
                />
                <TextField
                  fullWidth
                  //required
                  label="Actividad reciente"
                  value={actividad}
                  onChange={(e) => setActividad(e.target.value)}
                  placeholder="¿Qué estabas haciendo antes?"
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
                  size="small"
                  multiline
                />
              </CardContent>
            </Card>
            {/* Clima + Notas */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {/* Card Clima */}
              <Card sx={{
                flex: "1 1 48%",
                minWidth: "300px",
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                background: "#f8f9ff",
                border: "1px solid #e0e7ff",
                height: "380px",
                display: "flex",
                flexDirection: "column"
              }}>
                <CardContent sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
                  <Typography variant="h6" sx={{ color: "#092181", mb: 2, fontWeight: "bold" }}>
                    🌤️ Condiciones Climáticas
                  </Typography>

                  {/* Botones de clima con flex */}
                  <Box sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5
                  }}>
                    {[0, 1, 2].map((filaIndex) => (
                      <Box key={filaIndex} sx={{
                        display: "flex",
                        gap: 1.5,
                        flex: 1
                      }}>
                        {climaOptions
                          .slice(
                            Math.floor((filaIndex * climaOptions.length) / 3),
                            Math.floor(((filaIndex + 1) * climaOptions.length) / 3)
                          )
                          .map((climaOption) => (
                            <ToggleButton
                              key={climaOption.value}
                              value={climaOption.value}
                              selected={clima === climaOption.value}
                              onChange={() =>
                                setClima(clima === climaOption.value ? null : climaOption.value)
                              }
                              sx={{
                                cursor: "pointer",
                                flex: 1,
                                height: "70px",
                                textTransform: "capitalize",
                                borderRadius: 2,
                                border: "2px solid",
                                borderColor: clima === climaOption.value ? climaOption.color : "#e0e7ff",
                                backgroundColor: clima === climaOption.value ? climaOption.color : "transparent",
                                color: clima === climaOption.value ? "white" : "#424242",
                                boxShadow: `0 4px 12px ${climaOption.color}40`,
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  transform: "translateY(-3px)",
                                  boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                                },
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 0.5,
                              }}
                            >
                              <Box sx={{ fontSize: "1.3rem" }}>{climaOption.icon}</Box>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: "bold",
                                  textAlign: "center",
                                  fontSize: "0.65rem",
                                  lineHeight: 1
                                }}
                              >
                                {climaOption.label}
                              </Typography>
                            </ToggleButton>
                          ))}
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>

              {/* Card Notas */}
              <Card sx={{
                flex: "1 1 48%",
                minWidth: "300px",
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                background: "#f8f9ff",
                border: "1px solid #e0e7ff",
                height: "380px",
                display: "flex",
                flexDirection: "column"
              }}>
                <CardContent sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
                  <Typography variant="h6" sx={{ color: "#092181", mb: 2, fontWeight: "bold" }}>
                    📝 Notas
                  </Typography>

                  <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <TextField
                      fullWidth
                      multiline
                      value={notas}
                      onChange={(e) => setNotas(e.target.value)}
                      placeholder="Describe cualquier detalle adicional, pensamientos, sensaciones físicas, estrategias que te ayudaron, o cualquier otra observación importante..."
                      sx={{
                        flex: 1,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: "#ffffff",
                          transition: "all 0.3s ease",
                          height: "100%",
                          alignItems: "flex-start",
                          "& fieldset": {
                            borderColor: "#e0e7ff",
                            borderWidth: "2px",
                          },
                          "&:hover fieldset": {
                            borderColor: "#092181",
                            boxShadow: "0 2px 8px rgba(9, 33, 129, 0.1)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#092181",
                            borderWidth: "2px",
                            boxShadow: "0 4px 12px rgba(9, 33, 129, 0.15)",
                          },
                        },
                        "& .MuiInputBase-input": {
                          color: "#2D3748",
                          fontSize: "0.9rem",
                          lineHeight: "1.5",
                          padding: "16px",
                          height: "100% !important",
                          "&::placeholder": {
                            color: "#718096",
                            opacity: 0.8,
                            fontSize: "0.85rem",
                          },
                        },
                      }}
                      InputProps={{
                        sx: {
                          height: "100%",
                          "& textarea": {
                            height: "100% !important",
                            resize: "none",
                          }
                        }
                      }}
                    />

                    {/* Contador de caracteres */}
                    <Box sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 1,
                      px: 0.5
                    }}>
                      <Typography variant="caption" sx={{ color: "#718096" }}>
                        Escribe tus observaciones...
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: notas.length > 400 ? "#d32f2f" : "#718096",
                          fontWeight: notas.length > 400 ? "bold" : "normal"
                        }}
                      >
                        {notas.length}/1000
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
            <Box
              alignItems={"center"}
              justifyContent={"center"}
              sx={{
                mt: 3,
                p: 2,
              }}

            >
              {/* Botón */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!emocion}
                sx={{
                  backgroundColor: emocion ? "#092181" : "#ccc",
                  borderRadius: 3,
                  px: 5,
                  py: 1.5,
                  fontWeight: "bold",
                  textTransform: "capitalize"
                }}
              >
                {emocion ? "💾 Guardar Registro" : "Selecciona una emoción para guardar"}
              </Button>
            </Box>

          </Box>

          {/*  Snackbar para mensajes*/}
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
        </Paper>
      </Container>
    </Layout>
  );
};

export default RegistroSintomas;
