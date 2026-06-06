/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Terminal, 
  Code2, 
  Sparkles, 
  Settings, 
  BookMarked, 
  Menu, 
  X, 
  Play, 
  LayoutDashboard, 
  User, 
  ShieldAlert,
  Home
} from 'lucide-react';
import { PageId, UserProfile } from '../types';

interface NavbarProps {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  onRunCompile: () => void;
  user: UserProfile | null;
}

export default function Navbar({ 
  activePage, 
  setActivePage, 
  onRunCompile, 
  user 
}: NavbarProps) {
  
  const [isOpen, setIsOpen] = useState(false);

  // Dynamic Navigation array build depending on User Auth context
  const getNavigationItems = () => {
    const items: { id: PageId; label: string; icon: React.ReactNode }[] = [];

    // Fallback/Guest navigation
    if (!user) {
      items.push(
        { id: 'landing', label: 'Home Gateway', icon: <Home className="w-4 h-4" /> },
        { id: 'workspace', label: 'Free IDE Playground', icon: <Code2 className="w-4 h-4" /> },
        { id: 'auth', label: 'Student Portal Sign In', icon: <User className="w-4 h-4" /> }
      );
      return items;
    }

    // Authenticated Student navigation
    items.push(
      { id: 'dashboard', label: 'Home Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { id: 'workspace', label: 'Code Compiler Studio', icon: <Code2 className="w-4 h-4" /> },
      { id: 'blueprints', label: 'Classroom Assignments', icon: <BookMarked className="w-4 h-4" /> }
    );

    // If teacher/administrator
    if (user.role === 'admin') {
      items.push({ id: 'admin', label: 'Faculty Control', icon: <ShieldAlert className="w-4 h-4 text-red-400" /> });
    }

    items.push(
      { id: 'ai-copilot', label: 'Gemini Copilot', icon: <Sparkles className="w-4 h-4 text-purple-400" /> },
      { id: 'settings', label: 'System Prefs', icon: <Settings className="w-4 h-4" /> },
      { id: 'auth', label: 'Profile Account', icon: <User className="w-4 h-4 text-indigo-400" /> }
    );

    return items;
  };

  const navItems = getNavigationItems();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#07051a]/90 border-b border-indigo-950/80 px-4 py-3 md:px-8 backdrop-blur-xl" id="compiler_nav_element">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo Section */}
        <div 
          onClick={() => setActivePage(user ? 'dashboard' : 'landing')} 
          className="flex items-center space-x-3 cursor-pointer group"
          id="nav_brand_mark"
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center border border-purple-500/20 shadow-lg shadow-purple-500/10 transition-transform group-hover:scale-105">
            <Terminal className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div className="text-left font-semibold">
            <span className="text-md font-bold tracking-tight text-white font-sans">
              Vertex<span className="bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent"> Compiler</span>
            </span>
            <div className="flex items-center space-x-1.5 text-[8px] font-mono tracking-widest text-[#a855f7]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>SECURE MULTILINGUAL INTEGRATOR</span>
            </div>
          </div>
        </div>

        {/* Desktop Menu links alignment */}
        <div className="hidden lg:flex items-center space-x-6">
          <div className="flex bg-[#050414] p-1 rounded-xl border border-indigo-950/80">
            {navItems.map((item) => {
              const isSelected = activePage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav_btn_${item.id}`}
                  onClick={() => {
                    setActivePage(item.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-mono font-medium tracking-wide transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-purple-950/60 text-purple-200 border border-purple-800/40 font-bold'
                      : 'text-gray-400 hover:text-white hover:bg-indigo-950/40 border border-transparent'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={onRunCompile}
            id="nav_btn_compiler_trigger"
            className="flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] rounded-xl text-xs font-bold transition-all text-white font-mono active:scale-95 cursor-pointer border border-emerald-500/20"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>DEV EXECUTE</span>
          </button>
        </div>

        {/* Mobile Menu layout controls */}
        <div className="lg:hidden flex items-center space-x-2">
          <button
            onClick={onRunCompile}
            className="p-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white"
            title="Fast execute active compiler thread"
          >
            <Play className="w-4 h-4 fill-current" />
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            id="nav_mobile_toggle_switch"
            className="p-2 text-gray-400 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 z-40 bg-black/95 border-b border-indigo-950/65 px-6 py-4 space-y-2 shadow-2xl backdrop-blur-xl">
          {navItems.map((item) => {
            const isSelected = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`nav_mobile_btn_${item.id}`}
                onClick={() => {
                  setActivePage(item.id);
                  setIsOpen(false);
                }}
                className={`flex items-center space-x-3 w-full text-left px-4 py-3 rounded-xl text-xs font-mono font-medium transition-all ${
                  isSelected
                    ? 'text-purple-300 bg-white/5 font-semibold border-l-2 border-purple-500 pl-3'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
