import { useState, useEffect } from "react";
import Layout from "../components/LayoutProf";
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Cake,
  Wc,
  Assignment,
  Favorite,
  Badge,
  MedicalServices,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerProfesional() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("success");

  const navigate = useNavigate();

  // Función para mostrar mensajes
  const mostrarMensaje = (msg, severity = "info") => {
    setMensaje(msg);
    setTipo(severity);
    setOpenSnackbar(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Obtener el ID del usuario desde localStorage
  const getUserId = () => {
    return localStorage.getItem("idUsuario");
  };

  // Cargar los datos del usuario al montar el componente
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userId = getUserId();

        if (!userId) {
          mostrarMensaje(
            "No se encontró información del usuario. Por favor, inicia sesión nuevamente.",
            "warning"
          );
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `http://localhost:4000/api/auth/by-id/${userId}`
        );
        setUserData(res.data);
      } catch (err) {
        console.error("Error al cargar usuario:", err);
        const errorMessage =
          err.response?.data?.message ||
          "Error al cargar los datos del usuario";
        mostrarMensaje(errorMessage, "error");
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Diccionario género
  const generoMap = {
    1: "Masculino",
    2: "Femenino",
    3: "Otro",
  };

  // Diccionario especialidades
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

  // Formateo fecha
  const formatDate = (dateString) => {
    if (!dateString) return "No especificada";

    try {
      return new Date(dateString).toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formateando fecha:", error);
      return "Fecha inválida";
    }
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

  // Estados de carga y error
  if (loading) {
    return (
      <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error && !userData) {
    return (
      <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate("/login")}
        >
          Volver al Login
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Layout>
        <Box
          sx={{
            flexGrow: 1,
            minHeight: "100vh",
            backgroundColor: "#F4F6F8",
            paddingBottom: "2rem",
          }}
        >
          {/* Contenido principal */}
          <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
            <Paper
              elevation={4}
              sx={{
                p: 4,
                borderRadius: 3,
                backgroundColor: "#F4F6F8",
              }}
            >
              <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                sx={{ color: "#092181", mb: 4 }}
              >
                Información del Paciente
              </Typography>

              {userData && (
                <Grid container spacing={4}>
                  {/* Información Personal */}
                  <Grid item xs={12} md={4}>
                    <Card
                      elevation={3}
                      sx={{
                        borderRadius: 3,
                        backgroundColor: "#fff",
                        height: "100%",
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box display="flex" alignItems="center" mb={3}>
                          <Person
                            sx={{ color: "#2D5D7B", fontSize: 32, mr: 2 }}
                          />
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="primary"
                          >
                            Información Personal
                          </Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />

                        <InfoItem
                          icon={<Badge />}
                          label="Nombre completo"
                          value={`${userData.Nombre || ""} ${
                            userData.aPaterno || ""
                          } ${userData.aMaterno || ""}`.trim()}
                        />
                        <InfoItem
                          icon={<Cake />}
                          label="Fecha de nacimiento"
                          value={formatDate(userData.fecha_nacimiento)}
                        />
                        <InfoItem
                          icon={<Wc />}
                          label="Género"
                          value={generoMap[userData.sexo] || userData.sexo}
                        />
                        <InfoItem
                          icon={<Assignment />}
                          label="CURP"
                          value={userData.curp}
                        />
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Información de Contacto */}
                  <Grid item xs={12} md={4}>
                    <Card
                      elevation={3}
                      sx={{
                        borderRadius: 3,
                        backgroundColor: "#fff",
                        height: "100%",
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box display="flex" alignItems="center" mb={3}>
                          <Email
                            sx={{ color: "#2D5D7B", fontSize: 32, mr: 2 }}
                          />
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="primary"
                          >
                            Información de Contacto
                          </Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />

                        <InfoItem
                          icon={<Email />}
                          label="Correo electrónico"
                          value={userData.email}
                        />
                        <InfoItem
                          icon={<Phone />}
                          label="Teléfono"
                          value={userData.telefono}
                        />
                        <InfoItem
                          icon={<LocationOn />}
                          label="Dirección"
                          value={`${userData.calle || ""}, ${
                            userData.municipio || ""
                          }, ${userData.estado || ""}`
                            .trim()
                            .replace(/^,\s*|,\s*$/g, "")}
                        />
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Información de Salud y Profesional */}
                  <Grid item xs={12} md={4}>
                    <Card
                      elevation={3}
                      sx={{
                        borderRadius: 3,
                        backgroundColor: "#fff",
                        height: "100%",
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box display="flex" alignItems="center" mb={3}>
                          <Favorite
                            sx={{ color: "#2D5D7B", fontSize: 32, mr: 2 }}
                          />
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="primary"
                          >
                            {userData.tipo_usuario === 2
                              ? "Información Profesional"
                              : "Información de Salud"}
                          </Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />

                        {userData.tipo_usuario === 3 && (
                          <InfoItem
                            icon={<Favorite />}
                            label="Nivel de Estrés"
                            value={
                              userData.nivel_estres
                                ? `${userData.nivel_estres}/10`
                                : "No evaluado"
                            }
                          />
                        )}

                        {userData.tipo_usuario === 2 && (
                          <>
                            <InfoItem
                              icon={<MedicalServices />}
                              label="Especialidad"
                              value={
                                especialidadMap[userData.especialidad] ||
                                userData.especialidad
                              }
                            />
                            <InfoItem
                              icon={<Badge />}
                              label="Cédula Profesional"
                              value={userData.cedula}
                            />
                          </>
                        )}

                        {/* Información general del tipo de usuario */}
                        <InfoItem
                          icon={<Person />}
                          label="Tipo de Usuario"
                          value={
                            userData.tipo_usuario === 2
                              ? "Profesional de la Salud"
                              : userData.tipo_usuario === 3
                              ? "Paciente"
                              : "Administrador"
                          }
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </Paper>
          </Container>
        </Box>

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
      </Layout>
    </>
  );
}
