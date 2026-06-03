/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Terminal, Code, Heart, Mail, Smartphone, ArrowUpRight } from 'lucide-react';
import { PageId } from '../types';

interface FooterProps {
  setActivePage: (page: PageId) => void;
}

export default function Footer({ setActivePage }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-white/10 bg-transparent pt-16 pb-8 px-4 md:px-8">
      {/* Radiant Background Blur */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full glow-spot-1 pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActivePage('home')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <span className="font-display font-bold text-sm text-white">M</span>
            </div>
            <span className="font-display font-bold text-md tracking-wider text-white">
              MOHANA<span className="text-amber-400 font-light">LABS</span>
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed font-sans">
            A premium digital product engineering studio. We build custom-crafted analytical dashboards, robust multi-tenant SaaS products, and bespoke cognitive AI pipeline nodes.
          </p>
          <div className="flex items-center space-x-2 text-[10px] font-mono text-[#7C3AED]">
            <Code className="w-3.5 h-3.5" />
            <span>HQ: Bangalore • Silicon Valley</span>
          </div>
        </div>

        {/* Services Links */}
        <div>
          <h4 className="font-display font-semibold text-xs text-white tracking-widest uppercase mb-4">
            Studio Capabilities
          </h4>
          <ul className="space-y-2.5 text-xs text-gray-400">
            <li className="hover:text-amber-400 transition-colors cursor-pointer" onClick={() => setActivePage('services')}>
              Dashboard Engineering
            </li>
            <li className="hover:text-amber-400 transition-colors cursor-pointer" onClick={() => setActivePage('services')}>
              Multi-tenant SaaS Hubs
            </li>
            <li className="hover:text-amber-400 transition-colors cursor-pointer" onClick={() => setActivePage('services')}>
              Custom Enterprise Systems
            </li>
            <li className="hover:text-amber-400 transition-colors cursor-pointer" onClick={() => setActivePage('services')}>
              Cognitive LLM Pipelines
            </li>
          </ul>
        </div>

        {/* Navigation Map */}
        <div>
          <h4 className="font-display font-semibold text-xs text-white tracking-widest uppercase mb-4">
            Navigation Map
          </h4>
          <ul className="space-y-2.5 text-xs text-gray-400">
            {['home', 'about', 'services', 'projects', 'labs', 'technologies', 'contact'].map((page) => (
              <li 
                key={page}
                onClick={() => setActivePage(page as PageId)}
                className="hover:text-amber-400 transition-colors cursor-pointer capitalize flex items-center space-x-1"
              >
                <span>{page === 'projects' ? 'Demos & Projects' : page === 'technologies' ? 'Tech Stack' : page}</span>
                <ArrowUpRight className="w-2.5 h-2.5 opacity-40" />
              </li>
            ))}
          </ul>
        </div>

        {/* Studio Contacts */}
        <div className="space-y-4">
          <h4 className="font-display font-semibold text-xs text-white tracking-widest uppercase">
            Let's Collaborate
          </h4>
          <p className="text-xs text-gray-400">
            Accelerate your dashboard capabilities or model release cycles today.
          </p>
          <div className="space-y-2">
            <a 
              href="mailto:mohanasaravanan1004@gmail.com"
              className="flex items-center space-x-2 text-xs text-gray-400 hover:text-amber-400 transition-colors"
            >
              <Mail className="w-4 h-4 text-purple-400" />
              <span className="font-mono">mohanasaravanan1004@gmail.com</span>
            </a>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <Smartphone className="w-4 h-4 text-purple-400" />
              <span className="font-mono text-xs">+91 (Studio Inbound)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-footer */}
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500">
        <div>
          &copy; {currentYear} Mohana Labs Private Limited. All rights reserved.
        </div>
        <div className="flex items-center space-x-1 mt-4 sm:mt-0">
          <span>Engineered with React 19, Tailwind v4 &</span>
          <Heart className="w-3 h-3 text-red-500 fill-current" />
          <span>by the Mohana Team</span>
        </div>
      </div>
    </footer>
  );
}
