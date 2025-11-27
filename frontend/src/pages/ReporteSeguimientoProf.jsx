import React, { useState, useEffect, useMemo } from "react";
import Layout from "../components/LayoutProf";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { format } from "date-fns";

import {
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  TextField,
  Button,
  Grid,
  Box,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  useTheme,
  Card,
  Container,
  Alert,
  Snackbar,
} from "@mui/material";
import { FilterList } from "@mui/icons-material";
import PieChartIcon from "@mui/icons-material/PieChart";
import MoodIcon from "@mui/icons-material/Mood";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import StarIcon from "@mui/icons-material/Star";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import PetsIcon from "@mui/icons-material/Pets";
import PsychologyIcon from "@mui/icons-material/Psychology";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

import MoodBadIcon from "@mui/icons-material/MoodBad";
import StressManagementIcon from "@mui/icons-material/Spa";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import DateRangeIcon from "@mui/icons-material/DateRange";
import SearchIcon from "@mui/icons-material/Search";
import TableViewIcon from "@mui/icons-material/TableView";

import GroupsIcon from "@mui/icons-material/Groups";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ReporteSeguimientoProf() {
  const theme = useTheme();
  const [idUsuario, setIdUsuario] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [idProfesional, setIdProfesional] = useState(null);
  const [Nombre, setNombre] = useState("");

  const [idPaciente, setIdPaciente] = useState(null);
  const [pacientes, setPacientes] = useState([]);

  const [nombrePaciente, setNombrePaciente] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [emocionPred, setEmocionPred] = useState(null);
  const [intensidadPredMin, setIntensidadPredMin] = useState(null);
  const [intensidadPredMax, setIntensidadPredMax] = useState(null);
  const [tipoTest, setTipoTest] = useState("");
  const [tipoReporte, setTipoReporte] = useState("diario");
  const [reportData, setReportData] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensaje, setMensajeSnackbar] = useState("");
  const [tipo, setTipoSnackbar] = useState("success");

  const mostrarMensaje = (msg, severity = "info") => {
    setMensajeSnackbar(msg);
    setTipoSnackbar(severity);
    setOpenSnackbar(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const [filtrosActivos, setFiltrosActivos] = useState({
    paciente: false,
    fecha: false,
    emocion: false,
    intensidad: false,
    tipoTest: false,
    tipoReporte: false,
  });

  const filtros = {
    idPaciente,
    fechaInicio: fechaInicio,
    fechaFin: fechaFin,
    emocionPredominante: emocionPred,
    intensidadMinima: intensidadPredMin,
    intensidadMaxima: intensidadPredMax,
    tipoTest,
    tipoTest: tipoTest,
  };

  // Map de emociones con iconos
  const emocionMap = {
    1: { label: "Ansiedad Generalizada", icon: WarningAmberIcon },
    2: { label: "Ataque de Pánico", icon: FlashOnIcon },
    3: { label: "Inquietud", icon: SentimentNeutralIcon },
    4: { label: "Evitación", icon: BedtimeIcon },
    5: { label: "Estrés Agudo", icon: WhatshotIcon },
    6: { label: "Irritabilidad", icon: SentimentDissatisfiedIcon },
    7: { label: "Agobio", icon: SentimentVeryDissatisfiedIcon },
    8: { label: "Tensión Muscular", icon: FitnessCenterIcon },
    9: { label: "Tristeza Persistente", icon: SentimentVeryDissatisfiedIcon },
    10: { label: "Apatía", icon: MoodIcon },
    11: { label: "Desesperanza", icon: SentimentVeryDissatisfiedIcon },
    12: { label: "Fatiga Crónica", icon: AcUnitIcon },
    13: { label: "Problemas de Sueño", icon: BedtimeIcon },
    14: { label: "Cambios Apetito", icon: PetsIcon },
    15: { label: "Dificultad Concentración", icon: StarIcon },
    16: { label: "Síntomas Somáticos", icon: PsychologyIcon },
  };

  const emocionColors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#E7E9ED",
    "#A3A847",
    "#C94E4E",
    "#6C757D",
    "#007BFF",
    "#28A745",
    "#17A2B8",
    "#FFC107",
    "#DC3545",
    "#343A40",
  ];
  // Map de emociones completo (Icono + Color)
  const fullEmocionMap = useMemo(() => {
    return Object.entries(emocionMap).reduce((acc, [id, data], index) => {
      acc[id] = {
        ...data,
        color: emocionColors[index % emocionColors.length], // Asigna un color de la lista
        id: Number(id),
      };
      return acc;
    }, {});
  }, [emocionMap]);

  const TipoTest = useMemo(
    () => [
      {
        value: 1,
        nombre: "GAD-7",
        icono: <PsychologyIcon />,
        color: "#42a5f5",
      },
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
      {
        value: 6,
        nombre: "CES-D",
        icono: <PsychologyIcon />,
        color: "#ab47bc",
      },
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
    ],
    []
  );

  const testMap = useMemo(() => {
    return TipoTest.reduce((acc, test) => {
      acc[test.value] = test;
      return acc;
    }, {});
  }, [TipoTest]);

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
      icono: <SentimentSatisfiedIcon />,
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

  // Map de resultados por id para acceso rápido
  const resultadoMapById = useMemo(() => {
    return resultadoMap.reduce((acc, resultado) => {
      acc[resultado.value] = resultado;
      return acc;
    }, {});
  }, [resultadoMap]);

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
          setTipoUsuario(profesional.tipo_usuario);
        })
        .catch((err) => {
          console.error("Error al obtener idProfesional:", err);
        });
    }
  }, []);

  const obtenerPacientes = () => {
    axios
      .get(`http://localhost:4000/api/citas/pacientes/${idProfesional}`)
      .then((res) => setPacientes(res.data))
      .catch((err) => console.log("Error al obtener pacientes", err));
  };

  useEffect(() => {
    if (idProfesional) {
      obtenerPacientes();
    }
  }, [idProfesional]);

  useEffect(() => {
    if (idProfesional) {
      fetchReport();
    }
  }, [idProfesional]);

  const fetchReport = async () => {
    if (!idProfesional)
      return mostrarMensaje("No se ha encontrado el profesional.");
    setReportData([]);
    const params = { idProfesional };

    if (filtrosActivos.paciente && idPaciente) params.idPaciente = idPaciente;
    if (filtrosActivos.fecha && fechaInicio && fechaFin) {
      params.fechaInicio = fechaInicio;
      params.fechaFin = fechaFin;
    }
    if (filtrosActivos.emocion && emocionPred) params.emocionPred = emocionPred;
    if (filtrosActivos.intensidad) {
      if (intensidadPredMin) params.intensidadPredMin = intensidadPredMin;
      if (intensidadPredMax) params.intensidadPredMax = intensidadPredMax;
    }
    if (filtrosActivos.tipoTest && tipoTest) params.tipoTest = tipoTest;
    if (filtrosActivos.tipoReporte && tipoReporte)
      params.tipoReporte = tipoReporte;

    try {
      const res = await axios.get(
        `http://localhost:4000/api/repSeguimiento/info-seguimiento-pacientes`,
        { params }
      );

      if (res.data.length === 0) {
        mostrarMensaje(
          " No hay información disponible  en el rango seleccionado.",
          "warning"
        );
      }
      setReportData(res.data);
      console.log("report dta:", res.data);
    } catch (error) {
      console.error("Error al obtener el reporte:", error);
      mostrarMensaje("Error al cargar los datos del reporte.", "error");
    }
  };

  const exportPDF = async () => {
    try {
      if (reportData.length === 0)
        return mostrarMensaje("Primero genera el reporte.");

      // Obtener imagen del gráfico
      const chartCanvas = document.querySelector("canvas");
      const grafico = chartCanvas ? chartCanvas.toDataURL("image/png") : null;
      if (!grafico)
        console.warn(
          "No se encontró el canvas para generar la imagen del gráfico"
        );

      const res = await axios.post(
        `http://localhost:4000/api/repSeguimiento/pdf`,
        { tipoUsuario: 2, datos: reportData, grafico },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Reporte_Seguimiento.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      mostrarMensaje("Reporte exportado a PDF  correctamente.", "success");
    } catch (error) {
      console.error("Error al exportar PDF:", error);
      mostrarMensaje("Error al generar el PDF.", "error");
    }
  };

  // Agrupar datos por tipo de test para graficar
  const chartData = useMemo(() => {
    if (!reportData.length) return { labels: [], datasets: [] };

    const categorias = [
      ...new Set(reportData.map((item) => item.categoria_test)),
    ];

    const promedioIntensidad = categorias.map((cat) => {
      const items = reportData.filter((item) => item.categoria_test === cat);
      const sum = items.reduce(
        (acc, cur) => acc + Number(cur.promedio_intensidad_emocional),
        0
      );
      return items.length ? (sum / items.length).toFixed(2) : 0;
    });

    const ultimoTest = categorias.map((cat) => {
      const items = reportData.filter((item) => item.categoria_test === cat);
      const sum = items.reduce((acc, cur) => acc + Number(cur.puntaje_test), 0);
      return items.length ? (sum / items.length).toFixed(2) : 0;
    });

    return {
      labels: categorias,
      datasets: [
        {
          label: "Promedio Intensidad Emocional",
          data: promedioIntensidad,
          backgroundColor: categorias.map(
            (cat) => testMap[cat]?.color || "#42A5F5"
          ),
        },
        {
          label: "Último Test (promedio)",
          data: ultimoTest,
          backgroundColor: categorias.map((cat) =>
            testMap[cat]?.color ? `${testMap[cat].color}B0` : "#FFA726B0"
          ),
        },
      ],
    };
  }, [reportData, testMap]);

  // Opciones del gráfico
  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Promedio de Puntaje por Tipo de Test" },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            //Configuración del título del eje Y
            display: true,
            text: "Puntaje Promedio Obtenido",
          },
        },
        x: {
          title: {
            //Configuración del título del eje X
            display: true,
            text: "Categoría",
          },
        },
      },
    }),
    []
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
              p: { xs: 2, sm: 3 },
              display: "flex",
              flexDirection: "column",
              gap: 3,
              maxWidth: "1200px",
              mx: "auto",
              width: "100%",
            }}
          >
            {/* Header */}
            <Box
              ox
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flex: 1,
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <PieChartIcon
                sx={{
                  color: "#092181",
                  fontSize: 36,
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  color: "#092181",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                {" "}
                Reporte de seguimiento emocional en pacientes
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography variant="subtitle1">
                <strong>Profesional:</strong> {Nombre || "Cargando..."}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Paciente:</strong>{" "}
                {idPaciente
                  ? pacientes.find((p) => p.idPaciente === idPaciente)
                      ?.nombrePaciente
                  : "Todos los pacientes"}
              </Typography>
            </Box>

            {/* Filtros */}
            <Card
              sx={{
                p: 3,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: 3,
                boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                flexWrap: "wrap",
                backgroundColor: "#f9fbff",
                border: "1px solid #dbe3ff",
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
                  Selecciona filtros:
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
                  <FormControl
                    size="small"
                    sx={{
                      minWidth: 160,
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
                  >
                    <InputLabel>Paciente</InputLabel>
                    <Select
                      value={idPaciente ?? ""}
                      onChange={(e) => setIdPaciente(Number(e.target.value))}
                      label="Paciente"
                    >
                      <MenuItem value="">Todos</MenuItem>
                      {pacientes.map((p) => (
                        <MenuItem key={p.idPaciente} value={p.idPaciente}>
                          {p.nombrePaciente}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {filtrosActivos.fecha && (
                  <>
                    <TextField
                      sx={{
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
                      type="date"
                      label="Fecha inicio"
                      InputLabelProps={{ shrink: true }}
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                    />

                    <TextField
                      sx={{
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
                      type="date"
                      label="Fecha fin"
                      InputLabelProps={{ shrink: true }}
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                    />
                  </>
                )}

                {filtrosActivos.emocion && (
                  <FormControl
                    size="small"
                    sx={{
                      minWidth: 160,
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
                  >
                    <InputLabel>Emoción</InputLabel>
                    <Select
                      value={emocionPred ?? ""}
                      onChange={(e) => setEmocionPred(Number(e.target.value))}
                      label="Emoción"
                    >
                      {Object.entries(fullEmocionMap).map(([id, emo]) => (
                        <MenuItem key={id} value={id}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              color: emo.color,
                            }}
                          >
                            {React.createElement(emo.icon, {
                              sx: { fontSize: 20 },
                            })}
                            {emo.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {filtrosActivos.intensidad && (
                  <>
                    <TextField
                      fullWidth
                      label="Intensidad mínima"
                      type="number"
                      value={intensidadPredMin || ""}
                      onChange={(e) => setIntensidadPredMin(e.target.value)}
                      sx={{
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
                      fullWidth
                      label="Intensidad máxima"
                      type="number"
                      value={intensidadPredMax || ""}
                      onChange={(e) => setIntensidadPredMax(e.target.value)}
                      sx={{
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
                  </>
                )}

                {filtrosActivos.tipoTest && (
                  <FormControl
                    size="small"
                    sx={{
                      minWidth: 160,
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
                  >
                    <InputLabel>Tipo de test realizado</InputLabel>
                    <Select
                      value={tipoTest ?? ""}
                      onChange={(e) => setTipoTest(e.target.value)}
                      label="Tipo de test realizado"
                    >
                      <MenuItem value="">Todos</MenuItem>
                      {TipoTest.map((test) => (
                        <MenuItem key={test.value} value={test.nombre}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              color: test.color,
                            }}
                          >
                            {React.createElement(test.icono, {
                              sx: { fontSize: 20 },
                            })}
                            {test.nombre}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {filtrosActivos.tipoReporte && (
                  <FormControl
                    size="small"
                    sx={{
                      minWidth: 160,
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
                  >
                    <InputLabel>Tipo de reporte</InputLabel>
                    <Select
                      value={tipoReporte}
                      onChange={(e) => setTipoReporte(e.target.value)}
                      label="Tipo de reporte"
                    >
                      <MenuItem value="diario">
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CalendarTodayIcon sx={{ color: "#4CAF50" }} />
                          <Typography>Diario</Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem value="semanal">
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <EventAvailableIcon sx={{ color: "#2196F3" }} />
                          <Typography>Semanal</Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem value="mensual">
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <DateRangeIcon sx={{ color: "#FF9800" }} />
                          <Typography>Mensual</Typography>
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                )}
              </Box>

              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={fetchReport}
                sx={{
                  minWidth: 150,
                  textTransform: "none",
                  background: "#092181",
                  "&:hover": { background: "#1c3cc9" },
                  borderRadius: 2,
                }}
              >
                Generar
              </Button>

              <Button
                variant="outlined"
                color="error"
                onClick={exportPDF}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 2.5,
                }}
              >
                <Box
                  component="img"
                  src="/pdf-file-svgrepo-com.svg" // Ruta estática desde /public
                  alt="Exportar a Excel"
                  sx={{
                    width: 24, // Tamaño del icono
                    height: 24,
                    // Este filtro CSS fuerza el color del icono a ser el verde del botón.
                    //filter: "invert(46%) sepia(87%) saturate(368%) hue-rotate(113deg) brightness(97%) contrast(93%)",
                  }}
                />
                PDF
              </Button>
            </Card>

            {reportData.length > 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Card
                  sx={{
                    p: 3,
                    flexDirection: "column",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    borderRadius: "20px",
                    border: "1px solid #dbe3ff",
                    backgroundColor: "#f9fbff",
                    width: "94%",
                    //minHeight: "260px",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 10px 24px rgba(9,33,129,0.15)",
                      borderColor: "#092181",
                    },
                    overflowX: "auto",
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <TableViewIcon sx={{ color: "#092181", fontSize: 28 }} />
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ color: "#092181" }}
                    >
                      Vista previa del reporte
                    </Typography>
                  </Box>
                  <Table
                    sx={{
                      minWidth: 1000,
                      borderCollapse: "separate",
                      borderSpacing: "0 12px",
                      width: "100%",
                      tableLayout: "fixed",
                    }}
                  >
                    <TableHead sx={{ backgroundColor: "#e8f0fe" }}>
                      <TableRow>
                        {[
                          "Paciente",
                          "Fecha último test",
                          "Total síntomas",
                          "Promedio intensidad",
                          "Emoción predominante",
                          "Promedio historial",
                          "Nivel dominante",
                          "Último test",
                          "Puntaje test",
                          "Categoría test",
                        ].map((head) => (
                          <TableCell
                            key={head}
                            align="center"
                            sx={{
                              fontWeight: "bold",
                              color: theme.palette.primary.main,
                            }}
                          >
                            {head}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportData.map((row, index) => {
                        const emo = fullEmocionMap[row.emocion_predominante];

                        const idTest = Number(row.ultimo_test);

                        const ultimoT = TipoTest.find(
                          (m) => m.value === idTest
                        );

                        const categoriaTes = resultadoMap.find(
                          (m) =>
                            m.value === row.idCategResul ||
                            m.value === row.categoria_test
                        );

                        return (
                          <TableRow
                            key={index}
                            sx={{
                              backgroundColor: "#ffffff",
                              borderRadius: "12px",
                              transition: "all 0.3s ease", // Transición más suave
                              "&:hover": {
                                // Un color de hover sutil o un ligero azul/gris
                                backgroundColor: "#f0f8ff", // Azul muy claro al hacer hover
                                cursor: "pointer",
                              },
                            }}
                          >
                            <TableCell>{row.nombrePaciente}</TableCell>
                            <TableCell align="center">
                              {row.fecha_ultimo_test
                                ? format(
                                    new Date(row.fecha_ultimo_test),
                                    "yyyy-MM-dd"
                                  )
                                : "—"}
                            </TableCell>
                            <TableCell align="center">
                              {row.total_sintomas}
                            </TableCell>
                            <TableCell align="center">
                              {row.promedio_intensidad_emocional}
                            </TableCell>
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  color: emo?.color || "#333",
                                  justifyContent: "center", // Centra horizontalmente el contenido de Box
                                }}
                              >
                                {emo?.icon &&
                                  React.createElement(emo.icon, {
                                    sx: { fontSize: 20 },
                                  })}
                                {emo?.label || row.emocion_predominante}
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              {row.intensidad_prom_historial}
                            </TableCell>
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  color: categoriaTes?.color || "#333",
                                  justifyContent: "center",
                                }}
                              >
                                {categoriaTes?.icono}
                                {categoriaTes?.nombre ||
                                  row.nivel_dominante_historial}
                              </Box>
                            </TableCell>

                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  color: ultimoT?.color || "#333",
                                  justifyContent: "center",
                                }}
                              >
                                {ultimoT?.icono}
                                {ultimoT?.nombre || row.ultimo_test}
                              </Box>
                            </TableCell>

                            <TableCell align="center">
                              {row.puntaje_test}
                            </TableCell>

                            {/* 🚨 Corrección: Mostrar Categoría Test con su color/icono */}
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  color: categoriaTes?.color || "#333",
                                  justifyContent: "center",
                                }}
                              >
                                {categoriaTes?.icono}
                                {categoriaTes?.nombre || row.categoria_test}
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Card>
                <Card
                  sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    borderRadius: "20px",
                    border: "1px solid #dbe3ff",
                    backgroundColor: "#f9fbff",
                    width: "94%",
                    //minHeight: "260px",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 10px 24px rgba(9,33,129,0.15)",
                      borderColor: "#092181",
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: { xs: 300, sm: 400 },
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Bar data={chartData} options={chartOptions} />
                  </Box>
                </Card>
              </Box>
            ) : (
              <Card sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
                <Typography color="text.secondary">
                  No hay datos para mostrar. Selecciona un rango de fechas y
                  genera el reporte.
                </Typography>
              </Card>
            )}
          </Box>
        </Paper>
        {/* Snackbar para mensajes */}
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
      </Container>
    </Layout>
  );
}
