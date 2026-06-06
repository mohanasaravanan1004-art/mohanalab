/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Cpu, 
  Activity, 
  Settings, 
  Award, 
  Terminal, 
  FolderSync, 
  BookOpen, 
  Plus, 
  CheckCircle,
  Database
} from 'lucide-react';
import { ManagedStudent, ProgrammingLanguage } from '../types';

interface AdminViewProps {
  students: ManagedStudent[];
  onAwardXP: (studentId: string, amount: number) => void;
  onPostNewTask: (title: string, language: ProgrammingLanguage) => void;
  triggerToastNotification: (msg: string) => void;
}

export default function AdminView({ 
  students, 
  onAwardXP, 
  onPostNewTask, 
  triggerToastNotification 
}: AdminViewProps) {
  
  // States to add new manual academic task
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskLang, setTaskLang] = useState<ProgrammingLanguage>('python');

  const handlePostTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      triggerToastNotification("Please formulate a valid task header.");
      return;
    }
    onPostNewTask(taskTitle.trim(), taskLang);
    setTaskTitle('');
    setShowTaskForm(false);
    triggerToastNotification(`Broadcasted challenge task: "${taskTitle}" for language ${taskLang.toUpperCase()}`);
  };

  const handleTriggerReboot = () => {
    triggerToastNotification("Dispatched standard reboot calls to isolated sandbox containers.");
  };

  return (
    <div className="space-y-8 text-left animate-fade-in" id="vertex_admin_core">
      
      {/* Title bar greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-indigo-950/40 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <span className="text-[10px] font-mono tracking-widest text-red-450 font-bold uppercase select-none">ADMINISTRATIVE SECURITY OVERVIEW</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">Vertex Faculty Ledger</h2>
          <p className="text-xs text-gray-400">
            Audit student compilations metrics, configure course challenges, and manage security sandbox quotas.
          </p>
        </div>

        <button
          onClick={() => setShowTaskForm(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-red-650 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold font-mono tracking-wide shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>BROADCAST GRADED ASSIGNMENT</span>
        </button>
      </div>

      {/* Grid: Server statistics row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#08051e] border border-indigo-950/80 rounded-2xl p-4.5 text-left relative overflow-hidden">
          <span className="text-[9.5px] uppercase tracking-wider font-mono font-bold text-slate-500">Allocated Containers</span>
          <p className="text-xl font-extrabold text-white font-mono mt-1">1,024 Nodes</p>
          <div className="text-[9.5px] text-emerald-400 font-mono mt-2.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span>Running status: 100% online</span>
          </div>
        </div>

        <div className="bg-[#08051e] border border-indigo-950/80 rounded-2xl p-4.5 text-left relative overflow-hidden">
          <span className="text-[9.5px] uppercase tracking-wider font-mono font-bold text-slate-500">Compiler Load</span>
          <p className="text-xl font-bold text-red-400 font-mono mt-1">1.8% CPU</p>
          <div className="text-[9.5px] text-zinc-500 font-mono mt-2.5">
            <span>Peak queue: 2 traces/sec</span>
          </div>
        </div>

        <div className="bg-[#08051e] border border-indigo-950/80 rounded-2xl p-4.5 text-left relative overflow-hidden">
          <span className="text-[9.5px] uppercase tracking-wider font-mono font-bold text-slate-500">Active Students</span>
          <p className="text-xl font-extrabold text-white font-mono mt-1">{students.length} Accounts</p>
          <div className="text-[9.5px] text-purple-400 font-mono mt-2.5">
            <span>Matriculated &amp; graded list</span>
          </div>
        </div>

        <div className="bg-[#08051e] border border-indigo-950/80 rounded-2xl p-4.5 text-left relative overflow-hidden">
          <span className="text-[9.5px] uppercase tracking-wider font-mono font-bold text-slate-500">Average Latency</span>
          <p className="text-xl font-extrabold text-[#00df9a] font-mono mt-1">12 ms</p>
          <div className="text-[9.5px] text-[#00df9a] font-mono mt-2.5 flex items-center gap-1 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-500/10 w-fit">
            <span>SIMULATED CORE OK</span>
          </div>
        </div>

      </div>

      {/* Grid: Main administrative blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Graded Students ledger tracker (Col 8) */}
        <div className="lg:col-span-8 bg-[#08051e] border border-indigo-950/85 rounded-3xl p-5 flex flex-col justify-between min-h-[350px]">
          <div>
            <div className="flex items-center space-x-2 border-b border-indigo-950/40 pb-3 mb-4 select-none justify-between">
              <span className="text-[10px] font-mono tracking-wider font-bold text-slate-350 uppercase">Student Enrolled Rosters &amp; Grades</span>
              <span className="text-[9px] text-zinc-500 font-mono">Total: {students.length} record nodes</span>
            </div>

            <div className="space-y-3">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="bg-[#050315] hover:bg-[#0b0825] border border-indigo-950 px-4 py-3 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-white text-sm">{student.name}</h4>
                      <span className="text-[9px] text-slate-500 font-mono uppercase bg-slate-950 px-1.5 py-0.5 rounded">GPA: {student.gpa}</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-mono">{student.email} • ID: {student.id}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10.5px] font-mono text-yellow-400 font-bold bg-[#0d0725] px-2 py-1 rounded">
                      {student.challengesSolved} Solves • {student.xp} XP
                    </span>
                    
                    <button
                      onClick={() => {
                        onAwardXP(student.id, 50);
                        triggerToastNotification(`Granted +50 XP bonus to registered student: ${student.name}`);
                      }}
                      className="px-2.5 py-1.5 bg-purple-950/50 hover:bg-purple-900 border border-purple-500/20 text-purple-200 text-[10px] font-mono font-bold rounded-lg transition-all active:scale-95 cursor-pointer"
                    >
                      +50 Bonus XP
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sandbox controls panel (Col 4) */}
        <div className="lg:col-span-4 bg-[#08051e] border border-indigo-950/85 rounded-3xl p-5 flex flex-col justify-between min-h-[350px]">
          <div className="space-y-5">
            <div className="flex items-center space-x-2 border-b border-indigo-950/40 pb-3 mb-4 select-none">
              <Activity className="w-4 h-4 text-red-400" />
              <span className="text-[10px] font-mono tracking-wider font-bold text-slate-350 uppercase">Isolation Sandbox Controls</span>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-3.5 bg-[#050315] border border-indigo-950 rounded-2xl text-zinc-500 flex justify-between items-center">
                <span>Active thread quotas</span>
                <span className="text-white font-extrabold text-[10.5px]">4 instances/sec</span>
              </div>

              <div className="p-3.5 bg-[#050315] border border-indigo-950 rounded-2xl text-zinc-500 flex justify-between items-center">
                <span>Max allocation ceiling</span>
                <span className="text-[#00df9a] font-extrabold text-[10.5px]">512 MB</span>
              </div>

              <div className="p-3.5 bg-[#050315] border border-indigo-950 rounded-2xl text-zinc-500 flex justify-between items-center">
                <span>SQLite Memory Limit</span>
                <span className="text-purple-400 font-bold">UNRESTRICTED</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-indigo-950/60 font-mono text-xs">
            <button
              onClick={handleTriggerReboot}
              className="w-full text-center py-2.5 bg-red-950/20 text-red-400 font-bold hover:text-white hover:bg-red-900 rounded-xl transition-all border border-red-950/80 active:scale-95 block"
            >
              Force Reboot Active Sandbox Containers
            </button>
          </div>
        </div>

      </div>

      {/* GRADED ASSIGNMENTS PUBLISHER OVERLAY */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#08051e] border border-indigo-950 rounded-3xl p-6 max-w-md w-full space-y-6">
            
            <div className="space-y-1">
              <h4 className="text-md font-bold font-display text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-red-400" />
                <span>Publish Curriculum Task</span>
              </h4>
              <p className="text-[11px] text-zinc-500">The broadcasting logic syncs with all matriculated student profiles instantly.</p>
            </div>

            <form onSubmit={handlePostTaskSubmit} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Assignment Subject Name</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Reverse a Double Linked List"
                  className="w-full bg-[#040212] border border-indigo-950 focus:border-[#7c3aed] text-white rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Compiler Env Target</label>
                <select
                  value={taskLang}
                  onChange={(e) => setTaskLang(e.target.value as ProgrammingLanguage)}
                  className="w-full bg-[#040212] border border-indigo-950 focus:border-[#7c3aed] text-[#eab308] font-bold rounded-xl px-3 py-2 text-xs outline-none cursor-pointer"
                >
                  <option value="python">Python 3 (Script compiler)</option>
                  <option value="cpp">C++ (GCC Executable)</option>
                  <option value="c">C (Gnu assembly)</option>
                  <option value="java">Java (OpenJDK bytecodes)</option>
                  <option value="sql">SQL (In-Memory Database)</option>
                  <option value="html">HTML5/CSS Web Markup</option>
                  <option value="php">PHP 8.3 CLI</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3.5 pt-4 border-t border-indigo-950/30 font-mono">
                <button
                  type="button"
                  onClick={() => setShowTaskForm(false)}
                  className="text-[10px] font-bold text-gray-400 hover:text-white"
                >
                  ABORT
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-red-650 to-purple-650 hover:from-red-500 hover:to-purple-500 text-white rounded-xl text-[10px] font-bold transition-all active:scale-95"
                >
                  BROADCAST TASK
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
