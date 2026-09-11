import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { authApi } from '../api/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import {
  User,
  Camera,
  Moon,
  Sun,
  Server,
  Key,
  RefreshCw,
  Mail,
  Briefcase,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';

const PRESET_AVATARS = [
  { label: 'Médico Masculino 1', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80' },
  { label: 'Farmacéutica 1', url: 'https://images.unsplash.com/photo-1594824813566-78853d470eb0?w=150&auto=format&fit=crop&q=80' },
  { label: 'Doctora Senior', url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80' },
  { label: 'Especialista', url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80' }
];

export const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const toast = useToast();

  const [apiStatus, setApiStatus] = useState('checking');
  const [apiDetails, setApiDetails] = useState(null);

  // Avatar Modal State
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarInput, setAvatarInput] = useState(user?.avatar || '');
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

  const checkApiHealth = async () => {
    setApiStatus('checking');
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      if (res.ok) {
        setApiStatus('online');
        setApiDetails(data);
      } else {
        setApiStatus('offline');
      }
    } catch {
      setApiStatus('offline');
    }
  };

  useEffect(() => {
    checkApiHealth();
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    toast.info(`Tema actualizado a modo ${newTheme === 'dark' ? 'Oscuro' : 'Claro'}`);
  };

  const handleOpenAvatarModal = () => {
    setAvatarInput(user?.avatar || '');
    setIsAvatarModalOpen(true);
  };

  const handleSaveAvatar = async (e) => {
    e.preventDefault();
    if (!avatarInput.trim()) {
      toast.warning('Por favor ingrese una URL válida o seleccione una foto de perfil.');
      return;
    }

    setIsUpdatingAvatar(true);
    try {
      const response = await authApi.updateAvatar(avatarInput.trim());
      updateUser(response.data);
      toast.success('¡Foto de perfil actualizada correctamente!');
      setIsAvatarModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Error al actualizar la foto de perfil.');
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Configuración y Perfil</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Gestione su foto de perfil, preferencias del sistema y verifique la conexión con el servidor
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <Card className="md:col-span-1 flex flex-col items-center text-center p-6 relative">
          <div className="relative group mb-4">
            <div className="w-24 h-24 rounded-3xl bg-brand-100 dark:bg-brand-950 border-2 border-brand-500 flex items-center justify-center text-brand-600 dark:text-brand-300 font-bold overflow-hidden shadow-glow">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10" />
              )}
            </div>

            {/* Change Avatar Overlay Button */}
            <button
              onClick={handleOpenAvatarModal}
              title="Cambiar Foto de Perfil"
              className="absolute inset-0 bg-slate-900/60 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200"
            >
              <Camera className="w-6 h-6" />
            </button>

            <button
              onClick={handleOpenAvatarModal}
              title="Cambiar Foto de Perfil"
              className="absolute -bottom-1 -right-1 p-2 bg-brand-500 text-white rounded-full shadow-md hover:bg-brand-600 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{user?.name}</h3>
          <Badge variant="info" className="mt-1">{user?.role}</Badge>

          <Button
            variant="outline"
            size="sm"
            className="w-full mt-4"
            icon={Camera}
            onClick={handleOpenAvatarModal}
          >
            Cambiar Foto de Perfil
          </Button>

          <div className="w-full text-left space-y-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Usuario: <strong>{user?.username}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{user?.email || 'admin@farmacia.com'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
              <span>ID: <code className="font-mono">{user?.id}</code></span>
            </div>
          </div>
        </Card>

        {/* System & Theme Preferences */}
        <div className="md:col-span-2 space-y-6">
          {/* Appearance & Dark Mode Management */}
          <Card title="Preferencias de Apariencia" subtitle="Personalice el modo de visualización de la interfaz">
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Seleccione el tema visual de la aplicación. Su preferencia se guardará automáticamente en <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">localStorage</code>.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleThemeChange('light')}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    theme === 'light'
                      ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Sun className="w-6 h-6 text-amber-500" />
                  <span className="text-xs">Modo Claro</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleThemeChange('dark')}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    theme === 'dark'
                      ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Moon className="w-6 h-6 text-brand-400" />
                  <span className="text-xs">Modo Oscuro</span>
                </button>
              </div>
            </div>
          </Card>

          {/* Backend Diagnostics & Session Status */}
          <Card
            title="Diagnóstico de la Conexión API REST"
            subtitle="Estado de comunicación en tiempo real con el servidor backend Express"
            action={
              <Button variant="ghost" size="sm" icon={RefreshCw} onClick={checkApiHealth}>
                Probar
              </Button>
            }
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <Server className="w-5 h-5 text-brand-500" />
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Servidor Node.js / Express</p>
                    <p className="text-[11px] text-slate-400">Endpoint: http://localhost:5050/api</p>
                  </div>
                </div>
                {apiStatus === 'online' ? (
                  <Badge variant="success">En Línea</Badge>
                ) : apiStatus === 'checking' ? (
                  <Badge variant="warning">Verificando...</Badge>
                ) : (
                  <Badge variant="danger">Desconectado</Badge>
                )}
              </div>

              {apiDetails && (
                <div className="p-3 bg-slate-100/60 dark:bg-slate-900/40 rounded-xl text-[11px] font-mono text-slate-600 dark:text-slate-400 space-y-1">
                  <p>Sistema: {apiDetails.system}</p>
                  <p>Marca de Tiempo: {apiDetails.timestamp}</p>
                </div>
              )}

              <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Autenticación JWT</p>
                    <p className="text-[11px] text-slate-400">Token almacenado en localStorage</p>
                  </div>
                </div>
                <Badge variant="success">Activo (24h)</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal: Change Profile Photo / Avatar */}
      <Modal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        title="Cambiar Foto de Perfil del Usuario"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsAvatarModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              isLoading={isUpdatingAvatar}
              onClick={handleSaveAvatar}
              icon={CheckCircle2}
            >
              Guardar Foto
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveAvatar} className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Seleccionar Avatar Predefinido
            </p>
            <div className="grid grid-cols-4 gap-3">
              {PRESET_AVATARS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatarInput(preset.url)}
                  className={`p-1.5 rounded-2xl border flex flex-col items-center transition-all ${
                    avatarInput === preset.url
                      ? 'border-brand-500 ring-2 ring-brand-500/20 bg-brand-50 dark:bg-brand-950/40'
                      : 'border-slate-200 dark:border-slate-800 hover:border-brand-300'
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-14 h-14 rounded-xl object-cover" />
                  <span className="text-[10px] text-slate-600 dark:text-slate-300 font-medium mt-1 truncate w-full text-center">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex items-center my-2">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[11px] text-slate-400 font-bold uppercase">o pegar enlace personalizado</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          <Input
            label="URL de Imagen Personalizada"
            placeholder="https://ejemplo.com/mi-foto.jpg"
            icon={ImageIcon}
            value={avatarInput}
            onChange={(e) => setAvatarInput(e.target.value)}
            helperText="Pegue una URL válida de una imagen JPG o PNG"
          />

          {/* Live Preview */}
          {avatarInput && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <img src={avatarInput} alt="Vista previa" className="w-12 h-12 rounded-xl object-cover border border-slate-300 dark:border-slate-700" />
              <div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Vista Previa de la Foto</p>
                <p className="text-[10px] text-slate-400 truncate max-w-xs">{avatarInput}</p>
              </div>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};

export default SettingsPage;
