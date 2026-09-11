import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Pill, Lock, User, Key, ShieldCheck, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export const LoginPage = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'El nombre de usuario es obligatorio.';
    if (!password) newErrors.password = 'La contraseña es obligatoria.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      await login(username, password);
      toast.success('¡Sesión iniciada correctamente! Bienvenido.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Error de autenticación. Verifique las credenciales.');
      setErrors({ form: err.message || 'Credenciales no válidas.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = (user, pass) => {
    setUsername(user);
    setPassword(pass);
    setErrors({});
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950 text-slate-100 relative overflow-hidden">
      {/* Background glowing ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md glass-card p-8 rounded-3xl border border-slate-800/80 shadow-2xl relative z-10 backdrop-blur-xl animate-fade-in">
        {/* Header Icon */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-teal-400 flex items-center justify-center text-white shadow-glow mb-4">
            <Pill className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">FarmaInventario</h2>
          <p className="text-xs text-slate-400 mt-1">Sistema de Gestión e Inventario de Medicamentos</p>
        </div>

        {/* Global Error Alert */}
        {errors.form && (
          <div className="mb-6 p-3.5 bg-rose-950/60 border border-rose-800/80 rounded-xl text-rose-300 text-xs flex items-center gap-2 animate-fade-in">
            <Lock className="w-4 h-4 shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Usuario"
            placeholder="Ingrese su nombre de usuario"
            icon={User}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={errors.username}
            autoFocus
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            icon={Key}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={isSubmitting}
            icon={ArrowRight}
          >
            Iniciar Sesión
          </Button>
        </form>

        {/* Demo Quick Fill Credentials */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-3">
            Credenciales de Demostración Rápida
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemoCredentials('admin', 'admin123')}
              className="p-2.5 text-left rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-xs transition-colors group"
            >
              <div className="flex items-center gap-1.5 font-semibold text-brand-400 group-hover:text-brand-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">admin / admin123</p>
            </button>

            <button
              type="button"
              onClick={() => fillDemoCredentials('farmaceutico', 'farmacia2026')}
              className="p-2.5 text-left rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-xs transition-colors group"
            >
              <div className="flex items-center gap-1.5 font-semibold text-teal-400 group-hover:text-teal-300">
                <User className="w-3.5 h-3.5" />
                <span>Farmacéutico</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">farmaceutico / farmacia2026</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
