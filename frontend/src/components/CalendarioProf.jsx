import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Divider,
  Button,
  Chip,
  Avatar,
  Stack,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
    Alert,
  Snackbar,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today,
  Event,
  Cancel,
  Schedule,
  Person,
  CalendarMonth,
  MoreHoriz,
  CalendarToday,
  Close
} from "@mui/icons-material";
import {
  format,
  startOfWeek,
  endOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
} from 'date-fns';

import { es } from "date-fns/locale";
import { AnimatePresence, m, motion } from "framer-motion";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import WorkOffIcon from '@mui/icons-material/WorkOff';
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CancelIcon from "@mui/icons-material/Cancel";


const VIEW = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
};


const estadoCitaMap = {
  1: "Pendiente de aceptar",
  2: "Aceptada",
  3: "En progreso",
  4: "Concluido",
  5: "Cancelado por el paciente",
  6: "Cancelado por el profesional",
  7: "No asistió el paciente",
  8: "No asistió el profesional",
  9: "Reprogramado",
  10: "Rechazada",
  11: "Expirada",
  12: "En espera",
};

const estadoCitaColors = {
  1: '#FFD700', // Pendiente de aceptar
  2: '#4CAF50', // Aceptada
  3: '#03A9F4', // En progreso
  4: '#8BC34A', // Concluido
  5: '#F44336', // Cancelado por el paciente
  6: '#D32F2F', // Cancelado por el profesional
  7: '#FF5722', // No asistió el profesional
  8: '#9C27B0', // No asistió el profesional
  9: '#00BCD4', // Reprogramado
  10: '#E91E63', // Rechazada
  11: '#9E9E9E', // Expirada
  12: '#FF9800', // En espera
};


const CalendarioProf = ({ mini = false }) => {
  const scale = mini ? 0.88 : 1;
  const compact = mini;
  const [idUsuario, setIdUsuario] = useState(null);
  const [idProfesional, setIdProfesional] = useState(null);
  const [Nombre, setNombre] = useState('');
  const [duracion, setDuracion] = useState(null);
  const [enlace, setEnlace] = useState('');
  const [comentario, setComentario] = useState('');
  const [view, setView] = useState(VIEW.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [seleccionarDia, setSeleccionarDia] = useState(null);
  const [seleccionarEvento, setSeleccionarEvento] = useState(null);

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
  const onSelectDay = (day) => {
    setSeleccionarDia(day);
    setSeleccionarEvento(null);
  };


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


  useEffect(() => {
    const fetchEvents = async () => {
      if (!idProfesional) return;
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/api/citas/citasProf/${idProfesional}`);
        console.log("respuesta:citas", response.data);
        const citasConEstado = await Promise.all(
          response.data.map(async (cita) => {
            try {
              const estadoRes = await axios.get(
                `http://localhost:4000/api/estadoCita/ultimo-estado/${cita.idCita}`);
              // Si no hay estado, se ignora 
            if (!estadoRes.data || !estadoRes.data.estado) {
              return null;
            }
            // Determinar campo de fecha válido
            const fechaValida =
              cita.date || cita.fecha_cita || cita.fecha || cita.fechaHora;

            if (!fechaValida) return null;

            return {
              ...cita,
              date: new Date(fechaValida),
              estadoCita: estadoRes.data.estado,
            };
            } catch (err) {
              // Si hay error al obtener estado, se ignora esta cita
            console.warn(" Cita sin estado válido:", cita.idCita);
            mostrarMensaje(`Cita sin estado válido: ${cita.idCita}`, "warning");


            return null;
            }

          }));
          const filtradas = citasConEstado.filter((c) => c !== null);
        console.log("citas con estados", filtradas);
         if (filtradas.length === 0) {
          mostrarMensaje("No hay citas con estado registrado.", "info");
        }else {
          mostrarMensaje(`Cargadas ${filtradas.length} citas con estado.`, "success");
        }

        setEvents(filtradas);
      } catch (error) {
        console.error('Error al cargar eventos:', error);
        mostrarMensaje("Error al cargar citas.", "error");
      } finally {
        setLoading(false);
      }
    };

      fetchEvents();
  
  }, [idProfesional]);

  const actualizarCita = async (idCita, data) => {
    try {
      await axios.put(`http://localhost:4000/api/citas/actualizar-citaProf/${idCita}`, data);
      mostrarMensaje("Cita actulizada correctamente", "success");
    } catch (error) {
      console.error("Error al actualizar cita:", error);
    }
  };

  const handleCambioVista = (event, next) => {
    if (next) setView(next);
  };

  const handleEstadoCambio = async (idCita, estadoNuevo) => {
    try {
      const token = localStorage.getItem('token');

      console.log("Intentando cambiar estado:", { idCita, estadoNuevo });

    if (!idCita || !estadoNuevo) {
      console.error("Error: idCita o estadoNuevo faltan");
      mostrarMensaje("Error: falta información de la cita o del estado.", "error");
      return;
    }

      if (estadoNuevo === 2) {
        if (!duracion || (seleccionarEvento.modalidad === 2 && !enlace)) {
          mostrarMensaje("Completa todos los campos requeridos", "error");
          return;
        }
        await actualizarCita(idCita, {
          duracion_horas: duracion, enlace: seleccionarEvento.modalidad === 2 ? enlace : null,
        });
      }

      if (estadoNuevo === 4) {
        await actualizarCita(idCita, { comentario });
      }

      await axios.post(`http://localhost:4000/api/estadoCita/registro-estadoCita/${idCita}/${estadoNuevo}`,
        {}, { headers: { Authorization: `Bearer ${token}` } }
      );

      setEvents((prevEvents) =>
        prevEvents.map((ev) =>
          ev.idCita === idCita ? { ...ev, estadoCita: estadoNuevo } : ev
        )
      );

      setSeleccionarEvento((prev) => ({
        ...prev, estadoCita: estadoNuevo
      }));

      setDuracion("");
      setEnlace('');
      setComentario('');
    

    } catch (error) {
      console.error('Error al cambiar el estado de la cita:', error);
      mostrarMensaje("Error al cambiar el estado de la cita", "error");
    }
  };

  const daysToDisplay = useMemo(() => {
    if (view === VIEW.MONTH) {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
      const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
      return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    }
    if (view === VIEW.WEEK) {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return eachDayOfInterval({ start, end });
    }

    return [currentDate];
  }, [view, currentDate]);

  const getEventsForDay = (day) =>
    events.filter(ev => isSameDay(ev.date, day));

  const changePeriod = (delta) => {
    const updater = {
      [VIEW.MONTH]: (d) => { d.setMonth(d.getMonth() + delta); return d; },
      [VIEW.WEEK]: (d) => addDays(d, delta * 7),
      [VIEW.DAY]: (d) => addDays(d, delta),
    };
    setCurrentDate(prev => updater[view](new Date(prev)));
  };

  const goToday = () => setCurrentDate(new Date());
  const typographyVariant = compact ? "caption" : "body2";
  const titleVariant = compact ? "subtitle2" : "h6";
  const [openConfirm, setOpenConfirm] = useState(false);
  // Cabecera de días de la semana (solo para mes y semana)
  const weekDays = useMemo(() => {
    if (view === VIEW.DAY) return null;
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }).map((_, i) => format(addDays(start, i), "EEE", { locale: es }));
  }, [currentDate, view]);

  return (
    <Box
      sx={{
        //transform: `scale(${scale})`,
        transformOrigin: "top center",
        width: "100%",
        maxWidth: 500,
        minHeight: 550,
        mx: "auto",
      }}
    >{/* Header */}
      <Paper
           elevation={6}
        sx={{
          p: 3,
          width: "100%",
          maxWidth: 500,
          borderRadius: 3,
          backgroundColor: "rgba(255,255,255,0.98)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 3,
          boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
          mx: "auto",
          my: 4,
        }}
      >
        {/* Título principal */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            textAlign: "center",
            color: "#1976d2",
            mb: 1,
          }}
        >
          Calendario de citas
        </Typography>
        {/* header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
      minHeight: 40,
      px: 1,

          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
          
              <Typography variant={typographyVariant} color="text.secondary"
               sx={{
        flexGrow: 1,
        textAlign: "center",
        minWidth: 130, 
        transition: "all 0.2s ease-in-out",
        textTransform: "capitalize",
      }}>
                {format(currentDate, "LLLL yyyy", { locale: es })}
              </Typography>
          </Stack>
          <Box sx={{ display: "flex", gap: 0.3, alignItems: "center" }}>
            <Tooltip title="Anterior">
              <IconButton size={compact ? "small" : "medium"} sx={{ p: 0.5 }} onClick={() => changePeriod(-1)}>
                <ChevronLeft sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Hoy">
              <IconButton size={compact ? "small" : "medium"}
                sx={{ p: 0.5 }} onClick={() => setCurrentDate(new Date())}>
                <Today sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Siguiente">
              <IconButton size={compact ? "small" : "medium"} sx={{ p: 0.5 }} onClick={() => changePeriod(1)}>
                <ChevronRight sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>




        <Box ssx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <ToggleButtonGroup
            size="small"
            value={view}
            exclusive
            onChange={handleCambioVista}
            sx={{
              mb: 0.5,
              '& .MuiToggleButton-root': {
                px: 1.5,
                py: 0.5,
                fontSize: '0.7rem',
                minWidth: 50
              }
            }}
          >
            <ToggleButton value={VIEW.DAY}>
              <CalendarToday fontSize={compact ? "small" : "medium"} sx={{ mr: 0.5 }} />
              <Typography variant="button" sx={{
                fontSize: compact ? 11 : 12,
                textTransform: "capitalize"
              }}>
                Día
              </Typography>
            </ToggleButton>
            <ToggleButton value={VIEW.WEEK}>
              <Schedule fontSize={compact ? "small" : "medium"} sx={{ mr: 0.5 }} />
              <Typography variant="button" sx={{
                fontSize: compact ? 11 : 12,
                textTransform: "capitalize"
              }}>
                Semana
              </Typography>
            </ToggleButton>
            <ToggleButton value={VIEW.MONTH}>
              <CalendarMonth fontSize={compact ? "small" : "medium"} sx={{ mr: 0.5 }} />
              <Typography variant="button" sx={{
                fontSize: compact ? 11 : 12,
                textTransform: "capitalize"
              }}>
                Mes
              </Typography></ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Cabecera de días de la semana */}
        {weekDays && (
          <Box sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 0.5,
            width: "100%",

            mb: 0.5
          }}>
            {weekDays.map((day, index) => (
              <Typography
                key={index}
                fontSize="0.7rem"
                fontWeight="600"
                textAlign="center"
                color="text.secondary"
                sx={{ textTransform: 'capitalize' }}
              >
                {day}
              </Typography>
            ))}
          </Box>
        )}




        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={28} thickness={5} sx={{ color: "#092181" }} />
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                view === VIEW.MONTH
                  ? "repeat(7, 1fr)"
                  : view === VIEW.WEEK
                    ? "repeat(7, 1fr)"
                    : "repeat(1, 1fr)",
              gap: 0.3,
              width: "100%",

            }}
          >

            {daysToDisplay.map((day) => {
              const eventsForDay = getEventsForDay(day);
              const hasMoreEvents = eventsForDay.length > 2;
              const today = isToday(day);
              return (
                <Card
                  key={day.toISOString()}
                  elevation={today ? 6 : 2}
                  onClick={() => setSeleccionarDia(day)}

                  sx={{
                    p: 1,
                    borderRadius: 2,
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    minHeight: view === VIEW.MONTH ? 45 : 60,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    bgcolor: today
                      ? "#092181" // día actual
                      : isSameMonth(day, currentDate)
                        ? "#F4F6F8" // mes actual
                        : "#CBD4D8", // fuera del mes
                    border: `1px solid ${today ? "#0A2361" : "rgba(0,0,0,0.08)"
                      }`,
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: 5,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2"
                      fontWeight="600"
                      fontSize="0.75rem"
                      color={today ? "#F5E3E9" : "#355C7D"}
                      sx={{
                        bgcolor: today ? "#0A2361" : "transparent",
                        alignSelf: 'flex-end',

                        borderRadius: '50%',
                        width: 20,
                        height: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem'
                      }}
                    >
                      {format(day, 'd', { locale: es })}
                    </Typography>
                    {today && (
                      <Chip
                        label="Hoy"
                        size="small"
                        sx={{
                          bgcolor: "#092181",
                          color: "#F5E3E9",
                          fontSize: "0.6rem",
                          height: 18,
                        }}
                      />
                    )}
                  </Box>
                  <Box sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 0.5,
                    gap: 0.3,
                  }}>
                    {eventsForDay.slice(0, 2).map((ev) => (
                      <Tooltip
                        key={ev.idCita}
                        title={`${ev.title} - ${estadoCitaMap[ev.estadoCita]}`}
                        arrow
                      >
                        <Box
                          sx={{
                            width: "85%",
                            height: 6,
                            borderRadius: 1,
                            bgcolor: estadoCitaColors[ev.estadoCita],
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                          }}

                        />
                      </Tooltip>
                    ))}
                    {hasMoreEvents && (
                      <Tooltip title={`${eventsForDay.length - 2} más citas`}>
                        <MoreHoriz sx={{ fontSize: 12, color: "#777777", alignSelf: 'center' }} />
                      </Tooltip>
                    )}
                  </Box>
                </Card>
              );
            })}
          </Box>
        )}

        {seleccionarDia && (
          <Card
            sx={{
              width: "90%",
              mt: 1,
              p: 1.5,
              borderRadius: 2,
              bgcolor: "background.paper",
              border: "1px solid #e0e0e0",
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Schedule sx={{ fontSize: 18, color: "#092181" }} />
              <Typography variant="subtitle2" fontWeight="600" fontSize="0.8rem" color="#0A2361">
                {format(seleccionarDia, "EEEE, d 'de' MMMM yyyy", { locale: es })}
              </Typography>
            </Box>

            <Divider sx={{ mb: 1 }} />

            {getEventsForDay(seleccionarDia).length === 0 ? (
              <Typography
                color="#777777"
                fontSize="0.75rem"
                textAlign="center"
                fontStyle="italic"
              >
                No hay citas este día
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {getEventsForDay(seleccionarDia).map((ev, idx) => (
                  <Card
                    key={idx}
                    sx={{
                      p: 1.2,
                      borderRadius: 2,
                      bgcolor: "#FFFFFF",
                      borderLeft: `4px solid ${estadoCitaColors[ev.estadoCita]}`,
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                      '&:hover': { transform: 'translateX(3px)', boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }
                    }}
                    onClick={() => setSeleccionarEvento(ev)}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box flex={1}>
                        <Typography
                          fontWeight="600" fontSize="0.85rem" lineHeight={1.2}
                          color="#355C7D"
                        >{ev.title}</Typography>
                        <Typography fontSize="0.7rem" color="#777777" mt={0.2}>
                          {format(ev.date, 'HH:mm')}
                        </Typography>
                      </Box>
                      <Chip
                        label={estadoCitaMap[ev.estadoCita]}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: '0.65rem',
                          bgcolor: "#ffffffff",
                          color: "#020202ff",
                          border: `1px solid ${estadoCitaColors[ev.estadoCita]}`,
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Card>
                ))}
              </Box>
            )}

          </Card>
        )}
        {seleccionarEvento && (
          <Card
            elevation={3}
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 3,
              bgcolor: "#F4F6F8", 
              border: "1px solid #CBD4D8",
              width: "90%",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              transition: "all 0.25s ease",
              "&:hover": { boxShadow: "0 6px 18px rgba(0,0,0,0.1)" }
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.8}>
              <Box display="flex" alignItems="center" gap={1}>
                <Event sx={{ fontSize: 18, color: "#092181" }} />
                <Typography variant="subtitle2" fontWeight={600} fontSize="0.82rem" color="#0A2361">Detalles de cita</Typography>
              </Box>
              <IconButton size="small" onClick={() => setSeleccionarEvento(null)}>
                <Close fontSize="small" />
              </IconButton>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
              <Box display="flex" justifyContent="space-between">
                <Typography fontSize="0.75rem" fontWeight="600" color="#355C7D">Título:</Typography>
                <Typography fontSize="0.75rem">{seleccionarEvento.title}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography fontSize="0.75rem" fontWeight="500" color="#355C7D">Hora:</Typography>
                <Typography fontSize="0.75rem">{format(seleccionarEvento.date, 'HH:mm')}</Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography fontSize="0.75rem" fontWeight="500" color="#355C7D">Estado:</Typography>
                <Chip
                  label={estadoCitaMap[seleccionarEvento.estadoCita]}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    color: "#040404ff",
                    bgcolor: estadoCitaColors[seleccionarEvento.estadoCita],
                    border: `1px solid ${estadoCitaColors[seleccionarEvento.estadoCita]}`,
                  }}
                />
              </Box>
            </Box>


            {seleccionarEvento.estadoCita === 1 && (
              <>
                <Box mt={2}>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 18, color: "#092181" }} />
                    <Typography variant="subtitle1" fontWeight="600" fontSize="0.8rem"
                      color="#0A2361">
                      Aceptar cita
                    </Typography>
                  </Box>
                  <TextField
                    label="Duración (horas)"
                    type="number"
                    value={duracion}
                    onChange={(e) => setDuracion(e.target.value)}
                    fullWidth
                    margin="dense"
                    sx={{
                      width: "100%",
                      maxWidth: "400px",
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
                        color: "#777",
                        opacity: 1,
                      },
                    }}
                  />
                  {seleccionarEvento.modalidad === 1 && (
                    <TextField
                      label="Enlace de la cita (virtual)"
                      value={enlace}
                      onChange={(e) => setEnlace(e.target.value)}

                      margin="dense"
                      sx={{
                        width: "100%",
                        maxWidth: "400px",
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
                          color: "#777",
                          opacity: 1,
                        },
                      }}
                    />
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 3,
                      mt: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<CheckCircleOutlineIcon />}
                      onClick={() => handleEstadoCambio(seleccionarEvento.idCita, 2)}
                      sx={{
                        px: 4,
                        textTransform: "capitalize",
                        backgroundColor: "#2D5D7B",
                        "&:hover": { backgroundColor: "#092181" },
                        borderRadius: 3,
                      }}
                    >
                      Aceptar cita
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 3,
                      mt: 2,
                    }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<HighlightOffIcon />}
                      onClick={() => handleEstadoCambio(seleccionarEvento.idCita, 10)}
                      sx={{
                        color: "#D32F2F",
                        borderColor: "#D32F2F",
                        textTransform: "capitalize",
                        borderRadius: 3,
                        "&:hover": {
                          backgroundColor: "rgba(211,47,47,0.08)",
                          borderColor: "#B71C1C",

                        },
                      }}
                      >
                      Rechazar
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<AutorenewIcon sx={{ color: "#FB8C00" }} />}
                      onClick={() => handleEstadoCambio(seleccionarEvento.idCita, 9)}
                      sx={{
                        color: "#6D4C41",
                        borderColor: "#FB8C00",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        px: 2,
                        py: 0.5,
                        textTransform: "capitalize",
                        borderRadius: 2,
                        "&:hover": {
                          backgroundColor: "rgba(251, 140, 0, 0.08)",
                          borderColor: "#EF6C00",
                          transform: "scale(1.03)",
                          transition: "all 0.2s ease",
                        },
                      }}
                      >
                      Reprogramar
                    </Button>
                  </Box>
                </Box>
              </>
            )}

            {seleccionarEvento.estadoCita === 2 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  mt: 2,
                  flexWrap: "wrap",
                }}
              >
                {/* Iniciar cita */}
                <Button
                  variant="contained"
                  startIcon={<PlayArrowIcon />}
                  onClick={() => handleEstadoCambio(seleccionarEvento.idCita, 3)}
                  sx={{
                    px: 3,
                    py: 1,
                    textTransform: "none",
                    borderRadius: 3,
                    fontWeight: 600,
                    color: "#fff",
                    background: "linear-gradient(45deg, #43a047, #66bb6a)",
                    boxShadow: "0 4px 10px rgba(67, 160, 71, 0.3)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(45deg, #388e3c, #43a047)",
                      boxShadow: "0 6px 14px rgba(67, 160, 71, 0.4)",
                    },
                  }}
                >
                  Iniciar cita
                </Button>

                {/* Cancelar cita */}
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => setOpenConfirm(true)}
                  sx={{
                    px: 3,
                    py: 1,
                    textTransform: "none",
                    borderRadius: 3,
                    fontWeight: 600,
                    border: "2px solid #e53935",
                    color: "#e53935",
                    backgroundColor: "#fff",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#ffebee",
                      borderColor: "#c62828",
                      color: "#c62828",
                      boxShadow: "0 4px 10px rgba(229, 57, 53, 0.2)",
                    },
                  }}
                >
                  Cancelar cita
                </Button>
                <AnimatePresence>
              {openConfirm && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Dialog
                    open={openConfirm}
                    onClose={() => setOpenConfirm(false)}
                    PaperProps={{
                      sx: {
                        borderRadius: "16px",
                        p: 2,
                        backgroundColor: "#fff",
                        boxShadow: "0 6px 25px rgba(0,0,0,0.2)",
                      },
                    }}
                    BackdropProps={{
                      sx: {
                        backgroundColor: "rgba(9, 33, 129, 0.2)",
                        backdropFilter: "blur(3px)",
                      },
                    }}
                  >
                    <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 0 }}>
                      <WarningAmberIcon sx={{ color: "#C62828", fontSize: 32 }} />
                      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#092181" }}>
                        Confirmar cancelación
                      </Typography>
                    </DialogTitle>

                    <DialogContent>
                      <DialogContentText sx={{ color: "#333", mt: 1 }}>
                        ¿Estás seguro de que deseas cancelar la cita "{seleccionarEvento.title}" a las {format(seleccionarEvento.date, "HH:mm")}?
                        <br />
                        <strong>Esta acción puede ser irreversible.</strong>
                      </DialogContentText>
                    </DialogContent>

                    <DialogActions sx={{ p: 2, gap: 1 }}>
                      <Button
                        onClick={() => setOpenConfirm(false)}
                        sx={{
                          color: "#2D5D7B",
                          fontWeight: 600,
                          borderRadius: "10px",
                          textTransform: "capitalize",
                        }}
                      >
                        Cancelar
                      </Button>


                       <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  onClick={() => handleEstadoCambio(seleccionarEvento.idCita, 6)
                        
                    }
                  sx={{
                    backgroundColor: "#C62828",
                    "&:hover": { backgroundColor: "#A31515" },
                    fontWeight: 600,
                    borderRadius: "10px",
                    textTransform: "capitalize",
                  }}
                
                >
                  Sí, cancelar
                </Button>
              </motion.div>

                    </DialogActions>
                  </Dialog>
                </motion.div>
              )}
            </AnimatePresence>
              </Box>
            )}

            {seleccionarEvento.estadoCita === 3 && (
              <Box mt={2}>
                <Typography variant="subtitle1">Concluir cita</Typography>
                <TextField
                  label="Comentario"
                  multiline
                  rows={4}
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  sx={{
                    width: "100%",
                    maxWidth: "400px",
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
                      color: "#777",
                      opacity: 1,
                    },
                  }}
                  margin="dense"
                />
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    justifyContent: "center",
                    mt: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={<CheckCircleOutlineIcon />}

                    onClick={() => handleEstadoCambio(seleccionarEvento.idCita, 4)}
                    sx={{
                      mt: 2,
                      bgcolor: "#2E7D32", 
                      fontWeight: 600,
                      textTransform: "capitalize",
                      "&:hover": {
                        bgcolor: "#1B5E20",
                        transform: "scale(1.03)",
                        transition: "all 0.2s ease",
                      },
                    }}

                  >
                    Concluir
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<PersonOffIcon />}
                    onClick={() => handleEstadoCambio(seleccionarEvento.idCita, 7)}
                    sx={{
                      fontWeight: 600,
                      textTransform: "capitalize",
                      borderColor: "#D32F2F",
                      color: "#D32F2F",
                      "&:hover": {
                        backgroundColor: "rgba(211, 47, 47, 0.08)",
                        borderColor: "#B71C1C",
                      },
                    }}
                  >
                    No asistió el paciente
                  </Button>
                  <Button variant="outlined"
                    startIcon={<WorkOffIcon />}
                    onClick={() => handleEstadoCambio(seleccionarEvento.idCita, 8)}
                    sx={{
                      fontWeight: 600,
                      textTransform: "capitalize",
                      color: "#EF6C00",
                      borderColor: "#EF6C00",
                      "&:hover": {
                        backgroundColor: "rgba(239, 108, 0, 0.08)",
                        borderColor: "#E65100",
                      },
                    }}>
                    No asistió el profesional
                  </Button>
                </Box>

              </Box>

            )}
          
          </Card>
         
        )}
        

      </Paper>
       {/*  Snackbar para mostrar mensajes */}
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

      
    </Box>

  );
};

export default CalendarioProf;
