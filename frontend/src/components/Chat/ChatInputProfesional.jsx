import React, { useState } from "react";
import { Box, TextField, IconButton, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const ChatInputProfesional = ({ onSend }) => {
  const [mensaje, setMensaje] = useState("");

  const handleSend = () => {
    if (mensaje.trim() === "") return;
    onSend(mensaje);
    setMensaje("");
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 1,
        display: "flex",
        alignItems: "center",
        borderRadius: "25px",
        m: 2,
        bgcolor: "#ffffff",
      }}
    >
      <TextField
        fullWidth
        required
        placeholder="Escribe un mensaje..."
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") handleSend();
        }}
        variant="outlined"
        size="small"
        sx={{
          borderRadius: "25px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "25px",
            bgcolor: "#f0f2f5",
          },
        }}
      />
      <IconButton
        color="primary"
        onClick={handleSend}
        sx={{
          ml: 1,
          bgcolor: "#67121A",
          "&:hover": { bgcolor: "#6e2b31ff" },
          color: "#fff",
        }}
      >
        <SendIcon />
      </IconButton>
    </Paper>
  );
};

export default ChatInputProfesional;
