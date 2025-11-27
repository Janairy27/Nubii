import React, { useState, useEffect } from "react";
import Layout from "../components/LayoutAdmin";
import axios from "axios";
import { format } from "date-fns";

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
  Grid,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  Search,
  RestartAlt,
  FilterList,
  CalendarToday,
  ArrowForwardIos,
  Person,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import AssessmentIcon from "@mui/icons-material/Assessment";

import PsychologyIcon from "@mui/icons-material/Psychology";

import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import MoodBadIcon from "@mui/icons-material/MoodBad";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import StressManagementIcon from "@mui/icons-material/Spa";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import InsightsIcon from "@mui/icons-material/Insights";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import { es } from "date-fns/locale";

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

export default function ResultadosTestAdmin() {
  const [fecha, setFecha] = useState("");

  const [ResultadosTest, setResultadosTest] = useState([]);
  const [ResultadosTestSeleccionado, setResultadosTestSeleccionado] =
    useState(null);
  const [openDetalle, setOpenDetalle] = useState(false);
  const [filtrosActivos, setFiltrosActivos] = useState({
    paciente: false,
    profesional: false,
    tipo: false,
    fecha: false,
    categoria: false,
    interpretacion: false,
  });

  const [valoresFiltro, setValoresFiltro] = useState({
    paciente: "",
    profesional: "",
    tipo: "",
    fecha: "",
    categoria: "",
    interpretacion: "",
  });

  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensajeSnackbar, setMensajeSnackbar] = useState("");
  const [tipoSnackbar, setTipoSnackbar] = useState("success");

  const TipoTest = [
    { value: 1, nombre: "GAD-7", icono: <PsychologyIcon />, color: "#42a5f5" },
    {
      value: 2,
      nombre: "BAI",
      icono: <SentimentDissatisfiedIcon />,
      color: "#29b6f6",
    },
    {
      value: 3,
      nombre: "STAI",
      icono: <SelfImprovementIcon />,
      color: "#26c6da",
    },
    { value: 4, nombre: "PHQ-9", icono: <MoodBadIcon />, color: "#ef5350" },
    {
      value: 5,
      nombre: "BDI-II",
      icono: <SentimentVeryDissatisfiedIcon />,
      color: "#e53935",
    },
    { value: 6, nombre: "CES-D", icono: <PsychologyIcon />, color: "#ab47bc" },
    {
      value: 7,
      nombre: "PSS",
      icono: <StressManagementIcon />,
      color: "#66bb6a",
    },
    {
      value: 8,
      nombre: "DASS-21",
      icono: <HealthAndSafetyIcon />,
      color: "#ffa726",
    },
    {
      value: 9,
      nombre: "Escala de estres",
      icono: <EmojiObjectsIcon />,
      color: "#9ccc65",
    },
  ];

  const resultadoMap = [
    {
      value: 1,
      nombre: "Normal",
      icono: <SentimentVerySatisfiedIcon />,
      color: "#66bb6a",
    },
    {
      value: 2,
      nombre: "Leve",
      icono: <SentimentSatisfiedAltIcon />,
      color: "#9ccc65",
    },
    {
      value: 3,
      nombre: "Moderado",
      icono: <SentimentNeutralIcon />,
      color: "#eddb36ff",
    },
    {
      value: 4,
      nombre: "Severo",
      icono: <SentimentDissatisfiedIcon />,
      color: "#ff7043",
    },
    {
      value: 5,
      nombre: "Extremo",
      icono: <SentimentVeryDissatisfiedIcon />,
      color: "#e53935",
    },
  ];
  // Funciones para obtener nombre, icono y color según valor seleccionado para tipo de test
  const getNombreTipoTest = (value) => {
    const tipotest = TipoTest.find((t) => t.value === Number(value));
    return tipotest ? tipotest.nombre : `Desconocido (${value})`;
  };
  const getIconoTipoTest = (value) => {
    const tipotest = TipoTest.find((t) => t.value === Number(value));
    return tipotest ? tipotest.icono : null;
  };
  const getColorTipoTest = (value) => {
    const tipotest = TipoTest.find((t) => t.value === Number(value));
    return tipotest ? tipotest.color : "#666";
  };

  // Funciones para obtener nombre, icono y color según valor seleccionado para resultado
  const getNombreResultado = (value) => {
    const resultadoC = resultadoMap.find(
      (resulta) => resulta.value === Number(value)
    );
    return resultadoC ? resultadoC.nombre : `Desconocido (${value})`;
  };
  const getIconoResultado = (value) => {
    const resultadoC = resultadoMap.find(
      (resulta) => resulta.value === Number(value)
    );
    return resultadoC ? resultadoC.icono : null;
  };
  const getColorResultado = (value) => {
    const resultadoC = resultadoMap.find(
      (resulta) => resulta.value === Number(value)
    );
    return resultadoC ? resultadoC.color : "#666";
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

  const handleSeleccionar = (resultado) => {
    setResultadosTestSeleccionado(resultado);
    setOpenDetalle(true);
  };
  const handleCloseDetalle = () => {
    setOpenDetalle(false);
    setResultadosTestSeleccionado(null);
  };

  const obtenerTodosResultadosTest = () => {
    axios
      .get(`http://localhost:4000/api/resultado/all-by-filter/`)
      .then((res) => {
        setResultadosTest(res.data);
        //setResultadosTestSeleccionado(null);
      })
      .catch((err) => {
        console.error("Error al cargar todos los resultados:", err);
        setResultadosTest([]);
        mostrarMensaje("Error al cargar los resultados del servidor.", "error");
      });
  };
  useEffect(() => {
    obtenerTodosResultadosTest();
  }, []);

  const handleBuscar = async () => {
    const filtrosAplicados = {};

    if (filtrosActivos.paciente && valoresFiltro.paciente.trim()) {
      filtrosAplicados.nombrePaciente = valoresFiltro.paciente;
    }
    if (filtrosActivos.profesional && valoresFiltro.profesional.trim()) {
      filtrosAplicados.nombreProfesional = valoresFiltro.profesional;
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
      obtenerTodosResultadosTest();
      return;
    }

    const queryParams = new URLSearchParams(filtrosAplicados).toString();
    try {
      const res = await axios.get(
        `http://localhost:4000/api/resultado/all-by-filter?${queryParams}`
      );

      if (res.data && res.data.length > 0) {
        setResultadosTest(res.data);
        mostrarMensaje("Resultados encontrados exitosamente.", "success");
      } else {
        setResultadosTest([]);
        mostrarMensaje(
          "No se encontraron resultados con ese criterio.",
          "warning"
        );
      }
    } catch (error) {
      console.error("Error al buscar resultados (Admin):", error);
      mostrarMensaje("Ocurrió un error al buscar los resultados.", "error");
      obtenerTodosResultadosTest();
    }
  };

  const handleLimpiarFiltros = () => {
    setFiltrosActivos({
      paciente: false,
      profesional: false,
      tipo: false,
      fecha: false,
      categoria: false,
      interpretacion: false,
    });
    setValoresFiltro({
      paciente: "",
      profesional: "",
      tipo: "",
      fecha: "",
      categoria: "",
      interpretacion: "",
    });
    obtenerTodosResultadosTest();
  };

  const fechaObjetoLocal = fecha
    ? new Date(
        // Usar new Date(año, mes, día) crea la fecha a medianoche LOCAL
        parseInt(fecha.substring(0, 4)), // Año
        parseInt(fecha.substring(5, 7)) - 1, // Mes (0-indexado)
        parseInt(fecha.substring(8, 10)) // Día
      )
    : null;
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
            <InsightsIcon
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
              Resultados Test
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

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              {filtrosActivos.paciente && (
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
                  label="Nombre del paciente"
                  onChange={(e) =>
                    setValoresFiltro({
                      ...valoresFiltro,
                      paciente: e.target.value,
                    })
                  }
                />
              )}

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
                  onChange={(e) =>
                    setValoresFiltro({
                      ...valoresFiltro,
                      profesional: e.target.value,
                    })
                  }
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
                    },
                  }}
                >
                  <InputLabel>Tipo de test realizado</InputLabel>
                  <Select
                    value={valoresFiltro.tipo}
                    onChange={(e) =>
                      setValoresFiltro({
                        ...valoresFiltro,
                        tipo: e.target.value,
                      })
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
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                color: selectedTipo.color,
                                display: "flex",
                              }}
                            >
                              {selectedTipo.icono}
                            </Box>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 500 }}
                            >
                              {selectedTipo.nombre}
                            </Typography>
                          </Box>
                        );
                      }
                      return "";
                    }}
                  >
                    {TipoTest.map((tipo) => (
                      <MenuItem key={tipo.value} value={tipo.value}>
                        <ListItemIcon>
                          <Box sx={{ color: tipo.color }}>{tipo.icono}</Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={tipo.nombre}
                          primaryTypographyProps={{
                            sx: { fontWeight: 500 },
                          }}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {filtrosActivos.fecha && (
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
                  label="Fecha de aplicación"
                  type="date"
                  value={valoresFiltro.fecha}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) =>
                    setValoresFiltro({
                      ...valoresFiltro,
                      fecha: e.target.value,
                    })
                  }
                />
              )}

              {filtrosActivos.categoria && (
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
                  <InputLabel>Categoria del resultado</InputLabel>
                  <Select
                    value={valoresFiltro.categoria}
                    onChange={(e) =>
                      setValoresFiltro({
                        ...valoresFiltro,
                        categoria: e.target.value,
                      })
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
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                color: selectedCategoria.color,
                                display: "flex",
                              }}
                            >
                              {selectedCategoria.icono}
                            </Box>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 500 }}
                            >
                              {selectedCategoria.nombre}
                            </Typography>
                          </Box>
                        );
                      }
                      return "";
                    }}
                  >
                    {resultadoMap.map((categoria) => (
                      <MenuItem key={categoria.value} value={categoria.value}>
                        <ListItemIcon>
                          <Box sx={{ color: categoria.color }}>
                            {categoria.icono}
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={categoria.nombre}
                          primaryTypographyProps={{
                            sx: { fontWeight: 500 },
                          }}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {filtrosActivos.interpretacion && (
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
                  label="Interpretación de los resultados"
                  value={valoresFiltro.interpretacion}
                  onChange={(e) =>
                    setValoresFiltro({
                      ...valoresFiltro,
                      interpretacion: e.target.value,
                    })
                  }
                />
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
              </Box>
            </Box>
          </Card>

          {ResultadosTest.length > 0 ? (
            <Grid container spacing={3}>
              {ResultadosTest.map((resultado) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={resultado.idResultadoTest}
                >
                  <Card
                    onClick={() => handleSeleccionar(resultado)}
                    sx={{
                      height: "100%",
                      cursor: "pointer",
                      borderRadius: 4,
                      border: "1px solid #e3e8ff",
                      background: " #f9fbff ",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                      "&:hover": {
                        boxShadow: "0 8px 22px rgba(9, 33, 129, 0.18)",
                        transform: "translateY(-6px)",
                        borderColor: "#092181",
                        background: " #f1f5ff",
                      },
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      {/* Header con tipo de test y botón */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 0.5,
                        }}
                      >
                        {/* Tipo de test */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            py: 0.5,
                            borderRadius: 2,
                            backgroundColor: `${getColorTipoTest(
                              resultado.tipo_test
                            )}15`,
                            color: getColorTipoTest(resultado.tipo_test),
                            fontWeight: 600,
                          }}
                        >
                          {getIconoTipoTest(resultado.tipo_test)}
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {getNombreTipoTest(resultado.tipo_test)}
                          </Typography>
                        </Box>
                        <Tooltip title="Ver detalles completos">
                          <IconButton
                            size="small"
                            sx={{
                              color: "#64748b",
                              backgroundColor: "#f8fafc",
                              "&:hover": {
                                backgroundColor: "#092181",
                                color: "white",
                                transform: "scale(1.1)",
                              },
                              transition: "all 0.2s ease",
                            }}
                          >
                            <ArrowForwardIos fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Divider sx={{ my: 1 }} />

                      {/* Información principal */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1.5,
                          flex: 1,
                        }}
                      >
                        <InfoItem
                          icon={
                            <Person sx={{ fontSize: 18, color: "#092181" }} />
                          }
                          label="Paciente"
                          value={resultado.nombrePaciente || "N/A"}
                          valueSx={{ fontWeight: "600", color: "#1e293b" }}
                        />

                        <InfoItem
                          icon={
                            <PsychologyIcon
                              sx={{ fontSize: 18, color: "#092181" }}
                            />
                          }
                          label="Profesional"
                          value={resultado.nombreProfesional || "N/A"}
                          valueSx={{ color: "#475569" }}
                        />

                        <InfoItem
                          icon={
                            <CalendarToday
                              sx={{ fontSize: 18, color: "#092181" }}
                            />
                          }
                          label="Fecha"
                          value={format(
                            new Date(resultado.fecha_aplicacion),
                            "dd-MM-yyyy",
                            { locale: es }
                          )}
                          valueSx={{ color: "#475569" }}
                        />
                      </Box>

                      {/* Resultado */}
                      <Box sx={{ mt: "auto", pt: 1.5 }}>
                        {/* --- Resultado visual --- */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            mt: 2,
                            borderRadius: "20px",
                            backgroundColor: `${getColorResultado(
                              resultado.categ_resultado
                            )}15`,
                            color: getColorResultado(resultado.categ_resultado),
                            px: 2.5,
                            py: 1,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            boxShadow: `0 2px 6px ${getColorResultado(
                              resultado.categ_resultado
                            )}30`,
                          }}
                        >
                          {getIconoResultado(resultado.categ_resultado)}
                          <Typography variant="body2">
                            {getNombreResultado(resultado.categ_resultado)}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert
              severity="info"
              variant="outlined"
              sx={{
                mt: 3,
                borderRadius: 2,
                borderColor: "#e2e8f0",
                backgroundColor: "#f8fafc",
                "& .MuiAlert-message": { color: "#475569" },
              }}
            >
              No hay resultados de test para mostrar o no se encontraron
              coincidencias con los filtros aplicados.
            </Alert>
          )}

          {/* --- Modal de detalle --- */}
          <Dialog
            open={openDetalle}
            onClose={handleCloseDetalle}
            fullWidth
            maxWidth="md"
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                overflow: "hidden",
              },
            }}
          >
            <DialogTitle
              sx={{
                backgroundColor: "#f8fafc",
                borderBottom: "1px solid #e2e8f0",
                py: 2.5,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 4,
                  height: 32,
                  backgroundColor: "#092181",
                  borderRadius: 2,
                }}
              />
              <Box>
                <Typography variant="h6" fontWeight="700" color="#1e293b">
                  Detalle del Resultado
                </Typography>
              </Box>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 0 }}>
              {ResultadosTestSeleccionado && (
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    {/* Información General */}
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          backgroundColor: "#f8fafc",
                          p: 2.5,
                          borderRadius: 2,
                          border: "1px solid #e2e8f0",
                          height: "100%",
                        }}
                      >
                        <Typography
                          variant="h6"
                          color="#1e293b"
                          fontWeight="600"
                          sx={{
                            mb: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <InfoIcon sx={{ color: "#092181", fontSize: 20 }} />
                          Información General
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          <InfoItem
                            icon={<Person sx={{ color: "#092181" }} />}
                            label="Paciente"
                            value={ResultadosTestSeleccionado.nombrePaciente}
                            valueSx={{ fontWeight: "600", color: "#1e293b" }}
                          />
                          <InfoItem
                            icon={<PsychologyIcon sx={{ color: "#092181" }} />}
                            label="Profesional"
                            value={ResultadosTestSeleccionado.nombreProfesional}
                          />
                          <Box>
                            <Typography
                              variant="body2"
                              color="#64748b"
                              fontWeight="600"
                              sx={{ mb: 1 }}
                            >
                              Tipo de test
                            </Typography>
                            <Chip
                              icon={getIconoTipoTest(
                                ResultadosTestSeleccionado.tipo_test
                              )}
                              label={getNombreTipoTest(
                                ResultadosTestSeleccionado.tipo_test
                              )}
                              sx={{
                                backgroundColor: `${getColorTipoTest(
                                  ResultadosTestSeleccionado.tipo_test
                                )}15`,
                                color: getColorTipoTest(
                                  ResultadosTestSeleccionado.tipoSnackbar
                                ),
                                fontWeight: "700",
                                fontSize: "0.8rem",
                                height: "32px",
                                boxShadow: `0 2px 6px ${getColorTipoTest(
                                  ResultadosTestSeleccionado.tipo_test
                                )}30`,
                              }}
                            />
                          </Box>
                          <InfoItem
                            icon={<CalendarToday sx={{ color: "#092181" }} />}
                            label="Fecha de Aplicación"
                            value={format(
                              new Date(
                                ResultadosTestSeleccionado.fecha_aplicacion
                              ),
                              "dd-MM-yyyy",
                              { locale: es }
                            )}
                          />
                          <InfoItem
                            icon={<InsightsIcon sx={{ color: "#092181" }} />}
                            label="Puntaje Obtenido"
                            value={
                              <Typography
                                variant="body1"
                                fontWeight="700"
                                color="#092181"
                              >
                                {ResultadosTestSeleccionado.puntaje}
                              </Typography>
                            }
                          />
                        </Box>
                      </Box>
                    </Grid>

                    {/* Resultado e Interpretación */}
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          backgroundColor: "#f8fafc",
                          p: 2.5,
                          borderRadius: 2,
                          border: "1px solid #e2e8f0",
                          height: "100%",
                        }}
                      >
                        <Typography
                          variant="h6"
                          color="#1e293b"
                          fontWeight="600"
                          sx={{
                            mb: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <AssessmentIcon
                            sx={{ color: "#092181", fontSize: 20 }}
                          />
                          Evaluación
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="body2"
                              color="#64748b"
                              fontWeight="600"
                              sx={{ mb: 1 }}
                            >
                              Categoría del Resultado
                            </Typography>
                            <Chip
                              icon={getIconoResultado(
                                ResultadosTestSeleccionado.categ_resultado
                              )}
                              label={getNombreResultado(
                                ResultadosTestSeleccionado.categ_resultado
                              )}
                              sx={{
                                backgroundColor: `${getColorResultado(
                                  ResultadosTestSeleccionado.categ_resultado
                                )}15`,
                                color: getColorResultado(
                                  ResultadosTestSeleccionado.categ_resultado
                                ),
                                fontWeight: "700",
                                fontSize: "0.8rem",
                                height: "32px",
                                boxShadow: `0 2px 6px ${getColorResultado(
                                  ResultadosTestSeleccionado.categ_resultado
                                )}30`,
                              }}
                            />
                          </Box>

                          <InfoItem
                            icon={<PeopleAltIcon sx={{ color: "#092181" }} />}
                            label="Interpretación"
                            value={
                              <Typography
                                variant="body2"
                                sx={{ lineHeight: 1.6, color: "#475569" }}
                              >
                                {ResultadosTestSeleccionado.interpretacion}
                              </Typography>
                            }
                            vertical
                          />

                          <InfoItem
                            icon={
                              <EmojiObjectsIcon sx={{ color: "#092181" }} />
                            }
                            label="Recomendación"
                            value={
                              <Typography
                                variant="body2"
                                sx={{ lineHeight: 1.6, color: "#475569" }}
                              >
                                {ResultadosTestSeleccionado.recomendacion ||
                                  "No se registró una recomendación específica."}
                              </Typography>
                            }
                            vertical
                          />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </DialogContent>

            <DialogActions
              sx={{
                p: 2.5,
                borderTop: "1px solid #e2e8f0",
                backgroundColor: "#f8fafc",
              }}
            >
              <Button
                onClick={handleCloseDetalle}
                variant="contained"
                sx={{
                  backgroundColor: "#092181",
                  fontWeight: "600",
                  textTransform: "none",
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  "&:hover": {
                    backgroundColor: "#1a3fd4",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(9, 33, 129, 0.3)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                Cerrar
              </Button>
            </DialogActions>
          </Dialog>
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
}
