import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { medicamentosApi } from '../api/api';
import { useToast } from '../context/ToastContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { LoadingSpinner, ErrorAlert } from '../components/common/States';
import {
  Pill,
  Tag,
  Calendar,
  Layers,
  DollarSign,
  Save,
  ArrowLeft,
  CheckCircle2,
  FileText
} from 'lucide-react';

export const MedicamentoFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    codigo: '',
    descripcion: '',
    cantidad: '',
    lote: '',
    vencimiento: '',
    categoria: '',
    precio: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEditMode);
  const [fetchError, setFetchError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  // Load existing medication data if editing
  useEffect(() => {
    if (!isEditMode) return;

    const fetchDetail = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const response = await medicamentosApi.getById(id);
        const data = response.data;
        setFormData({
          codigo: data.codigo || '',
          descripcion: data.descripcion || '',
          cantidad: data.cantidad !== undefined ? String(data.cantidad) : '',
          lote: data.lote || '',
          vencimiento: data.vencimiento || '',
          categoria: data.categoria || '',
          precio: data.precio !== undefined ? String(data.precio) : ''
        });
      } catch (err) {
        setFetchError(err.message || 'Error al obtener los datos del medicamento');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, isEditMode]);

  // Form Field Validation Logic
  const validateForm = () => {
    const newErrors = {};

    // 1. Required Codigo
    if (!formData.codigo.trim()) {
      newErrors.codigo = 'El código del medicamento es requerido.';
    } else if (formData.codigo.trim().length < 3) {
      newErrors.codigo = 'El código debe tener al menos 3 caracteres.';
    }

    // 2. Required Descripcion
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción o nombre comercial es obligatoria.';
    }

    // 3. Cantidad Validation (No negative numbers)
    if (formData.cantidad === '' || isNaN(Number(formData.cantidad))) {
      newErrors.cantidad = 'Ingrese un número válido para la cantidad.';
    } else if (Number(formData.cantidad) < 0) {
      newErrors.cantidad = 'La cantidad no puede ser negativa (debe ser ≥ 0).';
    } else if (!Number.isInteger(Number(formData.cantidad))) {
      newErrors.cantidad = 'La cantidad debe ser un número entero.';
    }

    // 4. Required Lote
    if (!formData.lote.trim()) {
      newErrors.lote = 'El número de lote es obligatorio.';
    }

    // 5. Logical Expiry Date Validation
    if (!formData.vencimiento) {
      newErrors.vencimiento = 'La fecha de vencimiento es obligatoria.';
    } else {
      const dateVal = new Date(formData.vencimiento);
      if (isNaN(dateVal.getTime())) {
        newErrors.vencimiento = 'La fecha ingresada no es válida.';
      }
    }

    // 6. Optional Price Validation
    if (formData.precio !== '' && (isNaN(Number(formData.precio)) || Number(formData.precio) < 0)) {
      newErrors.precio = 'El precio no puede ser un valor negativo.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.warning('Por favor corrija los errores resaltados en el formulario.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        cantidad: parseInt(formData.cantidad, 10),
        precio: formData.precio ? parseFloat(formData.precio) : 0
      };

      if (isEditMode) {
        await medicamentosApi.update(id, payload);
        toast.success(`Medicamento "${formData.descripcion}" actualizado exitosamente.`);
      } else {
        await medicamentosApi.create(payload);
        toast.success(`Nuevo medicamento "${formData.descripcion}" creado con éxito.`);
      }

      navigate('/medicamentos');
    } catch (err) {
      if (err.data && err.data.errors) {
        setErrors(err.data.errors);
      } else {
        toast.error(err.message || 'Error al guardar el medicamento en el backend.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Cargando información del medicamento..." size="lg" />;
  }

  if (fetchError) {
    return (
      <ErrorAlert
        title="Error al cargar registro"
        message={fetchError}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/medicamentos">
            <Button variant="ghost" size="sm" icon={ArrowLeft}>
              Volver
            </Button>
          </Link>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {isEditMode ? 'Modificar Medicamento' : 'Registrar Nuevo Medicamento'}
            </h2>
            <p className="text-xs text-slate-400">
              {isEditMode ? `Actualizando referencia: ${formData.codigo}` : 'Complete la información requerida del lote'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Card */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Codigo */}
            <Input
              label="Código del Medicamento (Número) *"
              type="text"
              placeholder="Ej: 931, 7, 10534"
              icon={Pill}
              value={formData.codigo}
              onChange={(e) => handleChange('codigo', e.target.value)}
              error={errors.codigo}
              helperText="Código numérico correlativo del producto (ej: 931)"
              autoFocus={!isEditMode}
            />

            {/* Lote */}
            <Input
              label="Número de Lote *"
              placeholder="Ej: LT-2026-081"
              icon={Tag}
              value={formData.lote}
              onChange={(e) => handleChange('lote', e.target.value)}
              error={errors.lote}
              helperText="Código de fabricación del lote"
            />

            {/* Descripcion */}
            <div className="sm:col-span-2">
              <Input
                label="Descripción / Nombre Comercial *"
                placeholder="Ej: Paracetamol (acetaminofén) Tableta 500 mg"
                icon={FileText}
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                error={errors.descripcion}
              />
            </div>

            {/* Cantidad */}
            <Input
              label="Cantidad en Stock *"
              type="number"
              min="0"
              placeholder="Ej: 150"
              icon={Layers}
              value={formData.cantidad}
              onChange={(e) => handleChange('cantidad', e.target.value)}
              error={errors.cantidad}
              helperText="No se permiten valores negativos"
            />

            {/* Vencimiento */}
            <Input
              label="Fecha de Vencimiento *"
              type="date"
              icon={Calendar}
              value={formData.vencimiento}
              onChange={(e) => handleChange('vencimiento', e.target.value)}
              error={errors.vencimiento}
            />

            {/* Categoria */}
            <Input
              label="Categoría Farmacéutica"
              placeholder="Ej: Analgésico / Antibiótico"
              icon={Tag}
              value={formData.categoria}
              onChange={(e) => handleChange('categoria', e.target.value)}
              error={errors.categoria}
            />

            {/* Precio en Quetzales */}
            <Input
              label="Precio Unitario (Q Quetzales)"
              type="number"
              step="0.01"
              min="0"
              placeholder="Ej: 12.50"
              icon={DollarSign}
              value={formData.precio}
              onChange={(e) => handleChange('precio', e.target.value)}
              error={errors.precio}
              helperText="Precio en Quetzales (Q)"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <Link to="/medicamentos">
              <Button variant="ghost">Cancelar</Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={Save}
              isLoading={isSubmitting}
            >
              {isEditMode ? 'Guardar Cambios' : 'Registrar Medicamento'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default MedicamentoFormPage;
