/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { STUDIO_TECHNOLOGIES } from '../data';
import { Technology } from '../types';
import { Cpu, Terminal, Network, ShieldAlert, BarChart, Brain, Filter } from 'lucide-react';

export default function Technologies() {
  const [activeTechFilter, setActiveTechFilter] = useState<'all' | 'frontend' | 'backend' | 'cloud' | 'analytics' | 'ai'>('all');

  const filterButtons: { id: typeof activeTechFilter; label: string }[] = [
    { id: 'all', label: 'All Tech' },
    { id: 'frontend', label: 'Frontend / Client' },
    { id: 'backend', label: 'Backend Servers' },
    { id: 'cloud', label: 'Cloud / Scaling' },
    { id: 'analytics', label: 'Analytics / BI' },
    { id: 'ai', label: 'AI Cognitive' }
  ];

  const filteredTechnologies = STUDIO_TECHNOLOGIES.filter(tech => {
    if (activeTechFilter === 'all') return true;
    return tech.category === activeTechFilter;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'frontend': return <Terminal className="w-4 h-4 text-cyan-400" />;
      case 'backend': return <Cpu className="w-4 h-4 text-emerald-400" />;
      case 'cloud': return <Network className="w-4 h-4 text-blue-400" />;
      case 'analytics': return <BarChart className="w-4 h-4 text-amber-400" />;
      case 'ai': return <Brain className="w-4 h-4 text-violet-400" />;
      default: return <Cpu className="w-4 h-4" />;
    }
  };

  return (
    <section className="relative py-20 px-4 md:px-8 bg-transparent overflow-hidden">
      {/* Decorative Lights */}
      <div className="absolute top-1/4 right-10 w-96 h-96 rounded-full glow-spot-1 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10 font-sans">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-block bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            <span className="font-mono text-[9px] tracking-widest text-[#7C3AED] font-semibold uppercase">
              STUDIO ARCHITECTURE
            </span>
          </div>
          <h2 className="font-display font-medium text-3xl sm:text-4xl text-white tracking-tight leading-tight">
            Our Elite Battle-Tested <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-100 to-amber-300">
              Technology Stack Strategy
            </span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            We curate modern, production-hardened libraries to build resilient platforms. Review our stack segments below dynamically filtered.
          </p>
        </div>

        {/* Filter Navigation list */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
          {filterButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setActiveTechFilter(btn.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                activeTechFilter === btn.id
                  ? 'bg-indigo-950 border border-purple-500 text-amber-400 shadow-md shadow-purple-950/20'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <span>{btn.label}</span>
            </button>
          ))}
        </div>

        {/* Grid Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTechnologies.map((tech) => (
            <div
              key={tech.name}
              className="glass-panel border-white/10 rounded-2xl p-6 flex flex-col justify-between glass-panel-hover group"
            >
              <div className="space-y-4">
                {/* Header card info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(tech.category)}
                    <span className="text-[10px] font-mono text-slate-500 capitalize tracking-wider">
                      {tech.category === 'ai' ? 'Cognitive AI' : tech.category}
                    </span>
                  </div>
                  <span className="bg-white/5 border border-white/10 text-[10px] font-mono text-amber-400 px-2.5 py-0.5 rounded-md font-medium">
                    {tech.level}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="font-display font-medium text-sm text-white group-hover:text-amber-300 transition-colors">
                    {tech.name}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed min-h-[40px]">
                    {tech.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-white/10 text-[9px] font-mono text-slate-600 uppercase tracking-widest">
                VERIFIED ECOSYSTEM ACCREDITATION
              </div>
            </div>
          ))}
        </div>

        {/* Tactical Info Panel */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center max-w-4xl mx-auto space-y-2">
          <span className="font-mono text-xs text-[#7C3AED] font-bold">Why we decline fragile custom stacks:</span>
          <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
            By strictly adhering to typed frameworks, stateless container ingress targets, and direct SQL optimization techniques, we create custom products with minimum tech debt. We ensure your development stays fast, and maintenance costs stay incredibly low.
          </p>
        </div>

      </div>
    </section>
  );
}
