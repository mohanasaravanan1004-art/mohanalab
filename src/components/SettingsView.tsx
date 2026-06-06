/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Settings, Shield, RefreshCw, Trash2, Sliders, Info, Cpu, Check, Github } from 'lucide-react';
import { PageId } from '../types';

interface SettingsViewProps {
  useTailwind: boolean;
  setUseTailwind: (val: boolean) => void;
  viewportMode: 'desktop' | 'tablet' | 'mobile';
  setViewportMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  fontPreference: 'mono' | 'sans' | 'display';
  setFontPreference: (preference: 'mono' | 'sans' | 'display') => void;
  onClearWorkspace: () => void;
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  triggerToastNotification: (msg: string) => void;
}

export default function SettingsView({
  useTailwind,
  setUseTailwind,
  viewportMode,
  setViewportMode,
  fontPreference,
  setFontPreference,
  onClearWorkspace,
  htmlCode,
  cssCode,
  jsCode,
  triggerToastNotification
}: SettingsViewProps) {
  
  const htmlLines = htmlCode.split('\n').length;
  const cssLines = cssCode.split('\n').length;
  const jsLines = jsCode.split('\n').length;
  const totalCharacters = htmlCode.length + cssCode.length + jsCode.length;

  const handleManualReset = () => {
    if (confirm("Are you sure you want to completely erase your current active draft? This cannot be undone.")) {
      onClearWorkspace();
      triggerToastNotification("Workspace cleared and reset to default template.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-left space-y-6" id="settings_container">
      
      {/* Visual top banner */}
      <div className="bg-[#08051e] border border-indigo-950 p-6 rounded-3xl flex items-center space-x-4">
        <div className="w-12 h-12 bg-purple-950/60 rounded-2xl border border-purple-800/20 flex items-center justify-center text-purple-400 shrink-0 shadow-lg shadow-purple-500/5">
          <Settings className="w-6 h-6 animate-spin-slow" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-lg text-white">Interactive Compiler Environment Settings</h3>
          <p className="text-xs text-gray-400 font-sans leading-normal">
            Configure live CDN configurations, default display fonts, layout properties, and reset thread allocations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Editor controls card */}
        <div className="bg-[#08051e] border border-indigo-950/80 rounded-3xl p-5 space-y-5">
          <div className="flex items-center space-x-2 border-b border-indigo-950/40 pb-3">
            <Sliders className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] font-mono tracking-wider font-bold text-slate-300 uppercase">Preferences Controls</span>
          </div>

          {/* Toggle Tailwind */}
          <div className="flex items-center justify-between">
            <div className="space-y-1 pr-4">
              <h5 className="text-xs font-bold text-white">Full-Sized Tailwind CSS Loader</h5>
              <p className="text-[10px] text-gray-500">Injects Tailwind play version 4.1 script tags straight into the compiled DOM.</p>
            </div>
            <button
              onClick={() => {
                setUseTailwind(!useTailwind);
                triggerToastNotification(useTailwind ? "Deactivated Tailwind CDN" : "Tailwind CSS CDN loaded into Sandbox!");
              }}
              className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${useTailwind ? 'bg-purple-600' : 'bg-[#0f0b2f] border border-indigo-950'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${useTailwind ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Font selection */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold text-white">Editor Display Font</h5>
            <p className="text-[10px] text-gray-500">Alter structural typing interfaces to suit your coding style.</p>
            
            <div className="grid grid-cols-3 gap-2 bg-[#050315] p-1 rounded-xl border border-indigo-950/60">
              {['mono', 'sans', 'display'].map((pref) => (
                <button
                  key={pref}
                  onClick={() => {
                    setFontPreference(pref as 'mono' | 'sans' | 'display');
                    triggerToastNotification(`Swapped typeface to ${pref.toUpperCase()}`);
                  }}
                  className={`text-[10px] px-3 py-2 rounded-lg font-mono font-medium transition-all cursor-pointer ${
                    fontPreference === pref 
                      ? 'bg-purple-950/80 text-purple-200 border border-purple-900/40 font-bold' 
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {pref.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Sizing */}
          <div className="space-y-2 text-xs">
            <h5 className="text-xs font-bold text-white">Default Render Mode</h5>
            <div className="flex gap-2">
              {['desktop', 'tablet', 'mobile'].map((viewport) => (
                <button
                  key={viewport}
                  onClick={() => {
                    setViewportMode(viewport as 'desktop' | 'tablet' | 'mobile');
                    triggerToastNotification(`Sandbox view toggled to ${viewport.toUpperCase()}`);
                  }}
                  className={`flex-1 text-[10px] font-mono py-1.5 border rounded-lg transition-all cursor-pointer ${
                    viewportMode === viewport 
                      ? 'bg-purple-950/60 text-purple-200 border-purple-500/40' 
                      : 'bg-transparent text-gray-500 border-indigo-950 hover:text-white'
                  }`}
                >
                  {viewport.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Workspace Diagnostics */}
        <div className="bg-[#08051e] border border-indigo-950/80 rounded-3xl p-5 space-y-4 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center space-x-2 border-b border-indigo-950/40 pb-3 mb-4">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span className="text-[10px] font-mono tracking-wider font-bold text-slate-300 uppercase">Sandbox Workspace Stats</span>
            </div>

            <div className="space-y-3 font-mono text-[11px] text-gray-300">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>HTML Code Weight</span>
                <span className="text-amber-500 font-bold">{htmlLines} lines</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>CSS Code Weight</span>
                <span className="text-indigo-400 font-bold">{cssLines} lines</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>JS Scripts Code Weight</span>
                <span className="text-amber-400 font-bold">{jsLines} lines</span>
              </div>
              <div className="flex justify-between">
                <span>Total Accumulated Bytes</span>
                <span className="text-[#00df9a] font-bold">{totalCharacters} characters</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-indigo-900/10">
            <button
              onClick={handleManualReset}
              className="w-full bg-red-950/50 text-red-200 border border-red-900/30 hover:bg-red-950 hover:text-white px-4 py-3 rounded-2xl text-xs font-mono font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hard reset Workspace codes</span>
            </button>
          </div>

        </div>

      </div>

      <div className="bg-[#050315] border border-indigo-950/60 p-4 rounded-3xl text-left flex items-start space-x-3 max-w-2xl leading-relaxed text-[11px] text-gray-500">
        <Info className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
        <p>
          The Sandbox acts as a pure client-side iframe thread. All operations, custom console logs, and event listeners execute inside your browser containment pool under strict iframe isolation policies.
        </p>
      </div>

    </div>
  );
}
