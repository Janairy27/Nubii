import React, { useState, useEffect, useMemo } from 'react';
import Layout from "../components/Layout";
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { format } from 'date-fns';

import {
  Box,
  Typography,
  Paper,
  Button,
  Select,
  MenuItem,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  useTheme,
  Container,
  Card,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
} from "@mui/material";

import PieChartIcon from '@mui/icons-material/PieChart';

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableViewIcon from "@mui/icons-material/TableView";
import SearchIcon from "@mui/icons-material/Search";
import PsychologyIcon from "@mui/icons-material/Psychology";
import MoodBadIcon from "@mui/icons-material/MoodBad";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import LocalHotelIcon from "@mui/icons-material/LocalHotel";
import RestaurantIcon from "@mui/icons-material/Restaurant";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import DateRangeIcon from "@mui/icons-material/DateRange";


import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import TimelineIcon from '@mui/icons-material/Timeline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

export default function ReporteSeguimientoPac() {
  const theme = useTheme();
  const [idUsuario, setIdUsuario] = useState(null);
  const [idPaciente, setIdPaciente] = useState(null);
  const [Nombre, setNombre] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [tipoReporte, setTipoReporte] = useState('diario');
  const [reportData, setReportData] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("success");

  const emocionesSaludMental = [
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
        { id: 15, nombre: "Dificultad Concentración", icono: <PsychologyIcon /> },
        { id: 16, nombre: "Síntomas Somáticos", icono: <PsychologyIcon /> },
      ],
    },
  ];
  const shadeColor = (color, percent) => {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
    const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
    const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
  };

  // Generación de emocionesMap con colores variados
  const emocionesMap = useMemo(() => {
    const map = {};

    emocionesSaludMental.forEach((cat) => {
      cat.emociones.forEach((emo, index) => {
        const variedColor = shadeColor(cat.color, index * -15);

        map[emo.id] = {
          nombre: emo.nombre,
          color: variedColor, 
          icono: emo.icono
        };
      });
    });
    return map;
  }, [emocionesSaludMental]);


  const mostrarMensaje = (msg, severity = "info") => {
    setMensaje(msg);
    setTipo(severity);
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
          setTipoUsuario(paciente.tipo_usuario);
        })
        .catch((err) => {
          console.error("Error al obtener idPaciente:", err);
        });
    }
  }, []);

   useEffect(() => {
    if (idPaciente) {
      fetchReport();
    }
  }, [idPaciente]); 


  const fetchReport = async () => {
    if (!idPaciente) return mostrarMensaje("No se ha encontrado el paciente.", "warning");
    ///if (!fechaInicio || !fechaFin) return mostrarMensaje("Selecciona un rango de fechas.", "warning");
    setReportData([]);

    try {
      const res = await axios.get(`http://localhost:4000/api/repSeguimiento/info-seguimientoPac`, {
        params: {
          idPaciente,
          fechaInicio,
          fechaFin,
          tipoReporte
        }
      });
       if (res.data.length === 0) {
        mostrarMensaje(" No hay información disponible  en el rango seleccionado.", "warning");
      }
      setReportData(res.data);
    } catch (error) {
      console.error('Error al obtener el reporte:', error);
    }
  };

  const exportPDF = async () => {
    try {
      if (reportData.length === 0) return mostrarMensaje("Primero genera el reporte.", "error");

      // Obtener imagen del gráfico
      const chartCanvas = document.querySelector('canvas');
      const grafico = chartCanvas ? chartCanvas.toDataURL('image/png') : null;

      const res = await axios.post(
        `http://localhost:4000/api/repSeguimiento/pdf`,
        { tipoUsuario: 3, datos: reportData, grafico, nombre: Nombre, tipoReporte },
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Reporte_Seguimiento.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      mostrarMensaje("Reporte exportado a PDF exitosamente.", "success");
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      mostrarMensaje("Error al exportar el reporte a PDF.", "error");
    }
  };

  const PALETA_DISTINTIVA = [
    '#42A5F5', '#66BB6A', '#FFA726', '#AB47BC', '#EC407A', '#26C6DA',
    '#FF7043', '#9CCC65', '#EF5350', '#29B6F6', '#E53935', '#A1887F'
  ];

  // --- Gráfico con emociones ---
  const chartData = useMemo(() => {
    if (!reportData.length) return { labels: [], datasets: [] };
    const intensidadesPorID = {};
    reportData.forEach(({ emocion, promedio_intensidad }) => {
      if (!Array.isArray(intensidadesPorID[emocion])) {
        intensidadesPorID[emocion] = [];
      }
      intensidadesPorID[emocion].push(Number(promedio_intensidad) || 0);
    });
    const emocionIDs = Object.keys(intensidadesPorID);



    const labels = [];
    const data = [];
    const backgroundColors = [];

    emocionIDs.forEach((id, index) => {
      const intensidades = intensidadesPorID[id];
      const promedio = intensidades.reduce((a, b) => a + b, 0) / intensidades.length;

      const info = emocionesMap[id]; // Buscar la información de nombre y color usando el ID

      if (info) {
        // Usar el nombre de la emoción del mapa para la etiqueta
        labels.push(info.nombre);
        data.push(promedio);
        // Usar el color de la categoría del mapa
        backgroundColors.push(info.color);
      }

    });

    return {
      labels,
      datasets: [
        {
          label: 'Promedio de Intensidad por Emoción',
          data,
          backgroundColor: backgroundColors,
          borderColor: '#fff',
          borderWidth: 2,
        },
      ],
    };
  }, [reportData, emocionesMap]); 

  // --- Opciones del gráfico ---
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, 

    plugins: {
      title: {
        display: true,
        text: 'Distribución de Intensidad por Emoción', // Título que informa el contenido
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 15
        }
      },
      legend: {
        display: true,
        position: 'right', 
        labels: {
          font: {
            size: 12
          },
          boxWidth: 20,
        }
      },
      // Información al pasar el mouse
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 }).format(context.parsed) + ' promedio';
            }
            return label;
          }
        }
      }
    },

    elements: {
      arc: {
        borderWidth: 1, 
        borderColor: '#FFFFFF',
      }
    }
  };

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
        }}
      >
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
            p: { xs: 2, sm: 3 },
            display: "flex",
            flexDirection: "column",
            gap: 3,
            maxWidth: "1200px",
            mx: "auto",
            width: "100%"
          }}>

            {/* Header */}
            <Box ox sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flex: 1,
              justifyContent: "center",
              textAlign: "center",
            }}>
              <PieChartIcon sx={{
                color: "#092181",
                fontSize: 36,
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
              }} />
              <Typography
                variant="h4"
                sx={{
                  color: "#092181",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              > Reporte de seguimento del Paciente
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography variant="subtitle1">
                <strong>Paciente:</strong> {Nombre || "Cargando..."}
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
              {/* --- CONTENEDOR DE CAMPOS --- */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                {/* Selector de rango */}
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
                  <InputLabel>Tipo de reporte:</InputLabel>
                  <Select
                    value={tipoReporte}
                    onChange={(e) => setTipoReporte(e.target.value)}
                    label="Rango"
                  >
                    <MenuItem value="diario">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CalendarTodayIcon sx={{ color: "#4CAF50" }} />
                        <Typography>Diario</Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="semanal">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <EventAvailableIcon sx={{ color: "#2196F3" }} />
                        <Typography>Semanal</Typography>
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
                {/* Campo de fecha Inicio */}
                <TextField
                  type="date"
                  label="Inicio"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
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

                {/* Campo de fecha Fin */}
                <TextField
                  type="date"
                  label="Fin"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
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
              </Box>

              {/* --- CONTENEDOR DE BOTONES --- */}

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
                <Card sx={{
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
                  overflowX: "auto"
                }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <TableViewIcon sx={{ color: "#092181", fontSize: 28 }} />
                    <Typography variant="h6" fontWeight="bold" sx={{ color: "#092181" }}>
                      Vista previa del reporte
                    </Typography>
                  </Box>
                  <Table sx={{
                    minWidth: 1000,
                    borderCollapse: "separate",
                    borderSpacing: "0 12px",
                    width: "100%",
                    tableLayout: 'fixed',
                  }}>
                    <TableHead sx={{ backgroundColor: '#e8f0fe' }}>
                      <TableRow>
                        {["Fecha", "Emoción", "Promedio de  Intensidad", "Frecuencia de la emoción"].map((head) => (
                          <TableCell key={head} align="center"
                          sx={{ fontWeight: "bold", color: theme.palette.primary.main }}>
                            {head}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportData.map((row, index) => {
                        const emo = emocionesMap[row.emocion] || {};
                        return (
                          <TableRow key={index} sx={{
                            backgroundColor: "#ffffff",
                            borderRadius: "12px",
                            transition: "all 0.3s ease", // Transición más suave
                              "&:hover": {
                                // Un color de hover sutil o un ligero azul/gris
                                backgroundColor: "#f0f8ff", // Azul muy claro al hacer hover
                                cursor: 'pointer',
                              },
                             
                          }}>
                            <TableCell align="center">{row.tiempo ? format(new Date(row.tiempo), "yyyy-MM-dd") : "N/A"}</TableCell>
                            <TableCell>
                              <Box  sx={{ display: "flex", alignItems: "center", gap: 1, color: emo.color, justifyContent: "center", }}>
                                {emo.icono} {emo.nombre || row.emocion}
                              </Box>
                            </TableCell>
                            <TableCell align="center" sx={{ color: theme.palette.info.main, fontWeight: "bold" }}>
                              {Number(row.promedio_intensidad).toFixed(2)}</TableCell>
                            <TableCell align="center" sx={{ color: theme.palette.secondary, fontWeight: "bold" }}>
                              {row.frecuencia_emocion}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Card>

                <Card sx={{
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
                }}>
                  <Box sx={{
                    height: { xs: 300, sm: 400 }, display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <Pie data={chartData} options={chartOptions} />
                  </Box>
                </Card>
              </Box>
            ) : (
              <Card sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
                <Typography color="text.secondary">
                  No hay datos para mostrar. Selecciona un rango de fechas y genera el reporte.
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
      </Container >
    </Layout >
  );
}
