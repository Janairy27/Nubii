import React, { useState, useEffect, useMemo } from "react";
import Layout from "../components/LayoutAdmin";
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
import { FilterList, RestartAlt } from "@mui/icons-material";
import PieChartIcon from "@mui/icons-material/PieChart";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import DateRangeIcon from "@mui/icons-material/DateRange";
import SearchIcon from "@mui/icons-material/Search";
import TableViewIcon from "@mui/icons-material/TableView";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Lyrics } from "@mui/icons-material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ReporteUso() {
  const theme = useTheme();
  const [idUsuario, setIdUsuario] = useState(null);

  const [nombreUsuario, setNombreUsuario] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [estado, setEstado] = useState("");
  const [municipio, setMunicipio] = useState("");
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
    usuario: false,
    fecha: false,
    rol: false,
    estado: false,
    municipio: false,
    tipoReporte: false,
  });

  const filtros = {
    nombreUsuario,
    fechaInicio: fechaInicio,
    fechaFin: fechaFin,
    tipoUsuario,
    estado,
    municipio,
    tipoReporte,
  };
  const [valoresFiltro, setValoresFiltro] = useState({
    nombreUsuario: "",
    fechaInicio: "",
    fechaFin: "",
    tipoUsuario: "",
    estado: "",
    municipio: "",
    tipoReporte: "",
  });

  const handleLimpiarFiltros = () => {
    setFiltrosActivos({
      usuario: false,
      fecha: false,
      rol: false,
      estado: false,
      municipio: false,
      tipoReporte: false,
    });

    setNombreUsuario("");
    setFechaInicio("");
    setFechaFin("");
    setTipoUsuario(null);
    setEstado("");
    setMunicipio("");
    setTipoReporte("diario");

    setReportData([]);
  };

  const UsuarioMap = {
    2: "Profesional",
    3: "Paciente",
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    const params = {};

    if (filtrosActivos.usuario && nombreUsuario)
      params.nombreUsuario = nombreUsuario;
    if (filtrosActivos.fecha && fechaInicio && fechaFin) {
      params.fechaInicio = fechaInicio;
      params.fechaFin = fechaFin;
    }
    if (filtrosActivos.rol && tipoUsuario) params.tipoUsuario = tipoUsuario;
    if (filtrosActivos.estado && estado) params.estado = estado;
    if (filtrosActivos.municipio && municipio) params.municipio = municipio;
    if (filtrosActivos.tipoReporte && tipoReporte)
      params.tipoReporte = tipoReporte;

    try {
      const res = await axios.get(`http://localhost:4000/api/repUso/info-uso`, {
        params,
      });

      if (res.data.length === 0) {
        mostrarMensaje(
          " No hay información disponible en el rango seleccionado.",
          "warning"
        );
      }
      setReportData(res.data);
      console.log("report dta:", res.data);
    } catch (error) {
      console.error("Error al obtener el reporte:", error);
    }
  };

  const exportPDF = async () => {
    try {
      if (reportData.length === 0)
        return mostrarMensaje("Primero genera el reporte.", "error");

      // Obtener imagen del gráfico
      const chartCanvas = document.querySelector("canvas");
      const grafico = chartCanvas ? chartCanvas.toDataURL("image/png") : null;
      if (!grafico)
        console.warn(
          "No se encontró el canvas para generar la imagen del gráfico"
        );

      const res = await axios.post(
        `http://localhost:4000/api/repUso/pdf`,
        { datos: reportData, grafico },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Reporte_Uso.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      mostrarMensaje("Reporte generado a PDF correctamente.", "success");
    } catch (error) {
      console.error("Error al exportar PDF:", error);
      mostrarMensaje("Error al generar el PDF.", "error");
    }
  };

  // Agrupar datos por tipo de test para graficar
  const chartData = useMemo(() => {
    if (!reportData || reportData.length === 0)
      return { labels: [], datasets: [] };

    const labels = reportData.map((item) => item.nombreUsuario);

    const actividades = reportData.map((item) => {
      if (item.tipo_usuario === "Paciente")
        return Number(item.actividades_completadas || 0);
      if (item.tipo_usuario === "Profesional")
        return Number(item.actividades_publicadas || 0);
      return 0;
    });

    const tests = reportData.map((item) => {
      if (item.tipo_usuario === "Paciente")
        return Number(item.total_test_realizados || 0);
      if (item.tipo_usuario === "Profesional")
        return Number(item.test_aplicados || 0);
      return 0;
    });

    return {
      labels,
      datasets: [
        {
          label: "Tests realizados / aplicados",
          data: tests,
          backgroundColor: "rgba(54, 162, 235, 0.7)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
        {
          label: "Actividades completadas / publicadas",
          data: actividades,
          backgroundColor: "rgba(255, 159, 64, 0.7)",
          borderColor: "rgba(255, 159, 64, 1)",
          borderWidth: 1,
        },
      ],
    };
  }, [reportData]);

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
                Reporte de uso del sistema
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
                    value={nombreUsuario}
                    onChange={(e) => setNombreUsuario(e.target.value)}
                  />
                )}

                {filtrosActivos.rol && (
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
                    <InputLabel>Tipo de usuario:</InputLabel>
                    <Select
                      value={tipoUsuario ?? ""}
                      onChange={(e) => setTipoUsuario(Number(e.target.value))}
                      label="Tipo de usuario"
                    >
                      {Object.entries(UsuarioMap).map(([val, text]) => (
                        <MenuItem key={val} value={val}>
                          {text}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {filtrosActivos.estado && (
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
                    label="Estado del usuario"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                  />
                )}

                {filtrosActivos.municipio && (
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
                    label="Municipio del usuario"
                    value={municipio}
                    onChange={(e) => setMunicipio(e.target.value)}
                  />
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
                {" "}
                Generar reporte
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
                />{" "}
                Generar PDF
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
                          "Nombre del usuario",
                          "Tipo usuario",
                          "No. test realizados",
                          "No. actividades completadas",
                          "Promedio satisfacción",
                          "No. actividades publicadas",
                          "Test aplicados",
                          "Última actividad",
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
                      {reportData.map((row, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            backgroundColor: "#ffffff",
                            borderRadius: "12px",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              backgroundColor: "#f0f8ff",
                              cursor: "pointer",
                            },
                          }}
                        >
                          <TableCell>{row.nombreUsuario}</TableCell>
                          <TableCell align="center">
                            {row.tipo_usuario}
                          </TableCell>
                          <TableCell align="center">
                            {row.total_test_realizados}
                          </TableCell>
                          <TableCell align="center">
                            {row.actividades_completadas}
                          </TableCell>
                          <TableCell align="center">
                            {row.promedio_satisfaccion}
                          </TableCell>
                          <TableCell align="center">
                            {row.actividades_publicadas}
                          </TableCell>
                          <TableCell align="center">
                            {row.test_aplicados}
                          </TableCell>
                          <TableCell align="center">
                            {row.ultima_actividad}
                          </TableCell>
                        </TableRow>
                      ))}
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
                    <Bar
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "top",
                            labels: {
                              font: { size: 13 },
                              color: "#333",
                            },
                          },
                          title: {
                            display: true,
                            text: "Comparativo de uso del sistema por usuario (Actividades vs Tests)",
                            font: { size: 18, weight: "bold" },
                            color: "#222",
                          },
                          tooltip: {
                            backgroundColor: "#f5f5f5",
                            titleColor: "#333",
                            bodyColor: "#000",
                            borderColor: "#ccc",
                            borderWidth: 1,
                            callbacks: {
                              title: (context) => `${context[0].label}`,
                              afterTitle: (context) => {
                                const index = context[0].dataIndex;
                                const tipo = reportData[index].tipo_usuario;
                                return `Tipo: ${tipo}`;
                              },
                            },
                          },
                        },
                        scales: {
                          x: {
                            ticks: {
                              color: "#333",
                              font: { size: 12 },
                              autoSkip: false,
                            },
                          },
                          y: {
                            beginAtZero: true,
                            ticks: {
                              color: "#333",
                              font: { size: 12 },
                              stepSize: 1,
                            },
                            title: {
                              display: true,
                              text: "Cantidad",
                              font: { size: 14, weight: "bold" },
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
