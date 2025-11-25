import React, { useEffect, useState } from "react";
import { useNotificaciones } from "../hooks/useNotificaciones";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Divider,
  ListItemIcon,
  Button,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ExitToApp,
  Dashboard,
  CheckCircle
} from "@mui/icons-material";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SearchIcon from "@mui/icons-material/Search";
import BackspaceIcon from "@mui/icons-material/Backspace";
import UpdateIcon from "@mui/icons-material/Update";
import HealingIcon from "@mui/icons-material/Healing";
import EventIcon from "@mui/icons-material/Event";
import ReminderIcon from "@mui/icons-material/AccessAlarm";

import AssignmentIcon from '@mui/icons-material/Assignment';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentAddIcon from '@mui/icons-material/AssignmentAdd';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import FolderIcon from '@mui/icons-material/Folder';
import { motion, AnimatePresence } from "framer-motion";


import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";

export default function Header() {

  const [anchorElNotif, setAnchorElNotif] = useState(null);
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const [anchorElActividad, setAnchorElActividad] = useState(null);
  const [anchorElReportes, setAnchorElReportes] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);

  // Abrir diálogo de confirmación
  const handleOpenConfirm = () => setOpenConfirm(true);

  // Cancelar
  const handleCloseConfirm = () => setOpenConfirm(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();

  const [idUsuario, setIdUsuario] = useState("");
  const [Nombre, setNombre] = useState("");
  const [aPaterno, setAPaterno] = useState("");

  const { notificaciones, marcarLeido, marcarTodasLeidas } = useNotificaciones(idUsuario || null);

  useEffect(() => {
    const storedId = localStorage.getItem("idUsuario");
    const storedNombre = localStorage.getItem("Nombre");
    const storedApaterno = localStorage.getItem("aPaterno");

    if (storedId && storedNombre && storedApaterno) {
      setIdUsuario(storedId);
      setNombre(storedNombre);
      setAPaterno(storedApaterno);
    } else {
      navigate("/login");
    }
  }, [navigate]);


  const handleLogout = () => {
    setOpenLogoutConfirm(true);
  };
  const confirmLogout = () => {
    localStorage.clear();
    setOpenLogoutConfirm(false);
    navigate("/login");
  };

  const cancelLogout = () => {
    setOpenLogoutConfirm(false);
  };


  const handleDelete = async () => {
    const url = `http://localhost:4000/api/auth/delete/${idUsuario}`;
    try {
      await axios.delete(url);
      setOpenConfirm(false); // cerrar confirmación
      setOpenSuccess(true); // abrir modal de éxito
      setTimeout(() => navigate("/login"), 2000); // redirigir después de 2 seg
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al eliminar la cuenta");
    }
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { text: "Ver Síntomas Generales", path: "/listado-sintoma", icon: <HealingIcon /> },
    { text: "Ver Evidencia de usuario", path: "/listado-evidencia", icon: <FolderIcon /> },
    { text: "Recordatorios", path: "/recordatorioProf", icon: <EventIcon /> },
    { text: "Tests Físicos", path: "/resultado-test", icon: <AssignmentIcon /> },
    { text: "Citas", path: "/gestion-citas", icon: <ReminderIcon /> },

  ];


  const userMenuItems = [
    { text: "Buscar Información", icon: <SearchIcon />, path: "/ver-prof" },
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboardProf" },
    { text: "Eliminar Cuenta", icon: <BackspaceIcon />, action: handleOpenConfirm },
    { text: "Actualizar Información", icon: <UpdateIcon />, path: "/actualizar-prof" },
    { text: "Cerrar Sesión", icon: <ExitToApp />, action: handleLogout },
  ];

  const submenuData = {
    actividades: [
      { text: "Registrar Actividades", path: "/regisActSug" },
      { text: "Ver Historial", path: "/gesActSug" },
    ],
    reportes: [
      { text: "Reporte emocional ", path: "/generar-reporte-emocional" },
      { text: "Reporte de citas", path: "/reporte-citas" },
      { text: "Reporte diagnósticos", path: "/generar-reporte-diagnostico" },
      { text: "Reporte seguimiento", path: "/generar-reporte-seguimiento" },
      { text: "Reporte agendados", path: "/generar-agendados" },

    ],


  };

  const handleMenuOpen = (setter) => (event) => setter(event.currentTarget);
  const handleMenuClose = () => {
    setAnchorElProfile(null);
    setAnchorElActividad(null);
    setAnchorElReportes(null);

    setMobileMoreAnchorEl(null);
  };

  const handleNavigation = (path, action) => {
    if (action) action();
    else navigate(path);
    handleMenuClose();
  };

  const renderSubMenu = (anchorEl, items) => (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          mt: 1,
          minWidth: 230,
          backgroundColor: "#FFFFFF",
          overflow: "hidden",
        },
      }}
    >
      {items.map((item) => (
        <motion.div
          key={item.text}
          whileHover={{ scale: 1.05, x: 5 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <MenuItem
            onClick={() => handleNavigation(item.path)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 3,
              py: 1.2,
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: 600,
              color: isActive(item.path) ? "#092181" : "#2D5D7B",
              backgroundColor: "#FFFFFF",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#F5E3E9",
                color: "#092181",
                transform: "translateX(4px) scale(1.05)",
                boxShadow: "0 4px 12px rgba(9,33,129,0.15)",
              },
            }}
          >
            {isActive(item.path) && (
              <Box
                sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#092181", mr: 1 }}
              />
            )}
            {item.text}
          </MenuItem>
        </motion.div>
      ))}
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "#F4F6F8", pb: "2rem" }}>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "white",
          color: "#67121A",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo */}
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer", gap: 1 }}
            onClick={() => navigate("/")}
          >
            <Avatar src="/logo.png" sx={{ bgcolor: "#092181", width: 40, height: 40 }}>N</Avatar>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#092181" }}>
              Nubii
            </Typography>
          </Box>

          {/* Desktop */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              {menuItems.map(({ text, path, icon }) => {
                const active = isActive(path);
                return (
                  <motion.div
                    key={text}
                    whileHover={{ y: -3, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 12 }}
                  >
                    <Button
                      onClick={() => navigate(path)}
                      startIcon={icon}
                      sx={{
                        textTransform: "capitalize",
                        fontWeight: 600,
                        color: active ? "#67121A" : "#67121A",
                        px: 2.5,
                        py: 1.2,
                        borderRadius: "12px",
                        backgroundColor: active ? "#F5E3E9" : "transparent",
                        boxShadow: active ? "0 4px 12px rgba(9,33,129,0.1)" : "none",
                        transition: "all 0.35s ease",
                        display: "flex",
                        alignItems: "center",
                        "&:hover": {
                          transform: "translateY(-3px) scale(1.05)",
                          backgroundColor: "#F5E3E9",
                          color: "#092181",
                          boxShadow: "0 4px 15px rgba(9,33,129,0.15)",
                        },
                        "& svg": { transition: "all 0.3s ease", color: "#67121A" },
                        "&:hover svg": { transform: "rotate(-10deg) scale(1.2)", color: "#092181" },
                      }}
                    >
                      {active && <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#092181", mr: 1 }} />}
                      {text}
                    </Button>
                  </motion.div>
                );
              })}

              {/* Submenús */}
              {[
                { label: "Actividades", icon: <AssignmentAddIcon />, setter: setAnchorElActividad },
                { label: "Reportes", icon: <AssessmentIcon />, setter: setAnchorElReportes },
              ].map(({ label, icon, setter }) => (
                <motion.div
                  key={label}
                  whileHover={{ y: -3, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 12 }}
                >
                  <Button
                    startIcon={icon}
                    onClick={handleMenuOpen(setter)}
                    sx={{
                      px: 2.5,
                      py: 1.2,
                      textTransform: "capitalize",
                      borderRadius: "12px",
                      color: "#67121A",
                      backgroundColor: "#FFFFFF",
                      fontWeight: 600,
                      transition: "all 0.35s ease",
                      display: "flex",
                      alignItems: "center",
                      "&:hover": {
                        transform: "translateY(-3px) scale(1.05)",
                        backgroundColor: "#F5E3E9",
                        color: "#092181",
                      },
                      "& svg": { transition: "all 0.3s ease", color: "#67121A" },
                      "&:hover svg": { transform: "rotate(-10deg) scale(1.2)", color: "#092181" },
                    }}
                  >
                    {label}
                  </Button>
                </motion.div>
              ))}
              {/*Notificaciones */}
              <motion.div whileHover={{ scale: 1.1 }}>
                <IconButton
                  onClick={(e) => setAnchorElNotif(e.currentTarget)}
                  sx={{
                    ml: 1,
                    borderRadius: "12px",
                    "&:hover": { backgroundColor: "#F5E3E9" },
                  }}
                >
                  <Badge
                    badgeContent={notificaciones.filter(n => n.leida === 0).length}
                    color="error"
                    invisible={notificaciones.filter(n => n.leida === 0).length === 0}

                    sx={{ "& .MuiBadge-badge": { fontSize: "0.75rem", height: 18, minWidth: 18 } }}
                  >
                    <NotificationsIcon sx={{ color: "#67121A" }} />
                  </Badge>
                </IconButton>
              </motion.div>


              {/* Configuración */}
              <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
                <IconButton
                  size="large"
                  edge="end"
                  onClick={handleMenuOpen(setAnchorElProfile)}
                  sx={{
                    ml: 1,
                    borderRadius: "12px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#F5E3E9",
                      transform: "translateY(-2px) scale(1.05)",
                      "& svg": { color: "#092181", transform: "rotate(-15deg) scale(1.2)" },
                    },
                    "& svg": { color: "#67121A ", transition: "all 0.3s ease" },
                  }}
                >
                  <ManageAccountsIcon />
                </IconButton>
              </motion.div>
            </Box>
          )}

          {/* Mobile */}
          {isMobile && (
            <IconButton color="inherit" onClick={(e) => setMobileMoreAnchorEl(e.currentTarget)}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Submenús */}
      {renderSubMenu(anchorElActividad, submenuData.actividades)}
      {renderSubMenu(anchorElReportes, submenuData.reportes)}

      <Menu
        anchorEl={anchorElNotif}
        open={Boolean(anchorElNotif)}
        onClose={() => setAnchorElNotif(null)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            mt: 1,
            minWidth: 320,
            backgroundColor: "#FFFFFF",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            maxHeight: 400,
            overflowY: "auto",
          },
        }}
      >
        {/* Header con título y botón de "Marcar todas" */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #eee",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#092181" }}>
            Notificaciones
          </Typography>
          {notificaciones.length > 0 && (
            <Button
              onClick={marcarTodasLeidas}
              size="small"
              sx={{
                color: "#2D5D7B",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Marcar todas
            </Button>
          )}
        </Box>

        {/* Lista de notificaciones */}
        {notificaciones.length === 0 ? (
          <Typography sx={{ p: 2, color: "#777", textAlign: "center" }}>
            No tienes notificaciones 🎉
          </Typography>
        ) : (
          notificaciones.map((n) => (
            <MenuItem
              key={n.idRecordatorio || n.idNotificacion}
              onClick={() => marcarLeido(n.idRecordatorio || n.idNotificacion)}
              sx={{
                flexDirection: "column",
                alignItems: "flex-start",
                whiteSpace: "normal",
                py: 1.5,
                px: 2,
                mb: 0.5,
                borderLeft: n.leida === 0 ? "4px solid #092181" : "4px solid transparent",
                backgroundColor: n.leida === 0 ? "rgba(9,33,129,0.08)" : "transparent",
                borderRadius: "8px",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(9,33,129,0.15)",
                  transform: "translateX(2px)",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                },
                cursor: "pointer",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: n.leida === 0 ? "bold" : 500,
                  color: "#092181",
                  mb: 0.3,
                }}
              >
                {n.titulo}
              </Typography>
              <Typography variant="body2" sx={{ color: "#555", mb: 0.5 }}>
                {n.mensaje}
              </Typography>
              <Typography variant="caption" sx={{ color: "#888" }}>
                {new Date(n.fecha_creacion).toLocaleString()}
              </Typography>
            </MenuItem>
          ))
        )}

        <Divider />
      </Menu>




      {/* Menú usuario */}
      <Menu
        anchorEl={anchorElProfile}
        open={Boolean(anchorElProfile)}
        onClose={handleMenuClose}
        PaperProps={{ sx: { borderRadius: "12px", mt: 1, minWidth: 220, backgroundColor: "#FFFFFF" } }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#092181" }}>
            {Nombre} {aPaterno}
          </Typography>
        </Box>
        <Divider />
        {userMenuItems.map((item) => (
          <MenuItem
            key={item.text}
            onClick={() => handleNavigation(item.path, item.action)}
            sx={{
              transition: "all 0.3s ease",
              "&:hover": { transform: "translateX(4px)", backgroundColor: "#F5E3E9" },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            {item.text}
          </MenuItem>
        ))}

      </Menu>

      {/* AnimatePresence para el diálogo de confirmación */}
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
              onClose={handleCloseConfirm}
              PaperProps={{
                sx: {
                  borderRadius: "16px",
                  p: 1,
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
              <DialogTitle
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  pb: 0,
                }}
              >
                <WarningAmberIcon sx={{ color: "#C62828", fontSize: 32 }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#092181" }}
                >
                  Confirmar eliminación
                </Typography>
              </DialogTitle>

              <DialogContent>
                <DialogContentText sx={{ color: "#333", mt: 1 }}>
                  ¿Estás seguro de que quieres eliminar tu cuenta?
                  <br />
                  <strong>Esta acción no se puede deshacer.</strong>
                </DialogContentText>
              </DialogContent>

              <DialogActions sx={{ p: 2 }}>
                <Button
                  onClick={handleCloseConfirm}
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
                    onClick={handleDelete}
                    variant="contained"
                    sx={{
                      backgroundColor: "#C62828",
                      "&:hover": { backgroundColor: "#A31515" },
                      fontWeight: 600,
                      borderRadius: "10px",
                      textTransform: "capitalize",
                    }}
                  >
                    Eliminar
                  </Button>
                </motion.div>
              </DialogActions>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>

      {/*  Modal de éxito animado */}
      <AnimatePresence>
        {openSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
          >
            <Dialog
              open={openSuccess}
              PaperProps={{
                sx: {
                  borderRadius: "16px",
                  textAlign: "center",
                  p: 3,
                  backgroundColor: "#F4F6F8",
                },
              }}
            >
              <CheckCircle
                sx={{ color: "#2E7D32", fontSize: 60, mb: 2 }}
              />
              <Typography variant="h6" sx={{ color: "#092181", fontWeight: 600 }}>
                Cuenta eliminada correctamente
              </Typography>
              <Typography variant="body2" sx={{ color: "#555", mt: 1 }}>
                Serás redirigido al login...
              </Typography>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diálogo de confirmación de cerrar sesión */}
      <AnimatePresence>
        {openLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Dialog
              open={openLogoutConfirm}
              onClose={cancelLogout}
              PaperProps={{
                sx: {
                  borderRadius: "16px",
                  p: 1,
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
              <DialogTitle
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  pb: 0,
                }}
              >
                <ExitToApp sx={{ color: "#092181", fontSize: 30 }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#092181" }}
                >
                  ¿Deseas cerrar sesión?
                </Typography>
              </DialogTitle>

              <DialogContent>
                <DialogContentText sx={{ color: "#333", mt: 1 }}>
                  Tu sesión actual se cerrará y deberás volver a iniciar sesión para continuar.
                </DialogContentText>
              </DialogContent>

              <DialogActions sx={{ p: 2 }}>
                <Button
                  onClick={cancelLogout}
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
                    onClick={confirmLogout}
                    variant="contained"
                    sx={{
                      backgroundColor: "#092181",
                      "&:hover": { backgroundColor: "#07165a" },
                      fontWeight: 600,
                      borderRadius: "10px",
                      textTransform: "capitalize",
                    }}
                  >
                    Cerrar sesión
                  </Button>
                </motion.div>
              </DialogActions>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>






      {/* Menú móvil */}
      <Menu
        anchorEl={mobileMoreAnchorEl}
        open={Boolean(mobileMoreAnchorEl)}
        onClose={handleMenuClose}
        PaperProps={{ sx: { borderRadius: "12px", mt: 1, minWidth: 180, backgroundColor: "#FFFFFF" } }}
      >
        {[
          { label: "Actividades", setter: setAnchorElActividad, path: "/actividades" },
          { label: "Reportes", setter: setAnchorElReportes, path: "/reportes" },
          { label: "Usuario", setter: setAnchorElProfile },
        ].map(({ label, setter, path }) => (
          <motion.div key={label} whileHover={{ scale: 1.05, x: 4 }} transition={{ type: "spring", stiffness: 300 }}>
            <MenuItem
              onClick={handleMenuOpen(setter)}
              sx={{
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {path && isActive(path) && (
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#092181" }} />
              )}
              {label}
            </MenuItem>
          </motion.div>
        ))}

      </Menu>
    </Box>

  );
}
