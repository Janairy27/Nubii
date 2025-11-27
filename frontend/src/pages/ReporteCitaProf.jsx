import React, { useState, useEffect } from "react";
import Layout from "../components/LayoutProf";
import axios from "axios";
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
import { color } from "framer-motion";
import { X } from "@mui/icons-material";

// MAPS
const estadoCitaMap = [
  { value: 1, nombre: "Pendiente de aceptar", color: "#dacb49ff" },
  { value: 2, nombre: "Aceptada", color: "#21d127ff" },
  { value: 3, nombre: "En progreso", color: "#81D4FA" },
  { value: 4, nombre: "Concluido", color: "#66bc05ff" },
  { value: 5, nombre: "Cancelado por el paciente", color: "#ec4656ff" },
  { value: 6, nombre: "Cancelado por el profesional", color: "#bf3e3eff" },
  { value: 7, nombre: "No asistió el paciente", color: "#da9a3aff" },
  { value: 8, nombre: "No asistió el profesional", color: "#b137c6ff" },
  { value: 9, nombre: "Reprogramado", color: "#079db1ff" },
  { value: 10, nombre: "Rechazada", color: "#aa0e44ff" },
  { value: 11, nombre: "Expirada", color: "#fa0404ff" },
  { value: 12, nombre: "En espera", color: "#c39b23ff" },
];

const modalidadMap = [
  {
    value: 1,
    nombre: "Presencial",
    color: "#4CAF50",
    icon: <SchoolIcon fontSize="small" />,
  },
  {
    value: 2,
    nombre: "Virtual",
    color: "#2196F3",
    icon: <ComputerIcon fontSize="small" />,
  },
];

export default function ReporteCitaProf() {
  const theme = useTheme();
  const [idUsuario, setIdUsuario] = useState(null);
  const [idProfesional, setIdProfesional] = useState(null);
  const [nombre, setNombre] = useState("");
  const [idPaciente, setIdPaciente] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [tipoReporte, setTipoReporte] = useState("diario");
  const [reportData, setReportData] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("success");

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
        .catch((err) => console.error("Error al obtener idProfesional:", err));
    }
  }, []);

  useEffect(() => {
    if (idProfesional) {
      axios
        .get(`http://localhost:4000/api/citas/pacientes/${idProfesional}`)
        .then((res) => setPacientes(res.data))
        .catch((err) => console.log("Error al obtener pacientes", err));
    }
  }, [idProfesional]);
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
    if (idProfesional) {
      fetchReport();
    }
  }, [idProfesional]);

  const fetchReport = async () => {
    if (!idProfesional)
      return mostrarMensaje("No se ha encontrado el profesional.", "warning");
    //if (!fechaInicio || !fechaFin) return mostrarMensaje("Selecciona un rango de fechas.","warning");

    setReportData([]);
    try {
      const res = await axios.get(
        `http://localhost:4000/api/repCita/info-citas`,
        {
          params: {
            idProfesional,
            idPaciente,
            fechaInicio,
            fechaFin,
            tipoReporte,
          },
        }
      );
      if (res.data.length === 0) {
        mostrarMensaje(
          "No hay información disponible para este profesional en el rango seleccionado.",
          "warning"
        );
      }
      setReportData(res.data);
    } catch (error) {
      console.error("Error al obtener el reporte:", error);
      mostrarMensaje("Error al obtener el reporte.", "error");
    }
  };

  const exportExcel = async () => {
    try {
      if (reportData.length === 0)
        return mostrarMensaje("Primero genera el reporte.", "error");
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
      mostrarMensaje("Reporte exportado a Excel exitosamente.", "success");
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
                Reporte de citas del Profesional
              </Typography>
            </Box>

            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography sx={{ mb: 2 }}>
                <strong>Profesional:</strong> {nombre || "Cargando..."} <br />
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
              {/*Filtros*/}
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
                {/* Selector de Paciente */}
                <FormControl
                  sx={{
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
                  }}
                >
                  <InputLabel>Paciente</InputLabel>
                  <Select
                    value={idPaciente ?? "todos"}
                    label="Paciente"
                    onChange={(e) =>
                      setIdPaciente(
                        e.target.value === "todos"
                          ? null
                          : Number(e.target.value)
                      )
                    }
                  >
                    <MenuItem value="todos">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <GroupsIcon sx={{ color: "#64748b", fontSize: 20 }} />
                        <Typography fontWeight="500">
                          Todos los pacientes
                        </Typography>
                      </Box>
                    </MenuItem>
                    {pacientes.map((p) => (
                      <MenuItem key={p.idPaciente} value={p.idPaciente}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <PersonIcon sx={{ color: "#092181", fontSize: 20 }} />
                          <Typography>{p.nombrePaciente}</Typography>
                        </Box>
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
                  <InputLabel>Tipo de reporte</InputLabel>
                  <Select
                    label="Tipo de reporte"
                    value={tipoReporte}
                    onChange={(e) => setTipoReporte(e.target.value)}
                  >
                    <MenuItem value="diario">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <CalendarTodayIcon
                          sx={{ color: "#10b981", fontSize: 20 }}
                        />
                        <Typography fontSize="0.9rem">Diario</Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="semanal">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <EventAvailableIcon
                          sx={{ color: "#3b82f6", fontSize: 20 }}
                        />
                        <Typography fontSize="0.9rem">Semanal</Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="mensual">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <DateRangeIcon
                          sx={{ color: "#f59e0b", fontSize: 20 }}
                        />
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
                  Generar
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
                  Excel
                </Button>
              </Box>
            </Card>

            {/* Tabla */}
            {reportData.length > 0 ? (
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
                    minWidth: 650,
                    borderCollapse: "separate",
                    borderSpacing: "0 10px",
                  }}
                >
                  <TableHead>
                    <TableRow>
                      {[
                        "Paciente",
                        "Fecha",
                        "Duración",
                        "Modalidad",
                        "Estado",
                        "Comentario",
                      ].map((head) => (
                        <TableCell
                          key={head}
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
                    {reportData.map((row, i) => {
                      const estadoC = estadoCitaMap.find(
                        (m) =>
                          m.value === row.idEstado || m.value === row.estado
                      );

                      const modalidad = modalidadMap.find(
                        (m) =>
                          m.value === row.idModalidad ||
                          m.value === row.modalidad
                      );

                      return (
                        <TableRow
                          key={i}
                          hover
                          sx={{
                            backgroundColor:
                              i % 2 === 0 ? "#fafafa" : "#ffffff",
                            borderRadius: "12px",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                          }}
                        >
                          <TableCell>{row.nombrePaciente}</TableCell>
                          <TableCell>
                            {format(new Date(row.fecha_cita), "yyyy-MM-dd")}
                          </TableCell>
                          <TableCell>{row.duracion_horas} hrs</TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <span style={{ color: modalidad?.color }}>
                                {modalidad?.icon}
                              </span>
                              <Typography>
                                {modalidad?.nombre || row.modalidad}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                backgroundColor: estadoC?.color,
                                color: "#fff",
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 2,
                                textAlign: "center",
                                fontSize: "0.85rem",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {estadoC?.nombre || row.estadoC}
                            </Box>
                          </TableCell>
                          <TableCell>{row.comentario || "—"}</TableCell>
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
