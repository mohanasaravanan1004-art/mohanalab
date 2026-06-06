/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  ShieldCheck, 
  LogOut, 
  Trophy, 
  Coins, 
  Flame,
  Calendar,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { UserProfile } from '../types';

interface AuthViewProps {
  user: UserProfile | null;
  onLogin: (email: string, name: string, role: 'student' | 'admin') => void;
  onLogout: () => void;
  onUpdateProfile: (name: string, avatarSeed: string) => void;
  triggerToastNotification: (msg: string) => void;
}

export default function AuthView({ 
  user, 
  onLogin, 
  onLogout, 
  onUpdateProfile, 
  triggerToastNotification 
}: AuthViewProps) {
  
  // Tabs: 'login' | 'register' | 'forgot'
  const [authTab, setAuthTab] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Registration and sign-in states
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [rollNoInput, setRollNoInput] = useState('VTX-2026-9481');
  const [roleSelect, setRoleSelect] = useState<'student' | 'admin'>('student');
  const [showPassword, setShowPassword] = useState(false);

  // Edit profile states
  const [editName, setEditName] = useState(user?.name || '');
  const [avatarSeed, setAvatarSeed] = useState(user?.avatarSeed || 'alex');

  const handleSubmitAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authTab === 'login') {
      if (!emailInput || !passwordInput) {
        triggerToastNotification("Please fill in email and password credentials!");
        return;
      }
      
      // Auto assign a default student name unless they put something specific OR if admin is detected
      let resolvedName = "Student Proposer";
      let resolvedRole: 'student' | 'admin' = 'student';
      
      if (emailInput.toLowerCase().includes("admin")) {
        resolvedName = "Professor Charles (Admin)";
        resolvedRole = "admin";
      } else if (emailInput.toLowerCase().includes("student")) {
        resolvedName = "Alex Mercer";
        resolvedRole = "student";
      } else {
        // Fallback or generic name extracted from email username
        const parts = emailInput.split('@')[0];
        resolvedName = parts.charAt(0).toUpperCase() + parts.slice(1);
      }

      onLogin(emailInput, resolvedName, resolvedRole);
      triggerToastNotification(`Authorized successfully! Welcomed, ${resolvedName}.`);
    } 
    else if (authTab === 'register') {
      if (!nameInput || !emailInput || !passwordInput) {
        triggerToastNotification("Please complete all registration variables.");
        return;
      }
      onLogin(emailInput, nameInput, roleSelect);
      triggerToastNotification(`Registration Completed! Welcome to Vertex Compiler.`);
    } 
    else if (authTab === 'forgot') {
      if (!emailInput) {
        triggerToastNotification("Please enter your registered institutional email.");
        return;
      }
      triggerToastNotification(`A secure credentials reset link has been dispatched to: ${emailInput}`);
      setAuthTab('login');
    }
  };

  const handleUpdateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      triggerToastNotification("Profile username cannot be empty.");
      return;
    }
    onUpdateProfile(editName, avatarSeed);
    triggerToastNotification("Profile customized successfully!");
  };

  // Helper avatar randomizer Seeds
  const avatarPresets = ['alex', 'charlie', 'jaden', 'sarah', 'prof', 'morgan'];

  // View 1: If Authenticated, show Profile Workspace Settings
  if (user) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 text-left" id="profile_authorized_view">
        
        {/* Banner with avatar detail */}
        <div className="bg-[#08051e] border border-indigo-950 p-6 rounded-3xl flex flex-col sm:flex-row items-center gap-6 relative">
          <div className="absolute top-0 right-0 w-64 h-full bg-[radial-gradient(circle_at_100%_0%,rgba(124,58,237,0.1),rgba(0,0,0,0))] pointer-events-none" />
          
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold border border-purple-500/30 shrink-0 uppercase select-none shadow-lg shadow-purple-500/10">
            {editName.substring(0, 2) || user.name.substring(0,2)}
          </div>

          <div className="space-y-1.5 flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="text-xl font-display font-extrabold text-white">{user.name}</h3>
              <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                user.role === 'admin' ? 'bg-red-950/80 text-red-400 border border-red-500/20' : 'bg-purple-950/80 text-purple-400 border border-purple-500/20'
              }`}>
                {user.role} role
              </span>
            </div>

            <p className="text-xs text-gray-400 font-mono flex items-center justify-center sm:justify-start gap-1">
              <Mail className="w-3.5 h-3.5 text-zinc-500" />
              <span>{user.email}</span>
            </p>

            <div className="text-[10px] text-slate-500 font-mono mt-1">
              <span>Student ID Tag: <strong className="text-slate-300">{user.rollNo || "N/A"}</strong></span>
              <span className="mx-2">•</span>
              <span>Enrolled Account: <strong className="text-slate-300">{user.enrolledDate}</strong></span>
            </div>
          </div>

          <button
            onClick={() => {
              onLogout();
              triggerToastNotification("De-authorized successfully.");
            }}
            className="px-4 py-2.5 bg-red-950/40 text-red-200 border border-red-900/30 hover:bg-red-900 hover:text-white rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>SIGN OUT</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Column 4: XP coins and completed tasks summary gauges */}
          <div className="md:col-span-4 bg-[#08051e] border border-indigo-950/80 rounded-3xl p-5 space-y-5">
            <h4 className="text-xs font-mono tracking-wider font-bold text-slate-400 uppercase">ACADEMIC SCORECARD</h4>
            
            <div className="space-y-4">
              <div className="bg-[#050315] p-3 rounded-2xl border border-indigo-950/60 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 bg-purple-950/80 rounded-lg flex items-center justify-center text-purple-400 border border-purple-500/20">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-sans text-gray-300">Challenges Solved</span>
                </div>
                <span className="text-sm font-bold text-white font-mono">{user.completedChallenges}</span>
              </div>

              <div className="bg-[#050315] p-3 rounded-2xl border border-indigo-950/60 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 bg-yellow-950/80 rounded-lg flex items-center justify-center text-yellow-400 border border-yellow-500/20">
                    <Coins className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-sans text-gray-300">Accumulated XP</span>
                </div>
                <span className="text-sm font-bold text-yellow-400 font-mono">{user.xpCoins} pts</span>
              </div>

              <div className="bg-[#050315] p-3 rounded-2xl border border-indigo-950/60 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 bg-emerald-950/80 rounded-lg flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                    <Flame className="w-4 h-4 animate-pulse" />
                  </div>
                  <span className="text-xs font-sans text-gray-300">Active Grade Rank</span>
                </div>
                <span className="text-xs font-extrabold text-[#00df9a] bg-emerald-950/60 border border-emerald-400/20 px-2 py-0.5 rounded font-mono">GPA: {user.grade}</span>
              </div>
            </div>

            <div className="bg-[#050315] border border-indigo-950/40 p-4 rounded-2xl text-[10.5px] text-gray-500 leading-relaxed font-sans text-left">
              <span className="text-purple-400 font-bold block mb-1">💡 COBALT VERIFICATION:</span>
              Your compiler usage history is synchronized over secure sandboxed sessions. Complete challenges in the Academic tab to gain more currency values.
            </div>

          </div>

          {/* Column 8: Customize Profile Details form */}
          <form 
            onSubmit={handleUpdateProfileSubmit}
            className="md:col-span-8 bg-[#08051e] border border-indigo-950/80 rounded-3xl p-6 space-y-6"
          >
            <h4 className="text-xs font-mono tracking-wider font-bold text-slate-400 uppercase border-b border-indigo-950/40 pb-3">
              CUSTOMIZE INFORMATION VARIABLES
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold">NickName / User Tag</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-zinc-600"><User className="w-4 h-4" /></span>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-[#040212] border border-indigo-950 focus:border-[#7c3aed] text-white rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none placeholder-zinc-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Email (Non-Editable)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-zinc-600"><Mail className="w-4 h-4" /></span>
                  <input
                    type="text"
                    value={user.email}
                    disabled
                    className="w-full bg-[#040212]/30 border border-indigo-950/50 text-zinc-600 rounded-xl pl-9 pr-4 py-2 text-xs cursor-not-allowed font-mono outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Avatar presets selector bar */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold block">Preset System Avatars</label>
              <div className="flex flex-wrap gap-2.5">
                {avatarPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAvatarSeed(preset)}
                    className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono transition-all uppercase font-bold ${
                      avatarSeed === preset
                        ? 'bg-purple-950/60 text-purple-200 border-purple-500/40'
                        : 'bg-transparent text-gray-500 border-indigo-950 hover:text-white'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-indigo-950/30">
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold font-mono tracking-wide shadow-md hover:shadow-purple-500/10 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>SAVE CHANGES</span>
              </button>
            </div>

          </form>

        </div>

      </div>
    );
  }

  // View 2: Not Authenticated, show Login / Register form controls
  return (
    <div className="max-w-md mx-auto text-left py-4" id="authorization_forms_area">
      
      {/* Visual top logo header */}
      <div className="text-center space-y-2 mb-6">
        <h3 className="text-2xl font-display font-extrabold text-white">Vertex Authentication</h3>
        <p className="text-xs text-gray-400">
          Access your interactive multi-language student sandbox registry.
        </p>
      </div>

      <div className="bg-[#08051e] border border-indigo-950/80 rounded-3xl p-6.5 space-y-6 relative shadow-2xl">
        
        {/* Tab switch buttons */}
        <div className="flex bg-[#050315] p-1 rounded-xl border border-indigo-950/65">
          <button
            onClick={() => { setAuthTab('login'); setEmailInput(''); setPasswordInput(''); }}
            className={`flex-1 text-[11px] font-mono py-2 rounded-lg font-bold transition-all text-center cursor-pointer ${
              authTab === 'login' ? 'bg-[#0f0b2f] border border-indigo-900/40 text-purple-200 shadow' : 'text-gray-500 hover:text-gray-200'
            }`}
          >
            STUDENT LOGIN
          </button>
          <button
            onClick={() => { setAuthTab('register'); setEmailInput(''); setPasswordInput(''); }}
            className={`flex-1 text-[11px] font-mono py-2 rounded-lg font-bold transition-all text-center cursor-pointer ${
              authTab === 'register' ? 'bg-[#0f0b2f] border border-indigo-900/40 text-purple-200 shadow' : 'text-gray-500 hover:text-gray-200'
            }`}
          >
            REGISTRATION
          </button>
        </div>

        {/* Informative alert box for student logins */}
        {authTab === 'login' && (
          <div className="bg-purple-950/20 border border-purple-500/15 p-2 rounded-xl text-[9.5px] text-purple-300 leading-normal flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-purple-400 mt-0.5" />
            <p>
              <strong>Developer Demo Keys:</strong> Use institutional emails <code className="bg-[#040212] tracking-wide px-1 rounded font-bold text-white">student@vertex.edu</code> for simulated Student Dashboard, or <code className="bg-[#040212] tracking-wide px-1 rounded font-bold text-white">admin@vertex.edu</code> for the full Admin Panel. Use any password.
            </p>
          </div>
        )}

        {/* Dynamic form inputs */}
        <form onSubmit={handleSubmitAuth} className="space-y-4">
          
          {authTab === 'register' && (
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold">student name</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-zinc-500"><User className="w-4 h-4" /></span>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="w-full bg-[#040212] border border-indigo-950 focus:border-[#7c3aed] text-white rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none placeholder-zinc-600 transition-colors"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5 text-left">
            <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold">institutional email</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-zinc-500"><Mail className="w-4 h-4" /></span>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="student@vertex.edu"
                className="w-full bg-[#040212] border border-indigo-950 focus:border-[#7c3aed] text-white rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none placeholder-zinc-600 transition-colors"
              />
            </div>
          </div>

          {authTab !== 'forgot' && (
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold">security password</label>
                {authTab === 'login' && (
                  <button
                    type="button"
                    onClick={() => setAuthTab('forgot')}
                    className="text-[9.5px] font-mono text-purple-400 hover:text-white"
                  >
                    Forgot Credentials?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-zinc-500"><Lock className="w-4 h-4" /></span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#040212] border border-indigo-950 focus:border-[#7c3aed] text-white rounded-xl pl-9 pr-10 py-2.5 text-xs focus:outline-none placeholder-zinc-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-zinc-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {authTab === 'register' && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold">matric status</label>
                <select
                  value={roleSelect}
                  onChange={(e) => setRoleSelect(e.target.value as 'student' | 'admin')}
                  className="w-full bg-[#040212] border border-indigo-950 focus:border-[#7c3aed] text-gray-300 rounded-xl px-3 py-2.5 text-xs outline-none cursor-pointer"
                >
                  <option value="student">Student</option>
                  <option value="admin">Instructor / Admin</option>
                </select>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold">assigned register ID</label>
                <input
                  type="text"
                  required
                  value={rollNoInput}
                  onChange={(e) => setRollNoInput(e.target.value)}
                  className="w-full bg-[#040212] border border-indigo-950 focus:border-[#7c3aed] text-white rounded-xl px-3 py-2.5 text-xs placeholder-zinc-600 outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3 rounded-xl text-xs font-bold font-mono tracking-wider shadow-lg hover:shadow-purple-500/10 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
          >
            <span>
              {authTab === 'login' ? 'AUTHORIZE STUDENT SESSION' : authTab === 'register' ? 'COMPLETE MATRICULATION REGISTRY' : 'DISPATCH PASSWORD LINK'}
            </span>
          </button>

        </form>

        {authTab === 'forgot' && (
          <button
            onClick={() => setAuthTab('login')}
            className="text-[10px] font-mono text-center block w-full text-zinc-500 hover:text-white"
          >
            &larr; Return to Sign In Screen
          </button>
        )}

      </div>
    </div>
  );
}
