import React from "react";
import {
 List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Box,
  Typography,
  Badge,
  Chip,
  Paper,
} from "@mui/material";
import { keyframes } from "@mui/system";

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(94,53,177,0.4); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(94,53,177,0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(94,53,177,0); }
`;


const ChatList = ({profesionales, onSelect, mensajesNuevos }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        width: 300,
        borderRadius: 0,
        bgcolor: "#fff",
        height: "100vh",
        overflowY: "auto",
        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#b39ddb",
          borderRadius: "10px",
        },
      }}
    >
      <Typography
        variant="h6"
        sx={{ p: 2, fontWeight: "bold", color: "#083c5dff" }}
      >
        Profesionales disponibles
      </Typography>
      <Divider />
      <List disablePadding>
        {profesionales.map((profesional, index) => {
          const profesionalIdStr = String(profesional.idProfesional);
            // Asegurarse de que se accede al objeto mensajesNuevos de forma segura
            const noLeidos = Number(mensajesNuevos[profesionalIdStr] ?? 0); 
            const tieneNoLeidos = noLeidos > 0;
           return(
          <React.Fragment key={profesionalIdStr}>
            <ListItemButton
              onClick={() => onSelect(profesional)}
             sx={{
                    py: 1.5,
                    px: 2,
                    borderRadius: "12px",
                    mx: 1,
                    mb: 0.5,
                    transition: "all 0.25s ease",
                    bgcolor: tieneNoLeidos ? "#f3e5f5" : "#fff",
                    borderLeft: tieneNoLeidos
                      ? "4px solid #7e57c2"
                      : "4px solid transparent",
                    "&:hover": {
                      bgcolor: tieneNoLeidos ? "#e1bee7" : "#f5f5f5",
                      transform: "scale(1.01)",
                    },
                  }}
            >
              <ListItemAvatar>
                 <Badge
                      color="error"
                      badgeContent={ noLeidos}
                      overlap="circular"
                      anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    >
                <Avatar
                  sx={{
                    bgcolor: "#2D5D7B",
                    width: 48,
                    height: 48,
                    fontSize: "1.2rem",
                  }}
                >
                  {profesional.nombreProfesional?.[0]?.toUpperCase() || "?"}
                </Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography fontWeight="bold"
                  sx={{
                          fontWeight: tieneNoLeidos ? 700 : 500,
                          color: tieneNoLeidos ? "#311b92" : "##355C7D",
                        }}>
                    {profesional.nombreProfesional || "Nombre desconocido"}
                  </Typography>
                }
                secondary={
                   tieneNoLeidos ? (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {profesional.especialidad || "Especialidad no definida"}
                  </Typography>

                 
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 0.5,
                            animation: `${pulse} 2s infinite`,
                          }}
                        >
                          <Chip
                            label="Sin leer"
                            size="small"
                            sx={{
                              bgcolor: "#d1c4e9",
                              color: "#311b92",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              borderRadius: "6px",
                              animation: `${pulse} 2s infinite`,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ color: "#6a1b9a", fontWeight: 600 }}
                          >
                            {noLeidos} mensaje
                            {noLeidos > 1 ? "s" : ""} sin leer
                          </Typography>
                        </Box>
                        </Box>
                      ) : (
                       // Si no hay no leídos, mostramos la especialidad y un mensaje estándar
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {profesional.especialidad || "Especialidad no definida"}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary", fontSize: "0.85rem" }}
                        >
                          No hay mensajes sin leer
                        </Typography>
                      </Box>
                      )
                }

              />
            </ListItemButton>
            {index < profesionales.length - 1 && <Divider component="li" />}
          </React.Fragment>
  );
})}
      </List>
    </Paper>
  );
};

export default ChatList;
