import moment from "moment";

// Días laborales: lunes a viernes
function diaLaboral(fecha) {
  const dia = fecha.isoWeekday();
  return dia >= 1 && dia <= 5;
}

// Fin de semana: sábado y domingo
function finSemana(fecha) {
  const dia = fecha.isoWeekday();
  return dia === 6 || dia === 7;
}

// Determina si debe ejecutarse según la frecuencia
export function Ejecutarse(frecuencia, fechaEnvio) {
  const hoy = moment();
  const ultimo = fechaEnvio ? moment(fechaEnvio) : null;

  switch (frecuencia) {
    case 1: // Una sola vez
      return !fechaEnvio; // Solo si no se ha enviado antes

    case 2: // Diario
      return !ultimo || !ultimo.isSame(hoy, "day");

    case 3: // Días laborales
      return diaLaboral(hoy) && (!ultimo || !ultimo.isSame(hoy, "day"));

    case 4: // Fin de semana
      return finSemana(hoy) && (!ultimo || !ultimo.isSame(hoy, "day"));

    case 5: // Semanal
      return !ultimo || hoy.diff(ultimo, "days") >= 7;

    case 6: // Quincenal
      return !ultimo || hoy.diff(ultimo, "days") >= 15;

    case 7: // Mensual
      return !ultimo || hoy.diff(ultimo, "months") >= 1;

    default:
      return false;
  }
}
