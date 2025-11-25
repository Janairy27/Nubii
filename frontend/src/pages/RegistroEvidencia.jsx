import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import {
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Box,
  Divider,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  Fade,
  Chip,

} from "@mui/material";
import {
  ArrowBackIosNewOutlined,
  PersonOutline,
  AssignmentOutlined,
  CommentOutlined,
  SaveOutlined,
  CheckCircleOutline,
  Mood,
  SentimentSatisfied,
  SentimentDissatisfied,
  SentimentVerySatisfied,
  SentimentNeutral,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { es } from "date-fns/locale";
import { useNavigate, useParams } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import LinearProgress from "@mui/material/LinearProgress";

export default function RegistroEvidencia() {
  const [idUsuario, setIdUsuario] = useState("");
  const [idPaciente, setIdPaciente] = useState(null);
  const [nombre, setNombre] = useState('');
  const [nombreActividad, setNombreActividad] = useState('');
  const [fechaSugerida, setFechaSug] = useState("");
  const [fechaRealizada, setFechaRea] = useState("");
  const [completa, setCompleta] = useState(1);
  const [satisfaccion, setSatisfaccion] = useState(null);
  const [comentarios, setComentarios] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { idActividad } = useParams();
  const navigate = useNavigate();


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
        .get(`http://localhost:4000/api/auth/paciente/${storedIdUsuario}`)
        .then((res) => {
          const paciente = res.data;
          setNombre(paciente.nombre);
          setIdPaciente(paciente.idPaciente);
        })
        .catch((err) => {
          console.error("Error al obtener idPaciente:", err);
          mostrarMensaje("Error al obtener los datos del paciente.", "error");
        });
    } else {
      mostrarMensaje("No se encontró el usuario en sesión.", "warning");
    }

  }, []);

  useEffect(() => {
    if (idActividad) {
      axios.get(`http://localhost:4000/api/actividades/actividad/${idActividad}`)
        .then((res) => {
          const actividad = res.data;
          setNombreActividad(actividad.nombreAct);
          setFechaSug(actividad.fechaPublicado);
        })
        .catch((err) => {
          console.log("Error al obtener la actividad:", err);
          mostrarMensaje("No se pudo cargar la actividad.", "error");
        });
    }
  }, [idActividad]);

  const setFechaSinExistir = () => {
    if (!fechaRealizada || !(fechaRealizada instanceof Date)) {
      setFechaRea(new Date());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    

    let formattedFecha = null;

    if (!completa) {
      mostrarMensaje("Debes marcar la actividad como completada antes de continuar.", "warning");
      setIsSubmitting(false);
      return;
    }

    if (fechaRealizada instanceof Date && !isNaN(fechaRealizada)) {
      formattedFecha = fechaRealizada.toISOString().split("T")[0];
    } else {
      mostrarMensaje("La fecha ingresada no es válida.", "error");
      console.error("La fecha es inválida");
      setIsSubmitting(false);
      return;
    }


    const data = {
      idPaciente,
      idActividad: Number(idActividad),
      fecha_sugerida: new Date(fechaSugerida).toISOString().split("T")[0],
      fecha_realizada: formattedFecha,
      completada: completa ,
      satisfaccion,
      comentario_Evidencia: comentarios,
    };

    try {
      await axios.post("http://localhost:4000/api/evidencia/registro-evidencia", data);
      mostrarMensaje("Evidencia registrada exitosamente.", "success");
      setOpenSnackbar(true);
      setTimeout(() => navigate("/listado-actividades"), 2000);
    } catch (err) {
        //Log completo del error para depuración
        console.error("Error completo de Axios:", err); 

        let mensajeError = "Error al registrar la evidencia.";
        
        // Verificar que la respuesta 400 tenga datos estructurados
        if (err.response && err.response.data) {
            const dataError = err.response.data;
            
            if (dataError.errores && Array.isArray(dataError.errores) && dataError.errores.length > 0) {
                // Unir  los errores de validación en una sola cadena
                mensajeError = `Errores de validación: ${dataError.errores.join('; ')}`;
            } 
            else if (dataError.message) {
                 mensajeError = dataError.message;
            }
        }

        // Mostrar el mensaje de error específico o el genérico 
        mostrarMensaje(mensajeError, "error");
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/listado-actividades");
  };



  const satisfactionIcons = [
    { value: 1, icon: <SentimentDissatisfied sx={{ fontSize: 32 }} />, label: "Muy insatisfecho", color: "#f44336" },
    { value: 2, icon: <SentimentDissatisfied sx={{ fontSize: 32 }} />, label: "Insatisfecho", color: "#ff9800" },
    { value: 3, icon: <SentimentNeutral sx={{ fontSize: 32 }} />, label: "Neutral", color: "#ffeb3b" },
    { value: 4, icon: <SentimentSatisfied sx={{ fontSize: 32 }} />, label: "Satisfecho", color: "#4caf50" },
    { value: 5, icon: <SentimentVerySatisfied sx={{ fontSize: 32 }} />, label: "Muy satisfecho", color: "#2196f3" },
  ];


  const getSatisfactionLabel = () => {
    const selected = satisfactionIcons.find(opt => opt.value === satisfaccion);
    return selected ? selected.label : "Selecciona tu nivel de satisfacción";
  };
  const colores = ["#f44336", "#ff9800", "#ffeb3b", "#4caf50", "#2196f3"];
  const colorActual = colores[Math.max(0, satisfaccion - 1)];

  return (
    <Layout>

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>

        <Fade in timeout={800}>
          <Paper
            elevation={24}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
              backgroundColor: "#F4F6F8",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            {/* Header */}
            <Box sx={{ textAlign: "center", mb: 4 }}>

              <Typography
                variant="h4"
                sx={{
                  color: "#2D5D7B",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <AssignmentOutlined />
                Registro de Evidencias
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              {/* Datos del paciente */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                <Card
                  sx={{
                    flex: "1 1 100%", minWidth: "280px", flexBasis: "48%",
                    alignContent: "center",
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    background: " #f8f9ff",
                    border: "1px solid #e0e7ff",
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                      <PersonOutline sx={{ color: "#092181" }} />
                      <Typography variant="h6" sx={{ fontWeight: "600", color: "#092181" }}>
                        Datos del Paciente
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <Chip
                        icon={<PersonOutline />}
                        label={nombre || "Cargando..."}
                        variant="outlined"
                        sx={{
                          py: 2,
                          fontSize: "1rem",
                          borderColor: "#2D5D7B",
                          color: "#2D5D7B",
                          "& .MuiChip-icon": { color: "#2D5D7B" },
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>

                {/* Comentarios */}
                <Card
                  sx={{
                    flex: "1 1 100%",
                    minWidth: "280px",
                    borderRadius: 3,
                    flexBasis: "48%",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    background: " #f8f9ff",
                    border: "1px solid #e0e7ff",
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                      <CommentOutlined sx={{ color: "#092181" }} />
                      <Typography variant="h6" sx={{ fontWeight: "600", color: "#092181" }}>
                        Comentarios
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />

                    <TextField
                      fullWidth
                      label="Comparte tus comentarios sobre la actividad..."
                      multiline
                      rows={4}
                      value={comentarios}
                      onChange={(e) => setComentarios(e.target.value)}
                      placeholder="Ingresa los comentarios obetnedios sobre la actividad"
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: "#fff", 
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
                        "& .MuiInputBase-input::placeholder": {
                          color: "#777777", 
                          opacity: 1,
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              </Box>

              {/* Detalles de actividad */}
              <Card
                sx={{
                  alignContent: "center",
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  background: "#f8f9ff",
                  border: "1px solid #e0e7ff",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <AssignmentOutlined sx={{ color: "#092181" }} />
                    <Typography variant="h6" sx={{ fontWeight: "600", color: "#092181" }}>
                      Detalles de la Actividad
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {/* Actividad */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#2D5D7B", mb: 1 }}>
                        Actividad
                      </Typography>
                      <Chip
                        label={nombreActividad || "Cargando..."}
                        color="primary"
                        variant="filled"
                        sx={{ py: 1.5, fontSize: "0.9rem" }}
                      />
                    </Box>

                    {/* Fechas */}
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#2D5D7B", mb: 1 }}>
                          Fecha Sugerida
                        </Typography>
                        <TextField
                          fullWidth
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          value={fechaSugerida ? new Date(fechaSugerida).toISOString().split("T")[0] : ""}
                          disabled
                          slotProps={{
                            textField: {
                              fullWidth: true, size: "small",
                              sx: {
                                mt: 2,
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
                              },
                            },
                          }}
                        />
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#2D5D7B", mb: 1 }}>
                          Fecha Realizada
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                          <DatePicker
                            value={fechaRealizada}
                            disabled
                            onChange={() => { }}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                sx: {
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    backgroundColor: "#f8f9fa",
                                  },
                                },
                              },
                            }}
                          />
                        </LocalizationProvider>
                      </Box>
                    </Box>

                    {/* Completada */}
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={completa === 2}
                          onChange={(e) => setCompleta(e.target.checked ? 2 : 1)}
                          icon={<CheckCircleOutline />}
                          checkedIcon={<CheckCircleOutline sx={{ color: "#4caf50" }} />}
                        />
                      }
                      label={
                        <Typography variant="body1" sx={{ fontWeight: "bold", color: "#2D5D7B" }}>
                          Actividad Completada
                        </Typography>
                      }
                    />

                    {/* Nivel de satisfacción */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#2D5D7B", mb: 2 }}>
                        {getSatisfactionLabel()}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 1,
                          p: 2,
                          borderRadius: 3,
                          backgroundColor: "#f8f9fa",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        {satisfactionIcons.map((option) => (
                          <Box
                            key={option.value}
                            onClick={() => {
                              setSatisfaccion(option.value);
                              setFechaSinExistir();
                            }}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              cursor: "pointer",
                              padding: 1,
                              borderRadius: 2,
                              transition: "all 0.3s ease",
                              flex: 1,
                              "&:hover": {
                                transform: "translateY(-4px)",
                                backgroundColor: "rgba(255,255,255,0.8)",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                              },
                              ...(satisfaccion === option.value && {
                                backgroundColor: "white",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                                transform: "translateY(-2px)",
                                border: `2px solid ${option.color}`,
                              }),
                            }}
                          >
                            <Box sx={{ color: satisfaccion === option.value ? option.color : "#666" }}>
                              {option.icon}
                            </Box>
                            <Typography
                              variant="caption"
                              sx={{
                                mt: 0.5,
                                fontSize: "0.6rem",
                                textAlign: "center",
                                fontWeight: satisfaccion === option.value ? 600 : 400,
                              }}
                            >
                              {option.value}
                            </Typography>
                          </Box>
                        ))}
                      </Box>

                      {/* Barra de progreso */}
                      {satisfaccion && (
                        <Box sx={{ mt: 2 }}>
                          <LinearProgress
                            variant="determinate"
                            value={(satisfaccion / 5) * 100}
                            sx={{
                              height: 10,
                              borderRadius: 4,
                              backgroundColor: "#e0e0e0",
                              "& .MuiLinearProgress-bar": {
                                borderRadius: 4,
                                backgroundColor: colorActual,
                              },
                            }}
                          />

                        </Box>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>


              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                {/* Botón guardar */}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!satisfaccion}
                  startIcon={isSubmitting ? null : <SaveOutlined />}
                  textTransform="capitalize"
                  sx={{
                    flex: { xs: "1 1 100%", sm: "0 0 auto" },
                    textTransform: "none",
                    py: 1.5,
                    fontSize: "1.0 rem",
                    fontWeight: "bold",
                    borderRadius: 3,
                    background: "#2D5D7B",
                    boxShadow: "0 4px 15px rgba(45, 93, 123, 0.3)",
                    "&:hover": {
                      boxShadow: "0 6px 20px rgba(45, 93, 123, 0.4)",
                      transform: "translateY(-2px)",
                      background: " #092181 ",
                    },
                    "&:disabled": {
                      background: "#ccc",
                      transform: "none",
                      boxShadow: "none",
                    },
                    transition: "all 0.3s ease",
                  }}
                >

                  {satisfaccion ? "Guardar registro" : "Selecciona un nivel de satisfacción para guardar"}
                </Button>
                {/* Botón volver */}
                <Button
                  type="submit"
                  variant="outlined"
                  onClick={handleBack}
                  startIcon={<ArrowBackIosNewOutlined />}
                  sx={{
                    borderRadius: 3,
                    color: "#1f1f1fff",
                    textTransform: "capitalize",
                    backgroundColor: "#8a8989ff",

                    "&:hover": {
                      backgroundColor: "#aec1daff",
                      color: "#092181",
                    },
                    transition: "all 0.2s ease",
                    flex: { xs: "1 1 100%", sm: "0 0 auto" },
                  }}
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
            {/*  Snackbar para mensajes */}
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
          </Paper>


        </Fade>


      </Container>
    </Layout>
  );
}