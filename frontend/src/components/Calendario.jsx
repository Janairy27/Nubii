import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
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
  Stack,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Today,
  Event,
  Cancel,
  Schedule,
  CalendarMonth,
  MoreHoriz,
  CalendarToday,
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
} from "date-fns";
import { es } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";


const VIEW = { DAY: "day", WEEK: "week", MONTH: "month" };

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

const estadoColorMap = {
  1: "#dacb49ff",
  2: "#21d127ff",
  3: "#81D4FA",
  4: "#66bc05ff",
  5: "#ec4656ff",
  6: "#bf3e3eff",
  7: "#da9a3aff",
  8: "#b137c6ff",
  9: "#079db1ff",
  10: "#aa0e44ff",
  11: "#fa0404ff",
  12: "#c39b23ff",
};

const CalendarioPac = ({ mini = false }) => {
  const scale = mini ? 0.88 : 1;
  const compact = mini;
  const [idPaciente, setIdPaciente] = useState("");
  const [nombre, setNombre] = useState("");
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

  // Obtener paciente desde localStorage
  useEffect(() => {
    const storedIdUsuario = localStorage.getItem("idUsuario");
    if (storedIdUsuario) {
      axios
        .get(`http://localhost:4000/api/auth/paciente/${storedIdUsuario}`)
        .then((res) => {
          setIdPaciente(res.data.idPaciente);
          setNombre(res.data.nombre);
        })
        .catch((err) => console.error("Error al obtener paciente:", err));
    }
  }, []);

  //  Cargar citas que SÍ tienen estado registrado
  useEffect(() => {
    const fetchEvents = async () => {
      if (!idPaciente) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:4000/api/citas/citas/${idPaciente}`
        );
        console.log(" Citas obtenidas:", response.data);
        mostrarMensaje(`Cargadas ${response.data.length} citas.`, "success");


        const citasConEstado = await Promise.all(
          response.data.map(async (cita) => {
            try {
              // Obtener el último estado de la cita
              const estadoRes = await axios.get(
                `http://localhost:4000/api/estadoCita/ultimo-estado/${cita.idCita}`
              );

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
          })
        );

        // Filtrar las que sí tienen estado
        const filtradas = citasConEstado.filter((c) => c !== null);
        console.log(" Citas con estado:", filtradas);
        if (filtradas.length === 0) {
          mostrarMensaje("No hay citas con estado registrado.", "info");
        }else {
          mostrarMensaje(`Cargadas ${filtradas.length} citas con estado.`, "success");
        }

        setEvents(filtradas);
      } catch (error) {
        console.error("Error al cargar citas:", error);
        mostrarMensaje("Error al cargar citas.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [idPaciente]);


  // Cambiar estado 
  const handleEstadoCambio = async (idCita) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:4000/api/estadoCita/registro-estadoCita/${idCita}/5`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEvents((prevEvents) =>
        prevEvents.map((ev) =>
          ev.idCita === idCita ? { ...ev, estadoCita: 5 } : ev
        )
      );

      setSeleccionarEvento((prev) => ({ ...prev, estadoCita: 5 }));
      mostrarMensaje("Cita cancelada correctamente.", "success");
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      mostrarMensaje("Error al cambiar estado de la cita.", "error");
    }
  };

  // Días visibles según la vista
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
      [VIEW.MONTH]: (d) => {
        d.setMonth(d.getMonth() + delta);
        return d;
      },
      [VIEW.WEEK]: (d) => addDays(d, delta * 7),
      [VIEW.DAY]: (d) => addDays(d, delta),
    };
    setCurrentDate((prev) => updater[view](new Date(prev)));
  };

  // Cabecera de días de la semana (solo para mes y semana)
  const weekDays = useMemo(() => {
    if (view === VIEW.DAY) return null;
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }).map((_, i) => format(addDays(start, i), "EEE", { locale: es }));
  }, [currentDate, view]);

  // estilo compacto para texto y chips
  const typographyVariant = compact ? "caption" : "body2";
  const titleVariant = compact ? "subtitle2" : "h6";
  const [openConfirm, setOpenConfirm] = useState(false);

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
    >
      {/* Header */}
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



        {/* Controles de vista */}
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <ToggleButtonGroup
            size="small"
            value={view}
            exclusive
            onChange={(e, next) => next && setView(next)}
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

        {/* Calendario */}
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
              minHeight: 300,

            }}
          >
            {daysToDisplay.map((day) => {
              const eventsForDay = getEventsForDay(day);
              const hasMoreEvents = eventsForDay.length > 2;
              const today = isToday(day);

              return (
                <Card
                  key={day.toString()}
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
                    <Typography
                      variant="body2"
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
                      {format(day, "d", { locale: es })}
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
                        title={`${ev.title} - ${estadoCitaMap[ev.estadoCita]}`
                        }
                        arrow
                      >
                        <Box
                          sx={{
                            width: "85%",
                            height: 6,
                            borderRadius: 1,
                            bgcolor: estadoColorMap[ev.estadoCita],
                            boxShadow:
                              "0 1px 3px rgba(0,0,0,0.1)",
                            position: "relative",
                          }}

                        >

                        </Box>

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

        {/* Día seleccionado  */}
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
                {format(seleccionarDia, "EEE d 'de' MMM", { locale: es })}
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
                {getEventsForDay(seleccionarDia).map((ev) => (
                  <Box
                    key={ev.idCita}
                    sx={{
                      p: 1.2,
                      borderRadius: 2,
                      bgcolor: "#FFFFFF",
                      borderLeft: `4px solid ${estadoColorMap[ev.estadoCita]}`,
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                      '&:hover': { transform: 'translateX(3px)', boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }
                    }}
                    onClick={() => setSeleccionarEvento(ev)}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box flex={1}>
                        <Typography fontWeight="600" fontSize="0.85rem" lineHeight={1.2}
                          color="#355C7D">
                          {ev.title}
                        </Typography>
                        <Typography fontSize="0.7rem" color="#777777" mt={0.2}>
                          🕒 {format(ev.date, "HH:mm")}
                        </Typography>
                      </Box>
                      <Chip
                        label={estadoCitaMap[ev.estadoCita]}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: '0.65rem',
                          bgcolor: "#F5E3E9",
                          color: "#67121A",
                          border: `1px solid ${estadoColorMap[ev.estadoCita]}`,
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Card>
        )}

        {/* Detalle de cita */}
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
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Event sx={{ fontSize: 18, color: "#092181" }} />
              <Typography variant="subtitle1" fontWeight="600" fontSize="0.8rem"
                color="#0A2361">
                Detalles de cita
              </Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
              <Box display="flex" justifyContent="space-between">
                <Typography fontSize="0.75rem" fontWeight="600" color="#355C7D">Título:</Typography>
                <Typography fontSize="0.75rem">{seleccionarEvento.title}</Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography fontSize="0.75rem" fontWeight="500" color="#355C7D">Hora:</Typography>
                <Typography fontSize="0.75rem">{format(seleccionarEvento.date, "HH:mm")}</Typography>
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
                    color: "#67121A",
                    bgcolor: estadoColorMap[seleccionarEvento.estadoCita],
                    border: `1px solid ${estadoColorMap[seleccionarEvento.estadoCita]}`,
                  }}
                />
              </Box>
            </Box>

            {seleccionarEvento.estadoCita === 1 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<Cancel sx={{ fontSize: 16 }} />}
                size="small"
                sx={{
                  textTransform: "capitalize",
                  mt: 2,
                  borderRadius: 4,
                  fontSize: '0.75rem',
                  py: 0.6,
                  width: '100%',
                  maxWidth: "200px",
                  borderColor: "#67121A",
                  color: "#67121A",
                  "&:hover": { bgcolor: "#F5E3E9", borderColor: "#67121A" },
                }}

                onClick={() => setOpenConfirm(true)}
              >
                Cancelar cita
              </Button>
            )}
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
                          sx={{
                            backgroundColor: "#C62828",
                            "&:hover": { backgroundColor: "#A31515" },
                            fontWeight: 600,
                            borderRadius: "10px",
                            textTransform: "capitalize",
                          }}
                          onClick={async () => {
                            await handleEstadoCambio(seleccionarEvento.idCita);
                            setSeleccionarEvento(prev => ({ ...prev, estadoCita: 5 }));
                            setOpenConfirm(false);
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

export default CalendarioPac;
