import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
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
    Checkbox,
    FormControlLabel,
    MenuItem,
    Divider,
    Card,
    CardContent,
    Chip,
    Paper,
    Snackbar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Alert,

} from "@mui/material";

import {
    Search,
    RestartAlt,
    FilterList,
    AccessTime,
    CalendarToday,
    AccessAlarms,
    AddAlert as AddAlertIcon,
    InfoOutlined as InfoOutlineIcon,
    CheckCircle
} from "@mui/icons-material";

import TodayIcon from "@mui/icons-material/Today";
import WorkIcon from "@mui/icons-material/Work";
import WeekendIcon from "@mui/icons-material/Weekend";
import EventIcon from "@mui/icons-material/Event";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';

export default function AdminRecordatorios() {

    const [recordatorios, setRecordatorios] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados para el sistema de filtros
    const [filtrosActivos, setFiltrosActivos] = useState({
        idUsuario: false,
        mensaje: false,
        hora: false,
        frecuencia: false,
        tipo: false,
    });
    const [valoresFiltro, setValoresFiltro] = useState({
        idUsuario: "",
        mensaje: "",
        hora: "",
        frecuencia: "",
        tipo: "",
    });

    // Estado para Snackbar (mensajes de notificación)
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [mensajeSnackbar, setMensajeSnackbar] = useState("");
    const [tipoSnackbar, setTipoSnackbar] = useState("success");



    const frecuenciaMap = [
        { value: 1, nombre: "Una vez", color: "#6c757d", icono: <AccessTime /> },
        { value: 2, nombre: "Diario", color: "#007bff", icono: <TodayIcon /> },
        { value: 3, nombre: "Días laborales", color: "#28a745", icono: <WorkIcon /> },
        { value: 4, nombre: "Fin de semana", color: "#ff9800", icono: <WeekendIcon /> },
        { value: 5, nombre: "Semanal", color: "#17a2b8", icono: <CalendarToday /> },
        { value: 6, nombre: "Quincenal", color: "#9c27b0", icono: <EventIcon /> },
        { value: 7, nombre: "Mensual", color: "#e91e63", icono: <ScheduleIcon /> },
    ];

    const tiposRecordatorios = [
        { value: 1, nombre: "Actividad asignada", color: "#1976d2", icono: <CategoryIcon /> },
        { value: 2, nombre: "Registro emocional", color: "#9c27b0", icono: <CategoryIcon /> },
        { value: 3, nombre: "Cita programada", color: "#2e7d32", icono: <EventIcon /> },
        { value: 4, nombre: "Solicitar cita", color: "#ff9800", icono: <CategoryIcon /> },
        { value: 5, nombre: "Autocuidado", color: "#e91e63", icono: <CategoryIcon /> },
        { value: 6, nombre: "Respiracion", color: "#00bcd4", icono: <CategoryIcon /> },
        { value: 7, nombre: "Checkin diario", color: "#9e9d24", icono: <CategoryIcon /> },
        { value: 8, nombre: "Meditacion", color: "#8d6e63", icono: <CategoryIcon /> },
    ];

    const estadoRecordatorioMap = {
        1: { nombre: "Pendiente", color: "#ff9800", icono: <AccessTime /> },
        2: { nombre: "Completado", color: "#2e7d32", icono: <CheckCircle /> },
    };


    const mostrarMensaje = (msg, severity = "info") => {
        setMensajeSnackbar(msg);
        setTipoSnackbar(severity);
        setOpenSnackbar(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const obtenerTodosRecordatorios = async (filtros = {}) => {
        setLoading(true);
        try {

            const res = await axios.get(
                `http://localhost:4000/api/admin/recordatorios`,
                { params: filtros }
            );
            setRecordatorios(res.data);
            mostrarMensaje("Recordatorios cargados correctamente.", "success");
        } catch (err) {
            console.error("Error al cargar recordatorios del administrador:", err);
            setRecordatorios([]);
            mostrarMensaje("Error al cargar los recordatorios. Intenta más tarde.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerTodosRecordatorios();
    }, []);



    const handleBuscar = async () => {
        const filtrosAplicados =  {};


        if (filtrosActivos.idUsuario && valoresFiltro.idUsuario.trim()) {
            filtrosAplicados.idUsuario = parseInt(valoresFiltro.idUsuario);
        }
        if (filtrosActivos.mensaje && valoresFiltro.mensaje.trim()) {
            filtrosAplicados.mensaje = valoresFiltro.mensaje;
        }
        if (filtrosActivos.hora && valoresFiltro.hora.trim()) {
            filtrosAplicados.hora = valoresFiltro.hora;
        }
        if (filtrosActivos.frecuencia && valoresFiltro.frecuencia) {
            filtrosAplicados.frecuencia = valoresFiltro.frecuencia;
        }
        if (filtrosActivos.tipo && valoresFiltro.tipo) {
            filtrosAplicados.tipo_recordatorio = valoresFiltro.tipo;
        }

        try {

            await obtenerTodosRecordatorios(filtrosAplicados);
            if (Object.keys(filtrosAplicados).length > 0) {
                mostrarMensaje("Búsqueda con filtros realizada con éxito.", "success");
            } else {
                mostrarMensaje("Mostrando todos los recordatorios.", "info");
            }
        } catch (error) {
            console.error("Error en la búsqueda:", error);
            mostrarMensaje("Error al realizar la búsqueda.", "error");
        }
    };

    const handleLimpiarFiltros = () => {
        setFiltrosActivos({
            idUsuario: false,
            mensaje: false,
            hora: false,
            frecuencia: false,
            tipo: false,
        });

        setValoresFiltro({
            idUsuario: "",
            mensaje: "",
            hora: "",
            frecuencia: "",
            tipo: "",
        });

        obtenerTodosRecordatorios();
    };

    const getMapItem = (map, value, defaultName = "Desconocido") => {
        const item = map.find(item => item.value === value);
        return item || { nombre: defaultName, color: "#6c757d", icono: <InfoOutlineIcon /> };
    };


    return (
        <Layout>
            <Container maxWidth="lg" sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 4, pb: 4, minHeight: "100vh" }}>

                <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)", backgroundColor: "#F4F6F8", width: "100%", mx: "auto", display: "flex", flexDirection: "column", gap: 3 }}>


                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, mb: 4, position: "relative" }}>
                        <AccessAlarms sx={{ color: "#092181", fontSize: 36, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }} />
                        <Typography variant="h4" fontWeight="bold" sx={{ color: "#092181", textAlign: "center", letterSpacing: 0.5, textTransform: "uppercase" }}>
                            Administración de Recordatorios
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {/* --- Sección de filtros--- */}
                    <Card sx={{ display: "flex", flexDirection: "column", p: { xs: 2, md: 3 }, backgroundColor: "#f8f9ff", border: "1px solid #e0e7ff", borderRadius: 3 }}>
                        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                            <FilterList sx={{ mr: 1, color: "#092181" }} />
                            <Typography variant="h6" fontWeight="bold" color="#092181" sx={{ flex: 1 }}>
                                Filtros de Búsqueda de Recordatorios (Todos los Usuarios)
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
                            {Object.entries(filtrosActivos).map(([key, value]) => (
                                <FormControlLabel
                                    key={key}
                                    control={<Checkbox checked={value} onChange={() => setFiltrosActivos(prev => ({ ...prev, [key]: !prev[key] }))} />}
                                    label={key === 'idUsuario' ? 'ID Usuario' : key.charAt(0).toUpperCase() + key.slice(1)}
                                />
                            ))}
                        </Box>

                        {/* Campos de filtro activos */}
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mb: 2 }}>

                            {/* Filtro por ID de Usuario */}
                            {filtrosActivos.idUsuario && (
                                <TextField
                                    label="ID de Usuario"
                                    type="number"
                                    value={valoresFiltro.idUsuario}
                                    onChange={(e) => setValoresFiltro({ ...valoresFiltro, idUsuario: e.target.value })}
                                    variant="outlined"
                                    fullWidth
                                />
                            )}

                            {/* Filtro por Mensaje */}
                            {filtrosActivos.mensaje && (
                                <TextField
                                    label="Título del recordatorio"
                                    value={valoresFiltro.mensaje}
                                    onChange={(e) => setValoresFiltro({ ...valoresFiltro, mensaje: e.target.value })}
                                    variant="outlined"
                                    fullWidth
                                />
                            )}

                            {/* Filtro por Hora */}
                            {filtrosActivos.hora && (
                                <TextField
                                    label="Hora de notificación"
                                    type="time"
                                    value={valoresFiltro.hora}
                                    onChange={(e) => setValoresFiltro({ ...valoresFiltro, hora: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    fullWidth
                                />
                            )}

                            {/* Filtro por Frecuencia */}
                            {filtrosActivos.frecuencia && (
                                <FormControl fullWidth>
                                    <InputLabel>Frecuencia</InputLabel>
                                    <Select
                                        value={valoresFiltro.frecuencia}
                                        onChange={(e) => setValoresFiltro({ ...valoresFiltro, frecuencia: e.target.value })}
                                        label="Frecuencia"
                                    >
                                        {frecuenciaMap.map((frecuencia) => (
                                            <MenuItem key={frecuencia.value} value={frecuencia.value}>
                                                <ListItemIcon><Box sx={{ color: frecuencia.color }}>{frecuencia.icono}</Box></ListItemIcon>
                                                <ListItemText primary={frecuencia.nombre} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}

                            {/* Filtro por Tipo */}
                            {filtrosActivos.tipo && (
                                <FormControl fullWidth>
                                    <InputLabel>Tipo de recordatorio</InputLabel>
                                    <Select
                                        value={valoresFiltro.tipo}
                                        onChange={(e) => setValoresFiltro({ ...valoresFiltro, tipo: e.target.value })}
                                        label="Tipo de recordatorio"
                                    >
                                        {tiposRecordatorios.map((tipo) => (
                                            <MenuItem key={tipo.value} value={tipo.value}>
                                                <ListItemIcon><Box sx={{ color: tipo.color }}>{tipo.icono}</Box></ListItemIcon>
                                                <ListItemText primary={tipo.nombre} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        </Box>

                        {/* Botones de acción del filtro */}
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<Search />}
                                onClick={handleBuscar}
                                disabled={loading}
                                sx={{ minWidth: '140px', textTransform: "capitalize", background: "#2D5D7B", "&:hover": { background: "#092181" } }}
                            >
                                Buscar
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<RestartAlt />}
                                onClick={handleLimpiarFiltros}
                                disabled={loading}
                                sx={{ minWidth: '140px', textTransform: "capitalize", borderColor: "#092181", color: "#092181", "&:hover": { backgroundColor: "#f0f4ff", borderColor: "#092181" } }}
                            >
                                Limpiar filtros
                            </Button>
                        </Box>
                    </Card>

                    <Divider sx={{ my: 3 }} />

                    {/* --- Lista de resultados --- */}
                    <Box>
                        <Typography variant="h5" fontWeight="bold" sx={{ color: "#092181", mb: 2 }}>
                            Resultados ({recordatorios.length})
                        </Typography>

                        {loading ? (
                            <Typography sx={{ p: 3, textAlign: 'center' }}>Cargando recordatorios...</Typography>
                        ) : recordatorios.length === 0 ? (
                            <Alert severity="info" sx={{ mt: 2 }}>No se encontraron recordatorios para los filtros seleccionados.</Alert>
                        ) : (
                            <List sx={{ display: 'grid', gap: 2, p: 0 }}>
                                {recordatorios.map((r) => {
                                    const tipoInfo = getMapItem(tiposRecordatorios, r.tipo_recordatorio);
                                    const frecuenciaInfo = getMapItem(frecuenciaMap, r.frecuencia);
                                    const estadoInfo = estadoRecordatorioMap[r.culminado] || { nombre: "Error", color: "#dc3545" };

                                    return (
                                        <ListItem key={r.idRecordatorio} disablePadding>
                                            <Card
                                                elevation={3}
                                                sx={{ width: '100%', borderRadius: 2, borderLeft: `6px solid ${estadoInfo.color}`, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', p: 2, backgroundColor: '#ffffff' }}
                                            >
                                                <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        {tipoInfo.icono}
                                                        <Typography variant="subtitle1" fontWeight="bold" sx={{ ml: 1, color: "#355C7D" }}>
                                                            {r.mensaje}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                                        {/* Chip de Usuario */}
                                                        <Chip
                                                            icon={<PersonIcon />}
                                                            label={r.nombreUsuario || `ID: ${r.idUsuario}`}
                                                            sx={{ backgroundColor: "#092181", color: 'white', fontWeight: 'bold' }}
                                                            size="small"
                                                        />
                                                        {/* Chip de Hora */}
                                                        <Chip
                                                            icon={<AccessTime />}
                                                            label={r.hora}
                                                            sx={{ backgroundColor: '#e0e0e0' }}
                                                            size="small"
                                                        />
                                                        {/* Chip de Frecuencia */}
                                                        <Chip
                                                            icon={frecuenciaInfo.icono}
                                                            label={frecuenciaInfo.nombre}
                                                            sx={{ backgroundColor: frecuenciaInfo.color, color: 'white', fontWeight: 'bold' }}
                                                            size="small"
                                                        />
                                                        {/* Chip de Estado */}
                                                        <Chip
                                                            icon={estadoInfo.icono}
                                                            label={estadoInfo.nombre}
                                                            sx={{ backgroundColor: estadoInfo.color, color: 'white', fontWeight: 'bold' }}
                                                            size="small"
                                                        />
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </ListItem>
                                    );
                                })}
                            </List>
                        )}
                    </Box>

                </Paper>
            </Container>

            {/* Snackbar para mensajes */}
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={tipoSnackbar} sx={{ width: '100%' }}>
                    {mensajeSnackbar}
                </Alert>
            </Snackbar>

        </Layout>
    );
}

