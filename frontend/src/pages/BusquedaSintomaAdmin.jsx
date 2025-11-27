import React, { useEffect, useState } from "react";
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
  CardContent,
  Chip,
  Snackbar,
  Tooltip,
  Divider,
  ListItemIcon,
  ListItemText,
  Checkbox,
  FormControlLabel,
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
  RestartAlt,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InsightsIcon from "@mui/icons-material/Insights";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import PlaceIcon from "@mui/icons-material/Place";
import WorkIcon from "@mui/icons-material/Work";
import PublicIcon from "@mui/icons-material/Public";

const BusquedaSintoma = () => {
  const [idUsuario, setIdUsuario] = useState("");
  const [idProfesional, setIdProfesional] = useState(null);
  const [nombrePaciente, setNombrePaciente] = useState("");
  const [idPaciente, setIdPaciente] = useState(null);
  const [sintoma, setSintoma] = useState([]);
  const [filtrosActivos, setFiltrosActivos] = useState({
    nombre: false,
    estres: false,
    fecha: false,
    emocion: false,
    intensidad: false,
    clima: false,
  });

  const [valoresFiltro, setValoresFiltro] = useState({
    nombre: "",
    estres: "",
    fecha: "",
    emocion: "",
    intensidad: "",
    clima: "",
  });

  const [sintomaSeleccionado, setSintomaSeleccionado] = useState(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensajeSnackbar, setMensajeSnackbar] = useState("");
  const [tipoSnackbar, setTipoSnackbar] = useState("success");

  const navigate = useNavigate();

  const emocionMap = [
    {
      categoria: "🔴 Ansiedad",
      color: "#ff4444",
      emociones: [
        { id: 1, nombre: "Ansiedad Generalizada", icono: <PsychologyIcon /> },
        { id: 2, nombre: "Ataque de Pánico", icono: <MoodBadIcon /> },
        { id: 3, nombre: "Inquietud", icono: <HourglassEmptyIcon /> },
        { id: 4, nombre: "Evitación", icono: <PsychologyIcon /> },
      ],
    },
    {
      categoria: "🟠 Estrés",
      color: "#ff8800",
      emociones: [
        { id: 5, nombre: "Estrés Agudo", icono: <MoodBadIcon /> },
        { id: 6, nombre: "Irritabilidad", icono: <PsychologyIcon /> },
        { id: 7, nombre: "Agobio", icono: <MoodBadIcon /> },
        { id: 8, nombre: "Tensión Muscular", icono: <HourglassEmptyIcon /> },
      ],
    },
    {
      categoria: "🔵 Depresión",
      color: "#4444ff",
      emociones: [
        { id: 9, nombre: "Tristeza Persistente", icono: <MoodBadIcon /> },
        { id: 10, nombre: "Apatía", icono: <PsychologyIcon /> },
        { id: 11, nombre: "Desesperanza", icono: <MoodBadIcon /> },
        { id: 12, nombre: "Fatiga Crónica", icono: <HourglassEmptyIcon /> },
      ],
    },
    {
      categoria: "🟢 Síntomas Físicos",
      color: "#00aa44",
      emociones: [
        { id: 13, nombre: "Problemas de Sueño", icono: <LocalHotelIcon /> },
        { id: 14, nombre: "Cambios Apetito", icono: <RestaurantIcon /> },
        {
          id: 15,
          nombre: "Dificultad Concentración",
          icono: <PsychologyIcon />,
        },
        { id: 16, nombre: "Síntomas Somáticos", icono: <PsychologyIcon /> },
      ],
    },
  ];

  // Función para encontrar la emoción entre cada grupo
  const findEmocionById = (id) => {
    // Iteramos sobre cada grupo de categorías
    for (const grupo of emocionMap) {
      // Buscamos la emoción dentro del array 'emociones' de ese grupo
      const emocionEncontrada = grupo.emociones.find((e) => e.id === id);

      // Si encontramos la emoción, devolvemos un objeto con todos los datos necesarios
      if (emocionEncontrada) {
        return {
          value: emocionEncontrada.id,
          label: emocionEncontrada.nombre,
          icon: emocionEncontrada.icono,
          color: grupo.color,
        };
      }
    }
    return undefined;
  };

  const climaMap = [
    { value: 1, icon: <WbSunnyIcon />, label: "Soleado", color: "#ffb300" },
    {
      value: 2,
      icon: <WbCloudyIcon />,
      label: "Parc. Nublado",
      color: "#90a4ae",
    },
    { value: 3, icon: <CloudIcon />, label: "Nublado", color: "#607d8b" },
    {
      value: 4,
      icon: <BeachAccessIcon />,
      label: "Lluvioso",
      color: "#2196f3",
    },
    { value: 5, icon: <BlurOnIcon />, label: "Neblina", color: "#bdbdbd" },
    { value: 6, icon: <AirIcon />, label: "Ventoso", color: "#80deea" },
    { value: 7, icon: <AcUnitIcon />, label: "Frío", color: "#29b6f6" },
    { value: 8, icon: <WhatshotIcon />, label: "Cálido", color: "#ff7043" },
    { value: 9, icon: <GrainIcon />, label: "Granizo", color: "#e0e0e0" },
    { value: 10, icon: <OpacityIcon />, label: "Húmedo", color: "#42a5f5" },
    { value: 11, icon: <WbTwilightIcon />, label: "Seco", color: "#8d6e63" },
  ];

  const getNombreEmocion = (id) => {
    const emocion = emocionMap
      .flatMap((grupo) => grupo.emociones)
      .find((emo) => emo.id === Number(id));
    return emocion ? emocion.nombre : `Desconocido (${id})`;
  };

  const getIconoEmocion = (id) => {
    const emocion = emocionMap
      .flatMap((grupo) => grupo.emociones)
      .find((emo) => emo.id === Number(id));
    return emocion ? emocion.icono : null;
  };

  const getColorEmocion = (id) => {
    const grupo = emocionMap.find((grupo) =>
      grupo.emociones.some((emo) => emo.id === Number(id))
    );
    return grupo ? grupo.color : "#666";
  };

  const getNombreClima = (value) => {
    const clima = climaMap.find((c) => c.value === Number(value));
    return clima ? clima.label : `Desconocido (${value})`;
  };

  const getIconoClima = (value) => {
    const clima = climaMap.find((c) => c.value === Number(value));
    return clima ? clima.icon : null;
  };

  const getColorClima = (value) => {
    const clima = climaMap.find((c) => c.value === Number(value));
    return clima ? clima.color : "#666";
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
    obtenersintoma();
  }, []);

  const obtenersintoma = () => {
    axios
      .get(`http://localhost:4000/api/sintomas/by-filter/`)
      .then((res) => {
        setSintoma(res.data);
        setSintomaSeleccionado(null);
      })
      .catch((err) => {
        console.error("Error al cargar sintoma:", err);
        setSintoma([]);
      });
  };

  const handleBuscar = async () => {
    const filtrosAplicados = {};

    if (filtrosActivos.nombre && valoresFiltro.nombre.trim()) {
      filtrosAplicados.nombrePaciente = valoresFiltro.nombre;
    }
    if (filtrosActivos.estres && valoresFiltro.estres.trim()) {
      filtrosAplicados.nivel_estres = valoresFiltro.estres;
    }
    if (filtrosActivos.fecha && valoresFiltro.fecha) {
      filtrosAplicados.fecha = valoresFiltro.fecha;
    }
    if (filtrosActivos.emocion && valoresFiltro.emocion) {
      filtrosAplicados.emocion = valoresFiltro.emocion;
    }
    if (filtrosActivos.intensidad && valoresFiltro.intensidad) {
      filtrosAplicados.intensidad = valoresFiltro.intensidad;
    }
    if (filtrosActivos.clima && valoresFiltro.clima) {
      filtrosAplicados.clima = valoresFiltro.clima;
    }

    if (Object.keys(filtrosAplicados).length === 0) {
      obtenersintoma();
      return;
    }

    const queryParams = new URLSearchParams(filtrosAplicados).toString();

    try {
      const res = await axios.get(
        `http://localhost:4000/api/sintomas/by-filter?${queryParams}`
      );

      if (res.data && res.data.length > 0) {
        setSintoma(res.data);
        setSintomaSeleccionado(null);
        mostrarMensaje("Síntomas encontrados exitosamente.", "success");
      } else {
        mostrarMensaje(
          "No se encontraron síntomas con ese criterio.",
          "warning"
        );
        await obtenersintoma();
      }
    } catch (error) {
      console.error(error);
      mostrarMensaje("Ocurrió un error al buscar los síntomas.", "error");
      await obtenersintoma();
    }
  };

  const handleLimpiarFiltros = () => {
    setFiltrosActivos({
      nombre: false,
      estres: false,
      fecha: false,
      emocion: false,
      intensidad: false,
    });

    setValoresFiltro({
      nombre: "",
      estres: "",
      fecha: "",
      emocion: "",
      intensidad: "",
    });

    obtenersintoma();
  };

  const handleSeleccionar = (sintoma) => {
    setSintomaSeleccionado(sintoma);
  };

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
            <PsychologyIcon
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
              Síntomas Registrados
            </Typography>
          </Box>
          {!sintomaSeleccionado && (
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
                    value={valoresFiltro.nombre}
                    onChange={(e) =>
                      setValoresFiltro({
                        ...valoresFiltro,
                        nombre: e.target.value,
                      })
                    }
                    sx={textFieldEstilo}
                  />
                )}

                {filtrosActivos.estres && (
                  <TextField
                    fullWidth
                    label="Nivel de estrés"
                    type="number"
                    value={valoresFiltro.estres}
                    onChange={(e) =>
                      setValoresFiltro({
                        ...valoresFiltro,
                        estres: e.target.value,
                      })
                    }
                    sx={textFieldEstilo}
                  />
                )}

                {filtrosActivos.fecha && (
                  <TextField
                    fullWidth
                    label="Fecha estimada"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) =>
                      setValoresFiltro({
                        ...valoresFiltro,
                        fecha: e.target.value,
                      })
                    }
                    sx={textFieldEstilo}
                  />
                )}

                {filtrosActivos.emocion && (
                  <FormControl fullWidth sx={textFieldEstilo}>
                    <InputLabel>Emoción padecida</InputLabel>
                    <Select
                      value={valoresFiltro.emocion}
                      onChange={(e) =>
                        setValoresFiltro({
                          ...valoresFiltro,
                          emocion: e.target.value,
                        })
                      }
                      label="Emoción padecida"
                      renderValue={(selectedValue) => {
                        let selectedOption;

                        selectedOption = findEmocionById(selectedValue);

                        if (selectedOption) {
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
                                  color: selectedOption.color,
                                  display: "flex",
                                }}
                              >
                                {selectedOption.icon}
                              </Box>
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 500 }}
                              >
                                {selectedOption.label}
                              </Typography>
                            </Box>
                          );
                        }
                        return "";
                      }}
                    >
                      {emocionMap.flatMap((grupo) =>
                        grupo.emociones.map((emo) => (
                          <MenuItem key={emo.id} value={emo.id}>
                            <ListItemIcon>
                              <Box sx={{ color: grupo.color }}>{emo.icono}</Box>
                            </ListItemIcon>
                            <ListItemText
                              primary={emo.nombre}
                              primaryTypographyProps={{
                                sx: { fontWeight: 500 },
                              }}
                            />
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                )}

                {filtrosActivos.intensidad && (
                  <TextField
                    fullWidth
                    label="Nivel de intensidad"
                    type="number"
                    value={valoresFiltro.intensidad}
                    onChange={(e) =>
                      setValoresFiltro({
                        ...valoresFiltro,
                        intensidad: e.target.value,
                      })
                    }
                    sx={textFieldEstilo}
                  />
                )}

                {filtrosActivos.clima && (
                  <FormControl fullWidth sx={textFieldEstilo}>
                    <InputLabel>Clima</InputLabel>
                    <Select
                      value={valoresFiltro.clima}
                      onChange={(e) =>
                        setValoresFiltro({
                          ...valoresFiltro,
                          clima: e.target.value,
                        })
                      }
                      label="Clima"
                    >
                      {climaMap.map((c) => (
                        <MenuItem key={c.value} value={c.value}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <Box sx={{ color: c.color, fontSize: 20 }}>
                              {c.icon}
                            </Box>
                            {c.label}
                          </Box>
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
          {!sintomaSeleccionado ? (
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
                    <PsychologyIcon sx={{ color: "#0D1B2A", fontSize: 34 }} />
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "bold",
                        color: "#0D1B2A",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {sintoma.length > 0
                        ? "Síntomas registrados"
                        : "No se han registrado síntomas aún"}
                    </Typography>
                  </Box>

                  {/* Contador */}
                  <Chip
                    label={`${sintoma.length} síntoma(s) registrado(s)`}
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
                  {sintoma.map((sintoma) => (
                    <Card
                      key={sintoma.idSintoma}
                      onClick={() => handleSeleccionar(sintoma)}
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
                        {/* Paciente */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <HealthAndSafetyIcon
                            sx={{ color: "#092181", fontSize: 30 }}
                          />
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color: "#12275c",
                              textAlign: "center",
                            }}
                          >
                            {sintoma.nombrePaciente}
                          </Typography>
                        </Box>

                        {/* Nivel de estrés */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <PsychologyIcon
                            sx={{ color: "#F57C00", fontSize: 26 }}
                          />
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              color: "#444",
                            }}
                          >
                            Nivel de estrés: {sintoma.nivel_estres}
                          </Typography>
                        </Box>

                        {/* Emoción */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            py: 0.5,
                            px: 1.5,
                            borderRadius: "12px",
                            backgroundColor: `${getColorEmocion(
                              sintoma.emocion
                            )}15`,
                            color: getColorEmocion(sintoma.emocion),
                            fontWeight: 600,
                          }}
                        >
                          {getIconoEmocion(sintoma.emocion)}
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {getNombreEmocion(sintoma.emocion)}
                          </Typography>
                        </Box>

                        {/* Clima */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            py: 0.5,
                            px: 1.5,
                            borderRadius: "12px",
                            backgroundColor: `${getColorClima(
                              sintoma.clima
                            )}15`,
                            color: getColorClima(sintoma.clima),
                            fontWeight: 600,
                          }}
                        >
                          {getIconoClima(sintoma.clima)}
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {getNombreClima(sintoma.clima)}
                          </Typography>
                        </Box>
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
                Detalle del síntoma
              </Typography>

              <Divider sx={{ width: "60%", mb: 2 }} />

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
                      <PeopleAltIcon sx={{ color: "#092181" }} />
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ color: "#092181" }}
                      >
                        Información del paciente
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />

                    <InfoItem
                      icon={<PersonIcon />}
                      label="Paciente"
                      value={sintomaSeleccionado.nombrePaciente}
                    />
                    <InfoItem
                      icon={<CalendarMonthIcon />}
                      label="Fecha en que padeció"
                      value={new Date(
                        sintomaSeleccionado.fecha
                      ).toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    />
                  </Box>
                </Card>

                {/* Información básica */}
                <Card
                  sx={{
                    flex: "1 1 320px",
                    maxWidth: 400,
                    p: 3,
                    borderRadius: 4,
                    backgroundColor: "#f9f9fc",
                    border: "1px solid #e0e4fa",
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
                      <PsychologyIcon sx={{ color: "#3949ab" }} />
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ color: "#3949ab" }}
                      >
                        Información básica del síntoma
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />

                    {/* Emoción */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                        p: 1.5,
                        borderRadius: 3,
                        backgroundColor: `${getColorEmocion(
                          sintomaSeleccionado.emocion
                        )}20`,
                      }}
                    >
                      <Box
                        sx={{
                          mr: 2,
                          color: getColorEmocion(sintomaSeleccionado.emocion),
                        }}
                      >
                        {getIconoEmocion(sintomaSeleccionado.emocion)}
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Emoción que sintió
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 500,
                            color: getColorEmocion(sintomaSeleccionado.emocion),
                          }}
                        >
                          {getNombreEmocion(sintomaSeleccionado.emocion)}
                        </Typography>
                      </Box>
                    </Box>

                    <InfoItem
                      icon={<InsightsIcon />}
                      label="Intensidad de la emoción"
                      value={sintomaSeleccionado.intensidad}
                    />
                    <InfoItem
                      icon={<ReportProblemIcon />}
                      label="Detonante"
                      value={sintomaSeleccionado.detonante}
                    />
                  </Box>
                </Card>

                {/* Contexto y ambiente */}
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
                      <PublicIcon sx={{ color: "#0277bd" }} />
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ color: "#0277bd" }}
                      >
                        Contexto y ambiente
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />

                    <InfoItem
                      icon={<PlaceIcon />}
                      label="Ubicación"
                      value={sintomaSeleccionado.ubicacion}
                    />

                    {/* Clima */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                        p: 1.5,
                        borderRadius: 3,
                        backgroundColor: `${getColorClima(
                          sintomaSeleccionado.clima
                        )}20`,
                      }}
                    >
                      <Box
                        sx={{
                          mr: 2,
                          color: getColorClima(sintomaSeleccionado.clima),
                        }}
                      >
                        {getIconoClima(sintomaSeleccionado.clima)}
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Clima
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 500,
                            color: getColorClima(sintomaSeleccionado.clima),
                          }}
                        >
                          {getNombreClima(sintomaSeleccionado.clima)}
                        </Typography>
                      </Box>
                    </Box>

                    <InfoItem
                      icon={<WorkIcon />}
                      label="Actividad reciente"
                      value={sintomaSeleccionado.actividadReciente}
                    />
                  </Box>
                </Card>
              </Box>

              {/* botón de acción  */}
              <Box textAlign="center" mt={3}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={() => setSintomaSeleccionado(null)}
                  sx={{
                    borderColor: "#092181",
                    textTransform: "capitalize",
                    color: "#092181",
                    fontWeight: "bold",
                    borderRadius: 3,
                    px: 3,
                    py: 1,
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

export default BusquedaSintoma;
