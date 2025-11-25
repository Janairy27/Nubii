import React, { useState, useEffect, useMemo } from 'react';
import Layout from "../components/LayoutAdmin";
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { format } from 'date-fns';

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
  Box,
  useTheme,
  Card,
  Container,
  Alert,
  Snackbar,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import {
  FilterList,
  RestartAlt,
} from "@mui/icons-material";
import AssessmentIcon from '@mui/icons-material/Assessment';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import DateRangeIcon from "@mui/icons-material/DateRange";
import SearchIcon from "@mui/icons-material/Search";
import TableViewIcon from "@mui/icons-material/TableView";


import PsychologyIcon from "@mui/icons-material/Psychology";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import HealingIcon from "@mui/icons-material/Healing";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,

} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const especialidadMap = [
  { value: 1, nombre: "Psicólogo", icono: <PsychologyIcon />, color: "#ab47bc" },
  { value: 2, nombre: "Psiquiatra", icono: <MedicalServicesIcon />, color: "#42a5f5" },
  { value: 3, nombre: "Terapeuta", icono: <HealingIcon />, color: "#26a69a" },
  { value: 4, nombre: "Neurólogo", icono: <LocalHospitalIcon />, color: "#ef5350" },
  { value: 5, nombre: "Médico General", icono: <FavoriteIcon />, color: "#66bb6a" },
  { value: 6, nombre: "Psicoterapeuta", icono: <SelfImprovementIcon />, color: "#ffa726" },
  { value: 7, nombre: "Psicoanalista", icono: <EmojiObjectsIcon />, color: "#8d6e63" },
  { value: 8, nombre: "Consejero", icono: <SupportAgentIcon />, color: "#29b6f6" },
  { value: 9, nombre: "Trabajador Social", icono: <SupervisorAccountIcon />, color: "#ffa726" },
];

// Función auxiliar para obtener los detalles de la especialidad
const getEspecialidadDetails = (id) => {
  return especialidadMap.find(e => e.value === id) || { nombre: 'Desconocida', icono: null, color: '#6c757d' };
};

export default function ReporteProfAgendados() {
  const theme = useTheme();
  const [idUsuario, setIdUsuario] = useState(null);

  const [nombreProfesional, setNombreProfesional] = useState("");
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [citasMin, setCitasMin] = useState(null);
  const [citasMax, setCitasMax] = useState(null);
  const [tipoReporte, setTipoReporte] = useState('diario');
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
    usuario: false,
    especialidad: false,
    fecha: false,
    total: false,
    tipoReporte: false
  });

  const filtros = {
    nombreProfesional,
    fechaInicio: fechaInicio,
    fechaFin: fechaFin,
    especialidad,
    citasMin,
    citasMax,
    tipoReporte,
  };

  const handleLimpiarFiltros = () => {
    setFiltrosActivos({
      usuario: false,
      fecha: false,
      especialidad: false,
      total: false,
      tipoReporte: false
    });

    setNombreProfesional("");
    setFechaInicio('');
    setFechaFin('');
    setEspecialidad(''); 
    setCitasMin('');
    setCitasMax('');
    setTipoReporte('diario');
    setReportData([]);

  };



  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    const params = {};

    if (filtrosActivos.usuario && nombreProfesional) params.nombreProfesional = nombreProfesional;
    if (filtrosActivos.fecha && fechaInicio && fechaFin) {
      params.fechaInicio = fechaInicio;
      params.fechaFin = fechaFin;
    }
    if (filtrosActivos.especialidad && especialidad !=='') params.especialidad = especialidad;
    if (filtrosActivos.total && citasMin && citasMax) {
      params.citasMin = citasMin;
      params.citasMax = citasMax;
    }
    if (filtrosActivos.tipoReporte && tipoReporte) params.tipoReporte = tipoReporte;

    try {
      const res = await axios.get(`http://localhost:4000/api/repProfAgendados/info-profesionales-agendados`, { params }
      );

      const dataFormatted = res.data.map(item => ({
        ...item,
        id_especialidad: Number(item.especialidad) 
      }));

      if (res.data.length === 0) {
        mostrarMensaje(" No hay información disponible en el rango seleccionado.", "warning");
      }
      setReportData(dataFormatted);
      console.log("report dta:", dataFormatted);
    } catch (error) {
      console.error('Error al obtener el reporte:', error);
    }
  };

  const exportExcel = async () => {
    try {
      if (reportData.length === 0) return mostrarMensaje("Primero genera el reporte.", "error");

      const dataToSend = reportData.map(item => {
        // Obtenemos el nombre de la especialidad para el Excel
        const espDetails = getEspecialidadDetails(item.id_especialidad);
        const { id_especialidad,especialidad: originalEspId, ...rest } = item;
        
        return {
            ...rest,
            // Sobrescribimos o agregamos la especialidad con su nombre
            especialidad: `${espDetails.nombre}$$${espDetails.color.replace('#', '')}`,
        };
    });
      
      const res = await axios.post(
        `http://localhost:4000/api/repProfAgendados/excel`,
        { datos: dataToSend},
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Reporte_Profesionales_Agendados.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      mostrarMensaje("Reporte exportado a Excel correctamente.", "success");
    } catch (error) {
      console.error('Error al exportar Excel:', error);
      mostrarMensaje("Error al exportar el reporte a Excel.", "error");
    }
  };

  const chartData = useMemo(() => {
    if (!reportData.length) return { labels: [], datasets: [] };

    const labels = reportData.map(item => item.nombreProfesional);
    const totalCitas = reportData.map(item => Number(item.total_citas || 0));

    // Obtener los colores de las especialidades para el gráfico
    const backgroundColors = reportData.map(item => getEspecialidadDetails(item.id_especialidad).color);
    const borderColors = reportData.map(item => getEspecialidadDetails(item.id_especialidad).color);

    return {
      labels,
      datasets: [
        {
          label: 'Total de citas por profesional',
          data: totalCitas,
          backgroundColor: backgroundColors.map(c => `${c}B3`), 
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    };
  }, [reportData]);

  const getFiltroLabel = (key) => {
    switch (key) {
        case 'usuario': return 'Profesional';
        case 'especialidad': return 'Especialidad';
        case 'fecha': return 'Rango de Fecha';
        case 'total': return 'Total Citas';
        case 'tipoReporte': return 'Tipo de Reporte';
        default: return key;
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
                Reporte de pofesionales más agendados</Typography>
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


              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <FilterList sx={{ mr: 1, color: "#092181" }} />
                <Typography variant="h6"
                  fontWeight="bold"
                  color="#092181"
                  sx={{ flex: 1 }}>
                  Selecciona filtros:</Typography>
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
                          setFiltrosActivos(prev => ({ ...prev, [key]: !prev[key] }))
                        }
                        sx={{
                          color: "#5A6ACF",
                          "&.Mui-checked": { color: "#092181" },
                          "& .MuiSvgIcon-root": { fontSize: 26 },
                        }}
                      />
                    }
                    label={getFiltroLabel(key)}
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

                {filtrosActivos.usuario && (
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
                    type="text"
                    label="Nombre del usuario"
                    value={nombreProfesional}
                    onChange={e => setNombreProfesional(e.target.value)}
                  />
                )}

                {filtrosActivos.especialidad && (
                  <FormControl size="small"
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
                    }}>
                    <InputLabel>Especialidad del profesional:</InputLabel>
                    <Select
                      value={especialidad ?? ""}
                      onChange={(e) => setEspecialidad(Number(e.target.value))}
                      label="Especialidad del profesional"
                    >
                      {especialidadMap.map((item) => (
                          <MenuItem key={item.value} value={item.value}>
                             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              {React.cloneElement(item.icono, { sx: { color: item.color } })}
                              <Typography>{item.nombre}</Typography>
                            </Box>
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
                      onChange={e => setFechaInicio(e.target.value)}
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
                      onChange={e => setFechaFin(e.target.value)}
                    />
                  </>
                )}

                {filtrosActivos.total && (
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
                      type="number"
                      label="Citas minimas"
                      value={citasMin}
                      onChange={e => setCitasMin(e.target.value)}
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
                      type="number"
                      label="Citas máximas"
                      value={citasMax}
                      onChange={e => setCitasMax(e.target.value)}
                    />
                  </>
                )}

                {filtrosActivos.tipoReporte && (
                  <FormControl size="small"
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
                    }}>
                    <InputLabel>Tipo de reporte</InputLabel>
                    <Select
                      value={tipoReporte}
                      onChange={e => setTipoReporte(e.target.value)}
                      label="Tipo de reporte"
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
              > Generar reporte
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
                variant="outlined"
                color="success"
                onClick={exportExcel}

                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 2.5,
                }}
              >
                <Box
                  component="img"
                  src="/excel-svgrepo-com.svg" // Ruta estática desde /public
                  alt="Exportar a Excel"
                  sx={{
                    width: 24, // Tamaño del icono
                    height: 24,
                    // Este filtro CSS fuerza el color del icono a ser el verde del botón.
                    //filter: "invert(46%) sepia(87%) saturate(368%) hue-rotate(113deg) brightness(97%) contrast(93%)",
                  }}
                /> Generar Excel
              </Button>
            </Card>
            
            {/* Resultado del Reporte */}
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
                      Vista previa del reporte </Typography>
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
                        {["Nombre del profesional", "Especialidad", "No. citas",
                          "No. citas concluidas", "No. citas fallidas",
                          "No. citas aceptada", "Primera cita", "Última cita",
                        ].map((head) => (
                          <TableCell key={head} align="center"
                            sx={{ fontWeight: "bold", color: theme.palette.primary.main }}>
                            {head}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportData.map((row, index) => {
                        const espDetails = getEspecialidadDetails(row.id_especialidad);
                         
                        return(
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
                          <TableCell>{row.nombreProfesional}</TableCell>
                          <TableCell align="center">
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: espDetails.color, fontWeight: 'bold' }}>
                                {espDetails.icono && React.cloneElement(espDetails.icono, { sx: { color: espDetails.color } })}
                                {espDetails.nombre}
                              </Box>
                            </TableCell>
                          <TableCell align="center">{row.total_citas}</TableCell>
                          <TableCell align="center"sx={{ color: '#4CAF50', fontWeight: 'bold' }}
                          >{row.citas_concluidas}</TableCell>
                          <TableCell align="center"
                          sx={{ color: '#F44336', fontWeight: 'bold' }}>{row.citas_fallidas}</TableCell>
                          <TableCell align="center"
                          sx={{ color: '#2196F3', fontWeight: 'bold' }}>{row.citas_aceptadas}</TableCell>
                          <TableCell align="center">{row.primera_cita}</TableCell>
                          <TableCell align="center">{row.ultima_cita}</TableCell>
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
                    <Bar
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                            labels: {
                              font: { size: 13 },
                              color: '#333',
                            },
                          },
                          title: {
                            display: true,
                            text: 'Comparativo de total de citas por profesional',
                            font: { size: 18, weight: 'bold' },
                            color: '#222',
                          },
                          tooltip: {
                            backgroundColor: '#f5f5f5',
                            titleColor: '#333',
                            bodyColor: '#000',
                            borderColor: '#ccc',
                            borderWidth: 1,
                            callbacks: {
                              title: (context) => `${context[0].label}`,
                              label: (context) => `Total de citas: ${context.formattedValue}`,
                              afterLabel: (context) => {
                                const index = context.dataIndex;
                               const espId = reportData[index].id_especialidad;
                                const espName = getEspecialidadDetails(espId).nombre;
                                return [`Especialidad: ${espName}`, `Total de citas: ${context.formattedValue}`];
                              },
                            },
                          },
                        },
                        scales: {
                          x: {
                            ticks: {
                              color: '#333',
                              font: { size: 12 },
                              autoSkip: false,
                            },
                          },
                          y: {
                            beginAtZero: true,
                            ticks: {
                              color: '#333',
                              font: { size: 12 },
                              stepSize: 1,
                            },
                            title: {
                              display: true,
                              text: 'Número de citas',
                              font: { size: 14, weight: 'bold' },
                            },
                          },
                        },
                      }}
                    />
                  </Box>
                </Card>
              </Box>
            ) : (
              <Card sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
                <Typography color="text.secondary">
                  No hay datos para mostrar. Selecciona un rango o tipo de reporte.

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
    </Layout>
  );
}
