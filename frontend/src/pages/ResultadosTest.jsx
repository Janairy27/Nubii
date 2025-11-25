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
  Grid,
  Divider,
  Tooltip,

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
  CalendarToday,
  ArrowForwardIos,
  Person
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PsychologyIcon from "@mui/icons-material/Psychology";
import AddAlertIcon from '@mui/icons-material/AddAlert';
import AddchartIcon from '@mui/icons-material/Addchart';
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
import InsightsIcon from '@mui/icons-material/Insights';
import Person2Icon from '@mui/icons-material/Person2';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CancelIcon from '@mui/icons-material/Cancel';
import BarChartIcon from '@mui/icons-material/BarChart';


import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { es } from "date-fns/locale";




export default function ResultadosTest() {
  const [idUsuario, setIdUsuario] = useState(null);
  const [idProfesional, setIdProfesional] = useState(null);
  const [Nombre, setNombre] = useState('');

  const [idPaciente, setIdPaciente] = useState(null);
  const [pacientes, setPacientes] = useState([]);

  const [nombrePaciente, setNombrePaciente] = useState("");
  const [tipo, setTipo] = useState("");
  const [fecha, setFecha] = useState("");
  const [puntaje, setPuntaje] = useState(null);
  const [categoria, setCategoria] = useState(null);
  const [interpretacion, setInterpretacion] = useState("");
  const [recomendacion, setRecomendacion] = useState("");

  const [ResultadosTest, setResultadosTest] = useState([]);
  const [filtrosActivos, setFiltrosActivos] = useState({
    paciente: false,
    tipo: false,
    fecha: false,
    categoria: false,
    interpretacion: false
  });

  const [valoresFiltro, setValoresFiltro] = useState({
    paciente: "",
    tipo: "",
    fecha: "",
    categoria: "",
    interpretacion: ""
  });

  const [ResultadosTestSeleccionado, setResultadosTestSeleccionado] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensajeSnackbar, setMensajeSnackbar] = useState("");
  const [tipoSnackbar, setTipoSnackbar] = useState("success");

  const TipoTest = [
    { value: 1, nombre: "GAD-7", icono: <PsychologyIcon />, color: "#42a5f5" },
    { value: 2, nombre: "BAI", icono: <SentimentDissatisfiedIcon />, color: "#29b6f6", },
    { value: 3, nombre: "STAI", icono: <SelfImprovementIcon />, color: "#26c6da", },
    { value: 4, nombre: "PHQ-9", descripcion: "Cuestionario de Salud del Paciente", icono: <MoodBadIcon />, color: "#ef5350" },
    { value: 5, nombre: "BDI-II", descripcion: "Inventario de Depresión de Beck", icono: <SentimentVeryDissatisfiedIcon />, color: "#e53935" },
    { value: 6, nombre: "CES-D", descripcion: "Escala de Depresión del Centro de Estudios Epidemiológicos", icono: <PsychologyIcon />, color: "#ab47bc" },
    { value: 7, nombre: "PSS", descripcion: "Escala de Estrés Percibido", icono: <StressManagementIcon />, color: "#66bb6a" },
    { value: 8, nombre: "DASS-21", descripcion: "Depresión, Ansiedad y Estrés", icono: <HealthAndSafetyIcon />, color: "#ffa726" },
    { value: 9, nombre: "Escala de estres", descripcion: "Medición general del estrés", icono: <EmojiObjectsIcon />, color: "#9ccc65" },
  ];

  const resultadoMap = [
    { value: 1, nombre: "Normal", icono: <SentimentVerySatisfiedIcon />, color: "#66bb6a", },
    { value: 2, nombre: "Leve", icono: <SentimentSatisfiedAltIcon />, color: "#9ccc65", },
    { value: 3, nombre: "Moderado", icono: <SentimentNeutralIcon />, color: "#eddb36ff", },
    { value: 4, nombre: "Severo", icono: <SentimentDissatisfiedIcon />, color: "#ff7043", },
    { value: 5, nombre: "Extremo", icono: <SentimentVeryDissatisfiedIcon />, color: "#e53935", },
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
    const resultadoC = resultadoMap.find((resulta) => resulta.value === Number(value));
    return resultadoC ? resultadoC.nombre : `Desconocido (${value})`;
  };
  const getIconoResultado = (value) => {
    const resultadoC = resultadoMap.find((resulta) => resulta.value === Number(value));
    return resultadoC ? resultadoC.icono : null;
  };
  const getColorResultado = (value) => {
    const resultadoC = resultadoMap.find((resulta) => resulta.value === Number(value));
    return resultadoC ? resultadoC.color : "#666";
  };
  // Abrir diálogo de confirmación
  const handleOpenConfirm = () => {
    //setResultadosTestSeleccionado(ResultadosTest.find(r => r.idResultado === id));
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
      obtenerResultadosTest();
    }
  }, [idProfesional]);

  const obtenerResultadosTest = () => {
    axios
      .get(`http://localhost:4000/api/resultado/by-filter/`,
        { params: { idProfesional } }
      )
      .then((res) => {
        setResultadosTest(res.data);
        setResultadosTestSeleccionado(null);
      })
      .catch((err) => {
        console.error("Error al cargar resultados:", err);
        setResultadosTest([]);
      });
  };

  const handleBuscar = async () => {
    const filtrosAplicados = {};

    if (filtrosActivos.paciente && valoresFiltro.paciente.trim()) {
      filtrosAplicados.nombrePaciente = valoresFiltro.paciente;
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
      obtenerResultadosTest();
      return;
    }

    const queryParams = new URLSearchParams(filtrosAplicados).toString();
    try {
      const res = await
        axios
          .get(`http://localhost:4000/api/resultado/by-filter?${queryParams}`,
            { params: { idProfesional } }
          );
      if (res.data && res.data.length > 0) {

        setResultadosTest(res.data);
        setResultadosTestSeleccionado(null);
        mostrarMensaje("Resultados encontrados exitosamente.", "success");
      } else {
        mostrarMensaje("No se encontraron resultados con ese criterio.", "warning");
        await obtenerResultadosTest();
      }
    }
    catch (error) {
      console.error(error);
      mostrarMensaje("Ocurrió un error al buscar los síntomas.", "error");
      await obtenerResultadosTest();
    }
  };

  const handleLimpiarFiltros = () => {
    setFiltrosActivos({
      paciente: false,
      tipo: false,
      fecha: false,
      categoria: false,
      interpretacion: false
    });

    setValoresFiltro({
      paciente: "",
      tipo: "",
      fecha: "",
      categoria: "",
      interpretacion: ""
    });

    obtenerResultadosTest();
  };

  const handleSeleccionar = (resultado) => {
    setResultadosTestSeleccionado(resultado);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      idProfesional,
      idPaciente,
      tipo_test: tipo,
      fecha_aplicacion: fecha,
      puntaje,
      categ_resultado: categoria,
      interpretacion,
      recomendacion
    };

    console.log("Enviando data:", data);

  axios.post("http://localhost:4000/api/resultado/registro-resultado", data)
  .then(() =>{
    
     mostrarMensaje("Resultado registrado exitosamente.", "success");
      setOpenSnackbar(true);
      setTimeout(() => navigate("/resultado-test"), 2000);
    

  }).catch( (err) => {
     //Log completo del error para depuración
    console.error("Error completo de Axios:", err);
    let mensajeError = "Error al registrar el resultado.";

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
        `http://localhost:4000/api/resultado/actualizar-resultado/${ResultadosTestSeleccionado.idResultadoTest}`,
        ResultadosTestSeleccionado
      )
      .then(() => {
        mostrarMensaje("Test actualizado correctamente", "success");
        obtenerResultadosTest();
        setResultadosTestSeleccionado(null);
      })
      .catch((err) =>{
        //Log completo del error para depuración
        console.error("Error completo de Axios:", err);
        let mensajeError = "Error al actualizar la recomendación.";
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
    
    if (!ResultadosTestSeleccionado || !ResultadosTestSeleccionado.idResultadoTest) {
        console.warn("No hay ID de resultado para eliminar.");
        setOpenConfirm(false); 
        return;
    }
    //Obtener el ID del resultado a eliminar
    const idQueVoyAEnviar = ResultadosTestSeleccionado.idResultadoTest;

    // Construir la URL de eliminación
    const url = 
      `http://localhost:4000/api/resultado/eliminar-resultado/${idQueVoyAEnviar}`;
    try {
      await axios.delete(url);
      
      // Limpiar el estado SÓLO al recibir el éxito de la API
      setResultadosTestSeleccionado(null); 
      setOpenConfirm(false); 
      setOpenSuccess(true); 
      setTimeout(() => navigate("/dashboardProf"), 2000);
    }
    catch (error) {
      console.error("Error al eliminar:", error.response?.data || error.message);
      alert(`Error al eliminar resultado: ${error.response?.data?.error || "Desconocido"}`);
    }
};

  const obtenerPacientes = () => {
    axios.get("http://localhost:4000/api/auth/pacientes")
      .then((res) => setPacientes(res.data))
      .catch((err) => console.log("Error al obtener pacientes", err));
  };

  useEffect(() => {
    obtenerPacientes();
  }, []);

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
                    setValoresFiltro({ ...valoresFiltro, paciente: e.target.value })
                  }
                />

              )}
              {filtrosActivos.tipo && (
                <FormControl sx={{
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

                }}>
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
                    {TipoTest.map((tipo) => (
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
                    setValoresFiltro({ ...valoresFiltro, fecha: e.target.value })
                  }
                />

              )}

              {filtrosActivos.categoria && (

                <FormControl sx={{
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

                }}>
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
                            sx: { fontWeight: 500 }
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
                    setValoresFiltro({ ...valoresFiltro, interpretacion: e.target.value })
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
                <Button
                  variant="contained"

                  startIcon={mostrarFormulario ? <Close /> : <AddchartIcon />}
                  onClick={() => setMostrarFormulario(!mostrarFormulario)}
                  sx={{
                    minWidth: 150,
                    textTransform: "none",
                    background: "#092181",
                    "&:hover": { background: "#1c3cc9" },
                    borderRadius: 2,
                  }}
                >
                  {mostrarFormulario ? "Ocultar formulario" : " Agregar resultado"}
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
                {/* Información del profesional */}
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
                      <PsychologyIcon sx={{ color: "#092181", fontSize: 28 }} />
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                          color: "#092181",
                          textAlign: "center",
                          letterSpacing: 0.5,
                        }}
                      >
                        Información del profesional
                      </Typography>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <TextField
                      fullWidth
                      label="Profesional"
                      value={Nombre}
                      disabled
                      variant="outlined"
                    />
                  </CardContent>
                </Card>

                {/* Información del paciente */}
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
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Person2Icon sx={{ color: "#092181", fontSize: 28 }} />
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                          color: "#092181",
                          textAlign: "center",
                          letterSpacing: 0.5,
                        }}
                      >
                        Información del paciente
                      </Typography>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Paciente</InputLabel>
                      <Select
                        name="paciente"
                        value={idPaciente}
                        onChange={(e) => setIdPaciente(Number(e.target.value))}
                        label="Paciente"
                      >
                        {pacientes.map((p) => (
                          <MenuItem key={p.idPaciente} value={p.idPaciente}>
                            {p.nombrePaciente}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                      <DatePicker
                        label="Fecha del test"
                        value={fechaObjetoLocal}
                        onChange={(newValue) => {
                          if (newValue) {
                           
                            const year = newValue.getFullYear();
                            const month = (newValue.getMonth() + 1).toString().padStart(2, '0');
                            const day = newValue.getDate().toString().padStart(2, '0');
                            setFecha(`${year}-${month}-${day}`);
                          } else {
                            setFecha("");
                          }
                  
                        }}
                      format="dd/MM/yyyy"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                        
                          InputLabelProps: { shrink: true },
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
              </Box>

              {/*  Configuración del test  */}
              <Card
                sx={{
                  flex: 1,
                  p: { xs: 2, md: 3 },
                  borderRadius: 3,
                  backgroundColor: "#f8f9ff",
                  border: "2px solid #092181",
                  boxShadow: "0 4px 12px rgba(9, 33, 129, 0.15)",

                  display: "flex",
                  flexDirection: "column",
                }}

              >
                <CardContent sx={{
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
                    <SettingsSuggestIcon sx={{ color: "#092181", fontSize: 28 }} />
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{
                        color: "#092181",
                        textAlign: "center",
                        letterSpacing: 0.5,
                      }}
                    >
                      Configuración y resultados
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      gap: 2,
                    }}
                  >
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
                    }}
                    >
                      <InputLabel>Tipo de test</InputLabel>
                      <Select
                        name="tipo"
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        label="Tipo de test"
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
                        {TipoTest.map((test) => (
                          <MenuItem key={test.value} value={test.value}>
                            <ListItemIcon>
                              <Box sx={{ color: test.color }}>
                                {test.icono}
                              </Box>
                            </ListItemIcon>
                            <ListItemText
                              primary={test.nombre}
                              primaryTypographyProps={{
                                sx: { fontWeight: 500 }
                              }}
                            />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

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
                      type="number"
                      name="puntaje"
                      label="Puntaje"
                      value={puntaje}
                      onChange={(e) => setPuntaje(Number(e.target.value))}
                      required
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      gap: 2,
                    }}
                  >

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
                      }}>
                      <InputLabel>Categoría del resultado</InputLabel>
                      <Select
                        name="categoria"
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        label="Categoría del resultado"

                          renderValue={(selectedValue) => {
                            //  Encuentra el objeto 'categoría' correspondiente al valor seleccionado
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
                        {resultadoMap.map((item) => (
                          <MenuItem
                            key={item.value}
                            value={item.value}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              color: item.color,
                            }}
                          >
                            {item.icono}
                            <Box component="span" sx={{ color: "text.primary" }}>
                              {item.nombre}
                            </Box>
                          </MenuItem>
                        ))}

                      </Select>
                    </FormControl>

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
                      name="interpretacion"
                      label="Interpretación"
                      multiline
                      minRows={2}
                      value={interpretacion}
                      onChange={(e) => setInterpretacion(e.target.value)}

                    />
                  </Box>

                  <TextField
                    fullWidth
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
                    name="recomendacion"
                    label="Recomendación"
                    multiline
                    minRows={2}
                    value={recomendacion}
                    onChange={(e) => setRecomendacion(e.target.value)}

                  />

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
                      startIcon={<AddchartIcon />}
                      sx={{
                        minWidth: '140px',
                        textTransform: "capitalize",
                        borderRadius: 2,
                        background: "#2D5D7B",
                        "&:hover": { background: "#092181" },
                      }}
                    >
                      Agregar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* Listado o Detalle */}
          {!ResultadosTestSeleccionado ? (
            <Tooltip title="Selecciona una tarjeta para editar y/o eliminar la información" arrow>
              <Box sx={{ width: "100%" }}>
                <Box sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: { xs: "center", sm: "space-between" },
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 3,
                }}>
                  <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    flex: 1,
                    justifyContent: { xs: "center", sm: "flex-start" },
                    textAlign: { xs: "center", sm: "left" },
                  }}>
                    <InsightsIcon sx={{ color: "#092181", fontSize: 30 }} />

                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        fontWeight: "bold",
                        color: "#1a2e4f",
                      }}
                    >
                      {ResultadosTest.length > 0
                        ? "Resultados de test registrados"
                        : "No se han registrado resultados de test aún"}
                    </Typography>
                  </Box>
                  <Chip
                    label={`${ResultadosTest.length} tests físicos registrado(s)`}
                    sx={{
                      backgroundColor: "#092181",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                </Box>

                {/* Contenedor principal de resultados */}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 3,

                    justifyContent: { xs: "center", sm: "center" },
                  }}
                >
                  {ResultadosTest.map((resultado) => (
                    <Card
                      key={resultado.idResultadoTest}
                      onClick={() => handleSeleccionar(resultado)}
                      sx={{
                        cursor: "pointer",
                        borderRadius: 4,
                        border: "1px solid #e3e8ff",
                        background: " #f9fbff ",
                        width: { xs: "100%", sm: "calc(50% - 12px)", md: "360px" },
                        maxWidth: "400px",
                        minWidth: "280px",
                        flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 12px)", md: "0 1 360px" },
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                        "&:hover": {
                          boxShadow: "0 8px 22px rgba(9, 33, 129, 0.18)",
                          transform: "translateY(-6px)",
                          borderColor: "#092181",
                          background: " #f1f5ff",
                        },
                      }}
                    >
                      <CardContent
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2.5,
                          p: 3,
                        }}
                      >
                        {/* --- Encabezado: Paciente y tipo de test --- */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            <HealthAndSafetyIcon sx={{ color: "#092181", fontSize: 28 }} />
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                color: "#12275c",
                                textAlign: "center",
                              }}
                            >
                              {resultado.nombrePaciente}
                            </Typography>
                          </Box>

                          {/* Tipo de test */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 1,
                              py: 0.5,
                              borderRadius: 2,
                              backgroundColor: `${getColorTipoTest(resultado.tipo_test)}15`,
                              color: getColorTipoTest(resultado.tipo_test),
                              fontWeight: 600,
                            }}
                          >
                            {getIconoTipoTest(resultado.tipo_test)}
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {getNombreTipoTest(resultado.tipo_test)}
                            </Typography>
                          </Box>
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        {/* --- Información secundaria --- */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.5,
                            color: "#455a64",
                          }}
                        >
                          {/* Fecha */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <CalendarToday sx={{ fontSize: 18, color: "#5c6bc0" }} />
                            <Typography variant="body2">
                              {new Date(resultado.fecha_aplicacion).toLocaleDateString("es-MX", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </Typography>
                          </Box>

                          {/* Puntaje */}
                          {resultado.puntaje && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <BarChartIcon sx={{ fontSize: 18, color: "#5c6bc0" }} />
                              <Typography variant="body2">
                                Puntaje: <strong>{resultado.puntaje}</strong>
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* --- Resultado visual --- */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            mt: 2,
                            borderRadius: "20px",
                            backgroundColor: `${getColorResultado(resultado.categ_resultado)}15`,
                            color: getColorResultado(resultado.categ_resultado),
                            px: 2.5,
                            py: 1,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            boxShadow: `0 2px 6px ${getColorResultado(resultado.categ_resultado)}30`,
                          }}
                        >
                          {getIconoResultado(resultado.categ_resultado)}
                          <Typography variant="body2">
                            {getNombreResultado(resultado.categ_resultado)}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>

                  ))}
                </Box>
              </Box>
            </Tooltip>
          ) : (
            <Box sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Detalle del test realizado de forma física
                </Typography>
                <Divider sx={{ width: "80%" }} />

                <Box sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  mt: 3,
                }}
                >
                  {/* Información del paciente */}
                  <Card sx={{
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
                  }}>
                    <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                      <PeopleAltIcon sx={{ color: "#092181" }} />
                      <Typography variant="h6" fontWeight="bold" sx={{ color: "#092181" }}>
                        Información del paciente
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3, color: "#355C7D" }} />
                    <InfoItem
                      icon={<Person />}
                      label="Paciente"
                      value={ResultadosTestSeleccionado.nombrePaciente}
                    />
                  </Card>
                  {/* Información de la Actividad */}
                  <Card sx={{
                    flex: 2,
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
                    minWidth: { xs: "100%", md: "400px" }
                  }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        mt: 2,
                        justifyContent: "space-between",
                      }}
                    >


                      {[
                        ["tipo_test", "Tipo del test realizado"],
                        ["fecha_aplicacion", "Fecha en que se realizo"],
                        ["puntaje", "¿Cuál fue el puntaje obtenido?"],
                        ["categ_resultado", "¿En que categoria se encuentra?"],
                        ["interpretacion", "¿Cómo se interpreta?"],
                        ["recomendacion", "¿Qué recomienda?"]
                      ].map(([key, label]) => {
                        // Detectar si se trata de un campo especial que requiere un select
                        const isSelect = ["tipo_test", "categ_resultado"].includes(key);
                        const isEditableField = ["tipo_test", "puntaje", "categ_resultado", "interpretacion", "recomendacion"].includes(key);
                        const isDateField = ["fecha_aplicacion"].includes(key);
                        // Obtener las opciones según el campo
                        let options = {};
                        if (key === "tipo_test") options = TipoTest;
                        if (key === "categ_resultado") options = resultadoMap;
                        const value = ResultadosTestSeleccionado[key];
                        return (
                          <Box
                            key={key}
                            sx={{
                              flex: "1 1 48%",
                              minWidth: "250px",
                            }}
                          >
                            {isSelect ? (
                              <FormControl
                                fullWidth
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
                                <InputLabel>{label}</InputLabel>
                                <Select
                                  value={value ?? ""}
                                  label={label}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const parsedValue =
                                      key === "categ_resultado" || key === "puntaje" || key === "tipo_test"
                                        ? Number(val) 
                                        : val;

                                    setResultadosTestSeleccionado({
                                      ...ResultadosTestSeleccionado,
                                      [key]: parsedValue,
                                    });
                                  }}
                                >
                                  {(options || []).map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>
                                      <ListItemIcon>
                                        <Box sx={{ color: opt.color }}>{opt.icono}</Box>
                                      </ListItemIcon>
                                      <Typography sx={{ color: opt.color }}>
                                        {opt.nombre}
                                      </Typography>
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>

                            ) : (
                              <TextField
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
                                label={label}
                                type="text"
                                value={
                                  isDateField && value ? new Date(value).toISOString().split('T')[0] : value || ""
                                }
                                onChange={(e) =>
                                  setResultadosTestSeleccionado({
                                    ...ResultadosTestSeleccionado,
                                    [key]: e.target.value,
                                  })
                                }
                                disabled={!isEditableField}
                              />
                            )}
                          </Box>
                        );

                      })}
                    </Box>
                  </Card>
                </Box>
              </Box>


              <Box sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mt: 4,
                pt: 3,
                borderTop: "1px solid #E0E0E0",
                justifyContent: "flex-end",
              }}>
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
                  Actualizar
                </Button>

                <Button
                  variant="outlined" color="error"
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

                <Button variant="outlined" onClick={() => setResultadosTestSeleccionado(null)}
                  startIcon={<CancelIcon />}
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
            </  Box>

          )}
        </Paper>

        {/*  Snackbar con Alert */}
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
        {/* ANIMATE PRESENCE PARA ANIMACIONES */}
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
                    ¿Estás seguro de que quieres eliminar este resultado de test?
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
                <CheckCircle
                  sx={{ color: "#2E7D32", fontSize: 60, mb: 2 }}
                />
                <Typography variant="h6" sx={{ color: "#092181", fontWeight: 600 }}>
                  Resultado de test eliminado correctamente
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
