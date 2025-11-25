import React, { useState, useEffect, useMemo } from 'react';
import Layout from "../components/LayoutProf";
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
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

import AssessmentIcon from '@mui/icons-material/Assessment';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import DateRangeIcon from "@mui/icons-material/DateRange";
import SearchIcon from "@mui/icons-material/Search";
import TableViewIcon from "@mui/icons-material/TableView";
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

export default function ReporteDiagnosticoProf() {
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
  const [puntajeMin, setPuntajeMin] = useState(null);
  const [puntajeMax, setPuntajeMax] = useState(null);
  const [reportData, setReportData] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("success");

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
    if (!idProfesional) return mostrarMensaje("No se ha encontrado el profesional.", "warning");
    //if (!fechaInicio || !fechaFin) return mostrarMensaje("Selecciona un rango de fechas.", "warning");
    setReportData([]);
    try {
      const res = await axios.get(`http://localhost:4000/api/repDiagnostico/info-diagnostico-profesional`, {
        params: {
          idProfesional,
          idPaciente,
          fechaInicio,
          fechaFin,
          tipoReporte,
          puntajeMin,
          puntajeMax
        }
      });

      if (res.data.length === 0) {
        mostrarMensaje(" No hay información disponible en el rango seleccionado.", "warning");
      }
      setReportData(res.data);
    } catch (error) {
      console.error('Error al obtener el reporte:', error);
    }
  };

  const exportPDF = async () => {
    try {
      if (reportData.length === 0) return mostrarMensaje("Primero genera el reporte.", "warning");

      // Obtener imagen del gráfico
      const chartCanvas = document.querySelector('canvas');
      const grafico = chartCanvas ? chartCanvas.toDataURL('image/png') : null;
      if (!grafico) console.warn("No se encontró el canvas para generar la imagen del gráfico");

      const res = await axios.post(
        `http://localhost:4000/api/repDiagnostico/pdf`,
        { tipoUsuario: 2, datos: reportData, grafico, nombre:Nombre, tipoReporte },
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Reporte_Diagnosticos.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      mostrarMensaje("Reporte exportado a PDF exitosamente.", "success");
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      mostrarMensaje("Error al exportar el reporte a PDF.", "error"); 
    }
  };

  // Agrupar datos por tipo de test para graficar
  const chartData = useMemo(() => {
    if (!reportData.length) return { labels: [], datasets: [] };

    const pacientesUnicos = [...new Set(reportData.map(item => item.nombrePaciente))];
    const tiposTestUnicos = [...new Set(reportData.map(item => item.tipo_test))];
    // Mapeamos los valores numéricos únicos a los objetos completos de TipoTest
    const tiposTestInfo = tiposTestUnicos
      .map(valor => TipoTest.find(test => test.value === Number(valor)))
      .filter(info => info);
    const datasets = tiposTestInfo.map((tipoInfo, i) => {
      return {
        label: tipoInfo.nombre,
        data: pacientesUnicos.map(pacientes => {
          const item = reportData.find(
            r => r.nombrePaciente === pacientes && Number(r.tipo_test) === tipoInfo.value
          );
          return item ? Number(item.promedio_puntaje).toFixed(2) : 0;
        }),
        backgroundColor: tipoInfo.color,
        borderColor: tipoInfo.color,
        border: 1
      };
    });

    return {
      labels: pacientesUnicos,
      datasets
    };
  }, [reportData, TipoTest]);

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
              <AssessmentIcon sx={{
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
                Reporte de diagnósticos más comunes en pacientes
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography sx={{ mb: 2 }}>
                <strong>Profesional:</strong> {Nombre || "Cargando..."}
              </Typography>
              <Typography sx={{ mb: 2 }}>
                <strong>Paciente:</strong>{" "}
                {idPaciente
                  ? pacientes.find(p => p.idPaciente === idPaciente)?.nombrePaciente
                  : "Todos los pacientes"}
              </Typography>
            </Box>

            {/* Filtros */}
            <Card
              sx={{
                p: { xs: 2, sm: 3 },
                mb: 3,
                display: "flex",
                flexDirection: "column",
                gap: 3,
                borderRadius: 3,
                backgroundColor: "#fff",
                border: "1px solid #e5e9f2",
                boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                },
              }}
            >
              {/* ===== FILA DE FILTROS ===== */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 2,
                  width: "100%",
                }}
              >
                <FormControl sx={{
                  flex: "1 1 250px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "#f8fafc",
                    height: 48,
                    "& fieldset": { borderColor: "#e2e8f0" },
                    "&:hover fieldset": { borderColor: "#cbd5e1" },
                    "&.Mui-focused fieldset": {
                      borderColor: "#092181",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#475569",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                  },
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

                {/* Tipo de Reporte */}
                <FormControl
                  size="small"
                  sx={{
                    flex: "1 1 180px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      backgroundColor: "#f8fafc",
                      height: 48,
                      "& fieldset": { borderColor: "#e2e8f0" },
                      "&:hover fieldset": { borderColor: "#cbd5e1" },
                      "&.Mui-focused fieldset": {
                        borderColor: "#092181",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#475569",
                      fontWeight: "600",
                      fontSize: "0.9rem",
                    },
                  }}
                >
                  <InputLabel>Tipo de reporte:</InputLabel>
                  <Select value={tipoReporte} onChange={e => setTipoReporte(e.target.value)}>
                    <MenuItem value="diario">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <CalendarTodayIcon sx={{ color: "#10b981", fontSize: 20 }} />
                        <Typography fontSize="0.9rem">Diario</Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="semanal">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <EventAvailableIcon sx={{ color: "#3b82f6", fontSize: 20 }} />
                        <Typography fontSize="0.9rem">Semanal</Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="mensual">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <DateRangeIcon sx={{ color: "#f59e0b", fontSize: 20 }} />
                        <Typography fontSize="0.9rem">Mensual</Typography>
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>

                {/* Fechas */}
                <TextField
                  label="Fecha inicio"
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  sx={{
                    flex: "1 1 150px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      backgroundColor: "#f8fafc",
                      height: 48,
                      "& fieldset": { borderColor: "#e2e8f0" },
                      "&:hover fieldset": { borderColor: "#cbd5e1" },
                      "&.Mui-focused fieldset": {
                        borderColor: "#092181",
                        borderWidth: "2px",
                      },
                    },
                  }}
                />

                <TextField
                  label="Fecha fin"
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  sx={{
                    flex: "1 1 150px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      backgroundColor: "#f8fafc",
                      height: 48,
                      "& fieldset": { borderColor: "#e2e8f0" },
                      "&:hover fieldset": { borderColor: "#cbd5e1" },
                      "&.Mui-focused fieldset": {
                        borderColor: "#092181",
                        borderWidth: "2px",
                      },
                    },
                  }}
                />
                <TextField
                  label="Puntaje mínimo:"
                  type="number"
                  value={puntajeMin}
                  onChange={(e) => setPuntajeMin(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  sx={{
                    flex: "1 1 150px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      backgroundColor: "#f8fafc",
                      height: 48,
                      "& fieldset": { borderColor: "#e2e8f0" },
                      "&:hover fieldset": { borderColor: "#cbd5e1" },
                      "&.Mui-focused fieldset": {
                        borderColor: "#092181",
                        borderWidth: "2px",
                      },
                    },
                  }}
                />
                <TextField
                  label="Puntaje máximo:"
                  type="number"
                  value={puntajeMax}
                  onChange={(e) => setPuntajeMax(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  sx={{
                    flex: "1 1 150px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      backgroundColor: "#f8fafc",
                      height: 48,
                      "& fieldset": { borderColor: "#e2e8f0" },
                      "&:hover fieldset": { borderColor: "#cbd5e1" },
                      "&.Mui-focused fieldset": {
                        borderColor: "#092181",
                        borderWidth: "2px",
                      },
                    },
                  }}
                />
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
                  onClick={fetchReport}
                  startIcon={<SearchIcon />}
                  sx={{
                    //flex: "1 ",
                    minWidth: 150,
                    textTransform: "none",
                    backgroundColor: "#092181",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    height: 48,
                    borderRadius: "10px",
                    "&:hover": {
                      backgroundColor: "#1a3fd4",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(9, 33, 129, 0.3)",
                    },
                  }}
                >
                  Generar
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={exportPDF}

                  sx={{
                    //flex: "1 ",
                    minWidth: 150,
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: "bold",
                    px: 2.5,
                    height: 48,
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
              </Box>
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
                      Vista previa del reporte</Typography>
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
                        {[
                          { head: "Paciente", width: "15%" },

                          { head: "Tipo de test", width: "100px" },

                          { head: "Total de aplicaciones", width: "100px" },

                          // Columna 4: Última Fecha (Fecha corta)
                          { head: "Promedio del puntaje", width: "120px" },

                          // Columna 5: Categoría (Icono + Badge)
                          { head: "Edad del paciente", width: "13%" },

                          // Columna 6: Interpretación (Texto largo)
                          { head: "Fecha de aplicacion", width: "25%" },


                        ].map((item) => (
                          <TableCell
                            key={item.head}
                            sx={{
                              fontWeight: 700,
                              color: "#092181", // Color azul oscuro
                              fontSize: "0.85rem", // Ligeramente más grande
                              letterSpacing: "0.5px", // Menos espaciado
                              borderBottom: "2px solid #092181", // Línea sutil
                              pb: 1.5,
                              pt: 1.5,
                              // Alineación: derecha para datos numéricos y fechas
                              textAlign: "center",
                              width: item.width,
                              minWidth: item.width
                            }}
                          >
                            {item.head}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportData.map((row, index) => {

                        const idTest = Number(row.tipo_test); // Asegurar que es un número
                        const testInfo = TipoTest.find((t) => t.value === idTest);

                        return (
                          <TableRow key={index}
                            hover
                            sx={{
                              // Eliminamos el backgroundColor para que el hover sea el que destaque
                              backgroundColor: '#ffffff', // Fondo blanco limpio
                              borderRadius: "8px", // Menos agresivo
                              transition: "all 0.3s ease", // Transición más suave
                              "&:hover": {
                                // Un color de hover sutil o un ligero azul/gris
                                backgroundColor: "#f0f8ff", // Azul muy claro al hacer hover
                                cursor: 'pointer',
                              },
                              "& td": {
                                borderBottom: "1px solid #eee", // Añadimos un separador de fila sutil
                                paddingY: 2, // Más espacio vertical
                                fontSize: "0.9rem",
                                color: "#333", // Color de texto principal
                              },
                            }}>
                            <TableCell align="center" sx={{ fontWeight: 700, color: "#1976d2" }}>
                              {row.nombrePaciente}</TableCell>
                            <TableCell x={{ fontWeight: 600 }}>
                              {/* Celda del Test: Muestra Icono y Color */}
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Box sx={{ color: testInfo?.color || "gray" }}>{testInfo?.icono || <AddchartIcon />}</Box>
                                {testInfo?.nombre || row.tipo_test}
                              </Box>
                            </TableCell>
                            <TableCell align="center" sx={{ color: "#555" }}>
                              {row.total_aplicaciones}</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, color: "#1976d2" }}>
                              {row.promedio_puntaje}</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, color: "#1976d2" }}>
                              {row.edad}</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, color: "#1976d2" }}>
                              {format(new Date(row.ultima_fecha), 'yyyy-MM-dd')}</TableCell>
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
                  <Box sx={{ height: { xs: 300, sm: 400 } }}>
                    <Bar
                      data={chartData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { position: 'top' },
                          title: { display: true, text: 'Promedio de Puntaje por Tipo de Test' }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: { // <--- CONFIGURACIÓN DEL TÍTULO DEL EJE Y
                              display: true,
                              text: 'Puntaje Promedio Obtenido'
                            }
                          },
                          x: {
                            title: { // <--- CONFIGURACIÓN DEL TÍTULO DEL EJE X
                              display: true,
                              text: 'Nombre del paciente'
                            }
                          }
                        }
                      }}
                    />
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
