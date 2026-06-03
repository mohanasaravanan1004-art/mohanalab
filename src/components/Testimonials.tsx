/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Star } from 'lucide-react';
import { CLIENT_TESTIMONIALS } from '../data';

export default function Testimonials() {
  return (
    <section className="relative py-20 px-4 md:px-8 bg-transparent overflow-hidden">
      {/* Lights */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full glow-spot-2 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10 font-sans">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-block bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            <span className="font-mono text-[9px] tracking-widest text-[#7C3AED] font-semibold uppercase">
              STUDIO COHORTS
            </span>
          </div>
          <h2 className="font-display font-medium text-3xl text-white tracking-tight leading-tight">
            Endorsed by Top-Tier <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-100 to-amber-300">
              SaaS Founders and VPs
            </span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            We prioritize visual craft and sub-millisecond database rendering. Read how our clients measure success.
          </p>
        </div>

        {/* Critique Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CLIENT_TESTIMONIALS.map((test) => (
            <div
              key={test.id}
              className="glass-panel border-white/10 rounded-2xl p-6 flex flex-col justify-between glass-panel-hover bg-white/5 backdrop-blur-xl"
            >
              <div className="space-y-4">
                {/* Visual rating stars */}
                <div className="flex items-center space-x-1 text-amber-400">
                  {Array.from({ length: test.rating }).map((_, index) => (
                    <Star key={index} className="w-4 h-4 fill-current shrink-0" />
                  ))}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans italic min-h-[96px] font-light">
                  "{test.content}"
                </p>
              </div>

              {/* Bio Columns */}
              <div className="mt-8 pt-4 border-t border-white/10 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#2D2962]/40 border border-white/10 flex items-center justify-center overflow-hidden">
                  <span className="font-display font-bold text-xs text-white uppercase">{test.name.charAt(0)}</span>
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs text-white leading-tight">
                    {test.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {test.role} • <span className="text-[#7C3AED]">{test.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
