import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { medicamentosApi } from '../api/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { LoadingSpinner, ErrorAlert } from '../components/common/States';
import {
  Pill,
  AlertTriangle,
  Clock,
  Boxes,
  PlusCircle,
  ArrowRight,
  TrendingDown,
  Activity,
  CheckCircle2
} from 'lucide-react';

export const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await medicamentosApi.getDashboard();
      setStats(response.data);
    } catch (err) {
      setError(err.message || 'Error al obtener el resumen del inventario');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Cargando métricas e indicadores del dashboard..." size="lg" />;
  }

  if (error) {
    return <ErrorAlert title="Error de Carga" message={error} onRetry={fetchDashboardData} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner / Welcome */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 via-brand-600 to-teal-600 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-brand-100 mb-3 border border-white/20">
              <Activity className="w-3.5 h-3.5" />
              <span>Resumen Ejecutivo en Tiempo Real</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Panel de Control de Inventario</h2>
            <p className="text-brand-100 text-xs sm:text-sm mt-1 max-w-xl">
              Monitoreo continuo de lote, vencimientos de medicamentos y niveles mínimos de stock.
            </p>
          </div>
          <Link to="/medicamentos/nuevo">
            <Button variant="secondary" size="md" icon={PlusCircle} className="shrink-0 shadow-md">
              Registrar Medicamento
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Medicamentos */}
        <Card className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Medicamentos</p>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                {stats.totalMedicamentos}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                {stats.totalUnidades} unidades en almacén
              </p>
            </div>
            <div className="p-3 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-2xl border border-brand-200/60 dark:border-brand-800/40">
              <Pill className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Stock Bajo */}
        <Card className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Alertas de Stock Bajo</p>
              <h4 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {stats.stockBajoCount}
              </h4>
              <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-1">
                Lotes con ≤ 10 unidades
              </p>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-2xl border border-amber-200/60 dark:border-amber-800/40">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Próximos a Vencer */}
        <Card className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Próximos a Vencer</p>
              <h4 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {stats.proximosVencerCount}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Vencen en los próximos 60 días
              </p>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-2xl border border-amber-200/60 dark:border-amber-800/40">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Vencidos */}
        <Card className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Medicamentos Vencidos</p>
              <h4 className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
                {stats.vencidosCount}
              </h4>
              <p className="text-[11px] text-rose-500 dark:text-rose-400/80 mt-1">
                Requieren retiro inmediato
              </p>
            </div>
            <div className="p-3 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-2xl border border-rose-200/60 dark:border-rose-800/40">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid: Recent Registrations & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Items Table Card */}
        <Card
          className="lg:col-span-2"
          title="Últimos Medicamentos Modificados / Registrados"
          subtitle="Acceso directo a las últimas actualizaciones de inventario"
          action={
            <Link to="/medicamentos" className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 flex items-center gap-1">
              <span>Ver Todos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-2">Código</th>
                  <th className="py-3 px-2">Descripción</th>
                  <th className="py-3 px-2">Cantidad</th>
                  <th className="py-3 px-2">Vencimiento</th>
                  <th className="py-3 px-2">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {stats.ultimosRegistros.map((med) => {
                  const isLow = med.cantidad <= 10;
                  const isExpired = new Date(med.vencimiento) < new Date('2026-09-08');

                  return (
                    <tr key={med.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-2 font-mono font-semibold text-brand-600 dark:text-brand-400">
                        {med.codigo}
                      </td>
                      <td className="py-3 px-2 font-medium">{med.descripcion}</td>
                      <td className="py-3 px-2">
                        <span className={`font-semibold ${isLow ? 'text-amber-600 dark:text-amber-400' : ''}`}>
                          {med.cantidad}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-slate-500">{med.vencimiento}</td>
                      <td className="py-3 px-2">
                        {isExpired ? (
                          <Badge variant="danger">Vencido</Badge>
                        ) : isLow ? (
                          <Badge variant="warning">Stock Bajo</Badge>
                        ) : (
                          <Badge variant="success">Normal</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Quick Actions & System Health */}
        <div className="space-y-6">
          <Card title="Acciones Rápidas" subtitle="Herramientas de gestión de inventario">
            <div className="space-y-2.5">
              <Link to="/medicamentos/nuevo" className="block">
                <Button variant="outline" className="w-full justify-start text-left" icon={PlusCircle}>
                  Registrar Nuevo Medicamento
                </Button>
              </Link>
              <Link to="/medicamentos?filter=low_stock" className="block">
                <Button variant="outline" className="w-full justify-start text-left" icon={Boxes}>
                  Filtrar Medicamentos con Stock Bajo
                </Button>
              </Link>
              <Link to="/medicamentos?filter=expiring_soon" className="block">
                <Button variant="outline" className="w-full justify-start text-left" icon={Clock}>
                  Filtrar Medicamentos Próximos a Vencer
                </Button>
              </Link>
            </div>
          </Card>

          <Card title="Estado de la Normativa" subtitle="Control de Calidad en Lotes">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 text-xs space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Auditoría de Lotes Activa</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                El sistema efectúa un escaneo automatizado en cada consulta verificando la caducidad según normativa farmacéutica vigente.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
