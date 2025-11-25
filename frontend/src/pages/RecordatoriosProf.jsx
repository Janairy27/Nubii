import React, { useState, useEffect } from "react";
import Layout from "../components/LayoutProf";
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
  Checkbox,
  FormControlLabel,
  MenuItem,
  Card,
  CardContent,
  Chip,
  Paper,
  Alert,
  Snackbar,
  IconButton,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
} from "@mui/material";
import {
  Edit,
  Search,
  RestartAlt,
  FilterList,
  Close,
  Update,
  Delete,
  CheckCircle,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventIcon from "@mui/icons-material/Event";
import WorkIcon from "@mui/icons-material/Work";
import WeekendIcon from "@mui/icons-material/Weekend";
import TodayIcon from "@mui/icons-material/Today";
import ScheduleIcon from "@mui/icons-material/Schedule";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PsychologyIcon from "@mui/icons-material/Psychology";
import MarkunreadMailboxIcon from "@mui/icons-material/MarkunreadMailbox";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AirIcon from "@mui/icons-material/Air";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import EmailIcon from "@mui/icons-material/Email";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import AddAlertIcon from '@mui/icons-material/AddAlert';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import SyncIcon from '@mui/icons-material/Sync';
import PushPinIcon from "@mui/icons-material/PushPin";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';



export default function Recordatorios() {
  const [idUsuario, setIdUsuario] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [hora, setHora] = useState("");
  const [frecuencia, setFrecuencia] = useState(null);
  const [tipo, setTipo] = useState("");
  const [culminado, setCulminado] = useState(null);
  const [notificacion, setNotificacion] = useState(null);
  const [pendientes, setPendientes] = useState([]);
  const [completados, setCompletados] = useState([]);
  const [form, setForm] = useState({
    mensaje: "",
    hora: "",
    frecuencia: 1,
    tipo: "",
    notificacion: 1,
  });
  const [recordatorios, setRecordatorios] = useState([]);
  const [filtrosActivos, setFiltrosActivos] = useState({
    mensaje: false,
    hora: false,
    frecuencia: false,
    tipo: false
  });

  const [valoresFiltro, setValoresFiltro] = useState({
    mensaje: "",
    hora: "",
    frecuencia: "",
    tipo: ""
  });

  const [recordatorioSeleccionado, setRecordatorioSeleccionado] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensajeSnackbar, setMensajeSnackbar] = useState("");
  const [tipoSnackbar, setTipoSnackbar] = useState("success");


  const [editandoId, setEditandoId] = useState(null);
  const [search, setSearch] = useState("");

  const [vista, setVista] = useState("pendientes"); // 'pendientes' o 'completados'


  const frecuenciaMap = [
    { value: 1, nombre: "Una vez", color: "#6c757d", icono: <AccessTimeIcon /> },
    { value: 2, nombre: "Diario", color: "#007bff", icono: <TodayIcon /> },
    { value: 3, nombre: "Días laborales", color: "#28a745", icono: <WorkIcon /> },
    { value: 4, nombre: "Fin de semana", color: "#ff9800", icono: <WeekendIcon /> },
    { value: 5, nombre: "Semanal", color: "#17a2b8", icono: <CalendarTodayIcon /> },
    { value: 6, nombre: "Quincenal", color: "#9c27b0", icono: <EventIcon /> },
    { value: 7, nombre: "Mensual", color: "#e91e63", icono: <ScheduleIcon /> },
  ];

  const tiposRecordatorios = [
    { value: 1, nombre: "Actividad asignada", color: "#1976d2", icono: <AssignmentTurnedInIcon /> },
    { value: 2, nombre: "Registro emocional", color: "#9c27b0", icono: <PsychologyIcon /> },
    { value: 3, nombre: "Cita programada", color: "#2e7d32", icono: <EventIcon /> },
    { value: 4, nombre: "Solicitar cita", color: "#ff9800", icono: <MarkunreadMailboxIcon /> },
    { value: 5, nombre: "Autocuidado", color: "#e91e63", icono: <FavoriteIcon /> },
    { value: 6, nombre: "Respiracion", color: "#00bcd4", icono: <AirIcon /> },
    { value: 7, nombre: "Checkin diario", color: "#9e9d24", icono: <CheckCircleIcon /> },
    { value: 8, nombre: "Meditacion", color: "#8d6e63", icono: <SelfImprovementIcon /> },
  ];



  const notificacionMap = [
    { value: 1, nombre: "Correo electrónico", color: "#1976d2", icono: <EmailIcon /> },
    { value: 2, nombre: "Por el sistema", color: "#ff9800", icono: <NotificationsActiveIcon /> },
  ];

  // Abrir diálogo de confirmación
  const handleOpenConfirm = (id) => {
    setRecordatorioSeleccionado(recordatorios.find(r => r.idRecordatorio === id));
    setOpenConfirm(true);
  }

  // Cancelar
  const handleCloseConfirm = () => setOpenConfirm(false);

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
    const storedId = localStorage.getItem("idUsuario");
    if (storedId) {
      setIdUsuario(storedId);
    }
  }, []);

  useEffect(() => {
    if (idUsuario) {
      obtenerRecordatorios();
    }
  }, [idUsuario]);

  const obtenerRecordatorios = () => {
    axios
      .get(`http://localhost:4000/api/recordatorio/by-filter/`,
        { params: { idUsuario } }
      )
      .then((res) => {
        setRecordatorios(res.data);
        setRecordatorioSeleccionado(null);
        setPendientes(res.data.filter(r => r.culminado !== 2));
        setCompletados(res.data.filter(r => r.culminado === 2));
      })
      .catch((err) => {
        console.error("Error al cargar recordatorios:", err);
        setRecordatorios([]);
        setPendientes([]);
        setCompletados([]);
      });
  };

  const handleToggleCulminado = (recordatorio) => {
    const updated = {
      ...recordatorio,
      culminado: recordatorio.culminado === 2 ? 1 : 2,
    };

    axios
      .put(
        `http://localhost:4000/api/recordatorio/actualizar-recordatorio/${recordatorio.idRecordatorio}`,
        updated
      )
      .then(() => {
        obtenerRecordatorios();
      })
      .catch(() => {
        mostrarMensaje("Error al cambiar el estado del recordatorio");
      });
  };


  const handleBuscar =  async () => {
    const filtrosAplicados = {};

    if (filtrosActivos.mensaje && valoresFiltro.mensaje.trim()) {
      filtrosAplicados.mensaje = valoresFiltro.mensaje;
    }
    if (filtrosActivos.hora && valoresFiltro.hora.trim()) {
      filtrosAplicados.hora = valoresFiltro.hora;
    }
    if (filtrosActivos.frecuencia && valoresFiltro.frecuencia) {
      filtrosAplicados.frecuencia = valoresFiltro.frecuencia;
    }
    if (filtrosActivos.tipo && valoresFiltro.tipo) {
      filtrosAplicados.tipo_recordatorio = valoresFiltro.tipo;
    }
    if (Object.keys(filtrosAplicados).length === 0) {
      obtenerRecordatorios();
      return;
    }

   try {
      const queryParams = new URLSearchParams(filtrosAplicados).toString();
      const res = await axios.get(
        `http://localhost:4000/api/recordatorio/by-filter?${queryParams}`,
        { params: { idUsuario } }
      );

      if (res.data.length === 0) {
        mostrarMensaje("No se encontraron recordatorios con esos filtros.", "warning");
        obtenerRecordatorios();
        
      } else {
        setRecordatorios(res.data);
        setPendientes(res.data.filter((r) => r.culminado !== 2));
        setCompletados(res.data.filter((r) => r.culminado === 2));
        mostrarMensaje("Búsqueda realizada correctamente.", "success");
      }
    } catch (error) {
      console.error("Error en búsqueda:", error);
      mostrarMensaje("Error al realizar la búsqueda.", "error");
    }
  
  };

  const handleLimpiarFiltros = () => {
    setFiltrosActivos({
      mensaje: false,
      hora: false,
      frecuencia: false,
      tipo: false,
    });

    setValoresFiltro({
      mensaje: "",
      hora: "",
      frecuencia: "",
      tipo: ""
    });

    obtenerRecordatorios();
  };

  const handleSeleccionar = (recordatorio) => {
    setRecordatorioSeleccionado(recordatorio);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      mensaje,
      hora,
      frecuencia,
      tipo_recordatorio: tipo,
      idUsuario,
      culminado,
      notificacion
    };

    console.log("Enviando data:", data);
    axios.post("http://localhost:4000/api/recordatorio/registro-recordatorio", data)
    .then(() => {
       navigate("/dashboardProf");
      mostrarMensaje("Recordatorio registrada exitosamente.", "success");
      //setOpenSnackbar(true);
      })
      .catch((err) => {
        //Log completo del error para depuración
        console.error("Error completo de Axios:", err); 

        let mensajeError = "Error al registrar el recordatorio.";
        
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

  const handleActualizar = () => {

    axios
      .put(
        `http://localhost:4000/api/recordatorio/actualizar-recordatorio/${recordatorioSeleccionado.idRecordatorio}`,
        recordatorioSeleccionado
      )
      .then(() => {
        mostrarMensaje("Recordatorio actualizado correctamente", "success");
        obtenerRecordatorios();
        setRecordatorioSeleccionado(null);
      })
      .catch((err) =>{
          //Log completo del error para depuración
        console.error("Error completo de Axios:", err);
        let mensajeError = "Error al actualizar la recordatorio.";

        // Verificar que la respuesta 400 tenga datos estructurados
         if (err.response && err.response.data) {

            const dataError = err.response.data;
            
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

  const handleEliminar = async () => {
    if (!recordatorioSeleccionado) return;
    const url = `http://localhost:4000/api/recordatorio/eliminar-recordatorio/${recordatorioSeleccionado.idRecordatorio}`;
    try {
      await axios.delete(url);
      setOpenConfirm(false); // cerrar confirmación
      setOpenSuccess(true); // abrir modal de éxito
      setTimeout(() => navigate("/dashboardProf"), 2000); // redirigir después de 2 seg
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al eliminar el recordatorio.");
    }
  };

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
        }}
      >
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
        }}
        >
          {/* Título */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              mb: 4,
              position: "relative",
            }}
          >
            <AccessAlarmsIcon
              sx={{
                color: "#092181",
                fontSize: 36,
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
              }}
            />
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                color: "#092181",
                textAlign: "center",
                letterSpacing: 0.5,
                textTransform: "capitalize",
              }}
            >
              Recordatorios
            </Typography>

          </Box>


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
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <FilterList sx={{ mr: 1, color: "#092181" }} />
              <Typography variant="h6"
                fontWeight="bold"
                color="#092181"
                sx={{ flex: 1 }}>
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
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                />

              ))}
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              {filtrosActivos.mensaje && (
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
                  label="Titulo del recordatorio"
                  onChange={(e) =>
                    setValoresFiltro({ ...valoresFiltro, mensaje: e.target.value })
                  }
                />
              )}
              {filtrosActivos.hora && (
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
                  label="Hora de notificación"
                  type="time"
                  value={valoresFiltro.hora}
                  onChange={(e) =>
                    setValoresFiltro({ ...valoresFiltro, hora: e.target.value })
                  }
                />

              )}

              {filtrosActivos.frecuencia && (
                <FormControl
                  sx={{
                    width: "100%", maxWidth: "400px",
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
                  <InputLabel> Frecuencia de notificación</InputLabel>
                  <Select
                    value={valoresFiltro.frecuencia}
                    onChange={(e) =>
                      setValoresFiltro({ ...valoresFiltro, frecuencia: e.target.value })
                    }
                    label="Frecuencia de notificación"
                    renderValue={(selectedValue) => {
                      // Encuentra el objeto 'frecuencia' correspondiente al valor seleccionado
                      const selectedFre = frecuenciaMap.find(
                        (frecuencia) => frecuencia.value === selectedValue
                      );

                      // Si se encuentra, renderiza el icono y el texto en la misma línea
                      // Usamos Box con display: flex para asegurar la alineación horizontal
                      if (selectedFre) {
                        return (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box sx={{ color: selectedFre.color, display: 'flex' }}>
                              {selectedFre.icono}
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {selectedFre.nombre}
                            </Typography>
                          </Box>
                        );
                      }
                      return "";
                    }}
                  >
                    {frecuenciaMap.map((frecuencia) => (
                      <MenuItem key={frecuencia.value} value={frecuencia.value}>
                        <ListItemIcon>
                          <Box sx={{ color: frecuencia.color }}>
                            {frecuencia.icono}
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={frecuencia.nombre}
                          primaryTypographyProps={{
                            sx: { fontWeight: 500 }
                          }}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {filtrosActivos.tipo && (
                <FormControl
                  sx={{
                    width: "100%", maxWidth: "400px",
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
                  <InputLabel>Tipo de recordatorio</InputLabel>
                  <Select
                    value={valoresFiltro.tipo}
                    onChange={(e) =>
                      setValoresFiltro({ ...valoresFiltro, tipo: e.target.value })
                    }
                    label="Tipo de recordatorio"

                    renderValue={(selectedValue) => {
                            //  Encuentra el objeto 'tipo' correspondiente al valor seleccionado
                            const selectedTipo = tiposRecordatorios.find(
                              (tipo) => tipo.value === selectedValue
                            );

                            // Si se encuentra, renderiza el icono y el texto en la misma línea
                            // Usamos Box con display: flex para asegurar la alineación horizontal
                            if (selectedTipo) {
                              return (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Box sx={{ color: selectedTipo.color, display: 'flex' }}>
                                    {selectedTipo.icono}
                                  </Box>
                                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {selectedTipo.nombre}
                                  </Typography>
                                </Box>
                              );
                            }
                            return "";
                          }}
                  >
                    {tiposRecordatorios.map((tipo) => (
                      <MenuItem key={tipo.value} value={tipo.value}>
                        <ListItemIcon>
                          <Box sx={{ color: tipo.color }}>
                            {tipo.icono}
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={tipo.nombre}
                          primaryTypographyProps={{
                            sx: { fontWeight: 500 }
                          }}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

              )}


              {/* Botones de acción */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  mt: 2,
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
                <Button
                  variant="contained"
                  startIcon={mostrarFormulario ? <Close /> : <AddAlertIcon />}
                  onClick={() => setMostrarFormulario(!mostrarFormulario)}
                  sx={{
                    minWidth: '140px',
                    textTransform: "capitalize",
                    background: "#2D5D7B",
                    "&:hover": { background: "#092181" },
                  }}
                    
                >
                  {mostrarFormulario ? "Ocultar formulario" : " Agregar recordatorio"}
                </Button>
              </Box>
            </Box>
          </Card>

           

          {/* Formulario */}
          {mostrarFormulario && (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                width: "100%",
                mt: 3,
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 4,
                  width: "100%",
                  justifyItems: "center",
                }}
              >
                {/*  Información general */}
                <Card
                  sx={{

                    flex: 2,
                    p: { xs: 2, md: 3 },
                    borderRadius: 3,
                    backgroundColor: "#f8f9ff",
                    border: "2px solid #092181",
                    boxShadow: "0 4px 12px rgba(9, 33, 129, 0.15)",
                    minWidth: { xs: "100%", md: "350px" },
                    display: "flex",
                    flexDirection: "column",

                  }}
                >
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
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <InfoOutlineIcon sx={{ color: "#092181", fontSize: 28 }} />
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                          color: "#092181",
                          textAlign: "center",
                          letterSpacing: 0.5,
                        }}
                      >
                        Información general
                      </Typography>
                    </Box>

                    {/* Campos */}
                    <TextField
                      name="mensaje"
                      label="Título del recordatorio"
                      value={mensaje}
                      onChange={(e) => setMensaje(e.target.value)}
                      required

                      sx={{
                        width: "100%",
                        maxWidth: "400px",
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

                    <TextField
                      type="time"
                      name="hora"
                      label="Hora de notificación"
                      value={hora}
                      onChange={(e) => setHora(e.target.value)}
                      required
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        width: "100%",
                        maxWidth: "400px",
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
                  </CardContent>
                </Card>


                {/* Tipo y frecuencia */}
                <Card
                  sx={{
                    flex: 2,
                    p: { xs: 2, md: 3 },
                    borderRadius: 3,
                    backgroundColor: "#f8f9ff",
                    border: "2px solid #092181",
                    boxShadow: "0 4px 12px rgba(9, 33, 129, 0.15)",
                    minWidth: { xs: "100%", md: "350px" },
                    display: "flex",
                    flexDirection: "column",

                  }}
                >
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
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <SyncIcon sx={{ color: "#67121A", fontSize: 28 }} />
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                          color: "#092181",
                          textAlign: "center",
                          letterSpacing: 0.5,
                        }}
                      >
                        Tipo y frecuencia
                      </Typography>
                    </Box>

                    <FormControl
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
                    >
                      <InputLabel>Frecuencia</InputLabel>
                      <Select
                        name="frecuencia"
                        value={frecuencia}
                        onChange={(e) => setFrecuencia(e.target.value)}
                        label="Frecuencia de envío"
                         renderValue={(selectedValue) =>{
                            const selectedFre = frecuenciaMap.find(
                              (frecuencia) => frecuencia.value === selectedValue
                            );
                            if (selectedFre) {
                              return (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Box sx={{ color: selectedFre.color, display: 'flex' }}>
                                    {selectedFre.icono}
                                  </Box>
                                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {selectedFre.nombre}
                                  </Typography>
                                </Box>
                              );
                            }
                            return "";
                          }}
                        sx={{ backgroundColor: "#fff", borderRadius: 2 }}
                      >
                        {frecuenciaMap.map((frecuencia) => (
                          <MenuItem key={frecuencia.value} value={frecuencia.value}>
                            <ListItemIcon>
                              <Box sx={{ color: frecuencia.color }}>
                                {frecuencia.icono}
                              </Box>
                            </ListItemIcon>
                            <ListItemText
                              primary={frecuencia.nombre}
                              primaryTypographyProps={{
                                sx: { fontWeight: 500 }
                              }}
                            />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl
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
                    >
                      <InputLabel>Tipo de recordatorio</InputLabel>
                      <Select
                        name="tipo"
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        label="Tipo de recordatorio"

                        renderValue={(selectedValue) => {
                            //  Encuentra el objeto 'tipo' correspondiente al valor seleccionado
                            const selectedTipo = tiposRecordatorios.find(
                              (tipo) => tipo.value === selectedValue
                            );

                            // Si se encuentra, renderiza el icono y el texto en la misma línea
                            // Usamos Box con display: flex para asegurar la alineación horizontal
                            if (selectedTipo) {
                              return (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Box sx={{ color: selectedTipo.color, display: 'flex' }}>
                                    {selectedTipo.icono}
                                  </Box>
                                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {selectedTipo.nombre}
                                  </Typography>
                                </Box>
                              );
                            }
                            return "";
                          }}
                        sx={{ backgroundColor: "#fff", borderRadius: 2 }}
                      >
                        {tiposRecordatorios.map((tipo) => (
                          <MenuItem key={tipo.value} value={tipo.value}>
                            <ListItemIcon>
                              <Box sx={{ color: tipo.color }}>
                                {tipo.icono}
                              </Box>
                            </ListItemIcon>
                            <ListItemText
                              primary={tipo.nombre}
                              primaryTypographyProps={{
                                sx: { fontWeight: 500 }
                              }}
                            />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  maxWidth: "400px",


                }}
              >

                {/*  Notificación */}
                <Card
                  sx={{
                    flex: 2,
                    p: { xs: 2, md: 3 },
                    borderRadius: 3,
                    backgroundColor: "#f8f9ff",
                    border: "2px solid #092181",
                    boxShadow: "0 4px 12px rgba(9, 33, 129, 0.15)",
                    minWidth: { xs: "100%", md: "350px" },
                    display: "flex",
                    flexDirection: "column",

                  }}
                >
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
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <NotificationsActiveIcon sx={{ color: "#F57C00", fontSize: 28 }} />
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                          color: "#092181",
                          textAlign: "center",
                          letterSpacing: 0.5,
                        }}
                      >
                        Notificación
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
                    }}>
                      <InputLabel>Notificar por</InputLabel>
                      <Select
                        name="notificacion"
                        value={notificacion}
                        onChange={(e) => setNotificacion(e.target.value)}
                        label="Notificar por"
                        renderValue={(selectedValue) => {
                            // Encuentra el objeto 'notificacion' correspondiente al valor seleccionado
                            const selectedNot = notificacionMap.find(
                              (notificacion) => notificacion.value === selectedValue
                            );

                            //  Si se encuentra, renderiza el icono y el texto en la misma línea
                            // Usamos Box con display: flex para asegurar la alineación horizontal
                            if (selectedNot) {
                              return (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Box sx={{ color: selectedNot.color, display: 'flex' }}>
                                    {selectedNot.icono}
                                  </Box>
                                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {selectedNot.nombre}
                                  </Typography>
                                </Box>
                              );
                            }
                            return "";
                          }} 
                        sx={{ backgroundColor: "#fff", borderRadius: 2 }}
                      >
                        {notificacionMap.map((notificacion) => (
                          <MenuItem key={notificacion.value} value={notificacion.value}>
                            <ListItemIcon>
                              <Box sx={{ color: notificacion.color }}>
                                {notificacion.icono}
                              </Box>
                            </ListItemIcon>
                            <ListItemText
                              primary={notificacion.nombre}
                              primaryTypographyProps={{
                                sx: { fontWeight: 500 }
                              }}
                            />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>
              </Box>

              {/* botón de acción */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 2,
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<AddAlertIcon />}
                  sx={{
                    minWidth: '140px',
                    textTransform: "capitalize",
                    borderRadius: 2,
                    background: "#2D5D7B",
                    "&:hover": { background: "#092181" },
                  }}
                >
                  Guardar recordatorio
                </Button>
              </Box>
            </Box>

          )}
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
                { key: "pendientes", label: "Pendientes", count: pendientes?.length || 0 },
                { key: "completados", label: "Completados", count: completados?.length || 0 },
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
                    boxShadow: vista === item.key ? "0 4px 10px rgba(9, 33, 129, 0.2)" : "none",
                    "&:hover": {
                      backgroundColor: vista === item.key ? "#06175f" : "rgba(9, 33, 129, 0.08)",
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

          {vista === "pendientes" ? (
            <>

              <Box sx={{ mt: 5 }}>
                {/* Título */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{
                      color: "#092181",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <PushPinIcon sx={{ color: "#F57C00" }} />
                    Pendientes
                  </Typography>
                </Box>

                {/* Lista de pendientes */}
                <List
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: "100%",
                    p: 0,
                  }}
                >
                  {pendientes.length > 0 ? (
                    pendientes.map((r) => (
                      <Paper
                        key={r.idRecordatorio}
                        elevation={2}
                        
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: 1,
                          backgroundColor: r.culminado === 2 ? "#E8F5E9" : "#F8F9FF",
                          borderLeft: `6px solid ${r.culminado === 2 ? "#2E7D32" : "#092181"
                            }`,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 6px 12px rgba(9, 33, 129, 0.15)",
                          },
                        }}
                      >
                        {/* Parte izquierda */}
                        <Box sx={{ display: "flex", alignItems: "center", flex: 1, minWidth: 250 }}>
                          <Checkbox
                            checked={r.culminado === 2}
                            onChange={() => handleToggleCulminado(r)}
                            sx={{
                              color: "#092181",
                              "&.Mui-checked": { color: "#2E7D32" },
                            }}
                          />
                          <Box sx={{ ml: 1 }}>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                textDecoration: r.culminado === 2 ? "line-through" : "none",
                                color: r.culminado === 2 ? "#555" : "#092181",
                                fontWeight: "bold",
                              }}
                            >
                              {r.mensaje}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#555",
                                mt: 0.8,
                                fontSize: "0.9rem",
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              {/* Hora */}
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <AccessTimeIcon sx={{ fontSize: 18, color: "#092181" }} />
                                <span>{r.hora}</span>
                              </Box>

                              {/* Frecuencia */}
                              {(() => {
                                const freq = frecuenciaMap.find(f => f.value === r.frecuencia);
                                return freq ? (
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: freq.color }}>
                                    {freq.icono}
                                    <span>{freq.nombre}</span>
                                  </Box>
                                ) : null;
                              })()}

                              {/* Tipo */}
                              {(() => {
                                const tipo = tiposRecordatorios.find(t => t.value === r.tipo_recordatorio);
                                return tipo ? (
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: tipo.color }}>
                                    {tipo.icono}
                                    <span>{tipo.nombre}</span>
                                  </Box>
                                ) : null;
                              })()}

                              {/* Notificación */}
                              {(() => {
                                const notif = notificacionMap.find(n => n.value === r.notificacion);
                                return notif ? (
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: notif.color }}>
                                    {notif.icono}
                                    <span>{notif.nombre}</span>
                                  </Box>
                                ) : null;
                              })()}
                            </Typography>

                          </Box>
                        </Box>

                        {/* Acciones */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <IconButton
                            
                            onClick={() => setRecordatorioSeleccionado(r)}

                            sx={{
                              color: "#2D5D7B",
                              "&:hover": { backgroundColor: "rgba(45,93,123,0.1)" },
                            }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            
                            onClick={() => handleOpenConfirm(r.idRecordatorio)}
                            sx={{
                              color: "#B71C1C",
                              "&:hover": { backgroundColor: "rgba(183,28,28,0.1)" },
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Paper>
                    ))
                  ) : (
                    <Typography
                      variant="body1"
                      sx={{
                        textAlign: "center",
                        color: "#666",
                        fontStyle: "italic",
                        mt: 2,
                      }}
                    >
                      No tienes pendientes registrados 📭
                    </Typography>
                  )}
                </List>
              </Box>

            </>
          ) : (
            <>
              {/* Lista de completados */}

              <Box sx={{ mt: 5 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <CheckCircleIcon sx={{ color: "#2e7d32", fontSize: 28 }} />
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      color: "#2e7d32",
                      letterSpacing: 0.5,
                    }}
                  >
                    Completados
                  </Typography>
                </Box>

                {completados.length > 0 ? (
                  <List
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                      p: 0,
                    }}
                  >
                    {completados.map((r) => {
                      const freq = frecuenciaMap.find((f) => f.value === r.frecuencia);
                      const tipo = tiposRecordatorios.find((t) => t.value === r.tipo_recordatorio);
                      const notif = notificacionMap.find((n) => n.value === r.notificacion);

                      return (
                        <Paper
                          key={r.idRecordatorio}
                          elevation={2}
                          sx={{
                            p: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            borderRadius: 3,
                            backgroundColor: "#f5f9f6",
                            border: "1px solid #c8e6c9",
                            transition: "transform 0.2s ease, box-shadow 0.2s ease",
                            "&:hover": {
                              transform: "scale(1.01)",
                              boxShadow: "0 4px 12px rgba(46, 125, 50, 0.25)",
                            },
                          }}
                        >
                          <Checkbox checked disabled sx={{ color: "#2e7d32" }} />

                          <Box sx={{ flex: 1 }}>
                            {/* Título tachado */}
                            <Typography
                              variant="subtitle1"
                              sx={{
                                textDecoration: "line-through",
                                color: "#555",
                                fontWeight: 500,
                              }}
                            >
                              {r.mensaje}
                            </Typography>

                            {/* Detalles */}
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 1.5,
                                mt: 0.5,
                              }}
                            >
                              <Chip
                                icon={freq?.icono}
                                label={freq?.nombre}
                                size="small"
                                sx={{ bgcolor: `${freq?.color}22`, color: freq?.color }}
                              />
                              <Chip
                                icon={tipo?.icono}
                                label={tipo?.nombre}
                                size="small"
                                sx={{ bgcolor: `${tipo?.color}22`, color: tipo?.color }}
                              />
                              <Chip
                                icon={notif?.icono}
                                label={notif?.nombre}
                                size="small"
                                sx={{ bgcolor: `${notif?.color}22`, color: notif?.color }}
                              />
                              <Chip
                                icon={<AccessTimeIcon />}
                                label={r.hora}
                                size="small"
                                sx={{ bgcolor: "#e0e0e0", color: "#333" }}
                              />
                            </Box>
                          </Box>
                        </Paper>
                      );
                    })}
                  </List>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#777",
                      fontStyle: "italic",
                      ml: 1,
                    }}
                  >
                    No hay recordatorios completados aún.
                  </Typography>
                )}
              </Box>

            </>

          )}


          {/* Formulario de edición */}
          <AnimatePresence>
            {recordatorioSeleccionado && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <Dialog
                  open={Boolean(recordatorioSeleccionado)}
                  onClose={() => setRecordatorioSeleccionado(null)}
                  fullWidth
                  maxWidth="md"
                  PaperProps={{
                    sx: {
                      borderRadius: "20px",
                      p: 2,
                      backgroundColor: "#F4F6F8",
                      boxShadow: "0 8px 40px rgba(9,33,129,0.25)",
                      overflow: "hidden", 
                      display: "flex",
                      flexDirection: "column",
                      maxHeight: "90vh", 
                    },
                  }}
                  BackdropProps={{
                    sx: {
                      backgroundColor: "rgba(9, 33, 129, 0.2)",
                      backdropFilter: "blur(4px)",
                    },
                  }}
                >

                  <Box
                    component="form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleActualizar();
                    }}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                      flexGrow: 1,
                      overflowY: "auto", // permite scroll interno
                      pr: 1, // margen derecho para evitar que el scroll tape contenido
                      mt: 1,
                    }}
                  >
                    {/* Encabezado */}
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        sx={{ color: "#092181", mb: 1 }}
                      >
                        ✏️ Editar recordatorio
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Modifica los detalles y guarda los cambios.
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        maxHeight: "70vh",
                        overflowY: "auto", 
                        pr: 1,
                      }}
                    >


                      {/* Contenedor flexible de secciones */}
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "center",
                          alignItems: "stretch", 
                          gap: 3,
                          width: "100%",
                          flexGrow: 1, 
                        }}
                      >
                        {/* Información general */}
                        <Card
                          sx={{
                            flex: "1 1 340px", 
                            minWidth: "280px", 
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            p: 2,
                            borderRadius: 3,
                            backgroundColor: "#f8f9ff",
                            border: "2px solid #092181",
                            boxShadow: "0 4px 12px rgba(9,33,129,0.15)",
                            flexShrink: 0,
                          }}
                        >
                          <CardContent
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 2,
                              flexGrow: 1,
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <InfoOutlineIcon sx={{ color: "#092181" }} />
                              <Typography variant="h6" sx={{ color: "#092181" }}>
                                Información general
                              </Typography>
                            </Box>

                            <TextField
                              fullWidth
                              label="Mensaje del recordatorio"
                              value={recordatorioSeleccionado.mensaje}
                              onChange={(e) =>
                                setRecordatorioSeleccionado({
                                  ...recordatorioSeleccionado,
                                  mensaje: e.target.value,
                                })
                              }
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "12px",
                                  backgroundColor: "#fff",
                                },
                              }}
                            />

                            <TextField
                              fullWidth
                              type="time"
                              label="Hora"
                              value={recordatorioSeleccionado.hora}
                              InputLabelProps={{ shrink: true }}
                              onChange={(e) =>
                                setRecordatorioSeleccionado({
                                  ...recordatorioSeleccionado,
                                  hora: e.target.value,
                                })
                              }
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "12px",
                                  backgroundColor: "#fff",
                                },
                              }}
                            />
                          </CardContent>
                        </Card>

                        {/* Frecuencia */}
                        <Card
                          sx={{
                            flex: "1 1 340px",
                            minWidth: "280px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            p: 2,
                            borderRadius: 3,
                            backgroundColor: "#f8f9ff",
                            border: "2px solid #092181",
                            boxShadow: "0 4px 12px rgba(9,33,129,0.15)",
                            flexShrink: 0,
                          }}
                        >
                          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2, flexGrow: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <SyncIcon sx={{ color: "#2D5D7B" }} />
                              <Typography variant="h6" sx={{ color: "#092181" }}>
                                Frecuencia
                              </Typography>
                            </Box>

                            <FormControl fullWidth>
                              <InputLabel>Frecuencia</InputLabel>
                              <Select
                                value={recordatorioSeleccionado.frecuencia}
                                onChange={(e) =>
                                  setRecordatorioSeleccionado({
                                    ...recordatorioSeleccionado,
                                    frecuencia: e.target.value,
                                  })
                                }
                                label="Frecuencia"
                                  renderValue={(selectedValue) => {
                            // Encuentra el objeto 'frecuencia' correspondiente al valor seleccionado
                            const selectedFre = frecuenciaMap.find(
                              (frecuencia) => frecuencia.value === selectedValue
                            );

                            //  Si se encuentra, renderiza el icono y el texto en la misma línea
                            // Usamos Box con display: flex para asegurar la alineación horizontal
                            if (selectedFre) {
                              return (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Box sx={{ color: selectedFre.color, display: 'flex' }}>
                                    {selectedFre.icono}
                                  </Box>
                                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {selectedFre.nombre}
                                  </Typography>
                                </Box>
                              );
                            }
                            return "";
                          }}
                              >
                                {frecuenciaMap.map((f) => (
                                  <MenuItem key={f.value} value={f.value}>
                                    <ListItemIcon sx={{ color: f.color }}>
                                      {f.icono}
                                    </ListItemIcon>
                                    <ListItemText primary={f.nombre} />
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl fullWidth>
                              <InputLabel>Tipo de recordatorio</InputLabel>
                              <Select
                                value={recordatorioSeleccionado.tipo_recordatorio}
                                onChange={(e) =>
                                  setRecordatorioSeleccionado({
                                    ...recordatorioSeleccionado,
                                    tipo_recordatorio: e.target.value,
                                  })
                                }
                                label="Tipo"
                              >
                                {tiposRecordatorios.map((t) => (
                                  <MenuItem key={t.value} value={t.value}>
                                    <ListItemIcon sx={{ color: t.color }}>{t.icono}</ListItemIcon>
                                    <ListItemText primary={t.nombre} />
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </CardContent>
                        </Card>
                      </Box>

                      {/* Notificación */}
                      <Card
                        sx={{
                          flex: "1 1 100%",
                          p: 2,
                          borderRadius: 3,
                          backgroundColor: "#f8f9ff",
                          border: "2px solid #092181",
                          boxShadow: "0 4px 12px rgba(9,33,129,0.15)",
                          display: "flex",
                          flexDirection: "column",
                          flexShrink: 0,
                        }}
                      >
                        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <NotificationsActiveIcon sx={{ color: "#F57C00" }} />
                            <Typography variant="h6" sx={{ color: "#092181" }}>
                              Notificación
                            </Typography>
                          </Box>

                          <FormControl fullWidth>
                            <InputLabel>Notificar por</InputLabel>
                            <Select
                              value={recordatorioSeleccionado.notificacion}
                              onChange={(e) =>
                                setRecordatorioSeleccionado({
                                  ...recordatorioSeleccionado,
                                  notificacion: e.target.value,
                                })
                              }
                              label="Notificar por"

                                   renderValue={(selectedValue) => {
                            //  Encuentra el objeto 'notificacion' correspondiente al valor seleccionado
                            const selectedNot= notificacionMap.find(
                              (notificacion) => notificacion.value === selectedValue
                            );

                            // Si se encuentra, renderiza el icono y el texto en la misma línea
                            // Usamos Box con display: flex para asegurar la alineación horizontal
                            if (selectedNot) {
                              return (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Box sx={{ color: selectedNot.color, display: 'flex' }}>
                                    {selectedNot.icono}
                                  </Box>
                                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {selectedNot.nombre}
                                  </Typography>
                                </Box>
                              );
                            }
                            return "";
                          }}
                            >
                              {notificacionMap.map((n) => (
                                <MenuItem key={n.value} value={n.value}>
                                  <ListItemIcon sx={{ color: n.color }}>{n.icono}</ListItemIcon>
                                  <ListItemText primary={n.nombre} />
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </CardContent>
                      </Card>
                    </Box>

                    {/* Botones */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 2,
                        mt: 2,
                      }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SaveIcon />}
                        sx={{
                          px: 4,
                          textTransform: "capitalize",
                          backgroundColor: "#2D5D7B",
                          "&:hover": { backgroundColor: "#092181" },
                          borderRadius: 3,
                        }}
                      >
                        Guardar cambios
                      </Button>

                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={() => setRecordatorioSeleccionado(null)}
                        sx={{
                          px: 4,
                          borderRadius: 3,
                          color: "#1f1f1fff",
                          textTransform: "capitalize",
                          backgroundColor: "#8a8989ff",
                          "&:hover": {
                            backgroundColor: "#aec1daff",
                            color: "#092181",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        Cancelar
                      </Button>
                    </Box>
                  </Box>
                </Dialog>
              
              </motion.div>
            )}
          </AnimatePresence>


        </Paper>
          {/*  Snackbar para mensajes  */}
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
        {/* Animate para el mensaje de eliminación*/}
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
                    ¿Estás seguro de que quieres eliminar este recordatorio?
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
                <CheckCircle
                  sx={{ color: "#2E7D32", fontSize: 60, mb: 2 }}
                />
                <Typography variant="h6" sx={{ color: "#092181", fontWeight: 600 }}>
                  Recordatorio eliminado correctamente
                </Typography>
                <Typography variant="body2" sx={{ color: "#555", mt: 1 }}>
                  Serás redirigido al Menú Principal...
                </Typography>
              </Dialog>
            </motion.div>
          )}
        </AnimatePresence>

           
      </Container>
    </Layout>
  );
}
