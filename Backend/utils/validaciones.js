// Expresiones regurales para los campos
//const CURP_ExpReg= /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/;
const CURP_ExpReg =
  /^[A-Z][AEIOU][A-Z]{2}\d{6}[HM](AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d]\d$/;
const EMAIL_ExpReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SOLO_LETRAS_ExpReg = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;
const CALLE_ExpReg = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+\s\d{1,5}$/;
const CEDULA_ExpReg = /^\d{7,8}$/;
const TELEFONO_ExpReg = /^\d{10}$/;
const PARRAFOS_GRANDES_ExpReg = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s.,\n]+$/;
const ExpReg_HORA = /^([01]\d|2[0-3]):[0-5]\d$/;

export function validarNombre(nombre, apaterno, amaterno) {
  const errores = [];
  if (!nombre) errores.push("El nombre es obligatorio");
  if (!apaterno) errores.push("El apellido paterno es obligatorio");
  if (nombre && !SOLO_LETRAS_ExpReg.test(nombre)) {
    errores.push("El nombre debe contener solo letras");
  }
  if (apaterno && !SOLO_LETRAS_ExpReg.test(apaterno)) {
    errores.push("El apellido paterno debe contener solo letras");
  }
  if (amaterno && !SOLO_LETRAS_ExpReg.test(amaterno)) {
    errores.push("El apellido materno debe contener solo letras");
  }
  return errores;
}

export function validarFechaNacimiento(fecha_nacimiento) {
  const errores = [];
  if (!fecha_nacimiento) errores.push("La fecha de nacimiento es obligatoria");
  if (fecha_nacimiento && isNaN(Date.parse(fecha_nacimiento))) {
    errores.push("Fecha de nacimiento inválida");
  } else {
    const fecha = new Date(fecha_nacimiento);
    const hoy = new Date();
    const edadMinina = new Date();
    edadMinina.setFullYear(hoy.getFullYear() - 18);
    const edadMaxima = new Date();
    edadMaxima.setFullYear(hoy.getFullYear() - 70);

    if (fecha > edadMinina) {
      errores.push("Debes tener al menos 18 años");
    }
    if (fecha < edadMaxima) {
      errores.push("La edad máxima permitida es de 70 años");
    }
  }
  return errores;
}

export function validarTelefono(telefono) {
  const errores = [];
  if (!telefono) errores.push("El número telefónico es obligatorio");
  if (telefono && !TELEFONO_ExpReg.test(telefono)) {
    errores.push("Número telefónico inválido");
  }
  return errores;
}

export function validarCorreo(correo) {
  const errores = [];
  if (!correo) errores.push("El correo electrónico es obligatorio");
  if (correo && !EMAIL_ExpReg.test(correo)) {
    errores.push("Correo electrónico inválido");
  }
  return errores;
}

export function validarCurp(curp) {
  const errores = [];
  if (!curp) errores.push("La CURP es obligatoria");
  if (curp && !CURP_ExpReg.test(curp)) {
    errores.push("CURP inválida");
  }
  return errores;
}

export function validarDomicilio(estado, municipio, calle) {
  const errores = [];
  if (!estado) errores.push("Estado obligatorio");
  if (!municipio) errores.push("Municipio obligatorio");
  if (!calle) errores.push("Calle obligatoria");
  if (estado && !SOLO_LETRAS_ExpReg.test(estado)) {
    errores.push("Estado inválido");
  }
  if (municipio && !SOLO_LETRAS_ExpReg.test(municipio)) {
    errores.push("Municipio inválido");
  }
  if (calle && !CALLE_ExpReg.test(calle)) {
    errores.push("Calle inválida (Debe contener letras y  números)");
  }
  return errores;
}

export function validarCedula(cedula) {
  const errores = [];
  if (!cedula) errores.push("La cédula es obligatoria");
  if (cedula && !CEDULA_ExpReg.test(cedula)) {
    errores.push("Cédula inválida");
  }
  return errores;
}

export function validardetonante(detonante) {
  const errores = [];
  if (!detonante) errores.push("El detonante del síntoma es obligatorio");
  if (detonante && !SOLO_LETRAS_ExpReg.test(detonante)) {
    errores.push(
      "El detonante del síntoma no debe contener puntos y saltos de línea"
    );
  }
  return errores;
}

export function validarUbicacion(ubicacion) {
  const errores = [];
  if (!ubicacion) errores.push("La ubicación es obligatoria");
  if (ubicacion && !SOLO_LETRAS_ExpReg.test(ubicacion)) {
    errores.push("La ubicación no debe contener puntos y saltos de línea");
  }
  return errores;
}

export function validarActReciente(actividad) {
  const errores = [];
  if (!actividad) errores.push("La actividad reciente es obligatoria");
  if (actividad && !SOLO_LETRAS_ExpReg.test(actividad)) {
    errores.push(
      "La actividad reciente no debe contener puntos y saltos de línea"
    );
  }
  return errores;
}

export function validarParrafos(parrafo) {
  const errores = [];
  if (parrafo && !PARRAFOS_GRANDES_ExpReg) {
    errores.push("No se cumple con el formato en los detalles");
  }
  return errores;
}

export function validarActividad(nombre, descripcion, objetivo) {
  const errores = [];
  if (!nombre) errores.push("El nombre de la actividad es obligatorio");
  if (!descripcion) errores.push("La descripción es obligatoria");
  if (!objetivo) errores.push("El objetivo es obligatorio");

  if (nombre && !SOLO_LETRAS_ExpReg.test(nombre)) {
    errores.push("El nombre debe ser textual");
  }
  if (descripcion && !PARRAFOS_GRANDES_ExpReg.test(descripcion)) {
    errores.push("La descripción debe ser textual");
  }
  if (objetivo && !PARRAFOS_GRANDES_ExpReg.test(objetivo)) {
    errores.push("El objetivo debe ser textual");
  }
  return errores;
}

export function validarRecordatorio(mensaje, hora) {
  const errores = [];
  if (!mensaje) errores.push("El titulo del recordatorio es obligatorio");
  if (!hora) errores.push("La hora es obligatoria");
  if (mensaje && !SOLO_LETRAS_ExpReg.test(mensaje)) {
    errores.push("El titulo debe ser tipo texto");
  }
  //if(hora && !ExpReg_HORA.test(hora)){
  //  errores.push("Hora inválida");
  // }
  return errores;
}

export function validarResultados(
  idPaciente,
  tipo_test,
  puntaje,
  categ_resultado,
  interpret,
  recom
) {
  const errores = [];
  if (!idPaciente) errores.push("Paciente obligatorio");
  if (!tipo_test) errores.push("Tipo de test obligatorio");
  if (!puntaje) errores.push("Puntaje obligatorio");
  if (!categ_resultado) errores.push("Categoria de resultados obligatorio");
  if (!interpret) errores.push("Interpretación obligatoria");
  if (interpret && !PARRAFOS_GRANDES_ExpReg.test(interpret)) {
    errores.push("Favor de cumplir con el formato");
  }
  if (recom && !PARRAFOS_GRANDES_ExpReg.test(recom)) {
    errores.push("Recomendaciones inválidas");
  }
  return errores;
}

export const transaccionvalida = (estadoActual, nuevoEstado, rol) => {
  const transaccionesPorRol = {
    3: {
      1: [5],
    },
    2: {
      1: [2, 10, 11, 9],
      2: [3, 6, 9],
      3: [4, 7],
    },
  };
  const transacciones = transaccionesPorRol[rol] || {};

  if (estadoActual === null) {
    return nuevoEstado === 1 && rol === 2;
  }

  const permitidos = transacciones[estadoActual] || [];
  return permitidos.includes(nuevoEstado);
};
