import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";

const CitasPage = () => {
  const [citas, setCitas] = useState([]);
  const [nuevaCita, setNuevaCita] = useState({ paciente: "", fecha: "" });

  useEffect(() => {
    axios.get("http://localhost:5000/api/citas")
      .then((res) => setCitas(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setNuevaCita({ ...nuevaCita, [e.target.name]: e.target.value });
  };

  const handleAddCita = () => {
    axios.post("http://localhost:5000/api/citas", nuevaCita)
      .then((res) => {
        setCitas([...citas, res.data]);
        setNuevaCita({ paciente: "", fecha: "" });
      })
      .catch((err) => console.error(err));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Calendario de Citas
      </Typography>

      {/* Formulario */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={5}>
          <TextField
            fullWidth
            label="Paciente"
            name="paciente"
            value={nuevaCita.paciente}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={5}>
          <TextField
            fullWidth
            type="datetime-local"
            name="fecha"
            value={nuevaCita.fecha}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAddCita}
          >
            Agendar
          </Button>
        </Grid>
      </Grid>

      {/* Lista de citas */}
      <Grid container spacing={2}>
        {citas.map((cita) => (
          <Grid item xs={12} md={6} key={cita.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{cita.paciente}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {new Date(cita.fecha).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CitasPage;
