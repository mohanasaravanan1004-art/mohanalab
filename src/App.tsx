/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { PageId } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Projects from './components/Projects';
import Labs from './components/Labs';
import Technologies from './components/Technologies';
import Contact from './components/Contact';
import Testimonials from './components/Testimonials';
import { ArrowRight, Sparkles, Code, Play, Send, Zap, ChevronRight } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('home');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('dashboards');

  // Smooth scroll reset when toggling route views
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activePage]);

  // Global visual wrapper layout
  return (
    <div className="min-h-screen bg-[#070615] text-[#f3f4f6]" id="app_root_layout">
      {/* Background stars glowing indicators */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-indigo-950/15 via-transparent to-transparent pointer-events-none" />

      {/* Global Header */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Primary Dynamic Main Framework View */}
      <main className="relative z-10 pt-16">
        
        {/* HOMEPAGE AGGREGATION VIEW */}
        {activePage === 'home' && (
          <div className="space-y-12 animate-fade-in" id="home_view_wrapper">
            <Hero setActivePage={setActivePage} />

            {/* Quick Services Preview Block */}
            <Services setActivePage={setActivePage} setSelectedServiceId={setSelectedServiceId} />

            {/* Quick 30-Day Web Dev Syllabus Tracker preview block */}
            <div className="bg-[#050410] py-20 px-4 md:px-8 border-y border-indigo-950/80">
              <div className="max-w-7xl mx-auto space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-indigo-950">
                  <div className="space-y-2">
                    <span className="font-mono text-purple-400 text-[10px] tracking-widest block uppercase font-semibold">CURRICULUM CENTER</span>
                    <h3 className="font-display font-medium text-2xl text-white">30-Day Web Development masterclass</h3>
                    <p className="text-gray-400 text-xs">A comprehensive curriculum containing daily tasks to master HTML tags, responsive CSS layouts, interactive JavaScript, server APIs, and cloud deployment.</p>
                  </div>
                  <button
                    onClick={() => setActivePage('projects')}
                    className="group flex items-center space-x-1 text-xs font-mono text-amber-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>Launch Roadmap Syllabus</span>
                    <ArrowRight className="w-4 h-4 text-[#7C3AED] group-hover:translate-x-1.5 transition-transform" />
                  </button>
                </div>

                {/* Grid layout shortcuts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-[#0b0a1f] border border-indigo-950 rounded-2xl flex flex-col justify-between hover:border-[#a855f7]/40 transition-all">
                    <div className="space-y-3">
                      <span className="bg-purple-950/40 border border-purple-900/40 text-[9px] font-mono text-purple-400 px-2 py-0.5 rounded uppercase">WEEK 1 &amp; 2</span>
                      <h4 className="font-display text-md text-white font-semibold">HTML Structure &amp; Responsive CSS Frameworks</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Design state-of-the-art sticky headers, absolute box-model boundaries, multi-column CSS grids, responsive flexboxes, and interactive landing pages.
                      </p>
                    </div>
                    <button
                      onClick={() => setActivePage('projects')}
                      className="mt-6 flex items-center space-x-1 text-xs text-amber-400 hover:text-white transition-colors text-left cursor-pointer"
                    >
                      <span>Open Level-1 Syllabus</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="p-6 bg-[#0b0a1f] border border-indigo-950 rounded-2xl flex flex-col justify-between hover:border-[#a855f7]/40 transition-all">
                    <div className="space-y-3">
                      <span className="bg-amber-950/40 border border-amber-900/30 text-[9px] font-mono text-amber-300 px-2 py-0.5 rounded uppercase">WEEK 3 &amp; 4</span>
                      <h4 className="font-display text-md text-white font-semibold">JavaScript Engine, JSON APIs &amp; Live Deployment</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Learn variable memory states, listen to real-time mouse/DOM inputs, load external fetch API payloads, configure storage parameters, and deploy live.
                      </p>
                    </div>
                    <button
                      onClick={() => setActivePage('projects')}
                      className="mt-6 flex items-center space-x-1 text-xs text-amber-400 hover:text-white transition-colors text-left cursor-pointer"
                    >
                      <span>Open Level-2 Syllabus</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Labs Preview banner */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
              <div className="glass-panel border-indigo-950 bg-gradient-to-br from-indigo-950/20 via-transparent to-purple-950/20 p-8 rounded-3xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 rounded-full glow-spot-1 pointer-events-none" />
                
                <div className="md:col-span-8 space-y-4 relative z-10">
                  <div className="inline-block bg-purple-950/40 border border-purple-900/30 px-3 py-1 rounded-full">
                    <span className="font-mono text-[9px] tracking-widest text-[#7C3AED] font-semibold uppercase">THE R&amp;D LAB</span>
                  </div>
                  <h4 className="font-display font-medium text-xl sm:text-2xl text-white">
                    Need neural routing flows, wave mathematics, or mock logs telemetry? Explore Labs.
                  </h4>
                  <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
                    We host real-time diagnostic stream engines, SVG parametric oscillators, and node flow configuration grids to benchmark performance.
                  </p>
                </div>

                <div className="md:col-span-4 text-left md:text-right relative z-10">
                  <button
                    onClick={() => setActivePage('labs')}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-semibold tracking-wide hover:opacity-95 transition-opacity inline-flex items-center space-x-2"
                  >
                    <span>Inspect Laboratory Canvas</span>
                    <Play className="w-3 w-3 fill-current text-amber-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Client Testimonials */}
            <Testimonials />

            {/* Dynamic Interactive Universal Call to Action */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pb-10">
              <div className="rounded-3xl p-8 bg-gradient-to-br from-[#1E1B4B] via-[#070615] to-[#120f32] text-center space-y-6 border border-indigo-900 shadow-xl relative overflow-hidden gold-glow">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.12),rgba(0,0,0,0))] pointer-events-none" />
                
                <div className="space-y-2 relative z-10 max-w-xl mx-auto">
                  <span className="font-mono text-[9px] text-[#F59E0B] tracking-widest uppercase block font-bold">READY TO ARCHITECT?</span>
                  <h3 className="font-display font-medium text-2xl sm:text-3xl text-white tracking-tight leading-snug">Let's craft your high-performance custom analytical solutions today.</h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans pt-1">
                    Book an intake evaluation session with our elite modular design squad. Align budgets, timeline sliders, and capacity modules on our estimate portal.
                  </p>
                </div>

                <div className="pt-2 relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setActivePage('contact')}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg hover:shadow-purple-900/30 transition-all uppercase tracking-widest border border-purple-500/20"
                  >
                    Configure Estimate Questionnaire &amp; Launch
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. DEDICATED ABOUT PAGE */}
        {activePage === 'about' && (
          <div className="animate-fade-in" id="about_view_wrapper">
            <About />
          </div>
        )}

        {/* 3. DEDICATED SERVICES PAGE */}
        {activePage === 'services' && (
          <div className="animate-fade-in" id="services_view_wrapper">
            <Services setActivePage={setActivePage} setSelectedServiceId={setSelectedServiceId} />
          </div>
        )}

        {/* 4. DEDICATED PROJECTS PAGE */}
        {activePage === 'projects' && (
          <div className="animate-fade-in" id="projects_view_wrapper">
            <Projects />
          </div>
        )}

        {/* 5. DEDICATED LABS PAGE */}
        {activePage === 'labs' && (
          <div className="animate-fade-in" id="labs_view_wrapper">
            <Labs />
          </div>
        )}

        {/* 6. DEDICATED TECHNOLOGIES PAGE */}
        {activePage === 'technologies' && (
          <div className="animate-fade-in" id="technologies_view_wrapper">
            <Technologies />
          </div>
        )}

        {/* 7. DEDICATED CONTACT ESTIMATOR PAGE */}
        {activePage === 'contact' && (
          <div className="animate-fade-in" id="contact_view_wrapper">
            <Contact selectedServiceId={selectedServiceId} setSelectedServiceId={setSelectedServiceId} />
          </div>
        )}

      </main>

      {/* Corporate footer */}
      <Footer setActivePage={setActivePage} />
    </div>
  );
}
