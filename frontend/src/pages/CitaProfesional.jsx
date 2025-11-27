import React, { useState, useEffect } from "react";
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
  Chip,
  Snackbar,
  Tooltip,
  Divider,
  Checkbox,
  FormControlLabel,
  CardContent,
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
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
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

const camposDetalle = [
  ["fecha_cita", "Fecha en la que será la cita"],
  ["duracion_horas", "Tiempo aproximado de duración"],
  ["modalidad", "Modalidad en que se atenderá"],
  ["enlace", "Enlace de acceso a la cita"],
  ["comentario", "Comentarios recibidos"],
  ["enviado", "¿Será solicitada?"],
];

export default function CitaProfesional() {
  const [idUsuario, setIdUsuario] = useState(null);
  const [idProfesional, setIdProfesional] = useState(null);
  const [Nombre, setNombre] = useState("");

  const [idPaciente, setIdPaciente] = useState(null);
  const [pacientes, setPacientes] = useState([]);

  const [nombrePaciente, setNombrePaciente] = useState("");
  const [duracion, setDuracion] = useState(null);
  const [fecha, setFecha] = useState("");
  const [modalidad, setModalidad] = useState(null);
  const [enlace, setEnlace] = useState("");
  const [comentario, setComentario] = useState("");

  const [Citas, setCitas] = useState([]);
  const [filtrosActivos, setFiltrosActivos] = useState({
    paciente: false,
    fecha: false,
    modalidad: false,
    comentario: false,
  });

  const [valoresFiltro, setValoresFiltro] = useState({
    paciente: "",
    fecha: "",
    modalidad: "",
    comentario: "",
  });

  const [CitaSeleccionada, setCitaSeleccionada] = useState(null);

  // const [vista, setVista] = useState(2);
  const navigate = useNavigate();

  const [openConfirm, setOpenConfirm] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensajeSnackbar, setMensajeSnackbar] = useState("");
  const [tipoSnackbar, setTipoSnackbar] = useState("success");

  /* const camposFiltrados = camposDetalle.filter(([key]) => {
     if(vista === 2){
       return ["fecha_cita", "duracion_horas", "modalidad", "enlace", "comentario"].includes(key);
     }if(vista === 1){
       return !["duracion_horas", "enlace", "comentario"].includes(key);
     }
     return true;
   });*/

  const modalidadMap = [
    { value: 1, nombre: "Presencial", color: "#4CAF50", icon: <SchoolIcon /> },
    { value: 2, nombre: "Virtual", color: "#2196F3", icon: <ComputerIcon /> },
  ];
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

  useEffect(() => {
    if (idProfesional) {
      obtenerCitas();
    }
  }, [idProfesional]);

  const obtenerCitas = () => {
    axios
      .get(`http://localhost:4000/api/citas/by-filter/`, {
        params: { idProfesional },
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

    if (filtrosActivos.paciente && valoresFiltro.paciente.trim()) {
      filtrosAplicados.nombrePaciente = valoresFiltro.paciente;
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
    try {
      const queryParams = new URLSearchParams(filtrosAplicados).toString();
      const res = await axios.get(
        `http://localhost:4000/api/citas/by-filter?${queryParams}`,
        { params: { idProfesional } }
      );
      if (res.data.length === 0) {
        mostrarMensaje("No se encontraron citas con esos filtros.", "warning");
      } else {
        setCitas(res.data);
        mostrarMensaje("Búsqueda realizada correctamente.", "success");
        setCitaSeleccionada(null);
      }
    } catch (error) {
      console.error("Error en búsqueda:", error);
      mostrarMensaje("Error al realizar la búsqueda.", "error");
    }
  };

  const handleLimpiarFiltros = () => {
    setFiltrosActivos({
      paciente: false,
      fecha: false,
      modalidad: false,
      comentario: false,
    });

    setValoresFiltro({
      paciente: "",
      fecha: "",
      modalidad: "",
      comentario: "",
    });

    obtenerCitas();
  };

  const handleSeleccionar = (cita) => {
    setCitaSeleccionada(cita);
  };

  const handleActualizar = () => {
    axios
      .put(
        `http://localhost:4000/api/citas/actualizar-citaProf/${CitaSeleccionada.idCita}`,
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

            {/* Checkboxes */}
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
                        color: "#5A6ACF",
                        "&.Mui-checked": { color: "#092181" },
                        "& .MuiSvgIcon-root": { fontSize: 26 },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" fontWeight="medium">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Typography>
                  }
                />
              ))}
            </Box>

            {/* Campos dinámicos */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
                justifyContent: "flex-start",
              }}
            >
              {filtrosActivos.paciente && (
                <TextField
                  sx={textFieldEstilo}
                  label="Nombre del paciente"
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
                  <InputLabel>Modalidad</InputLabel>
                  <Select
                    value={valoresFiltro.modalidad}
                    onChange={(e) =>
                      setValoresFiltro({
                        ...valoresFiltro,
                        modalidad: e.target.value,
                      })
                    }
                    label="Modalidad"
                  >
                    {modalidadMap.map((modalidad) => (
                      <MenuItem key={modalidad.value} value={modalidad.value}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: modalidad.color,
                          }}
                        >
                          {modalidad.icon}
                          {modalidad.nombre}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {filtrosActivos.comentario && (
                <TextField
                  sx={textFieldEstilo}
                  label="Comentarios"
                  multiline
                  rows={2}
                  onChange={(e) =>
                    setValoresFiltro({
                      ...valoresFiltro,
                      comentario: e.target.value,
                    })
                  }
                />
              )}
            </Box>

            {/*  Botones de Acción */}
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

          {/* Contenido principal  */}
          {!CitaSeleccionada ? (
            <>
              <Box sx={{ mt: 3, px: 2 }}>
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
                    <CalendarMonthIcon
                      sx={{ color: "#092181", fontSize: 32 }}
                    />

                    <Typography variant="h5" fontWeight="bold" color="#092181">
                      {Citas.length > 0
                        ? "Citas programadas"
                        : "No hay citas programadas"}
                    </Typography>
                  </Box>
                  <Chip
                    label={`${Citas.length} ${
                      Citas.length === 1 ? "cita" : "citas"
                    }`}
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#e3f2fd",
                      color: "#0d47a1",
                      borderRadius: 2,
                      px: 1.5,
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2.5,
                    maxWidth: 900,
                    mx: "auto",
                  }}
                >
                  {Citas.map((cita) => {
                    const modalidadInfo = modalidadMap.find(
                      (m) => m.value === cita.modalidad
                    );

                    return (
                      <Tooltip
                        title="Selecciona una tarjeta para ver más información y/o actualizar"
                        arrow
                      >
                        <Card
                          key={cita.idCita}
                          onClick={() => handleSeleccionar(cita)}
                          elevation={2}
                          sx={{
                            cursor: "pointer",
                            borderRadius: 3,
                            border: "1px solid #E5E8F0",
                            backgroundColor: "#FFFFFF",
                            p: 2.5,
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            justifyContent: "space-between",
                            alignItems: { xs: "flex-start", sm: "center" },
                            gap: 2.5,
                            transition: "all 0.25s ease",
                            "&:hover": {
                              transform: "translateY(-3px)",
                              boxShadow:
                                "0px 8px 16px rgba(9,33,129,0.12), 0px 3px 6px rgba(9,33,129,0.06)",
                            },
                          }}
                        >
                          {/* Información principal */}
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 1.5,
                              flex: 1,
                            }}
                          >
                            {/* Paciente */}
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.2,
                              }}
                            >
                              <PersonIcon
                                sx={{ color: "#092181", fontSize: 22 }}
                              />
                              <Box>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight={600}
                                  color="#092181"
                                >
                                  {cita.nombrePaciente}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Paciente
                                </Typography>
                              </Box>
                            </Box>

                            <Divider
                              sx={{
                                width: "100%",
                                display: { xs: "block", sm: "none" },
                              }}
                            />

                            {/* Fecha */}
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.2,
                              }}
                            >
                              <CalendarTodayIcon
                                sx={{ color: "#2D5D7B", fontSize: 20 }}
                              />
                              <Box>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight={600}
                                >
                                  {cita.fecha_cita
                                    ? format(
                                        new Date(cita.fecha_cita),
                                        "dd 'de' MMMM yyyy, HH:mm",
                                        {
                                          locale: es,
                                        }
                                      )
                                    : "Sin fecha"}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Fecha de la cita
                                </Typography>
                              </Box>
                            </Box>
                          </Box>

                          {/* Modalidad */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              alignSelf: { xs: "flex-end", sm: "center" },
                            }}
                          >
                            {modalidadInfo?.icon}
                            <Chip
                              label={modalidadInfo?.nombre}
                              size="small"
                              variant="outlined"
                              sx={{
                                borderColor: modalidadInfo?.color,
                                color: modalidadInfo?.color,
                                fontWeight: 500,
                                textTransform: "capitalize",
                              }}
                            />
                          </Box>
                        </Card>
                      </Tooltip>
                    );
                  })}
                </Box>
              </Box>
            </>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 3,
                  width: "100%",
                }}
              >
                <Card
                  elevation={3}
                  sx={{
                    width: "100%",
                    maxWidth: 900,
                    borderRadius: 3,
                    border: "1px solid #E5E8F0",
                    backgroundColor: "#FFFFFF",
                    boxShadow:
                      "0px 4px 8px rgba(0,0,0,0.04), 0px 2px 4px rgba(0,0,0,0.02)",
                    p: { xs: 2, sm: 3 },
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                  }}
                >
                  {/* Encabezado */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <CalendarMonthIcon color="primary" />
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        color="#092181"
                        sx={{
                          textAlign: { xs: "center", sm: "left" },
                          flex: 1,
                        }}
                      >
                        Detalles de la cita
                      </Typography>
                    </Box>

                    <Chip
                      label={
                        modalidadMap.find(
                          (m) => m.value === CitaSeleccionada.modalidad
                        )?.nombre || "Sin modalidad"
                      }
                      sx={{
                        backgroundColor: "#E8EDFF",
                        color: "#092181",
                        fontWeight: "bold",
                        borderRadius: "10px",
                        px: 1,
                      }}
                    />
                  </Box>

                  <Divider />

                  {/* Contenido principal */}
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                      p: 0,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2.5,
                      }}
                    >
                      {[
                        ["fecha_cita", "Fecha de la cita", "datetime-local"],
                        ["duracion_horas", "Duración (horas)", "number"],
                        ["modalidad", "Modalidad", "text"],
                        ...(CitaSeleccionada.modalidad === 2
                          ? [["enlace", "Enlace de la cita", "url"]]
                          : []),
                        ["comentario", "Comentarios", "text"],
                      ].map(([key, label, type]) => {
                        const isEditable = [
                          "duracion_horas",
                          "enlace",
                          "comentario",
                        ].includes(key);
                        const isDate = key === "fecha_cita";
                        const value = CitaSeleccionada[key];

                        const modalidadNombre =
                          key === "modalidad"
                            ? modalidadMap.find((m) => m.value === value)
                                ?.nombre || "Sin modalidad"
                            : null;

                        return (
                          <TextField
                            key={key}
                            fullWidth
                            sx={{
                              flex: "1 1 280px",
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
                            }}
                            label={label}
                            type={isDate ? "datetime-local" : type}
                            multiline={key === "comentario"}
                            rows={key === "comentario" ? 3 : 1}
                            value={
                              key === "modalidad"
                                ? modalidadNombre
                                : isDate && value
                                ? new Date(value).toISOString().slice(0, 16)
                                : value || ""
                            }
                            onChange={(e) =>
                              setCitaSeleccionada({
                                ...CitaSeleccionada,
                                [key]: e.target.value,
                              })
                            }
                            disabled={!isEditable || key === "modalidad"}
                            InputLabelProps={isDate ? { shrink: true } : {}}
                          />
                        );
                      })}
                    </Box>
                  </CardContent>

                  <Divider />

                  {/* Botones */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: { xs: "center", sm: "flex-end" },
                      flexWrap: "wrap",
                      gap: 2,
                      mt: 1,
                    }}
                  >
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
                      Volver al listado
                    </Button>
                  </Box>
                </Card>
              </Box>
            </>
          )}
        </Paper>

        {/* Animate para el mensaje de eliminación */}
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

        {/* Snackbar para mensajes */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
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
      </Container>
    </Layout>
  );
}
