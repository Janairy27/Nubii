import React, { useState, useEffect, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  format,
  parseISO,
  isWithinInterval,
  eachDayOfInterval,
} from "date-fns";
import axios from "axios";
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
} from "chart.js";
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
import AddCircleIcon from "@mui/icons-material/AddCircle";

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

const LineaTiempo = () => {
  const [idUsuario, setIdUsuario] = useState(null);
  const [idPaciente, setIdPaciente] = useState(null);
  const [Nombre, setNombre] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [emocion, setEmocion] = useState(null);
  const [intensidad, setIntensidad] = useState(null);
  const [comentario, setComentario] = useState("");
  const [range, setRange] = useState("semanal");
  const [historial, setHistorial] = useState([]);
  const [datasetsMap, setDatasetsMap] = useState([]);
  const navigate = useNavigate();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [open, setOpen] = useState(false); //Para abrir el formulario de registro
  const [openG, setOpenG] = useState(false); //Para abrir la gráfica

  const [formData, setFormData] = useState({
    fecha_inicio: "",
    fecha_fin: "",
    emocion_predom: "",
    prom_intensidad: "",
    comentario: "",
  });

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

  // Cargar historial desde el backend
  const fetchHistorial = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/historial/obtener-historial/${idPaciente}`
      );
      setHistorial(response.data);
    } catch (error) {
      console.error("Error al obtener historial:", error);
    }
  };

  /* const fetchSintoma = async () => {
     try {
       const response = await axios.get(`http://localhost:4000/api/historial/obtener-sintoma/${idPaciente}`);
       setHistorial(response.data);
     } catch (error) {
       console.error('Error al obtener sintoma:', error);
     }
   };*/

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      idPaciente,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      emocion_predom: emocion,
      prom_intensidad: intensidad,
      comentario,
    };

    console.log("Enviando data:", data);

    axios
      .post("http://localhost:4000/api/historial/registro-historial", data)
      .then(() => {
        fetchHistorial();
        setFechaInicio("");
        setFechaFin("");
        setEmocion("");
        setIntensidad("");
        setComentario("");
        setOpen(false);
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error("Error al registrar historial:", err);
      });

    setOpenSnackbar(true);
  };

  useEffect(() => {
    if (idPaciente) {
      fetchHistorial();
    }
  }, [idPaciente]);

  const expandHistorial = (historial) => {
    let expanded = [];

    historial.forEach((entry) => {
      if (!entry.fecha_inicio || !entry.fecha_fin) {
        console.warn("Registro con fechas inválidas:", entry);
        return;
      }
      const start = parseISO(entry.fecha_inicio);
      const end = parseISO(entry.fecha_fin);

      const dias = eachDayOfInterval({ start, end });

      dias.forEach((dia) => {
        expanded.push({
          fecha: dia,
          emocion: entry.emocion_predom,
          intensidad: entry.prom_intensidad,
          comentario: entry.comentario,
        });
      });
    });

    console.log("Datos expandidos:", expanded);
    return expanded;
  };

  // Filtrar historial por rango
  const filteredData = useMemo(() => {
    if (!historial.length) return [];

    const now = new Date();
    let startDate;

    switch (range) {
      case "semanal":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "quincenal":
        startDate = new Date(now.setDate(now.getDate() - 14));
        break;
      case "mensual":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
    }

    const expanded = expandHistorial(historial);

    return expanded.filter(
      (entry) =>
        entry.fecha instanceof Date &&
        !isNaN(entry.fecha) &&
        isWithinInterval(entry.fecha, {
          start: startDate,
          end: new Date(),
        })
    );
  }, [historial, range]);

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
        startDate = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
        break;
      default:
        startDate = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
    }

    const days = eachDayOfInterval({ start: startDate, end: new Date() });
    const dayLabels = days.map((d) => format(d, "dd/MM"));

    // Agrupar intensidades por emoción y día
    const grouped = {};

    days.forEach((day) => {
      const dayKey = format(day, "dd/MM");
      grouped[dayKey] = {};
      Object.keys(emocionMap).forEach((emocionId) => {
        grouped[dayKey][emocionId] = null;
      });
    });

    filteredData.forEach((entry) => {
      const dayKey = format(entry.fecha, "dd/MM");
      const emocionId = entry.emocion;

      if (!grouped[dayKey]) return;

      grouped[dayKey][emocionId] = entry.intensidad;
    });

    const datasets = Object.keys(emocionMap).map((emocionId, index) => {
      const data = dayLabels.map((day) => grouped[day]?.[emocionId] ?? null);
      const color = emocionColors[index % emocionColors.length];

      return {
        label: emocionMap[emocionId]?.label || "Desconocido",
        data,
        backgroundColor: color,
      };
    });

    return {
      labels: dayLabels,
      datasets,
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
        title: {
          display: true,
          text: "Intensidad",
          font: { size: 14, weight: "bold" },
        },
        ticks: { stepSize: 1 },
        grid: { color: "#e0e0e0" },
      },
      x: {
        title: {
          display: true,
          text: "Fecha",
          font: { size: 14, weight: "bold" },
        },
        grid: { color: "#f5f5f5" },
      },
    },
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
        <InputLabel>Rango</InputLabel>
        <Select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          label="Rango"
        >
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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

      {/* Formulario con toggle */}
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
        <Button
          variant="contained"
          color={open ? "error" : "primary"}
          endIcon={open ? <ExpandLess /> : <ExpandMore />}
          onClick={() => setOpen(!open)}
          fullWidth
          sx={{
            width: "100%",
            maxWidth: "400px",
            borderRadius: 2,
            fontWeight: 600,
            textTransform: "none",
            mb: open ? 2 : 0,
          }}
        >
          {open ? "Cerrar formulario" : "Registrar estado"}
        </Button>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              mb: 2,
              textAlign: "center",
              color: "#1976d2",
            }}
          >
            Registrar Estado
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              overflow: "visible",
            }}
          >
            <TextField
              label="Paciente"
              value={Nombre}
              disabled
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
              variant="outlined"
              size="small"
            />

            <TextField
              name="fechaInicio"
              label="Fecha de inicio"
              type="date"
              required
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              InputLabelProps={{ shrink: true }}
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
            />

            <TextField
              name="fechaFin"
              label="Fecha de fin"
              type="date"
              required
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              InputLabelProps={{ shrink: true }}
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
            />

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
              size="small"
            >
              <InputLabel>Emoción predominante</InputLabel>
              <Select
                name="emocion"
                value={emocion}
                onChange={(e) => setEmocion(e.target.value)}
                label="Emoción predominante"
                sx={{
                  borderRadius: 2,
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                  },
                }}
              >
                {Object.entries(emocionMap).map(([k, v], index) => {
                  const IconComponent = v.icon;
                  const color = emocionColors[index % emocionColors.length];
                  return (
                    <MenuItem key={k} value={Number(k)}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          color,
                        }}
                      >
                        <Tooltip title={v.label}>
                          <IconComponent fontSize="small" sx={{ color }} />
                        </Tooltip>
                        <Typography
                          variant="body2"
                          sx={{ color: "#424242", fontWeight: 500 }}
                        >
                          {v.label}
                        </Typography>
                      </Box>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <TextField
              type="number"
              name="intensidad"
              label="Intensidad"
              value={intensidad}
              onChange={(e) => setIntensidad(Number(e.target.value))}
              required
              size="small"
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
            />

            <TextField
              name="comentario"
              label="Comentario"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              multiline
              rows={3}
              size="small"
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
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 1,
                mt: 1,
                pt: 3,
                //borderTop: "1px solid #E0E0E0",
                justifyContent: "center",
              }}
            >
              <Button
                type="submit"
                startIcon={<AddCircleIcon />}
                variant="contained"
                color="success"
                sx={{
                  width: "100%",
                  maxWidth: "300px",
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
                Agregar
              </Button>
            </Box>
          </Box>
        </Collapse>
      </Box>
    </Paper>
  );
};

export default LineaTiempo;
