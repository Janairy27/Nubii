import React, { useState, useEffect, useMemo } from "react";
import Layout from "../components/LayoutAdmin";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { format } from "date-fns";

import {
  Box,
  Typography,
  Paper,
  Button,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  useTheme,
  FormControl,
  InputLabel,
  TextField,
  Container,
  Card,
  Alert,
  Snackbar,
} from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";
import ComputerIcon from "@mui/icons-material/Computer";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import DateRangeIcon from "@mui/icons-material/DateRange";
import SearchIcon from "@mui/icons-material/Search";
import TableViewIcon from "@mui/icons-material/TableView";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import TableChartIcon from "@mui/icons-material/TableChart";

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
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// ===== MAPS =====
const especialidadMap = [
  {
    value: 1,
    nombre: "Psicólogo",
    icono: <PsychologyIcon />,
    color: "#ab47bc",
  },
  {
    value: 2,
    nombre: "Psiquiatra",
    icono: <MedicalServicesIcon />,
    color: "#42a5f5",
  },
  { value: 3, nombre: "Terapeuta", icono: <HealingIcon />, color: "#26a69a" },
  {
    value: 4,
    nombre: "Neurólogo",
    icono: <LocalHospitalIcon />,
    color: "#ef5350",
  },
  {
    value: 5,
    nombre: "Médico General",
    icono: <FavoriteIcon />,
    color: "#66bb6a",
  },
  {
    value: 6,
    nombre: "Psicoterapeuta",
    icono: <SelfImprovementIcon />,
    color: "#ffa726",
  },
  {
    value: 7,
    nombre: "Psicoanalista",
    icono: <EmojiObjectsIcon />,
    color: "#8d6e63",
  },
  {
    value: 8,
    nombre: "Consejero",
    icono: <SupportAgentIcon />,
    color: "#29b6f6",
  },
  {
    value: 9,
    nombre: "Trabajador Social",
    icono: <SupervisorAccountIcon />,
    color: "#ffa726",
  },
];

export default function ReporteCitaAdm() {
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

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setReportData([]);
    try {
      const res = await axios.get(
        `http://localhost:4000/api/repCita/info-citas-profesionales`
      );

      if (res.data.length === 0) {
        mostrarMensaje(
          " No hay información disponible para este rango seleccionado.",
          "warning"
        );
      }
      setReportData(res.data);
    } catch (error) {
      console.error("Error al obtener el reporte:", error);
    }
  };

  const exportExcel = async () => {
    try {
      if (reportData.length === 0) return alert("Primero genera el reporte.");

      const res = await axios.post(
        `http://localhost:4000/api/repCita/excel`,
        { datos: reportData },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Reporte_Citas.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      mostrarMensaje("Reporte exportado a  Excel  correctamente.", "success");
    } catch (error) {
      console.error("Error al exportar Excel:", error);
      mostrarMensaje("Error al exportar el reporte a Excel.", "error");
    }
  };

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
              <AssessmentIcon
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
                Reporte de citas de los Profesionales
              </Typography>
            </Box>

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
                    //flex: 1,
                    minWidth: 150,
                    textTransform: "none",
                    backgroundColor: "#092181",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    //height: 48,
                    borderRadius: "10px",
                    "&:hover": {
                      backgroundColor: "#1a3fd4",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(9, 33, 129, 0.3)",
                    },
                  }}
                >
                  Generar reporte
                </Button>
                <Button
                  variant="outlined"
                  color="success"
                  onClick={exportExcel}
                  sx={{
                    //flex: 1,
                    minWidth: 150,
                    textTransform: "none",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    borderColor: "#10b981",
                    color: "#10b981",
                    //height: 48,
                    borderRadius: "10px",
                    "&:hover": {
                      borderColor: "#059669",
                      backgroundColor: "rgba(16, 185, 129, 0.04)",
                      transform: "translateY(-1px)",
                    },
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
                  />
                  Generar Excel
                </Button>
              </Box>
            </Card>

            {reportData.length > 0 ? (
              <Card
                sx={{
                  p: 3,
                  borderRadius: "24px",
                  border: "1px solid #e3e8ff",
                  background:
                    "linear-gradient(180deg, #ffffff 0%, #f9fbff 100%)",
                  width: "96%",
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  overflowX: "auto",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 30px rgba(9,33,129,0.15)",
                    borderColor: "#092181",
                  },
                }}
              >
                {/* Encabezado */}
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2.5}
                >
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <TableViewIcon sx={{ color: "#092181", fontSize: 30 }} />
                    <Typography
                      variant="h6"
                      fontWeight="700"
                      sx={{
                        color: "#092181",
                        letterSpacing: "0.3px",
                      }}
                    >
                      Vista previa del reporte
                    </Typography>
                  </Box>
                </Box>

                {/* Tabla */}
                <Table
                  sx={{
                    minWidth: 700,
                    borderCollapse: "separate",
                    borderSpacing: "0 12px",
                  }}
                >
                  <TableHead>
                    <TableRow>
                      {[
                        "Profesional",
                        "Correo electrónico",
                        "Especialidad",
                        "Pendientes",
                        "Aceptadas",
                        "Canceladas",
                      ].map((head) => (
                        <TableCell
                          key={head}
                          sx={{
                            fontWeight: 700,
                            color: "#092181",
                            textTransform: "capitalize",
                            fontSize: "0.8rem",
                            letterSpacing: "0.8px",
                            borderBottom: "none",
                            pb: 1,
                          }}
                        >
                          {head}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {reportData.map((row, index) => {
                      const especialidad =
                        especialidadMap.find(
                          (m) =>
                            m.value === row.idEspecialidad ||
                            m.value === row.especialidad
                        ) || {};

                      return (
                        <TableRow
                          key={index}
                          hover
                          sx={{
                            backgroundColor: "#fff",
                            borderRadius: "14px",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                            transition: "all 0.25s ease",
                            "&:hover": {
                              transform: "scale(1.01)",
                              boxShadow: "0 4px 18px rgba(9,33,129,0.08)",
                            },
                            "& td": {
                              borderBottom: "none",
                            },
                          }}
                        >
                          <TableCell sx={{ fontWeight: 500 }}>
                            {row.nombreProfesional}
                          </TableCell>
                          <TableCell sx={{ color: "#546e7a" }}>
                            {row.email}
                          </TableCell>

                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: "50%",
                                  //backgroundColor: especialidad.color || "#9fa8da",
                                }}
                              />
                              <span style={{ color: especialidad?.color }}>
                                {especialidad?.icono}
                              </span>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 500 }}
                              >
                                {especialidad.nombre || row.especialidad}
                              </Typography>
                            </Box>
                          </TableCell>

                          <TableCell sx={{ fontWeight: 600, color: "#f57c00" }}>
                            {row.citas_pendientes}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600, color: "#2e7d32" }}>
                            {row.citas_confirmadas}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600, color: "#c62828" }}>
                            {row.citas_canceladas}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Card>
            ) : (
              <Card sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
                <Typography color="text.secondary">
                  No hay datos para mostrar. Selecciona un rango o tipo de
                  reporte.
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
