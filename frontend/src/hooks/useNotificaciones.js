import { useEffect, useState } from "react";
import axios from "axios";

export const useNotificaciones = (idUsuario) => {
  const [notificaciones, setNotificaciones] = useState([]);

  //  Obtener notificaciones del usuario
  const fetchNotificaciones = async () => {
    if (!idUsuario) return;
    try {
      const res = await axios.get(
        `http://localhost:4000/api/notificaciones/${idUsuario}`
      );
      setNotificaciones(res.data);
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
    }
  };

  // Marcar una notificación como leída
  const marcarLeido = async (idNotificacion) => {
    try {
      await axios.put(
        `http://localhost:4000/api/notificaciones/marcar-leido/${idNotificacion}`
      );
      // Actualizar en memoria sin volver a llamar a la BD
      setNotificaciones((prev) =>
        prev.map((n) =>
          n.idNotificacion === idNotificacion ? { ...n, leido: 1 } : n
        )
      );
    } catch (error) {
      console.error("Error al marcar como leído:", error);
    }
  };

  //  Marcar todas las notificaciones como leídas
  const marcarTodasLeidas = async () => {
    try {
      await axios.put(
        `http://localhost:4000/api/notificaciones/marcar-todas/${idUsuario}`
      );
      setNotificaciones((prev) => prev.map((n) => ({ ...n, leido: 1 })));
    } catch (error) {
      console.error("Error al marcar todas como leídas:", error);
    }
  };

  useEffect(() => {
    fetchNotificaciones();
    const interval = setInterval(fetchNotificaciones, 15000); 
    return () => clearInterval(interval);
  }, [idUsuario]);

  return { notificaciones, marcarLeido, marcarTodasLeidas };
};
