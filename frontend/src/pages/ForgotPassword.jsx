import { useState } from "react";
import axios from "axios";
import {
  TextField,
  Typography,
  Box,
  Button,
  Snackbar,
  Alert,
  Container,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { ArrowBackIosNewOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("success");

  const mostrarMensaje = (msg, severity = "info") => {
    setMensaje(msg);
    setTipo(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:4000/api/auth/forgot-password`, {
        email,
      });
      mostrarMensaje(
        "Si el correo existe, se envió un enlace para restablecer tu contraseña.",
        "success"
      );
      setOpenSnackbar(true);
      //setSeverity("success");
      //setOpen(true);
    } catch (err) {
      if (err.response) {
        console.error("Response:", err.response.status, err.response.data);
        mostrarMensaje(
          err.response.data?.message || "Error en el servidor",
          "error"
        );
      } else if (err.request) {
        console.error("No hubo respuesta del servidor", err.request);
        mostrarMensaje("No hubo respuesta del servidor", "error");
      } else {
        console.error("Error al configurar la petición", err.message);
        mostrarMensaje("Error de configuración", "error");
      }
      //setSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleBack = () => {
    navigate("/login");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage:
          'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Arial, sans-serif",
        padding: 2,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Button
          onClick={handleBack}
          startIcon={<ArrowBackIosNewOutlined />}
          sx={{
            textTransform: "capitalize",
            alignSelf: "flex-start",
            color: "#2D5D7B",
            backgroundColor: "rgba(255,255,255,0.9)",
            fontWeight: "bold",
            borderRadius: 3,
            px: 2,
            py: 1,
            "&:hover": { backgroundColor: "#F5E3E9", color: "#67121A" },
          }}
        >
          Volver
        </Button>

        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(5px)",
            borderRadius: 3,
            boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
            padding: { xs: 3, sm: 4 },
            width: "100%",
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#0A2361",
              mb: 3,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Recuperar contraseña
          </Typography>

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
              variant="outlined"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#CBD4D8" },
                  "&:hover fieldset": { borderColor: "#355C7D" },
                  "&.Mui-focused fieldset": { borderColor: "#355C7D" },
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              startIcon={<SendIcon />}
              sx={{
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: "bold",
                borderRadius: 3,
                backgroundColor: "#355C7D",
                color: "#fff",
                textTransform: "capitalize",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#2D5D7B",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 8px rgba(53, 92, 125, 0.3)",
                },
              }}
            >
              Enviar enlace
            </Button>
          </Box>

          <Typography
            sx={{
              mt: 2,
              fontSize: "0.9rem",
              textAlign: "center",
              color: "#555",
            }}
          >
            Ingresa tu correo y te enviaremos un enlace para restablecer tu
            contraseña.
          </Typography>
          {/* Snackbar para mensajes */}

          <Snackbar
            open={openSnackbar}
            autoHideDuration={8000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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
        </Box>
      </Container>
    </Box>
  );
}
