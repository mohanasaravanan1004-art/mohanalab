/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check,
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
  ArrowRight,
  Code,
  Database,
  BookOpen,
  Award,
  Send,
  CheckSquare,
  History
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
  // STUDENT WORKSPACE DASHBOARD STATES & MODEL TYPES
  // -------------------------------------------------------------
  interface StudentTask {
    id: number;
    title: string;
    lab: 'web' | 'ui' | 'database' | 'submission';
    status: 'Pending' | 'Completed';
  }

  interface ProjectSubmission {
    id: string;
    title: string;
    labCategory: 'Web Development' | 'UI/UX Design' | 'Database Management';
    codeSnippet: string;
    operatorNotes: string;
    submittedAt: string;
    status: 'Graded' | 'Reviewing';
  }

  const [studentTasks, setStudentTasks] = useState<StudentTask[]>([
    { id: 1, title: 'Implement dynamic layout color scheme in Web Dev Lab', lab: 'web', status: 'Completed' },
    { id: 2, title: 'Design a Royal Purple and Gold glow button in UI/UX Lab', lab: 'ui', status: 'Pending' },
    { id: 3, title: "Run high-fidelity query: SELECT * FROM tasks", lab: 'database', status: 'Pending' },
    { id: 4, title: 'Submit compiled Lab projects folder in central repository', lab: 'submission', status: 'Pending' },
  ]);

  const [activityLogs, setActivityLogs] = useState<Array<{ id: number; text: string; time: string }>>([
    { id: 1, text: 'Authorized via security gateway - Access Code accepted', time: 'Just now' },
    { id: 2, text: 'Welcome screen completed - Auto redirected', time: 'Just now' },
    { id: 3, text: 'Web Dev Lab setup initiated successfully', time: '2 mins ago' },
  ]);

  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([
    {
      id: 'SUB-1082',
      title: 'Vapor Wave Shader Layout',
      labCategory: 'Web Development',
      codeSnippet: 'const Canvas = () => <div className="bg-purple-950 p-4 border border-amber-400">Vapor Wave</div>',
      operatorNotes: 'Completed layout as specified. Incorporated glowing gradients and custom fonts.',
      submittedAt: '10 minutes ago',
      status: 'Reviewing'
    }
  ]);

  const [workspaceTab, setWorkspaceTab] = useState<'dashboard' | 'web-lab' | 'ui-lab' | 'db-lab' | 'submit'>('dashboard');

  // Web Dev Lab presets and sliders:
  const [webPreset, setWebPreset] = useState<'badge' | 'button' | 'card'>('badge');
  const [webTitle, setWebTitle] = useState('Luxury VIP Entrance Trigger');
  const [webTheme, setWebTheme] = useState<'gold' | 'purple' | 'emerald'>('gold');
  const [webRadius, setWebRadius] = useState<'none' | 'md' | 'full'>('full');
  const [webIconEnabled, setWebIconEnabled] = useState(true);

  // New interactive code compiler sandbox states
  const [webEditorMode, setWebEditorMode] = useState<'builder' | 'compiler'>('compiler');
  const [sandboxCode, setSandboxCode] = useState<string>(`<div class="p-6 bg-gradient-to-br from-slate-900 via-[#1E1B4B]/70 to-[#0F172A] border border-purple-500/30 rounded-2xl shadow-2xl max-w-sm mx-auto text-left space-y-4">
  <div class="flex items-center space-x-2">
    <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-md shadow-emerald-400/50"></span>
    <span class="text-[9px] font-mono tracking-widest text-[#10B981] font-bold uppercase">LIVE OUTPUT WORKING</span>
  </div>
  
  <h3 class="text-base font-sans font-bold text-white tracking-tight">Mohana Developer Lab</h3>
  
  <p class="text-xs text-slate-300 leading-relaxed font-sans">
    Type your custom code on the left! It renders instantaneously on the right. Try changing the text, colors, shapes, or buttons.
  </p>
  
  <div class="pt-3 border-t border-white/10 flex items-center justify-between">
    <button class="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-purple-950 font-sans font-bold hover:from-amber-300 hover:to-yellow-400 rounded-lg text-xs transition-colors duration-200 shadow-md">
      Interactive Button
    </button>
    <span class="text-[9px] font-mono text-zinc-500">v1.1.0_SLA</span>
  </div>
</div>`);

  // UI/UX Lab controller:
  const [uxRadius, setUxRadius] = useState<number>(16);
  const [uxBorderColor, setUxBorderColor] = useState<string>('#F59E0B');
  const [uxOpacity, setUxOpacity] = useState<number>(30);
  const [uxShadowValue, setUxShadowValue] = useState<'none' | 'sm' | 'md' | 'lg' | 'glowing-gold'>('glowing-gold');
  const [uxCopySuccess, setUxCopySuccess] = useState(false);

  // Database emulator:
  const [dbSQLInput, setDbSQLInput] = useState('SELECT * FROM tasks');
  const [dbQueryResult, setDbQueryResult] = useState<Array<Record<string, any>>>([
    { id: 1, title: 'Implement dynamic layout color scheme', lab: 'web', status: 'Completed' },
    { id: 2, title: 'Design a Royal Purple and Gold button', lab: 'ui', status: 'Pending' },
    { id: 3, title: 'Run high-fidelity query', lab: 'database', status: 'Pending' },
    { id: 4, title: 'Submit compiled Lab projects', lab: 'submission', status: 'Pending' }
  ]);
  const [dbFeedback, setDbFeedback] = useState<string>('Emulator initialized. Database tables: "tasks", "students", "submissions" are responsive.');

  // Project submissions states:
  const [subFormTitle, setSubFormTitle] = useState('');
  const [subFormCategory, setSubFormCategory] = useState<'Web Development' | 'UI/UX Design' | 'Database Management'>('Web Development');
  const [subFormCode, setSubFormCode] = useState('');
  const [subFormNotes, setSubFormNotes] = useState('');
  const [subFormAlert, setSubFormAlert] = useState<string | null>(null);

  // Helper actions
  const handleToggleTask = (id: number) => {
    setStudentTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
        const newLog = {
          id: Date.now(),
          text: `Task state updated: Changed "${t.title}" to ${nextStatus}`,
          time: 'Just now'
        };
        setActivityLogs(logs => [newLog, ...logs]);
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const handleProjectSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!subFormTitle.trim() || !subFormCode.trim()) {
      setSubFormAlert('Please enter a submission title and provide the project code contents.');
      return;
    }
    const newSub: ProjectSubmission = {
      id: `SUB-${Math.floor(1000 + Math.random() * 9000)}`,
      title: subFormTitle,
      labCategory: subFormCategory,
      codeSnippet: subFormCode,
      operatorNotes: subFormNotes,
      submittedAt: 'Just now',
      status: 'Reviewing'
    };
    setSubmissions([newSub, ...submissions]);
    
    // Add activity log
    const newLog = {
      id: Date.now(),
      text: `Submitted project: ${subFormTitle} in ${subFormCategory}`,
      time: 'Just now'
    };
    setActivityLogs(logs => [newLog, ...logs]);

    // Also auto check task number 4 (submission task) as completed!
    setStudentTasks(prev => prev.map(t => {
      if (t.lab === 'submission') {
        return { ...t, status: 'Completed' };
      }
      return t;
    }));

    setSubFormTitle('');
    setSubFormCode('');
    setSubFormNotes('');
    setSubFormAlert('Project submitted successfully! Grader queues updated.');
    setTimeout(() => setSubFormAlert(null), 4000);
  };

  const handleRunSQL = () => {
    const cleanSQL = dbSQLInput.trim().toLowerCase();
    
    // Activity log entry
    const newLog = {
      id: Date.now(),
      text: `Executed SQL Query: "${dbSQLInput}"`,
      time: 'Just now'
    };
    setActivityLogs(logs => [newLog, ...logs]);

    if (cleanSQL.includes('select') && cleanSQL.includes('students')) {
      setDbQueryResult(
        users.map(u => ({
          student_id: u.userId,
          fullName: u.userName,
          authorized: u.isActive ? 'TRUE' : 'FALSE',
          classRank: u.isAdmin ? 'Lead Instructor' : 'Lab Student'
        }))
      );
      setDbFeedback('Table: "students" fetched successfully. Running index query: OK.');
    } else if (cleanSQL.includes('select') && cleanSQL.includes('submissions')) {
      setDbQueryResult(
        submissions.map(s => ({
          sub_id: s.id,
          project: s.title,
          lab: s.labCategory,
          status_tag: s.status,
          date: s.submittedAt
        }))
      );
      setDbFeedback('Table: "submissions" retrieved. Rendering virtual cache grid.');
    } else if (cleanSQL.includes('select') && cleanSQL.includes('tasks')) {
      setDbQueryResult(
        studentTasks.map(t => ({
          task_id: t.id,
          task_text: t.title,
          category: t.lab,
          fulfillment_status: t.status
        }))
      );
      // Auto check Database Lab task as Completed!
      setStudentTasks(prev => prev.map(t => {
        if (t.lab === 'database') {
          return { ...t, status: 'Completed' };
        }
        return t;
      }));
      setDbFeedback('Table: "tasks" fetched successfully. Task status check: Completed.');
    } else if (cleanSQL.includes('update') && cleanSQL.includes('tasks')) {
      // Simulate generic UPDATE
      setStudentTasks(prev => prev.map(t => {
        if (cleanSQL.includes('web') && t.lab === 'web') return { ...t, status: 'Completed' };
        if (cleanSQL.includes('ui') && t.lab === 'ui') return { ...t, status: 'Completed' };
        return t;
      }));
      setDbQueryResult([{ rows_affected: 1, action: 'UPDATE', status: 'SUCCESS' }]);
      setDbFeedback(`UPDATE statement compiled correctly. Modified 1 virtual row inside the live viewport.`);
    } else if (cleanSQL.includes('insert')) {
      setDbQueryResult([{ id: 100 + Math.floor(Math.random() * 900), action: 'INSERT', code: 'Row Created' }]);
      setDbFeedback('INSERT statement complete. Registered new record coordinates inside temporary stack frame.');
    } else {
      setDbQueryResult([{ message: "Command compiled with generic return status" }]);
      setDbFeedback('Command simulated successfully. Emulator recognized general SQL syntax.');
    }
  };

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
            {/* 1. ROYAL HEADER & STUDENT PROFILE HEADER CARD */}
            <div className="bg-gradient-to-r from-purple-950 via-[#1e144a] to-black border-2 border-amber-400 p-5 rounded-3xl flex flex-col md:flex-row md:items-center md:justify-between gap-5 select-none relative overflow-hidden royal-glow animate-fade-in">
              <div className="absolute top-0 right-0 w-96 h-32 bg-gradient-to-l from-amber-400/10 to-transparent blur-3xl pointer-events-none" />
              <div className="absolute -bottom-8 left-10 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center space-x-4 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 border-2 border-purple-900 flex items-center justify-center overflow-hidden font-display font-black text-purple-950 shadow-md transform hover:rotate-3 transition-transform text-xl">
                  {currentUser.userName.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                      Student Operator ID: #{currentUser.userId}
                    </span>
                    <span className="text-[8px] font-mono font-bold px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/10 rounded uppercase tracking-wider animate-pulse select-none">
                      Sec_OK
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-white">
                    Welcome Back, <span className="text-amber-400 font-extrabold">{currentUser.userName}</span>
                  </h3>
                  <p className="text-gray-300 text-xs font-light font-sans mt-0.5 animate-pulse">
                    Authorized Profile • Academic Sandbox Center
                  </p>
                </div>
              </div>

              {/* Control Action Buttons */}
              <div className="flex items-center gap-2 relative z-10">
                {currentUser.isAdmin && (
                  <button
                    onClick={() => setShowAdminConsoleInModal(true)}
                    className="flex items-center space-x-1.5 px-4 py-2.5 bg-purple-900/60 border border-purple-500/40 text-amber-400 hover:text-white hover:bg-purple-800 rounded-xl text-xs font-mono font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Settings className="w-4 h-4 shrink-0" />
                    <span>Admin Controls</span>
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 px-4 py-2.5 bg-red-950/40 border border-red-500/35 text-red-300 hover:text-white hover:bg-red-900/50 rounded-xl text-xs font-mono font-semibold transition-all active:scale-95 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Logout Space</span>
                </button>
              </div>
            </div>

            {/* 2. TABBED NAVIGATION LAYOUT */}
            <div className="flex flex-wrap gap-2 border-b border-white/5 pb-2">
              {[
                { id: 'dashboard', label: '📋 Dashboard Hub' },
                { id: 'web-lab', label: '🌐 Web Development Lab' },
                { id: 'ui-lab', label: '🎨 UI/UX Design Lab' },
                { id: 'db-lab', label: '💾 SQL Database Lab' },
                { id: 'submit', label: '📤 Project Submission' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setWorkspaceTab(tab.id as any)}
                  className={`px-4 py-3 border rounded-xl text-xs font-mono font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                    workspaceTab === tab.id
                      ? 'bg-gradient-to-b from-[#2E1065] to-purple-950 border-amber-400 text-amber-400 shadow-xl'
                      : 'bg-black/40 border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Render Sandbox UI stage wrapper */}
            <div className="glass-panel border-white/10 bg-black/25 rounded-3xl p-6 min-h-[440px] relative">
              
              {/* 3. DYNAMIC TAB CONTAINER CONTENTS */}
              <AnimatePresence mode="wait">
                
                {/* --- PORTAL A: OVERVIEW DASHBOARD HUB --- */}
                {workspaceTab === 'dashboard' && (
                  <motion.div
                    key="tab_dashboard"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in"
                  >
                    {/* Left stats & list section */}
                    <div className="lg:col-span-7 space-y-6">
                      
                      {/* Progress Tracker Card */}
                      <div className="glass-panel border-white/10 bg-black/40 rounded-3xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5 text-left font-sans">
                            <span className="font-mono text-[9px] text-amber-400 tracking-wider block font-bold uppercase">Dynamic Completion Rate</span>
                            <h4 className="font-display font-medium text-lg text-white">Laboratory Progress Tracker</h4>
                          </div>
                          <div className="bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono font-black text-xl px-3 py-1 rounded-2xl select-none">
                            {Math.floor((studentTasks.filter(t => t.status === 'Completed').length / studentTasks.length) * 100)}%
                          </div>
                        </div>

                        {/* Bar indicator */}
                        <div className="space-y-1.5">
                          <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/15">
                            <div 
                              style={{ width: `${(studentTasks.filter(t => t.status === 'Completed').length / studentTasks.length) * 105 / 100}%` }}
                              className="h-full bg-gradient-to-r from-purple-600 via-amber-400 to-yellow-500 rounded-full transition-all duration-500 shadow-inner"
                            />
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 select-none">
                            <span>Progress: {studentTasks.filter(t => t.status === 'Completed').length} of {studentTasks.length} tasks matching</span>
                            <span className="text-amber-400 font-bold uppercase">Standard SLA Achieved</span>
                          </div>
                        </div>

                        {/* Micro specs info cards */}
                        <div className="grid grid-cols-3 gap-3 pt-2">
                          <div className="bg-white/5 border border-white/5 p-3 rounded-2xl text-center space-y-1 select-none">
                            <span className="text-[10px] text-zinc-400 font-sans block">Assigned Labs</span>
                            <span className="font-mono text-sm text-purple-400 font-black block">3 Active</span>
                          </div>
                          <div className="bg-white/5 border border-white/5 p-3 rounded-2xl text-center space-y-1 select-none">
                            <span className="text-[10px] text-zinc-400 font-sans block">Uploaded Files</span>
                            <span className="font-mono text-sm text-yellow-400 font-black block">{submissions.length} Logged</span>
                          </div>
                          <div className="bg-white/5 border border-white/5 p-3 rounded-2xl text-center space-y-1 select-none">
                            <span className="text-[10px] text-zinc-400 font-sans block">Current Status</span>
                            <span className="font-mono text-[10.5px] text-emerald-400 font-bold uppercase block tracking-wider animate-pulse pt-0.5">Excelling</span>
                          </div>
                        </div>
                      </div>

                      {/* Assigned Tasks Card */}
                      <div className="glass-panel border-white/10 bg-black/40 rounded-3xl p-6 space-y-4">
                        <div>
                          <span className="font-mono text-[9px] text-purple-400 tracking-wider block font-bold uppercase text-left">Fulfillment Actions Required</span>
                          <h4 className="font-display font-medium text-lg text-white text-left">Your Assigned Laboratory Tasks</h4>
                          <p className="text-xs text-zinc-400 text-left mt-0.5">Toggle task checkmarks manually to update course requirements and dynamically increase completion marks.</p>
                        </div>

                        <div className="space-y-2.5">
                          {studentTasks.map(task => (
                            <div 
                              key={task.id}
                              onClick={() => handleToggleTask(task.id)}
                              className="bg-purple-950/10 border border-white/5 hover:border-purple-500/20 rounded-2xl p-3.5 flex items-center justify-between gap-4 transition-all hover:bg-purple-950/20 cursor-pointer text-left select-none group"
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                  task.status === 'Completed'
                                    ? 'bg-amber-400 border-yellow-500 text-purple-950 scale-105 shadow-md shadow-amber-400/20'
                                    : 'border-zinc-600 bg-black group-hover:border-amber-400'
                                }`}>
                                  {task.status === 'Completed' && <Check className="w-4 h-4 text-purple-950" />}
                                </div>
                                <div>
                                  <span className={`font-sans text-xs transition-colors block ${task.status === 'Completed' ? 'line-through text-stone-400' : 'text-stone-100 group-hover:text-amber-400'}`}>{task.title}</span>
                                  <span className="text-[9px] font-mono uppercase font-bold text-amber-500">
                                    Lab Category: {task.lab.toUpperCase()}
                                  </span>
                                </div>
                              </div>

                              <span className={`text-[9px] font-mono px-2 py-0.5 rounded border select-none ${
                                task.status === 'Completed'
                                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
                                  : 'bg-amber-950/20 border-amber-500/30 text-amber-400'
                              }`}>
                                {task.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Right side activity, calendar and general specs */}
                    <div className="lg:col-span-5 space-y-6">
                      
                      {/* Quick Access Card */}
                      <div className="glass-panel border-purple-500/30 bg-purple-950/10 rounded-3xl p-5 space-y-4">
                        <span className="font-mono text-[9px] text-amber-400 tracking-wider block font-bold uppercase text-left">Academic Sandbox Quick Launcher</span>
                        <h4 className="font-display font-medium text-md text-white text-left">Jump Directly to Sandbox Labs</h4>
                        
                        <div className="grid grid-cols-1 gap-2">
                          <button 
                            onClick={() => setWorkspaceTab('web-lab')}
                            className="p-3 bg-black/40 hover:bg-[#1E1B4B]/30 border border-white/5 rounded-xl flex items-center justify-between text-left text-xs transition-colors cursor-pointer"
                          >
                            <div className="flex items-center space-x-2.5">
                              <Code className="w-4 h-4 text-amber-400" />
                              <span className="text-zinc-200 font-medium">1. Web Design / HTML View Editor</span>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                          </button>

                          <button 
                            onClick={() => setWorkspaceTab('ui-lab')}
                            className="p-3 bg-black/40 hover:bg-[#1E1B4B]/30 border border-white/5 rounded-xl flex items-center justify-between text-left text-xs transition-colors cursor-pointer"
                          >
                            <div className="flex items-center space-x-2.5">
                              <SlidersHorizontal className="w-4 h-4 text-purple-400" />
                              <span className="text-zinc-200 font-medium">2. CSS Styling / UX Slider Lab</span>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                          </button>

                          <button 
                            onClick={() => setWorkspaceTab('db-lab')}
                            className="p-3 bg-black/40 hover:bg-[#1E1B4B]/30 border border-white/5 rounded-xl flex items-center justify-between text-left text-xs transition-colors cursor-pointer"
                          >
                            <div className="flex items-center space-x-2.5">
                              <Database className="w-4 h-4 text-zinc-400" />
                              <span className="text-zinc-200 font-medium">3. Relational SQL Emulator Gate</span>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                          </button>
                        </div>
                      </div>

                      {/* Recent Activity Card */}
                      <div className="glass-panel border-white/10 bg-black/40 rounded-3xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-display font-medium text-sm text-white">Recent Security Activity</h4>
                          <span className="text-[9px] font-mono bg-white/5 border border-white/10 px-2.5 py-0.5 rounded text-amber-400 uppercase font-bold select-none">Audit Valid</span>
                        </div>

                        <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                          {activityLogs.map((log) => (
                            <div key={log.id} className="border-l-2 border-amber-400 pl-3.5 space-y-0.5 text-left">
                              <p className="text-xs text-stone-200 font-sans leading-tight">{log.text}</p>
                              <span className="text-[9px] font-mono text-zinc-500 block">{log.time}</span>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => setActivityLogs([{ id: Date.now(), text: 'System diagnostics complete. Logs flushed.', time: 'Just now' }])}
                          className="w-full py-1.5 bg-white/5 border border-white/5 rounded-xl text-[10px] tracking-widest font-mono hover:bg-white/10 text-stone-400 uppercase font-bold cursor-pointer transition-colors"
                        >
                          Flush Activity History
                        </button>
                      </div>

                    </div>
                  </motion.div>
                )}

                 {/* --- PORTAL B: WEB DEVELOPMENT LAB --- */}
                {workspaceTab === 'web-lab' && (
                  <motion.div
                    key="tab_web"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="bg-purple-950/25 border border-purple-900/40 p-5 rounded-2xl text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <span className="font-mono text-[9px] text-[#F59E0B] tracking-wider block font-bold uppercase animate-pulse">Module 1. HTML Rendering Compiler</span>
                        <h3 className="font-display font-medium text-lg text-white">Interactive Client Sandbox View Editor</h3>
                        <p className="text-xs text-slate-300 font-light mt-0.5 leading-relaxed">
                          Type raw HTML/CSS custom components below to compile and view renders with global Tailwind classes side-by-side in real-time.
                        </p>
                      </div>
                      <div className="flex bg-black/55 p-1 border border-white/10 rounded-xl shrink-0 gap-1 font-mono">
                        <button
                          onClick={() => setWebEditorMode('compiler')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            webEditorMode === 'compiler'
                              ? 'bg-amber-400 text-purple-950 shadow-md font-black hover:opacity-95'
                              : 'text-zinc-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          💻 Edit Code
                        </button>
                        <button
                          onClick={() => setWebEditorMode('builder')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            webEditorMode === 'builder'
                              ? 'bg-amber-400 text-purple-950 shadow-md font-black hover:opacity-95'
                              : 'text-zinc-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          🎨 Form Builder
                        </button>
                      </div>
                    </div>

                    {webEditorMode === 'compiler' ? (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* 1. CODE EDITOR STAGE - LEFT COLUMN */}
                        <div className="lg:col-span-7 flex flex-col space-y-4 text-left">
                          
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
                            <div className="flex items-center space-x-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                              <span className="font-mono text-[10.5px] font-bold text-slate-200">index.html (HTML-TAILWIND EDITOR)</span>
                            </div>
                            
                            {/* Code snippet templates widgets */}
                            <div className="flex items-center space-x-1 font-mono">
                              <span className="text-[8.5px] text-zinc-500 font-bold uppercase mr-1">Templates:</span>
                              {[
                                { label: 'Card', code: `<div class="p-6 bg-gradient-to-br from-slate-900 to-indigo-950 border border-purple-500/20 rounded-2xl shadow-xl max-w-sm text-left space-y-3">\n  <div class="flex items-center justify-between">\n    <span class="text-[9px] font-mono tracking-widest text-[#10B981] font-bold uppercase">SECURED DEVICE</span>\n    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30"></span>\n  </div>\n  <h4 class="text-sm font-sans font-extrabold text-white">Security Console Logs</h4>\n  <p class="text-xs text-slate-300 leading-relaxed font-sans">Active telemetry buffers compiled successfully. Port 3000 mapping validated automatically against local configurations.</p>\n  <button class="w-full py-1.5 bg-[#F59E0B] hover:bg-[#D97706] text-purple-950 font-bold font-sans text-xs rounded-xl transition-all active:scale-[0.98]">Acknowledge Telemetry</button>\n</div>` },
                                { label: 'Mini Form', code: `<div class="p-5 bg-slate-950 border border-white/10 rounded-2xl max-w-xs space-y-3.5">\n  <span class="text-[9px] font-mono text-[#F59E0B] font-bold uppercase tracking-wider block">SECURED ENTRANCE GATE</span>\n  <div class="space-y-1.5">\n    <label class="font-mono text-[9px] text-zinc-400 uppercase font-black block">Operator Passcode</label>\n    <input type="password" value="masterpoint" class="w-full bg-black border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-[#F59E0B] outline-none" readonly />\n  </div>\n  <button class="w-full py-2 bg-gradient-to-r from-purple-700 to-indigo-700 hover:opacity-95 text-white font-mono text-[10.5px] font-black uppercase rounded border border-purple-500/40">Authorize Access</button>\n</div>` },
                                { label: 'Status Badge', code: `<div class="flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider select-none w-fit animate-pulse">\n  <span>●</span>\n  <span>SLA_STATUS: ACTIVE</span>\n</div>` },
                                { label: 'Banner Notification', code: `<div class="p-4 bg-gradient-to-r from-[#2E1065] to-slate-900 border border-purple-500/30 rounded-xl max-w-sm text-left flex items-start gap-3">\n  <div class="p-1.5 bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs rounded-lg">✨</div>\n  <div>\n    <h5 class="text-xs font-bold text-stone-100 font-sans">Compiling Success!</h5>\n    <p class="text-[10px] text-stone-400 leading-normal font-sans">The virtual DOM sandbox rendered the elements in 8.3 milliseconds.</p>\n  </div>\n</div>` }
                              ].map((snip) => (
                                <button
                                  key={snip.label}
                                  onClick={() => {
                                    setSandboxCode(snip.code);
                                    const logEntry = {
                                      id: Date.now(),
                                      text: `Sandbox compiler injected "${snip.label}" preset code template.`,
                                      time: 'Just now'
                                    };
                                    setActivityLogs(logs => [logEntry, ...logs]);
                                  }}
                                  className="px-2 py-1 bg-white/5 border border-white/5 hover:border-amber-400/40 hover:text-amber-400 text-zinc-400 text-[9.5px] rounded font-bold cursor-pointer transition-colors"
                                >
                                  {snip.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Line gutter + code area wrapper */}
                          <div className="relative flex bg-[#030612] border border-white/10 rounded-2xl overflow-hidden shadow-2xl font-mono">
                            {/* Lines indicators */}
                            <div className="bg-black/40 border-r border-white/5 py-4 pl-3.5 pr-2.5 select-none text-right text-[10px] text-zinc-600 min-w-[36px] flex flex-col leading-6 select-none font-bold">
                              {Array.from({ length: Math.max(14, sandboxCode.split('\n').length) }).map((_, i) => (
                                <div key={i} className="h-6 flex items-center justify-end">{i + 1}</div>
                              ))}
                            </div>

                            {/* Raw Interactive Code Area */}
                            <textarea
                              value={sandboxCode}
                              onChange={(e) => setSandboxCode(e.target.value)}
                              placeholder="<!-- Type custom HTML containing Tailwind CSS styles here... -->"
                              className="w-full bg-transparent focus:outline-none text-[11.5px] font-mono p-4 text-emerald-400 min-h-[380px] leading-6 resize-none outline-none caret-amber-400 select-text"
                              spellCheck={false}
                            />
                          </div>

                          {/* Utility actions underneath code block */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/40 p-4 rounded-xl border border-white/5">
                            <div className="font-sans">
                              <p className="text-xs font-bold text-zinc-200">Academic Code Repository Stage</p>
                              <p className="text-[10px] text-zinc-400">Lock your sandbox code and load it directly into task submissions folder.</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {/* Reload original block */}
                              <button
                                onClick={() => {
                                  setSandboxCode(`<div class="p-6 bg-gradient-to-br from-slate-900 via-[#1E1B4B]/70 to-[#0F172A] border border-purple-500/30 rounded-2xl shadow-2xl max-w-sm mx-auto text-left space-y-4">
  <div class="flex items-center space-x-2">
    <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-md shadow-emerald-400/50"></span>
    <span class="text-[9px] font-mono tracking-widest text-[#10B981] font-bold uppercase">LIVE OUTPUT WORKING</span>
  </div>
  
  <h3 class="text-base font-sans font-bold text-white tracking-tight">Mohana Developer Lab</h3>
  
  <p class="text-xs text-slate-300 leading-relaxed font-sans">
    Type your custom code on the left! It renders instantaneously on the right. Try changing the text, colors, shapes, or buttons.
  </p>
  
  <div class="pt-3 border-t border-white/10 flex items-center justify-between">
    <button class="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-purple-950 font-sans font-bold hover:from-amber-300 hover:to-yellow-400 rounded-lg text-xs transition-colors duration-200 shadow-md">
      Interactive Button
    </button>
    <span class="text-[9px] font-mono text-zinc-500">v1.1.0_SLA</span>
  </div>
</div>`);
                                  const logEntry = {
                                    id: Date.now(),
                                    text: 'Restored original interactive template inside code editor canvas.',
                                    time: 'Just now'
                                  };
                                  setActivityLogs(logs => [logEntry, ...logs]);
                                }}
                                className="px-3 py-2 bg-red-950/20 border border-red-500/20 hover:bg-red-950/40 text-red-300 font-mono text-[9.5px] rounded-lg transition-colors cursor-pointer"
                              >
                                🔄 Clear Code
                              </button>

                              {/* Save sandbox submit link */}
                              <button
                                onClick={() => {
                                  setSubFormCode(sandboxCode);
                                  setSubFormCategory('Web Development');
                                  setSubFormTitle('Advanced Compiled HTML Dashboard Component');
                                  setSubFormNotes('Injected layout code compiled completely side-by-side inside the live client virtual DOM sandbox playground.');
                                  
                                  const logEntry = {
                                    id: Date.now(),
                                    text: 'Pushed active live sandbox HTML payload to direct form submission buffer',
                                    time: 'Just now'
                                  };
                                  setActivityLogs(logs => [logEntry, ...logs]);

                                  setStudentTasks(prev => prev.map(t => {
                                    if (t.lab === 'web') return { ...t, status: 'Completed' };
                                    return t;
                                  }));

                                  // Jump to submit screen
                                  setWorkspaceTab('submit');
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-[#2E1065] to-purple-800 hover:opacity-95 text-amber-400 font-mono text-[10px] uppercase font-bold rounded-lg border border-amber-400/30 tracking-wider shadow-lg shadow-purple-950/45 cursor-pointer transition-all"
                              >
                                📤 Submit Assignment Code
                              </button>
                            </div>
                          </div>

                        </div>

                        {/* 2. LIVE OUTPUT SANDBOX EMBED VIEW - RIGHT COLUMN */}
                        <div className="lg:col-span-5 flex flex-col space-y-4">
                          
                          {/* Live Render Frame Container */}
                          <div className="bg-[#080911] border border-white/10 rounded-2xl overflow-hidden flex flex-col min-h-[440px] h-full royal-glow relative">
                            {/* Browser-bar decoration chrome wrapper */}
                            <div className="bg-slate-950 px-4 py-3 border-b border-white/5 flex items-center justify-between select-none shrink-0">
                              <div className="flex items-center space-x-1.5 shrink-0">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                              </div>
                              <div className="flex-1 max-w-[210px] bg-black/60 border border-white/10 rounded px-2.5 py-0.5 text-[9px] font-mono text-zinc-500 truncate text-center">
                                http://localhost:3000/live_compile
                              </div>
                              <span className="text-[8px] font-mono bg-emerald-400/20 text-emerald-400 border border-emerald-400/30 px-2 py-0.5 rounded font-black select-none">
                                SECURE
                              </span>
                            </div>

                            {/* Viewport Core Renderer */}
                            <div className="flex-1 bg-[#0b0c16] p-6 flex items-center justify-center min-h-[280px] overflow-auto border-b border-white/5 relative">
                              <div className="absolute top-2 left-2 text-[8px] font-mono text-zinc-600 uppercase select-none font-bold">
                                Compile Sandbox View Frame (Live Render)
                              </div>

                              <div className="w-full">
                                {sandboxCode.trim() ? (
                                  <div 
                                    dangerouslySetInnerHTML={{ __html: sandboxCode }} 
                                    className="w-full"
                                  />
                                ) : (
                                  <div className="text-center space-y-2 py-12 select-none">
                                    <Terminal className="w-6 h-6 text-zinc-600 mx-auto animate-pulse" />
                                    <h5 className="font-mono text-[10.5px] text-zinc-500 font-extrabold uppercase">Waiting for input tokens...</h5>
                                    <p className="font-sans text-[10px] text-zinc-500 leading-normal max-w-[200px] mx-auto">Please enter code parameters on the left to initialize custom virtual DOM frames.</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Monitor Diagnostic Console Panel */}
                            <div className="bg-slate-950 p-4 shrink-0 text-left font-mono">
                              <div className="flex items-center justify-between text-[8px] text-zinc-500 font-bold uppercase border-b border-white/5 pb-2">
                                <span>Diagnostics HUD Terminal</span>
                                <span className="text-emerald-400 flex items-center space-x-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping mr-1" />
                                  <span>VIRTUAL_DOM_ONLINE</span>
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] text-zinc-500">
                                <div className="space-y-1">
                                  <p>• Lines Code: <span className="text-amber-400">{sandboxCode.split('\n').length} lines</span></p>
                                  <p>• Telemetry: <span className="text-[#10B981] font-bold">STABLE_3000</span></p>
                                </div>
                                <div className="space-y-1">
                                  <p>• Characters: <span className="text-amber-400">{sandboxCode.length}</span></p>
                                  <p>• Render API: <span className="text-[#10B981] font-bold">TAILWIND_V4</span></p>
                                </div>
                              </div>
                            </div>

                          </div>

                        </div>

                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* Controls Col */}
                        <div className="lg:col-span-5 bg-black/40 border border-white/5 p-5 rounded-2xl space-y-4 text-left">
                          
                          {/* Presets Choice */}
                          <div className="space-y-1 text-left font-mono">
                            <label className="text-[10px] text-zinc-400 uppercase font-bold block">Component Preset Node</label>
                            <div className="grid grid-cols-3 gap-1.5">
                              {['badge', 'button', 'card'].map((p: any) => (
                                <button
                                  key={p}
                                  onClick={() => {
                                    setWebPreset(p);
                                    if (p === 'badge') setWebTitle('Luxury VIP Entrance');
                                    if (p === 'button') setWebTitle('Verify Security Access');
                                    if (p === 'card') setWebTitle('Royal Crest Level 3 operator parameters configured matching SLA constraints.');
                                  }}
                                  className={`py-2 border text-[10.5px] rounded-lg transition-colors uppercase font-bold cursor-pointer ${
                                    webPreset === p
                                      ? 'bg-[#2E1065] border-amber-400 text-amber-400'
                                      : 'bg-black border-white/5 text-zinc-400 hover:text-white'
                                  }`}
                                >
                                  {p}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Input Text Title */}
                          <div className="space-y-1 text-left">
                            <label className="font-mono text-[10px] text-zinc-400 uppercase font-bold block">Label Header Inner HTML</label>
                            <input
                              type="text"
                              value={webTitle}
                              onChange={(e) => setWebTitle(e.target.value)}
                              placeholder="Type live text content..."
                              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-400 text-white font-mono"
                            />
                          </div>

                          {/* Theme Selection */}
                          <div className="space-y-1 text-left">
                            <label className="font-mono text-[10px] text-zinc-400 uppercase font-bold block">Theme Accent Shader</label>
                            <div className="grid grid-cols-3 gap-1.5">
                              {[
                                { id: 'gold', label: 'Gold Amber' },
                                { id: 'purple', label: 'Royal Purple' },
                                { id: 'emerald', label: 'Crypto Green' }
                              ].map(color => (
                                <button
                                  key={color.id}
                                  onClick={() => setWebTheme(color.id as any)}
                                  className={`py-1.5 border text-[10px] rounded-lg cursor-pointer font-bold ${
                                    webTheme === color.id
                                      ? 'bg-white border-amber-400 text-black'
                                      : 'bg-black border-white/5 text-slate-400 hover:text-white'
                                  }`}
                                >
                                  {color.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Radius Slider selection */}
                          <div className="space-y-1 text-left font-mono">
                            <label className="text-[10px] text-zinc-400 uppercase font-bold block">Corner Border Radius</label>
                            <div className="grid grid-cols-3 gap-1.5">
                              {['none', 'md', 'full'].map((rad: any) => (
                                <button
                                  key={rad}
                                  onClick={() => setWebRadius(rad)}
                                  className={`py-1.5 border text-[10px] rounded-lg cursor-pointer uppercase ${
                                    webRadius === rad
                                      ? 'bg-white border-amber-400 text-black font-extrabold'
                                      : 'bg-black border-white/5 text-slate-400 hover:text-white'
                                  }`}
                                >
                                  {rad}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Toggle icon constraint */}
                          <div className="flex items-center space-x-2 select-none justify-self-start text-left">
                            <input
                              type="checkbox"
                              id="icon_web_toggle"
                              checked={webIconEnabled}
                              onChange={(e) => setWebIconEnabled(e.target.checked)}
                              className="w-4 h-4 rounded border-white/10 bg-black accent-amber-400 cursor-pointer"
                            />
                            <label htmlFor="icon_web_toggle" className="text-[10px] font-mono text-zinc-300 font-bold cursor-pointer select-none">
                              Inject Sparkles Vector Icon
                            </label>
                          </div>

                          {/* Simulated Build Action */}
                          <button 
                            onClick={() => {
                              const logEntry = {
                                id: Date.now(),
                                text: `Compiled Web Dev component preset "${webPreset}" successfully`,
                                time: 'Just now'
                              };
                              setActivityLogs(logs => [logEntry, ...logs]);
                              
                              // Mark Web Dev task as completed!
                              setStudentTasks(prev => prev.map(t => {
                                if (t.lab === 'web') return { ...t, status: 'Completed' };
                                return t;
                              }));
                            }}
                            className="w-full py-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:opacity-95 text-white text-xs font-mono font-bold uppercase rounded-lg border border-purple-500 cursor-pointer tracking-wider"
                          >
                            Run Live Compilation Loop
                          </button>

                        </div>

                        {/* Rendering Sandbox Frame Output */}
                        <div className="lg:col-span-7 bg-[#2D2962]/10 border border-purple-500/10 rounded-2xl p-6 flex flex-col justify-between items-center min-h-[320px] relative overflow-hidden royal-glow">
                          <div className="absolute top-2 left-2 text-[8px] font-mono text-zinc-500 uppercase select-none font-bold">
                            Compiled Sandboxed Element // Preview Pane
                          </div>

                          <div className="absolute top-2 right-2 text-[8.5px] font-mono bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30 font-bold">
                            DOM_STATUS: 100% OK
                          </div>

                          {/* Display Arena */}
                          <div className="my-auto flex justify-center items-center w-full min-h-[160px]">
                            
                            {/* Rendering logic */}
                            {webPreset === 'badge' && (
                              <div className={`p-4 ${
                                webRadius === 'none' ? 'rounded-none' : webRadius === 'md' ? 'rounded-xl' : 'rounded-full'
                              } border-2 flex items-center space-x-2 transition-all duration-300 transform scale-110 shadow-lg ${
                                webTheme === 'gold' ? 'border-amber-400 bg-amber-950/20 text-amber-300 shadow-amber-400/5' :
                                webTheme === 'purple' ? 'border-purple-500 bg-purple-950/30 text-purple-200 shadow-purple-500/5' :
                                'border-emerald-400 bg-emerald-950/25 text-emerald-300 shadow-emerald-400/5'
                              }`}>
                                {webIconEnabled && <Sparkles className="w-4 h-4 shrink-0 animate-pulse text-amber-400" />}
                                <span className="text-xs font-bold font-mono uppercase tracking-widest">{webTitle}</span>
                              </div>
                            )}

                            {webPreset === 'button' && (
                              <button className={`px-6 py-3.5 ${
                                webRadius === 'none' ? 'rounded-none' : webRadius === 'md' ? 'rounded-xl' : 'rounded-full'
                              } border-2 flex items-center space-x-2 transition-all duration-300 font-mono font-black text-xs active:scale-95 shadow-md ${
                                webTheme === 'gold' ? 'bg-amber-400 border-yellow-500 text-purple-950 hover:bg-amber-300 shadow-amber-400/20' :
                                webTheme === 'purple' ? 'bg-purple-600 border-purple-400 text-white hover:bg-purple-500 shadow-purple-600/25' :
                                'bg-emerald-400 border-emerald-500 text-black hover:bg-emerald-300 shadow-emerald-400/15'
                              }`}>
                                {webIconEnabled && <Sparkles className="w-3.5 h-3.5 shrink-0" />}
                                <span>{webTitle}</span>
                              </button>
                            )}

                            {webPreset === 'card' && (
                              <div className={`max-w-md p-5 ${
                                webRadius === 'none' ? 'rounded-none' : webRadius === 'md' ? 'rounded-2xl' : 'rounded-[32px]'
                              } border flex flex-col space-y-3 transition-all duration-300 text-left bg-black shadow-xl ${
                                webTheme === 'gold' ? 'border-amber-400 shadow-amber-400/5' :
                                webTheme === 'purple' ? 'border-purple-600 shadow-purple-600/5' :
                                'border-emerald-400 shadow-emerald-400/5'
                              }`}>
                                <div className="flex items-center space-x-2">
                                  {webIconEnabled && <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />}
                                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#F59E0B]">OPERATOR DOSSIER</span>
                                </div>
                                <p className="text-xs text-stone-200 font-sans leading-relaxed text-left">
                                  {webTitle}
                                </p>
                                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                                  <span className="text-[8px] font-mono text-zinc-500">Security Ring Code Check</span>
                                  <span className={`text-[8.5px] font-mono px-2 py-0.5 rounded font-black ${
                                    webTheme === 'gold' ? 'bg-amber-400/10 text-amber-300' :
                                    webTheme === 'purple' ? 'bg-purple-600/10 text-purple-200' :
                                    'bg-emerald-400/10 text-emerald-400'
                                  }`}>ACCESS_APPROVED</span>
                                </div>
                              </div>
                            )}

                          </div>

                          {/* Generated HTML code viewer */}
                          <div className="w-full bg-black/50 border border-white/5 rounded-xl p-3 font-mono text-[10px] text-zinc-400 text-left select-text max-h-24 overflow-y-auto">
                            <span className="text-[7.5px] font-mono text-zinc-600 block mb-1 font-bold uppercase">Dynamic HTML Output:</span>
                            <code>
                              {webPreset === 'badge' && `<div class="p-4 ${webRadius === 'none' ? 'rounded-none' : webRadius === 'md' ? 'rounded-xl' : 'rounded-full'} border-2 flex items-center space-x-2 ${webTheme === 'gold' ? 'border-amber-400 bg-amber-950/20 text-amber-300' : webTheme === 'purple' ? 'border-purple-500 bg-purple-950/30 text-purple-200' : 'border-emerald-400 bg-emerald-950/25 text-emerald-300'}">\n  ${webIconEnabled ? '<svg class="sparkle"></svg>\n  ' : ''}<span class="text-xs font-bold font-mono tracking-widest">${webTitle}</span>\n</div>`}
                              {webPreset === 'button' && `<button class="px-6 py-3.5 ${webRadius === 'none' ? 'rounded-none' : webRadius === 'md' ? 'rounded-xl' : 'rounded-full'} border-2 flex items-center space-x-2 font-mono font-bold text-xs ${webTheme === 'gold' ? 'bg-amber-400 border-yellow-500 text-purple-950' : webTheme === 'purple' ? 'bg-purple-600 border-purple-400 text-white' : 'bg-emerald-400 border-emerald-500 text-black'}">\n  ${webIconEnabled ? '<svg class="sparkle"></svg>\n  ' : ''}<span>${webTitle}</span>\n</button>`}
                              {webPreset === 'card' && `<div class="max-w-md p-5 ${webRadius === 'none' ? 'rounded-none' : webRadius === 'md' ? 'rounded-2xl' : 'rounded-32'} border bg-black ${webTheme === 'gold' ? 'border-amber-400' : webTheme === 'purple' ? 'border-purple-600' : 'border-emerald-400'}">\n  <p class="text-xs text-stone-200">${webTitle}</p>\n</div>`}
                            </code>
                          </div>
                        </div>

                      </div>
                    )}
                  </motion.div>
                )}

                {/* --- PORTAL C: UI/UX GLASS LAB --- */}
                {workspaceTab === 'ui-lab' && (
                  <motion.div
                    key="tab_ui"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="bg-purple-950/25 border border-purple-900/40 p-4 rounded-2xl text-left">
                      <span className="font-mono text-[9px] text-[#F59E0B] tracking-wider block font-bold uppercase animate-pulse">Module 2. Interface System Tokens Controller</span>
                      <h3 className="font-display font-medium text-lg text-white">Dynamic UI/UX Styling &amp; Shader Canvas</h3>
                      <p className="text-xs text-slate-300 font-light mt-0.5 leading-relaxed">
                        Fine-tune styling vectors live! Extract CSS design variables, export compiled class names, and understand spatial alignments inside standard desktop interfaces.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      
                      {/* Controls */}
                      <div className="lg:col-span-5 bg-black/40 border border-white/5 p-5 rounded-2xl space-y-4">
                        
                        {/* Radius Slider selection */}
                        <div className="space-y-1 text-left font-sans">
                          <div className="flex items-center justify-between">
                            <label className="font-mono text-[10px] text-zinc-400 uppercase font-bold">Corner Radius Token</label>
                            <span className="text-[10px] font-mono font-bold text-amber-400">{uxRadius}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="48"
                            value={uxRadius}
                            onChange={(e) => setUxRadius(parseInt(e.target.value))}
                            className="w-full accent-amber-400 bg-neutral-900 h-1.5 rounded-lg cursor-pointer animate-pulse"
                          />
                        </div>

                        {/* Hex Color Border Choice */}
                        <div className="space-y-1.5 text-left font-mono">
                          <label className="text-[10px] text-zinc-400 uppercase font-bold block">Gold Border Hex Coordinate</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={uxBorderColor}
                              onChange={(e) => setUxBorderColor(e.target.value)}
                              className="w-8 h-8 rounded border border-white/10 bg-transparent cursor-pointer"
                            />
                            <input
                              type="text"
                              value={uxBorderColor}
                              onChange={(e) => setUxBorderColor(e.target.value)}
                              className="bg-black focus:outline-none focus:border-amber-400 border border-white/10 rounded px-2.5 py-1 text-xs font-mono text-white tracking-widest w-28 uppercase select-text"
                            />
                          </div>
                        </div>

                        {/* Opacity slider */}
                        <div className="space-y-1 text-left font-sans">
                          <div className="flex items-center justify-between">
                            <label className="font-mono text-[10px] text-zinc-400 uppercase font-bold">Background Glass Opacity</label>
                            <span className="text-[10px] font-mono font-bold text-amber-400">{uxOpacity}%</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="95"
                            value={uxOpacity}
                            onChange={(e) => setUxOpacity(parseInt(e.target.value))}
                            className="w-full accent-amber-400 bg-neutral-900 h-1.5 rounded-lg cursor-pointer"
                          />
                        </div>

                        {/* Shadow Presets */}
                        <div className="space-y-1 text-left font-mono">
                          <label className="text-[10px] text-zinc-400 uppercase font-bold block">Box Shadow Accent</label>
                          <div className="grid grid-cols-2 gap-1.5">
                            {[
                              { id: 'none', label: 'Flat Zero' },
                              { id: 'sm', label: 'Ambient Standard' },
                              { id: 'lg', label: 'Deep Spatial' },
                              { id: 'glowing-gold', label: 'Royal Gold Glow' }
                            ].map(sh => (
                              <button
                                key={sh.id}
                                onClick={() => setUxShadowValue(sh.id as any)}
                                className={`py-1.5 border text-[10px] rounded-lg cursor-pointer font-bold transition-all ${
                                  uxShadowValue === sh.id
                                    ? 'bg-[#2E1065] border-amber-400 text-amber-400 font-extrabold shadow-md'
                                    : 'bg-black border-white/5 text-zinc-400 hover:text-white'
                                }`}
                              >
                                {sh.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Simulated code copies */}
                        <div className="pt-2">
                          <button
                            onClick={() => {
                              setUxCopySuccess(true);
                              setTimeout(() => setUxCopySuccess(false), 2000);
                              
                              // Log event
                              const newLog = {
                                id: Date.now(),
                                text: 'Copied compiled Tailwind tokens to system clipboard.',
                                time: 'Just now'
                              };
                              setActivityLogs(logs => [newLog, ...logs]);

                              // Mark UI/UX tab task as completed!
                              setStudentTasks(prev => prev.map(t => {
                                if (t.lab === 'ui') return { ...t, status: 'Completed' };
                                return t;
                              }));
                            }}
                            className="w-full py-2 bg-gradient-to-r from-purple-700 to-indigo-700 border border-purple-500/40 text-white hover:text-white font-mono font-semibold text-xs rounded-xl cursor-pointer transition-all uppercase tracking-wider"
                          >
                            {uxCopySuccess ? '🎉 Successfully Copied!' : '📋 Copy Style Token Code'}
                          </button>
                        </div>

                      </div>

                      {/* Designer Stage Arena */}
                      <div className="lg:col-span-7 bg-[#2D2962]/5 border border-white/5 rounded-2xl p-6 flex flex-col justify-between items-center min-h-[340px] relative overflow-hidden royal-glow">
                        
                        <div className="absolute top-2 left-2 text-[8px] font-mono text-zinc-500 select-none font-bold uppercase">
                          Dynamic UI/UX Canvas Preview Node
                        </div>

                        {/* Master CSS display box styled directly by our variables */}
                        <div className="my-auto flex justify-center items-center w-full">
                          <div 
                            style={{
                              borderRadius: `${uxRadius}px`,
                              borderWidth: '2px',
                              borderColor: uxBorderColor,
                              backgroundColor: `rgba(11, 10, 31, ${uxOpacity / 100})`,
                              boxShadow: uxShadowValue === 'glowing-gold' 
                                ? `0 10px 30px -5px ${uxBorderColor}44, 0 1px 12px 1px ${uxBorderColor}55`
                                : uxShadowValue === 'lg' ? '0 15px 35px rgba(0,0,0,0.6)'
                                : uxShadowValue === 'sm' ? '0 5px 12px rgba(0,0,0,0.3)'
                                : 'none'
                            }}
                            className="p-8 max-w-sm text-left space-y-4 select-none transition-all duration-200 hover:scale-105 transform cursor-pointer border-solid"
                          >
                            <div className="flex items-center space-x-2">
                              <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: uxBorderColor }} />
                              <span className="font-mono text-[9px] uppercase tracking-widest text-[#F59E0B] font-extrabold font-mono">Royal Shader Sandbox</span>
                            </div>
                            
                            <h4 className="font-display font-bold text-white text-md tracking-tight leading-snug">
                              The visual outcome coordinates are calculated dynamically.
                            </h4>
                            
                            <p className="text-[11px] text-stone-300 font-sans leading-relaxed">
                              Fine border and spatial corner vectors directly control customer conversion rates and reduce cognitive visual stress coordinates.
                            </p>

                            <div className="pt-2 flex items-center justify-between border-t border-white/15 font-sans">
                              <span className="text-[9px] font-mono text-zinc-400">Class String Code</span>
                              <span className="text-[10px] font-mono font-bold" style={{ color: uxBorderColor }}>STYLE_OK</span>
                            </div>
                          </div>
                        </div>

                        {/* Code string block */}
                        <div className="w-full bg-black border border-white/5 p-2 rounded-xl text-left select-text max-h-24 overflow-y-auto">
                          <span className="text-[7px] font-mono text-zinc-600 block mb-0.5 font-bold uppercase">Resulting Tailwind CSS classes:</span>
                          <code className="text-[9.5px] font-mono text-amber-400 font-medium whitespace-pre-wrap">
                            {`border-2 border-[${uxBorderColor}] bg-black/${uxOpacity} rounded-[${uxRadius}px] ${
                              uxShadowValue === 'glowing-gold' ? 'shadow-lg shadow-amber-400/20' :
                              uxShadowValue === 'lg' ? 'shadow-2xl' :
                              uxShadowValue === 'sm' ? 'shadow-md' : 'shadow-none'
                            }`}
                          </code>
                        </div>

                      </div>

                    </div>
                  </motion.div>
                )}

                {/* --- PORTAL D: DATABASE SQL LAB --- */}
                {workspaceTab === 'db-lab' && (
                  <motion.div
                    key="tab_db"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="bg-purple-950/25 border border-purple-900/40 p-4 rounded-2xl text-left text-sans">
                      <span className="font-mono text-[9px] text-amber-400 tracking-wider block font-bold uppercase animate-pulse">Module 3. Virtual Relational Database Tables Emulator</span>
                      <h3 className="font-display font-medium text-lg text-white font-bold">SQL Database Command Terminal Console</h3>
                      <p className="text-xs text-slate-300 font-light mt-0.5 leading-relaxed">
                        Construct SQL schemas, execute standard SELECT queries, run targeted updates inside the sandbox, and inspect structural tabular results.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      
                      {/* Console & SQL Inputs */}
                      <div className="lg:col-span-5 bg-black/50 border border-white/5 p-5 rounded-2xl space-y-4">
                        
                        {/* Database Table Schemas help */}
                        <div className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-2 text-left select-none">
                          <span className="text-[9px] font-mono tracking-widest block text-purple-400 font-bold uppercase">AVAILABLE VIRTUAL TABLES</span>
                          
                          <div className="grid grid-cols-3 gap-1 font-mono text-[8.5px] text-zinc-400">
                            <div className="p-1 border border-white/5 rounded text-center select-none bg-black/40">
                              <strong className="text-white block">tasks</strong>
                              <span>4 columns</span>
                            </div>
                            <div className="p-1 border border-white/5 rounded text-center select-none bg-black/40">
                              <strong className="text-white block">students</strong>
                              <span>4 columns</span>
                            </div>
                            <div className="p-1 border border-white/5 rounded text-center select-none bg-black/40">
                              <strong className="text-white block">submissions</strong>
                              <span>5 columns</span>
                            </div>
                          </div>
                        </div>

                        {/* Query preset buttons */}
                        <div className="space-y-1.5 text-left font-mono">
                          <label className="text-[9px] text-zinc-400 uppercase font-bold block">SQL Query Preset Quick Pick</label>
                          <div className="flex flex-wrap gap-1.5 animate-fade-in">
                            {[
                              'SELECT * FROM tasks',
                              'SELECT * FROM students',
                              'SELECT * FROM submissions'
                            ].map((sqlText) => (
                              <button
                                key={sqlText}
                                onClick={() => setDbSQLInput(sqlText)}
                                className="px-2.5 py-1 bg-neutral-900 border border-white/5 text-[9.5px] font-mono text-amber-200 rounded-lg hover:border-amber-400 transition-colors uppercase font-bold cursor-pointer"
                              >
                                {sqlText.split('FROM')[1].trim()} preset
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Input SQL Area */}
                        <div className="space-y-1 text-left">
                          <label className="font-mono text-[10px] text-zinc-400 uppercase font-bold block">SQL Command Line Terminal</label>
                          <textarea
                            rows={3}
                            value={dbSQLInput}
                            onChange={(e) => setDbSQLInput(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-lg p-3 text-xs font-mono focus:outline-none focus:border-amber-400 text-green-400 uppercase select-text"
                            placeholder="Type SQL command here..."
                          />
                        </div>

                        {/* Execute and Feedback buttons */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={handleRunSQL}
                            className="flex-1 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:opacity-95 text-white font-mono font-bold text-xs rounded-lg border border-purple-500 cursor-pointer uppercase tracking-wider h-10"
                          >
                            Execute Query CMD
                          </button>
                          <button
                            onClick={() => {
                              setDbSQLInput('SELECT * FROM tasks');
                              setDbQueryResult([
                                { id: 1, title: 'Check tasks list works', status: 'OK' }
                              ]);
                              setDbFeedback('Terminal inputs cleared. SQL tables are ready.');
                            }}
                            className="py-2.5 px-3 bg-white/5 border border-white/10 hover:bg-[#1E1B4B]/30 h-10 rounded-lg text-[10.5px] font-mono text-zinc-400 cursor-pointer uppercase font-bold"
                            title="Reset Terminal"
                          >
                            Clear
                          </button>
                        </div>

                      </div>

                      {/* Query Response Visual grid table columns */}
                      <div className="lg:col-span-7 bg-[#2D2962]/5 border border-purple-500/10 rounded-2xl p-5 flex flex-col justify-between min-h-[340px] relative overflow-hidden royal-glow">
                        
                        <div className="absolute top-2 left-2 text-[8px] font-mono text-zinc-500 select-none font-bold uppercase">
                          SQL QUERY RESPONSE VIEWER
                        </div>

                        <div className="border border-white/5 rounded-xl overflow-hidden bg-black/40 mt-6 flex-1 min-h-[180px] max-h-[220px] overflow-y-auto w-full select-text text-left">
                          
                          {dbQueryResult.length > 0 ? (
                            <div className="min-w-full">
                              {/* Table Header Row columns */}
                              <div className="bg-white/5 border-b border-white/10 grid grid-flow-col auto-cols-fr p-2 font-mono text-[8px] text-amber-300 font-extrabold uppercase tracking-wider select-none">
                                {Object.keys(dbQueryResult[0]).map((key) => (
                                  <div key={key} className="truncate px-1">{key}</div>
                                ))}
                              </div>

                              {/* Table Body rows */}
                              <div className="divide-y divide-white/5">
                                {dbQueryResult.map((row, idx) => (
                                  <div key={idx} className="grid grid-flow-col auto-cols-fr p-2 font-mono text-[9.5px] text-stone-200">
                                    {Object.values(row).map((val: any, cellIdx) => (
                                      <div key={cellIdx} className="truncate px-1">
                                        {val === true || val === 'TRUE' ? (
                                          <span className="text-emerald-400 font-bold">TRUE</span>
                                        ) : val === false || val === 'FALSE' ? (
                                          <span className="text-red-400 font-bold">FALSE</span>
                                        ) : val === 'Completed' || val === 'SUCCESS' ? (
                                          <span className="bg-emerald-950/20 text-emerald-400 border border-emerald-500/20 px-1 py-0.5 rounded text-[8px] font-extrabold">OK</span>
                                        ) : val === 'Reviewing' || val === 'Pending' ? (
                                          <span className="bg-amber-950/20 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded text-[8px] font-extrabold animate-pulse">PENDING</span>
                                        ) : (
                                          String(val)
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center p-12 text-zinc-500 font-mono text-xs select-none">
                              Empty Set. Select a database table preset above.
                            </div>
                          )}

                        </div>

                        {/* Query Status Code feedback */}
                        <div className="w-full bg-[#1A1845]/40 border border-purple-500/10 p-3 rounded-lg text-left mt-3 font-mono text-[10px] space-y-1 select-none">
                          <span className="text-[8px] font-mono text-amber-400 tracking-wider font-black block uppercase">SQL PROCESSOR STATUS LOGS:</span>
                          <p className="text-zinc-300 font-medium">
                            👉 {dbFeedback}
                          </p>
                        </div>

                      </div>

                    </div>
                  </motion.div>
                )}

                {/* --- PORTAL E: LAB PROJECT SUBMISSIONS --- */}
                {workspaceTab === 'submit' && (
                  <motion.div
                    key="tab_submit"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                  >
                    
                    {/* Left submitting form area */}
                    <div className="lg:col-span-6 space-y-6 text-left">
                      <div className="glass-panel border-white/15 bg-black/40 rounded-3xl p-6 space-y-4">
                        
                        <div className="text-sans">
                          <span className="font-mono text-[9px] text-[#F59E0B] tracking-wider block font-bold uppercase">Central Registrar Submission</span>
                          <h4 className="font-display font-medium text-lg text-white">Project Submission Area</h4>
                          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                            Deploy completed laboratory code snippets, configuration text files, or active SQL schemas for final evaluation grading.
                          </p>
                        </div>

                        {subFormAlert && (
                          <div className="p-3 bg-emerald-950/20 border border-emerald-500/35 text-emerald-400 font-mono text-[10.5px] rounded-xl font-medium animate-pulse">
                            {subFormAlert}
                          </div>
                        )}

                        <form onSubmit={handleProjectSubmit} className="space-y-3 font-mono text-xs text-slate-300">
                          {/* Target Lab tracks */}
                          <div className="space-y-1 text-left">
                            <label className="text-[9px] uppercase tracking-wide font-extrabold text-purple-400 block">Select Laboratory Category Task</label>
                            <select
                              value={subFormCategory}
                              onChange={(e: any) => setSubFormCategory(e.target.value)}
                              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white font-sans focus:outline-none focus:border-amber-400 h-9"
                            >
                              <option value="Web Development">Web Development Lab</option>
                              <option value="UI/UX Design">UI/UX Design Lab</option>
                              <option value="Database Management">Database Management Lab</option>
                            </select>
                          </div>

                          {/* Title of Project submission */}
                          <div className="space-y-1 text-left">
                            <label className="text-[9px] uppercase tracking-wide font-bold block">Project Submission Title</label>
                            <input
                              type="text"
                              required
                              value={subFormTitle}
                              onChange={(e) => setSubFormTitle(e.target.value)}
                              placeholder="e.g., Responsive layout with capsule button presets"
                              className="w-full bg-black border border-white/10 focus:border-amber-400 rounded-lg px-3 py-2 focus:outline-none text-white select-text"
                            />
                          </div>

                          {/* Code submission box area */}
                          <div className="space-y-1 text-left">
                            <label className="text-[9px] uppercase tracking-wide font-bold block">Resulting Code Content / SQL text</label>
                            <textarea
                              rows={4}
                              required
                              value={subFormCode}
                              onChange={(e) => setSubFormCode(e.target.value)}
                              placeholder="Paste your compiled sandbox code, output styles, or active queries here..."
                              className="w-full bg-black border border-white/10 focus:border-amber-400 rounded-lg p-3 focus:outline-none text-[11px] text-white select-text font-mono"
                            />
                          </div>

                          {/* Comments remarks fields */}
                          <div className="space-y-1 text-left">
                            <label className="text-[9px] uppercase tracking-wide font-bold block">Operator Remarks Notes (Optional)</label>
                            <textarea
                              rows={2}
                              value={subFormNotes}
                              onChange={(e) => setSubFormNotes(e.target.value)}
                              placeholder="Add brief comments for the reviewing instructor..."
                              className="w-full bg-black border border-white/10 focus:border-amber-400 rounded-lg p-3 focus:outline-none text-[11px] text-white select-text font-mono"
                            />
                          </div>

                          {/* Submission button */}
                          <button
                            type="submit"
                            className="w-full py-2.5 bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 hover:opacity-95 text-white font-semibold rounded-lg border border-purple-500 flex items-center justify-center space-x-2 uppercase tracking-widest text-[10px] cursor-pointer h-10"
                          >
                            <Send className="w-4 h-4 text-amber-400 animate-pulse" />
                            <span>Transmit Lab Package</span>
                          </button>
                        </form>

                      </div>
                    </div>

                    {/* Right submitted projects history log */}
                    <div className="lg:col-span-6 space-y-6 text-left">
                      <div className="glass-panel border-white/10 bg-black/40 rounded-3xl p-6 space-y-4">
                        
                        <div className="flex items-center justify-between border-b border-white/5 pb-2 text-sans">
                          <div>
                            <span className="font-mono text-[9px] text-purple-400 tracking-wider block font-bold uppercase">Structural Submissions Log</span>
                            <h4 className="font-display font-medium text-lg text-white">Your Logged Submissions</h4>
                          </div>
                          <span className="text-[10px] font-mono bg-white/5 border border-white/5 px-2.5 py-1 text-zinc-400 rounded-lg font-bold select-none">
                            TOTAL: {submissions.length} FILES
                          </span>
                        </div>

                        {submissions.length > 0 ? (
                          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 animate-fade-in">
                            {submissions.map((sub) => (
                              <div 
                                key={sub.id} 
                                className="bg-purple-950/20 border border-white/5 p-4 rounded-xl space-y-3 hover:border-purple-500/20 transition-all select-text text-left"
                              >
                                <div className="flex items-center justify-between font-sans">
                                  <div className="space-y-0.5">
                                    <span className="text-[10.5px] font-mono text-amber-400 font-bold">REG_ID: #{sub.id}</span>
                                    <h5 className="font-bold text-white text-xs">{sub.title}</h5>
                                  </div>
                                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase font-extrabold ${
                                    sub.status === 'Graded' 
                                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' 
                                      : 'bg-amber-950/20 border-amber-500/30 text-amber-400'
                                  }`}>
                                    {sub.status}
                                  </span>
                                </div>

                                <div className="font-mono text-[9px] bg-black p-2.5 border border-white/10 rounded text-amber-300/90 whitespace-pre-wrap max-h-20 overflow-y-auto">
                                  {sub.codeSnippet}
                                </div>

                                {sub.operatorNotes && (
                                  <div className="text-[10px] text-zinc-300 font-sans border-t border-white/5 pt-2 leading-relaxed">
                                    <strong className="text-zinc-400">Comments:</strong> {sub.operatorNotes}
                                  </div>
                                )}

                                <div className="flex items-center justify-between text-[8px] font-mono text-zinc-500 pt-1">
                                  <span>Track: {sub.labCategory}</span>
                                  <span>Submitted: {sub.submittedAt}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-12 text-center text-zinc-500 font-mono text-xs select-none">
                            No logged submissions yet. Compile your sandbox assets and transmit them using the form.
                          </div>
                        )}

                      </div>
                    </div>

                  </motion.div>
                )}

              </AnimatePresence>

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
  const redirectRef = useRef(onRedirect);
  
  useEffect(() => {
    redirectRef.current = onRedirect;
  }, [onRedirect]);

  useEffect(() => {
    const timer = setTimeout(() => {
      redirectRef.current();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

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
              transition={{ duration: 3.0, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-purple-500 via-amber-400 to-yellow-500"
            />
          </div>
          <span className="text-[8px] font-mono text-slate-500 mt-2 block tracking-wider uppercase font-bold animate-pulse">Loading Workspace Sandbox...</span>
        </div>
      </div>
    </motion.div>
  );
}
