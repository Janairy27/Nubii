import { useState, useEffect, useCallback, useMemo, memo } from "react";
import Layout from "../components/LayoutAdmin";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
  Alert,
  MenuItem,
  Grid,
  Container,
  Snackbar,
  Card,
  CardContent,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
// Importar iconos para las secciones
import {
  Person,
  Email,
  Favorite,
  MedicalServices,
  Lock,
} from "@mui/icons-material";
// Componente memoizado para campos normales
const MemoizedTextField = memo(
  ({ label, value, onChange, type = "text", ...props }) => (
    <TextField
      label={label}
      value={value || ""}
      onChange={onChange}
      type={type}
      InputLabelProps={type === "date" ? { shrink: true } : {}}
      {...props}
    />
  )
);

// Componente memoizado específico para selects
const MemoizedSelectField = memo(
  ({ label, value, onChange, children, ...props }) => (
    <TextField
      select
      label={label}
      value={value || ""}
      onChange={onChange}
      {...props}
    >
      {children}
    </TextField>
  )
);

MemoizedTextField.displayName = "MemoizedTextField";
MemoizedSelectField.displayName = "MemoizedSelectField";

export default function ActualizarAdmin() {
  const [idUsuario, setIdUsuario] = useState("");
  // const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("success");

  const navigate = useNavigate();
  // Estilos memoizados
  const textFieldStyles = useMemo(
    () => ({
      "& .MuiOutlinedInput-root": {
        borderRadius: "12px",
        backgroundColor: "#fff",
        "& fieldset": { borderColor: "#CBD4D8" },
        "&:hover fieldset": { borderColor: "#355C7D" },
        "&.Mui-focused fieldset": {
          borderColor: "#092181",
          borderWidth: "2px",
        },
      },
      "& .MuiInputLabel-root": { color: "#2D5D7B", fontWeight: "bold" },
      flex: "1 1 300px",
    }),
    []
  );
  const fullWidthStyles = useMemo(
    () => ({
      ...textFieldStyles,
      flex: "1 1 620px",
    }),
    [textFieldStyles]
  );

  const mostrarMensaje = useCallback((msg, severity = "info") => {
    setMensaje(msg);
    setTipo(severity);
    setOpenSnackbar(true);
  }, []);

  const handleCloseSnackbar = useCallback(() => setOpenSnackbar(false), []);

  useEffect(() => {
    const storedId = localStorage.getItem("idUsuario");
    if (storedId) {
      setIdUsuario(storedId);
      fetchUserData(storedId);
    } else {
      mostrarMensaje(
        "No se encontró el ID del usuario. Inicia sesión nuevamente.",
        "error"
      );
    }
  }, [mostrarMensaje]);

  const fetchUserData = useCallback(
    async (id) => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/auth/by-id/${id}`
        );
        const userData = res.data;

        // Formatear fecha para el input date
        const formattedData = {
          ...userData,
          fecha_nacimiento: userData.fecha_nacimiento
            ? new Date(userData.fecha_nacimiento).toISOString().split("T")[0]
            : "",
        };

        setFormData(formattedData);
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        mostrarMensaje(
          "No se pudieron cargar los datos del usuario.",
          "warning"
        );
      }
    },
    [mostrarMensaje]
  );

  // Crear handlers memoizados para cada campo
  const createFieldHandler = useCallback((fieldName) => {
    return (event) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
    };
  }, []);

  // Handlers pre-creados para cada campo
  const handlers = useMemo(
    () => ({
      Nombre: createFieldHandler("Nombre"),
      aPaterno: createFieldHandler("aPaterno"),
      aMaterno: createFieldHandler("aMaterno"),
      fecha_nacimiento: createFieldHandler("fecha_nacimiento"),
      curp: createFieldHandler("curp"),
      sexo: createFieldHandler("sexo"),
      email: createFieldHandler("email"),
      telefono: createFieldHandler("telefono"),
      estado: createFieldHandler("estado"),
      municipio: createFieldHandler("municipio"),
      calle: createFieldHandler("calle"),
      newPassword: createFieldHandler("newPassword"),
      nivel_estres: createFieldHandler("nivel_estres"),
      especialidad: createFieldHandler("especialidad"),
      cedula: createFieldHandler("cedula"),
    }),
    [createFieldHandler]
  );

  const handleUpdate = useCallback(async () => {
    try {
      const url = `http://localhost:4000/api/auth/update/${formData.idUsuario}`;

      const payload = {
        Nombre: formData.Nombre,
        aPaterno: formData.aPaterno,
        aMaterno: formData.aMaterno,
        fecha_nacimiento: formData.fecha_nacimiento || null,
        sexo: formData.sexo,
        telefono: formData.telefono,
        email: formData.email,
        curp: formData.curp,
        estado: formData.estado,
        municipio: formData.municipio,
        calle: formData.calle,
        nivel_estres: formData.nivel_estres
          ? Number(formData.nivel_estres)
          : null,
        especialidad: formData.especialidad,
        cedula: formData.cedula,
      };

      if (formData.newPassword && formData.newPassword.trim() !== "") {
        payload.contrasena = formData.newPassword;
      }

      await axios.put(url, payload);
      mostrarMensaje("Usuario actualizado correctamente ", "success");
    } catch (err) {
      //Log completo del error para depuración
      console.error("Error completo de Axios:", err);
      let mensajeError = "Error al actualizar la usuario.";
      // Verificar que la respuesta 400 tenga datos estructurados
      if (err.response && err.response.data) {
        const dataError = err.response.data;

        if (
          dataError.errores &&
          Array.isArray(dataError.errores) &&
          dataError.errores.length > 0
        ) {
          // Unir los errores de validación en una sola cadena
          mensajeError = `Errores de validación: ${dataError.errores.join(
            "; "
          )}`;
        } else if (dataError.message) {
          mensajeError = dataError.message;
        }
      }
      // Mostrar el mensaje de error específico o el genérico
      mostrarMensaje(mensajeError, "error");
    }
  }, [formData, mostrarMensaje]);

  // Componente para secciones del formulario
  const FormSection = useCallback(
    ({ icon, title, children }) => (
      <Card
        elevation={3}
        sx={{ borderRadius: 3, backgroundColor: "#fff", mb: 3 }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" mb={3}>
            {icon}
            <Typography
              variant="h6"
              fontWeight="bold"
              color="primary"
              sx={{ ml: 2 }}
            >
              {title}
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Box display="flex" flexWrap="wrap" gap={2}>
            {children}
          </Box>
        </CardContent>
      </Card>
    ),
    []
  );

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
          <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Paper
              elevation={4}
              sx={{ p: 4, borderRadius: 3, backgroundColor: "#ffffffff" }}
            >
              <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                sx={{ color: "#092181", mb: 4 }}
              >
                Actualizar Información del Usuario
              </Typography>

              {formData.idUsuario && (
                <>
                  {/* Información Personal */}
                  <FormSection
                    icon={<Person sx={{ color: "#2D5D7B", fontSize: 32 }} />}
                    title="Información Personal"
                  >
                    <Grid item xs={12} sm={6}>
                      <MemoizedTextField
                        fullWidth
                        label="Nombre"
                        value={formData.Nombre}
                        onChange={handlers.Nombre}
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MemoizedTextField
                        fullWidth
                        label="Apellido Paterno"
                        value={formData.aPaterno}
                        onChange={handlers.aPaterno}
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MemoizedTextField
                        fullWidth
                        label="Apellido Materno"
                        value={formData.aMaterno}
                        onChange={handlers.aMaterno}
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MemoizedTextField
                        fullWidth
                        label="Fecha de Nacimiento"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={formData.fecha_nacimiento}
                        onChange={handlers.fecha_nacimiento}
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MemoizedTextField
                        fullWidth
                        label="CURP"
                        value={formData.curp}
                        onChange={handlers.curp}
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MemoizedSelectField
                        fullWidth
                        select
                        label="Género"
                        value={formData.sexo || ""}
                        onChange={handlers.sexo}
                        sx={textFieldStyles}
                      >
                        <MenuItem value="1">Masculino</MenuItem>
                        <MenuItem value="2">Femenino</MenuItem>
                        <MenuItem value="3">Otro</MenuItem>
                      </MemoizedSelectField>
                    </Grid>
                  </FormSection>

                  {/* Información de Contacto */}
                  <FormSection
                    icon={<Email sx={{ color: "#2D5D7B", fontSize: 32 }} />}
                    title="Información de Contacto"
                  >
                    <Grid item xs={12} sm={6}>
                      <MemoizedTextField
                        fullWidth
                        label="Email"
                        value={formData.email}
                        onChange={handlers.email}
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MemoizedTextField
                        fullWidth
                        label="Teléfono"
                        value={formData.telefono}
                        onChange={handlers.telefono}
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MemoizedTextField
                        fullWidth
                        label="Estado"
                        value={formData.estado}
                        onChange={handlers.estado}
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MemoizedTextField
                        fullWidth
                        label="Municipio"
                        value={formData.municipio}
                        onChange={handlers.municipio}
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <MemoizedTextField
                        fullWidth
                        label="Calle"
                        value={formData.calle}
                        onChange={handlers.calle}
                        sx={textFieldStyles}
                      />
                    </Grid>
                  </FormSection>

                  {/* Seguridad */}
                  <FormSection
                    icon={<Lock sx={{ color: "#2D5D7B", fontSize: 32 }} />}
                    title="Seguridad"
                  >
                    <Grid item xs={12}>
                      <MemoizedTextField
                        fullWidth
                        type="password"
                        label="Nueva Contraseña (déjala vacía si no deseas cambiarla)"
                        value={formData.newPassword || ""}
                        onChange={handlers.newPassword}
                        sx={textFieldStyles}
                      />
                    </Grid>
                  </FormSection>

                  {/* Información Específica por Tipo de Usuario */}
                  {formData.tipo_usuario === 3 && (
                    <FormSection
                      icon={
                        <Favorite sx={{ color: "#2D5D7B", fontSize: 32 }} />
                      }
                      title="Información de Salud"
                    >
                      <Grid item xs={24}>
                        <TextField
                          fullWidth
                          label="Nivel de Estrés (1-10)"
                          type="number"
                          inputProps={{ min: 1, max: 10 }}
                          value={formData.nivel_estres || ""}
                          onChange={handlers.nivel_estres}
                          sx={textFieldStyles}
                        />
                      </Grid>
                    </FormSection>
                  )}

                  {formData.tipo_usuario === 2 && (
                    <FormSection
                      icon={
                        <MedicalServices
                          sx={{ color: "#2D5D7B", fontSize: 32 }}
                        />
                      }
                      title="Información Profesional"
                    >
                      <Grid item xs={12} sm={6}>
                        <TextField
                          select
                          fullWidth
                          label="Especialidad"
                          value={formData.especialidad || ""}
                          onChange={handlers.especialidad}
                          sx={textFieldStyles}
                        >
                          <MenuItem value="1">Psicólogo</MenuItem>
                          <MenuItem value="2">Psiquiatra</MenuItem>
                          <MenuItem value="3">Terapeuta</MenuItem>
                          <MenuItem value="4">Neurólogo</MenuItem>
                          <MenuItem value="5">Médico General</MenuItem>
                          <MenuItem value="6">Psicoterapeuta</MenuItem>
                          <MenuItem value="7">Psicoanalista</MenuItem>
                          <MenuItem value="8">
                            Consejero en salud mental
                          </MenuItem>
                          <MenuItem value="9">
                            Trabajador social clínico
                          </MenuItem>
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Cédula Profesional"
                          value={formData.cedula || ""}
                          onChange={handlers.cedula}
                          sx={textFieldStyles}
                        />
                      </Grid>
                    </FormSection>
                  )}

                  {/* Botones de Acción */}
                  <Box
                    sx={{
                      mt: 4,
                      display: "flex",
                      gap: 2,
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => navigate(-1)}
                      sx={{
                        textTransform: "capitalize",
                        borderRadius: 2,
                        borderColor: "#2D5D7B",
                        color: "#2D5D7B",
                        "&:hover": {
                          borderColor: "#0A2361",
                          backgroundColor: "rgba(45, 93, 123, 0.04)",
                        },
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleUpdate}
                      variant="contained"
                      sx={{
                        textTransform: "capitalize",
                        backgroundColor: "#2D5D7B",
                        "&:hover": { backgroundColor: "#0A2361" },
                        borderRadius: 2,
                        px: 4,
                      }}
                    >
                      Actualizar Información
                    </Button>
                  </Box>
                </>
              )}
            </Paper>
          </Container>

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
        </Box>
      </Layout>
    </>
  );
}
