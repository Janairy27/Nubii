import React, { useState } from "react";
import { Box, TextField, IconButton, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const ChatInput = ({ onSend }) => {
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
        display: "flex",
        p: 1,
        borderRadius: 3,
        m: 2,
        alignItems: "center",
        gap: 1,
        bgcolor: "#fff",
      }}
    >
      <TextField
        fullWidth
        placeholder="Escribe un mensaje..."
        required
        variant="outlined"
        size="small"
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
          },
        }}
      />
      <IconButton
        color="primary"
        onClick={handleSend}
        sx={{
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

export default ChatInput;
