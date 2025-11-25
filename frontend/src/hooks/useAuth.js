import { useState, useEffect } from "react";
import axios from "axios";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    axios.get("http://localhost:4000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      setUser(res.data);
      console.log("Usuario autenticado:", res.data);
    })
    .catch(err => {
      console.error("Error al obtener usuario:", err.response?.data || err.message);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
    })
    .finally(() => setLoading(false));
  }, []);

  return { user, setUser, loading };
}
