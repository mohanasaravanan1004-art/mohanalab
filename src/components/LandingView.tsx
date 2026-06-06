/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Code2, 
  Terminal, 
  Sparkles, 
  Award, 
  Cpu, 
  Play, 
  ArrowRight, 
  Layers, 
  CheckCircle, 
  Zap, 
  Users, 
  ChevronRight, 
  Shield 
} from 'lucide-react';
import { PageId, ProgrammingLanguage } from '../types';

interface LandingViewProps {
  onLaunchWorkspace: (lang?: ProgrammingLanguage) => void;
  onOpenAuth: (isRegister: boolean) => void;
  isAuthenticated: boolean;
}

export default function LandingView({ onLaunchWorkspace, onOpenAuth, isAuthenticated }: LandingViewProps) {
  
  // Custom language cards
  const supportedLanguages: { id: ProgrammingLanguage; name: string; ext: string; desc: string; color: string; bg: string; border: string }[] = [
    { id: 'python', name: 'Python 3', ext: '.py', desc: 'Sleek machine learning & generic script tasks', color: 'text-amber-400', bg: 'bg-amber-950/20', border: 'border-amber-900/30' },
    { id: 'cpp', name: 'C++', ext: '.cpp', desc: 'Fast template libraries & absolute performance', color: 'text-blue-400', bg: 'bg-blue-950/20', border: 'border-blue-900/30' },
    { id: 'c', name: 'C (GCC)', ext: '.c', desc: 'Pristine system assembly & static codebases', color: 'text-teal-400', bg: 'bg-teal-950/20', border: 'border-teal-900/30' },
    { id: 'java', name: 'Java (JDK 21)', ext: '.java', desc: 'Enterprise classes & structured blueprints', color: 'text-rose-400', bg: 'bg-rose-950/20', border: 'border-rose-900/30' },
    { id: 'javascript', name: 'JavaScript', ext: '.js', desc: 'Interactive browser callbacks & logic events', color: 'text-yellow-400', bg: 'bg-yellow-950/20', border: 'border-yellow-900/30' },
    { id: 'html', name: 'HTML5 Markup', ext: '.html', desc: 'Structured layouts & client canvas pages', color: 'text-orange-400', bg: 'bg-orange-950/20', border: 'border-orange-900/30' },
    { id: 'css', name: 'CSS Styles', ext: '.css', desc: 'Tailwind CDN grids & layout stylesheets', color: 'text-indigo-400', bg: 'bg-indigo-950/20', border: 'border-indigo-900/30' },
    { id: 'php', name: 'PHP 8.3', ext: '.php', desc: 'Server side template controllers & responses', color: 'text-purple-400', bg: 'bg-purple-950/20', border: 'border-purple-900/30' },
    { id: 'sql', name: 'SQLite DB', ext: '.sql', desc: 'Structured tables query & data ledgers', color: 'text-emerald-400', bg: 'bg-emerald-950/20', border: 'border-emerald-900/30' }
  ];

  // Core features of our platform
  const platformFeatures = [
    {
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      title: "Simulated Thread Runtime",
      desc: "Compile and interpret codes virtually with dynamic memory footers, real-time timing execution logs, and STDIN variable bindings."
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#00df9a]" />,
      title: "Gemini AI Diagnostics",
      desc: "Instantly debug stack traces, request smart autocompletes, auto-format active tabs, and review plain explainers in markdown."
    },
    {
      icon: <Layers className="w-5 h-5 text-indigo-400" />,
      title: "VS Code Styled Files Tree",
      desc: "Build professional files maps (index.html, main.js, styles.css) with multi-tab workspace flows and persistent project controls."
    },
    {
      icon: <Award className="w-5 h-5 text-yellow-400" />,
      title: "Classroom Assignments Board",
      desc: "Track scheduled academic programming tests, run test cases, monitor scores, and track historical submissions status."
    }
  ];

  return (
    <div className="space-y-24 py-6" id="vertex_landing_root">
      
      {/* Hero Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left pt-6">
        
        {/* Callouts */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-purple-950/50 border border-purple-500/30 px-3.5 py-1.5 rounded-full text-[11px] font-mono font-bold text-purple-300">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            <span>VERTEX COHORT 2026 CAMPAIGN</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-tight">
            The Interactive <br/>
            <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-teal-400 bg-clip-text text-transparent">
              Online Compilation
            </span> <br/>
            Platform.
          </h1>

          <p className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed max-w-xl">
            Vertex is a comprehensive coding playground for modern developers. Write, compile, and execute Python, Java, C++, C, SQL, and Web stacks with high-fidelity sidebars, assignment auto-graders, and server-side Gemini AI assistance.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            {isAuthenticated ? (
              <button
                onClick={() => onLaunchWorkspace('python')}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold font-mono tracking-wide shadow-lg shadow-purple-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>ENTER WORKSPACE GATEWAY</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold font-mono tracking-wide shadow-lg shadow-purple-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>REGISTER TO COMMENCE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onOpenAuth(false)}
                  className="px-6 py-3 bg-indigo-950/40 hover:bg-indigo-950/80 text-indigo-200 border border-indigo-900/45 hover:border-indigo-800 rounded-xl text-xs font-bold font-mono tracking-wide active:scale-95 transition-all cursor-pointer"
                >
                  STUDENT LOGIN
                </button>
              </>
            )}
            
            <button
              onClick={() => onLaunchWorkspace('html')}
              className="px-6 py-3 bg-[#0d0728]/80 hover:bg-[#130b3b] text-gray-300 border border-indigo-950 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />
              <span>TEST FREE RUNTIME</span>
            </button>
          </div>

          {/* Quick trust counts */}
          <div className="pt-6 grid grid-cols-3 gap-4 border-t border-indigo-950/60 max-w-md">
            <div>
              <span className="block text-xl font-extrabold text-white font-mono">1.2M+</span>
              <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500">PROGRAMS RUN</span>
            </div>
            <div>
              <span className="block text-xl font-extrabold text-purple-400 font-mono">24,192</span>
              <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500">STUDENTS GRADED</span>
            </div>
            <div>
              <span className="block text-xl font-extrabold text-emerald-400 font-mono">&lt; 15ms</span>
              <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500">VIRTUAL LATENCY</span>
            </div>
          </div>

        </div>

        {/* Visual Mock-up Box */}
        <div className="lg:col-span-6 relative">
          
          <div className="absolute top-[30%] left-[25%] -z-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-[20%] right-[10%] -z-10 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Modern UI Window wrapper */}
          <div className="bg-[#08051e] border border-indigo-950/80 rounded-3xl overflow-hidden shadow-2xl p-4 space-y-4">
            
            {/* Window title header */}
            <div className="flex items-center justify-between border-b border-indigo-950/40 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-[10px] text-zinc-500 font-mono font-medium pl-2">main.py — Vertex IDE Workspace</span>
              </div>
              <span className="text-[9px] bg-emerald-950/40 text-emerald-400 font-bold px-2 py-0.5 rounded font-mono">
                ONLINE SIMULATOR
              </span>
            </div>

            {/* Simulated code display */}
            <div className="bg-[#040212] rounded-xl p-4 font-mono text-[11px] text-zinc-300 leading-normal text-left h-52 overflow-hidden relative">
              <div className="flex space-x-3.5">
                <div className="text-zinc-600 select-none text-right pr-1">
                  <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div><div>8</div>
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="text-zinc-500"># Premium Code Compiler diagnostics simulation</div>
                  <div><span className="text-purple-400 font-bold">def</span> <span className="text-indigo-400 font-bold">evaluate_grade</span>(score, student_name):</div>
                  <div className="pl-4">xp_awarded = score * <span className="text-orange-400">12</span></div>
                  <div className="pl-4">print(f<span className="text-yellow-200">"📊 Processing homework statistics for: {"{student_name}"}"</span>)</div>
                  <div className="pl-4">print(f<span className="text-yellow-200">"🏆 XP Awarded: {"{xp_awarded}"} coins."</span>)</div>
                  <div className="pl-4"><span className="text-purple-400 font-bold">return</span> xp_awarded</div>
                  <div className="text-[#00df9a] mt-4 font-bold">evaluate_grade(95, "Alex Mercer")</div>
                </div>
              </div>

              {/* Glowing overlays */}
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#040212] to-transparent pointer-events-none" />
            </div>

            {/* Output console bar */}
            <div className="bg-[#0c0828] border border-indigo-950/80 rounded-2xl p-3.5 text-left font-mono">
              <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-2 font-bold">
                <span>TERMINAL REPL STDOUT</span>
                <span className="text-purple-400">EXEC TIME: 14ms</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-normal">
                📊 Processing homework statistics for: Alex Mercer<br/>
                🏆 XP Awarded: 1140 coins.<br/>
                <span className="text-emerald-400 font-bold">Process completed with exit status 0 (PID: 28)</span>
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Programming Languages Grid Support Section */}
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <span className="text-[10px] font-mono tracking-wider font-bold text-purple-400 uppercase">UNIFIED ENVIRONMENTS</span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">Choose Your Weapon. Sandbox Supported Stacks</h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
            Every sandbox supports clean compilation tags, real-time code persistence, and automatic formatting layouts. Tap any card below to launch!
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-4 pt-6">
          {supportedLanguages.map((lang) => (
            <div
              key={lang.id}
              onClick={() => onLaunchWorkspace(lang.id)}
              className={`${lang.bg} ${lang.border} border p-4 rounded-2xl transition-all cursor-pointer hover:border-purple-600/50 hover:scale-105 active:scale-95 flex flex-col justify-between text-left h-36 group`}
            >
              <div>
                <span className={`block font-mono text-xs font-bold opacity-45 uppercase text-slate-500`}>{lang.ext}</span>
                <h4 className="font-display font-bold text-white text-sm mt-1">{lang.name}</h4>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-purple-300 font-mono font-bold group-hover:text-white transition-colors">Launch IDE</span>
                <span className="text-[#a855f7] font-sans font-black">&rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Feature List with Clean Grid Icons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        {platformFeatures.map((feat, i) => (
          <div key={i} className="bg-[#08051e] border border-indigo-950/80 p-6 rounded-3xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#0e0a30] border border-indigo-950 flex items-center justify-center">
              {feat.icon}
            </div>
            <h3 className="font-display font-bold text-md text-white">{feat.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">{feat.desc}</p>
          </div>
        ))}
      </div>

      {/* Institutional Statistics banner */}
      <div className="bg-[#0c0828] border border-indigo-950 rounded-3xl p-8 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.08),rgba(0,0,0,0))] pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-mono tracking-wider font-bold text-emerald-400 uppercase">Trusted Sandbox Isolation</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white">Engineered For Educational Success</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
              Hundreds of programming departments use Vertex to teach syntax and algorithms. The isolated sandbox prevents rogue commands, handles continuous memory ledgers, and generates customized grade cards for students seamlessly of size.
            </p>
          </div>

          <div className="lg:col-span-4 flex justify-end">
            <button
              onClick={() => onOpenAuth(true)}
              className="px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-bold font-mono shadow-md inline-flex items-center gap-2 cursor-pointer active:scale-95 transition-all w-full lg:w-auto justify-center"
            >
              <span>CREATE ACCOUNT INSTANTLY</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
