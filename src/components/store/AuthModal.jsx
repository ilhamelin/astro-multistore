import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Mail, Lock, User, ShieldAlert, KeyRound, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function AuthModal() {
  const { currentTheme, isAuthOpen, setIsAuthOpen, login, register } = useStore();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // 'customer' | 'admin'
  const [adminCode, setAdminCode] = useState('');
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthOpen) return null;

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole('customer');
    setAdminCode('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleClose = () => {
    resetForm();
    setIsAuthOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (tab === 'login') {
      const res = await login(email, password);
      if (res.success) {
        setSuccessMsg('¡Sesión iniciada con éxito!');
        setTimeout(() => {
          handleClose();
        }, 1000);
      } else {
        setErrorMsg(res.error);
      }
    } else {
      // If registering as admin, validate the simple access code
      if (role === 'admin' && adminCode !== 'admin123') {
        setErrorMsg('Código de autorización inválido para el rol de administrador (Tip: usa "admin123").');
        return;
      }

      const res = await register(name, email, password, role);
      if (res.success) {
        setSuccessMsg('¡Cuenta registrada e inicio de sesión completado!');
        setTimeout(() => {
          handleClose();
        }, 1200);
      } else {
        setErrorMsg(res.error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />

      <div className={`relative w-full max-w-md overflow-hidden border shadow-2xl transition-all duration-300 rounded-2xl ${currentTheme.colors.cardBg}`}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-500/15 transition-colors cursor-pointer text-inherit z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Auth Tabs */}
        <div className="flex border-b border-slate-500/10">
          <button
            onClick={() => { setTab('login'); setErrorMsg(''); }}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              tab === 'login' 
                ? 'border-b-2 border-cyan-500 text-cyan-400 bg-slate-500/5' 
                : 'opacity-60 hover:opacity-100 hover:bg-slate-500/5'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => { setTab('register'); setErrorMsg(''); }}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              tab === 'register' 
                ? 'border-b-2 border-cyan-500 text-cyan-400 bg-slate-500/5' 
                : 'opacity-60 hover:opacity-100 hover:bg-slate-500/5'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          
          {/* Title */}
          <div className="text-center mb-2">
            <h3 className={`text-lg font-bold uppercase tracking-wide ${currentTheme.fontHeading}`}>
              {tab === 'login' ? 'Bienvenido de Nuevo' : 'Crea tu Cuenta'}
            </h3>
            <p className="text-[11px] opacity-60 mt-0.5">
              {tab === 'login' 
                ? 'Ingresa tus credenciales para acceder a tu cuenta.' 
                : 'Regístrate para comprar y guardar tus pedidos.'}
            </p>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-950/20 text-red-400 text-xs flex items-start gap-2.5">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-red-500 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-950/20 text-emerald-400 text-xs flex items-start gap-2.5">
              <CheckCircle className="h-4.5 w-4.5 shrink-0 text-emerald-500 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form Inputs */}
          {tab === 'register' && (
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Nombre Completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-50">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, ''))}
                  className={`w-full pl-9 pr-4 py-2 border rounded-lg text-sm outline-none transition-all ${currentTheme.colors.input}`}
                  placeholder="Ej. Juan Pérez"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Correo Electrónico</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-50">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 border rounded-lg text-sm outline-none transition-all ${currentTheme.colors.input}`}
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-50">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-9 pr-10 py-2 border rounded-lg text-sm outline-none transition-all ${currentTheme.colors.input}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Role selector for registration */}
          {tab === 'register' && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Rol de Usuario</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition-all ${currentTheme.colors.input}`}
                >
                  <option value="customer">Cliente (Comprador)</option>
                  <option value="admin">Administrador / Trabajador</option>
                </select>
              </div>

              {role === 'admin' && (
                <div className="flex flex-col gap-1 p-3.5 border border-amber-800/20 bg-amber-950/10 rounded-xl">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Código de Autorización</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-50 text-amber-500">
                      <KeyRound className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required={role === 'admin'}
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      className={`w-full pl-9 pr-4 py-2 border rounded-lg text-sm outline-none transition-all bg-stone-900 border-amber-800/40 text-amber-200 focus:border-amber-500`}
                      placeholder="Usa 'admin123' para validar"
                    />
                  </div>
                  <span className="text-[9px] opacity-55 text-amber-300 mt-1">Requiere código de verificación para otorgar accesos de administrador.</span>
                </div>
              )}
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full mt-2 py-3 px-6 font-bold uppercase tracking-wider text-xs transition-all cursor-pointer ${currentTheme.colors.button}`}
          >
            {tab === 'login' ? 'Acceder' : 'Registrarse'}
          </button>

          {/* Cheat Sheet helper block for easy testing */}
          {tab === 'login' && (
            <div className="mt-4 p-4 border border-slate-500/10 bg-slate-500/5 rounded-xl flex flex-col gap-2">
              <span className="text-[9px] font-bold uppercase tracking-wider opacity-40">Cuentas de Prueba:</span>
              <div className="flex justify-between items-center text-[10px] opacity-75">
                <span><strong>Admin:</strong> admin@tienda.com</span>
                <span className="font-mono bg-slate-950/40 px-1 py-0.5 rounded select-all">admin123</span>
              </div>
              <div className="flex justify-between items-center text-[10px] opacity-75">
                <span><strong>Cliente:</strong> cliente@tienda.com</span>
                <span className="font-mono bg-slate-950/40 px-1 py-0.5 rounded select-all">cliente123</span>
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
