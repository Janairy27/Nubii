import React, { useEffect, useState } from "react";
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
  CardContent,
  Chip,
  Snackbar,
  Tooltip,
  Divider,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  Search,
  ArrowBack,
  Psychology as PsychologyIcon,
  MoodBad as MoodBadIcon,
  FilterList,
  RestartAlt,

} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import StressManagementIcon from "@mui/icons-material/Spa";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import InsightsIcon from '@mui/icons-material/Insights';
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import HealingIcon from "@mui/icons-material/Healing";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import BadgeIcon from "@mui/icons-material/Badge";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import PersonIcon from '@mui/icons-material/Person';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { es } from "date-fns/locale";


const BusquedaResultadoTest = () => {
  const [idUsuario, setIdUsuario] = useState("");
  const [idProfesional, setIdProfesional] = useState(null);
  const [nombreProfesional, setNombreProfesional] = useState("");
  const [nombrePaciente, setNombrePaciente] = useState("");
  const [idPaciente, setIdPaciente] = useState(null);
  const [resultado, setResultado] = useState([]);
  const [filtrosActivos, setFiltrosActivos] = useState({
    nombre: false,
    tipo: false,
    fecha: false,
    categoria: false,
    interpretacion: false
  });

  const [valoresFiltro, setValoresFiltro] = useState({
    nombre: "",
    tipo: "",
    fecha: "",
    categoria: "",
    interpretacion: ""
  });

  const [resultadoSeleccionado, setResultadoSeleccionado] = useState(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensajeSnackbar, setMensajeSnackbar] = useState("");
  const [tipoSnackbar, setTipoSnackbar] = useState("success");

  const navigate = useNavigate();

  {/* Mapeo de tipo de test, categoria del resultado y la especilidad del profesional  */ }

  const TipoTest = [
    { value: 1, nombre: "GAD-7", icono: <PsychologyIcon />, color: "#42a5f5" },
    { value: 2, nombre: "BAI", icono: <SentimentDissatisfiedIcon />, color: "#29b6f6", },
    { value: 3, nombre: "STAI", icono: <SelfImprovementIcon />, color: "#26c6da", },
    { value: 4, nombre: "PHQ-9", icono: <MoodBadIcon />, color: "#ef5350" },
    { value: 5, nombre: "BDI-II", icono: <SentimentVeryDissatisfiedIcon />, color: "#e53935" },
    { value: 6, nombre: "CES-D", icono: <PsychologyIcon />, color: "#ab47bc" },
    { value: 7, nombre: "PSS", icono: <StressManagementIcon />, color: "#66bb6a" },
    { value: 8, nombre: "DASS-21", icono: <HealthAndSafetyIcon />, color: "#ffa726" },
    { value: 9, nombre: "Escala de estres", icono: <EmojiObjectsIcon />, color: "#9ccc65" },
  ];

  const resultadoMap = [
    { value: 1, nombre: "Normal", icono: <SentimentVerySatisfiedIcon />, color: "#66bb6a", },
    { value: 2, nombre: "Leve", icono: <SentimentSatisfiedAltIcon />, color: "#9ccc65", },
    { value: 3, nombre: "Moderado", icono: <SentimentNeutralIcon />, color: "#eddb36ff", },
    { value: 4, nombre: "Severo", icono: <SentimentDissatisfiedIcon />, color: "#ff7043", },
    { value: 5, nombre: "Extremo", icono: <SentimentVeryDissatisfiedIcon />, color: "#e53935", },
  ];

  const especialidadMap = [
    { value: 1, nombre: "Psicólogo", icono: <PsychologyIcon />, color: "#ab47bc" },
    { value: 2, nombre: "Psiquiatra", icono: <MedicalServicesIcon />, color: "#42a5f5" },
    { value: 3, nombre: "Terapeuta", icono: <HealingIcon />, color: "#26a69a" },
    { value: 4, nombre: "Neurólogo", icono: <LocalHospitalIcon />, color: "#ef5350" },
    { value: 5, nombre: "Médico General", icono: <FavoriteIcon />, color: "#66bb6a" },
    { value: 6, nombre: "Psicoterapeuta", icono: <SelfImprovementIcon />, color: "#ffa726" },
    { value: 7, nombre: "Psicoanalista", icono: <EmojiObjectsIcon />, color: "#8d6e63" },
    { value: 8, nombre: "Consejero en salud mental", icono: <SupportAgentIcon />, color: "#29b6f6" },
    { value: 9, nombre: "Trabajador social clínico", icono: <SupervisorAccountIcon />, color: "#ffa726" },
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
      obtenerresultado();
    }
  }, [idPaciente]);

  const obtenerresultado = () => {
    axios
      .get(`http://localhost:4000/api/resultado/by-filterPac/`, { params: { idPaciente } }
      )
      .then((res) => {
        setResultado(res.data);
        setResultadoSeleccionado(null);
      })
      .catch((err) => {
        console.error("Error al cargar resultados de test:", err);
        setResultado([]);
      });
  };

  const handleBuscar = async () => {
    const filtrosAplicados = {};

    if (filtrosActivos.nombre && valoresFiltro.nombre.trim()) {
      filtrosAplicados.nombreProfesional = valoresFiltro.nombre;
    }
    if (filtrosActivos.tipo && valoresFiltro.tipo) {
      filtrosAplicados.tipo_test = valoresFiltro.tipo;
    }
    if (filtrosActivos.fecha && valoresFiltro.fecha) {
      filtrosAplicados.fecha_aplicacion = valoresFiltro.fecha;
    }
    if (filtrosActivos.categoria && valoresFiltro.categoria) {
      filtrosAplicados.categ_resultado = valoresFiltro.categoria;
    }
    if (filtrosActivos.interpretacion && valoresFiltro.interpretacion) {
      filtrosAplicados.interpretacion = valoresFiltro.interpretacion;
    }

    if (Object.keys(filtrosAplicados).length === 0) {
      obtenerresultado();
      return;
    }

    const queryParams = new URLSearchParams(filtrosAplicados).toString();

    try {
      const res = await axios
        .get(`http://localhost:4000/api/resultado/by-filterPac?${queryParams}`, { params: { idPaciente } }
        );
      if (res.data && res.data.length > 0) {
        setResultado(res.data);
        setResultadoSeleccionado(null);
        mostrarMensaje("Resultados encontrados exitosamente.", "success");
      } else {
        mostrarMensaje("No se encontraron resultados con ese criterio.", "warning");
        await obtenerresultado();
      }
    } catch (error) {
      console.error(error);
      mostrarMensaje("Ocurrió un error al buscar los resultados.", "error");
      await obtenerresultado();
    }
  };

  const handleLimpiarFiltros = () => {
    setFiltrosActivos({
      nombre: false,
      tipo: false,
      fecha: false,
      categoria: false,
      interpretacion: false
    });

    setValoresFiltro({
      nombre: "",
      tipo: "",
      fecha: "",
      categoria: "",
      interpretacion: ""
    });

    obtenerresultado();
  };

  const handleSeleccionar = (resultado) => {
    setResultadoSeleccionado(resultado);
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
            <InsightsIcon sx={{
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
              Listado de resultados
            </Typography>
          </Box>
          {!resultadoSeleccionado && (
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

              {/* Campos de filtro */}

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
                    label="Nombre del profesional"
                    onChange={(e) =>
                      setValoresFiltro({ ...valoresFiltro, nombre: e.target.value })
                    }
                    sx={textFieldEstilo}
                  />

                )}
                {filtrosActivos.tipo && (
                  <FormControl fullWidth sx={textFieldEstilo}>
                    <InputLabel>Tipo de test realizado</InputLabel>
                    <Select
                      value={valoresFiltro.tipo}
                      onChange={(e) =>
                        setValoresFiltro({ ...valoresFiltro, tipo: e.target.value })
                      }
                      label="Tipo de test realizado"
                      renderValue={(selectedValue) => {
                        //  Encuentra el objeto 'tipo' correspondiente al valor seleccionado
                        const selectedTipo = TipoTest.find(
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
                      {TipoTest.map((t) => (
                        <MenuItem key={t.value} value={t.value}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Box sx={{ color: t.color, fontSize: 20 }}>{t.icono}</Box>
                            {t.nombre}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                )}

                {filtrosActivos.fecha && (
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                    <DatePicker
                      label="Fecha de aplicación"
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


                {filtrosActivos.categoria && (
                  <FormControl fullWidth sx={textFieldEstilo}>
                    <InputLabel>Categoria del resultado</InputLabel>
                    <Select
                      value={valoresFiltro.categoria}
                      onChange={(e) =>
                        setValoresFiltro({ ...valoresFiltro, categoria: e.target.value })
                      }
                      label="Categoria de los resultados"

                      renderValue={(selectedValue) => {
                        //  Encuentra el objeto 'categoria' correspondiente al valor seleccionado
                        const selectedCategoria = resultadoMap.find(
                          (categoria) => categoria.value === selectedValue
                        );

                        // Si se encuentra, renderiza el icono y el texto en la misma línea
                        // Usamos Box con display: flex para asegurar la alineación horizontal
                        if (selectedCategoria) {
                          return (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Box sx={{ color: selectedCategoria.color, display: 'flex' }}>
                                {selectedCategoria.icono}
                              </Box>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {selectedCategoria.nombre}
                              </Typography>
                            </Box>
                          );
                        }
                        return "";
                      }}
                    >
                      {resultadoMap.map((r) => (
                        <MenuItem key={r.value} value={r.value}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Box sx={{ color: r.color, fontSize: 20 }}>{r.icono}</Box>
                            {r.nombre}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                )}

                {filtrosActivos.interpretacion && (
                  <TextField
                    fullWidth
                    label="Interpretación de los resultados"
                    value={valoresFiltro.interpretacion}
                    onChange={(e) =>
                      setValoresFiltro({ ...valoresFiltro, interpretacion: e.target.value })
                    }
                    sx={textFieldEstilo}
                  />

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
          {!resultadoSeleccionado ? (
            <Tooltip
              title="Selecciona una tarjeta para ver más detalles"
              placement="top"
              arrow
            >
              <Box sx={{ width: "100%" }}>
                {/* Header */}
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
                  {/* Título */}
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
                    <InsightsIcon sx={{ color: "#0D1B2A", fontSize: 34 }} />
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold", color: "#0D1B2A", letterSpacing: "0.5px" }}
                    >
                      {resultado.length > 0
                        ? "Resultados registrados:"
                        : "No se han registrado resultados aún."}
                    </Typography>
                  </Box>

                  {/* Contador */}
                  <Chip
                    label={`${resultado.length} síntoma(s) registrado(s)`}
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
                  {resultado.map((item) => {
                    // Buscar tipo de test y resultado
                    const tTest = TipoTest.find((s) => s.value === Number(item.tipo_test));
                    const res = resultadoMap.find((s) => s.value === Number(item.categ_resultado));

                    return (
                      <Card
                        key={item.idResultado}
                        onClick={() => handleSeleccionar(item)}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          cursor: "pointer",
                          borderRadius: "20px",
                          border: "1px solid #E2E8F0",
                          backgroundColor: "#FFFFFF",
                          width: { xs: "100%", sm: "45%", md: "340px" },
                          minHeight: "240px",
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
                            gap: 2.5,
                            p: 3,
                          }}
                        >
                          {/* Profesional */}
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <PsychologyIcon sx={{ color: "#092181", fontSize: 30 }} />
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: 700, color: "#12275c", textAlign: "center" }}
                            >
                              {item.nombreProfesional}
                            </Typography>
                          </Box>

                          {/* Tipo de test */}
                          {tTest && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                mt: 1,
                                px: 2,
                                py: 0.5,
                                borderRadius: "12px",
                                backgroundColor: (theme) => theme.palette.mode === "light"
                                  ? `${tTest.color}33`
                                  : `${tTest.color}22`,
                              }}
                            >
                              <Box sx={{ color: tTest.color }}>{tTest.icono}</Box>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: tTest.color }}>
                                {tTest.nombre}
                              </Typography>
                            </Box>
                          )}


                          {/* Fecha de realización */}
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
                            <Typography variant="body2" sx={{ color: "#374151", fontWeight: 500 }}>
                              {new Date(item.fecha_aplicacion).toLocaleDateString("es-MX", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </Typography>
                          </Box>

                          {/* Puntaje */}
                          {res && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 1 }}>
                              <Box sx={{ color: res.color }}>{res.icono}</Box>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: "#12275c" }}>
                                {res.nombre}
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </Box>
              </Box>
            </Tooltip>

          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                width: "100%",
                py: 2,
              }}
            >
              {/* Título principal */}
              <Typography
                variant="h6"
                gutterBottom
                fontWeight="bold"
                sx={{ color: "#092181", textAlign: "center" }}
              >
                Detalle del resultado del test realizado
              </Typography>

              <Divider sx={{ width: "60%", mb: 2 }} />

              {/* Contenedor de tarjetas */}
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
                {/* Información básica */}
                <Card
                  sx={{
                    flex: "1 1 320px",
                    maxWidth: 400,
                    p: 3,
                    borderRadius: 4,
                    backgroundColor: "#f8f9ff",
                    border: "1px solid #d8e0ff",
                    boxShadow: "0 6px 18px rgba(9, 33, 129, 0.08)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 8px 24px rgba(9, 33, 129, 0.15)",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  <Box>
                    <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                      <BadgeIcon sx={{ color: "#092181" }} />
                      <Typography variant="h6" fontWeight="bold" sx={{ color: "#092181" }}>
                        Información básica
                      </Typography>
                    </Box>

                    {/* Profesional */}
                    <InfoItem
                      icon={<AssignmentIndIcon sx={{ color: "#5e35b1" }} />}
                      label="Profesional a cargo"
                      value={resultadoSeleccionado.nombreProfesional}
                    />

                    {/* Especialidad */}
                    {(() => {
                      const esp = especialidadMap.find(
                        (s) => s.value === resultadoSeleccionado.especialidad
                      );
                      return (
                        <Box sx={{ mt: 2, mb: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, }}>
                            {esp?.icono && (
                              <Box sx={{ color: esp.color, display: "flex", alignItems: "center" }}>
                                {esp.icono}
                              </Box>
                            )}
                            <Typography variant="subtitle2" sx={{ color: "#666" }}>
                              Especialidad del Profesional
                            </Typography>
                          </Box>
                          <Typography
                            variant="body1"
                            sx={{
                              mt: 0.5,
                              fontWeight: 600,
                              color: esp?.color || "#333",
                              ml: 4,
                            }}
                          >
                            {esp ? esp.nombre : "Sin registro"}
                          </Typography>
                        </Box>
                      );
                    })()}

                    {/* Paciente */}
                    <InfoItem
                      icon={<PersonIcon sx={{ color: "#3949ab" }} />}
                      label="Nombre del paciente"
                      value={resultadoSeleccionado.nombrePaciente}
                    />
                  </Box>
                </Card>

                {/* Información del test */}
                <Card
                  sx={{
                    flex: "1 1 320px",
                    maxWidth: 400,
                    p: 3,
                    borderRadius: 4,
                    backgroundColor: "#f8fcff",
                    border: "1px solid #d0e4ff",
                    boxShadow: "0 6px 18px rgba(9, 33, 129, 0.05)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 8px 24px rgba(9, 33, 129, 0.12)",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  <Box>
                    <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                      <PsychologyAltIcon sx={{ color: "#0277bd" }} />
                      <Typography variant="h6" fontWeight="bold" sx={{ color: "#0277bd" }}>
                        Información del Test
                      </Typography>
                    </Box>

                    {/* Tipo de test */}
                    {(() => {
                      const tipo = TipoTest.find(
                        (t) => Number(t.value) === Number(resultadoSeleccionado.tipo_test)
                      );
                      return (
                        <Box sx={{ mt: 2, mb: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, }}>
                            {tipo?.icono && (
                              <Box sx={{ color: tipo.color, display: "flex", alignItems: "center" }}>
                                {tipo.icono}
                              </Box>
                            )}
                            <Typography variant="subtitle2" sx={{ color: "#666" }}>
                              Tipo de test aplicado
                            </Typography>
                          </Box>
                          <Typography
                            variant="body1"
                            sx={{
                              mt: 0.5,
                              fontWeight: 600,
                              color: tipo?.color || "#333",
                              ml: 4,
                            }}
                          >
                            {tipo ? tipo.nombre : "Sin registro"}
                          </Typography>
                        </Box>
                      );
                    })()}

                    {/* Fecha */}
                    <InfoItem
                      icon={<CalendarMonthIcon sx={{ color: "#1e88e5" }} />}
                      label="Fecha de aplicación"
                      value={new Date(
                        resultadoSeleccionado.fecha_aplicacion
                      ).toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    />

                    {/* Puntaje */}
                    <InfoItem
                      icon={<ScoreboardIcon sx={{ color: "#43a047" }} />}
                      label="Puntaje obtenido"
                      value={resultadoSeleccionado.puntaje}
                    />

                    {/* Categoría del resultado */}
                    {(() => {
                      const cat = resultadoMap.find(
                        (s) => s.value === resultadoSeleccionado.categ_resultado
                      );
                      return (
                        <Box sx={{ mt: 2, mb: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, }}>
                            {cat?.icono && (
                              <Box sx={{ color: cat.color, display: "flex", alignItems: "center" }}>
                                {cat.icono}
                              </Box>
                            )}
                            <Typography variant="subtitle2" sx={{ color: "#666" }}>
                              Categoría del resultado
                            </Typography>
                          </Box>
                          <Typography
                            variant="body1"
                            sx={{
                              mt: 0.5,
                              fontWeight: 600,
                              color: cat?.color || "#333",
                              ml: 4,
                            }}
                          >
                            {cat ? cat.nombre : "Sin registro"}
                          </Typography>
                        </Box>
                      );
                    })()}

                    {/* Interpretación */}
                    <InfoItem
                      icon={<PsychologyIcon sx={{ color: "#8e24aa" }} />}
                      label="Interpretación del resultado"
                      value={resultadoSeleccionado.interpretacion}
                    />

                    {/* Recomendación */}
                    <InfoItem
                      icon={<TipsAndUpdatesIcon sx={{ color: "#fb8c00" }} />}
                      label="Recomendaciones adicionales"
                      value={resultadoSeleccionado.recomendacion}
                    />
                  </Box>
                </Card>
              </Box>

              {/* Botón de acción */}
              <Box textAlign="center" mt={4}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={() => setResultadoSeleccionado(null)}
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
        {/*  Snackbar para los mensajes */}
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

export default BusquedaResultadoTest;
