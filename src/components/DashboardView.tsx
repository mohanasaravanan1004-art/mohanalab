/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FolderGit2, 
  BarChart4, 
  Plus, 
  Clock, 
  Bell, 
  BookMarked, 
  Settings, 
  Play, 
  Compass, 
  Code2, 
  Activity, 
  CheckCircle,
  TrendingUp,
  Award
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { CompilerProject, UserProfile } from '../types';

interface DashboardViewProps {
  user: UserProfile;
  projects: CompilerProject[];
  onCreateNewProject: (title: string, language: string) => void;
  onSelectProject: (proj: CompilerProject) => void;
  onNavigateToPage: (page: any) => void;
  triggerToastNotification: (msg: string) => void;
}

export default function DashboardView({
  user,
  projects,
  onCreateNewProject,
  onSelectProject,
  onNavigateToPage,
  triggerToastNotification
}: DashboardViewProps) {
  
  // Create project overlay modal trigger
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLang, setNewLang] = useState('python');

  // Static timeline activity data for Recharts area graph
  const timelineActivityData = [
    { day: "May 28", builds: 3 },
    { day: "May 29", builds: 6 },
    { day: "May 30", builds: 1 },
    { day: "May 31", builds: 12 },
    { day: "Jun 01", builds: 8 },
    { day: "Jun 02", builds: 15 },
    { day: "Jun 03", builds: 4 },
    { day: "Jun 04", builds: 18 },
    { day: "Jun 05", builds: 22 },
    { day: "Jun 06", builds: 29 }
  ];

  // Static classroom announcements data
  const schoolNotifications = [
    {
      id: "1",
      topic: "System Status Alert",
      text: "Vertex Online Compiler successfully updated to GCC-14 compiler environments.",
      time: "20 minutes ago",
      badge: "PLATFORM"
    },
    {
      id: "2",
      topic: "New Challenge Released",
      text: "Professor Charles posted assignment #4: 'Reverse a Linked List in C++'. Due Date: June 12.",
      time: "2 hours ago",
      badge: "GRADES"
    },
    {
      id: "3",
      topic: "Submissions Accepted",
      text: "Your Python Binary Search challenge has been reviewed and graded. Received +100 XP.",
      time: "Yesterday",
      badge: "EVALUATION"
    }
  ];

  // Static Assignments tracker states
  const assignmentChecklist = [
    { name: "Reverse String Recursively", lang: "python", status: "completed", deadline: "Pass" },
    { name: "Static Node Pointer Map", lang: "cpp", status: "completed", deadline: "Pass" },
    { name: "JVM Heap Simulator Allocation", lang: "java", status: "pending", deadline: "June 09" },
    { name: "Primary Tables Index Query", lang: "sql", status: "completed", deadline: "Pass" }
  ];

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      triggerToastNotification("Please state a project name.");
      return;
    }
    onCreateNewProject(newTitle.trim(), newLang);
    setNewTitle('');
    setShowCreateModal(false);
    triggerToastNotification(`Created ${newLang.toUpperCase()} project: "${newTitle}"!`);
  };

  return (
    <div className="space-y-8 text-left" id="student_dashboard_viewport">
      
      {/* Title bar greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-indigo-950/40 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">Student Core Operations</h2>
          <p className="text-xs text-gray-400">
            Monitor compilation runcharts, load dynamic blueprints, and launch secure coding structures.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold font-mono tracking-wide shadow-md hover:shadow-purple-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>NEW DEVELOPMENT PLAYGROUND</span>
        </button>
      </div>



      {/* Grid: Stats Widgets row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#08051e] border border-indigo-950/80 rounded-2xl p-4.5 relative overflow-hidden">
          <div className="absolute top-1 right-2 opacity-5 text-indigo-400 font-sans font-black text-6xl select-none uppercase">01</div>
          <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-slate-500">Workspace Blueprints</span>
          <p className="text-xl font-extrabold text-white font-mono mt-1">{projects.length}</p>
          <div className="text-[9.5px] text-gray-500 font-mono mt-2.5 flex items-center gap-1">
            <FolderGit2 className="w-3 h-3 text-purple-400" />
            <span>Active project codes in Local Cache</span>
          </div>
        </div>

        <div className="bg-[#08051e] border border-indigo-950/80 rounded-2xl p-4.5 relative overflow-hidden">
          <div className="absolute top-1 right-2 opacity-5 text-emerald-400 font-sans font-black text-6xl select-none uppercase">02</div>
          <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-slate-500">XP Loyalty Coins</span>
          <p className="text-xl font-extrabold text-yellow-500 font-mono mt-1">{user.xpCoins} pts</p>
          <div className="text-[9.5px] text-[#00df9a] font-mono mt-2.5 flex items-center gap-1">
            <Award className="w-3 h-3 text-[#00df9a]" />
            <span>Accumulated through tests Solved</span>
          </div>
        </div>

        <div className="bg-[#08051e] border border-indigo-950/80 rounded-2xl p-4.5 relative overflow-hidden">
          <div className="absolute top-1 right-2 opacity-5 text-purple-400 font-sans font-black text-6xl select-none uppercase">03</div>
          <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-slate-500">Grading Progress</span>
          <p className="text-xl font-extrabold text-white font-mono mt-1">75%</p>
          <div className="text-[9.5px] text-gray-505 font-mono mt-2.5 flex items-center gap-1.5 w-full">
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div className="bg-purple-500 h-full w-3/4 rounded-full" />
            </div>
          </div>
        </div>

        <div className="bg-[#08051e] border border-indigo-950/80 rounded-2xl p-4.5 relative overflow-hidden">
          <div className="absolute top-1 right-2 opacity-5 text-teal-400 font-sans font-black text-6xl select-none uppercase">04</div>
          <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-slate-500">Current Rank State</span>
          <p className="text-xl font-extrabold text-teal-400 font-mono mt-1">GPA {user.grade}</p>
          <div className="text-[9.5px] text-gray-500 font-mono mt-2.5 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-teal-400" />
            <span>High-grade benchmark certified</span>
          </div>
        </div>

      </div>

      {/* Grid: Graph and recent work list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Recharts chart box (Col 8) */}
        <div className="lg:col-span-8 bg-[#08051e] border border-indigo-950/85 rounded-3xl p-5 flex flex-col justify-between h-[360px]">
          <div className="flex items-center justify-between border-b border-indigo-950/40 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <span className="text-[10px] font-mono tracking-wider font-bold text-slate-300 uppercase">Daily Compilation Activity Stream</span>
            </div>
            <span className="text-[9px] text-[#00df9a] bg-emerald-950/40 px-2 py-0.5 rounded font-mono font-bold">LIVE METRICS</span>
          </div>

          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineActivityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBuilds" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#0e0a30" vertical={false} />
                <XAxis dataKey="day" stroke="#52525b" fontSize={9} tickLine={false} />
                <YAxis stroke="#52525b" fontSize={9} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#08051e', borderColor: '#1e1b4b', borderRadius: '12px' }} 
                  labelStyle={{ color: '#9ca3af', fontFamily: 'monospace', fontSize: '10px' }} 
                  itemStyle={{ color: '#c084fc', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="builds" stroke="#a78bfa" strokeWidth={2} fillOpacity={1} fill="url(#colorBuilds)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* School Notifications panel (Col 4) */}
        <div className="lg:col-span-4 bg-[#08051e] border border-indigo-950/85 rounded-3xl p-5 flex flex-col h-[360px]">
          <div className="flex items-center space-x-2 border-b border-indigo-950/40 pb-3 mb-4 shrink-0">
            <Bell className="w-4 h-4 text-yellow-400" />
            <span className="text-[10px] font-mono tracking-wider font-bold text-slate-300 uppercase">Institutional Notice Board</span>
          </div>

          {/* Scrolling items wrapper */}
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
            {schoolNotifications.map((note) => (
              <div 
                key={note.id} 
                className="bg-[#050315] border border-indigo-950 p-3 rounded-xl space-y-1.5 text-left text-xs leading-relaxed"
              >
                <div className="flex justify-between items-center text-[8.5px] font-mono">
                  <span className="text-purple-400 font-bold bg-purple-950/40 px-1.5 py-0.5 rounded tracking-wide">{note.badge}</span>
                  <span className="text-zinc-500">{note.time}</span>
                </div>
                <h5 className="font-bold text-white leading-normal">{note.topic}</h5>
                <p className="text-[10px] text-gray-500 leading-normal">{note.text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Grid: Recent project lists and Assignments Progress table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Recent workspace projects directory maps */}
        <div className="lg:col-span-6 bg-[#08051e] border border-indigo-950/85 rounded-3xl p-5 flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="flex items-center space-x-2 border-b border-indigo-950/40 pb-3 mb-4">
              <FolderGit2 className="w-4 h-4 text-purple-400" />
              <span className="text-[10px] font-mono tracking-wider font-bold text-slate-300 uppercase">My Compiler Directory Tree</span>
            </div>

            {projects.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 space-y-2 font-mono text-xs">
                <Compass className="w-8 h-8 text-indigo-950 mx-auto animate-bounce" />
                <p>No active project repositories discovered inside browser memory sandbox.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {projects.slice(0, 3).map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => onSelectProject(proj)}
                    className="flex items-center justify-between bg-[#050315] hover:bg-[#0c0828] border border-indigo-950 px-4 py-3 rounded-xl cursor-pointer transition-all hover:scale-[1.01]"
                  >
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white hover:text-purple-300 transition-colors">{proj.title}</h4>
                      <p className="text-[9.5px] text-zinc-500 font-mono">Modified: {proj.updatedAt} • Files: {proj.files.length}</p>
                    </div>
                    <span className="text-[10.5px] bg-[#0c0825] border border-indigo-900/60 font-mono font-semibold px-2 py-1 rounded text-purple-400 uppercase">
                      {proj.language}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigateToPage('workspace')}
            className="w-full text-center py-2 bg-[#0c0a2a] text-[10.5px] text-purple-400 font-mono hover:text-white hover:bg-purple-950/20 rounded-xl transition-all border border-indigo-950/50 mt-4 block"
          >
            Launch Core VS Code Simulator &rarr;
          </button>
        </div>

        {/* Assignments Progress trackers lists */}
        <div className="lg:col-span-6 bg-[#08051e] border border-indigo-950/85 rounded-3xl p-5 flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="flex items-center space-x-2 border-b border-indigo-950/40 pb-3 mb-4">
              <BookMarked className="w-4 h-4 text-purple-400" />
              <span className="text-[10px] font-mono tracking-wider font-bold text-slate-300 uppercase">Curriculum Homework Status</span>
            </div>

            <div className="space-y-2">
              {assignmentChecklist.map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-[#050315] border border-indigo-950 p-3 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5 text-left">
                    <span className="text-[8.5px] font-mono text-indigo-400 font-bold uppercase">{item.lang} assignment</span>
                    <h5 className="font-bold text-white">{item.name}</h5>
                  </div>
                  <div className="flex items-center space-x-4">
                    {item.status === 'completed' ? (
                      <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/55 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>PASSED</span>
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-950/55 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span>DUE: {item.deadline}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateToPage('blueprints')}
            className="w-full text-center py-2 bg-[#0c0a2a] text-[10.5px] text-purple-400 font-mono hover:text-white hover:bg-purple-950/20 rounded-xl transition-all border border-indigo-950/50 mt-4 block"
          >
            Review Grading Submissions Panel &rarr;
          </button>
        </div>

      </div>

      {/* CREATE PROJECT MODAL SYSTEM OVERLAY */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#08051e] border border-indigo-950 rounded-3xl p-6 max-w-md w-full text-left space-y-6">
            
            <div className="space-y-1">
              <h4 className="text-md font-bold font-display text-white">Create Developer Playground Sandbox</h4>
              <p className="text-[11px] text-zinc-500">Pick the backend stack environment you want to mock interpret instantly.</p>
            </div>

            <form onSubmit={handleCreateProjectSubmit} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Playground Title Name</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Binary Tree BFS"
                  className="w-full bg-[#040212] border border-indigo-950 focus:border-[#7c3aed] text-white rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Target Compiling Language Environment</label>
                <select
                  value={newLang}
                  onChange={(e) => setNewLang(e.target.value)}
                  className="w-full bg-[#040212] border border-indigo-950 focus:border-[#7c3aed] text-[#8b5cf6] font-bold rounded-xl px-3 py-2 text-xs outline-none cursor-pointer"
                >
                  <option value="python">Python 3 (Executable)</option>
                  <option value="cpp">C++ (GCC Gnu compiler)</option>
                  <option value="c">C (Static Binary linker)</option>
                  <option value="java">Java (OpenJDK classes)</option>
                  <option value="javascript">JavaScript (Runtime node)</option>
                  <option value="html">HTML/CSS/JS (Standard Markup)</option>
                  <option value="php">PHP 8.3 (Interactive CLI)</option>
                  <option value="sql">SQL (In-Memory SQLite query)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3.5 pt-4 border-t border-indigo-950/30 font-mono">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="text-[10px] font-bold text-gray-500 hover:text-white"
                >
                  ABORT
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-[10px] font-bold transition-all active:scale-95"
                >
                  COMMENCE PLAYGROUND
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
