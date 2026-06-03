/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Shield, Sparkles, Zap, Layers, RefreshCw, Trophy, Target, Heart } from 'lucide-react';

export default function About() {
  const corporateValues = [
    {
      id: 'v1',
      title: 'Architectural Integrity',
      description: 'We avoid bloated code engines and fragile dependency trees. Every server and web component is engineered from direct specifications with high structural resilience.',
      icon: Shield,
    },
    {
      id: 'v2',
      title: 'Visual Craftsmanship',
      description: 'We believe typography, negative space, and micro-interactions dictate user trust. Dashboards shouldn\'t look utilitarian—they should behave like polished software interfaces.',
      icon: Sparkles,
    },
    {
      id: 'v3',
      title: 'Algorithmic Density',
      description: 'Whether compiling database analytics or processing Large Language model streams, we optimize for sub-millisecond paint thresholds and minimal operational overhead.',
      icon: Zap,
    },
  ];

  const operationalTiers = [
    { step: '01', title: 'Deep Discovery Scope', desc: 'Analyzing existing databases, operational workflows, and UI requirements to draft pixel-perfect architectural schematics.' },
    { step: '02', title: 'High-Fidelity Wireframing', desc: 'Crafting comprehensive interactive wireframe layers to define dashboard ergonomics before a single line of backend is written.' },
    { step: '03', title: 'Modular System Builds', desc: 'Writing clean TypeScript pipelines, optimizing relational db schemas, and engineering smooth web interface containers.' },
    { step: '04', title: 'Stress Loading & Audits', desc: 'Iterating through rigorous load profiles, measuring rendering painting bottlenecks, and executing final security checks.' },
  ];

  return (
    <section className="relative py-20 px-4 md:px-8 bg-transparent overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-5 w-96 h-96 rounded-full glow-spot-1 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        
        {/* Banner Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              <span className="font-mono text-[9px] tracking-widest text-[#F59E0B] font-semibold uppercase">
                THE STUDIO MISSION
              </span>
            </div>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-white tracking-tight leading-tight">
              We bridge the delta between complex server telemetry and <span className="text-[#7C3AED]">intuitive design ergonomics</span>.
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-sans">
              Founded on the belief that Enterprise SaaS and Business Intel dashboards deserve the same level of UI aesthetic and design care as premier client-facing b2c platforms, Mohana Labs is a specialized digital product studio. 
            </p>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-sans">
              We assemble lean, autonomous engineering squads featuring veteran database architects, CSS/motion developers, and AI research engineers to deploy secure architectures. We help forward-thinking teams replace messy spreadsheets with clean analytics hubs.
            </p>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="glass-panel border-white/10 rounded-2xl p-6 space-y-4 purple-glow">
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">Studio Metrics</span>
              </div>
              <div className="space-y-4 font-mono text-xs text-[#f3f4f6]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Engineered Codebases:</span>
                  <span className="text-white font-semibold">Active Production</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Global Nodes Deployed:</span>
                  <span className="text-[#F59E0B] font-semibold">SaaS Cloud Platforms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SLA Benchmark:</span>
                  <span className="text-[#7C3AED] font-semibold">Sub-Millisecond Engine</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Values */}
        <div className="space-y-10">
          <div className="text-center max-w-xl mx-auto">
            <span className="font-mono text-[9px] text-[#7C3AED] tracking-widest block uppercase font-semibold">How We Build Tools</span>
            <h3 className="font-display font-medium text-2xl text-white mt-1">Our Core Operational Directives</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {corporateValues.map((value) => {
              const IconComp = value.icon;
              return (
                <div key={value.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4 hover:bg-white/10 transition-colors duration-300">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
                    <IconComp className="w-5 h-5 text-amber-400" />
                  </div>
                  <h4 className="font-display font-semibold text-sm text-white">{value.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Execution Pipeline Lifecycle */}
        <div className="space-y-10">
          <div className="text-center max-w-xl mx-auto">
            <span className="font-mono text-[9px] text-amber-500 tracking-widest block uppercase font-semibold">The Collaboration Journey</span>
            <h3 className="font-display font-medium text-2xl text-white mt-1">Streamlined Project Life Framework</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {operationalTiers.map((tier) => (
              <div key={tier.step} className="p-5 bg-white/5 border border-white/10 rounded-2xl relative space-y-3 hover:bg-white/10 transition-colors">
                <span className="font-mono font-bold text-3xl text-indigo-450/40 absolute top-4 right-4">{tier.step}</span>
                <h4 className="font-display font-bold text-xs text-[#F59E0B] tracking-wider uppercase pt-2">{tier.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{tier.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
