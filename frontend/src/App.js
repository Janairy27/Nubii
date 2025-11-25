import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

// Páginas de entrada y autenticación
import Entrada from "./pages/Entrada";
import InicioSesion from "./pages/InicioSesion";
 // Páginas de recuperación de contraseña
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
// Componente de ruta protegida
import ProtectedRoute from './components/ProtectedRoute';

// Componentes de gestión de usuarios
import Registro from "./pages/Registro";
import VerPaciente from "./pages/VerPaciente";
import ActualizarPaciente from "./pages/ActualizarPaciente";
import VerProf from "./pages/VerProf";
import ActualizarProf from "./pages/ActualizarProf";
import VerAdmin from "./pages/VerAdmin";
import ActualizarAdmin from "./pages/ActualizarAdmin";

// Componentes menus para cada usuario
import MenuPaci from "./pages/MenuPaciente";
import MenuAdmin from "./pages/MenuAdmin";
import MenuProfesional from "./pages/MenuProfesional";

// Componentes de utilidades de usuario paciente
import RegistroSintomas from "./pages/RegistroSintomas";
import RegistroEvidencia from "./pages/RegistroEvidencia";
import BusquedaResultadoTest from "./pages/BusquedaResultadoTest";
import Recordatorios from "./pages/Recordatorios";
import CitaPaciente from "./pages/CitaPaciente";
import ActividadPersonalizadaPac from "./pages/ActividadPersonalizadaPac";
import ChatPage from "./pages/ChatPage";
import ReporteEmocional from "./pages/ReporteEmocional";
import ReporteDiagnosticoPac from "./pages/ReporteDiagnosticoPac";
import ReporteSeguimientoPac from "./pages/ReporteSeguimientoPac";
import ListadoSintomas from "./pages/ListadoSintomas";
import ListadoActividades from "./pages/ListadoActividades";

// Componentes de utilidades de usuario profesional
import RegistroActividad from "./pages/RegistroActSug";
import GestionActividades from "./pages/GestionActividades";
import RecordatoriosProf from "./pages/RecordatoriosProf";
import ResultadosTest from "./pages/ResultadosTest";
import CitaProfesional from "./pages/CitaProfesional";
import ActividadPersonalizada from "./pages/ActividadPersonalizada";
import ChatPageProf from "./pages/ChatPageProf";
import ReporteEmocionalProf from "./pages/ReporteEmocionalProf";
import ReporteCitaProf from "./pages/ReporteCitaProf";
import ReporteDiagnosticoProf from "./pages/ReporteDiagnosticoProf";
import ReporteSeguimientoProf from "./pages/ReporteSeguimientoProf";
import ReporteAgendados from "./pages/ReporteAgendadosProf";
import ListadoEvidencias from "./pages/ListadoEvidencias";
import ListadoSintoma from "./pages/BusquedaSintoma";

// Componentes de utilidades de usuario admnistrador
import ListadoSintomasAdmin from "./pages/BusquedaSintomaAdmin";
import ReporteCitaAdm from "./pages/ReporteCitaAdm";
import ReporteProfAgendados from "./pages/ReporteAgendadosAdm";
import RespaldoRestauracion from "./pages/Respaldo";
import ResultadosTestAdmin from "./pages/ResultadosTestAdmin";
import CitasAdmin from "./pages/ListadoCitasAdmin";
import ReporteUso from "./pages/ReporteUsoAdm";
import ListadoUsuarios from "./pages/ListadoUsuarios";
import FiltroActividades from "./pages/FiltroActividades";

function App() {

      //useCerrarSesion();

      return (
            <Routes>
                  <Route path="/" element={<Entrada />} />
                  <Route path="/login" element={<InicioSesion />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/registro" element={<Registro />} />

                  {/* Rutas de paciente */}
                  <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['3']}>
                        <MenuPaci /></ProtectedRoute>} />
                  <Route path="/ver-paciente" element={<ProtectedRoute allowedRoles={['3']}>
                        <VerPaciente /></ProtectedRoute>} />
                  <Route path="/actualizar-paciente" element={<ProtectedRoute allowedRoles={['3']}>
                        <ActualizarPaciente /> </ProtectedRoute>} />
                  <Route path="/sintomas" element={<ProtectedRoute allowedRoles={['3']}>
                        <RegistroSintomas /> </ProtectedRoute>} />
                  <Route path="/listado-sintomas" element={<ProtectedRoute allowedRoles={['3']}>
                        <ListadoSintomas /> </ProtectedRoute>} />

                  <Route path="/registroEvidencia/:idActividad" element={<ProtectedRoute allowedRoles={['3']}>
                        <RegistroEvidencia /> </ProtectedRoute>} />

                  <Route path="/listado-actividades" element={<ProtectedRoute allowedRoles={['3']}>
                        <ListadoActividades /> </ProtectedRoute>} />
                  <Route path="/recordatorio" element={<ProtectedRoute allowedRoles={['3']}>
                        <Recordatorios /> </ProtectedRoute>} />

                  <Route path="/listado-resultadoTest" element={<ProtectedRoute allowedRoles={['3']}>
                  <BusquedaResultadoTest /></ProtectedRoute>} />

                  <Route path="/citas" element={<ProtectedRoute allowedRoles={['3']}>
                        <CitaPaciente /> </ProtectedRoute>} />
                  <Route path="/recordatorios" element={<ProtectedRoute allowedRoles={['3']}>
                        <Recordatorios /> </ProtectedRoute>} />
                  <Route path="/chat" element={<ProtectedRoute allowedRoles={['3']}>
                        <ChatPage /> </ProtectedRoute>} />

                  {/*
                  <Route path="/linea-tiempo" element={<LineaTiempo />} />*/}
                  <Route path="/listado-recomendaciones" element={<ProtectedRoute allowedRoles={['3']}>
                        <ActividadPersonalizadaPac /></ProtectedRoute> } />
                  <Route path="/reporte-emocional" element={ <ProtectedRoute allowedRoles={['3']}>
                        <ReporteEmocional /> </ProtectedRoute> } />
                  <Route path="/reporte-diagnostico" element={<ReporteDiagnosticoPac />} />
                      <Route path="/reporte-seguimiento" element={<ReporteSeguimientoPac />} />
                 

                  {/* Rutas de profesional */}
                  <Route path="/dashboardProf" element={<ProtectedRoute allowedRoles={['2']}>
                        <MenuProfesional /> </ProtectedRoute>} />
                  <Route path="/ver-prof" element={<ProtectedRoute allowedRoles={['2']}>
                        <VerProf /> </ProtectedRoute>} />
                  <Route path="/actualizar-prof" element={<ProtectedRoute allowedRoles={['2']}>
                        <ActualizarProf /> </ProtectedRoute>} />
                  <Route path="/regisActSug" element={<ProtectedRoute allowedRoles={['2']}>
                        <RegistroActividad /></ProtectedRoute>} />
                  <Route path="/gesActSug" element={<ProtectedRoute allowedRoles={['2']}>
                        <GestionActividades /> </ProtectedRoute>} />
                  <Route path="/recordatorioProf" element={<ProtectedRoute allowedRoles={['2']}>
                        <RecordatoriosProf /> </ProtectedRoute>} />
                  
                  <Route path="/resultado-test" element={<ProtectedRoute allowedRoles={['2']}>
                        <ResultadosTest /> </ProtectedRoute>} />
                  <Route path="/listado-sintoma" element={<ProtectedRoute allowedRoles={['2']}>
                        <ListadoSintoma /> </ProtectedRoute>} />
                  <Route path="/listado-evidencia" element={<ProtectedRoute allowedRoles={['2']}>
                        <ListadoEvidencias /> </ProtectedRoute>} />

                  <Route path="/gestion-citas" element={<ProtectedRoute allowedRoles={['2']}>
                        <CitaProfesional /> </ProtectedRoute>} />
                  {/*{<Route path="/calendarioProf" element={<CalendarioProf />} />}*/}
                  <Route path="/actividad-personalizada" element={<ProtectedRoute allowedRoles={['2']}>
                        <ActividadPersonalizada /> </ProtectedRoute>} />
                         <Route path="/generar-reporte-emocional" element={ <ProtectedRoute allowedRoles={['2']}>
                              <ReporteEmocionalProf /> </ProtectedRoute>} />
                  <Route path="/reporte-citas" element={  <ProtectedRoute allowedRoles={['2']}>
                        <ReporteCitaProf /> </ProtectedRoute>} />
                    <Route path="/generar-reporte-diagnostico" element={<ReporteDiagnosticoProf />} />
                    <Route path="/generar-reporte-seguimiento" element={<ReporteSeguimientoProf />} />
                     <Route path="/generar-agendados" element={<ReporteAgendados />} />
                  <Route path="/chat-prof" element={<ProtectedRoute allowedRoles={['2']}>
                        <ChatPageProf /> </ProtectedRoute>} />

                  {/* Rutas de admin */}
                  <Route path="/dashboardAdmin" element={<ProtectedRoute allowedRoles={['1']}>
                        <MenuAdmin /> </ProtectedRoute>} />

                  <Route path="/ver-admin" element={<ProtectedRoute allowedRoles={['1']}>
                        <VerAdmin /></ProtectedRoute>} />
                  <Route path="/actualizar-admin" element={<ProtectedRoute allowedRoles={['1']}>
                        <ActualizarAdmin /> </ProtectedRoute>} />
                  <Route path="/listado-usuarios" element={<ProtectedRoute allowedRoles={['1']}>
                        <ListadoUsuarios /></ProtectedRoute>} />
                  <Route path="/filtro-actividades" element={<ProtectedRoute allowedRoles={['1']}>
                        <FiltroActividades /></ProtectedRoute>} />
                   <Route path="/reporte-citas-profesional" element={<ProtectedRoute allowedRoles={['1']}>
                        <ReporteCitaAdm /></ProtectedRoute>} /> 
                         <Route path="/reporte-uso" element={<ReporteUso />} />   
                    <Route path="/reporte-profesionales-agendados" element={<ReporteProfAgendados />} /> 
                    <Route path="/respaldo-restauracion" element={<RespaldoRestauracion />} />  
                    <Route path="/listado-sintomaAd" element={<ProtectedRoute allowedRoles={['1']}>
                        <ListadoSintomasAdmin /> </ProtectedRoute>} />
                   <Route path="/listado-test" element={<ProtectedRoute allowedRoles={['1']}>
                        <ResultadosTestAdmin /> </ProtectedRoute>} />
                  <Route path="/listado-citas" element={<ProtectedRoute allowedRoles={['1']}>
                        <CitasAdmin /> </ProtectedRoute>} />


                  
                 

            </Routes>
      );
}

export default App;
