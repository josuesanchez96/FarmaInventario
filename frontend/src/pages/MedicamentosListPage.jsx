import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { medicamentosApi } from '../api/api';
import { useToast } from '../context/ToastContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { SkeletonLoader, EmptyState, ErrorAlert } from '../components/common/States';
import {
  Search,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  AlertTriangle,
  Pill,
  Calendar,
  Layers,
  DollarSign,
  Tag
} from 'lucide-react';

export const MedicamentosListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'all';

  const [medicamentos, setMedicamentos] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 8, totalPages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState(initialFilter);
  
  // UX States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [selectedMed, setSelectedMed] = useState(null); // Quick view modal
  const [deleteMed, setDeleteMed] = useState(null); // Delete confirmation modal
  const [isDeleting, setIsDeleting] = useState(false);

  const toast = useToast();

  // Fetch list from API
  const fetchMedicamentos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await medicamentosApi.getAll({
        search,
        filter: filterStatus,
        page: pagination.page,
        limit: pagination.limit
      });
      setMedicamentos(response.data || []);
      if (response.pagination) {
        setPagination(prev => ({
          ...prev,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages
        }));
      }
    } catch (err) {
      setError(err.message || 'No se pudo cargar la lista de medicamentos.');
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchMedicamentos();
  }, [fetchMedicamentos]);

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle Filter Change
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setSearchParams({ filter: status });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!deleteMed) return;
    setIsDeleting(true);
    try {
      await medicamentosApi.delete(deleteMed.id);
      toast.success(`El medicamento "${deleteMed.descripcion}" fue eliminado exitosamente.`);
      setDeleteMed(null);
      fetchMedicamentos();
    } catch (err) {
      toast.error(err.message || 'Error al intentar eliminar el medicamento.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Status Badge Resolver Helper
  const renderStatusBadge = (med) => {
    const today = new Date('2026-09-08');
    const venc = new Date(med.vencimiento);
    const diffDays = Math.ceil((venc - today) / (1000 * 60 * 60 * 24));

    if (venc < today) {
      return <Badge variant="danger">Vencido</Badge>;
    }
    if (diffDays <= 60) {
      return <Badge variant="warning">Por Vencer ({diffDays} días)</Badge>;
    }
    if (med.cantidad <= 10) {
      return <Badge variant="warning">Stock Bajo ({med.cantidad} unid)</Badge>;
    }
    return <Badge variant="success">Disponible</Badge>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Inventario de Medicamentos</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestión completa de stock, lotes y fechas de caducidad
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            icon={RefreshCw}
            onClick={fetchMedicamentos}
            isLoading={loading}
          >
            Actualizar
          </Button>
          <Link to="/medicamentos/nuevo">
            <Button variant="primary" size="md" icon={PlusCircle}>
              Nuevo Medicamento
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar Container */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="w-full lg:max-w-md">
            <Input
              placeholder="Buscar por código, descripción o número de lote..."
              icon={Search}
              value={search}
              onChange={handleSearchChange}
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 mr-2 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              <span>Filtro:</span>
            </div>
            {[
              { id: 'all', label: 'Todos' },
              { id: 'low_stock', label: 'Stock Bajo' },
              { id: 'expiring_soon', label: 'Próximos a Vencer' },
              { id: 'expired', label: 'Vencidos' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleFilterChange(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all shrink-0 ${
                  filterStatus === tab.id
                    ? 'bg-brand-600 text-white shadow-sm dark:bg-brand-500'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* UX State: Error */}
      {error && (
        <ErrorAlert
          title="Error de Conexión o Datos"
          message={error}
          onRetry={fetchMedicamentos}
        />
      )}

      {/* UX State: Loading */}
      {loading && !error && (
        <Card className="p-0 overflow-hidden">
          <SkeletonLoader rows={6} cols={6} />
        </Card>
      )}

      {/* UX State: Empty */}
      {!loading && !error && medicamentos.length === 0 && (
        <EmptyState
          title="No se encontraron medicamentos"
          description={
            search || filterStatus !== 'all'
              ? 'No hay registros que coincidan con la búsqueda o filtro seleccionado.'
              : 'El inventario está actualmente vacío. Comienza registrando el primer medicamento.'
          }
          actionLabel="Registrar Medicamento"
          onAction={() => window.location.href = '/medicamentos/nuevo'}
        />
      )}

      {/* Table Component View */}
      {!loading && !error && medicamentos.length > 0 && (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Código</th>
                  <th className="py-3.5 px-4">Descripción</th>
                  <th className="py-3.5 px-4">Cantidad</th>
                  <th className="py-3.5 px-4">Lote</th>
                  <th className="py-3.5 px-4">Vencimiento</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {medicamentos.map((med) => (
                  <tr
                    key={med.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-600 dark:text-brand-400">
                      {med.codigo}
                    </td>
                    <td className="py-3.5 px-4 font-medium">
                      <div>
                        <span>{med.descripcion}</span>
                        {med.categoria && (
                          <span className="block text-[11px] text-slate-400 dark:text-slate-500 font-normal">
                            {med.categoria}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold">
                      <span className={med.cantidad <= 10 ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}>
                        {med.cantidad} unids
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                      {med.lote}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium">
                      {med.vencimiento}
                    </td>
                    <td className="py-3.5 px-4">
                      {renderStatusBadge(med)}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      {/* View Details Modal */}
                      <button
                        onClick={() => setSelectedMed(med)}
                        title="Ver Detalles"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Edit Route Link */}
                      <Link to={`/medicamentos/editar/${med.id}`}>
                        <button
                          title="Editar"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </Link>

                      {/* Delete Modal Trigger */}
                      <button
                        onClick={() => setDeleteMed(med)}
                        title="Eliminar"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Mostrando <span className="font-semibold text-slate-800 dark:text-slate-200">{medicamentos.length}</span> de{' '}
              <span className="font-semibold text-slate-800 dark:text-slate-200">{pagination.total}</span> medicamentos
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                icon={ChevronLeft}
              >
                Anterior
              </Button>
              <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-slate-200/60 dark:bg-slate-800">
                Página {pagination.page} de {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                Siguiente
                <ChevronRight className="w-3.5 h-3.5 ml-1 inline" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Modal 1: Quick View Medication Details */}
      <Modal
        isOpen={!!selectedMed}
        onClose={() => setSelectedMed(null)}
        title="Detalles del Medicamento"
        footer={
          <Button variant="secondary" onClick={() => setSelectedMed(null)}>
            Cerrar
          </Button>
        }
      >
        {selectedMed && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Código de Referencia</span>
                <p className="font-mono text-lg font-bold text-brand-600 dark:text-brand-400">{selectedMed.codigo}</p>
              </div>
              <div>{renderStatusBadge(selectedMed)}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Pill className="w-3.5 h-3.5" />
                  <span>Descripción</span>
                </div>
                <p className="text-sm font-semibold">{selectedMed.descripcion}</p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Categoría</span>
                </div>
                <p className="text-sm font-semibold">{selectedMed.categoria || 'Sin Categoría'}</p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Número de Lote</span>
                </div>
                <p className="text-sm font-mono font-semibold">{selectedMed.lote}</p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Fecha de Vencimiento</span>
                </div>
                <p className="text-sm font-semibold">{selectedMed.vencimiento}</p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Cantidad Disponible</span>
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{selectedMed.cantidad} unidades</p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Precio Unitario</span>
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">Q {selectedMed.precio ? selectedMed.precio.toFixed(2) : '0.00'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal 2: Confirm Delete Medication */}
      <Modal
        isOpen={!!deleteMed}
        onClose={() => setDeleteMed(null)}
        title="Confirmar Eliminación"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteMed(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              icon={Trash2}
              isLoading={isDeleting}
              onClick={handleDeleteConfirm}
            >
              Sí, Eliminar Registro
            </Button>
          </>
        }
      >
        {deleteMed && (
          <div className="flex items-start gap-4">
            <div className="p-3 bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400 rounded-xl shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                ¿Está seguro de que desea eliminar el medicamento{' '}
                <strong className="text-rose-600 dark:text-rose-400">{deleteMed.descripcion}</strong> (Código:{' '}
                <span className="font-mono">{deleteMed.codigo}</span>)?
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Esta acción no se puede deshacer y borrará permanentemente el historial de este lote del inventario.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MedicamentosListPage;
