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
  Card,
  CardContent,
  Chip,
  Snackbar,
  Tooltip,
  Divider,
  ListItemIcon,
  ListItemText,
  Checkbox,
  FormControlLabel,
  Grid
} from "@mui/material";
import {
  Search,
  ArrowBack,
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
  FilterList,
  AssignmentOutlined,
  RestartAlt,
  SentimentSatisfied,
    SentimentDissatisfied,
    SentimentVerySatisfied,
    SentimentNeutral,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonIcon from '@mui/icons-material/Person';
import CommentIcon from '@mui/icons-material/Comment';

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { es } from "date-fns/locale";


const ListadoEvidencias = () => {
  const [idUsuario, setIdUsuario] = useState("");
  const [idProfesional, setIdProfesional] = useState(null);
  const [nombrePaciente, setNombrePaciente] = useState("");
  const [idPaciente, setIdPaciente] = useState(null);
  const [evidencia, setEvidencia] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensajeSnackbar, setMensajeSnackbar] = useState("");
  const [tipoSnackbar, setTipoSnackbar] = useState("success");
  const [filtrosActivos, setFiltrosActivos] = useState({
    nombre: false,
    actividad: false,
    fecha: false,
    satisfaccion: false
  });

  const [valoresFiltro, setValoresFiltro] = useState({
    nombre: "",
    actividad: "",
    fecha: "",
    satisfaccion: ""
  });

  const [evidenciaSeleccionada, setEvidenciaSeleccionada] = useState(null);

  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const satisfaccionMap = [
    { value: 1, icon: <SentimentDissatisfied sx={{ fontSize: 32 }} />, label: "Muy insatisfecho", color: "#f44336" },
    { value: 2, icon: <SentimentDissatisfied sx={{ fontSize: 32 }} />, label: "Insatisfecho", color: "#ff9800" },
    { value: 3, icon: <SentimentNeutral sx={{ fontSize: 32 }} />, label: "Neutral", color: "#ffeb3b" },
    { value: 4, icon: <SentimentSatisfied sx={{ fontSize: 32 }} />, label: "Satisfecho", color: "#4caf50" },
    { value: 5, icon: <SentimentVerySatisfied sx={{ fontSize: 32 }} />, label: "Muy satisfecho", color: "#2196f3" },
  ];


  const textFieldEstilo = {
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
  };
   const mostrarMensaje = (msg, severity = "info") => {
    setMensajeSnackbar(msg);
    setTipoSnackbar(severity);
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
          setIdProfesional(profesional.idProfesional);
        })
        .catch((err) => {
          console.error("Error al obtener idProfesional:", err);
        });
    }
  }, []);

  useEffect(() => {
    if (idProfesional) {
      obtenerevidencia();
    }
  }, [idProfesional]);
  

  const obtenerevidencia = () => {
    axios
      .get(`http://localhost:4000/api/evidencia/by-filterProf/`, { params: { idProfesional } }
      )
      .then((res) => {
        setEvidencia(res.data);
        setEvidenciaSeleccionada(null);
       
      })
      .catch((err) => {
        console.error("Error al cargar evidencias:", err);
        setEvidencia([]);
      });
  };

  const handleBuscar = () => {
    const filtrosAplicados = {};

    if (filtrosActivos.nombre && valoresFiltro.nombre.trim()) {
      filtrosAplicados.nombrePaciente = valoresFiltro.nombre;
    }
    if (filtrosActivos.actividad && valoresFiltro.actividad.trim()) {
      filtrosAplicados.nombreActividad = valoresFiltro.actividad;
    }
    if (filtrosActivos.fecha && valoresFiltro.fecha) {
      filtrosAplicados.fecha_realizada = valoresFiltro.fecha;
    }
    if (filtrosActivos.satisfaccion && valoresFiltro.satisfaccion) {
      filtrosAplicados.satisfaccion = valoresFiltro.satisfaccion;
    }

    if (Object.keys(filtrosAplicados).length === 0) {
      obtenerevidencia();
      return;
    }

    const queryParams = new URLSearchParams(filtrosAplicados).toString();

    axios
      .get(`http://localhost:4000/api/evidencia/by-filterProf?${queryParams}`, { params: { idProfesional } }
      )
      .then((res) => {
        setEvidencia(res.data);
        setEvidenciaSeleccionada(null);
         mostrarMensaje("Búsqueda realizada correcamente", "success");
      
      })
      .catch(() => {
        mostrarMensaje("No se encontraron evidencias con esos filtros.", "warning");
        obtenerevidencia();
      });
  };

  const handleLimpiarFiltros = () => {
    setFiltrosActivos({
      nombre: false,
      actividad: false,
      fecha: false,
      satisfaccion: false,
    });

    setValoresFiltro({
      nombre: "",
      actividad: "",
      fecha: "",
      satisfaccion: "",
    });

    obtenerevidencia();
  };

  const handleSeleccionar = (evidencia) => {
    setEvidenciaSeleccionada(evidencia);
  };
  const InfoItem = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
      <Box sx={{
        mr: 2,
        color: '#355C7D',
        display: 'flex',
        alignItems: 'center',
        minWidth: '24px',
        mt: 0.5
      }}>
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 'medium', wordBreak: 'break-word' }}>
          {value || "No especificado"}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Layout>
      <Container maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          mt: 4,
          pb: 4,
          minHeight: "100vh",
        }}>

        <Paper sx={{
          p: { xs: 2, md: 4 },
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#F4F6F8",
          width: "100%",
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}>
          <Box sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flex: 1,
            justifyContent: { xs: "center", sm: "flex-start" },
            textAlign: { xs: "center", sm: "left" },
          }}

          >
            <AssignmentOutlined sx={{
              color: "#092181",
              fontSize: 36,
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
            }} />
            <Typography variant="h4"
              fontWeight="bold"
              sx={{
                color: "#092181",
                textAlign: "center",
                letterSpacing: 0.5,
                textTransform: "capitalize",
              }}>
              Listado de evidencias
            </Typography>
          </Box>

          {/* Filtros dinámicos */}
          {!evidenciaSeleccionada && (
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                p: { xs: 2, md: 3 },
                gap: 3,
                backgroundColor: "#f9fbff",
                border: "1px solid #dbe3ff",
                borderRadius: 4,
                boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
              }}
            >
              {/* Título */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FilterList sx={{ color: "#092181" }} />
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="#092181"
                  sx={{ flex: 1 }}
                >
                  Filtros de búsqueda
                </Typography>
              </Box>

              {/* Sección de checkboxes */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  justifyContent: "flex-start",
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
                            [key]: !prev[key]
                          }))
                        }
                        sx={{
                          color: "#5A6ACF",
                          "&.Mui-checked": { color: "#092181" },
                          "& .MuiSvgIcon-root": { fontSize: 26 },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontWeight: 500, color: "#1a2e4f" }}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Typography>
                    }
                  />

                ))}
              </Box>
              {/* Campos de filtros activos */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                {filtrosActivos.nombre && (

                  <TextField
                    fullWidth
                    label="Nombre del paciente"
                    onChange={(e) =>
                      setValoresFiltro({ ...valoresFiltro, nombre: e.target.value })
                    }
                    sx={textFieldEstilo}
                  />

                )}
                {filtrosActivos.actividad && (
                  <TextField
                    fullWidth
                    label="Nombre de la actividad"
                    onChange={(e) =>
                      setValoresFiltro({ ...valoresFiltro, actividad: e.target.value })
                    }
                    sx={textFieldEstilo}
                  />

                )}

                {filtrosActivos.fecha && (

                  <TextField
                    fullWidth
                    type="date"
                    label="Fecha de realización"
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) =>
                      setValoresFiltro({ ...valoresFiltro, fecha: e.target.value })
                    }
                    sx={textFieldEstilo}
                  />

                )}

                {filtrosActivos.satisfaccion && (
                  <FormControl fullWidth sx={textFieldEstilo}>
                    <InputLabel>Satisfacción de la actividad</InputLabel>
                    <Select
                      value={valoresFiltro.satisfaccion}
                      onChange={(e) =>
                        setValoresFiltro({ ...valoresFiltro, satisfaccion: e.target.value })
                      }
                      label="Nivel de satisfacción"

                       renderValue={(selectedValue) =>{
                            const selectedSatis = satisfaccionMap.find(
                              (satisfaccion) => satisfaccion.value === selectedValue
                            );
                            if (selectedSatis) {
                              return (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Box sx={{ color: selectedSatis.color, display: 'flex' }}>
                                    {selectedSatis.icon}
                                  </Box>
                                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {selectedSatis.label}
                                  </Typography>
                                </Box>
                              );
                            }
                            return "";
                          }}
                    >
                      {satisfaccionMap.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          <ListItemIcon>
                            <Box sx={{ color: item.color }}>{item.icon}</Box>
                          </ListItemIcon>
                          <ListItemText
                            primary={item.label}
                            primaryTypographyProps={{ sx: { fontWeight: 500 } }}
                          />
                        </MenuItem>
                      ))}

                    </Select>
                  </FormControl>

                )}

              </Box>

              {/* Botones */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: 2,
                  mt: 1,
                }}
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
                    "&:hover": {
                      backgroundColor: "#eef2ff",
                      borderColor: "#092181",
                    },
                  }}
                >
                  Limpiar filtros
                </Button>
              </Box>
            </Card>
          )}


          {/* Listado o Detalle */}
          {!evidenciaSeleccionada ? (
            <Tooltip
              title="Selecciona una tarjeta para ver más detalles"
              placement="top"
              arrow
            >
              <Box sx={{ width: "100%" }}>
                {/* Header */}
                <Box sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: { xs: "center", sm: "space-between" },
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 3,
                }}>
                  {/* Título */}
                  <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    flex: 1,
                    justifyContent: { xs: "center", sm: "flex-start" },
                    textAlign: { xs: "center", sm: "left" },
                  }}>
                    <AssignmentOutlined sx={{ color: "#0D1B2A", fontSize: 34 }} />
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "bold",
                        color: "#0D1B2A",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {evidencia.length > 0
                        ? "Evidencias registradas:"
                        : "No se han registrado evidencias aún."}
                    </Typography>
                  </Box>

                  {/* Contador */}
                  <Chip
                    label={`${evidencia.length} evidencia(s) registrada(s)`}
                    sx={{
                      backgroundColor: "#092181",
                      color: "#fff",
                      fontWeight: "bold",

                    }}
                  />
                </Box>
                {/* Contenedor de tarjetas */}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 3,
                  }}
                >
                  {evidencia.map((evidencia) => (
                    <Card
                      key={evidencia.idevidencia}
                      onClick={() => handleSeleccionar(evidencia)}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        borderRadius: "20px",
                        border: "1px solid #E2E8F0",
                        backgroundColor: "#FFFFFF",
                        width: { xs: "100%", sm: "45%", md: "340px" },
                        minHeight: "260px",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                        "&:hover": {
                          transform: "translateY(-6px)",
                          boxShadow: "0 10px 24px rgba(9,33,129,0.15)",
                          borderColor: "#092181",
                        },
                      }}
                    >
                      <CardContent
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                          gap: 2.5,
                          p: 3,
                        }}
                      >
                        {/* Nombre del paciente */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                          }}
                        >
                          <HealthAndSafetyIcon sx={{ color: "#092181", fontSize: 28 }} />
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color: "#12275c",
                            }}
                          >
                            {evidencia.nombrePaciente}
                          </Typography>
                        </Box>

                        {/* Actividad */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                          }}
                        >
                          <AssignmentTurnedInIcon sx={{ color: "#1E88E5", fontSize: 28 }} />
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              color: "#1a237e",
                            }}
                          >
                            {evidencia.nombreActividad}
                          </Typography>
                        </Box>

                        {/* Fecha */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            backgroundColor: "#f5f6fa",
                            borderRadius: "12px",
                            px: 2,
                            py: 0.6,
                          }}
                        >
                          <CalendarTodayIcon sx={{ fontSize: 18, color: "#5c6bc0" }} />
                          <Typography
                            variant="body2"
                            sx={{ color: "#374151", fontWeight: 500 }}
                          >
                            {new Date(evidencia.fecha_realizada).toLocaleDateString("es-MX", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </Typography>
                        </Box>

                        {/* Nivel de satisfacción */}
                        {(() => {
                          const nivel = satisfaccionMap.find(
                            (s) => s.value === evidencia.satisfaccion
                          );
                          return (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                mt: 1,
                              }}
                            >
                              <Box sx={{ color: nivel?.color }}>{nivel?.icon}</Box>
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: 600,
                                  color: "#12275c",
                                }}
                              >
                                {nivel ? nivel.label : "Sin registro de satisfacción"}
                              </Typography>
                            </Box>
                          );
                        })()}
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
                  alignItems: "center",
                  gap: 4,
                  width: "100%",
                  py: 2,
                }}
              >
                {/* Título principal */}
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{ color: "#092181", textAlign: "center" }}
                >
                  Detalle de la evidencia
                </Typography>
                <Divider sx={{ width: { xs: "80%", sm: "60%" }, mb: 3 }} />

                {/* Contenedor de Cards */}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "stretch",
                    gap: 3,
                    width: "100%",
                  }}
                >
                  {/* Información del paciente */}
                  <Card
                    sx={{
                      flex: "1 1 320px",
                      maxWidth: 420,
                      p: 3,
                      borderRadius: 4,
                      backgroundColor: "#f8f9ff",
                      border: "1px solid #d8e0ff",
                      boxShadow: "0 6px 18px rgba(9, 33, 129, 0.08)",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 8px 24px rgba(9, 33, 129, 0.15)",
                        transform: "translateY(-3px)",
                      },
                    }}
                  >
                    <Box>
                      <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                        <PeopleAltIcon sx={{ color: "#092181", fontSize: 28 }} />
                        <Typography variant="h6" fontWeight="bold" sx={{ color: "#092181" }}>
                          Información del paciente
                        </Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <InfoItem
                        icon={<PersonIcon />}
                        label="Paciente"
                        value={evidenciaSeleccionada.nombrePaciente}
                      />
                    </Box>
                  </Card>

                  {/* Información básica */}
                  <Card
                    sx={{
                      flex: "1 1 320px",
                      maxWidth: 420,
                      p: 3,
                      borderRadius: 4,
                      backgroundColor: "#f9f9fc",
                      border: "1px solid #e0e4fa",
                      boxShadow: "0 6px 18px rgba(9, 33, 129, 0.05)",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 8px 24px rgba(9, 33, 129, 0.12)",
                        transform: "translateY(-3px)",
                      },
                    }}
                  >
                    <Box>
                      <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                        <PsychologyIcon sx={{ color: "#3949ab", fontSize: 28 }} />
                        <Typography variant="h6" fontWeight="bold" sx={{ color: "#3949ab" }}>
                          Información básica de la actividad
                        </Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />

                      <InfoItem
                        icon={<AssignmentTurnedInIcon />}
                        label="Nombre de la actividad"
                        value={evidenciaSeleccionada.nombreActividad}
                      />

                      <InfoItem
                        icon={<CalendarTodayIcon />}
                        label="Fecha en que se realizó"
                        value={new Date(evidenciaSeleccionada.fecha_realizada).toLocaleDateString(
                          "es-MX",
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      />

                      {/* Nivel de satisfacción corregido */}
                      {(() => {
                        const nivel = satisfaccionMap.find(
                          (s) => s.value === evidenciaSeleccionada.satisfaccion
                        );
                        return (
                          <InfoItem
                            icon={nivel?.icon}
                            label="Nivel de satisfacción"
                            value={nivel ? nivel.label : "Sin registro"}
                            sx={{ color: nivel?.color }}
                          />
                        );
                      })()}

                      <InfoItem
                        icon={<CommentIcon />}
                        label="Comentario"
                        value={evidenciaSeleccionada.comentario_Evidencia}
                      />
                    </Box>
                  </Card>
                </Box>

                {/* Botón de acción */}
                <Box textAlign="center" mt={4}>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => setEvidenciaSeleccionada(null)}
                    sx={{
                      borderColor: "#092181",
                      textTransform: "capitalize",
                      color: "#092181",
                      fontWeight: "bold",
                      borderRadius: 3,
                      px: 4,
                      py: 1.2,
                      "&:hover": {
                        backgroundColor: "#092181",
                        color: "#fff",
                      },
                    }}
                  >
                    Volver al listado
                  </Button>
                </Box>
              </Box>


          )}
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
            severity={typeof tipoSnackbar === "string" ? tipoSnackbar : "info"}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {mensajeSnackbar}
          </Alert>
        </Snackbar>
            </Container>
    </Layout>
        );
};

        export default ListadoEvidencias;
