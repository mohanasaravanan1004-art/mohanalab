/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
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
  Brain
} from 'lucide-react';
import { LAB_EXPERIMENTS } from '../data';

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

export default function Labs() {
  const [activeExperimentTab, setActiveExperimentTab] = useState<'neural' | 'shader' | 'terminal'>('neural');

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
      // Formula combining prime wave harmonics
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
  const [streamHz, setStreamHz] = useState(1); // logs per sec
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
      setTerminalLogs(prev => [...prev, newLog].slice(-100)); // keep last 100 entries
    }, (1000 / streamHz));

    return () => clearInterval(streamInterval);
  }, [isLogStreaming, streamHz]);

  // Handle auto scrolling inside console screen
  useEffect(() => {
    if (logTerminalBottomRef.current) {
      logTerminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);


  return (
    <section className="relative py-20 px-4 md:px-8 bg-transparent">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/3 left-10 w-96 h-96 rounded-full glow-spot-1 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-4">
            <div className="inline-block bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              <span className="font-mono text-[9px] tracking-widest text-[#7C3AED] font-semibold uppercase">
                EXPERIMENTAL SYSTEMS
              </span>
            </div>
            <h2 className="font-display font-medium text-3xl text-white tracking-tight leading-tight">
              An Active Sandbox Dashboard <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-100 to-amber-300">
                Of Our Internals &amp; Algorithms
              </span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed">
              Experience the core mechanics supporting our architectural workflows: test nodes structures, wave harmonics, and streaming log trackers.
            </p>
          </div>

          {/* Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'neural', label: '1. Neural Net Node Linker', icon: Network },
              { id: 'shader', label: '2. Trigonometric SVG Waves', icon: SlidersHorizontal },
              { id: 'terminal', label: '3. Edge Server Diagnostic Console', icon: Terminal }
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveExperimentTab(tab.id as 'neural' | 'shader' | 'terminal')}
                  className={`flex items-center space-x-2 px-4 py-2 border rounded-xl text-xs font-mono font-medium tracking-wide transition-all ${
                    activeExperimentTab === tab.id
                      ? 'bg-purple-950/40 border-purple-500 text-amber-400 shadow-md shadow-purple-950'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <TabIcon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Sandbox Display Body */}
        <div className="glass-panel border-white/10 rounded-3xl p-6 min-h-[440px] relative">
          
          {/* ========= 1. NEURAL NODE FLOW SIMULATOR ========= */}
          {activeExperimentTab === 'neural' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="neural_sandbox_ui">
              
              {/* Config Controllers (4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                <span className="font-display font-medium text-xs text-white uppercase block">Neural Agent Nodes Panel</span>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Nodes represent processing stages in our agent logic flow maps. <strong>Click on a node card to select it</strong>, then click another node to construct or destroy connective pipelies.
                </p>

                {/* Insertion triggers */}
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => handleAddNode('vector')} className="p-2 border border-white/10 hover:border-[#7C3AED]/40 bg-[#2D2962]/40 hover:bg-white/10 text-left rounded-xl transition-all space-y-1">
                    <span className="text-[8px] font-mono text-cyan-400 block tracking-widest uppercase">/vector</span>
                    <span className="text-[10px] text-white font-medium block">Vector Store</span>
                  </button>
                  <button onClick={() => handleAddNode('llm')} className="p-2 border border-white/10 hover:border-[#7C3AED]/40 bg-[#2D2962]/40 hover:bg-white/10 text-left rounded-xl transition-all space-y-1">
                    <span className="text-[8px] font-mono text-purple-400 block tracking-widest uppercase">/llm-model</span>
                    <span className="text-[10px] text-white font-medium block">Reasoning Engine</span>
                  </button>
                  <button onClick={() => handleAddNode('filter')} className="p-2 border border-white/10 hover:border-[#7C3AED]/40 bg-[#2D2962]/40 hover:bg-white/10 text-left rounded-xl transition-all space-y-1">
                    <span className="text-[8px] font-mono text-yellow-400 block tracking-widest uppercase">/filter</span>
                    <span className="text-[10px] text-white font-medium block">Security Gate</span>
                  </button>
                  <button onClick={() => handleAddNode('endpoint')} className="p-2 border border-white/10 hover:border-[#7C3AED]/40 bg-[#2D2962]/40 hover:bg-white/10 text-left rounded-xl transition-all space-y-1">
                    <span className="text-[8px] font-mono text-emerald-400 block tracking-widest uppercase">/socket</span>
                    <span className="text-[10px] text-white font-medium block">Live Stream</span>
                  </button>
                </div>

                {/* Selected Action panel */}
                {selectedNodeId && (
                  <div className="bg-purple-950/20 border border-purple-900/60 p-3 rounded-2xl space-y-3">
                    <div className="flex items-center space-x-2 text-[11px]">
                      <Brain className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-white font-bold font-mono">SELECTED: {selectedNodeId}</span>
                    </div>
                    <p className="text-[9px] text-slate-400">Deploy positional modifiers to align nodes perfectly inside the visual flow grid.</p>
                    <div className="grid grid-cols-4 gap-1.5 text-center font-bold">
                      <button onClick={() => handleMoveNode(selectedNodeId, 'u')} className="bg-indigo-950 p-1 rounded text-xs hover:bg-indigo-900 shrink-0">▲</button>
                      <button onClick={() => handleMoveNode(selectedNodeId, 'd')} className="bg-indigo-950 p-1 rounded text-xs hover:bg-indigo-900 shrink-0">▼</button>
                      <button onClick={() => handleMoveNode(selectedNodeId, 'l')} className="bg-indigo-950 p-1 rounded text-xs hover:bg-indigo-900 shrink-0">◀</button>
                      <button onClick={() => handleMoveNode(selectedNodeId, 'r')} className="bg-indigo-950 p-1 rounded text-xs hover:bg-indigo-900 shrink-0">▶</button>
                    </div>
                  </div>
                )}

                {/* Reset Board */}
                <button
                  onClick={handleClearSandboxNodes}
                  className="w-full py-2 bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white rounded-xl text-xs font-mono font-bold tracking-widest uppercase transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Trash className="w-4 h-4" />
                  <span>Erase All Active Nodes</span>
                </button>
              </div>

              {/* Graphic SVG Stage (8 cols) */}
              <div className="lg:col-span-8 bg-[#2D2962]/40 border border-white/10 rounded-2xl p-4 overflow-hidden relative min-h-[300px]">
                <div className="absolute top-3 right-3 text-[9px] font-mono text-slate-500 bg-black/40 px-2 py-0.5 rounded border border-white/10">
                  BOUNDS: 600 x 300 COORDS
                </div>

                <svg className="w-full h-[280px]" viewBox="0 0 600 300">
                  {/* Connective render paths */}
                  {connections.map((conn, idx) => {
                    const fromNode = nodeItems.find(n => n.id === conn.from);
                    const toNode = nodeItems.find(n => n.id === conn.to);
                    if (!fromNode || !toNode) return null;
                    return (
                      <g key={idx}>
                        {/* Glow path */}
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
                        {/* Core vector line */}
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

                  {/* Render node objects */}
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
                        {/* Neon border circle */}
                        <circle 
                          r={isSelected ? 18 : 14} 
                          fill="#0b0a1f" 
                          stroke={isSelected ? '#F59E0B' : typeColor} 
                          strokeWidth="2" 
                          className="transition-all"
                        />
                        {/* Inner status beacon */}
                        <circle r="4" fill={typeColor} />
                        
                        {/* Name tags */}
                        <text
                          y="28"
                          textAnchor="middle"
                          fill="#ffff"
                          fontSize="9"
                          fontWeight="bold"
                          className="font-mono text-[9px] drop-shadow-md"
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

          {/* ========= 2. TRIGONOMETRIC WAVE EQUATIONS GENERATOR ========= */}
          {activeExperimentTab === 'shader' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="shader_sandbox_ui">
              
              {/* Slide controls (4 cols) */}
              <div className="lg:col-span-4 bg-[#2D2962]/40 border border-white/10 p-4 rounded-2xl space-y-6">
                <span className="font-display font-medium text-xs text-white uppercase block">Math Wave Customizers</span>
                <p className="text-[11px] text-slate-400">Configure parameters in real time. Dynamic coordinates are processed dynamically using custom math hooks.</p>

                {/* Controllers */}
                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>Oscillation Freq (Hz):</span>
                      <span className="text-amber-400">{waveFreq.toFixed(1)}Hz</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="10.0"
                      step="0.5"
                      value={waveFreq}
                      onChange={(e) => setWaveFreq(parseFloat(e.target.value))}
                      className="w-full accent-[#7C3AED]"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>Maximum Amplitude (Px):</span>
                      <span className="text-amber-400">{waveHeight}px</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={waveHeight}
                      onChange={(e) => setWaveHeight(parseInt(e.target.value))}
                      className="w-full accent-[#7C3AED]"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>Phase Speed Delta:</span>
                      <span className="text-amber-400">{waveSpeed.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="10.0"
                      step="0.5"
                      value={waveSpeed}
                      onChange={(e) => setWaveSpeed(parseFloat(e.target.value))}
                      className="w-full accent-[#7C3AED]"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>Geometric Vertices:</span>
                      <span className="text-amber-400">{waveNodes} points</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="200"
                      step="10"
                      value={waveNodes}
                      onChange={(e) => setWaveNodes(parseInt(e.target.value))}
                      className="w-full accent-[#7C3AED]"
                    />
                  </div>
                </div>
              </div>

              {/* Grid Stage Render (8 cols) */}
              <div className="lg:col-span-8 bg-[#2D2962]/40 border border-white/10 rounded-2xl p-4 overflow-hidden flex flex-col justify-between min-h-[300px]">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Active SVG Trigonometry Shader Plot</span>
                  <span className="text-[9px] font-mono text-[#7C3AED]">Y = Sin(X * f + offset) + Cos(X * 1.5)</span>
                </div>

                <div className="flex-1 flex items-center justify-center py-6">
                  <svg className="w-full h-44" viewBox="0 0 600 300">
                    {/* Background horizontal lines */}
                    <line x1="0" y1="150" x2="600" y2="150" stroke="#12102e" strokeWidth="1" />
                    <line x1="0" y1="75" x2="600" y2="75" stroke="#0e0c20" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="0" y1="225" x2="600" y2="225" stroke="#0e0c20" strokeWidth="1" strokeDasharray="4 4" />

                    {/* Glowing outer math path */}
                    <path
                      d={generateWavePath()}
                      fill="none"
                      stroke="#7C3AED"
                      strokeWidth="3.5"
                      opacity="0.3"
                      className="blur-md"
                    />

                    {/* Master math line path */}
                    <path
                      d={generateWavePath()}
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                <div className="pt-2 border-t border-white/10 flex justify-between text-[10px] font-mono text-slate-505">
                  <span>SLA Latency: ~0.4ms</span>
                  <span>Calculated Points: {waveNodes * 2} vectors</span>
                </div>
              </div>
            </div>
          )}

          {/* ========= 3. LIVE EDGE LOG CONSOLE ========= */}
          {activeExperimentTab === 'terminal' && (
            <div className="space-y-4" id="terminal_sandbox_ui">
              
              {/* Top Filters & controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-[#050411] border border-indigo-950/80 rounded-2xl">
                
                {/* Control switches */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsLogStreaming(!isLogStreaming)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                      isLogStreaming 
                        ? 'bg-amber-400 text-black' 
                        : 'bg-indigo-950 text-amber-400 border border-indigo-900'
                    }`}
                  >
                    {isLogStreaming ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>HALT AGENT</span>
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
                    className="p-1.5 bg-indigo-950/80 border border-indigo-900 rounded-lg hover:text-red-400 transition-colors text-gray-400"
                    title="Erase Log Terminal Screen"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>

                {/* Latency Dial */}
                <div className="flex items-center space-x-3">
                  <span className="text-[10px] font-mono text-gray-400 uppercase">Stream Speeds Dial:</span>
                  <div className="flex items-center space-x-1">
                    {[1, 3, 5, 8].map((hz) => (
                      <button
                        key={hz}
                        onClick={() => setStreamHz(hz)}
                        className={`px-2 py-1 rounded text-[10px] font-mono border transition-all ${
                          streamHz === hz 
                            ? 'bg-purple-950 border-purple-500 text-purple-300 font-bold' 
                            : 'bg-black/40 border-indigo-950 text-gray-600 hover:text-white'
                        }`}
                      >
                        {hz}Hz
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter bar */}
                <div>
                  <input
                    type="text"
                    value={logFilterQuery}
                    onChange={(e) => setLogFilterQuery(e.target.value)}
                    placeholder="Grep pattern filter..."
                    className="bg-[#0b0a1f] border border-indigo-950 rounded-xl px-3 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
              </div>

              {/* Raw Console Screen */}
              <div className="bg-[#050410] border border-indigo-950 rounded-2xl p-4 font-mono text-xs text-[#a5b4fc] h-72 overflow-y-auto space-y-1 shadow-inner relative flex flex-col pt-8">
                
                {/* Visual Glass Header bar */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-indigo-950/60 border-b border-indigo-950 flex items-center px-4 justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <span className="text-[8px] text-gray-600 tracking-wider">ROOT_VM@ROUTER_NODE</span>
                </div>

                <div className="flex-1 space-y-1 pt-2">
                  {terminalLogs
                    .filter(log => log.toLowerCase().includes(logFilterQuery.toLowerCase()))
                    .map((log, idx) => {
                      let logColorClass = 'text-[#a5b4fc]';
                      if (log.includes('Status 500')) logColorClass = 'text-red-400 font-bold';
                      else if (log.includes('Status 404')) logColorClass = 'text-orange-400';
                      else if (log.includes('[COGNITIVE]')) logColorClass = 'text-purple-300';
                      else if (log.includes('okay')) logColorClass = 'text-emerald-400';

                      return (
                        <div key={idx} className="flex items-start space-x-2 leading-relaxed">
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
      </div>
    </section>
  );
}
