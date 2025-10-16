const momento = require('moment');

function diaLaboral(fecha){
    const dia = fecha.isoWeekday();
    return dia >= 1 && dia <= 5;
}

function finSemana(fecha){
    const dia = fecha.isoWeekday();
    return dia === 6 || dia === 7;
}

function Ejecutarse(frecuencia, fechaEnvio){
    const hoy = momento();
    const ultimo = momento(fechaEnvio);

    switch(frecuencia){
        case 1: // Una sola vez
            return !fechaEnvio;

        case 2: // diario
            return !fechaEnvio.isSame(hoy, 'day');

        case 3: // dias laborales
            return diaLaboral(hoy) && !ultimo.isSame(hoy, 'day');

        case 4: // fin de semana
            return finSemana(hoy) && !ultimo.isSame(hoy, "day");

        case 5: // semanal
            return hoy.diff(ultimo, 'days') >= 7;

        case 6: // quincenal
            return hoy.diff(ultimo, 'days') >= 15;

        case 7: // mensual
            return hoy.diff(ultimo, 'months') >= 1;

        default:
            return false;
    }
};