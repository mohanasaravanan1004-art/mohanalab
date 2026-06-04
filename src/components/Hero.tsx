/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowRight, Sparkles, AlertCircle, RefreshCw, Layers, Server, Cpu, ShieldCheck } from 'lucide-react';
import { useState, useMemo } from 'react';
import { STUDIO_STATS } from '../data';
import { PageId } from '../types';

interface HeroProps {
  setActivePage: (page: PageId) => void;
}

interface BlueprintOption {
  id: string;
  name: string;
  category: 'Frontend' | 'Infrastructure' | 'Cognitive' | 'Security';
  hours: number;
  complexity: number;
  baseCost: number;
}

const BLUEPRINT_OPTIONS: BlueprintOption[] = [
  { id: 'react-vite', name: 'React 19 & Tailwind v4 Canvas', category: 'Frontend', hours: 40, complexity: 1.1, baseCost: 1500 },
  { id: 'motion-framer', name: 'Custom Physics UI & Motion Hooks', category: 'Frontend', hours: 25, complexity: 1.2, baseCost: 800 },
  { id: 'postgres-sql', name: 'Postgres Relational Cohort Schemas', category: 'Infrastructure', hours: 35, complexity: 1.1, baseCost: 1200 },
  { id: 'redis-cache', name: 'Redis Sub-Millisecond Caching Nodes', category: 'Infrastructure', hours: 20, complexity: 1.3, baseCost: 700 },
  { id: 'gemini-rag', name: 'Gemini RAG Contextual Intelligence Network', category: 'Cognitive', hours: 60, complexity: 1.5, baseCost: 3500 },
  { id: 'agentic-loops', name: 'Autonomous Logic Workers & Actions', category: 'Cognitive', hours: 45, complexity: 1.6, baseCost: 2400 },
  { id: 'multi-tenant', name: 'Encrypted Multi-Tenant Schema Isolation', category: 'Security', hours: 50, complexity: 1.4, baseCost: 2000 },
];

export default function Hero({ setActivePage }: HeroProps) {
  // Blueprint configuration calculator state
  const [selectedTools, setSelectedTools] = useState<string[]>(['react-vite', 'postgres-sql']);
  
  // Custom estimated timeline and values computed via React hooks
  const calculation = useMemo(() => {
    let totalHours = 0;
    let baseSum = 0;
    let maxMultiplier = 1.0;

    BLUEPRINT_OPTIONS.forEach(opt => {
      if (selectedTools.includes(opt.id)) {
        totalHours += opt.hours;
        baseSum += opt.baseCost;
        if (opt.complexity > maxMultiplier) {
          maxMultiplier = opt.complexity;
        }
      }
    });

    const finalEstimate = Math.round(baseSum * maxMultiplier);
    const timelineWeeks = Math.ceil(totalHours / 30); // 30 dev hours a week

    return {
      hours: totalHours,
      multiplier: maxMultiplier.toFixed(1),
      quote: finalEstimate.toLocaleString(),
      weeks: timelineWeeks,
      health: selectedTools.length === 0 ? 0 : Math.round(100 - (maxMultiplier * 18))
    };
  }, [selectedTools]);

  const toggleTool = (toolId: string) => {
    if (selectedTools.includes(toolId)) {
      setSelectedTools(selectedTools.filter(id => id !== toolId));
    } else {
      setSelectedTools([...selectedTools, toolId]);
    }
  };

  const resetBlueprint = () => {
    setSelectedTools(['react-vite', 'postgres-sql']);
  };

  return (
    <section className="relative pt-32 pb-20 px-4 md:px-8 overflow-hidden">
      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0e26_1px,transparent_1px),linear-gradient(to_bottom,#0f0e26_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Decorative Ambient Radial Lights */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full glow-spot-1 pointer-events-none" />
      <div className="absolute top-40 right-20 w-80 h-80 rounded-full glow-spot-2 pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 items-center">
        {/* Left Headline Intro Column (7/12 layout) */}
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-8">
            <span className="w-2 h-2 bg-[#F59E0B] rounded-full"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F59E0B]">Innovation in Motion</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-7xl leading-[0.95] tracking-tighter mb-8 text-white">
            We compile complex data streams into <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40">
              world-class custom dashboards.
            </span>
          </h1>

          <p className="text-sm md:text-md text-slate-400 leading-relaxed max-w-2xl font-sans">
            Mohana Labs specializes in engineering high-fidelity digital platforms, real-time analytics portals, and bespoke cognitive AI pipeline nodes. We combine mathematical UI precision with bleeding-edge stack architecture.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => setActivePage('projects')}
              id="hero_primary_btn"
              className="group px-10 py-5 bg-white text-[#1E1B4B] font-bold rounded-2xl flex items-center gap-3 hover:scale-[1.02] transition-transform text-xs cursor-pointer"
            >
              <span>Explore 30-Day Roadmap</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-current text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </button>
            <button
              onClick={() => setActivePage('contact')}
              id="hero_secondary_btn"
              className="px-10 py-5 border border-white/10 bg-white/5 backdrop-blur hover:bg-white/10 rounded-2xl font-bold transition-all text-xs text-white"
            >
              <span>Schedule Architecture Review</span>
            </button>
          </div>
        </div>

        {/* Right Architect Playground Column (5/12 layout) */}
        <div className="lg:col-span-5">
          <div className="glass-panel rounded-2xl p-6 border border-white/10 relative purple-glow bg-white/5 backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
              <div>
                <h3 className="font-display font-medium text-xs text-white tracking-widest uppercase flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-amber-500" />
                  <span>SaaS Architect Blueprint</span>
                </h3>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">ESTIMATE DEV TIMELINES IN REALTIME</p>
              </div>
              <button 
                onClick={resetBlueprint}
                className="p-1 px-2 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-amber-400 flex items-center space-x-1 hover:bg-white/10 transition-all cursor-pointer"
                title="Reset Config"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* List options */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {BLUEPRINT_OPTIONS.map((tool) => {
                const isSelected = selectedTools.includes(tool.id);
                return (
                  <div
                    key={tool.id}
                    onClick={() => toggleTool(tool.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-500/40 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`mt-0.5 w-3 h-3 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-amber-400 bg-amber-400/20' : 'border-white/10'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />}
                      </div>
                      <div>
                        <p className="text-[11px] font-medium leading-tight">{tool.name}</p>
                        <p className="text-[9px] font-mono text-slate-500 tracking-wider">
                          {tool.category} • {tool.hours}h dev • complexity x{tool.complexity}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Metric Board */}
            <div className="mt-5 grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
              <div className="bg-[#2D2962]/40 rounded-xl p-3 border border-white/10 flex flex-col justify-between">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Total Dev Scope</span>
                <span className="font-mono text-md font-bold text-white mt-1">
                  {calculation.hours} <span className="text-[10px] text-slate-400 font-light font-sans font-medium">hours</span>
                </span>
                <span className="text-[9px] font-mono text-purple-400 mt-0.5 font-bold">Approx. {calculation.weeks} weeks</span>
              </div>
              <div className="bg-[#2D2962]/40 rounded-xl p-3 border border-white/10 flex flex-col justify-between">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Estimated Value</span>
                <span className="font-mono text-md font-bold text-amber-400 mt-1">
                  ${calculation.quote}
                </span>
                <span className="text-[9px] font-mono text-slate-400 mt-0.5 font-bold">Fidelity Index {calculation.health}%</span>
              </div>
            </div>

            <div className="mt-4 bg-purple-950/10 border border-purple-900/30 rounded-xl p-3 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-400 leading-normal font-sans font-light">
                This blueprint creates a highly secure infrastructure with <strong>strict data isolation</strong>, responsive layout engines, and dynamic charts. Click <strong>Launch Project</strong> to reserve this architecture!
              </p>
            </div>
            
            {/* Direct CTA */}
            <button
              onClick={() => setActivePage('contact')}
              className="mt-4 w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-semibold tracking-wide hover:opacity-90 transition-opacity cursor-pointer font-display"
            >
              Secure This Configuration Blueprint
            </button>
          </div>
        </div>
      </div>

      {/* Numeric Stats Rack */}
      <div className="max-w-7xl mx-auto mt-20 pt-16 border-t border-white/10 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STUDIO_STATS.map((stat, idx) => {
            const labelColors = [
              'text-[#7C3AED]',
              'text-[#F59E0B]',
              'text-[#A78BFA]',
              'text-slate-400'
            ];
            const labelColor = labelColors[idx % labelColors.length];
            return (
              <div key={stat.id} className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl hover:bg-white/10 transition-colors">
                <div className="font-display font-black text-3xl md:text-4xl text-white tracking-tight">
                  {stat.number}
                </div>
                <div className={`text-[10px] uppercase tracking-widest ${labelColor} font-bold mt-2 font-mono`}>
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
