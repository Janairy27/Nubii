import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
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
  Chip,
  Snackbar,
  Tooltip,
  Divider,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  Search,
  ArrowBack,
  Psychology as PsychologyIcon,
  FilterList,
  RestartAlt,
  Close,
  Update,
  Delete,
  CheckCircle,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SaveIcon from "@mui/icons-material/Save";

import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import HealingIcon from "@mui/icons-material/Healing";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import SchoolIcon from "@mui/icons-material/School";
import ComputerIcon from "@mui/icons-material/Computer";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import CircleIcon from "@mui/icons-material/Circle";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function Citas() {
  const [idUsuario, setIdUsuario] = useState(null);
  const [idPaciente, setIdPaciente] = useState(null);
  const [Nombre, setNombre] = useState("");

  const [idProfesional, setIdProfesional] = useState(null);
  const [profesionales, setProfesionales] = useState([]);

  const [nombreProfesional, setNombreProfesional] = useState("");
  const [duracion, setDuracion] = useState(null);
  const [fecha, setFecha] = useState("");
  const [modalidad, setModalidad] = useState(null);
  const [enviado, setEnviado] = useState(null);
  const [estado, setEstado] = useState(null);

  const [Citas, setCitas] = useState([]);
  const [filtrosActivos, setFiltrosActivos] = useState({
    profesional: false,
    fecha: false,
    modalidad: false,
    comentario: false,
  });

  const [valoresFiltro, setValoresFiltro] = useState({
    profesional: "",
    fecha: "",
    modalidad: "",
    comentario: "",
  });
  const modalidadMap = [
    { value: 1, nombre: "Presencial", color: "#4CAF50", icon: <SchoolIcon /> },
    { value: 2, nombre: "Virtual", color: "#2196F3", icon: <ComputerIcon /> },
  ];

  const envioMap = [
    { value: 1, nombre: "Borrador", color: "#FFC107", icon: <EditIcon /> },
    { value: 2, nombre: "Solicitud", color: "#9C27B0", icon: <SendIcon /> },
  ];

  const especialidadMap = [
    {
      value: 1,
      nombre: "Psicólogo",
      icono: <PsychologyIcon />,
      color: "#ab47bc",
    },
    {
      value: 2,
      nombre: "Psiquiatra",
      icono: <MedicalServicesIcon />,
      color: "#42a5f5",
    },
    { value: 3, nombre: "Terapeuta", icono: <HealingIcon />, color: "#26a69a" },
    {
      value: 4,
      nombre: "Neurólogo",
      icono: <LocalHospitalIcon />,
      color: "#ef5350",
    },
    {
      value: 5,
      nombre: "Médico General",
      icono: <FavoriteIcon />,
      color: "#66bb6a",
    },
    {
      value: 6,
      nombre: "Psicoterapeuta",
      icono: <SelfImprovementIcon />,
      color: "#ffa726",
    },
    {
      value: 7,
      nombre: "Psicoanalista",
      icono: <EmojiObjectsIcon />,
      color: "#8d6e63",
    },
    {
      value: 8,
      nombre: "Consejero en salud mental",
      icono: <SupportAgentIcon />,
      color: "#29b6f6",
    },
    {
      value: 9,
      nombre: "Trabajador social clínico",
      icono: <SupervisorAccountIcon />,
      color: "#ffa726",
    },
  ];

  const camposDetalle = [
    ["fecha_cita", "Fecha en la que será la cita"],
    ["duracion_horas", "Tiempo aproximado de duración"],
    ["modalidad", "Modalidad en que se atenderá"],
    ["enlace", "Enlace de acceso a la cita"],
    ["comentario", "Comentarios recibidos"],
    ["enviado", "¿Será solicitada?"],
  ];

  const [CitaSeleccionada, setCitaSeleccionada] = useState(null);
  const [especialidadSeleccionada, setEspecialidadSeleccionada] =
    useState(null);
  const [vista, setVista] = useState(2);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigate = useNavigate();

  const [openConfirm, setOpenConfirm] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensajeSnackbar, setMensajeSnackbar] = useState("");
  const [tipoSnackbar, setTipoSnackbar] = useState("success");

  const camposFiltrados = camposDetalle.filter(([key]) => {
    if (vista === 2) {
      if (key === "enlace") {
        return CitaSeleccionada?.modalidad === 2;
      }
      return [
        "fecha_cita",
        "duracion_horas",
        "modalidad",
        "comentario",
      ].includes(key);
    }
    if (vista === 1) {
      return !["duracion_horas", "enlace", "comentario"].includes(key);
    }
    return true;
  });

  // Abrir diálogo de confirmación
  const handleOpenConfirm = () => setOpenConfirm(true);

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
    const storedIdUsuario = localStorage.getItem("idUsuario");
    if (storedIdUsuario) {
      setIdUsuario(storedIdUsuario);
      axios
        .get(`http://localhost:4000/api/auth/paciente/${storedIdUsuario}`)
        .then((res) => {
          const paciente = res.data;
          setNombre(paciente.nombre);
          setIdPaciente(paciente.idPaciente);
        })
        .catch((err) => {
          console.error("Error al obtener idPaciente:", err);
        });
    }
  }, []);

  useEffect(() => {
    if (idPaciente) {
      obtenerCitas();
    }
  }, [idPaciente]);

  const obtenerCitas = (enviadoParam = vista) => {
    axios
      .get(`http://localhost:4000/api/citas/by-filterPac/`, {
        params: { idPaciente, enviado: enviadoParam },
      })
      .then((res) => {
        setCitas(res.data);
        setCitaSeleccionada(null);
      })
      .catch((err) => {
        console.error("Error al cargar citas:", err);
        setCitas([]);
      });
  };

  const handleBuscar = async () => {
    const filtrosAplicados = {};

    if (filtrosActivos.profesional && valoresFiltro.profesional.trim()) {
      filtrosAplicados.nombreProfesional = valoresFiltro.profesional;
    }
    if (filtrosActivos.fecha && valoresFiltro.fecha) {
      filtrosAplicados.fecha_cita = valoresFiltro.fecha;
    }
    if (filtrosActivos.modalidad && valoresFiltro.modalidad) {
      filtrosAplicados.modalidad = valoresFiltro.modalidad;
    }
    if (filtrosActivos.comentario && valoresFiltro.comentario) {
      filtrosAplicados.comentario = valoresFiltro.comentario;
    }
    if (Object.keys(filtrosAplicados).length === 0) {
      obtenerCitas();
      return;
    }

    filtrosAplicados.enviado = vista;

    const queryParams = new URLSearchParams(filtrosAplicados).toString();
    try {
      const res = await axios.get(
        `http://localhost:4000/api/citas/by-filterPac?${queryParams}`,
        { params: { idPaciente, enviado: vista } }
      );

      if (res.data && res.data.length > 0) {
        setCitas(res.data);
        setCitaSeleccionada(null);
        mostrarMensaje("Citas encontradas exitosamente.", "success");
      } else {
        mostrarMensaje("No se encontraron citas con ese criterio.", "warning");
        await obtenerCitas();
      }
    } catch (error) {
      console.error(error);
      mostrarMensaje("Ocurrió un error al buscar las citas.", "error");
      await obtenerCitas();
    }
  };

  const handleLimpiarFiltros = () => {
    setFiltrosActivos({
      profesional: false,
      fecha: false,
      modalidad: false,
      comentario: false,
    });

    setValoresFiltro({
      profesional: "",
      fecha: "",
      modalidad: "",
      comentario: "",
    });

    obtenerCitas();
  };

  const handleSeleccionar = (cita) => {
    setCitaSeleccionada(cita);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      idPaciente,
      idProfesional,
      fecha_cita: fecha,
      modalidad,
      enviado,
    };

    console.log("Enviando data:", data);

    axios
      .post("http://localhost:4000/api/citas/registro-cita", data)
      .then(() => {
        navigate("/citas");
        mostrarMensaje("Cita registrada exitosamente.", "success");
      })
      .catch((err) => {
        //Log completo del error para depuración
        console.error("Error completo de Axios:", err);

        let mensajeError = "Error al registrar la cita.";
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
          } else if (dataError.message) {
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
        `http://localhost:4000/api/citas/actualizar-cita/${CitaSeleccionada.idCita}`,
        CitaSeleccionada
      )
      .then(() => {
        mostrarMensaje("Cita actualizada correctamente", "success");
        obtenerCitas();
        setCitaSeleccionada(null);
      })
      .catch((err) => {
        //Log completo del error para depuración
        console.error("Error completo de Axios:", err);
        let mensajeError = "Error al actualizar la cita.";
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
    const url = `http://localhost:4000/api/citas/eliminar-cita/${CitaSeleccionada.idCita}`;
    try {
      await axios.delete(url);
      setOpenConfirm(false); // cerrar confirmación
      setOpenSuccess(true); // abrir modal de éxito
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al eliminar la cita");
    }
  };

  const handleActualizarEstado = () => {
    axios
      .post(
        `http://localhost:4000/api/estadoCita/registro-estadoCita/${CitaSeleccionada.idCita}/5`
      )
      .then(() => {
        mostrarMensaje("Estado de la cita modificado", "info");
        obtenerCitas();
        setCitaSeleccionada(null);
      })
      .catch(() => mostrarFormulario("Error al modificar estado de la cita"));
  };

  const obtenerProfesionales = (especialidad) => {
    axios
      .get(`http://localhost:4000/api/auth/profesionales/${especialidad}`)
      .then((res) => setProfesionales(res.data))
      .catch((err) => console.log("Error al obtener profesionales", err));
  };

  useEffect(() => {
    if (especialidadSeleccionada) {
      obtenerProfesionales(especialidadSeleccionada);
    }
  }, [especialidadSeleccionada]);

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
            p: { xs: 3, md: 4 },
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
              gap: 2,
              mb: 2,
            }}
          >
            <CalendarMonthIcon
              sx={{
                color: "#092181",
                fontSize: { xs: 32, md: 36 },
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
                fontSize: { xs: "1.75rem", md: "2.125rem" },
              }}
            >
              Citas
            </Typography>
          </Box>

          {/* Filtros */}
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              p: { xs: 2, md: 3 },
              backgroundColor: "#f8f9ff",
              border: "1px solid #e0e7ff",
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(9, 33, 129, 0.1)",
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
                Filtros de Búsqueda
              </Typography>
            </Box>

            {/* Checkboxes de Filtros */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                mb: 3,
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
                        color: "#092181",
                        "&.Mui-checked": {
                          color: "#092181",
                        },
                      }}
                    />
                  }
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  sx={{ color: "#2D5D7B" }}
                />
              ))}
            </Box>

            {/* Campos de Filtro */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
                justifyContent: "flex-start",
              }}
            >
              {filtrosActivos.profesional && (
                <TextField
                  sx={textFieldEstilo}
                  label="Nombre del profesional"
                  value={valoresFiltro.profesional || ""}
                  onChange={(e) =>
                    setValoresFiltro({
                      ...valoresFiltro,
                      profesional: e.target.value,
                    })
                  }
                />
              )}

              {filtrosActivos.fecha && (
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={es}
                >
                  <DatePicker
                    label="Fecha de la cita"
                    value={valoresFiltro.fecha}
                    onChange={(nuevaFecha) =>
                      setValoresFiltro({ ...valoresFiltro, fecha: nuevaFecha })
                    }
                    format="dd/MM/yyyy"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        InputLabelProps: { shrink: true },
                        sx: { ...textFieldEstilo },
                      },
                    }}
                  />
                </LocalizationProvider>
              )}

              {filtrosActivos.modalidad && (
                <FormControl sx={textFieldEstilo}>
                  <InputLabel>Modalidad de la cita</InputLabel>
                  <Select
                    value={valoresFiltro.modalidad || ""}
                    onChange={(e) =>
                      setValoresFiltro({
                        ...valoresFiltro,
                        modalidad: e.target.value,
                      })
                    }
                    label="Modalidad de la cita"
                  >
                    {modalidadMap.map((mo) => (
                      <MenuItem key={mo.value} value={mo.value}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Box sx={{ color: mo.color, fontSize: 20 }}>
                            {mo.icon}
                          </Box>
                          {mo.nombre}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {filtrosActivos.comentario && (
                <TextField
                  sx={textFieldEstilo}
                  label="Comentarios obtenidos"
                  value={valoresFiltro.comentario || ""}
                  onChange={(e) =>
                    setValoresFiltro({
                      ...valoresFiltro,
                      comentario: e.target.value,
                    })
                  }
                />
              )}
            </Box>

            {/* Botones de Acción */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 2,
                mt: 3,
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
              <Button
                variant="contained"
                startIcon={mostrarFormulario ? <Close /> : <AddCircleIcon />}
                onClick={() => setMostrarFormulario(!mostrarFormulario)}
                sx={{
                  minWidth: 150,
                  textTransform: "none",
                  background: "#092181",
                  "&:hover": { background: "#1c3cc9" },
                  borderRadius: 2,
                  fontWeight: "bold",
                }}
              >
                {mostrarFormulario ? "Ocultar formulario" : "Agregar cita"}
              </Button>
            </Box>
          </Card>

          {/* Formulario de Agregar Cita */}
          {mostrarFormulario && (
            <Card
              sx={{
                flex: 1,
                p: 3,
                borderRadius: 4,
                backgroundColor: "#f8f9ff",
                border: "1px solid #d8e0ff",
                boxShadow: "0 6px 18px rgba(9, 33, 129, 0.08)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 8px 24px rgba(9, 33, 129, 0.15)",
                  transform: "translateY(-3px)",
                },
              }}
            >
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  width: "100%",
                }}
              >
                {/* Encabezado */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <InfoOutlineIcon sx={{ color: "#092181", fontSize: 30 }} />
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{
                      color: "#092181",
                      letterSpacing: 0.5,
                    }}
                  >
                    Nueva Cita
                  </Typography>
                </Box>

                {/* Datos del Paciente */}
                <Card
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #cfd8ff",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="#092181"
                    mb={2}
                  >
                    Datos del Paciente
                  </Typography>

                  <TextField
                    fullWidth
                    label="Paciente"
                    value={Nombre}
                    disabled
                    sx={textFieldEstilo}
                  />
                </Card>

                {/*  Datos del Profesional */}
                <Card
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #cfd8ff",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="#092181"
                    mb={2}
                  >
                    Profesional
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 2,
                    }}
                  >
                    <FormControl sx={textFieldEstilo}>
                      <InputLabel>Especialidad</InputLabel>
                      <Select
                        name="especialidad"
                        value={especialidadSeleccionada}
                        onChange={(e) =>
                          setEspecialidadSeleccionada(e.target.value)
                        }
                        label="Especialidad"
                      >
                        {especialidadMap.map((especialidad) => (
                          <MenuItem
                            key={especialidad.value}
                            value={especialidad.value}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                              }}
                            >
                              <Box
                                sx={{ color: especialidad.color, fontSize: 20 }}
                              >
                                {especialidad.icono}
                              </Box>
                              {especialidad.nombre}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl sx={textFieldEstilo}>
                      <InputLabel>Profesional</InputLabel>
                      <Select
                        name="profesional"
                        value={idProfesional}
                        onChange={(e) =>
                          setIdProfesional(Number(e.target.value))
                        }
                        label="Profesional"
                        //required
                      >
                        {profesionales.map((p) => (
                          <MenuItem
                            key={p.idProfesional}
                            value={p.idProfesional}
                          >
                            {p.nombreProfesional}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Card>

                {/* Fecha y Modalidad */}
                <Card
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #cfd8ff",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="#092181"
                    mb={2}
                  >
                    Detalles de la Cita
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 2,
                    }}
                  >
                    <TextField
                      label="Fecha y hora"
                      type="datetime-local"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
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
                      }}
                    />

                    <FormControl sx={textFieldEstilo}>
                      <InputLabel>Modalidad</InputLabel>
                      <Select
                        name="modalidad"
                        value={modalidad}
                        onChange={(e) => setModalidad(e.target.value)}
                        label="Modalidad"
                      >
                        {modalidadMap.map((mo) => (
                          <MenuItem key={mo.value} value={mo.value}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                              }}
                            >
                              <Box sx={{ color: mo.color, fontSize: 20 }}>
                                {mo.icon}
                              </Box>
                              {mo.nombre}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    <FormControl sx={textFieldEstilo}>
                      <InputLabel>Estado</InputLabel>
                      <Select
                        name="enviado"
                        value={enviado}
                        onChange={(e) => setEnviado(e.target.value)}
                        label="Estado"
                      >
                        {envioMap.map((env) => (
                          <MenuItem key={env.value} value={env.value}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                              }}
                            >
                              <Box sx={{ color: env.color, fontSize: 20 }}>
                                {env.icon}
                              </Box>
                              {env.nombre}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Card>

                {/* Botón Guardar */}
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    sx={{
                      minWidth: 180,
                      background: "#092181",
                      "&:hover": { background: "#1c3cc9" },
                      fontWeight: "bold",
                      textTransform: "none",
                      py: 1.2,
                    }}
                  >
                    Guardar Cita
                  </Button>
                </Box>
              </Box>
            </Card>
          )}

          {/* Selector de Vista */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 2,
              mb: 4,
              mt: 2,
            }}
          >
            {envioMap.map((env) => (
              <Button
                key={env.value}
                variant={vista === env.value ? "contained" : "outlined"}
                startIcon={env.icon}
                onClick={() => {
                  setVista(env.value);
                  obtenerCitas(env.value);
                }}
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: "30px",
                  fontWeight: 600,
                  textTransform: "none",
                  letterSpacing: 0.4,
                  minWidth: 150,
                  background: vista === env.value ? env.color : "transparent",
                  borderColor: env.color,
                  color: vista === env.value ? "#fff" : env.color,
                  boxShadow:
                    vista === env.value ? "0 3px 10px rgba(0,0,0,0.2)" : "none",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    background: env.color,
                    color: "white",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {env.nombre}
              </Button>
            ))}
          </Box>

          {/* Contenido principal */}
          {!CitaSeleccionada ? (
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                color="#092181"
                gutterBottom
                textAlign="center"
              >
                {Citas.length > 0
                  ? vista === 1
                    ? "Borradores de Cita"
                    : "Citas Solicitadas"
                  : vista === 1
                  ? "Aún no se han creado borradores"
                  : "No se han solicitado citas aún"}
              </Typography>

              {/* Lista de citas */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                  width: "100%",
                  maxWidth: "900px",
                  mx: "auto",
                  mt: 2,
                }}
              >
                {Citas.map((cita) => {
                  const estado = envioMap.find((e) => e.value === cita.enviado);
                  const modalidad = modalidadMap.find(
                    (m) => m.value === cita.modalidad
                  );
                  return (
                    <Card
                      key={cita.idCita}
                      onClick={() => handleSeleccionar(cita)}
                      sx={{
                        position: "relative",
                        cursor: "pointer",
                        borderRadius: "16px",
                        border: "1px solid #E5E8F0",
                        backgroundColor: "#FFFFFF",
                        boxShadow:
                          "0px 4px 8px rgba(0,0,0,0.04), 0px 2px 4px rgba(0,0,0,0.02)",
                        transition: "all 0.25s ease",
                        overflow: "hidden",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow:
                            "0px 8px 20px rgba(9,33,129,0.15), 0px 4px 10px rgba(9,33,129,0.08)",
                        },
                      }}
                    >
                      {/* Indicador lateral de estado */}
                      <Box
                        sx={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: 6,
                          backgroundColor: estado?.color || "#B0BEC5",
                        }}
                      />

                      {/* Contenido */}
                      <Box
                        sx={{
                          p: 3,
                          display: "flex",
                          flexWrap: "wrap",
                          rowGap: 2,
                          columnGap: 4,
                        }}
                      >
                        {/* Profesional */}
                        <Box
                          sx={{
                            flex: 1,
                            minWidth: 200,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <PersonIcon sx={{ color: "#092181", fontSize: 22 }} />
                          <Box>
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              color="#092181"
                            >
                              {cita.nombreProfesional}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Profesional
                            </Typography>
                          </Box>
                        </Box>

                        {/* Fecha */}
                        <Box
                          sx={{
                            flex: 1,
                            minWidth: 200,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <CalendarTodayIcon
                            sx={{ color: "#2D5D7B", fontSize: 20 }}
                          />
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {cita.fecha_cita
                                ? format(
                                    new Date(cita.fecha_cita),
                                    "dd 'de' MMMM yyyy, HH:mm",
                                    { locale: es }
                                  )
                                : "Sin fecha"}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                              Fecha de la cita
                            </Typography>
                          </Box>
                        </Box>

                        {/* Modalidad */}
                        <Box
                          sx={{
                            flex: 1,
                            minWidth: 200,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <LaptopMacIcon
                            sx={{ color: "#546E7A", fontSize: 22 }}
                          />
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {modalidad?.nombre || "No especificado"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Modalidad
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Divider />

                      {/* Estado visual */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          px: 3,
                          py: 1.5,
                          backgroundColor: "#F9FAFF",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CircleIcon
                            sx={{
                              fontSize: 12,
                              color: estado?.color || "#9E9E9E",
                            }}
                          />
                          <Typography variant="body2" fontWeight={500}>
                            {estado?.nombre || "Desconocido"}
                          </Typography>
                        </Box>

                        {/* Etiqueta de acción */}
                        <Tooltip title="Ver detalles o editar cita">
                          <Chip
                            label="Ver más"
                            size="small"
                            sx={{
                              fontWeight: "bold",
                              backgroundColor: "#092181",
                              color: "#fff",
                              "&:hover": { backgroundColor: "#2D5D7B" },
                            }}
                          />
                        </Tooltip>
                      </Box>
                    </Card>
                  );
                })}
              </Box>
            </Box>
          ) : (
            /* Detalle / Edición */
            <Card
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 3,
                backgroundColor: "#f9fbff",
                border: "1px solid #dce3ff",
                boxShadow: "0 4px 16px rgba(9, 33, 129, 0.1)",
                mt: 2,
                maxWidth: "900px",
                margin: "0 auto",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Header */}
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <EditIcon sx={{ color: "#092181", fontSize: 28 }} />
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ color: "#092181", letterSpacing: 0.5 }}
                  >
                    {vista === 1 ? "Editar Cita" : "Detalle de Cita"}
                  </Typography>
                </Box>

                {/* Info principal */}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    background: "#fff",
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #e0e7ff",
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 250 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="#092181"
                    >
                      Profesional:
                    </Typography>
                    <Typography variant="body1">
                      {CitaSeleccionada.nombreProfesional}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 250 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="#092181"
                    >
                      Estado:
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor:
                            envioMap.find(
                              (e) => e.value === CitaSeleccionada.enviado
                            )?.color || "#ccc",
                        }}
                      />
                      <Typography variant="body1">
                        {
                          envioMap.find(
                            (e) => e.value === CitaSeleccionada.enviado
                          )?.nombre
                        }
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Campos editables */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 3,
                    width: "100%",
                  }}
                >
                  {/* Columna izquierda */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      flex: 1,
                      minWidth: { xs: "100%", md: "300px" },
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Fecha y Hora"
                      type="datetime-local"
                      InputLabelProps={{ shrink: true }}
                      value={
                        CitaSeleccionada?.fecha_cita
                          ? (() => {
                              try {
                                const fecha =
                                  CitaSeleccionada.fecha_cita.replace(" ", "T");
                                // Ajustar solo si tiene zona horaria UTC
                                const d = new Date(fecha);
                                const localISO = new Date(
                                  d.getTime() - d.getTimezoneOffset() * 60000
                                )
                                  .toISOString()
                                  .slice(0, 16);
                                return localISO;
                              } catch {
                                return "";
                              }
                            })()
                          : ""
                      }
                      onChange={(e) => {
                        const valor = e.target.value;
                        if (!valor) return;

                        // Convertir a formato MySQL
                        const fecha = new Date(valor);
                        const local = new Date(
                          fecha.getTime() - fecha.getTimezoneOffset() * 60000
                        );

                        const año = local.getFullYear();
                        const mes = String(local.getMonth() + 1).padStart(
                          2,
                          "0"
                        );
                        const dia = String(local.getDate()).padStart(2, "0");
                        const horas = String(local.getHours()).padStart(2, "0");
                        const minutos = String(local.getMinutes()).padStart(
                          2,
                          "0"
                        );

                        const fechaFinal = `${año}-${mes}-${dia} ${horas}:${minutos}`;

                        setCitaSeleccionada({
                          ...CitaSeleccionada,
                          fecha_cita: fechaFinal,
                        });
                      }}
                      sx={{
                        mt: 2,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: "#fff",
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

                    <FormControl
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                    >
                      <InputLabel>Modalidad</InputLabel>
                      <Select
                        value={CitaSeleccionada.modalidad || ""}
                        label="Modalidad"
                        onChange={(e) =>
                          setCitaSeleccionada({
                            ...CitaSeleccionada,
                            modalidad: e.target.value,
                          })
                        }
                        disabled={vista === 2}
                      >
                        {modalidadMap.map((mo) => (
                          <MenuItem key={mo.value} value={mo.value}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                              }}
                            >
                              <Box sx={{ color: mo.color, fontSize: 20 }}>
                                {mo.icon}
                              </Box>
                              {mo.nombre}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Columna derecha */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      flex: 1,
                      minWidth: { xs: "100%", md: "300px" },
                    }}
                  >
                    <FormControl
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                    >
                      <InputLabel>Estado</InputLabel>
                      <Select
                        value={CitaSeleccionada.enviado || ""}
                        label="Estado"
                        onChange={(e) =>
                          setCitaSeleccionada({
                            ...CitaSeleccionada,
                            enviado: e.target.value,
                          })
                        }
                        disabled={vista === 2}
                      >
                        {envioMap.map((env) => (
                          <MenuItem key={env.value} value={env.value}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                              }}
                            >
                              <Box sx={{ color: env.color, fontSize: 20 }}>
                                {env.icon}
                              </Box>
                              {env.nombre}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      label="Comentarios"
                      value={CitaSeleccionada.comentario || ""}
                      onChange={(e) =>
                        setCitaSeleccionada({
                          ...CitaSeleccionada,
                          comentario: e.target.value,
                        })
                      }
                      disabled={vista === 2}
                      multiline
                      rows={3}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                        },
                      }}
                    />
                  </Box>
                </Box>

                {/* Botones */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: 2,
                    mt: 3,
                  }}
                >
                  {vista === 1 && (
                    <>
                      <Button
                        variant="contained"
                        startIcon={<Update />}
                        onClick={handleActualizar}
                        sx={{
                          minWidth: 120,
                          background: "#2D5D7B",
                          "&:hover": { background: "#092181" },
                          fontWeight: "bold",
                          textTransform: "none",
                          borderRadius: "10px",
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
                          minWidth: 120,
                          fontWeight: "bold",
                          textTransform: "none",
                          borderRadius: "10px",
                        }}
                      >
                        Eliminar
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => setCitaSeleccionada(null)}
                    sx={{
                      minWidth: 120,
                      borderColor: "#092181",
                      color: "#092181",
                      fontWeight: "bold",
                      textTransform: "none",
                      borderRadius: "10px",
                      "&:hover": {
                        backgroundColor: "#eef2ff",
                        borderColor: "#092181",
                      },
                    }}
                  >
                    Volver
                  </Button>
                </Box>
              </Box>
            </Card>
          )}
        </Paper>
        {/* Snackbar para mendajes */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
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

        {/* Animate para el mensaje de confirmación en la eliminación */}
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
                    ¿Estás seguro de que quieres eliminar está cita?
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

        {/* Modal de ÉXITO animado */}
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
                  Cita eliminada correctamente
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
