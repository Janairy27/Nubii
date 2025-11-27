import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Box,
  Link,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  ArrowBackIosNewOutlined,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LoginIcon from "@mui/icons-material/Login";
import axios from "axios";

export default function InicioSesion() {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("success");

  const mostrarMensaje = (msg, severity = "info") => {
    setMensaje(msg);
    setTipo(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  useEffect(() => {
    // Verifica si la navegación contiene un mensaje de éxito de registro
    if (location.state?.registrationSuccess) {
      // Llama a la función local que muestra el Snackbar en este componente
      mostrarMensaje(location.state.message, location.state.severity);

      // Limpia el estado para que el mensaje no se muestre si el usuario recarga
      // Esto evita que el mensaje aparezca cada vez que se carga el login
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]); // Dependencias

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("idUsuario", res.data.idUsuario);
      localStorage.setItem("Nombre", res.data.Nombre);
      localStorage.setItem("aPaterno", res.data.aPaterno);

      if (res.data.role === 1) {
        navigate("/dashboardAdmin", {
          state: {
            loginMessage: "Credenciales válidas, has iniciado sesión",
            loginMessageType: "success",
          },
        });
      } else if (res.data.role === 2) {
        // 1. Mostrar el mensaje PRIMERO
        mostrarMensaje(
          "Credenciales válidas, en un momento serás dirigido al panel principal",
          "success"
        );

        // 2. Retrasar la navegación
        setTimeout(() => {
          navigate("/dashboardProf");
        }, 6000); // Espera 1.5 segundos
      } else {
        // 1. Mostrar el mensaje PRIMERO
        mostrarMensaje(
          "Credenciales válidas, en un momento serás dirigido al panel principal",
          "success"
        );

        // 2. Retrasar la navegación
        setTimeout(() => {
          navigate("/dashboard");
        }, 6000); // Espera 1.5 segundos
      }
    } catch (err) {
      const mensaje =
        err.response?.data?.message ||
        "Error al iniciar sesión. Verifica tus datos.";
      mostrarMensaje(mensaje, "error");
    }
  };

  const handleBack = () => navigate("/");

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundImage:
          'url("https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1470&q=80")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        px: 2,
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
        },
        animation: "fadeInBg 2s ease forwards",
        "@keyframes fadeInBg": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
          animation: "fadeInUp 1.2s ease forwards",
          opacity: 0,
          transform: "translateY(30px)",
          "@keyframes fadeInUp": {
            from: { opacity: 0, transform: "translateY(30px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        {/* Botón Volver */}
        <Box
          sx={{
            alignSelf: "flex-start",
            display: "flex",
            justifyContent: "flex-start",
            width: "100%",
          }}
        >
          <Button
            onClick={handleBack}
            startIcon={<ArrowBackIosNewOutlined />}
            sx={{
              mb: 2,
              color: "#2D5D7B",
              backgroundColor: "rgba(255,255,255,0.9)",
              fontWeight: "bold",
              borderRadius: 3,
              textTransform: "capitalize",
              "&:hover": {
                backgroundColor: "rgba(245,227,233,0.8)",
                color: "#67121A",
              },
            }}
          >
            Volver
          </Button>
        </Box>

        {/* Contenedor principal */}
        <Paper
          elevation={10}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            backgroundColor: "white",
            border: "2px solid #F5E3E9",
            width: "100%",
            maxWidth: 500,
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          }}
        >
          {/* Logo y títulos */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
              textAlign: "center",
            }}
          >
            <Box
              component="img"
              src="/logo.png"
              alt="Nubii Logo"
              sx={{
                width: 80,
                height: 80,
                mb: 2,
                borderRadius: "50%",
                backgroundColor: "#F5E3E9",
                padding: 1,
                border: "3px solid #355C7D",
              }}
            />
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                color: "#092181",
                fontSize: { xs: "2rem", sm: "2.5rem" },
              }}
            >
              Nubii
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "#2D5D7B",
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
              }}
            >
              Inicio de sesión
            </Typography>
          </Box>

          {/* Formulario */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <TextField
              label="Correo electrónico"
              type="email"
              required
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  "& fieldset": { borderColor: "#CBD4D8" },
                  "&:hover fieldset": { borderColor: "#2D5D7B" },
                  "&.Mui-focused fieldset": { borderColor: "#092181" },
                },
              }}
            />

            <TextField
              label="Contraseña"
              required
              fullWidth
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: "#2D5D7B" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  "& fieldset": { borderColor: "#CBD4D8" },
                  "&:hover fieldset": { borderColor: "#2D5D7B" },
                  "&.Mui-focused fieldset": { borderColor: "#092181" },
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              startIcon={<LoginIcon />}
              sx={{
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: "bold",
                borderRadius: 3,
                backgroundColor: "#355C7D",
                textTransform: "capitalize",
                "&:hover": {
                  backgroundColor: "#2D5D7B",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 8px rgba(53,92,125,0.3)",
                },
              }}
            >
              Iniciar sesión
            </Button>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 1,
              }}
            >
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/forgot-password")}
                sx={{
                  color: "#2D5D7B",
                  fontWeight: "bold",
                  "&:hover": { color: "#092181" },
                }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </Box>
          </Box>

          {/* Registro */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 3,
              gap: 0.5,
              flexWrap: "wrap",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              ¿Aún no tienes cuenta?
            </Typography>
            <Link
              component="button"
              variant="body2"
              sx={{
                color: "#2D5D7B",
                fontWeight: "bold",
                "&:hover": { textDecoration: "underline", color: "#092181" },
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
              onClick={() => navigate("/registro")}
            >
              Regístrate
              <PersonAddIcon fontSize="small" />
            </Link>
          </Box>
        </Paper>

        {/* Snackbar */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
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
    </Box>
  );
}
