import React, { useState, useEffect } from "react";
import Layout from "../components/LayoutAdmin";
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
  Grid,
} from "@mui/material";
import {
  Search,
  Psychology as PsychologyIcon,
  FilterList,
  RestartAlt,
  Close,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  WorkOutline as WorkOutlineIcon,
  ModeComment as ModeCommentIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import HealingIcon from "@mui/icons-material/Healing";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import SchoolIcon from "@mui/icons-material/School";
import ComputerIcon from "@mui/icons-material/Computer";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function CitasAdmin() {
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
  const [CitaSeleccionada, setCitaSeleccionada] = useState(null);

  const navigate = useNavigate();

  const [openDetalleModal, setOpenDetalleModal] = useState(false);

  // Estados de Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensajeSnackbar, setMensajeSnackbar] = useState("");
  const [tipoSnackbar, setTipoSnackbar] = useState("success");

  const [filtrosActivos, setFiltrosActivos] = useState({
    profesional: false,
    paciente: false,
    fecha: false,
    modalidad: false,
    comentario: false,
    enviado: false,
  });

  const [valoresFiltro, setValoresFiltro] = useState({
    profesional: "",
    paciente: "",
    fecha: "",
    modalidad: "",
    comentario: "",
    enviado: "",
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
    ["nombrePaciente", "Paciente", <PersonIcon sx={{ color: "#092181" }} />],
    [
      "nombreProfesional",
      "Profesional",
      <SupervisorAccountIcon sx={{ color: "#092181" }} />,
    ],
    ["especialidad", "Especialidad"],
    ["fecha_cita", "Fecha de la cita", <EventIcon sx={{ color: "#092181" }} />],
    [
      "duracion_horas",
      "Tiempo de duración",
      <AccessTimeIcon sx={{ color: "#092181" }} />,
    ],
    ["modalidad", "Modalidad"],
    ["enlace", "Enlace de acceso", <LaptopMacIcon sx={{ color: "#092181" }} />],
    [
      "comentario",
      "Comentarios recibidos",
      <ModeCommentIcon sx={{ color: "#092181" }} />,
    ],
    ["enviado", "Estado de Solicitud"],
  ];

  const vista = 2;

  const [especialidadSeleccionada, setEspecialidadSeleccionada] =
    useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

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
    obtenerCitas();
  }, []);

  const obtenerCitas = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/citas/by-filterAdmin`
      );
      setCitas(res.data);
      setCitaSeleccionada(null);
    } catch (err) {
      console.error("Error al cargar citas para Admin:", err);
      mostrarMensaje("Error al cargar las citas.", "error");
      setCitas([]);
    }
  };

  const handleBuscar = async () => {
    const filtrosAplicados = {};

    if (filtrosActivos.profesional && valoresFiltro.profesional.trim()) {
      filtrosAplicados.nombreProfesional = valoresFiltro.profesional;
    }
    if (filtrosActivos.paciente && valoresFiltro.paciente.trim()) {
      filtrosAplicados.nombrePaciente = valoresFiltro.paciente;
    }
    if (filtrosActivos.fecha && valoresFiltro.fecha) {
      const fechaBusqueda = format(new Date(valoresFiltro.fecha), "yyyy-MM-dd");
      filtrosAplicados.fecha_cita = fechaBusqueda;
    }
    if (filtrosActivos.modalidad && valoresFiltro.modalidad) {
      filtrosAplicados.modalidad = valoresFiltro.modalidad;
    }
    if (filtrosActivos.comentario && valoresFiltro.comentario.trim()) {
      filtrosAplicados.comentario = valoresFiltro.comentario;
    }
    if (filtrosActivos.enviado && valoresFiltro.enviado) {
      filtrosAplicados.enviado = valoresFiltro.enviado;
    }

    if (Object.keys(filtrosAplicados).length === 0) {
      obtenerCitas();
      return;
    }

    const queryParams = new URLSearchParams(filtrosAplicados).toString();

    try {
      const res = await axios.get(
        `http://localhost:4000/api/citas/by-filterAdmin?${queryParams}`
      );

      if (res.data && res.data.length > 0) {
        setCitas(res.data);
        setCitaSeleccionada(null);
        mostrarMensaje(`Se encontraron ${res.data.length} citas.`, "success");
      } else {
        mostrarMensaje("No se encontraron citas con ese criterio.", "warning");
        setCitas([]); // Limpiar la lista si no hay resultados
      }
    } catch (error) {
      console.error(error);
      mostrarMensaje("Ocurrió un error al buscar las citas.", "error");
      obtenerCitas(); // Recargar la lista completa en caso de error
    }
  };

  const handleLimpiarFiltros = () => {
    setFiltrosActivos({
      profesional: false,
      paciente: false,
      fecha: false,
      modalidad: false,
      comentario: false,
      enviado: false,
    });

    setValoresFiltro({
      profesional: "",
      paciente: "",
      fecha: "",
      modalidad: "",
      comentario: "",
      enviado: "",
    });

    obtenerCitas();
  };

  const handleSeleccionar = (cita) => {
    setCitaSeleccionada(cita);
    setOpenDetalleModal(true);
  };

  const handleCloseDetalleModal = () => {
    setOpenDetalleModal(false);
    setCitaSeleccionada(null);
  };
  const themeColors = {
    primary: "#092181",
    primaryLight: "#eef2ff",
    accent: "#355C7D",
  };

  const chipSx = (color) => ({
    backgroundColor: `${color}15`,
    color: color,
    fontWeight: "bold",
    borderRadius: "6px",
  });

  const renderValorCampo = (key, valor) => {
    const maps = {
      modalidad: modalidadMap,
      enviado: envioMap,
      especialidad: especialidadMap,
    };

    if (maps[key]) {
      const item = maps[key].find((x) => x.value === valor);
      return item ? (
        <Chip
          icon={item.icon || item.icono}
          label={item.nombre}
          sx={chipSx(item.color)}
        />
      ) : (
        "N/A"
      );
    }

    if (key === "fecha_cita" && valor) {
      return format(new Date(valor), "EEEE, d 'de' MMMM yyyy h:mm a", {
        locale: es,
      });
    }

    if (key === "enlace") {
      return valor ? (
        <Button
          variant="contained"
          size="small"
          startIcon={<LaptopMacIcon />}
          href={valor}
          target="_blank"
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            bgcolor: themeColors.primary,
            "&:hover": { bgcolor: "#1c3cc9" },
          }}
        >
          Ir al Enlace
        </Button>
      ) : (
        "N/A"
      );
    }

    return valor || "N/A";
  };

  const textFieldEstilo = {
    width: "100%",
    maxWidth: 400,
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      bgcolor: "#fff",
      "& fieldset": {
        borderColor: "#CBD4D8",
      },
      "&:hover fieldset": {
        borderColor: themeColors.accent,
      },
      "&.Mui-focused fieldset": {
        borderColor: themeColors.primary,
        borderWidth: 2,
      },
    },
    "& .MuiInputLabel-root": {
      color: themeColors.accent,
      fontWeight: 600,
    },
  };

  const CitaDetalleModal = () => {
    if (!CitaSeleccionada) return null;

    const campos = camposDetalle.filter(([key]) =>
      key === "enlace" ? CitaSeleccionada.modalidad === 2 : true
    );

    return (
      <Dialog
        open={openDetalleModal}
        onClose={handleCloseDetalleModal}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 2,
            boxShadow: "0 10px 40px rgba(9,33,129,0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#092181",
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <InfoOutlineIcon />
            <Typography variant="h5" fontWeight="bold">
              Detalle de la Cita
            </Typography>
          </Box>

          <Button onClick={handleCloseDetalleModal} color="inherit">
            <Close />
          </Button>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          <Box display="flex" flexDirection="column" gap={2}>
            {campos.map(([key, label, IconComponent]) => (
              <Paper
                key={key}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  borderLeft: "4px solid #092181",
                  backgroundColor: "#f8f9ff",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 0.5,
                  }}
                >
                  {IconComponent}

                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    {label}
                  </Typography>
                </Box>
                <Box mt={0.5}>
                  <Typography variant="body1">
                    {renderValorCampo(key, CitaSeleccionada[key])}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    );
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
              {filtrosActivos.paciente && (
                <TextField
                  sx={textFieldEstilo}
                  label="Nombre del paciente"
                  value={valoresFiltro.paciente || ""}
                  onChange={(e) =>
                    setValoresFiltro({
                      ...valoresFiltro,
                      paciente: e.target.value,
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
              {filtrosActivos.enviado && (
                <FormControl sx={textFieldEstilo}>
                  <InputLabel>Estado de Solicitud</InputLabel>
                  <Select
                    value={valoresFiltro.enviado || ""}
                    onChange={(e) =>
                      setValoresFiltro({
                        ...valoresFiltro,
                        enviado: e.target.value,
                      })
                    }
                    label="Estado de Solicitud"
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
            </Box>
          </Card>
          <Divider sx={{ my: 2 }} />
          {/* Listado de Citas y Detalle */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexDirection: "column",
            }}
          >
            {/* Columna de Listado (Citas) */}
            <Card
              sx={{
                flex: 1,
                p: { xs: 2, md: 3 },
                borderRadius: 3,
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                //minWidth: { md: "100%" },
                maxHeight: 700,
                overflowY: "auto",
              }}
            >
              <Typography variant="h6" fontWeight="bold" color="#092181" mb={2}>
                Lista de Citas ({Citas.length})
              </Typography>

              <AnimatePresence>
                {Citas.length > 0 ? (
                  <Grid container spacing={3} alignItems="stretch">
                    {Citas.map((cita) => (
                      <Grid item xs={12} sm={6} md={6} key={cita.idCita}>
                        <motion.div
                          key={cita.idCita}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Paper
                            onClick={() => handleSeleccionar(cita)}
                            sx={{
                              p: 2.5,
                              //mb: 1.5,
                              borderRadius: 2,
                              cursor: "pointer",
                              transition: "all 0.3s",
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              border: `2px solid ${
                                CitaSeleccionada?.idCita === cita.idCita
                                  ? themeColors.primary
                                  : "#e0e7ff"
                              }`,
                              backgroundColor:
                                CitaSeleccionada?.idCita === cita.idCita
                                  ? themeColors.primaryLight
                                  : "#fff",
                              "&:hover": {
                                boxShadow: "0 2px 8px rgba(9, 33, 129, 0.1)",
                                transform: "translateY(-2px)",
                              },
                            }}
                          >
                            <Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                  mb: 1.5,
                                }}
                              >
                                <Typography
                                  variant="subtitle1"
                                  fontWeight="bold"
                                  color="#355C7D"
                                >
                                  {format(
                                    new Date(cita.fecha_cita),
                                    "dd MMMM yyyy",
                                    { locale: es }
                                  )}
                                </Typography>
                                <Chip
                                  size="small"
                                  label={
                                    envioMap.find(
                                      (e) => e.value === cita.enviado
                                    )?.nombre || "Desconocido"
                                  }
                                  sx={{
                                    backgroundColor: `${
                                      envioMap.find(
                                        (e) => e.value === cita.enviado
                                      )?.color
                                    }15`,
                                    color: "#fff",
                                  }}
                                />
                              </Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                mt={0.5}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <PersonIcon fontSize="small" color="action" />
                                {cita.nombrePaciente}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <PsychologyIcon
                                  fontSize="small"
                                  color="action"
                                />
                                {cita.nombreProfesional}
                              </Typography>
                            </Box>
                          </Paper>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    No hay citas para mostrar.
                  </Alert>
                )}
              </AnimatePresence>
            </Card>
            {CitaSeleccionada && <CitaDetalleModal />}
          </Box>
        </Paper>
        {/* Snackbar de Mensajes */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={tipoSnackbar}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {mensajeSnackbar}{" "}
          </Alert>
        </Snackbar>
      </Container>
    </Layout>
  );
}
