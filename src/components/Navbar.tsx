/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Menu, X, Rocket, Cpu, Terminal } from 'lucide-react';
import { useState } from 'react';
import { PageId } from '../types';

interface NavbarProps {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
}

export default function Navbar({ activePage, setActivePage }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems: { id: PageId; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'projects', label: '30-Day Roadmap' },
    { id: 'labs', label: 'Labs' },
    { id: 'technologies', label: 'Tech Stack' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10 px-4 py-3 md:px-8 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <div 
          onClick={() => setActivePage('home')} 
          className="flex items-center space-x-3 cursor-pointer group"
          id="nav_logo_container"
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-[#7C3AED] to-[#F59E0B] rounded-xl flex items-center justify-center shadow-lg shadow-[#7C3AED]/20 transition-transform group-hover:scale-105">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white font-sans">
              Mohana<span className="text-[#7C3AED]">Labs</span>
            </span>
            <div className="flex items-center space-x-1 text-[8px] font-mono tracking-widest text-slate-400">
              <Terminal className="w-2 h-2" />
              <span>DIGITAL PRODUCT STUDIO</span>
            </div>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              id={`nav_btn_${item.id}`}
              onClick={() => {
                setActivePage(item.id);
                setIsOpen(false);
              }}
              className={`relative pb-1 text-sm font-semibold transition-all duration-200 border-b-2 ${
                activePage === item.id
                  ? 'text-white border-[#7C3AED]'
                  : 'text-slate-400 hover:text-white border-transparent'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => setActivePage('contact')}
            id="nav_btn_cta"
            className="px-6 py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] rounded-full text-xs font-bold transition-all text-white font-sans"
          >
            Start a Project
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            id="nav_mobile_toggle"
            className="p-2 text-gray-400 hover:text-white focus:outline-none"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div 
          className="lg:hidden absolute top-full left-0 right-0 z-40 bg-black/95 border-b border-white/10 px-6 py-6 space-y-3 shadow-2xl backdrop-blur-xl"
          style={{ contentVisibility: 'auto' }}
        >
          {navigationItems.map((item) => (
            <button
              key={item.id}
              id={`nav_mobile_btn_${item.id}`}
              onClick={() => {
                setActivePage(item.id);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all ${
                activePage === item.id
                  ? 'text-amber-400 bg-white/5 font-semibold border-l-2 border-amber-400 pl-3'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 border-t border-white/10">
            <button
              onClick={() => {
                setActivePage('contact');
                setIsOpen(false);
              }}
              id="nav_mobile_cta"
              className="w-full flex items-center justify-center space-x-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-xs font-semibold tracking-wide cursor-pointer"
            >
              <Rocket className="w-4 h-4 text-amber-300" />
              <span>Launch Project</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
