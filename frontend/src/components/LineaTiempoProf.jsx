import React, { useState, useEffect, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { format, parseISO, isWithinInterval, eachDayOfInterval } from 'date-fns';
import axios from 'axios';
import {
  Typography,
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Divider,
  Tooltip,
  Collapse,
  Dialog,
  IconButton,
} from "@mui/material";

import {
  BarElement,
  TimeScale,
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { useNavigate } from "react-router-dom";

import { ExpandMore, ExpandLess } from "@mui/icons-material";

import MoodIcon from "@mui/icons-material/Mood";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import StarIcon from "@mui/icons-material/Star";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import PetsIcon from "@mui/icons-material/Pets";
import PsychologyIcon from "@mui/icons-material/Psychology";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AddCircleIcon from '@mui/icons-material/AddCircle';

import ZoomInIcon from "@mui/icons-material/ZoomIn";
import CloseIcon from "@mui/icons-material/Close";

ChartJS.register(
  BarElement,
  TimeScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTooltip,
  Legend
);

const emocionMap = {
  1: "Ansiedad Generalizada",
  2: "Ataque de Pánico",
  3: "Inquietud",
  4: "Evitación",
  5: "Estrés Agudo",
  6: "Irritabilidad",
  7: "Agobio",
  8: "Tensión Muscular",
  9: "Tristeza Persistente",
  10: "Apatía",
  11: "Desesperanza",
  12: "Fatiga Crónica",
  13: "Problemas de Sueño",
  14: "Cambios Apetito",
  15: "Dificultad Concentración",
  16: "Síntomas Somáticos"
};


const emocionColors = {
  1: '#FF6384',
  2: '#36A2EB',
  3: '#FFCE56',
  4: '#4BC0C0',
  5: '#9966FF',
  6: '#FF9F40',
  7: '#E7E9ED',
  8: '#A3A847',
  9: '#C94E4E',
  10: '#6C757D',
  11: '#007BFF',
  12: '#28A745',
  13: '#17A2B8',
  14: '#FFC107',
  15: '#DC3545',
  16: '#343A40'
};


const LineaTiempoProf = () => {
  const [idUsuario, setIdUsuario] = useState(null);
  const [idProfesional, setIdProfesional] = useState(null);
  const [Nombre, setNombre] = useState('');

  const [idPaciente, setIdPaciente] = useState(null);
  const [pacientes, setPacientes] = useState([]);

  const [nombrePaciente, setNombrePaciente] = useState("");

  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [emocion, setEmocion] = useState(null);
  const [intensidad, setIntensidad] = useState(null);
  const [comentario, setComentario] = useState('');

  const [range, setRange] = useState('semanal');
  const [historial, setHistorial] = useState([]);
  const navigate = useNavigate();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [open, setOpen] = useState(false); //Para abrir el formulario de registro
  const [openG, setOpenG] = useState(false); //Para abrir la gráfica

  const [formData, setFormData] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    emocion_predom: '',
    prom_intensidad: '',
    comentario: ''
  });

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
      obtenerHistorial();
    }
  }, [idProfesional]);

  const obtenerHistorial = async () => {
    try {
      const res = await axios
        .get(`http://localhost:4000/api/historial/obtener-historialPac/${idProfesional}`)
      setHistorial(res.data);
    } catch (err) {
      console.error('Error al obtener historial:', err);
      setHistorial([]);
    }
  };

  const obtenerPacientes = () => {
    axios.get(`http://localhost:4000/api/citas/pacientes/${idProfesional}`)
      .then((res) => setPacientes(res.data))
      .catch((err) => console.log("Error al obtener pacientes", err));
  };

  useEffect(() => {
    if (idProfesional) {
      obtenerPacientes();
    }
  }, [idProfesional]);

  const expandHistorial = (historial) => {
    let expanded = [];

    historial.forEach(entry => {
      if (!entry.fecha_inicio || !entry.fecha_fin) {
        console.warn("Registro con fechas inválidas:", entry);
        return;
      }
      const start = parseISO(entry.fecha_inicio);
      const end = parseISO(entry.fecha_fin);

      const dias = eachDayOfInterval({ start, end });

      dias.forEach(dia => {
        expanded.push({
          fecha: dia,
          emocion: entry.emocion_predom,
          intensidad: entry.prom_intensidad,
          comentario: entry.comentario
        });
      });
    });

    console.log("Datos expandidos:", expanded);
    return expanded;
  };

  const filteredData = useMemo(() => {
    if (!historial.length) return [];

    const now = new Date();
    let startDate;

    switch (range) {
      case 'semanal':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'quincenal':
        startDate = new Date(now.setDate(now.getDate() - 14));
        break;
      case 'mensual':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
    }

    const historialFiltrado = idPaciente
      ? historial.filter((h) => h.idPaciente === idPaciente) : historial;

    const expanded = expandHistorial(historialFiltrado);

    return expanded.filter(entry =>
      entry.fecha instanceof Date &&
      !isNaN(entry.fecha) &&
      isWithinInterval(entry.fecha, {
        start: startDate,
        end: new Date()
      })
    );
  }, [historial, range, idPaciente]);


  const chartData = useMemo(() => {
    if (filteredData.length === 0) return { labels: [], datasets: [] };

    const now = new Date();
    let startDate;

    switch (range) {
      case "semanal":
        startDate = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000); // 7 días
        break;
      case "quincenal":
        startDate = new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000); // 14 días
        break;
      case "mensual":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      default:
        startDate = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
    }

    const days = eachDayOfInterval({ start: startDate, end: new Date() });
    const dayLabels = days.map((d) => format(d, 'dd/MM'));

    const grouped = {};

    days.forEach((day) => {
      const dayKey = format(day, 'dd/MM');
      grouped[dayKey] = {};
      Object.keys(emocionMap).forEach((emocionId) => {
        grouped[dayKey][emocionId] = null;
      });
    });


    filteredData.forEach((entry) => {
      const dayKey = format(entry.fecha, 'dd/MM');
      const emocionId = entry.emocion;

      if (!grouped[dayKey]) return;

      grouped[dayKey][emocionId] = entry.intensidad;
    });

    const datasets = Object.keys(emocionMap).map((emocionId, index) => {
      const data = dayLabels.map((day) => grouped[day]?.[emocionId] ?? null);
      const color = emocionColors[emocionId] || 'rgba(0,0,0,0.5)'

      return {
        label: emocionMap[emocionId],
        data,
        backgroundColor: color,
      };
    });

    return {
      labels: dayLabels,
      datasets
    };
  }, [filteredData, range]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { boxWidth: 12, padding: 10, font: { size: 12 } },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "#1976d2",
        titleColor: "#fff",
        bodyColor: "#fff",
        titleFont: { weight: "bold" },
        padding: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        title: { display: true, text: "Intensidad", font: { size: 14, weight: "bold" } },
        ticks: { stepSize: 1 },
        grid: { color: "#e0e0e0" },
      },
      x: {
        title: { display: true, text: "Fecha", font: { size: 14, weight: "bold" } },
        grid: { color: "#f5f5f5" },
      },
    },
  };

  return (
    <Paper
      elevation={6}
      sx={{
        p: 3,
        width: "100%",
        maxWidth: 500,
        borderRadius: 3,
        backgroundColor: "rgba(255,255,255,0.98)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
        mx: "auto",
        my: 4,
      }}
    >
      {/* Título principal */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          textAlign: "center",
          color: "#1976d2",
          mb: 1,
        }}
      >
        Seguimiento Emocional
      </Typography>


      <Typography variant="h6" sx={{ mt: 2 }}>
        {idPaciente
          ? `Mostrando historial de: ${pacientes.find(p => p.idPaciente === idPaciente)?.nombrePaciente || "Paciente"
          }`
          : "Mostrando historial de todos los pacientes"}
      </Typography>

      {/* Selector de rango */}
      <FormControl
        size="small"
        sx={{
          width: "100%",
          maxWidth: 400,
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "#FFFFFF",
            "& fieldset": { borderColor: "#CBD4D8" },
            "&:hover fieldset": { borderColor: "#355C7D" },
            "&.Mui-focused fieldset": { borderColor: "#092181", borderWidth: "2px" },
          },
          "& .MuiInputLabel-root": {
            color: "#2D5D7B",
            fontWeight: "bold",
          },
        }}
      >
        <InputLabel>Rango</InputLabel>
        <Select value={range} onChange={(e) => setRange(e.target.value)} label="Rango">
          <MenuItem value="semanal">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarTodayIcon sx={{ color: "#4CAF50" }} />
              <Typography>Semanal</Typography>
            </Box>
          </MenuItem>
          <MenuItem value="quincenal">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <EventAvailableIcon sx={{ color: "#2196F3" }} />
              <Typography>Quincenal</Typography>
            </Box>
          </MenuItem>
          <MenuItem value="mensual">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <DateRangeIcon sx={{ color: "#FF9800" }} />
              <Typography>Mensual</Typography>
            </Box>
          </MenuItem>
        </Select>
      </FormControl>

      {/* Gráfica */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 450,
          borderRadius: 3,
          backgroundColor: "#ffffff",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          p: 2,
          position: "relative",
          cursor: "pointer",
          transition: "transform 0.2s ease",
          "&:hover": { transform: "scale(1.02)" },
        }}
        onClick={() => setOpenG(true)}
      >
        <Tooltip title="Ampliar gráfica">
          <IconButton
            size="small"
            sx={{ position: "absolute", top: 8, right: 8, color: "#1976d2" }}
          >
            <ZoomInIcon />
          </IconButton>
        </Tooltip>
        <Box sx={{ height: 300 }}>

          <Bar data={chartData} options={chartOptions} />
        </Box>
      </Box>
      <Dialog
        open={openG}
        onClose={() => setOpenG(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 3,
            backgroundColor: "#fafafa",
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#1976d2" }}>
            Gráfica Detallada
          </Typography>
          <IconButton onClick={() => setOpenG(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ height: 500 }}>
          <Bar data={chartData} options={chartOptions} />
        </Box>
      </Dialog>

      <Divider sx={{ width: "100%", my: 2 }} />
      <Box
        sx={{
          width: "100%",
          maxWidth: 450,
          borderRadius: 3,
          backgroundColor: "#fff",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          p: 3,
          transition: "all 0.3s ease-in-out",
        }}
      >


        <FormControl sx={{
          width: "100%",
          maxWidth: 400,
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "#FFFFFF",
            "& fieldset": { borderColor: "#CBD4D8" },
            "&:hover fieldset": { borderColor: "#355C7D" },
            "&.Mui-focused fieldset": { borderColor: "#092181", borderWidth: "2px" },
          },
          "& .MuiInputLabel-root": {
            color: "#2D5D7B",
            fontWeight: "bold",
          },
        }}>
          <InputLabel>Selecciona una opción</InputLabel>
          <Select
            name="paciente"
            value={idPaciente ?? "todos"}
            onChange={(e) => {
              const value = e.target.value;
              setIdPaciente(value === "todos" ? null : Number(value))
            }}
            label="paciente"
            required
          >
            <MenuItem value="todos">Todos los pacientes</MenuItem>
            {pacientes.map((p) => (
              <MenuItem key={p.idPaciente} value={p.idPaciente}>
                {p.nombrePaciente}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
};

export default LineaTiempoProf;
