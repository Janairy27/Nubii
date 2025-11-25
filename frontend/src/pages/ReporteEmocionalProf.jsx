import React, { useState, useEffect, useMemo } from 'react';
import Layout from "../components/LayoutProf";
import axios from 'axios';
import { Line } from 'react-chartjs-2';
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
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ReporteEmocionalProf() {
  const theme = useTheme();
  const [idUsuario, setIdUsuario] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [idProfesional, setIdProfesional] = useState(null);
  const [Nombre, setNombre] = useState('');

  const [idPaciente, setIdPaciente] = useState(null);
  const [pacientes, setPacientes] = useState([]);

  const [nombrePaciente, setNombrePaciente] = useState("");
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

  const emocionesMap = useMemo(() => {
    const map = {};
    emocionesSaludMental.forEach((cat) =>
      cat.emociones.forEach((emo) => {
        map[emo.id] = { nombre: emo.nombre, color: cat.color, icono: emo.icono };
      })
    );
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
    axios.get(`http://localhost:4000/api/citas/pacientes/${idProfesional}`)
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
    if (!idProfesional) return mostrarMensaje("No se ha encontrado el profesional.","warning");
    //if (!fechaInicio || !fechaFin) return mostrarMensaje("Selecciona un rango de fechas.","warning");
    setReportData([]);
    try {
      const res = await axios.get(`http://localhost:4000/api/repEmocional/info-emocional-pacientes`, {
        params: {
          idProfesional,
          idPaciente,
          fechaInicio,
          fechaFin,
          tipoReporte
        }
      });

      if (res.data.length === 0) {
        mostrarMensaje("No hay información disponible en el rango seleccionado.", "warning");
      }
      setReportData(res.data);
    } catch (error) {
      console.error('Error al obtener el reporte:', error);
    }
  };

  const exportPDF = async () => {
    try {
      if (reportData.length === 0) return mostrarMensaje("Primero genera el reporte.","warning");

      // Obtener imagen del gráfico
      const chartCanvas = document.querySelector('canvas');
      const grafico = chartCanvas ? chartCanvas.toDataURL('image/png') : null;

      const res = await axios.post(
        `http://localhost:4000/api/repEmocional/pdf`,
        { tipoUsuario: 2, datos: reportData, grafico },
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Reporte_Emocional.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      mostrarMensaje("Reporte exportado a PDF exitosamente.", "success");
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      mostrarMensaje("Error al exportar el reporte a PDF.", "error");
    }
  };

  



  // Agrupar datos por emoción para graficar
  const chartData = useMemo(() => {
    if (!reportData.length) return { labels: [], datasets: [] };

    const emociones = {};

    reportData.forEach(({ periodo, emocion, promedio_intensidad }) => {
      const fecha = format(new Date(periodo), 'yyyy-MM-dd');
      //const fecha = tiempo;
      if (!emociones[emocion]) emociones[emocion] = {};
      emociones[emocion][fecha] = promedio_intensidad;
    });

    const periodosUnicos = [...new Set(reportData.map(d => format(new Date(d.periodo), 'yyyy-MM-dd')))].sort();

    const datasets = Object.keys(emociones).map(emocion => ({
      label: emocionesMap[emocion]?.nombre || emocion,
      data: periodosUnicos.map(periodo => emociones[emocion][periodo] || 0),
      fill: false,
      borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      tension: 0.3
    }));

    return { labels: periodosUnicos, datasets };
  }, [reportData]);

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
              <AutoGraphIcon sx={{
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
              >
                Reporte Emocional del Paciente</Typography>
            </Box>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography variant="subtitle1">
                <strong>Profesional:</strong> {Nombre || "Cargando..."}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Paciente:</strong>{" "}
                {idPaciente
                  ? pacientes.find(p => p.idPaciente === idPaciente)?.nombrePaciente
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

              <FormControl size="small"

                sx={{
                  minWidth: 400,
                  justifyContent: "center",
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
                  gap: 2,
                }}>
                <InputLabel>Paciente</InputLabel>
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
                  <InputLabel> Tipo de reporte:</InputLabel>
                  <Select value={tipoReporte} onChange={e => setTipoReporte(e.target.value)}>
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
                  startIcon={<PictureAsPdfIcon />}
                  onClick={exportPDF}
                  sx={{
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: "bold",
                    px: 2.5,
                  }}
                >
                  PDF
                </Button>
              </Box>


            </Card>

            {reportData.length > 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Card sx={{
                p: 3,
                display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        borderRadius: "20px",
                        border: "1px solid #dbe3ff",
                        backgroundColor: "#f9fbff",
                        width:  "94%",
                        //minHeight: "260px",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                        "&:hover": {
                          transform: "translateY(-6px)",
                          boxShadow: "0 10px 24px rgba(9,33,129,0.15)",
                          borderColor: "#092181",
                        },
              }}>
                 <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                        <TimelineIcon sx={{ color: "#092181", fontSize: 28 }} />
                        <Typography variant="h6" fontWeight="bold" sx={{ color: "#092181" }}>
                  Gráfica de Emociones</Typography>
                  </Box>
                  <Box sx={{ height: { xs: 300, sm: 400 } }}>
                    <Line data={chartData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "top" },
                       title: { display: true, text: 'Evolución de emociones de pacientes' }
                      },
                      scales: { 
                        y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: 'Intensidad'
                            }
                          },
                          x: {
                            title: { 
                              display: true,
                              text: 'Fecha'
                            }
                          }
                      }
                  }} />
                </Box>
              </Card>

              {/*  Tabla  */}
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
                    <AssignmentIcon sx={{ color: "#092181", fontSize: 28 }} />
                    <Typography variant="h6" fontWeight="bold" sx={{ color: "#092181" }}>
                       Vista previa del reporte</Typography>
                  </Box>
                  <Table sx={{ minWidth: 650, borderCollapse: "separate", borderSpacing: "0 10px" }}>
                  <TableHead>
                    <TableRow>
                       {["Paciente", "Período", "Emoción", "Intensidad", "Registros"].map((head) => (
                          <TableCell key={head} sx={{ fontWeight: "bold", color: theme.palette.primary.main }}>
                          {head}
                        </TableCell>
                      ))}
                    </TableRow>
                    </TableHead>
                  <TableBody>
       
                      {reportData.map((row, index) => {
                      const emo = emocionesMap[row.emocion] || {};
                      return(
                        <TableRow key={index} sx={{
                          backgroundColor: index % 2 === 0 ? "#fafafa" : "#ffffff",
                          borderRadius: "12px",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.04)"
                        }}>
                           <TableCell>{row.nombrePaciente}</TableCell>
                           <TableCell>{row.periodo ? format(new Date(row.periodo), "yyyy-MM-dd") : "N/A"}</TableCell>
                           <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              {emo.icono} {emo.nombre || row.emocion}
                            </Box>
                          </TableCell>
                           <TableCell sx={{ color: theme.palette.info.main, fontWeight: "bold" }}>
                            {Number(row.promedio_intensidad).toFixed(2)}
                          </TableCell>
                           <TableCell sx={{ fontWeight: "bold" }}>
                            {row.cantidad_registros || row.cantidad || row.total_registros}
                          </TableCell>
                        </TableRow>
                         );
                        })}
                    </TableBody>
                </Table>
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
      </Container>
    </Layout>
  );
}
