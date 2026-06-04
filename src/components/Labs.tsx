/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Settings, 
  Cpu, 
  Play, 
  Pause, 
  Trash, 
  Network, 
  Plus, 
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Brain,
  Lock,
  Unlock,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  Sparkles,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Undo2,
  Trash2,
  LockKeyholeOpen,
  ArrowRight
} from 'lucide-react';
import { LAB_EXPERIMENTS } from '../data';

// =============================================================
// INTERFACES & DEFINITIONS
// =============================================================
interface NodeItem {
  id: string;
  label: string;
  type: 'vector' | 'llm' | 'filter' | 'endpoint';
  x: number;
  y: number;
}

interface Connection {
  from: string;
  to: string;
}

interface UserProfile {
  userId: string;
  userName: string;
  userPass: string;
  isActive: boolean;
  isAdmin: boolean;
}

const DEFAULT_USERS: UserProfile[] = [
  { userId: 'sarah_vp', userName: 'Sarah Jenkins', userPass: 'royal_gold321', isActive: true, isAdmin: true },
  { userId: 'admin', userName: 'Mohana Developer', userPass: 'masterpoint', isActive: true, isAdmin: true },
  { userId: 'guest_dev', userName: 'Guest Architect', userPass: 'explore_labs', isActive: true, isAdmin: false },
  { userId: 'deactivated_pioneer', userName: 'Retired Developer', userPass: 'pass123', isActive: false, isAdmin: false }
];

export default function Labs() {
  // -------------------------------------------------------------
  // USER SYSTEM STATES (PERSISTENT & MOCK DATA)
  // -------------------------------------------------------------
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('laboratory_users_db');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEFAULT_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('labs_remembered_user');
    if (saved) {
      const savedDb = localStorage.getItem('laboratory_users_db');
      const db: UserProfile[] = savedDb ? JSON.parse(savedDb) : DEFAULT_USERS;
      const found = db.find(u => u.userId === saved && u.isActive);
      if (found) return found;
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem('laboratory_users_db', JSON.stringify(users));
  }, [users]);

  // -------------------------------------------------------------
  // VIEW & COHERENCE CONTROL STATES
  // -------------------------------------------------------------
  const [viewMode, setViewMode] = useState<'modules' | 'login' | 'welcome' | 'workspace'>('modules');
  const [selectedExperimentTab, setSelectedExperimentTab] = useState<'neural' | 'shader' | 'terminal'>('neural');
  
  // Login input states
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Modal & Panel Control Toggles
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showAdminConsoleInModal, setShowAdminConsoleInModal] = useState(false);
  
  // Admin Form States
  const [newUserId, setNewUserId] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserPass, setNewUserPass] = useState('');
  const [newUserIsAdmin, setNewUserIsAdmin] = useState(false);
  const [adminFeedback, setAdminFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // -------------------------------------------------------------
  // 1. NEURAL NODE FLOW STATES & ACTIONS
  // -------------------------------------------------------------
  const [nodeItems, setNodeItems] = useState<NodeItem[]>([
    { id: 'n1', label: 'RAG Embedder Cache', type: 'vector', x: 80, y: 120 },
    { id: 'n2', label: 'Gemini Agent Executor', type: 'llm', x: 280, y: 80 },
    { id: 'n3', label: 'Semantic Token Filter', type: 'filter', x: 280, y: 190 },
    { id: 'n4', label: 'User Screen UI Ingress', type: 'endpoint', x: 480, y: 130 },
  ]);
  const [connections, setConnections] = useState<Connection[]>([
    { from: 'n1', to: 'n2' },
    { from: 'n1', to: 'n3' },
    { from: 'n2', to: 'n4' },
    { from: 'n3', to: 'n4' }
  ]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleAddNode = (type: 'vector' | 'llm' | 'filter' | 'endpoint') => {
    const labels = {
      vector: 'Chroma Pinecone Node',
      llm: 'Deep Reasoning Loop',
      filter: 'Metadata Token Gate',
      endpoint: 'Web Response WebSocket'
    };
    const nodeCount = nodeItems.length + 1;
    const offset = (nodeCount * 40) % 150;
    const newNode: NodeItem = {
      id: `n-${Date.now()}`,
      label: `${labels[type]} #${nodeCount}`,
      type,
      x: 150 + offset,
      y: 100 + offset
    };
    setNodeItems([...nodeItems, newNode]);
  };

  const handleNodeClick = (nodeId: string) => {
    if (!selectedNodeId) {
      setSelectedNodeId(nodeId);
    } else {
      if (selectedNodeId !== nodeId) {
        // Toggle connection
        const exists = connections.some(c => (c.from === selectedNodeId && c.to === nodeId) || (c.from === nodeId && c.to === selectedNodeId));
        if (exists) {
          setConnections(connections.filter(c => !((c.from === selectedNodeId && c.to === nodeId) || (c.from === nodeId && c.to === selectedNodeId))));
        } else {
          setConnections([...connections, { from: selectedNodeId, to: nodeId }]);
        }
      }
      setSelectedNodeId(null);
    }
  };

  const handleMoveNode = (nodeId: string, direction: 'u' | 'd' | 'l' | 'r') => {
    setNodeItems(nodeItems.map(n => {
      if (n.id === nodeId) {
        const delta = 20;
        return {
          ...n,
          x: Math.max(20, Math.min(560, direction === 'l' ? n.x - delta : direction === 'r' ? n.x + delta : n.x)),
          y: Math.max(20, Math.min(260, direction === 'u' ? n.y - delta : direction === 'd' ? n.y + delta : n.y))
        };
      }
      return n;
    }));
  };

  const handleClearSandboxNodes = () => {
    setNodeItems([]);
    setConnections([]);
    setSelectedNodeId(null);
  };

  // -------------------------------------------------------------
  // 2. MATHEMATICAL SVG SHADER RIG STATES & CALCULATOR
  // -------------------------------------------------------------
  const [waveFreq, setWaveFreq] = useState(2.5);
  const [waveHeight, setWaveHeight] = useState(40);
  const [waveSpeed, setWaveSpeed] = useState(3.0);
  const [waveNodes, setWaveNodes] = useState(80);
  const [waveOffset, setWaveOffset] = useState(0);

  // Auto Tick Animation offset for Mathematical SVG shader
  useEffect(() => {
    let animId: number;
    const updateTick = () => {
      setWaveOffset(prev => prev + (waveSpeed * 0.02));
      animId = requestAnimationFrame(updateTick);
    };
    animId = requestAnimationFrame(updateTick);
    return () => cancelAnimationFrame(animId);
  }, [waveSpeed]);

  const generateWavePath = () => {
    const points: string[] = [];
    const width = 600;
    const baseY = 150;

    for (let i = 0; i <= waveNodes; i++) {
      const pct = i / waveNodes;
      const x = pct * width;
      const angle = (pct * Math.PI * 2 * waveFreq) + waveOffset;
      const primarySin = Math.sin(angle) * waveHeight;
      const subHarmonic = Math.cos(angle * 1.5) * (waveHeight * 0.3);
      const y = baseY + primarySin + subHarmonic;

      if (i === 0) points.push(`M ${x} ${y}`);
      else points.push(`L ${x} ${y}`);
    }

    return points.join(' ');
  };

  // -------------------------------------------------------------
  // 3. LIVE EDGE LOG STATE AND PROCESSOR
  // -------------------------------------------------------------
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "SYS_CORE_INITIALIZED // Mohana Laboratories v4.1",
    "EDGE_ROUTER: Ready at standard ingress gateway PORT:3000",
    "CLUSTER_VM: Active instances reporting green...",
  ]);
  const [isLogStreaming, setIsLogStreaming] = useState(true);
  const [streamHz, setStreamHz] = useState(1);
  const [logFilterQuery, setLogFilterQuery] = useState('');
  const logTerminalBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLogStreaming) return;

    const streamInterval = setInterval(() => {
      const endpoints = ['/api/analytics', '/api/users', '/api/cognitive/summary', '/api/inventories/alarms', '/v1/models/reasoning'];
      const statuses = [200, 201, 304, 404, 500];
      const method = Math.random() > 0.3 ? 'GET' : 'POST';
      const targetEndpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
      const resCode = statuses[Math.floor(Math.random() * statuses.length)];
      const sizeBytes = Math.floor(Math.random() * 8000) + 200;
      const timeMs = Math.floor(Math.random() * 200) + 1;

      const randomDiagLogs = [
        `[INFO] ${method} ${targetEndpoint} - Status ${resCode} - ${timeMs}ms [${sizeBytes}b]`,
        `[DATA] FLUSH_VECTOR_BUFFERS_ID: res_${Math.floor(Math.random() * 9500)}`,
        `[NODE_HEALTH] Daemon monitor: ping okay (rtt=${Math.floor(Math.random() * 12) + 2}ms)`,
        `[COGNITIVE] Gemini-3.5 prompt token utilization: ${Math.floor(Math.random() * 120) + 30} units`,
      ];

      const newLog = randomDiagLogs[Math.floor(Math.random() * randomDiagLogs.length)];
      setTerminalLogs(prev => [...prev, newLog].slice(-100));
    }, (1000 / streamHz));

    return () => clearInterval(streamInterval);
  }, [isLogStreaming, streamHz]);

  useEffect(() => {
    if (logTerminalBottomRef.current) {
      logTerminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);


  // =============================================================
  // AUTHENTICATION FLOW ACTIONS
  // =============================================================
  const handleExperimentClick = (experimentId: 'neural' | 'shader' | 'terminal') => {
    setSelectedExperimentTab(experimentId);
    if (currentUser) {
      // Already logged in! Let's go to workspace directly
      setViewMode('workspace');
    } else {
      // Guarded! Send user to login gate first
      setViewMode('login');
      setLoginError(null);
    }
  };

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    setTimeout(() => {
      const foundUser = users.find(u => u.userId.toLowerCase().trim() === loginId.toLowerCase().trim());

      if (!foundUser) {
        setLoginError("Security Ingress Protocol Blocked: User coordinates not parsed in master registry.");
        setIsLoggingIn(false);
        return;
      }

      if (!foundUser.isActive) {
        setLoginError("System Access Revoked: This operational account has been de-provisioned by administration.");
        setIsLoggingIn(false);
        return;
      }

      if (foundUser.userPass !== loginPass) {
        setLoginError("Authorization Handshake Failed: Cryptographic key invalid.");
        setIsLoggingIn(false);
        return;
      }

      // Authentic login!
      setCurrentUser(foundUser);
      setIsLoggingIn(false);

      if (rememberMe) {
        localStorage.setItem('labs_remembered_user', foundUser.userId);
      } else {
        localStorage.removeItem('labs_remembered_user');
      }

      // Enter workspace with premium transition!
      setViewMode('welcome');
    }, 1200);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('labs_remembered_user');
    setViewMode('modules');
    setLoginId('');
    setLoginPass('');
  };

  // =============================================================
  // ADMIN SYSTEM FUNCTIONS (USER CREATION & ACCOUNT CONTROL)
  // =============================================================
  const handleCreateUser = (e: FormEvent) => {
    e.preventDefault();
    setAdminFeedback(null);

    const checkId = newUserId.trim().toLowerCase();
    if (!checkId || !newUserName.trim() || !newUserPass.trim()) {
      setAdminFeedback({ type: 'err', text: 'Error: Coordinate fields must not be empty.' });
      return;
    }

    if (users.some(u => u.userId.toLowerCase() === checkId)) {
      setAdminFeedback({ type: 'err', text: 'Conflict: User ID profile already indexed.' });
      return;
    }

    const newUser: UserProfile = {
      userId: newUserId.trim(),
      userName: newUserName.trim(),
      userPass: newUserPass.trim(),
      isActive: true,
      isAdmin: newUserIsAdmin
    };

    setUsers([...users, newUser]);
    setAdminFeedback({ type: 'ok', text: `Success: Authorized index created for ${newUser.userName}.` });
    
    // Clear Admin forms
    setNewUserId('');
    setNewUserName('');
    setNewUserPass('');
    setNewUserIsAdmin(false);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(u => {
      if (u.userId === userId) {
        // Safe check: do not let them deactivate their own active session
        if (currentUser && currentUser.userId === userId) {
          alert("Safety Interlock: You cannot de-provision your active session profile.");
          return u;
        }
        return { ...u, isActive: !u.isActive };
      }
      return u;
    }));
  };

  const deleteUserRecord = (userId: string) => {
    if (currentUser && currentUser.userId === userId) {
      alert("Safety Interlock: Active operator record cannot be deleted.");
      return;
    }
    if (confirm(`Confirm purge of user record: [${userId}]? This operation is permanent.`)) {
      setUsers(users.filter(u => u.userId !== userId));
    }
  };


  return (
    <section className="relative py-12 px-4 md:px-8 bg-transparent max-w-7xl mx-auto" id="labs_master_container">
      {/* Dynamic Background glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amber-950/15 rounded-full blur-3xl pointer-events-none" />

      {/* R&D Header Block */}
      <div className="border-b border-white/10 pb-6 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="bg-purple-950/40 border border-purple-500/20 px-3 py-1 rounded-full flex items-center space-x-1.5 shadow-sm shadow-purple-950/30">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-mono text-[9px] tracking-widest text-[#9333EA] font-semibold uppercase">
                SECURED R&amp;D SANDBOX
              </span>
            </div>
            {currentUser && (
              <div className="bg-emerald-950/40 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="font-mono text-[9px] text-emerald-400 font-semibold uppercase">
                  SESSION APPROVED: {currentUser.userName}
                </span>
              </div>
            )}
          </div>
          <h2 className="font-display font-medium text-3xl text-white tracking-tight leading-tight">
            Experimental Laboratory Canvas
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed">
            Proprietary interactive algorithms and server metrics. All active platforms are strictly sandboxed behind secure credentials.
          </p>
        </div>

        {/* Quick Menu shortcuts */}
        <div className="flex items-center gap-2">
          {currentUser && (
            <button
              onClick={() => {
                setViewMode('modules');
              }}
              className="flex items-center space-x-1.5 px-3 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-mono transition-all cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Lab Modules</span>
            </button>
          )}

          {currentUser?.isAdmin && (
            <button
              onClick={() => setShowAdminConsoleInModal(true)}
              className="flex items-center space-x-1.5 px-3 py-2 bg-gradient-to-r from-purple-950/50 to-indigo-950/50 border border-purple-500/30 hover:border-amber-400 text-white rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer gold-glow"
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Console</span>
            </button>
          )}

          {currentUser && (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-3 py-2 bg-red-950/20 border border-red-500/10 hover:border-red-500/45 text-red-300 rounded-xl text-xs font-mono transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* =========================================================
            STATE 1: MODULES DIRECTORY GRID (UNAUTHORIZED OR PRE-LOGIN)
            ========================================================= */}
        {viewMode === 'modules' && (
          <motion.div
            key="modules_grid"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="experiments_cards_layout">
              {LAB_EXPERIMENTS.map((experiment) => {
                const isNeural = experiment.id === 'neural-sandbox';
                const isShader = experiment.id === 'canvas-generator';
                const mappedType: 'neural' | 'shader' | 'terminal' = isNeural ? 'neural' : isShader ? 'shader' : 'terminal';
                
                // Tech matching colors for badges
                const statusColors = {
                  beta: 'border-yellow-500/30 text-yellow-400 bg-yellow-950/20',
                  alpha: 'border-purple-500/30 text-purple-400 bg-purple-950/20',
                  stable: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20'
                }[experiment.status];

                return (
                  <div
                    key={experiment.id}
                    className="glass-panel border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-950/10 transition-all duration-300 bg-white/5 relative group"
                  >
                    <div>
                      {/* Top ribbon tags */}
                      <div className="flex items-center justify-between pb-4">
                        <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">{experiment.version}</span>
                        <span className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${statusColors} uppercase tracking-wider`}>
                          {experiment.status}
                        </span>
                      </div>

                      {/* Content block */}
                      <div className="space-y-3 pt-2">
                        <h3 className="font-display font-medium text-lg text-white group-hover:text-amber-300 transition-colors flex items-center gap-2">
                          {isNeural && <Network className="w-5 h-5 text-purple-400" />}
                          {isShader && <SlidersHorizontal className="w-5 h-5 text-amber-500" />}
                          {!isNeural && !isShader && <Terminal className="w-5 h-5 text-cyan-400" />}
                          {experiment.title}
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed font-sans font-light min-h-[72px]">
                          {experiment.description}
                        </p>
                      </div>

                      {/* Tech elements */}
                      <div className="flex flex-wrap gap-1.5 pt-4">
                        {experiment.tech.map((t, idx) => (
                          <span key={idx} className="bg-white/5 text-purple-300 border border-white/10 text-[9px] font-mono px-2.5 py-0.5 rounded-md">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Launch CTA */}
                    <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#F59E0B] flex items-center space-x-1.5 font-semibold">
                        <Lock className="w-3.5 h-3.5 animate-pulse text-amber-500" />
                        <span>Auth Ingress Required</span>
                      </span>
                      <button
                        onClick={() => handleExperimentClick(mappedType)}
                        className="flex items-center space-x-1.5 px-4 py-2 bg-[#7C3AED]/25 hover:bg-[#7C3AED] text-white border border-purple-500/20 hover:border-purple-400 rounded-xl text-[11px] font-semibold transition-all cursor-pointer shadow-sm group-hover:scale-102"
                      >
                        <span>Boot Ingress</span>
                        <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Demo Credentials Help */}
            <div className="bg-[#2D2962]/10 border border-white/5 p-4 rounded-2xl flex items-center justify-between gap-4 max-w-4xl mx-auto relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center space-x-3.5">
                <HelpCircle className="w-5 h-5 text-amber-400 shrink-0" />
                <div className="space-y-0.5">
                  <p className="text-[11px] font-mono text-white font-semibold">Diagnostic Operator Ingress Coordinates Available</p>
                  <p className="text-[11px] text-slate-400 font-light leading-relaxed">Don't have active security credentials? Use the built-in system hints within the <strong>"Forgot Password"</strong> gateway directory.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setViewMode('login');
                  setShowForgotPassword(true);
                  setLoginError(null);
                }}
                className="bg-white/5 hover:bg-white/10 text-[10px] font-mono px-3 py-1.5 rounded-lg border border-white/10 text-white font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
              >
                <span>View Coordinates Index</span>
                <ArrowRight className="w-3 h-3 text-amber-400" />
              </button>
            </div>
          </motion.div>
        )}

        {/* =========================================================
            STATE 2: MODERN LOGIN PAGE (ROYAL PURPLE & GOLD THEME)
            ========================================================= */}
        {viewMode === 'login' && (
          <motion.div
            key="login_gate"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center items-center py-6 relative"
          >
            {/* Visual ambient backgrounds */}
            <div className="absolute w-[450px] h-[450px] bg-purple-950/20 rounded-full blur-3xl pointer-events-none -translate-y-6" />
            
            <div className="glass-panel text-left bg-black/45 border-2 border-purple-500/25 shadow-2xl backdrop-blur-3xl p-8 rounded-3xl max-w-md w-full relative z-10 space-y-6 purple-glow">
              
              {/* Gold light burst */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-6 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent blur-md" />

              {/* Central Shield Header */}
              <div className="text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-950 to-indigo-950 border-2 border-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-purple-950/50">
                  <Lock className="w-6 h-6 text-amber-400 fill-amber-400/15" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-medium text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 tracking-tight leading-snug drop-shadow-md">
                    System Identity Ingress
                  </h3>
                  <p className="text-[10px] font-mono text-purple-300 tracking-widest uppercase">
                    MOHANA LABS • AUTH INTERMEDIARY
                  </p>
                </div>
              </div>

              {loginError && (
                <div className="bg-red-950/30 border border-red-500/40 p-3 rounded-xl flex items-start space-x-2 text-red-300">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5 animate-bounce" />
                  <span className="text-[11px] leading-relaxed font-mono font-medium">{loginError}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold flex items-center space-x-1">
                    <KeyRound className="w-3 h-3 text-amber-400" />
                    <span>Operator User ID</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="Enter User ID (e.g., sarah_vp)"
                    className="w-full bg-[#1A1845]/40 border border-purple-900/45 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400/40 transition-all font-mono placeholder-slate-500"
                  />
                </div>

                <div className="space-y-1.5 relative">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold flex items-center space-x-1">
                      <Lock className="w-3 h-3 text-amber-400" />
                      <span>Security Secret Key</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[10px] font-mono text-purple-300 hover:text-amber-300 transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showPassword ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="Input security password"
                    className="w-full bg-[#1A1845]/40 border border-purple-900/45 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400/40 transition-all font-mono placeholder-slate-500"
                  />
                </div>

                {/* Remember and Forgot labels */}
                <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-slate-400">
                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-purple-900 bg-[#1A1845]/40 focus:ring-0 accent-purple-600 cursor-pointer h-3.5 w-3.5"
                    />
                    <span className="font-semibold hover:text-white transition-colors">Remember credentials</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(!showForgotPassword)}
                    className="text-amber-400 hover:text-yellow-200 transition-colors cursor-pointer underline flex items-center space-x-1"
                  >
                    <span>Forgot Credentials?</span>
                  </button>
                </div>

                {/* Expanded Forgot Password (Credentials index) */}
                {showForgotPassword && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-[#2D2962]/40 border border-purple-500/20 rounded-2xl p-4 space-y-3 mt-4"
                  >
                    <div className="flex items-center justify-between border-b border-purple-500/10 pb-1.5">
                      <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center space-x-1">
                        <Users className="w-3 h-3 text-amber-400" />
                        <span>Corporate Account Indexes</span>
                      </span>
                      <button
                        onClick={() => setShowForgotPassword(false)}
                        className="text-[9px] font-mono text-slate-400 hover:text-white transition-colors cursor-pointer font-bold"
                      >
                        CLOSE SECURE DIRECTORY
                      </button>
                    </div>
                    
                    <p className="text-[9px] text-slate-400 font-sans leading-relaxed">
                      Below are the diagnostic authorization keys index stored in corporate registry for simulation. Click any to pre-fill coordinates.
                    </p>

                    <div className="space-y-1.5 pt-1 max-h-36 overflow-y-auto">
                      {users.map((u, i) => (
                        <div 
                          key={i} 
                          onClick={() => {
                            setLoginId(u.userId);
                            setLoginPass(u.userPass);
                            setShowForgotPassword(false);
                          }}
                          className={`p-2 bg-black/40 hover:bg-[#7C3AED]/20 border border-purple-950 rounded-xl flex items-center justify-between text-[10px] font-mono cursor-pointer transition-all ${!u.isActive ? 'opacity-40 hover:bg-red-950/20' : ''}`}
                        >
                          <div>
                            <span className="text-white block font-sans font-bold leading-none">{u.userName}</span>
                            <span className="text-amber-400 text-[9px] block mt-1">ID: <strong className="text-white">{u.userId}</strong></span>
                            <span className="text-purple-300 text-[9px] block">Key: <strong className="text-white">{u.userPass}</strong></span>
                          </div>
                          
                          <div className="text-right flex flex-col items-end gap-1">
                            <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase ${u.isActive ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/25' : 'bg-red-950/40 text-red-400 border border-red-500/25'}`}>
                              {u.isActive ? 'Active' : 'Deactivated'}
                            </span>
                            {u.isAdmin && (
                              <span className="text-[8px] text-amber-400 uppercase tracking-wide bg-amber-950/30 border border-amber-500/20 px-1 py-0.5 rounded leading-none block font-bold">
                                Admin
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* CTAs */}
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-3 bg-gradient-to-r from-purple-700 via-purple-600 to-amber-500 hover:from-purple-600 hover:to-amber-400 text-white font-display text-xs font-semibold tracking-widest uppercase rounded-xl border border-amber-400/40 transition-all flex items-center justify-center space-x-2 active:translate-y-0.5 cursor-pointer hover:shadow-lg hover:shadow-purple-700/20"
                  >
                    {isLoggingIn ? (
                      <>
                        <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                        <span>Verifying Cryptographic Handshake...</span>
                      </>
                    ) : (
                      <>
                        <LockKeyholeOpen className="w-4 h-4 text-amber-300 shrink-0" />
                        <span>Execute Ingress Handshake</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('modules')}
                    className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-mono text-[10px] uppercase font-bold tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1 border border-white/5"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    <span>Return to Labs Selection</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* =========================================================
            STATE 3: ANIMATED WELCOME REDIRECT GATEWAY PAGE
            ========================================================= */}
        {viewMode === 'welcome' && (
          <WelcomeGate 
            userName={currentUser?.userName || 'Operator'} 
            onRedirect={() => setViewMode('workspace')} 
          />
        )}

        {/* =========================================================
            STATE 4: FULL DEDICATED WORKSPACE GATES
            ========================================================= */}
        {viewMode === 'workspace' && currentUser && (
          <motion.div
            key="sandbox_workspace"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Embedded Active Operator Header banner */}
            <div className="bg-gradient-to-r from-purple-950/30 via-[#2D2962]/40 to-black/35 border-2 border-purple-500/30 p-4 rounded-3xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 select-none relative overflow-hidden gold-glow">
              <div className="absolute top-0 right-0 w-80 h-32 bg-gradient-to-l from-amber-400/5 to-transparent blur-xl pointer-events-none" />
              
              <div className="flex items-center space-x-3.5 relative z-10">
                <div className="w-10 h-10 rounded-full bg-[#1A1845] border border-amber-400 flex items-center justify-center overflow-hidden font-display font-black text-amber-300">
                  {currentUser.userName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-sans text-slate-400 font-light">Interactive Terminal Sec_OK</span>
                    <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/20 rounded uppercase tracking-wider animate-pulse">
                      Live
                    </span>
                  </div>
                  <h4 className="font-display font-medium text-md text-white">
                    Welcome Back, <span className="text-amber-400 font-semibold">{currentUser.userName}</span>
                  </h4>
                </div>
              </div>

              {/* Active Lab selectors (original tabs inside Workspace view) */}
              <div className="flex flex-wrap gap-2 relative z-10">
                {[
                  { id: 'neural', label: '1. Neural Net Node Linker', icon: Network },
                  { id: 'shader', label: '2. Trigonometric SVG Waves', icon: SlidersHorizontal },
                  { id: 'terminal', label: '3. Edge Server Diagnostic Console', icon: Terminal }
                ].map((tab) => {
                  const TabIcon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedExperimentTab(tab.id as 'neural' | 'shader' | 'terminal')}
                      className={`flex items-center space-x-2 px-3.5 py-2.5 border rounded-xl text-xs font-mono font-semibold tracking-wide transition-all ${
                        selectedExperimentTab === tab.id
                          ? 'bg-purple-950/60 border-purple-500 text-amber-400 shadow-xl shadow-purple-950'
                          : 'bg-black/30 border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <TabIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Render Sandbox UI stage wrapper */}
            <div className="glass-panel border-white/10 rounded-3xl p-6 min-h-[440px] relative">
              
              {/* ============ TABS SUB-MODULE RENDER ============ */}
              
              {/* neural node flow */}
              {selectedExperimentTab === 'neural' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="neural_sandbox_ui">
                  
                  {/* node actions */}
                  <div className="lg:col-span-4 space-y-4">
                    <span className="font-display font-medium text-xs text-white uppercase block">Neural Agent Nodes Panel</span>
                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                      Nodes represent processing stages in our agent logic flow maps. <strong>Click on a node card to select it</strong>, then click another node to construct or destroy connective pipelines.
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => handleAddNode('vector')} className="p-2 border border-white/10 hover:border-[#7C3AED]/40 bg-[#2D2962]/40 hover:bg-white/10 text-left rounded-xl transition-all space-y-1 cursor-pointer">
                        <span className="text-[8px] font-mono text-cyan-400 block tracking-widest uppercase">/vector</span>
                        <span className="text-[10px] text-white font-semibold block">Vector Store</span>
                      </button>
                      <button onClick={() => handleAddNode('llm')} className="p-2 border border-white/10 hover:border-[#7C3AED]/40 bg-[#2D2962]/40 hover:bg-white/10 text-left rounded-xl transition-all space-y-1 cursor-pointer">
                        <span className="text-[8px] font-mono text-purple-400 block tracking-widest uppercase">/llm-model</span>
                        <span className="text-[10px] text-white font-semibold block">Reasoning Engine</span>
                      </button>
                      <button onClick={() => handleAddNode('filter')} className="p-2 border border-white/10 hover:border-[#7C3AED]/40 bg-[#2D2962]/40 hover:bg-white/10 text-left rounded-xl transition-all space-y-1 cursor-pointer">
                        <span className="text-[8px] font-mono text-yellow-400 block tracking-widest uppercase">/filter</span>
                        <span className="text-[10px] text-white font-semibold block">Security Gate</span>
                      </button>
                      <button onClick={() => handleAddNode('endpoint')} className="p-2 border border-white/10 hover:border-[#7C3AED]/40 bg-[#2D2962]/40 hover:bg-white/10 text-left rounded-xl transition-all space-y-1 cursor-pointer">
                        <span className="text-[8px] font-mono text-emerald-400 block tracking-widest uppercase">/socket</span>
                        <span className="text-[10px] text-white font-semibold block">Live Stream</span>
                      </button>
                    </div>

                    {selectedNodeId && (
                      <div className="bg-purple-950/20 border border-purple-900/40 p-3 rounded-2xl space-y-3">
                        <div className="flex items-center space-x-2 text-[11px]">
                          <Brain className="w-4 h-4 text-amber-400 shrink-0" />
                          <span className="text-white font-bold font-mono">SELECTED: {selectedNodeId}</span>
                        </div>
                        <p className="text-[9px] text-slate-400">Deploy positional modifiers to align nodes perfectly inside the visual flow grid.</p>
                        <div className="grid grid-cols-4 gap-1.5 text-center font-bold">
                          <button onClick={() => handleMoveNode(selectedNodeId, 'u')} className="bg-indigo-950 p-1.5 rounded text-xs hover:bg-indigo-900 shrink-0 cursor-pointer">▲</button>
                          <button onClick={() => handleMoveNode(selectedNodeId, 'd')} className="bg-indigo-950 p-1.5 rounded text-xs hover:bg-indigo-900 shrink-0 cursor-pointer">▼</button>
                          <button onClick={() => handleMoveNode(selectedNodeId, 'l')} className="bg-indigo-950 p-1.5 rounded text-xs hover:bg-indigo-900 shrink-0 cursor-pointer">◀</button>
                          <button onClick={() => handleMoveNode(selectedNodeId, 'r')} className="bg-indigo-950 p-1.5 rounded text-xs hover:bg-indigo-900 shrink-0 cursor-pointer">▶</button>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleClearSandboxNodes}
                      className="w-full py-2 bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white rounded-xl text-xs font-mono font-semibold tracking-widest uppercase transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Trash className="w-4 h-4" />
                      <span>Erase All Active Nodes</span>
                    </button>
                  </div>

                  {/* Node map visual playground */}
                  <div className="lg:col-span-8 bg-[#2D2962]/40 border border-white/10 rounded-2xl p-4 overflow-hidden relative min-h-[300px]">
                    <div className="absolute top-3 right-3 text-[9px] font-mono text-slate-500 bg-black/40 px-2 py-0.5 rounded border border-white/10">
                      BOUNDS: 600 x 300 COORDS
                    </div>

                    <svg className="w-full h-[280px]" viewBox="0 0 600 300">
                      {connections.map((conn, idx) => {
                        const fromNode = nodeItems.find(n => n.id === conn.from);
                        const toNode = nodeItems.find(n => n.id === conn.to);
                        if (!fromNode || !toNode) return null;
                        return (
                          <g key={idx}>
                            <line
                              x1={fromNode.x}
                              y1={fromNode.y}
                              x2={toNode.x}
                              y2={toNode.y}
                              stroke="#7C3AED"
                              strokeWidth="2"
                              strokeDasharray="6 4"
                              className="animate-pulse"
                              opacity="0.3"
                            />
                            <line
                              x1={fromNode.x}
                              y1={fromNode.y}
                              x2={toNode.x}
                              y2={toNode.y}
                              stroke="#F59E0B"
                              strokeWidth="1.5"
                              opacity="0.8"
                            />
                          </g>
                        );
                      })}

                      {nodeItems.map((node) => {
                        const isSelected = selectedNodeId === node.id;
                        const typeColor = {
                          vector: '#06B6D4',
                          llm: '#8B5CF6',
                          filter: '#F59E0B',
                          endpoint: '#10B981'
                        }[node.type];

                        return (
                          <g 
                            key={node.id} 
                            transform={`translate(${node.x}, ${node.y})`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNodeClick(node.id);
                            }}
                            className="cursor-pointer select-none"
                          >
                            <circle 
                              r={isSelected ? 18 : 14} 
                              fill="#0b0a1f" 
                              stroke={isSelected ? '#F59E0B' : typeColor} 
                              strokeWidth="2" 
                              className="transition-all"
                            />
                            <circle r="4" fill={typeColor} />
                            
                            <text
                              y="28"
                              textAnchor="middle"
                              fill="#ffff"
                              fontSize="9"
                              fontWeight="bold"
                              className="font-mono text-[9px] drop-shadow-md fill-white"
                            >
                              {node.label}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>
              )}

              {/* trigonometry math waves */}
              {selectedExperimentTab === 'shader' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="shader_sandbox_ui">
                  
                  <div className="lg:col-span-4 bg-[#2D2962]/40 border border-white/10 p-4 rounded-2xl space-y-6">
                    <span className="font-display font-medium text-xs text-white uppercase block">Math Wave Customizers</span>
                    <p className="text-[11px] text-slate-400">Configure parameters in real time. Dynamic coordinates are processed dynamically using custom math hooks.</p>

                    <div className="space-y-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono text-slate-400">
                          <span>Oscillation Freq (Hz):</span>
                          <span className="text-amber-400 font-bold">{waveFreq.toFixed(1)}Hz</span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="10.0"
                          step="0.5"
                          value={waveFreq}
                          onChange={(e) => setWaveFreq(parseFloat(e.target.value))}
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono text-slate-400">
                          <span>Maximum Amplitude (Px):</span>
                          <span className="text-amber-400 font-bold">{waveHeight}px</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          step="5"
                          value={waveHeight}
                          onChange={(e) => setWaveHeight(parseInt(e.target.value))}
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono text-slate-400">
                          <span>Phase Speed Delta:</span>
                          <span className="text-amber-400 font-bold">{waveSpeed.toFixed(1)}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.0"
                          max="10.0"
                          step="0.5"
                          value={waveSpeed}
                          onChange={(e) => setWaveSpeed(parseFloat(e.target.value))}
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono text-slate-400">
                          <span>Geometric Vertices:</span>
                          <span className="text-amber-400 font-bold">{waveNodes} points</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="200"
                          step="10"
                          value={waveNodes}
                          onChange={(e) => setWaveNodes(parseInt(e.target.value))}
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-8 bg-[#2D2962]/40 border border-white/10 rounded-2xl p-4 overflow-hidden flex flex-col justify-between min-h-[300px]">
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest font-bold">Active SVG Trigonometry Shader Plot</span>
                      <span className="text-[9px] font-mono text-[#7C3AED] font-bold">Y = Sin(X * f + offset) + Cos(X * 1.5)</span>
                    </div>

                    <div className="flex-1 flex items-center justify-center py-6">
                      <svg className="w-full h-44" viewBox="0 0 600 300">
                        <line x1="0" y1="150" x2="600" y2="150" stroke="#12102e" strokeWidth="1" />
                        <line x1="0" y1="75" x2="600" y2="75" stroke="#0e0c20" strokeWidth="1" strokeDasharray="4 4" />
                        <line x1="0" y1="225" x2="600" y2="225" stroke="#0e0c20" strokeWidth="1" strokeDasharray="4 4" />

                        <path
                          d={generateWavePath()}
                          fill="none"
                          stroke="#7C3AED"
                          strokeWidth="3.5"
                          opacity="0.3"
                          className="blur-md"
                        />

                        <path
                          d={generateWavePath()}
                          fill="none"
                          stroke="#F59E0B"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex justify-between text-[10px] font-mono text-slate-500 font-bold">
                      <span>SLA Latency: ~0.4ms</span>
                      <span>Calculated Points: {waveNodes * 2} vectors</span>
                    </div>
                  </div>
                </div>
              )}

              {/* edge streaming logs */}
              {selectedExperimentTab === 'terminal' && (
                <div className="space-y-4" id="terminal_sandbox_ui">
                  
                  <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-[#050411] border border-indigo-950/80 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setIsLogStreaming(!isLogStreaming)}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                          isLogStreaming 
                            ? 'bg-amber-400 text-black hover:bg-amber-300' 
                            : 'bg-indigo-950 text-amber-400 border border-indigo-900 hover:bg-indigo-900'
                        }`}
                      >
                        {isLogStreaming ? (
                          <>
                            <Pause className="w-3.5 h-3.5 fill-current" />
                            <span>HALT LOG AGENT</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>ACTIVATE AGENT</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setTerminalLogs([])}
                        className="p-1.5 bg-indigo-950/80 border border-indigo-900 rounded-lg hover:text-red-400 transition-colors text-slate-400 cursor-pointer"
                        title="Erase Log Terminal Screen"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Stream Speeds Dial:</span>
                      <div className="flex items-center space-x-1">
                        {[1, 3, 5, 8].map((hz) => (
                          <button
                            key={hz}
                            onClick={() => setStreamHz(hz)}
                            className={`px-2 py-1 rounded text-[10px] font-mono border transition-all cursor-pointer ${
                              streamHz === hz 
                                ? 'bg-purple-950 border-purple-500 text-purple-300 font-bold' 
                                : 'bg-black/40 border-indigo-950 text-slate-500 hover:text-white'
                            }`}
                          >
                            {hz}Hz
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={logFilterQuery}
                        onChange={(e) => setLogFilterQuery(e.target.value)}
                        placeholder="Grep pattern filter..."
                        className="bg-[#0b0a1f] border border-indigo-950 rounded-xl px-3 py-1 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#7C3AED] font-mono"
                      />
                    </div>
                  </div>

                  <div className="bg-[#050410] border border-indigo-950 rounded-2xl p-4 font-mono text-xs text-[#a5b4fc] h-72 overflow-y-auto space-y-1 shadow-inner relative flex flex-col pt-8">
                    <div className="absolute top-0 left-0 right-0 h-6 bg-indigo-950/60 border-b border-indigo-950 flex items-center px-4 justify-between select-none">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="w-2 h-2 rounded-full bg-yellow-500" />
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                      </div>
                      <span className="text-[8px] text-slate-500 tracking-wider">ROOT_VM@ROUTER_NODE</span>
                    </div>

                    <div className="flex-1 space-y-1 pt-2">
                      {terminalLogs
                        .filter(log => log.toLowerCase().includes(logFilterQuery.toLowerCase()))
                        .map((log, idx) => {
                          let logColorClass = 'text-[#a5b4fc]';
                          if (log.includes('Status 500')) logColorClass = 'text-red-400 font-boldClassName';
                          else if (log.includes('Status 404')) logColorClass = 'text-orange-400';
                          else if (log.includes('[COGNITIVE]')) logColorClass = 'text-purple-300';
                          else if (log.includes('okay')) logColorClass = 'text-emerald-400';

                          return (
                            <div key={idx} className="flex items-start space-x-2 leading-relaxed font-mono">
                              <ChevronRight className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                              <span className={logColorClass}>{log}</span>
                            </div>
                          );
                        })}
                      <div ref={logTerminalBottomRef} />
                    </div>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* =========================================================
          ADMIN SYSTEM PANEL (MANAGE CLIENT ACCOUNTS - INGRESS GATE)
          ========================================================= */}
      {showAdminConsoleInModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black border-2 border-purple-500/35 rounded-3xl p-6 max-w-3xl w-full max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl relative text-left"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-amber-400" />
                <h3 className="font-display font-medium text-lg text-white">Security Admin Control Console</h3>
              </div>
              <button
                onClick={() => {
                  setShowAdminConsoleInModal(false);
                  setAdminFeedback(null);
                }}
                className="p-1 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-slate-400 hover:text-white transition-all text-xs font-mono cursor-pointer"
              >
                DISMISS
              </button>
            </div>

            {/* Admin Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Form Col: Index New Profile */}
              <div className="lg:col-span-5 bg-[#2D2962]/20 border border-white/10 p-4 rounded-2xl h-fit space-y-4">
                <span className="font-mono text-[10px] text-amber-400 tracking-wider uppercase font-bold flex items-center space-x-1">
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Index New Operator</span>
                </span>

                {adminFeedback && (
                  <div className={`p-2.5 rounded-xl border text-[10px] font-mono font-medium ${
                    adminFeedback.type === 'ok' 
                      ? 'bg-emerald-950/20 border-emerald-500/35 text-emerald-400' 
                      : 'bg-red-950/20 border-red-500/35 text-red-400'
                  }`}>
                    {adminFeedback.text}
                  </div>
                )}

                <form onSubmit={handleCreateUser} className="space-y-3 font-mono text-xs text-slate-300">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wide">Unique Login ID</label>
                    <input
                      type="text"
                      required
                      value={newUserId}
                      onChange={(e) => setNewUserId(e.target.value)}
                      placeholder="e.g. sarah_vp"
                      className="w-full bg-black/40 border border-white/10 focus:border-purple-500 rounded-lg px-3 py-1.5 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wide">Operator Public Name</label>
                    <input
                      type="text"
                      required
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="Sarah Jenkins"
                      className="w-full bg-black/40 border border-white/10 focus:border-purple-500 rounded-lg px-3 py-1.5 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wide">Security Phrase / Password</label>
                    <input
                      type="text"
                      required
                      value={newUserPass}
                      onChange={(e) => setNewUserPass(e.target.value)}
                      placeholder="e.g. royal_gold321"
                      className="w-full bg-black/40 border border-white/10 focus:border-purple-500 rounded-lg px-3 py-1.5 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center space-x-2 select-none pt-1">
                    <input
                      type="checkbox"
                      id="isAdminCheck"
                      checked={newUserIsAdmin}
                      onChange={(e) => setNewUserIsAdmin(e.target.checked)}
                      className="rounded border-white/10 bg-blackaccent-purple-600 h-3.5 w-3.5 cursor-pointer"
                    />
                    <label htmlFor="isAdminCheck" className="text-[10px] text-slate-400 cursor-pointer font-bold">Grant Administrator coordinates</label>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-2 bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-semibold text-[11px] rounded-lg border border-purple-500 hover:opacity-95 transition-all uppercase tracking-wider cursor-pointer font-sans"
                  >
                    Deploy Operator Profile
                  </button>
                </form>
              </div>

              {/* List Col: Manage Operator Registries */}
              <div className="lg:col-span-7 space-y-4">
                <span className="font-mono text-[10px] text-slate-400 uppercase font-semibold block">Indexed Security Coordinates Table</span>
                
                <div className="border border-white/5 rounded-2xl overflow-hidden bg-black/40">
                  <div className="grid grid-cols-12 gap-1 bg-white/5 p-2 font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider border-b border-white/10 select-none">
                    <div className="col-span-5">Public Operator</div>
                    <div className="col-span-4 text-center">Status Index</div>
                    <div className="col-span-3 text-right">Coordinate Rules</div>
                  </div>

                  <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
                    {users.map((profile, i) => (
                      <div key={i} className="grid grid-cols-12 gap-1 p-2.5 items-center font-mono text-[10px]">
                        {/* Bio */}
                        <div className="col-span-5 space-y-0.5">
                          <span className="text-white font-sans font-bold block leading-none">{profile.userName}</span>
                          <span className="text-[9px] text-slate-500 block leading-none pt-0.5">ID: <strong className="text-purple-300 font-medium">{profile.userId}</strong></span>
                          <span className="text-[8px] text-slate-500 block leading-none">Code: {profile.userPass}</span>
                        </div>

                        {/* Status Toggle control */}
                        <div className="col-span-4 text-center">
                          <button
                            type="button"
                            onClick={() => toggleUserStatus(profile.userId)}
                            className={`px-2 py-1 rounded-full text-[8.5px] font-bold border transition-all cursor-pointer uppercase ${
                              profile.isActive 
                                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20 hover:bg-emerald-900/40' 
                                : 'bg-red-950/40 text-red-400 border-red-500/20 hover:bg-red-900/40'
                            }`}
                          >
                            {profile.isActive ? 'Active // Approved' : 'Deactivated'}
                          </button>
                        </div>

                        {/* purging logs */}
                        <div className="col-span-3 text-right flex items-center justify-end gap-2">
                          {profile.isAdmin && (
                            <span className="text-[8px] border border-amber-500/30 text-amber-400 px-1.5 py-0.5 rounded uppercase font-bold leading-none select-none bg-amber-950/10">
                              Admin
                            </span>
                          )}
                          <button
                            onClick={() => deleteUserRecord(profile.userId)}
                            className="p-1 text-slate-400 hover:text-red-400 bg-white/5 hover:bg-white/10 border border-white/5 rounded transition-all cursor-pointer"
                            title="Delete user config permanent"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-[9px] text-slate-500 font-sans leading-relaxed select-none">
                  * Note: Administrative controls and deactivations take effect immediately. Deactivated profiles are denied security access and will be rejected at the Ingress Gate.
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}

    </section>
  );
}

// =============================================================
// SUB-COMPONENTS FOR ANIMATIVE EXCELLENCE
// =============================================================
interface WelcomeGateProps {
  userName: string;
  onRedirect: () => void;
}

function WelcomeGate({ userName, onRedirect }: WelcomeGateProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRedirect();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onRedirect]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-md mx-auto py-12 flex justify-center items-center text-center select-none"
    >
      <div className="glass-panel border-2 border-amber-400 bg-black/45 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden royal-glow">
        {/* Particle circles */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* Pulsing check ring */}
        <div className="relative flex justify-center">
          <div className="absolute inset-0 w-16 h-16 rounded-full bg-amber-400/20 blur-md animate-ping mx-auto" />
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-950 to-[#2D2962] border-2 border-amber-400 flex items-center justify-center relative z-10 shadow-lg"
          >
            <CheckCircle className="w-8 h-8 text-amber-400" />
          </motion.div>
        </div>

        <div className="space-y-2">
          <span className="font-mono text-[9px] text-emerald-400 tracking-widest block font-bold animate-pulse">
            TRANSMISSION ESTABLISHED MATCH_OK
          </span>
          <h3 className="font-display font-medium text-2xl text-white">
            Welcome Back, <span className="text-amber-400 font-bold">{userName}</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans font-light">
            Security authorization token granted successfully. Syncing cluster ports and compiling live laboratory viewports...
          </p>
        </div>

        {/* Linear Loading progression */}
        <div className="pt-3 w-4/5 mx-auto">
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-purple-500 via-amber-400 to-yellow-500"
            />
          </div>
          <span className="text-[8px] font-mono text-slate-500 mt-2 block tracking-wider uppercase">Loading R&amp;D Sandbox assets...</span>
        </div>
      </div>
    </motion.div>
  );
}
