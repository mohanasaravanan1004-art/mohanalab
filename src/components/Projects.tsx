/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Play, 
  X, 
  Plus, 
  Check, 
  Trash2, 
  DollarSign, 
  Calendar, 
  GraduationCap, 
  Users, 
  Utensils, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Brain, 
  Layout, 
  Sliders, 
  TrendingUp, 
  IceCream, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { STUDIO_PROJECTS } from '../data';
import { ProjectItem } from '../types';

// ==========================================
// STATIC/MOCK DATA ASSETS FOR SIMULATOR LOADS
// ==========================================

const INITIAL_KOB_TASKS = [
  { id: '1', title: 'Compile client wireframes', priority: 'medium', stage: 'todo' },
  { id: '2', title: 'Write production API router', priority: 'high', stage: 'progress' },
  { id: '3', title: 'Refactor chart animations', priority: 'low', stage: 'review' },
  { id: '4', title: 'Optimize static CSS load', priority: 'medium', stage: 'done' },
];

const INITIAL_FREELANCE_INVOICES = [
  { id: 'inv-1', client: 'Alpha Labs Inc', amount: 1850, status: 'paid', dueDate: '2026-06-15' },
  { id: 'inv-2', client: 'SaaS Builder Co', amount: 3200, status: 'pending', dueDate: '2026-06-28' },
  { id: 'inv-3', client: 'Apex Finance Ltd', amount: 950, status: 'overdue', dueDate: '2026-05-30' },
];

const INITIAL_RESTAURANT_TABLES = [
  { id: 1, status: 'occupied', capacity: 4, currentBill: 125, waiter: 'Rajesh' },
  { id: 2, status: 'ordered', capacity: 2, currentBill: 88, waiter: 'Ananya' },
  { id: 3, status: 'billing', capacity: 6, currentBill: 345, waiter: 'Rajesh' },
  { id: 4, status: 'vacant', capacity: 4, currentBill: 0, waiter: 'Ananya' },
  { id: 5, status: 'vacant', capacity: 2, currentBill: 0, waiter: 'David' },
  { id: 6, status: 'occupied', capacity: 8, currentBill: 210, waiter: 'David' },
];

const MOCK_RESTAURANT_ORDERS = [
  { id: 'ord-104', item: 'Truffle Tagliolini', amount: 34, status: 'preparing', time: '11:42' },
  { id: 'ord-103', item: 'Dry-aged Porterhouse', amount: 76, status: 'ready', time: '11:38' },
  { id: 'ord-102', item: 'Chardonnay Gold Label', amount: 48, status: 'served', time: '11:32' },
];

const INITIAL_FLAVORS = [
  { id: '1', name: 'Madagascar Vanilla', sales: 480, stock: 85, status: 'normal', color: '#FEF3C7' },
  { id: '2', name: 'Dark Chocolate Fudge', sales: 620, stock: 24, status: 'critical', color: '#78350F' },
  { id: '3', name: 'Alphonso Mango Seltzer', sales: 390, stock: 68, status: 'normal', color: '#F59E0B' },
  { id: '4', name: 'Sicilian Pistachio', sales: 512, stock: 15, status: 'critical', color: '#10B981' },
  { id: '5', name: 'Wild Strawberry Rose', sales: 310, stock: 92, status: 'normal', color: '#F43F5E' },
];

const MOCK_RESTAURANT_CHART = [
  { hour: '12:00', sales: 420 },
  { hour: '14:00', sales: 850 },
  { hour: '16:00', sales: 390 },
  { hour: '18:00', sales: 1240 },
  { hour: '20:00', sales: 1890 },
  { hour: '22:00', sales: 1450 },
];

export default function Projects() {
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

  // States for FreelancerOS Simulator
  const [tasks, setTasks] = useState(INITIAL_KOB_TASKS);
  const [invoices, setInvoices] = useState(INITIAL_FREELANCE_INVOICES);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [invClient, setInvClient] = useState('');
  const [invAmount, setInvAmount] = useState('');

  // States for Restaurant Analytics Simulator
  const [restTables, setRestTables] = useState(INITIAL_RESTAURANT_TABLES);
  const [restOrders, setRestOrders] = useState(MOCK_RESTAURANT_ORDERS);
  const [newOrderName, setNewOrderName] = useState('');
  const [newOrderPrice, setNewOrderPrice] = useState('');

  // States for Ice Cream Shop Simulator
  const [flavors, setFlavors] = useState(INITIAL_FLAVORS);

  // States for AI Notes Hub Simulator
  const [noteContent, setNoteContent] = useState(
    "Mohana Labs client report:\n\nOur launch database consists of 25,000 active daily profiles. Our overall order processing latency has decreased by 15 percent week-over-week. We need to schedule a final infrastructure safety audit before setting up Cloud Run containers."
  );
  const [aiOutcome, setAiOutcome] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiAnalysisType, setAiAnalysisType] = useState('');

  // ERP State parameters
  const [selectedCampus, setSelectedCampus] = useState('Central Campus');
  const [gradeInput, setGradeInput] = useState<Record<string, number>>({ math: 88, physics: 92, db: 85, ai: 95 });

  // Reset helpers
  const handleOpenSandbox = (project: ProjectItem) => {
    setActiveProject(project);
    // Restart sims
    setTasks(INITIAL_KOB_TASKS);
    setInvoices(INITIAL_FREELANCE_INVOICES);
    setRestTables(INITIAL_RESTAURANT_TABLES);
    setRestOrders(MOCK_RESTAURANT_ORDERS);
    setFlavors(INITIAL_FLAVORS);
    setAiOutcome('');
    setIsAiProcessing(false);
  };

  // -------------------------------------------------------------
  // SIMULATOR INTERACTION LOGIC
  // -------------------------------------------------------------

  // 1. FreelancerOS Actions
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    setTasks([
      ...tasks,
      {
        id: Date.now().toString(),
        title: newTaskTitle,
        priority: 'medium',
        stage: 'todo'
      }
    ]);
    setNewTaskTitle('');
  };

  const handleToggleTaskStage = (taskId: string) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        const stages: ('todo' | 'progress' | 'review' | 'done')[] = ['todo', 'progress', 'review', 'done'];
        const nextIdx = (stages.indexOf(t.stage) + 1) % stages.length;
        return { ...t, stage: stages[nextIdx] };
      }
      return t;
    }));
  };

  const handleAddInvoice = () => {
    const amtNum = parseFloat(invAmount);
    if (!invClient.trim() || isNaN(amtNum)) return;
    setInvoices([
      {
        id: 'inv-' + Date.now(),
        client: invClient,
        amount: amtNum,
        status: 'pending',
        dueDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0]
      },
      ...invoices
    ]);
    setInvClient('');
    setInvAmount('');
  };

  // 2. Restaurant Actions
  const handleTableStatusShift = (tableId: number) => {
    setRestTables(restTables.map(t => {
      if (t.id === tableId) {
        const statuses: ('vacant' | 'occupied' | 'ordered' | 'billing')[] = ['vacant', 'occupied', 'ordered', 'billing'];
        const nextIdx = (statuses.indexOf(t.status) + 1) % statuses.length;
        const bills = { vacant: 0, occupied: 45, ordered: 128, billing: 260 };
        return {
          ...t,
          status: statuses[nextIdx],
          currentBill: bills[statuses[nextIdx]]
        };
      }
      return t;
    }));
  };

  const handleAddRestOrder = () => {
    const prVal = parseFloat(newOrderPrice);
    if (!newOrderName.trim() || isNaN(prVal)) return;
    setRestOrders([
      {
        id: 'ord-' + Math.floor(Math.random() * 500),
        item: newOrderName,
        amount: prVal,
        status: 'preparing',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...restOrders
    ]);
    setNewOrderName('');
    setNewOrderPrice('');
  };

  // Computed metrics for Restaurant
  const restaurantLiveStats = () => {
    const totalActiveTables = restTables.filter(t => t.status !== 'vacant').length;
    const occupancyRate = Math.round((totalActiveTables / restTables.length) * 100);
    const activeEarnings = restTables.reduce((sum, t) => sum + t.currentBill, 0);
    return { occupancyRate, activeEarnings, activeTables: totalActiveTables };
  };

  // 3. Ice Cream Shop Actions
  const handleAdjustStock = (flavorId: string, newStock: number) => {
    setFlavors(flavors.map(f => {
      if (f.id === flavorId) {
        return {
          ...f,
          stock: newStock,
          status: newStock <= 30 ? 'critical' : 'normal'
        };
      }
      return f;
    }));
  };

  // 4. AI Notes Hub prompt processor
  const handleTriggerFauxAI = (mode: string) => {
    setIsAiProcessing(true);
    setAiAnalysisType(mode);
    setAiOutcome('');

    setTimeout(() => {
      setIsAiProcessing(false);
      let response = '';
      if (mode === 'summarize') {
        response = "### 📋 Cohort Summary \n- **Institutional Reach**: 25,000 daily academic scholarly profiles.\n- **Optimized Latency**: Average transaction/order delays reduced by 15% WoW.\n- **Critical Action Required**: Complete high-scale infrastructure security evaluations prior to cloud-container containerization.";
      } else if (mode === 'polish') {
        response = "*Mohana Labs Strategic Executive Update*\n\n\"Analytical telemetry confirms our system accommodates 25k+ active daily sessions. Furthermore, deployment optimization efforts successfully reduced endpoint rendering and transactional bottlenecks by 15% WoW. In accordance with delivery schedules, an intensive cloud-native security audit remains the immediate launch blocker.\"";
      } else if (mode === 'actions') {
        response = "### 🛠️ Generated Action Framework\n- [ ] **SEC-04**: Draft formal infrastructure check sheets.\n- [ ] **OPS-12**: Provision secondary elastic nodes in Google Cloud Run.\n- [ ] **BIO-01**: Map metric dashboards directly containing the live WoW delta logs.";
      }
      setAiOutcome(response);
    }, 1500);
  };

  // Computed academic ERP score
  const erpGPA = () => {
    const keys = Object.keys(gradeInput);
    const total = keys.reduce((sum, key) => sum + (gradeInput[key] || 0), 0);
    const avg = total / keys.length;
    const gpa = (avg / 25).toFixed(2); // 100 max score map to 4.0 scale
    return { gpa, avg: avg.toFixed(1) };
  };

  return (
    <section className="relative py-20 px-4 md:px-8 bg-[#09081a]">
      {/* Lights */}
      <div className="absolute top-1/4 right-5 w-96 h-96 rounded-full glow-spot-2 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-block bg-amber-950/30 border border-amber-900/40 px-3 py-1 rounded-full">
            <span className="font-mono text-[9px] tracking-widest text-[#F59E0B] font-semibold uppercase">
              STUDIO ARCHIVE
            </span>
          </div>
          <h2 className="font-display font-medium text-3xl sm:text-4xl text-white tracking-tight">
            Our Selected Product Releases <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-indigo-100 to-purple-400">
              Complete with Interactive Sandboxes
            </span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Click on any release card below to instantly boot up its <strong>live interactive sandbox tracker simulation</strong> directly inside the browser viewport.
          </p>
        </div>

        {/* Project Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {STUDIO_PROJECTS.map((project) => (
            <div
              key={project.id}
              id={`project_card_${project.id}`}
              className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col justify-between hover:border-purple-500/30 transition-all duration-300 relative group"
            >
              {/* Highlight Tag */}
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#2D2962] px-3 py-0.5 rounded-full border border-white/10 text-[10px] font-mono text-slate-400 group-hover:text-amber-400 transition-colors">
                {project.category}
              </div>

              <div className="space-y-6">
                <div className="space-y-2 pt-2">
                  <h3 className="font-display font-medium text-lg text-white group-hover:text-amber-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans font-light">
                    {project.description}
                  </p>
                </div>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((t, idx) => (
                    <span key={idx} className="bg-white/5 text-purple-300 border border-white/10 text-[10px] font-mono px-2.5 py-0.5 rounded-md">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Live Core Meta */}
                <div className="bg-[#2D2962]/40 rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Primary Metric Value</span>
                    <span className="text-sm font-mono font-bold text-white mt-1 block">
                      {project.metrics.value}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">Focus</span>
                    <span className="text-[11px] text-amber-400 font-sans block mt-1 font-medium">
                      {project.metrics.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Launcher */}
              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Interactive Sim Available</span>
                </span>
                <button
                  onClick={() => handleOpenSandbox(project)}
                  id={`btn_launch_sandbox_${project.id}`}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-white/5 hover:bg-[#7C3AED] text-white rounded-xl text-[11px] font-semibold transition-all border border-white/10 hover:border-purple-500 cursor-pointer"
                >
                  <span>Launch Live Platform</span>
                  <Play className="w-3 h-3 fill-current text-amber-400 shrink-0" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Overlay for Live Sandboxes */}
        {activeProject && (
          <div 
            id="sandbox_modal_backdrop"
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto"
          >
            <div 
              id="sandbox_modal_body" 
              className="bg-[#0b0a1f] border border-indigo-900 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col"
            >
              
              {/* Modal Header */}
              <div className="p-6 border-b border-indigo-950 flex items-center justify-between bg-indigo-950/30 sticky top-0 z-10 backdrop-blur-md">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-900/60 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-md">
                      {activeProject.title} <span className="text-xs font-mono text-[#7C3AED] font-light">({activeProject.category})</span>
                    </h3>
                    <p className="text-[10px] text-gray-400 font-mono tracking-wider uppercase">MOHANA LABS • INTERACTIVE INTEGRATION SANDBOX v2.1</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveProject(null)}
                  className="p-1.5 rounded-lg bg-indigo-950 hover:bg-red-950 hover:text-red-400 transition-colors border border-indigo-900 shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modular Sandbox Content */}
              <div className="p-6 flex-1 space-y-6">

                {/* 1. FREELANCEROS SIMULATION */}
                {activeProject.id === 'freelanceros' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6" id="f_os_sim_container">
                    
                    {/* Left Column - Kanban Stages (7 cols) */}
                    <div className="md:col-span-7 bg-[#050411] border border-indigo-950 rounded-2xl p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-display font-medium text-xs text-white uppercase tracking-wider">Dynamic Lead Kanban Board</span>
                        <span className="text-[10px] font-mono text-gray-500">Tap card to shift processing stage</span>
                      </div>

                      {/* Kanban Columns */}
                      <div className="grid grid-cols-2 gap-3">
                        {['todo', 'progress', 'review', 'done'].map((stage) => {
                          const stageColors = {
                            todo: 'border-indigo-950/60 text-indigo-300 bg-indigo-950/20',
                            progress: 'border-yellow-950/60 text-yellow-300 bg-yellow-950/20',
                            review: 'border-purple-950/60 text-purple-300 bg-purple-950/20',
                            done: 'border-emerald-950/60 text-emerald-300 bg-emerald-950/20',
                          };
                          const colTasks = tasks.filter(t => t.stage === stage);
                          return (
                            <div key={stage} className="bg-[#0b0a1f] p-3 rounded-xl border border-indigo-950/80 space-y-2">
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border capitalize ${stageColors[stage]}`}>
                                {stage} ({colTasks.length})
                              </span>
                              <div className="space-y-1.5">
                                {colTasks.map((t) => (
                                  <div
                                    key={t.id}
                                    onClick={() => handleToggleTaskStage(t.id)}
                                    className="bg-indigo-950/40 hover:bg-indigo-950/80 p-2 rounded-lg border border-indigo-900/30 cursor-pointer transition-colors"
                                  >
                                    <p className="text-[11px] font-sans text-gray-200 leading-tight">{t.title}</p>
                                    <span className="text-[9px] font-mono text-[#F59E0B] capitalize mt-1 block">Priority: {t.priority}</span>
                                  </div>
                                ))}
                                {colTasks.length === 0 && (
                                  <span className="text-[10px] font-mono text-gray-600 block text-center py-4">Column empty</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Add Custom task */}
                      <div className="pt-2 flex space-x-2">
                        <input
                          type="text"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          placeholder="Create custom task title..."
                          className="flex-1 bg-[#09081a] border border-indigo-950 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-600 placeholder-gray-500 font-sans"
                        />
                        <button
                          onClick={handleAddTask}
                          className="bg-[#7C3AED] hover:bg-[#6D28D9] px-3 py-1.5 rounded-xl text-xs text-white font-medium flex items-center space-x-1"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>

                    {/* Right Column - Billing Tracker (5 cols) */}
                    <div className="md:col-span-5 space-y-4">
                      {/* Interactive Invoice panel */}
                      <div className="bg-[#050411] border border-indigo-950 rounded-2xl p-4 space-y-4">
                        <span className="font-display font-medium text-xs text-white uppercase tracking-wider block">Real-Time Invoicing Vault</span>
                        
                        {/* Financial Indicators */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-[#0b0a1f] rounded-xl p-2.5 border border-indigo-950">
                            <span className="text-[9px] font-mono text-gray-500 uppercase">Paid Invoices</span>
                            <span className="text-xs font-mono font-bold text-emerald-400 block mt-1">
                              ${invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
                            </span>
                          </div>
                          <div className="bg-[#0b0a1f] rounded-xl p-2.5 border border-indigo-950">
                            <span className="text-[9px] font-mono text-gray-500 uppercase">Outstanding Balance</span>
                            <span className="text-xs font-mono font-bold text-amber-400 block mt-1">
                              ${invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Invoice Entry Form */}
                        <div className="space-y-2 p-2.5 bg-[#0b0a1f] rounded-xl border border-indigo-950">
                          <span className="text-[10px] font-mono text-gray-400 block uppercase">Draft New Invoice</span>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={invClient}
                              onChange={(e) => setInvClient(e.target.value)}
                              placeholder="Client name"
                              className="bg-[#09081a] border border-indigo-950 rounded-lg p-1.5 text-[11px] text-white focus:outline-none"
                            />
                            <input
                              type="number"
                              value={invAmount}
                              onChange={(e) => setInvAmount(e.target.value)}
                              placeholder="Amount ($)"
                              className="bg-[#09081a] border border-indigo-950 rounded-lg p-1.5 text-[11px] text-white focus:outline-none"
                            />
                          </div>
                          <button
                            onClick={handleAddInvoice}
                            className="w-full py-1.5 bg-indigo-950 hover:bg-amber-400 hover:text-black rounded-lg text-[10px] font-bold tracking-widest text-[#F59E0B] uppercase transition-colors"
                          >
                            DISPATCH INVOICE RECORD
                          </button>
                        </div>

                        {/* Invoice Listings */}
                        <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                          {invoices.map((inv) => (
                            <div key={inv.id} className="flex items-center justify-between p-2 rounded bg-indigo-950/20 text-xs border border-indigo-950">
                              <div>
                                <span className="font-sans font-medium text-gray-200 block leading-tight">{inv.client}</span>
                                <span className="text-[9px] font-mono text-gray-500">Due: {inv.dueDate}</span>
                              </div>
                              <div className="text-right">
                                <span className="font-mono text-white block font-bold">${inv.amount}</span>
                                <span className={`text-[9px] font-mono px-1.5 rounded uppercase ${
                                  inv.status === 'paid' ? 'bg-emerald-950 text-emerald-400' : inv.status === 'pending' ? 'bg-amber-950 text-amber-400' : 'bg-red-950 text-red-400'
                                }`}>
                                  {inv.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. COLLEGE ERP SIMULATION */}
                {activeProject.id === 'collegeerp' && (
                  <div className="space-y-6" id="erp_sim_container">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Dynamic Dashboard Parameter Toggle */}
                      <div className="bg-[#050411] border border-indigo-950 rounded-2xl p-4 space-y-4">
                        <span className="font-display font-medium text-xs text-white uppercase block">Select Active HQ Campus</span>
                        <div className="space-y-2">
                          {['Central Campus', 'Engineering Quad', 'Medical Center Wing'].map((camp) => (
                            <button
                              key={camp}
                              onClick={() => setSelectedCampus(camp)}
                              className={`w-full text-left p-2 rounded-xl border text-xs font-medium transition-all ${
                                selectedCampus === camp
                                  ? 'bg-purple-950/40 border-purple-500 text-amber-400'
                                  : 'bg-[#0b0a1f] border-indigo-950 text-gray-400 hover:text-white'
                              }`}
                            >
                              {camp}
                            </button>
                          ))}
                        </div>

                        {/* Telemetry readouts */}
                        <div className="pt-2 space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Total Enrolled Scholars:</span>
                            <span className="font-mono font-bold text-purple-400">
                              {selectedCampus === 'Central Campus' ? '12,480' : selectedCampus === 'Engineering Quad' ? '8,120' : '4,400'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Security Access Level:</span>
                            <span className="font-mono font-bold text-emerald-400">Encrypted</span>
                          </div>
                        </div>
                      </div>

                      {/* Grades Simulation (Academic planning) */}
                      <div className="bg-[#050411] border border-indigo-950 rounded-2xl p-4 space-y-3">
                        <span className="font-display font-medium text-xs text-white uppercase block">Custom GPA Predictor Block</span>
                        <div className="space-y-2 text-xs">
                          {Object.keys(gradeInput).map((subj) => (
                            <div key={subj} className="space-y-1">
                              <div className="flex justify-between text-[11px]">
                                <span className="capitalize text-gray-300 font-sans">{subj === 'db' ? 'Database Architecture' : subj === 'ai' ? 'Advanced ML Models' : subj} Marks</span>
                                <span className="font-mono text-white font-semibold">{gradeInput[subj]}/100</span>
                              </div>
                              <input
                                type="range"
                                min="40"
                                max="100"
                                value={gradeInput[subj]}
                                onChange={(e) => setGradeInput({ ...gradeInput, [subj]: parseInt(e.target.value) })}
                                className="w-full accent-amber-400"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Results readout */}
                      <div className="bg-gradient-to-br from-indigo-950/40 to-purple-950/40 border border-indigo-900 rounded-2xl p-5 flex flex-col justify-between">
                        <div className="space-y-2">
                          <span className="font-display font-semibold text-xs text-amber-400 uppercase tracking-wider block">Calculated Academic Index</span>
                          <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                            Adjust Grade sliders to instantly calculate dynamic semester grading telemetry simulated real-time.
                          </p>
                        </div>
                        <div className="py-2.5">
                          <div className="bg-[#050411] rounded-xl p-3 border border-indigo-950 flex justify-between items-center">
                            <div>
                              <span className="text-[9px] font-mono text-gray-500 uppercase block">Projected GPA</span>
                              <span className="text-xl font-mono font-bold text-emerald-400 block mt-1">{erpGPA().gpa} / 4.0</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[9px] font-mono text-gray-500 uppercase block">Percentage</span>
                              <span className="text-md font-mono text-white block mt-1">{erpGPA().avg}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. RESTAURANT ANALYTICS SIMULATION */}
                {activeProject.id === 'restaurant-analytics' && (
                  <div className="space-y-6" id="rest_sim_container">
                    
                    {/* Live Header indicators */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-[#050411] border border-indigo-950 rounded-2xl p-4 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] font-mono text-gray-500 uppercase">Interactive Floor Seating</span>
                          <span className="text-lg font-mono font-bold text-amber-400 block mt-0.5">{restaurantLiveStats().activeTables} / 6 Tables</span>
                        </div>
                        <Utensils className="w-8 h-8 text-indigo-950" />
                      </div>
                      <div className="bg-[#050411] border border-indigo-950 rounded-2xl p-4 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] font-mono text-gray-500 uppercase">Average Floor Occupancy</span>
                          <span className="text-lg font-mono font-bold text-white block mt-0.5">{restaurantLiveStats().occupancyRate}% Occupied</span>
                        </div>
                        <Users className="w-8 h-8 text-indigo-950" />
                      </div>
                      <div className="bg-[#050411] border border-indigo-950 rounded-2xl p-4 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] font-mono text-gray-500 uppercase">Live Vault Receipts</span>
                          <span className="text-lg font-mono font-bold text-emerald-400 block mt-0.5">${restaurantLiveStats().activeEarnings} net bill</span>
                        </div>
                        <DollarSign className="w-8 h-8 text-indigo-950" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      
                      {/* Tables Visual Grid Layout (8 cols) */}
                      <div className="md:col-span-8 bg-[#050411] border border-[#1e1b4b] rounded-2xl p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-display font-medium text-xs text-white uppercase tracking-wider">Tap tables to swap Reservation pipeline statuses</span>
                          <span className="text-[10px] font-mono text-amber-400 flex items-center space-x-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                            <span>Live simulation syncing</span>
                          </span>
                        </div>

                        {/* Floor layout */}
                        <div className="grid grid-cols-3 gap-3">
                          {restTables.map((table) => {
                            const statusColor = {
                              vacant: 'bg-[#09081a] border-indigo-950 text-gray-500 hover:border-indigo-900',
                              occupied: 'bg-[#1e1b4b]/30 border-indigo-600/60 text-white hover:border-indigo-500',
                              ordered: 'bg-yellow-950/20 border-yellow-800 text-[#F59E0B] hover:border-yellow-600',
                              billing: 'bg-emerald-950/20 border-emerald-800 text-emerald-400 hover:border-emerald-600',
                            };
                            return (
                              <div
                                key={table.id}
                                onClick={() => handleTableStatusShift(table.id)}
                                className={`rounded-xl p-4 border text-center transition-all cursor-pointer select-none space-y-2 ${statusColor[table.status]}`}
                              >
                                <span className="font-mono text-xs font-bold block block">T-{table.id} ({table.capacity}p)</span>
                                <span className="text-[9px] font-mono tracking-widest uppercase block bg-black/40 py-0.5 px-1.5 rounded">{table.status}</span>
                                <span className="text-[11px] font-mono block text-right font-medium">
                                  {table.currentBill > 0 ? `$${table.currentBill}` : '$0'}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Chart Render */}
                        <div className="p-3 bg-[#0d0c26]/60 rounded-xl border border-indigo-950/50">
                          <span className="text-[10px] font-mono text-gray-400 block mb-3 uppercase tracking-wider">Hourly Revenue Yield</span>
                          <div className="h-28">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={MOCK_RESTAURANT_CHART}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#12102e" />
                                <XAxis dataKey="hour" stroke="#4b5563" fontSize={9} />
                                <Tooltip contentStyle={{ backgroundColor: '#070615', border: '1px solid #312e81', fontSize: '10px' }} />
                                <Line type="monotone" dataKey="sales" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>

                      {/* Dynamic Ticket Queues (4 cols) */}
                      <div className="md:col-span-4 bg-[#050411] border border-indigo-950 rounded-2xl p-4 space-y-4 flex flex-col justify-between">
                        <div className="space-y-4">
                          <span className="font-display font-medium text-xs text-white uppercase block">Active POS Ticket Feed</span>
                          
                          {/* Live adding ticket form */}
                          <div className="space-y-2 bg-[#09081a] p-2.5 rounded-xl border border-indigo-950">
                            <input
                              type="text"
                              value={newOrderName}
                              onChange={(e) => setNewOrderName(e.target.value)}
                              placeholder="Faux menu item name..."
                              className="w-full bg-[#050411] border border-indigo-950 rounded-lg p-1 text-[11px] text-white focus:outline-none"
                            />
                            <input
                              type="number"
                              value={newOrderPrice}
                              onChange={(e) => setNewOrderPrice(e.target.value)}
                              placeholder="Price ($)"
                              className="w-full bg-[#050411] border border-indigo-950 rounded-lg p-1 text-[11px] text-white focus:outline-none"
                            />
                            <button
                              onClick={handleAddRestOrder}
                              className="w-full py-1 bg-amber-400 text-black text-[9px] font-extrabold rounded-lg hover:opacity-90 tracking-widest uppercase transition-opacity"
                            >
                              QUEUE DIGITAL ORDER TICKET
                            </button>
                          </div>

                          {/* Orders Feed */}
                          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                            {restOrders.map((ord) => (
                              <div key={ord.id} className="flex justify-between items-center p-2 rounded bg-indigo-950/20 border border-indigo-950 text-xs">
                                <div>
                                  <span className="font-sans text-gray-200 block font-medium leading-tight">{ord.item}</span>
                                  <span className="text-[9px] font-mono text-gray-500">Ref: {ord.id} • Posted {ord.time}</span>
                                </div>
                                <div className="text-right">
                                  <span className="font-mono text-amber-400 font-bold block">${ord.amount}</span>
                                  <span className="bg-purple-950 text-purple-400 text-[8px] font-mono tracking-wider uppercase px-1 rounded">
                                    {ord.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-indigo-950/20 border border-indigo-900/40 rounded-xl p-3">
                          <span className="text-[9px] font-mono text-gray-400 block leading-relaxed">
                            This real-time telemetry model shows our studio capacity to handle complex event-driven structures and fluid database state synchronization.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. ICE CREAM SHOP SIMULATION */}
                {activeProject.id === 'icecream-shop' && (
                  <div className="space-y-6" id="icecream_sim_container">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      
                      {/* Left Column - Flavor popularity bar chart (6 cols) */}
                      <div className="md:col-span-6 bg-[#050411] border border-indigo-950 rounded-2xl p-4 space-y-4">
                        <span className="font-display font-medium text-xs text-white uppercase block">Flavor Popularity Sales Log</span>
                        <div className="h-56">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={flavors}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#12102e" />
                              <XAxis dataKey="name" stroke="#4b5563" fontSize={8} interval={0} strokeWidth={1} />
                              <YAxis stroke="#4b5563" fontSize={9} />
                              <Tooltip contentStyle={{ backgroundColor: '#070615', border: '1px solid #312e81', fontSize: '10px' }} />
                              <Bar dataKey="sales" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <p className="text-[10px] text-gray-400 leading-relaxed font-sans mt-2">
                          Analytics track cumulative single-bucket sales. Stock metrics are updated in real time by administrative threshold loops below.
                        </p>
                      </div>

                      {/* Right Column - Stock Manager & Safe Locks (6 cols) */}
                      <div className="md:col-span-6 bg-[#050411] border border-indigo-950 rounded-2xl p-4 space-y-4">
                        <span className="font-display font-medium text-xs text-white uppercase block">Interactive Flavor Storage Stock Controller</span>
                        <p className="text-[10px] text-gray-400 leading-tight">Drag stock thresholds below 30% to trigger raw visual emergency log alarms.</p>

                        <div className="space-y-4">
                          {flavors.map((fl) => (
                            <div key={fl.id} className="p-3 bg-[#0d0c26]/60 rounded-xl border border-indigo-950/50 space-y-2">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-sans font-medium text-white flex items-center space-x-2">
                                  <span className="w-3 h-3 rounded-full shrink-0 border" style={{ backgroundColor: fl.color, borderColor: '#ffff' }} />
                                  <span>{fl.name}</span>
                                </span>
                                <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                                  fl.stock <= 30 ? 'bg-red-950 text-red-400 animate-pulse border border-red-900' : 'bg-indigo-950 text-indigo-400'
                                }`}>
                                  {fl.stock <= 30 ? 'INSUFFICIENT STOCK WARNING' : `${fl.stock}% in tub`}
                                </span>
                              </div>

                              <div className="flex items-center space-x-3">
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={fl.stock}
                                  onChange={(e) => handleAdjustStock(fl.id, parseInt(e.target.value))}
                                  className="flex-1 accent-amber-500 cursor-pointer"
                                />
                                {fl.stock <= 30 && (
                                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. AI NOTES HUB SIMULATION */}
                {activeProject.id === 'ai-notes' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6" id="ai_sim_container">
                    
                    {/* Left Column - Real Document Canvas (6 cols) */}
                    <div className="md:col-span-6 bg-[#050411] border border-indigo-950 rounded-2xl p-4 space-y-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="font-display font-medium text-xs text-white uppercase block">Cognitive PlainText Pad</span>
                        <p className="text-[10px] text-gray-500">Edit raw meeting telemetry documents below, then dispatch smart intelligence routines.</p>
                      </div>

                      <div className="flex-1 min-h-[220px]">
                        <textarea
                          value={noteContent}
                          onChange={(e) => setNoteContent(e.target.value)}
                          className="w-full h-full bg-[#09081a] border border-indigo-950 rounded-xl p-3 text-xs text-gray-300 font-sans focus:outline-none focus:border-purple-600 leading-relaxed shrink-0"
                          placeholder="Write context documentation here..."
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => handleTriggerFauxAI('summarize')}
                          className="py-2 bg-indigo-950 hover:bg-purple-900 border border-indigo-900 hover:border-purple-600 rounded-xl text-[10px] font-semibold text-white transition-all flex flex-col items-center justify-center space-y-1"
                        >
                          <FileText className="w-3.5 h-3.5 text-purple-400" />
                          <span>Summarize</span>
                        </button>
                        <button
                          onClick={() => handleTriggerFauxAI('polish')}
                          className="py-2 bg-indigo-950 hover:bg-purple-900 border border-indigo-900 hover:border-purple-600 rounded-xl text-[10px] font-semibold text-white transition-all flex flex-col items-center justify-center space-y-1"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Corporate Polish</span>
                        </button>
                        <button
                          onClick={() => handleTriggerFauxAI('actions')}
                          className="py-2 bg-indigo-950 hover:bg-purple-900 border border-indigo-900 hover:border-purple-600 rounded-xl text-[10px] font-semibold text-white transition-all flex flex-col items-center justify-center space-y-1"
                        >
                          <Brain className="w-3.5 h-3.5 text-blue-400" />
                          <span>Extract Tasks</span>
                        </button>
                      </div>
                    </div>

                    {/* Right Column - Faux Generative Agent Results (6 cols) */}
                    <div className="md:col-span-6 bg-[#050411] border border-indigo-950 rounded-2xl p-4 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-display font-medium text-xs text-white uppercase flex items-center space-x-1.5">
                            <Brain className="w-4 h-4 text-[#7C3AED]" />
                            <span>Structured Context Resolver Outcomes</span>
                          </span>
                          <span className="bg-[#12102e] border border-indigo-900 text-purple-400 text-[8px] font-mono uppercase px-2 py-0.5 rounded">
                            Model: Gemini-3.5-pro
                          </span>
                        </div>

                        {/* Faux parsing display */}
                        {isAiProcessing && (
                          <div className="p-12 text-center space-y-4">
                            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                            <div>
                              <p className="text-xs font-mono text-gray-300">Resolving vector pipeline nodes...</p>
                              <p className="text-[9px] font-mono text-purple-500 mt-1">Executing: parse_text_{aiAnalysisType}()</p>
                            </div>
                          </div>
                        )}

                        {!isAiProcessing && !aiOutcome && (
                          <div className="p-12 text-center text-xs text-gray-500 border border-dashed border-indigo-950 rounded-xl py-20 flex flex-col items-center justify-center space-y-2">
                            <Brain className="w-8 h-8 text-indigo-950" />
                            <span>Select a model function routine on the left sidebar context pad to view resolved outcomes immediately.</span>
                          </div>
                        )}

                        {!isAiProcessing && aiOutcome && (
                          <div className="bg-[#0b0a1f] border border-indigo-950/80 rounded-xl p-4 max-h-[300px] overflow-y-auto whitespace-pre-line text-xs leading-relaxed text-gray-300 font-sans shadow-lg">
                            {aiOutcome}
                          </div>
                        )}
                      </div>

                      <div className="bg-[#0d0c26] border border-indigo-950 rounded-xl p-3 mt-4">
                        <span className="text-[9px] font-mono text-gray-400 block leading-normal">
                          Mohana Labs integrates real, context-grounded AI tools powered by the official <strong>@google/genai TypeScript SDK</strong> during client releases.
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-indigo-950/20 border-t border-indigo-950 flex items-center justify-between">
                <span className="text-[10px] font-mono text-gray-500 font-light">SYSTEM SECURE • INTEGRATED LOCAL STORAGE LIFECYCLES</span>
                <button
                  onClick={() => setActiveProject(null)}
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold rounded-xl hover:opacity-90 transition-opacity"
                >
                  Terminate Sandbox Sandbox
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
