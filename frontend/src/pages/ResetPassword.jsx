import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Container,
  InputAdornment,
  IconButton,
  Snackbar
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

export default function ResetPassword() {
  const [contrasena, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState(false);
  const token = new URLSearchParams(useLocation().search).get("token");
  const [showPassword, setShowPassword] = useState(false);
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post("http://localhost:4000/api/auth/reset-password", {
        token,
        contrasena,
        
      });
      console.log("Token recibido en frontend:", token);
      mostrarMensaje("Contraseña actualizada correctamente 🌿","success");
      setError(false);
    } catch (err) {
      console.error("Error completo de Axios:", err);
    let mensajeError = "Error al actualizar la contraseña.";
     if (err.response && err.response.data) {
            const dataError = err.response.data;
            if (dataError.errores && Array.isArray(dataError.errores) && dataError.errores.length > 0) {
                mensajeError = `Errores de validación: ${dataError.errores.join('; ')}`;
            } 
            else if (dataError.message) {
                 mensajeError = dataError.message;
            }
        }
      mostrarMensaje(mensajeError, "error");
    }
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
        p: 2,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(6px)",
          borderRadius: 4,
          boxShadow: "0 6px 20px rgba(45,93,123,0.2)",
          p: { xs: 3, sm: 4 },
          width: "100%",
          maxWidth: 420,
        }}
      >
        {/* Encabezado con logo y texto */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
            textAlign: "center",
          }}
        >
          <img
            src="/logo.png"
            alt="Nubii logo"
            style={{
              width: 70,
              marginBottom: 10,
              borderRadius: "12px",
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "#2D5D7B",
              mb: 1,
            }}
          >
            Restablecer contraseña
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#777777",
              fontStyle: "italic",
            }}
          >
            Tu bienestar digital comienza con seguridad 💚
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
            type={showPassword ? "text" : "password"}
            label="Nueva contraseña"
            variant="outlined"
            value={contrasena}
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


            required
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "& fieldset": { borderColor: "#CBD4D8" },
                "&:hover fieldset": { borderColor: "#2D5D7B" },
                "&.Mui-focused fieldset": { borderColor: "#092181" },
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            startIcon={<LockResetIcon />}
            sx={{
              textTransform: "capitalize",
              backgroundColor: "#355C7D",
              color: "#F4F6F8",
              fontWeight: 600,
              borderRadius: 3,
              py: 1.4,
              fontSize: "1rem",
              transition: "0.3s ease",
              "&:hover": {
                backgroundColor: "#2D5D7B",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 8px rgba(53, 92, 125, 0.3)",
              },
            }}
          >
            Cambiar contraseña
          </Button>
        </Box>

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

        {/* Pie de página */}
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 4,
            color: "#67121A",
            fontWeight: 500,
            letterSpacing: "0.5px",
            textAlign: "center",
          }}
        >
          Nubii - Tu espacio de bienestar mental 🌸
        </Typography>
      </Container>
    </Box>
  );
}
