import React, { useEffect, useState } from "react";
import Layout from "../components/LayoutAdmin";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Select,
  InputLabel,
  FormControl,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Divider,
  Card,
  CardContent,
  Chip,
  Avatar,
  CardActions,
  Paper,
  Tooltip,
  Slide,
  Fade,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Search,
  RestartAlt,
  Person,
  Email,
  LocalHospital,
  ArrowBack,
  FilterList,
  Group,
  LocationOn,
  Favorite,
  MedicalServices,
} from "@mui/icons-material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import { useNavigate } from "react-router-dom";

const ListadoUsuarios = () => {
  const [idUsuario, setIdUsuario] = useState("");
  const [Usuarios, setUsuarios] = useState([]);
  const [filtrosActivos, setFiltrosActivos] = useState({
    nombre: false,
    correo: false,
    estado: false,
    tipo: false,
    especialidad: false,
  });
  const [valoresFiltro, setValoresFiltro] = useState({
    nombre: "",
    correo: "",
    estado: "",
    tipo: "",
    especialidad: "",
  });
  const [UsuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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

  const tipoUsuario = {
    1: "Administrador",
    2: "Profesional de la salud",
    3: "Paciente",
  };

  const especialidadMap = {
    1: "Psicólogo",
    2: "Psiquiatra",
    3: "Terapeuta",
    4: "Neurólogo",
    5: "Médico General",
    6: "Psicoterapeuta",
    7: "Psicoanalista",
    8: "Consejero en salud mental",
    9: "Trabajador social clínico",
  };

  const getAvatarColor = (tipoUsuario) => {
    const colors = {
      1: "#67121A",
      2: "#092181",
      3: "#2D5D7B",
    };
    return colors[tipoUsuario] || "#666666";
  };
  const getChipColor = (tipoUsuario) => {
    const colors = {
      1: "#F5E3E9",
      2: "#afc8e1ff",
      3: "#9ab5c1ff",
    };
    return colors[tipoUsuario] || "#666666";
  };
  useEffect(() => {
    const storedIdUsuario = localStorage.getItem("idUsuario");
    if (storedIdUsuario) {
      setIdUsuario(storedIdUsuario);
      axios
        .get(`http://localhost:4000/api/auth/usuario/${storedIdUsuario}`)
        .then((res) => setIdUsuario(res.data.idUsuario))
        .catch((err) => {
          console.error("Error al obtener idUsuario:", err);
          // mostrarMensaje("Error al obtener idUsuario:", "error");
        });
    }
  }, []);

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:4000/api/auth/by-filter/`);
      setUsuarios(res.data);
      setUsuarioSeleccionado(null);
    } catch {
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = async () => {
    const filtrosAplicados = {};
    if (filtrosActivos.nombre && valoresFiltro.nombre.trim())
      filtrosAplicados.nombreUsuario = valoresFiltro.nombre;
    if (filtrosActivos.correo && valoresFiltro.correo.trim())
      filtrosAplicados.email = valoresFiltro.correo;
    if (filtrosActivos.estado && valoresFiltro.estado)
      filtrosAplicados.estado = valoresFiltro.estado;
    if (filtrosActivos.tipo && valoresFiltro.tipo)
      filtrosAplicados.tipo_usuario = valoresFiltro.tipo;
    if (filtrosActivos.especialidad && valoresFiltro.especialidad)
      filtrosAplicados.especialidad = valoresFiltro.especialidad;

    if (Object.keys(filtrosAplicados).length === 0) return obtenerUsuarios();

    try {
      setLoading(true);
      const queryParams = new URLSearchParams(filtrosAplicados).toString();
      const res = await axios.get(
        `http://localhost:4000/api/auth/by-filter?${queryParams}`
      );
      if (res.data.length === 0) {
        mostrarMensaje(
          "No se encontraron usuarios con esos filtros.",
          "warning"
        );
        obtenerUsuarios();
      } else {
        setUsuarios(res.data);
        mostrarMensaje("Búsqueda realizada correctamente.", "success");
      }
    } catch (error) {
      console.error("Error en búsqueda:", error);
      mostrarMensaje("Error al realizar la búsqueda.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLimpiarFiltros = () => {
    setFiltrosActivos({
      nombre: false,
      correo: false,
      estado: false,
      tipo: false,
      especialidad: false,
    });
    setValoresFiltro({
      nombre: "",
      correo: "",
      estado: "",
      tipo: "",
      especialidad: "",
    });
    obtenerUsuarios();
  };

  const handleSeleccionar = (usuario) => setUsuarioSeleccionado(usuario);

  const getIniciales = (nombre) => {
    return nombre
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  // Componente para mostrar información con icono
  const InfoItem = ({ icon, label, value }) => (
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <Box
        sx={{
          mr: 2,
          color: "#355C7D",
          display: "flex",
          alignItems: "center",
          minWidth: "24px",
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: "0.8rem" }}
        >
          {label}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: "medium" }}>
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
            p: 4,
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            backgroundColor: "#F4F6F8",
            maxWidth: "90%",
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {/* Header Principal */}
          <Box sx={{ textAlign: "center" }}>
            <Group sx={{ fontSize: 48, mb: 1, color: "#092181" }} />
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                color: "#092181",
                fontSize: { xs: "1.75rem", md: "2.25rem" },
              }}
            >
              Listado de Usuarios
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Visualiza todos los usuarios del sistema
            </Typography>
          </Box>

          {/* Filtros */}
          {!UsuarioSeleccionado && (
            <Slide in={!UsuarioSeleccionado} timeout={600} direction="up">
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  p: 3,
                  backgroundColor: "#f8f9ff",
                  border: "1px solid #e0e7ff",
                  borderRadius: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <FilterList sx={{ mr: 1, color: "#092181" }} />
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="#092181"
                    sx={{ flex: 1 }}
                  >
                    Filtros de Búsqueda
                  </Typography>
                </Box>

                {/* Checkboxes */}
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
                      label={
                        <Typography variant="body2" fontWeight="medium">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Typography>
                      }
                    />
                  ))}
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Campos */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  {filtrosActivos.nombre && (
                    <TextField
                      sx={{
                        flex: { xs: "1", sm: "0.5" },
                        minWidth: { xs: "100%", sm: "280px", md: "320px" },
                        maxWidth: { sm: "380px" },
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: "#ffffff",
                          "& fieldset": { borderColor: "#e0e7ff" },
                          "&:hover fieldset": { borderColor: "#092181" },
                          "&.Mui-focused fieldset": {
                            borderColor: "#092181",
                            borderWidth: 2,
                          },
                        },
                      }}
                      label="Nombre del usuario"
                      value={valoresFiltro.nombre}
                      onChange={(e) =>
                        setValoresFiltro({
                          ...valoresFiltro,
                          nombre: e.target.value,
                        })
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                  {filtrosActivos.correo && (
                    <TextField
                      sx={{
                        flex: { xs: "1", sm: "0.5" },
                        minWidth: { xs: "100%", sm: "280px", md: "320px" },
                        maxWidth: { sm: "380px" },
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: "#ffffff",
                          "& fieldset": { borderColor: "#e0e7ff" },
                          "&:hover fieldset": { borderColor: "#092181" },
                          "&.Mui-focused fieldset": {
                            borderColor: "#092181",
                            borderWidth: 2,
                          },
                        },
                      }}
                      label="Correo electrónico"
                      value={valoresFiltro.correo}
                      onChange={(e) =>
                        setValoresFiltro({
                          ...valoresFiltro,
                          correo: e.target.value,
                        })
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                  {filtrosActivos.estado && (
                    <TextField
                      sx={{
                        flex: { xs: "1", sm: "0.5" },
                        minWidth: { xs: "100%", sm: "280px", md: "320px" },
                        maxWidth: { sm: "380px" },
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: "#ffffff",
                          "& fieldset": { borderColor: "#e0e7ff" },
                          "&:hover fieldset": { borderColor: "#092181" },
                          "&.Mui-focused fieldset": {
                            borderColor: "#092181",
                            borderWidth: 2,
                          },
                        },
                      }}
                      label="Estado"
                      value={valoresFiltro.estado}
                      onChange={(e) =>
                        setValoresFiltro({
                          ...valoresFiltro,
                          estado: e.target.value,
                        })
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FmdGoodIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                  {filtrosActivos.tipo && (
                    <FormControl
                      sx={{
                        flex: { xs: "1", sm: "0.5" },
                        minWidth: { xs: "100%", sm: "280px", md: "320px" },
                        maxWidth: { sm: "380px" },
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: "#ffffff",
                          "& fieldset": { borderColor: "#e0e7ff" },
                          "&:hover fieldset": { borderColor: "#092181" },
                          "&.Mui-focused fieldset": {
                            borderColor: "#092181",
                            borderWidth: 2,
                          },
                        },
                      }}
                    >
                      <InputLabel sx={{ color: "#2D5D7B", fontWeight: "bold" }}>
                        Tipo de usuario
                      </InputLabel>
                      <Select
                        value={valoresFiltro.tipo}
                        onChange={(e) =>
                          setValoresFiltro({
                            ...valoresFiltro,
                            tipo: e.target.value,
                          })
                        }
                        label="Tipo de Usuario"
                      >
                        {Object.entries(tipoUsuario).map(([val, text]) => (
                          <MenuItem key={val} value={val}>
                            {text}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  {filtrosActivos.especialidad && (
                    <FormControl
                      sx={{
                        flex: { xs: "1", sm: "0.3" },
                        minWidth: { xs: "100%", sm: "280px", md: "320px" },
                        maxWidth: { sm: "380px" },
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: "#ffffff",
                          "& fieldset": { borderColor: "#e0e7ff" },
                          "&:hover fieldset": { borderColor: "#092181" },
                          "&.Mui-focused fieldset": {
                            borderColor: "#092181",
                            borderWidth: 2,
                          },
                        },
                      }}
                    >
                      <InputLabel sx={{ color: "#2D5D7B", fontWeight: "bold" }}>
                        Especialidad
                      </InputLabel>
                      <Select
                        value={valoresFiltro.especialidad}
                        onChange={(e) =>
                          setValoresFiltro({
                            ...valoresFiltro,
                            especialidad: e.target.value,
                          })
                        }
                        label="Tipo de Usuario"
                      >
                        {Object.entries(especialidadMap).map(([val, text]) => (
                          <MenuItem key={val} value={val}>
                            {text}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Box>

                {/* Botones */}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    mt: 3,
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={<Search />}
                    onClick={handleBuscar}
                    sx={{
                      textTransform: "capitalize",
                      background: "#2D5D7B",
                      "&:hover": { background: "#092181" },
                    }}
                  >
                    Buscar
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<RestartAlt />}
                    onClick={handleLimpiarFiltros}
                    sx={{
                      textTransform: "capitalize",
                      borderColor: "#092181",
                      color: "#092181",
                      "&:hover": {
                        backgroundColor: "#f0f4ff",
                        borderColor: "#092181",
                      },
                    }}
                  >
                    Limpiar
                  </Button>
                </Box>
                {/* Snackbar para mensajes  */}
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
              </Card>
            </Slide>
          )}

          {/* Listado de usuarios */}
          <Fade in={!loading} timeout={500}>
            <Box>
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    py: 10,
                  }}
                >
                  <CircularProgress size={50} sx={{ color: "#092181" }} />
                </Box>
              ) : !UsuarioSeleccionado ? (
                <Tooltip
                  title="Selecciona una tarjeta para ver más información"
                  arrow
                >
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <PeopleAltIcon
                          sx={{ color: "#092181", fontSize: 32 }}
                        />
                        <Typography
                          variant="h5"
                          sx={{ color: "#092181", fontWeight: "bold" }}
                        >
                          Usuarios Registrados
                        </Typography>
                      </Box>
                      <Chip
                        label={`${Usuarios.length} registros`}
                        sx={{
                          backgroundColor: "#092181",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      />
                    </Box>

                    {Usuarios.length === 0 ? (
                      <Card
                        sx={{
                          p: 6,
                          textAlign: "center",
                          borderRadius: 3,
                          backgroundColor: "#f8f9ff",
                          border: "1px solid #e0e7ff",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 2,
                          flex: 1,
                          minHeight: 300,
                        }}
                      >
                        <Group sx={{ fontSize: 64, color: "#666", mb: 2 }} />
                        <Typography
                          variant="h6"
                          sx={{ color: "#666", mb: 1, fontWeight: "bold" }}
                        >
                          No se han registrado usuarios aún
                        </Typography>
                      </Card>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "center",
                          gap: 2,
                        }}
                      >
                        {Usuarios.map((usuario) => (
                          <Card
                            key={usuario.idusuario}
                            onClick={() => handleSeleccionar(usuario)}
                            sx={{
                              cursor: "pointer",
                              borderRadius: 3,
                              border: "1px solid #e0e7ff",
                              backgroundColor: "#f9fafc",
                              width: "350px",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                boxShadow: "0 8px 20px rgba(9, 33, 129, 0.15)",
                                transform: "translateY(-4px)",
                                borderColor: "#092181",
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
                                  flexDirection: "column",
                                  alignItems: "center",
                                  textAlign: "center",
                                  gap: 1,
                                }}
                              >
                                <Avatar
                                  sx={{
                                    bgcolor: getAvatarColor(
                                      usuario.tipo_usuario
                                    ),
                                    width: 64,
                                    height: 64,
                                    fontSize: "1.2rem",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {getIniciales(usuario.nombreUsuario)}
                                </Avatar>

                                <Typography
                                  variant="h6"
                                  fontWeight="bold"
                                  noWrap
                                >
                                  {usuario.nombreUsuario}
                                </Typography>
                                <Chip
                                  label={tipoUsuario[usuario.tipo_usuario]}
                                  size="small"
                                  sx={{
                                    bgcolor: getChipColor(usuario.tipo_usuario),
                                  }}
                                />

                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Email sx={{ fontSize: 16, mr: 0.5 }} />
                                  {usuario.email}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <FmdGoodIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                  {usuario.estado}
                                </Typography>
                                {usuario.tipo_usuario === 2 && (
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <LocalHospital
                                      sx={{ fontSize: 16, mr: 0.5 }}
                                    />
                                    {especialidadMap[usuario.especialidad]}
                                  </Typography>
                                )}
                              </Box>
                            </CardContent>
                          </Card>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Tooltip>
              ) : (
                /* Vista Detalle */
                <Card sx={{ borderRadius: 3, p: 3 }}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: getAvatarColor(
                            UsuarioSeleccionado.tipo_usuario
                          ),
                          width: 80,
                          height: 80,
                          fontSize: "1.8rem",
                          fontWeight: "bold",
                        }}
                      >
                        {getIniciales(UsuarioSeleccionado.nombreUsuario)}
                      </Avatar>
                      <Typography variant="h4" fontWeight="bold">
                        {UsuarioSeleccionado.nombreUsuario}
                      </Typography>
                      <Chip
                        label={tipoUsuario[UsuarioSeleccionado.tipo_usuario]}
                        sx={{
                          bgcolor: getChipColor(
                            UsuarioSeleccionado.tipo_usuario
                          ),
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mt: 3,
                      }}
                    >
                      <Card variant="outlined" sx={{ p: 2 }}>
                        <Box display="flex" alignItems="center" mb={3}>
                          <Email
                            sx={{ color: "#2D5D7B", fontSize: 32, mr: 2 }}
                          />
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="#092181"
                          >
                            Información de Contacto
                          </Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />
                        <InfoItem
                          icon={<Email />}
                          label="Correo electrónico"
                          value={UsuarioSeleccionado.email}
                        />
                        <InfoItem
                          icon={<LocationOn />}
                          label="Dirección"
                          value={`${UsuarioSeleccionado.calle || ""}, ${
                            UsuarioSeleccionado.municipio || ""
                          }, ${UsuarioSeleccionado.estado || ""}`
                            .trim()
                            .replace(/^,\s*|,\s*$/g, "")}
                        />
                      </Card>

                      {UsuarioSeleccionado.tipo_usuario === 2 && (
                        <Card variant="outlined" sx={{ p: 2 }}>
                          <Box display="flex" alignItems="center" mb={3}>
                            <Favorite
                              sx={{ color: "#2D5D7B", fontSize: 32, mr: 2 }}
                            />
                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              color="#092181"
                            >
                              {UsuarioSeleccionado.tipo_usuario === 2
                                ? "Información Profesional"
                                : "Información de Salud"}
                            </Typography>
                          </Box>
                          <Divider sx={{ mb: 3 }} />
                          <InfoItem
                            icon={<MedicalServices />}
                            label="Especialidad"
                            value={
                              especialidadMap[
                                UsuarioSeleccionado.especialidad
                              ] || UsuarioSeleccionado.especialidad
                            }
                          />
                        </Card>
                      )}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "center" }}>
                    <Button
                      variant="outlined"
                      startIcon={<ArrowBack />}
                      onClick={() => setUsuarioSeleccionado(null)}
                      sx={{
                        textTransform: "capitalize",
                        borderColor: "#092181",
                        color: "#092181",
                        px: 4,
                        "&:hover": {
                          backgroundColor: "#f0f4ff",
                          borderColor: "#092181",
                        },
                      }}
                    >
                      Regresar
                    </Button>
                  </CardActions>
                </Card>
              )}
            </Box>
          </Fade>
        </Paper>
      </Container>
    </Layout>
  );
};

export default ListadoUsuarios;
