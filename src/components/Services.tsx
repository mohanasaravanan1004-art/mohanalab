/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LayoutDashboard, Cpu, Sparkles, BarChart3, Brain, ArrowUpRight, Check } from 'lucide-react';
import { STUDIO_SERVICES } from '../data';
import { PageId } from '../types';

interface ServicesProps {
  setActivePage: (page: PageId) => void;
  setSelectedServiceId?: (serviceId: string) => void;
}

// Icon Mapping table for strict ESM compiler rendering
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Cpu,
  Sparkles,
  BarChart3,
  Brain,
};

export default function Services({ setActivePage, setSelectedServiceId }: ServicesProps) {

  const handleSelectService = (serviceId: string) => {
    if (setSelectedServiceId) {
      setSelectedServiceId(serviceId);
    }
    setActivePage('contact');
  };

  return (
    <section className="relative py-20 px-4 md:px-8 bg-transparent overflow-hidden">
      {/* Absolute Ambient Background blurs */}
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full glow-spot-1 pointer-events-none" />
      <div className="absolute top-20 left-10 w-80 h-80 rounded-full glow-spot-2 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-block bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            <span className="font-mono text-[9px] tracking-widest text-[#7C3AED] font-semibold uppercase">
              STUDIO SERVICES
            </span>
          </div>
          <h2 className="font-display font-medium text-3xl sm:text-4xl text-white tracking-tight">
            High-Fidelity Engineering, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-100 to-amber-300">
              Forged for Complex SaaS Operations
            </span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-sans">
            We bypass cookie-cutter web generators to design responsive, custom-crafted digital engines with clean database synchronization, high-performance data processing, and premium typography.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STUDIO_SERVICES.map((service) => {
            const IconComponent = ICON_MAP[service.iconName] || LayoutDashboard;
            return (
              <div
                key={service.id}
                id={`service_card_${service.id}`}
                className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col justify-between glass-panel-hover"
              >
                <div className="space-y-6">
                  {/* Top Header Card */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#2D2962]/40 border border-white/10 flex items-center justify-center p-2.5">
                      <IconComponent className="w-6 h-6 text-[#7C3AED]" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 tracking-wider font-semibold uppercase">
                      /{service.id}
                    </span>
                  </div>

                  {/* Descriptions */}
                  <div className="space-y-2">
                    <h3 className="font-display font-semibold text-md text-white group-hover:text-amber-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans min-h-[72px]">
                      {service.description}
                    </p>
                  </div>

                  {/* Bullet Capability Streams */}
                  <div className="pt-4 border-t border-white/10 space-y-2">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-2">Core Competencies:</span>
                    {service.capabilities.map((cap, index) => (
                      <div key={index} className="flex items-center space-x-2 text-[11px] text-gray-300 font-sans">
                        <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA Trigger */}
                <div className="mt-8 pt-4 border-t border-white/10">
                  <button
                    onClick={() => handleSelectService(service.id)}
                    className="flex items-center justify-between w-full group/btn text-xs font-mono text-amber-400 hover:text-white transition-colors cursor-pointer animate-fade-in"
                  >
                    <span>Configure Service Pipeline</span>
                    <ArrowUpRight className="w-4 h-4 text-[#7C3AED] group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
