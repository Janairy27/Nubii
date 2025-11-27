import React, { useState, useEffect } from "react";
import Layout from "../components/LayoutProf";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Divider,
  Snackbar,
  Alert,
  Tooltip,
  Chip,
} from "@mui/material";
import { Drafts, Public, Close, CheckCircle } from "@mui/icons-material";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Person2Icon from "@mui/icons-material/Person2";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SettingsIcon from "@mui/icons-material/Settings";
import AssignmentAddIcon from "@mui/icons-material/AssignmentAdd";
import DescriptionIcon from "@mui/icons-material/Description";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export const PublicoMap = {
  1: { label: "Borradores", color: "#9E9E9E", icon: <Drafts /> },
  2: { label: "Publicados", color: "#007BFF", icon: <Public /> },
};

export const recomendacionMap = {
  1: { label: "No", color: "#E53935", icon: <Close /> },
  2: { label: "Sí", color: "#43A047", icon: <CheckCircle /> },
};

export default function ActividadPersonalizada() {
  const [idUsuario, setIdUsuario] = useState(null);
  const [idProfesional, setIdProfesional] = useState(null);
  const [Nombre, setNombre] = useState("");

  const [idPaciente, setIdPaciente] = useState(null);
  const [pacientes, setPacientes] = useState([]);

  const [nombrePaciente, setNombrePaciente] = useState("");

  const [actividad, setActividad] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [publico, setPublico] = useState(null);

  const [ActividadPersonalizada, setActividadPersonalizada] = useState([]);

  const [ActividadSeleccionada, setActividadSeleccionada] = useState(null);
  const [msg, setMsg] = useState("");
  const [vista, setVista] = useState(2);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigate = useNavigate();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensajeSnackbar, setMensajeSnackbar] = useState("");
  const [tipoSnackbar, setTipoSnackbar] = useState("success");

  const mostrarMensaje = (msg, severity = "info") => {
    setMensajeSnackbar(msg);
    setTipoSnackbar(severity);
    setOpenSnackbar(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Obtener profesional
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

  {
    /* useEffect(() => {
    if(idProfesional){
        obtenerActividades();
    }
  }, [idProfesional]);*/
  }

  const obtenerActividades = (enviadoParam = vista) => {
    axios
      .get(
        `http://localhost:4000/api/Recomendacion/obtener-recomendaciones/${idProfesional}/${vista}`
      )
      .then((res) => {
        setActividadPersonalizada(res.data);
        setActividadSeleccionada(null);
      })
      .catch((err) => {
        console.error("Error al cargar recomendaciones:", err);
        setActividadPersonalizada([]);
      });
  };

  const handleSeleccionar = (recomendacion) => {
    setActividadSeleccionada(recomendacion);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      idProfesional,
      idPaciente,
      actividad,
      descripcion,
      publico,
    };

    console.log("Enviando data:", data);

    axios
      .post(
        "http://localhost:4000/api/recomendacion/registro-recomendacion",
        data
      )
      .then(() => {
        navigate("/actividad-personalizada");
        mostrarMensaje("Resultado registrado exitosamente.", "success");
      })
      .catch((err) => {
        //Log completo del error para depuración
        console.error("Error completo de Axios:", err);
        let mensajeError = "Error al registrar la actividad personalizada.";
        // Unir  los errores de validación en una sola cadena
        if (err.response && err.response.data) {
          const dataError = err.response.data;

          // 2. Si el backend devolvió una lista de errores
          if (
            dataError.errores &&
            Array.isArray(dataError.errores) &&
            dataError.errores.length > 0
          ) {
            // Unir  los errores de validación en una sola cadena
            mensajeError = `Errores de validación: ${dataError.errores.join(
              "; "
            )}`;
          } else if (dataError.message) {
            mensajeError = dataError.message;
          }
        }
        // Mostrar el mensaje de error específico o el genérico
        mostrarMensaje(mensajeError, "error");
      });
  };

  const handleActualizar = () => {
    axios
      .put(
        `http://localhost:4000/api/recomendacion/modificar-recomendacion/${ActividadSeleccionada.idRecomendacion}`,
        ActividadSeleccionada
      )
      .then(() => {
        mostrarMensaje("Recomendación actualizada correctamente", "success");
        obtenerActividades();
        setActividadSeleccionada(null);
      })
      .catch((err) => {
        //Log completo del error para depuración
        console.error("Error completo de Axios:", err);
        let mensajeError = "Error al actualizar la actividad personalizada.";
        if (err.response && err.response.data) {
          const dataError = err.response.data;

          // Verificar que la respuesta 400 tenga datos estructurados
          if (
            dataError.errores &&
            Array.isArray(dataError.errores) &&
            dataError.errores.length > 0
          ) {
            // Unir  los errores de validación en una sola cadena
            mensajeError = `Errores de validación: ${dataError.errores.join(
              "; "
            )}`;
          } else if (dataError.message) {
            mensajeError = dataError.message;
          }
        }
        // Mostrar el mensaje de error específico o el genérico
        mostrarMensaje(mensajeError, "error");
      });
  };

  const obtenerPacientes = () => {
    axios
      .get(`http://localhost:4000/api/citas/pacientes/${idProfesional}`)
      .then((res) => setPacientes(res.data))
      .catch((err) => console.log("Error al obtener pacientes", err));
  };

  useEffect(() => {
    if (idProfesional) {
      obtenerActividades();
      obtenerPacientes();
    }
  }, [idProfesional, vista]);

  const InfoItem = ({ icon, label, value }) => (
    <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
      <Box
        sx={{
          mr: 2,
          color: "#355C7D",
          display: "flex",
          alignItems: "center",
          minWidth: "24px",
          mt: 0.5,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: "0.8rem" }}
        >
          {label}
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontWeight: "medium", wordBreak: "break-word" }}
        >
          {value || "No especificado"}
        </Typography>
      </Box>
    </Box>
  );

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
          {/* Título */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              mb: 4,
              position: "relative",
            }}
          >
            <AssignmentIndIcon
              sx={{
                color: "#092181",
                fontSize: 36,
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
              }}
            />
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                color: "#092181",
                textAlign: "center",
                letterSpacing: 0.5,
                textTransform: "capitalize",
              }}
            >
              Actividades personalizadas
            </Typography>
          </Box>

          <Box
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            sx={{
              mt: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              px: 3,
              py: 2,
              borderRadius: 3,
              backgroundColor: mostrarFormulario ? "#ffebee" : "#889ef8ff",
              color: mostrarFormulario ? "#c62828" : "#092181",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              maxWidth: 300,
              mx: "auto",
              textAlign: "center",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                backgroundColor: mostrarFormulario ? "#ffcdd2" : "#c8d0e6ff",
              },
              transition: "all 0.25s ease-in-out",
            }}
          >
            {mostrarFormulario ? (
              <>
                <Close sx={{ fontSize: 22 }} />
                Ocultar formulario
              </>
            ) : (
              <>
                <AddCircleOutlineIcon sx={{ fontSize: 22 }} />
                Agregar recomendación de actividad
              </>
            )}
          </Box>

          {msg && (
            <Alert
              severity={msg.includes("✅") ? "success" : "error"}
              sx={{ mt: 2 }}
            >
              {msg}
            </Alert>
          )}

          {/* Formulario */}
          {mostrarFormulario && (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                width: "100%",
                mt: 3,
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 4,
                  width: "100%",
                  //maxWidth: 1100,
                  justifyItems: "center",
                }}
              >
                {/*  Datos generales */}
                <Card
                  sx={{
                    flex: 1,
                    width: "100%",
                    maxWidth: 400,
                    borderRadius: 4,
                    backgroundColor: "#f8f9ff",
                    border: "1px solid #d8e0ff",
                    boxShadow: "0 6px 18px rgba(9, 33, 129, 0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 8px 24px rgba(9, 33, 129, 0.15)",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Person2Icon sx={{ color: "#092181", fontSize: 28 }} />
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                          color: "#092181",
                          textAlign: "center",
                          letterSpacing: 0.5,
                        }}
                      >
                        Datos generales
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />

                    <TextField
                      label="Profesional"
                      value={Nombre}
                      disabled
                      sx={{
                        width: "100%",
                        maxWidth: "400px",
                        mb: 2,
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

                    <FormControl
                      sx={{
                        width: "100%",
                        maxWidth: "400px",
                        mb: 2,
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
                      <InputLabel>Paciente</InputLabel>
                      <Select
                        name="paciente"
                        value={idPaciente || ""}
                        onChange={(e) => setIdPaciente(Number(e.target.value))}
                        label="Paciente"
                        required
                      >
                        {pacientes.map((p) => (
                          <MenuItem key={p.idPaciente} value={p.idPaciente}>
                            {p.nombrePaciente}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>

                {/*  Detalles de la actividad */}
                <Card
                  sx={{
                    flex: 1,
                    width: "100%",
                    maxWidth: 400,
                    borderRadius: 4,
                    backgroundColor: "#f8f9ff",
                    border: "1px solid #d8e0ff",
                    boxShadow: "0 6px 18px rgba(9, 33, 129, 0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 8px 24px rgba(9, 33, 129, 0.15)",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <AssignmentIcon sx={{ color: "#092181", fontSize: 28 }} />
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                          color: "#092181",
                          textAlign: "center",
                          letterSpacing: 0.5,
                        }}
                      >
                        Detalles de la actividad
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />

                    <TextField
                      name="actividad"
                      label="Nombre de la actividad"
                      value={actividad}
                      onChange={(e) => setActividad(e.target.value)}
                      sx={{
                        width: "100%",
                        maxWidth: "400px",
                        mb: 2,
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

                    <TextField
                      name="descripcion"
                      label="Descripción"
                      multiline
                      minRows={3}
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      sx={{
                        width: "100%",
                        maxWidth: "400px",
                        mb: 2,
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
                  </CardContent>
                </Card>
              </Box>

              {/* Configuración */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Card
                  sx={{
                    flex: 1,
                    width: "100%",
                    maxWidth: 500,
                    borderRadius: 4,
                    backgroundColor: "#f8f9ff",
                    border: "1px solid #d8e0ff",
                    boxShadow: "0 6px 18px rgba(9, 33, 129, 0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 8px 24px rgba(9, 33, 129, 0.15)",
                      transform: "translateY(-3px)",
                    },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    {" "}
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <SettingsIcon sx={{ color: "#092181", fontSize: 28 }} />
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                          color: "#092181",
                          textAlign: "center",
                          letterSpacing: 0.5,
                        }}
                      >
                        Configuración de publicación
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    <FormControl
                      sx={{
                        width: "100%",
                        maxWidth: "400px",
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
                      <InputLabel>Publicar actividad</InputLabel>
                      <Select
                        name="publico"
                        value={publico || ""}
                        onChange={(e) => setPublico(Number(e.target.value))}
                        label="Publicar actividad"
                      >
                        {Object.entries(PublicoMap).map(([key, pub]) => (
                          <MenuItem key={key} value={Number(key)}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Box sx={{ color: pub.color, fontSize: 20 }}>
                                {pub.icon}
                              </Box>
                              {pub.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 2,
                      }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<AssignmentAddIcon />}
                        sx={{
                          minWidth: "140px",
                          textTransform: "capitalize",
                          borderRadius: 2,
                          background: "#2D5D7B",
                          "&:hover": { background: "#092181" },
                        }}
                      >
                        Agregar recomendación
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          )}

          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3 }}
          >
            {Object.entries(PublicoMap).map(([key, pub]) => (
              <Button
                key={key}
                variant={vista === Number(key) ? "contained" : "outlined"}
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: vista === Number(key) ? "#fff" : pub.color,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.2,
                  transition: "all 0.3s ease",
                  backgroundColor:
                    vista === Number(key) ? pub.color : "transparent",
                  borderColor: pub.color,
                  "&:hover": {
                    backgroundColor:
                      vista === Number(key) ? pub.color : `${pub.color}22`,
                  },
                }}
                startIcon={pub.icon}
                onClick={() => setVista(Number(key))}
              >
                {pub.label}
              </Button>
            ))}
          </Box>

          {/* Listado o Detalle */}
          {!ActividadSeleccionada ? (
            <Tooltip
              title="Selecciona una tarjeta para ver más detalles"
              placement="top"
              arrow
            >
              <Box sx={{ width: "100%", px: { xs: 2, sm: 4 } }}>
                {/* Header */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    gap: 2,
                    mb: 4,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      flex: 1,
                      justifyContent: { xs: "center", sm: "flex-start" },
                    }}
                  >
                    <AssignmentIcon sx={{ color: "#0A2472", fontSize: 36 }} />
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: "#0A2472",
                        letterSpacing: 0.5,
                      }}
                    >
                      {ActividadPersonalizada.length > 0
                        ? vista === 1
                          ? "Borradores de actividades recomendadas"
                          : "Actividades recomendadas enviadas"
                        : vista === 1
                        ? "Aún no hay actividades guardadas"
                        : "No se han enviado recomendaciones aún"}
                    </Typography>
                  </Box>

                  <Chip
                    label={`${ActividadPersonalizada.length} actividad(es)`}
                    sx={{
                      backgroundColor: "#0A2472",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      px: 1,
                    }}
                  />
                </Box>

                {/* Contenedor de tarjetas */}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  {ActividadPersonalizada.map((recomendacion) => (
                    <Card
                      key={recomendacion.idRecomendacion}
                      onClick={() => handleSeleccionar(recomendacion)}
                      sx={{
                        cursor: "pointer",
                        flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 45%" },
                        maxWidth: 400,
                        minHeight: 200,
                        borderRadius: 4,
                        border: "1px solid #E0E6F1",
                        background: " #F7F9FF ",
                        boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-6px)",
                          boxShadow: "0 12px 24px rgba(9,33,129,0.15)",
                          borderColor: "#0A2472",
                        },
                      }}
                    >
                      <CardContent
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2.5,
                          p: 3,
                        }}
                      >
                        {/* Encabezado */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #E3E7F1",
                            pb: 1.5,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 700, color: "#0A2472" }}
                          >
                            {recomendacion.actividad}
                          </Typography>

                          <Box
                            sx={{
                              backgroundColor: "#E8EDFF",
                              color: "#0A2472",
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 2,
                              fontSize: "0.8rem",
                              fontWeight: 600,
                            }}
                          >
                            {recomendacion.publico === 1
                              ? "Borrador"
                              : "Publicado"}
                          </Box>
                        </Box>

                        {/* Paciente */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                            mt: 1,
                          }}
                        >
                          <Person2Icon
                            sx={{ color: "#0A2472", fontSize: 24 }}
                          />
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              color: "#12275C",
                            }}
                          >
                            {recomendacion.nombrePaciente}
                          </Typography>
                        </Box>

                        {/* Descripción */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1.2,
                            flexGrow: 1,
                          }}
                        >
                          <DescriptionIcon
                            sx={{ color: "#0A2472", fontSize: 24, mt: "3px" }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#4A5568",
                              lineHeight: 1.6,
                              textAlign: "justify",
                            }}
                          >
                            {recomendacion.descripcion}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            </Tooltip>
          ) : (
            <Box
              sx={{
                mt: 5,
                p: 4,
                borderRadius: 4,
                background: "linear-gradient(180deg, #FFFFFF 0%, #F9FAFF 100%)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                border: "1px solid #E0E6F1",
                transition: "all 0.3s ease",
              }}
            >
              {/* Título */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "#0A2472",
                  mb: 1.5,
                  textAlign: { xs: "center", sm: "left" },
                }}
              >
                {vista === 1
                  ? " Editar actividad recomendada"
                  : "Detalle de la recomendación enviada"}
              </Typography>

              {/* Paciente */}
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 3,
                  color: "#4A5568",
                  textAlign: { xs: "center", sm: "left" },
                }}
              >
                <strong>Paciente:</strong>{" "}
                {ActividadSeleccionada.nombrePaciente}
              </Typography>

              {/* Campos */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 3,
                  justifyContent: "space-between",
                }}
              >
                {[
                  ["actividad", "Actividad a realizar"],
                  ["descripcion", "Descripción de la actividad"],
                  [
                    "mejoramiento",
                    "¿Qué tanto le ayudó al paciente esta actividad?",
                  ],
                  [
                    "mas_recomendacion",
                    "¿Le interesa recibir más recomendaciones?",
                  ],
                  ["publico", "¿Mandar actividad?"],
                ]
                  .filter(([key]) =>
                    vista === 1
                      ? ["actividad", "descripcion", "publico"].includes(key)
                      : [
                          "actividad",
                          "descripcion",
                          "publico",
                          "mejoramiento",
                          "mas_recomendacion",
                        ].includes(key)
                  )
                  .map(([key, label]) => {
                    const isSelect = ["publico"].includes(key);
                    const isEditable = vista === 1;
                    const value = ActividadSeleccionada[key];

                    // Obtener valores de mapas
                    const valueMap =
                      key === "mas_recomendacion"
                        ? recomendacionMap[value]
                        : key === "publico"
                        ? PublicoMap[value]
                        : null;

                    const displayValue = valueMap
                      ? valueMap.label
                      : value || "-";

                    const icon = valueMap ? valueMap.icon : null;
                    const color = valueMap ? valueMap.color : "#4A5568";

                    return (
                      <Box
                        key={key}
                        sx={{
                          flex: { xs: "1 1 100%", sm: "1 1 47%" },
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, color: "#0A2472" }}
                        >
                          {label}
                        </Typography>

                        {isEditable ? (
                          isSelect ? (
                            <FormControl
                              sx={{
                                width: "100%",
                                maxWidth: "400px",
                                mb: 2,
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "12px",
                                  backgroundColor: "#FFFFFF",
                                  "& fieldset": { borderColor: "#CBD4D8" },
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
                            >
                              <Select
                                value={ActividadSeleccionada[key] || ""}
                                onChange={(e) =>
                                  setActividadSeleccionada({
                                    ...ActividadSeleccionada,
                                    [key]: e.target.value,
                                  })
                                }
                                sx={{
                                  borderRadius: 2,
                                  "& .MuiSelect-select": { py: 1.2 },
                                }}
                              >
                                {Object.entries(PublicoMap).map(
                                  ([val, item]) => (
                                    <MenuItem key={val} value={val}>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 1,
                                          color: item.color,
                                        }}
                                      >
                                        {item.icon}
                                        {item.label}
                                      </Box>
                                    </MenuItem>
                                  )
                                )}
                              </Select>
                            </FormControl>
                          ) : (
                            <TextField
                              multiline={key === "descripcion"}
                              rows={key === "descripcion" ? 3 : 1}
                              value={value || ""}
                              onChange={(e) =>
                                setActividadSeleccionada({
                                  ...ActividadSeleccionada,
                                  [key]: e.target.value,
                                })
                              }
                              sx={{
                                width: "100%",
                                maxWidth: "400px",
                                mb: 2,
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "12px",
                                  backgroundColor: "#FFFFFF",
                                  "& fieldset": { borderColor: "#CBD4D8" },
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
                          )
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                              backgroundColor: "#F1F4FF",
                              borderRadius: 2,
                              px: 2,
                              py: 1.2,
                              minHeight: 44,
                            }}
                          >
                            {icon && (
                              <Box
                                sx={{
                                  color: color,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {icon}
                              </Box>
                            )}
                            <Typography
                              variant="body1"
                              sx={{
                                color: color,
                                fontWeight: 500,
                                flexWrap: "wrap",
                              }}
                            >
                              {displayValue}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    );
                  })}
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
                {vista === 1 && (
                  <>
                    <Button
                      variant="contained"
                      onClick={handleActualizar}
                      startIcon={<SaveIcon />}
                      sx={{
                        backgroundColor: "#0A2472",
                        color: "#fff",
                        px: 3,
                        py: 1.2,
                        borderRadius: 3,
                        textTransform: "none",
                        fontWeight: 600,
                        "&:hover": { backgroundColor: "#081A56" },
                      }}
                    >
                      Actualizar
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={() => setActividadSeleccionada(null)}
                      startIcon={<CancelIcon />}
                      sx={{
                        borderColor: "#0A2472",
                        color: "#0A2472",
                        px: 3,
                        py: 1.2,
                        borderRadius: 3,
                        textTransform: "none",
                        fontWeight: 600,
                        "&:hover": {
                          borderColor: "#081A56",
                          color: "#081A56",
                          backgroundColor: "rgba(10,36,114,0.05)",
                        },
                      }}
                    >
                      Cancelar
                    </Button>
                  </>
                )}

                {vista === 2 && (
                  <Button
                    variant="outlined"
                    onClick={() => setActividadSeleccionada(null)}
                    startIcon={<ArrowBackIcon />}
                    sx={{
                      borderColor: "#0A2472",
                      color: "#0A2472",
                      px: 3,
                      py: 1.2,
                      borderRadius: 3,
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": {
                        borderColor: "#081A56",
                        color: "#081A56",
                        backgroundColor: "rgba(10,36,114,0.05)",
                      },
                    }}
                  >
                    Regresar
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </Paper>

        {/*  Snackbar con Alert */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={typeof tipoSnackbar === "string" ? tipoSnackbar : "info"}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {mensajeSnackbar}
          </Alert>
        </Snackbar>
      </Container>
    </Layout>
  );
}
