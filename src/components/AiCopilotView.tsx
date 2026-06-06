/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Brain, HelpCircle, Code, ListFilter, ArrowRight, CheckCircle, Flame } from 'lucide-react';
import { PageId } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
  time: string;
}

interface AiCopilotViewProps {
  htmlCode: string;
  setHtmlCode: (val: string) => void;
  cssCode: string;
  setCssCode: (val: string) => void;
  jsCode: string;
  setJsCode: (val: string) => void;
  triggerToastNotification: (msg: string) => void;
  runCompilerCompilation: () => void;
}

export default function AiCopilotView({
  htmlCode,
  setHtmlCode,
  cssCode,
  setCssCode,
  jsCode,
  setJsCode,
  triggerToastNotification,
  runCompilerCompilation
}: AiCopilotViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hello! I am your Resident Gemini AI Coding Copilot. Ask me to write, optimize, or troubleshoot codes for you! For example, say: *\"Write an interactive task manager widget\"* or *\"Animate a glowing heart using CSS keyframes\"*.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect on new messages
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  // Sends chat instruction to server endpoint
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isGenerating) return;

    const userMsg = inputText;
    setInputText('');
    
    // Add user message to log
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, {
      role: 'user',
      text: userMsg,
      time: timestamp
    }]);

    setIsGenerating(true);

    try {
      const response = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsg,
          html: htmlCode,
          css: cssCode,
          js: jsCode,
          activeTab: 'index.html'
        })
      });

      const data = await response.json();
      
      if (data.error) {
        setMessages(prev => [...prev, {
          role: 'model',
          text: `Error calling AI Helper: ${data.error}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'model',
          text: data.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        triggerToastNotification("Gemini code proposal compiled!");
      }

    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: 'model',
        text: `Network or runtime block occurred: ${err.message || err}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Regular expression helpers to extract code blocks inside response markdown string
  const getExtractedBlock = (text: string, lang: 'html' | 'css' | 'javascript' | 'js') => {
    const aliases = lang === 'js' ? '(javascript|js)' : lang;
    const regex = new RegExp(`\`\`\`${aliases}\\n([\\s\\S]*?)\`\`\``, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : null;
  };

  const handleApplySnippet = (snippet: string, targetType: 'html' | 'css' | 'js') => {
    if (targetType === 'html') {
      setHtmlCode(snippet);
    } else if (targetType === 'css') {
      setCssCode(snippet);
    } else if (targetType === 'js') {
      setJsCode(snippet);
    }
    
    // Automatically trigger rebuild and post toast
    setTimeout(() => {
      runCompilerCompilation();
      triggerToastNotification(`Magic Integration: Applied suggested ${targetType.toUpperCase()}!`);
    }, 100);
  };

  // Quick suggestions trigger clicker helper
  const handleQuickPromptClick = (topic: string) => {
    setInputText(topic);
    triggerToastNotification("Prompt loaded! Press Send button.");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch max-w-6xl mx-auto" id="ai_copilot_center">
      
      {/* Messages Column Panel */}
      <div className="lg:col-span-8 flex flex-col bg-[#08051e] border border-indigo-950/80 rounded-3xl overflow-hidden min-h-[520px] h-[580px] relative">
        
        {/* Sub-Header */}
        <div className="bg-[#0b0825] border-b border-indigo-950/60 p-4 flex items-center justify-between text-left">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <div>
              <h4 className="text-xs font-semibold text-white">Gemini Resident Doctor Core</h4>
              <span className="text-[9px] text-[#00df9a] font-mono tracking-widest uppercase font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span>Model: gemini-3.5-flash</span>
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setMessages([
                {
                  role: 'model',
                  text: "System refreshed! I am ready for new coding instructions.",
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              ]);
              triggerToastNotification("Conversation logs cleared.");
            }}
            className="text-[9.5px] font-mono text-zinc-500 hover:text-white border border-indigo-950 px-2 py-1 rounded"
          >
            Reset Chat
          </button>
        </div>

        {/* Scroll Box Messages */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 text-left"
        >
          {messages.map((msg, i) => {
            const isAI = msg.role === 'model';
            
            // Check if this AI reply has actual blocks inside it so we render injection pills
            const parsedHtml = isAI ? getExtractedBlock(msg.text, 'html') : null;
            const parsedCss = isAI ? getExtractedBlock(msg.text, 'css') : null;
            const parsedJs = isAI ? getExtractedBlock(msg.text, 'js') : null;
            const hasInteractives = parsedHtml || parsedCss || parsedJs;

            return (
              <div key={i} className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}>
                <div className={`max-w-[85%] rounded-2xl p-4 font-sans text-xs leading-relaxed border ${
                  isAI 
                    ? 'bg-[#100c30] text-gray-200 border-indigo-950/40 rounded-tl-none' 
                    : 'bg-purple-900/40 text-purple-100 border-purple-500/10 rounded-tr-none'
                }`}>
                  <div className="font-semibold text-[9px] uppercase font-mono tracking-wide text-purple-400/80 mb-1 selection:bg-transparent">
                    {isAI ? 'Gemini AI Doctor' : 'Student Proposer'}
                  </div>
                  <div className="whitespace-pre-wrap select-text selection:bg-[#7c3aed]/30">
                    {msg.text}
                  </div>
                  <div className="text-[8.5px] text-zinc-500 mt-2 text-right selection:bg-transparent">
                    {msg.time}
                  </div>
                </div>

                {/* Injection Actions helper panels */}
                {isAI && hasInteractives && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[85%] bg-[#050315] border border-indigo-950/80 p-2.5 rounded-xl text-[10px] text-gray-500 font-mono">
                    <span className="text-[#a855f7] font-bold py-1 px-1 shrink-0">🪄 MAGIC MERGES:</span>
                    
                    {parsedHtml && (
                      <button
                        onClick={() => handleApplySnippet(parsedHtml, 'html')}
                        className="bg-purple-950/80 hover:bg-purple-900 border border-purple-500/30 text-purple-300 font-bold px-2.5 py-1 rounded-lg shrink-0 cursor-pointer active:scale-95 transition-all flex items-center space-x-1"
                        title="Rewrite index.html automatically with the AI's version"
                      >
                        <Code className="w-3.5 h-3.5 text-[#f97316]" />
                        <span>Inject HTML</span>
                      </button>
                    )}

                    {parsedCss && (
                      <button
                        onClick={() => handleApplySnippet(parsedCss, 'css')}
                        className="bg-purple-950/80 hover:bg-purple-900 border border-purple-500/30 text-purple-300 font-bold px-2.5 py-1 rounded-lg shrink-0 cursor-pointer active:scale-95 transition-all flex items-center space-x-1"
                        title="Overwrite styles.css automatically with this CSS code"
                      >
                        <Code className="w-3.5 h-3.5 text-[#3b82f6]" />
                        <span>Inject CSS</span>
                      </button>
                    )}

                    {parsedJs && (
                      <button
                        onClick={() => handleApplySnippet(parsedJs, 'js')}
                        className="bg-purple-950/80 hover:bg-purple-900 border border-purple-500/30 text-purple-300 font-bold px-2.5 py-1 rounded-lg shrink-0 cursor-pointer active:scale-95 transition-all flex items-center space-x-1"
                        title="Integrate the javascript code to main.js automatically"
                      >
                        <Code className="w-3.5 h-3.5 text-[#eab308]" />
                        <span>Inject JS</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {isGenerating && (
            <div className="flex items-start">
              <div className="bg-[#100c30] text-gray-400 border border-indigo-950/40 rounded-2xl rounded-tl-none p-4 font-sans text-xs max-w-[85%] flex items-center space-x-2.5">
                <Brain className="w-4 h-4 text-purple-400 animate-pulse shrink-0" />
                <span className="animate-pulse">Thinking, composing scripts files, and checking compiling bounds...</span>
              </div>
            </div>
          )}

        </div>

        {/* Form Sender */}
        <form 
          onSubmit={handleSendChat}
          className="bg-[#0b0825] border-t border-indigo-950/80 p-4 flex gap-3.5"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isGenerating}
            placeholder="Instruct Gemini (e.g. 'Add high-tech cyber clock'...)"
            className="flex-1 bg-[#040212] border border-indigo-950 focus:border-[#7c3aed] text-slate-100 placeholder-zinc-600 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-0 transition-all font-sans"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isGenerating}
            className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-bold font-mono shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95 transition-all hover:shadow-purple-500/10 hover:from-purple-500 hover:to-indigo-500"
          >
            <span>SEND</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>

      {/* Recommended tasks (Left list column) */}
      <div className="lg:col-span-4 flex flex-col space-y-4">
        
        {/* Help prompt ideas */}
        <div className="bg-[#08051e] border border-indigo-950/80 rounded-3xl p-5 text-left space-y-4 flex-1">
          <div className="flex items-center space-x-2">
            <Flame className="w-4.5 h-4.5 text-[#F59E0B]" />
            <span className="text-[10px] font-mono tracking-wider font-bold text-slate-300 uppercase">Recommended Sandbox Ideas</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Click any educational prompt card below to auto-load it instantly into your input. Instruct Gemini to build these widgets!
          </p>

          <div className="space-y-3.5 pt-1">
            <button
              onClick={() => handleQuickPromptClick("Create an interactive custom feedback form with beautiful stars ranking, name inputs, and error alerts when empty.")}
              className="w-full text-left bg-[#0c0828] hover:bg-[#110c36] border border-indigo-950 hover:border-purple-900/40 p-3 rounded-xl transition-all cursor-pointer group space-y-1 block"
            >
              <h5 className="text-[11px] font-bold text-white group-hover:text-purple-300 transition-colors">1. Responsive Rating Widget</h5>
              <p className="text-[10px] text-gray-500 leading-normal font-sans">Generates interactive custom reviews forms with CSS animations.</p>
            </button>

            <button
              onClick={() => handleQuickPromptClick("Please create a retro neon digital clock displaying current hours, minutes, and seconds dynamically. Style with high-contrast glowing numbers.")}
              className="w-full text-left bg-[#0c0828] hover:bg-[#110c36] border border-indigo-950 hover:border-purple-900/40 p-3 rounded-xl transition-all cursor-pointer group space-y-1 block"
            >
              <h5 className="text-[11px] font-bold text-white group-hover:text-purple-300 transition-colors">2. Neon Digital Watch</h5>
              <p className="text-[10px] text-gray-500 leading-normal font-sans">Creates retro-glowing high density matrix timers using active JS streams.</p>
            </button>

            <button
              onClick={() => handleQuickPromptClick("Build a fully cohesive student quiz game asking 3 simple science multiple choice questions, registering immediate correct answers alerts, and showing a final score card.")}
              className="w-full text-left bg-[#0c0828] hover:bg-[#110c36] border border-indigo-950 hover:border-purple-900/40 p-3 rounded-xl transition-all cursor-pointer group space-y-1 block"
            >
              <h5 className="text-[11px] font-bold text-white group-hover:text-purple-300 transition-colors">3. Academic MCQs Quiz</h5>
              <p className="text-[10px] text-gray-500 leading-normal font-sans">Compiles complete dynamic trivia layouts to evaluate JS key objects.</p>
            </button>
          </div>
        </div>

        {/* Info panel */}
        <div className="bg-[#050315] border border-indigo-950/60 p-4 rounded-3xl text-left flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <p className="text-[10.5px] text-gray-500 leading-relaxed font-sans font-light">
            Gemini reads the exact current draft residing in your workspace code areas so it knows how to extend it correctly without breaking existing assets.
          </p>
        </div>

      </div>

    </div>
  );
}
