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

const ChatListProfesional = ({ pacientes, onSelect, mensajesNuevos }) => {
  return (
    <Paper
      elevation={3}
      sx={{ height: "100%", overflowY: "auto", borderRadius: "16px", bgcolor: "#fafafa", p: 1 }}
    >
      {pacientes.length === 0 ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", mt: 6, fontStyle: "italic" }}
        >
          No hay pacientes disponibles
        </Typography>
      ) : (
        <List disablePadding>
          {pacientes.map((paciente, index) => {
            const pacienteIdStr = String(paciente.idPaciente);
            // Asegurarse de que se accede al objeto mensajesNuevos de forma segura
            const noLeidos = Number(mensajesNuevos[pacienteIdStr] ?? 0); 
            const tieneNoLeidos = noLeidos > 0;

            return (
              <React.Fragment key={pacienteIdStr}>
                <ListItemButton
                  onClick={() => onSelect(paciente)}
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
                          bgcolor: tieneNoLeidos ? "#5e35b1" : "#9e9e9e",
                          color: "white",
                          width: 45,
                          height: 45,
                          fontSize: "1rem",
                          fontWeight: "bold",
                          animation: tieneNoLeidos ? `${pulse} 1.5s infinite` : "none",
                        }}
                      >
                        {paciente.nombrePaciente?.[0]?.toUpperCase() || "P"}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: tieneNoLeidos ? 700 : 500,
                          color: tieneNoLeidos ? "#311b92" : "#212121",
                        }}
                      >
                        {paciente.nombrePaciente}
                      </Typography>
                    }
                    secondary={
                      tieneNoLeidos ? (
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
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary", fontSize: "0.85rem" }}
                        >
                          No hay mensajes sin leer
                        </Typography>
                      )
                    }
                  />
                </ListItemButton>

                {index < pacientes.length - 1 && (
                  <Divider component="li" sx={{ mx: 2, borderColor: "#eee" }} />
                )}
              </React.Fragment>
            );
          })}
        </List>
      )}
    </Paper>
  );
};

export default ChatListProfesional;
