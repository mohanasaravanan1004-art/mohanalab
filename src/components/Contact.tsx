/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Check, Sliders, AlertCircle, RefreshCw, Send, CheckCircle, ShieldCheck } from 'lucide-react';
import { PageId } from '../types';

interface ContactProps {
  selectedServiceId?: string;
  setSelectedServiceId?: (serviceId: string) => void;
}

export default function Contact({ selectedServiceId, setSelectedServiceId }: ContactProps) {
  // Traditional form fields
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  // Service toggling state
  const selectedService = selectedServiceId || 'dashboards';
  const handleToggleService = (serviceId: string) => {
    if (setSelectedServiceId) {
      setSelectedServiceId(serviceId);
    }
  };

  // Slider budget allocations
  const [budgetRange, setBudgetRange] = useState(25000); // dollars
  const [targetTimeline, setTargetTimeline] = useState<'rapid' | 'standard' | 'enterprise'>('standard');

  // Submission lifecycles
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [hasCompletedSub, setHasCompletedSub] = useState(false);

  // Compute team parameters dynamically in the UI
  const estimatedAllocation = () => {
    const engineerRates = 100; // $100 an hour blended dev costs
    const totalHoursProjected = Math.round(budgetRange / engineerRates);
    const timelineMultiplier = targetTimeline === 'rapid' ? 0.85 : targetTimeline === 'enterprise' ? 1.25 : 1.0;
    const finalHours = Math.round(totalHoursProjected * timelineMultiplier);
    const months = targetTimeline === 'rapid' ? '1-2' : targetTimeline === 'standard' ? '2-4' : '4-8';
    
    // Team allocation
    const squadSize = budgetRange <= 15000 ? 1 : budgetRange <= 45000 ? 3 : 5;
    return { hours: finalHours, months, squadSize };
  };

  const handleDispatchProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || !projectDescription.trim()) return;

    setIsTransmitting(true);

    setTimeout(() => {
      setIsTransmitting(false);
      setHasCompletedSub(true);
    }, 1800);
  };

  const handleResetForm = () => {
    setClientName('');
    setClientEmail('');
    setProjectDescription('');
    setHasCompletedSub(false);
  };

  return (
    <section className="relative py-20 px-4 md:px-8 bg-transparent">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/3 left-10 w-96 h-96 rounded-full glow-spot-1 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10 font-sans">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-block bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            <span className="font-mono text-[9px] tracking-widest text-[#F59E0B] font-semibold uppercase">
              STUDIO PORTAL ACTIVE
            </span>
          </div>
          <h2 className="font-display font-medium text-3xl sm:text-4xl text-white tracking-tight">
            Initiate Your Core Project Build <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-100 to-amber-300">
              Interactive Scope Estimator
            </span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Configure your dream solution pipeline. Set your budget slider to view real-time allocations, squad densities, and structural delivery schedules instantly before submitting.
          </p>
        </div>

        {/* Major Onboarding Dashboard Display */}
        <div className="max-w-5xl mx-auto">
          {!hasCompletedSub ? (
            <form onSubmit={handleDispatchProposal} className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="proposal_form_container">
              
              {/* Left Config Controls (7 cols) */}
              <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
                
                {/* STAGE 1: Capability Core */}
                <div className="space-y-3">
                  <span className="font-display text-xs text-white uppercase tracking-widest block font-medium">
                    STAGE 01: Connect Capability Segment
                  </span>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      { id: 'dashboards', label: 'Advanced Dashboards' },
                      { id: 'saas', label: 'SaaS Platforms' },
                      { id: 'webapps', label: 'Web Applications' },
                      { id: 'analytics', label: 'Business Analytics' },
                      { id: 'ai', label: 'AI Cognitive Loops' },
                    ].map((srv) => (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => handleToggleService(srv.id)}
                        className={`p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                          selectedService === srv.id
                            ? 'bg-purple-950/40 border-purple-500 text-amber-400 shadow-md shadow-purple-950/20'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="flex flex-col h-full justify-between">
                          <span className="font-mono text-[8px] text-slate-500 uppercase">/{srv.id}</span>
                          <span className="mt-2 block leading-snug">{srv.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* STAGE 2: Budget sliding indices */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs text-white uppercase tracking-widest block font-medium">
                      STAGE 02: Slide Target Budget Array
                    </span>
                    <span className="font-mono text-xs text-emerald-400 font-bold">${budgetRange.toLocaleString()} USD</span>
                  </div>

                  <input
                    type="range"
                    min="5000"
                    max="100000"
                    step="5000"
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(parseInt(e.target.value))}
                    className="w-full accent-[#7C3AED] cursor-pointer"
                  />

                  {/* Timeline Selection matrices */}
                  <div className="pt-2">
                    <span className="text-[10px] font-mono text-slate-400 block pb-2 uppercase text-xs">Target Delivery Cadence</span>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'rapid', label: 'Express Delivery (1-2 months)', desc: 'High squad allocation scale' },
                        { id: 'standard', label: 'Standard Delivery (2-4 months)', desc: 'Balanced architectural pipeline' },
                        { id: 'enterprise', label: 'Enterprise Roadmap (4-8 months)', desc: 'Heavy multi-stage testing audits' },
                      ].map((time) => (
                        <button
                          key={time.id}
                          type="button"
                          onClick={() => setTargetTimeline(time.id as 'rapid' | 'standard' | 'enterprise')}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            targetTimeline === time.id
                              ? 'bg-purple-950/40 border-purple-500 text-white shadow-md shadow-purple-950/20'
                              : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <span className="font-display text-[10px] font-semibold block leading-tight">{time.label}</span>
                          <span className="text-[8px] font-mono text-slate-500 mt-1 block leading-tight">{time.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* STAGE 3: Traditional contact */}
                <div className="space-y-4 pt-2 border-t border-white/10">
                  <span className="font-display font-semibold text-xs text-white uppercase tracking-widest block">
                    STAGE 03: Profile Coordinates
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Your Client Name</label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Sarah Jenkins"
                        className="w-full bg-[#2D2962]/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-600 font-sans"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Your Contact Email</label>
                      <input
                        type="email"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="sarah@solotech.com"
                        className="w-full bg-[#2D2962]/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-600 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase font-sans">Project Objectives &amp; System Constraints</label>
                    <textarea
                      required
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="We require a core modular tracking analytics panel that integrates real-time PostgreSQL ledger files at 1k updates per minute..."
                      rows={4}
                      className="w-full bg-[#2D2962]/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-600 leading-relaxed font-sans shrink-0"
                    />
                  </div>
                </div>

                {/* Submitting controller */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isTransmitting}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold tracking-wide font-display border border-purple-500/20 active:translate-y-0.5 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {isTransmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                        <span className="font-mono">TRANSMITTING SMTP PACKETS...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-amber-400 fill-current" />
                        <span>DISPATCH PROPOSAL FILE</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* Right Side Visual Estimate Readout (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between" id="estimates_board">
                <div className="glass-panel border-white/10 rounded-3xl p-6 relative flex flex-col h-full bg-white/5 backdrop-blur-xl">
                  <div className="absolute top-0 right-10 -translate-y-1/2 bg-[#2D2962] border border-white/10 text-[10px] font-mono text-emerald-400 px-3 py-0.5 rounded-full font-semibold">
                    Live Proposal Calculus
                  </div>

                  <div className="space-y-6 flex-1">
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest block font-bold">ALGORITHMIC BLUEPRINT METRICS</span>
                      <h4 className="font-display font-medium text-lg text-white">Project Resource Allocation Summary</h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans mt-1 font-light">
                        Computed values indicate estimated developmental timeline indices based on custom-crafted operational modules.
                      </p>
                    </div>

                    {/* Numeric cards mapping */}
                    <div className="space-y-3">
                      
                      <div className="bg-[#2D2962]/40 p-3 rounded-xl border border-white/10 flex justify-between items-center">
                        <div>
                          <span className="text-[9px] font-mono text-slate-500 uppercase block">Active Operational Pipeline</span>
                          <span className="text-xs font-sans text-amber-400 block font-bold mt-1 uppercase">
                            /{selectedService} Scope Engine
                          </span>
                        </div>
                        <Check className="w-5 h-5 text-purple-500" />
                      </div>

                      <div className="bg-[#2D2962]/40 p-3 rounded-xl border border-white/10 flex justify-between items-center">
                        <div>
                          <span className="text-[9px] font-mono text-slate-500 uppercase block">Projected Resource Scope</span>
                          <span className="text-sm font-mono font-bold text-white block mt-1">
                            {estimatedAllocation().hours} <span className="text-[10px] text-slate-400 font-light font-sans font-medium">estimated developer hours</span>
                          </span>
                        </div>
                        <Sliders className="w-5 h-5 text-purple-500" />
                      </div>

                      <div className="bg-[#2D2962]/40 p-3 rounded-xl border border-white/10 flex justify-between items-center">
                        <div>
                          <span className="text-[9px] font-mono text-slate-500 uppercase block">Assigned Engineering Squad</span>
                          <span className="text-sm font-serif font-bold text-emerald-400 block font-mono mt-1">
                            {estimatedAllocation().squadSize} Senior Architects
                          </span>
                        </div>
                        <ShieldCheck className="w-5 h-5 text-[#10b981]" />
                      </div>

                      <div className="bg-[#2D2962]/40 p-3 rounded-xl border border-white/10 flex justify-between items-center">
                        <div>
                          <span className="text-[9px] font-mono text-slate-500 block uppercase">Est Delivery Window</span>
                          <span className="text-sm font-mono font-bold text-[#F59E0B] tracking-wide block mt-1">
                            {estimatedAllocation().months} Calendar Months
                          </span>
                        </div>
                        <AlertCircle className="w-5 h-5 text-[#F59E0B]" />
                      </div>

                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/10 flex items-center space-x-3 text-[10px] text-slate-500 font-mono">
                    <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0" />
                    <span>All proposals are secured by strict institutional NDA policies by default.</span>
                  </div>
                </div>
              </div>

            </form>
          ) : (
            /* SUBMISSION SUCCESS CARD STATE */
            <div 
              id="onboarding_success_layout" 
              className="glass-panel border-white/10 rounded-3xl p-8 max-w-2xl mx-auto text-center space-y-6 purple-glow"
            >
              <div className="w-16 h-16 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-995">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>

              <div className="space-y-2">
                <span className="font-mono text-[9px] text-emerald-400 tracking-widest block font-bold">TRANSMISSION ESTABLISHED SYNC_OK</span>
                <h3 className="font-display font-medium text-2xl text-white">Your Product Architecture Briefing is Secured</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                  Thank you, <strong>{clientName}</strong>. Our SMTP pipelines have successfully transmitted your project metrics to the local routing server.
                </p>
              </div>

              {/* Scope overview receipt */}
              <div className="bg-[#2D2962]/40 rounded-2xl p-5 border border-white/10 text-left max-w-md mx-auto space-y-3 font-mono text-xs text-[#f3f4f6]">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-500">Proposed Ingress Client:</span>
                  <span className="text-white font-bold">{clientName}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-500">Proposal Scope Token:</span>
                  <span className="text-amber-400">/{selectedService} Pipeline</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-500">Budget Range Ceiling:</span>
                  <span className="text-white font-bold">${budgetRange.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-500">Dedicated Dev Squad:</span>
                  <span className="text-emerald-400">{estimatedAllocation().squadSize} Senior Devs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Client Response SLA:</span>
                  <span className="text-[#7C3AED]">&lt; 14 hours ({clientEmail})</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-center space-x-3">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-6 py-2.5 bg-white/5 border border-white/10 text-[11px] font-mono text-white rounded-xl transition-colors cursor-pointer hover:bg-white/10"
                >
                  Draft Another Proposal Record
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
