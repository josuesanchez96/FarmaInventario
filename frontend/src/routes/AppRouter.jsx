import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';

// Pages
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import MedicamentosListPage from '../pages/MedicamentosListPage';
import MedicamentoFormPage from '../pages/MedicamentoFormPage';
import SettingsPage from '../pages/SettingsPage';

export const AppRouter = () => {
  return (
    <Routes>
      {/* Public Authentication Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes (Requires JWT Authentication) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/medicamentos" element={<MedicamentosListPage />} />
          <Route path="/medicamentos/nuevo" element={<MedicamentoFormPage />} />
          <Route path="/medicamentos/editar/:id" element={<MedicamentoFormPage />} />
          <Route path="/configuracion" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Catch-all Wildcard Redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRouter;
