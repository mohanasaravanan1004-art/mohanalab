/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  Square,
  Terminal as TerminalIcon, 
  FileCode, 
  Plus, 
  FolderPlus,
  FilePlus,
  Trash2, 
  Search, 
  Sparkles, 
  Cpu, 
  Clock, 
  Database, 
  Copy, 
  Bug, 
  Laptop, 
  RefreshCw, 
  ChevronRight, 
  ChevronDown,
  Check, 
  HelpCircle,
  Code,
  Folder,
  FolderOpen,
  Settings,
  Download,
  Upload,
  Layers,
  Split,
  Edit2,
  Info,
  Maximize2,
  Minimize2,
  Terminal,
  Activity,
  History,
  X,
  FileText
} from 'lucide-react';
import { PageId, CompilerProject, WorkspaceFile, ProgrammingLanguage } from '../types';

interface WorkspaceViewProps {
  htmlCode: string;
  setHtmlCode: (val: string) => void;
  cssCode: string;
  setCssCode: (val: string) => void;
  jsCode: string;
  setJsCode: (val: string) => void;
  logs: any[];
  setLogs: React.Dispatch<React.SetStateAction<any[]>>;
  useTailwind: boolean;
  setUseTailwind: (val: boolean) => void;
  viewportMode: 'desktop' | 'tablet' | 'mobile';
  setViewportMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  lastCompiledAt: string | null;
  runCompilerCompilation: () => void;
  triggerToastNotification: (msg: string) => void;
  setActivePage: (page: PageId) => void;
  
  // Advanced state models managed in parent
  projects: CompilerProject[];
  setProjects: React.Dispatch<React.SetStateAction<CompilerProject[]>>;
  activeProjectId: string;
  setActiveProjectId: (id: string) => void;
}

// Sidebar visual navigation tabs
type SidebarTab = 'explorer' | 'search' | 'copilot' | 'projects' | 'history' | 'settings';

// Terminal log entry definition
interface TerminalLine {
  text: string;
  type: 'info' | 'success' | 'error' | 'input' | 'raw';
}

// Tree view parsed item
interface TreeItem {
  id: string; // complete pathway
  name: string;
  isFolder: boolean;
  children?: TreeItem[];
  fileIndex?: number;
}

export default function WorkspaceView({
  htmlCode, setHtmlCode,
  cssCode, setCssCode,
  jsCode, setJsCode,
  logs, setLogs,
  useTailwind, setUseTailwind,
  viewportMode, setViewportMode,
  lastCompiledAt,
  runCompilerCompilation,
  triggerToastNotification,
  setActivePage,
  projects, setProjects,
  activeProjectId, setActiveProjectId
}: WorkspaceViewProps) {

  // Current active project lookup
  const activeProj = projects.find(p => p.id === activeProjectId) || projects[0];

  // ================= VS CODE WORKSPACE CORE STATES =================
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>('explorer');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [splitActive, setSplitActive] = useState(false);
  const [splitActiveFileName, setSplitActiveFileName] = useState<string>('');
  
  // Custom Editor Properties Settings
  const [editorFontSize, setEditorFontSize] = useState<number>(13);
  const [minimapEnabled, setMinimapEnabled] = useState<boolean>(true);
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [wordWrap, setWordWrap] = useState<'on' | 'off'>('on');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(false);

  // Search and replace code variables
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');

  // Sandbox compiling & metrics configurations
  const [stdinBuffer, setStdinBuffer] = useState('');
  const [runStatus, setRunStatus] = useState<'idle' | 'running' | 'success' | 'error' | 'stopped'>('idle');
  const [execTime, setExecTime] = useState<string | null>(null);
  const [memUsed, setMemUsed] = useState<string | null>(null);
  const [stdoutLogs, setStdoutLogs] = useState<string>('');
  const [stderrLogs, setStderrLogs] = useState<string>('');

  // Interactive AI utility parameters
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiChatLogs, setAiChatLogs] = useState<{role: 'user' | 'assistant', text: string}[]>([
    { role: 'assistant', text: "👋 Greetings! I am standard Gemini space copilot for Vertex Online Compiler. Select any code block or let me look over the current workspace to locate syntax problems, explain logical algorithms, or refactor script branches." }
  ]);
  const [aiInputText, setAiInputText] = useState('');

  // Directory visual structures (expanded and empty virtual directories states)
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [emptyFolders, setEmptyFolders] = useState<string[]>([]);
  const [creationPath, setCreationPath] = useState<{parentDirPath: string, isFolderCreation: boolean} | null>(null);
  const [creationName, setCreationName] = useState('');
  const [renamingFilePath, setRenamingFilePath] = useState<string | null>(null);
  const [renamingValue, setRenamingValue] = useState('');

  // Bottom Interactive Bash-Terminal simulator states
  const [consoleActiveTab, setConsoleActiveTab] = useState<'stdout' | 'stderr' | 'terminal' | 'stdin' | 'metrics'>('stdout');
  const [terminalHistory, setTerminalHistory] = useState<TerminalLine[]>([
    { text: "🖥️ Vertex Online Sandbox Shell v1.45.0-AMD64", type: 'raw' },
    { text: "Type 'help' to audit system instructions or list executable macros.", type: 'info' },
    { text: "guest@vertex-sandbox:~$ ", type: 'raw' }
  ]);
  const [terminalInputValue, setTerminalInputValue] = useState('');
  const terminalBottomRef = useRef<HTMLDivElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  // Initialize tabs when project active file swaps
  useEffect(() => {
    if (activeProj && activeProj.activeFileName) {
      if (!openTabs.includes(activeProj.activeFileName)) {
        setOpenTabs(prev => [...prev, activeProj.activeFileName]);
      }
    }
  }, [activeProj?.activeFileName]);

  // Clean local visual compiler previews when project changes
  useEffect(() => {
    if (activeProj && activeProj.language === 'html') {
      setTimeout(() => { runCompilerCompilation(); }, 250);
    }
  }, [activeProjectId]);

  // Auto-Save script intervals checks
  useEffect(() => {
    if (!autoSaveEnabled) return;
    const interval = setInterval(() => {
      triggerToastNotification("Workspace auto-saved seamlessly. Cloud caches refreshed.");
    }, 15000);
    return () => clearInterval(interval);
  }, [autoSaveEnabled]);

  // Scroll to terminal footer
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalHistory]);

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleTabClick = (tabId: SidebarTab) => {
    if (activeSidebarTab === tabId && !isSidebarCollapsed) {
      setIsSidebarCollapsed(true);
    } else {
      setActiveSidebarTab(tabId);
      setIsSidebarCollapsed(false);
    }
  };

  // Switch Active project wrapper files
  const handleCodeChange = (newVal: string, targetFileName?: string) => {
    if (!activeProj) return;
    const currentActiveFile = targetFileName || activeProj.activeFileName;

    const updated = projects.map(p => {
      if (p.id === activeProj.id) {
        const revisedFiles = p.files.map(f => {
          if (f.name === currentActiveFile) {
            return { ...f, content: newVal };
          }
          return f;
        });
        return { ...p, files: revisedFiles, updatedAt: new Date().toLocaleTimeString() };
      }
      return p;
    });
    setProjects(updated);

    // Legacy sync bounds for standard HTML visual frame outputs
    if (activeProj.language === 'html') {
      if (currentActiveFile === 'index.html') setHtmlCode(newVal);
      if (currentActiveFile === 'styles.css') setCssCode(newVal);
      if (currentActiveFile === 'main.js') setJsCode(newVal);
    }
  };

  // Add file tab to editor visual layout rows
  const handleSelectFile = (fileName: string) => {
    if (!openTabs.includes(fileName)) {
      setOpenTabs(prev => [...prev, fileName]);
    }
    const updated = projects.map(p => {
      if (p.id === activeProj.id) {
        return { ...p, activeFileName: fileName };
      }
      return p;
    });
    setProjects(updated);
  };

  // Remove tab from horizontal opened layouts
  const handleCloseTab = (fileName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const index = openTabs.indexOf(fileName);
    const updatedTabs = openTabs.filter(t => t !== fileName);
    setOpenTabs(updatedTabs);
    
    if (activeProj.activeFileName === fileName && updatedTabs.length > 0) {
      const nextActive = updatedTabs[Math.max(0, index - 1)];
      const updated = projects.map(p => {
        if (p.id === activeProj.id) {
          return { ...p, activeFileName: nextActive };
        }
        return p;
      });
      setProjects(updated);
    }
  };

  // Convert files array structure dynamically to VS Code directories tree nodes
  const rootTreeItems = React.useMemo(() => {
    if (!activeProj) return [];
    
    const tree: TreeItem[] = [];
    const filesList = activeProj.files;

    filesList.forEach((file, index) => {
      const parts = file.name.split('/');
      let currentLevel = tree;
      let currentPath = '';

      parts.forEach((part, partIndex) => {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        const isLastFile = partIndex === parts.length - 1;

        if (isLastFile) {
          currentLevel.push({
            id: currentPath,
            name: part,
            isFolder: false,
            fileIndex: index
          });
        } else {
          let folderNode = currentLevel.find(item => item.isFolder && item.name === part);
          if (!folderNode) {
            folderNode = {
              id: currentPath,
              name: part,
              isFolder: true,
              children: []
            };
            currentLevel.push(folderNode);
          }
          currentLevel = folderNode.children!;
        }
      });
    });

    // Populate empty virtual dirs to keep workspace synced
    emptyFolders.forEach(folderPath => {
      const parts = folderPath.split('/');
      let currentLevel = tree;
      let currentPath = '';

      parts.forEach((part, partIndex) => {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        const isLastFolder = partIndex === parts.length - 1;

        let existing = currentLevel.find(item => item.id === currentPath);
        if (!existing) {
          const freshNode: TreeItem = {
            id: currentPath,
            name: part,
            isFolder: true,
            children: []
          };
          currentLevel.push(freshNode);
          existing = freshNode;
        }
        
        if (!isLastFolder) {
          currentLevel = existing.children!;
        }
      });
    });

    // Sort folders recursively first then static filenames alphabetically
    const sortNodes = (nodes: TreeItem[]): TreeItem[] => {
      return nodes
        .sort((a, b) => {
          if (a.isFolder && !b.isFolder) return -1;
          if (!a.isFolder && b.isFolder) return 1;
          return a.name.localeCompare(b.name);
        })
        .map(node => {
          if (node.isFolder && node.children) {
            return { ...node, children: sortNodes(node.children) };
          }
          return node;
        });
    };

    return sortNodes(tree);
  }, [activeProj?.files, emptyFolders]);

  const toggleFolderExpanded = (pathId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [pathId]: !prev[pathId]
    }));
  };

  // Create new folder or file in parent tree
  const handleStartNodeCreation = (parentDirPath: string, isFolder: boolean) => {
    setCreationPath({ parentDirPath, isFolderCreation: isFolder });
    setCreationName('');
  };

  const handleCreateNodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creationName.trim() || !activeProj) return;

    const fullPath = creationPath?.parentDirPath 
      ? `${creationPath.parentDirPath}/${creationName.trim()}`
      : creationName.trim();

    if (creationPath?.isFolderCreation) {
      // Create virtual directory
      if (emptyFolders.includes(fullPath) || activeProj.files.some(f => f.name.startsWith(fullPath))) {
        triggerToastNotification("Directory already configured at path location.");
        return;
      }
      setEmptyFolders(prev => [...prev, fullPath]);
      setExpandedFolders(prev => ({ ...prev, [fullPath]: true }));
      triggerToastNotification(`Created virtual workspace folder: ${fullPath} 📁`);
    } else {
      // Create actual asset file inside workspace
      if (activeProj.files.some(f => f.name === fullPath)) {
        triggerToastNotification("File path conflict. Name already allocated.");
        return;
      }

      const ext = fullPath.split('.').pop() || '';
      let fileLang: ProgrammingLanguage = 'javascript';
      if (ext === 'py') fileLang = 'python';
      if (ext === 'cpp' || ext === 'cc' || ext === 'h') fileLang = 'cpp';
      if (ext === 'c') fileLang = 'c';
      if (ext === 'java') fileLang = 'java';
      if (ext === 'ts' || ext === 'tsx') fileLang = 'typescript';
      if (ext === 'html') fileLang = 'html';
      if (ext === 'css') fileLang = 'css';
      if (ext === 'php') fileLang = 'php';
      if (ext === 'sql') fileLang = 'sql';
      if (ext === 'go') fileLang = 'go';
      if (ext === 'rs') fileLang = 'rust';
      if (ext === 'kt' || ext === 'kts') fileLang = 'kotlin';
      if (ext === 'swift') fileLang = 'swift';
      if (ext === 'cs') fileLang = 'csharp';
      if (ext === 'rb') fileLang = 'ruby';

      const fileBoilerplate = ext === 'py' ? `# Custom Script File\nprint("Executing module script...")\n`
        : ext === 'html' ? `<!DOCTYPE html>\n<html>\n  <body>\n    <h2>Dynamic Viewport Output</h2>\n  </body>\n</html>\n`
        : `// Workspace Source asset: ${creationName}\n// Targeted engine: ${fileLang}\n\n`;

      const newFile: WorkspaceFile = {
        name: fullPath,
        content: fileBoilerplate,
        language: fileLang
      };

      const updated = projects.map(p => {
        if (p.id === activeProj.id) {
          return {
            ...p,
            files: [...p.files, newFile],
            activeFileName: newFile.name
          };
        }
        return p;
      });
      setProjects(updated);
      setOpenTabs(prev => [...prev, newFile.name]);
      triggerToastNotification(`Injected code source file: ${newFile.name}`);
    }

    setCreationPath(null);
  };

  // Delete node recursively
  const handleDeleteNode = (node: TreeItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeProj) return;

    if (node.isFolder) {
      if (confirm(`Erase directory folder "${node.id}" and all contents permanently?`)) {
        // Remove virtual entries
        setEmptyFolders(prev => prev.filter(p => p !== node.id && !p.startsWith(`${node.id}/`)));
        
        // Remove matching files
        const keptFiles = activeProj.files.filter(f => !f.name.startsWith(`${node.id}/`));
        if (keptFiles.length === 0) {
          triggerToastNotification("Declined: Cannot empty the entire workspace repository project.");
          return;
        }

        let nextActive = activeProj.activeFileName;
        if (activeProj.activeFileName.startsWith(`${node.id}/`)) {
          nextActive = keptFiles[0].name;
        }

        const updated = projects.map(p => {
          if (p.id === activeProj.id) {
            return { ...p, files: keptFiles, activeFileName: nextActive };
          }
          return p;
        });

        // Close deleted tabs
        setOpenTabs(prev => prev.filter(t => !t.startsWith(`${node.id}/`)));
        setProjects(updated);
        triggerToastNotification(`Unlinked folder tree: ${node.id}`);
      }
    } else {
      if (activeProj.files.length <= 1) {
        triggerToastNotification("Declined: A directory project must retain at least one source file.");
        return;
      }
      if (confirm(`Delete file "${node.id}" from disk?`)) {
        const keptFiles = activeProj.files.filter(f => f.name !== node.id);
        let nextActive = activeProj.activeFileName;
        if (activeProj.activeFileName === node.id) {
          nextActive = keptFiles[0].name;
        }

        const updated = projects.map(p => {
          if (p.id === activeProj.id) {
            return { ...p, files: keptFiles, activeFileName: nextActive };
          }
          return p;
        });

        setOpenTabs(prev => prev.filter(t => t !== node.id));
        setProjects(updated);
        triggerToastNotification(`Deleted file: ${node.id}`);
      }
    }
  };

  // Rename path values
  const handleStartRename = (item: TreeItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingFilePath(item.id);
    setRenamingValue(item.name);
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renamingValue.trim() || !activeProj || !renamingFilePath) return;

    const originalPath = renamingFilePath;
    const parts = originalPath.split('/');
    parts[parts.length - 1] = renamingValue.trim();
    const nextPath = parts.join('/');

    if (originalPath === nextPath) {
      setRenamingFilePath(null);
      return;
    }

    // Verify collisions
    const targetIsFolder = activeProj.files.some(f => f.name.startsWith(`${originalPath}/`)) || emptyFolders.includes(originalPath);

    if (targetIsFolder) {
      // Folder rename loops
      const renamedFiles = activeProj.files.map(f => {
        if (f.name.startsWith(`${originalPath}/`)) {
          const suffix = f.name.slice(originalPath.length);
          return { ...f, name: `${nextPath}${suffix}` };
        }
        return f;
      });
      const renamedVirtualDirs = emptyFolders.map(p => {
        if (p === originalPath) return nextPath;
        if (p.startsWith(`${originalPath}/`)) {
          const suffix = p.slice(originalPath.length);
          return `${nextPath}${suffix}`;
        }
        return p;
      });

      const updated = projects.map(p => {
        if (p.id === activeProj.id) {
          return {
            ...p,
            files: renamedFiles,
            activeFileName: p.activeFileName.startsWith(`${originalPath}/`)
              ? p.activeFileName.replace(originalPath, nextPath)
              : p.activeFileName
          };
        }
        return p;
      });

      setProjects(updated);
      setEmptyFolders(renamedVirtualDirs);
      
      // Sync open tabs
      setOpenTabs(prev => prev.map(t => t.startsWith(`${originalPath}/`) ? t.replace(originalPath, nextPath) : t));
    } else {
      // Normal file rename loops
      if (activeProj.files.some(f => f.name === nextPath)) {
        triggerToastNotification("Filename already exists. Terminated renaming.");
        return;
      }

      const renamedFiles = activeProj.files.map(f => {
        if (f.name === originalPath) {
          return { ...f, name: nextPath };
        }
        return f;
      });

      const updated = projects.map(p => {
        if (p.id === activeProj.id) {
          return {
            ...p,
            files: renamedFiles,
            activeFileName: p.activeFileName === originalPath ? nextPath : p.activeFileName
          };
        }
        return p;
      });

      setProjects(updated);
      setOpenTabs(prev => prev.map(t => t === originalPath ? nextPath : t));
    }

    setRenamingFilePath(null);
    triggerToastNotification("Workspace elements renamed.");
  };

  // File structure tree recursive renderer
  const renderTreeNodes = (nodes: TreeItem[], depth = 0) => {
    return nodes.map(node => {
      const isSelected = activeProj?.activeFileName === node.id;
      const isExpanded = expandedFolders[node.id];
      const isRenaming = renamingFilePath === node.id;

      return (
        <div key={node.id} className="space-y-0.5 select-none animate-slide-up" style={{ contentVisibility: 'auto' }}>
          <div
            onClick={() => {
              if (node.isFolder) {
                toggleFolderExpanded(node.id);
              } else {
                handleSelectFile(node.id);
              }
            }}
            className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer group leading-relaxed ${
              isSelected 
                ? 'bg-blue-600/20 text-blue-300 border-l-[3px] border-blue-500 font-bold' 
                : 'text-zinc-400 hover:text-white hover:bg-[#131135]/50'
            }`}
            style={{ paddingLeft: `${depth * 10 + 8}px` }}
          >
            <div className="flex items-center space-x-2 truncate">
              {node.isFolder ? (
                <>
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  )}
                  {isExpanded ? (
                    <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <Folder className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                </>
              ) : (
                <FileCode className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              )}
              
              {isRenaming ? (
                <form onSubmit={handleRenameSubmit} className="grow shrink min-w-[60px]" onClick={e => e.stopPropagation()}>
                  <input
                    type="text"
                    value={renamingValue}
                    onChange={e => setRenamingValue(e.target.value)}
                    className="w-full bg-[#050315] text-[11px] font-mono border border-blue-500 rounded px-1 text-white outline-none"
                    autoFocus
                    onBlur={() => setRenamingFilePath(null)}
                  />
                </form>
              ) : (
                <span className="truncate">{node.name}</span>
              )}
            </div>

            {/* Inline Action Buttons */}
            <div className={`opacity-0 group-hover:opacity-100 flex items-center space-x-1 shrink-0 px-1 ml-2 transition-opacity ${isRenaming ? 'hidden' : ''}`}>
              {node.isFolder && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartNodeCreation(node.id, false);
                    }}
                    className="p-0.5 hover:bg-[#1e1b4b] text-zinc-500 hover:text-blue-400 rounded transition-colors"
                    title="New File under folder"
                  >
                    <FilePlus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartNodeCreation(node.id, true);
                    }}
                    className="p-0.5 hover:bg-[#1e1b4b] text-zinc-500 hover:text-emerald-400 rounded transition-colors"
                    title="New Sub-folder"
                  >
                    <FolderPlus className="w-3 h-3" />
                  </button>
                </>
              )}
              <button
                onClick={(e) => handleStartRename(node, e)}
                className="p-0.5 hover:bg-[#1e1b4b] text-zinc-500 hover:text-indigo-400 rounded transition-colors"
                title="Rename node"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => handleDeleteNode(node, e)}
                className="p-0.5 hover:bg-[#1e1b4b] text-zinc-500 hover:text-red-400 rounded transition-colors"
                title="Delete node"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {node.isFolder && isExpanded && node.children && (
            <div className="space-y-0.5">
              {renderTreeNodes(node.children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  // Search & Replace actions
  const handleGlobalSearchReplace = (replaceAll = false) => {
    if (!searchQuery) {
      triggerToastNotification("Please enter a visual string search query.");
      return;
    }
    const currentActiveFile = activeProj.files.find(f => f.name === activeProj.activeFileName);
    if (!currentActiveFile) return;

    if (replaceAll) {
      const regex = new RegExp(searchQuery, 'g');
      const updatedCode = currentActiveFile.content.replace(regex, replaceQuery);
      handleCodeChange(updatedCode);
      triggerToastNotification(`Successfully replaced all matches of "${searchQuery}" with "${replaceQuery}".`);
    } else {
      const updatedCode = currentActiveFile.content.replace(searchQuery, replaceQuery);
      handleCodeChange(updatedCode);
      triggerToastNotification(`Replaced first matching instance of "${searchQuery}".`);
    }
  };

  // Compile runner
  const handleExecuteCompiler = async () => {
    if (!activeProj) return;
    setRunStatus('running');
    setStdoutLogs('');
    setStderrLogs('');
    setExecTime(null);
    setMemUsed(null);
    setConsoleActiveTab('stdout');
    triggerToastNotification(`Piping instruction classes through Vertex Sandboxes...`);

    try {
      const response = await fetch('/api/compiler/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: activeProj.language,
          files: activeProj.files,
          stdin: stdinBuffer,
          activeFileName: activeProj.activeFileName
        })
      });

      const parsedResult = await response.json();
      
      if (parsedResult.stderr) {
        setStderrLogs(parsedResult.stderr);
        setRunStatus('error');
        setConsoleActiveTab('stderr');
        triggerToastNotification("Process exited with build errors or Warnings. 🛑");
      } else {
        setStdoutLogs(parsedResult.stdout || "Execution finalized inside Docker runtime sandboxes successfully. Exit code: 0");
        setRunStatus('success');
        triggerToastNotification("Clean compile build completed! 🟢");
      }

      setExecTime(parsedResult.executionTime || "12ms");
      setMemUsed(parsedResult.memoryUsed || "1.8 MB");

      // Render standard html projects inside iframe viewports
      if (activeProj.language === 'html') {
        setTimeout(() => { runCompilerCompilation(); }, 200);
      }

    } catch (e: any) {
      setStderrLogs(`Docker cluster socket connection error: ${e.message || e}`);
      setRunStatus('error');
      setConsoleActiveTab('stderr');
    }
  };

  // Stop current runtime simulations
  const handleStopCompilerBuild = () => {
    setRunStatus('stopped');
    setStdoutLogs(prev => prev + "\n\n🛑 Process terminated on user command signal (SIGINT). Process finished with exit code -1.");
    triggerToastNotification("Build compilation interrupted.");
  };

  // Single file download trigger
  const handleDownloadActiveFile = () => {
    const file = activeProj.files.find(f => f.name === activeProj.activeFileName);
    if (!file) return;

    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.split('/').pop() || 'source_file';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerToastNotification(`Downloaded active file: "${file.name}"`);
  };

  // Global Project export
  const handleExportFullProject = () => {
    const backupJson = JSON.stringify(activeProj, null, 2);
    const blob = new Blob([backupJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeProj.title.toLowerCase().replace(/\s+/g, '_')}_workspace.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerToastNotification("Full project bundle config exported cleanly! 💾");
  };

  // File Upload integrations
  const handleTriggerUpload = () => {
    uploadInputRef.current?.click();
  };

  const handleFileUploadHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    const fileListArray = Array.from(uploadedFiles);
    let completedCount = 0;

    fileListArray.forEach((file: any) => {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const textContent = loadEvent.target?.result as string || '';
        const rawFileName = file.name;
        
        // Block duplicates
        if (activeProj.files.some(f => f.name.toLowerCase() === rawFileName.toLowerCase())) {
          triggerToastNotification(`Collision: "${rawFileName}" already configured inside project directory.`);
          return;
        }

        const ext = rawFileName.split('.').pop() || '';
        let matchedLang: ProgrammingLanguage = 'javascript';
        if (ext === 'py') matchedLang = 'python';
        if (ext === 'rs') matchedLang = 'rust';
        if (ext === 'go') matchedLang = 'go';
        if (ext === 'cpp') matchedLang = 'cpp';
        if (ext === 'html') matchedLang = 'html';
        if (ext === 'css') matchedLang = 'css';

        const uploadedAsset: WorkspaceFile = {
          name: rawFileName,
          content: textContent,
          language: matchedLang
        };

        const updated = projects.map(p => {
          if (p.id === activeProj.id) {
            return {
              ...p,
              files: [...p.files, uploadedAsset],
              activeFileName: uploadedAsset.name
            };
          }
          return p;
        });
        setProjects(updated);
        setOpenTabs(prev => [...prev, uploadedAsset.name]);
        completedCount += 1;

        if (completedCount === fileListArray.length) {
          triggerToastNotification(`Uploaded ${completedCount} file(s) into VS Code repository.`);
        }
      };
      reader.readAsText(file);
    });
  };

  // Local beautiful script code formatters
  const handleBeautifyFormatter = () => {
    const file = activeProj.files.find(f => f.name === activeProj.activeFileName);
    if (!file) return;

    let lines = file.content.split('\n');
    let spacesDepth = 0;
    const cleanLines = lines.map(line => {
      let trimmed = line.trim();
      if (trimmed.startsWith('}') || trimmed.startsWith(']') || trimmed.startsWith(')')) {
        spacesDepth = Math.max(0, spacesDepth - 1);
      }
      const structured = '  '.repeat(spacesDepth) + trimmed;
      if (trimmed.endsWith('{') || trimmed.endsWith('[') || trimmed.endsWith('(')) {
        spacesDepth += 1;
      }
      return structured;
    }).join('\n');

    handleCodeChange(cleanLines);
    triggerToastNotification("Align indentation classes successfully compiled!");
  };

  // Simulated Bash loop handler
  const handleTerminalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInputValue.trim() || !activeProj) return;

    const originalInput = terminalInputValue.trim();
    const commandArray = originalInput.split(/\s+/);
    const primCommand = commandArray[0].toLowerCase();

    setTerminalHistory(prev => [...prev, { text: `${originalInput}`, type: 'input' }]);
    setTerminalInputValue('');

    const respondRaw = (msg: string, roleType: 'info' | 'success' | 'error' | 'raw' = 'raw') => {
      setTerminalHistory(prev => [...prev, { text: msg, type: roleType }]);
    };

    switch (primCommand) {
      case 'help':
        respondRaw("Vertex Simulator standard command macros:", 'info');
        respondRaw("  run          Runs active compiled code branches directly on backend VM", 'success');
        respondRaw("  compile      Check compiler syntax warnings and link processes", 'success');
        respondRaw("  ls           Print active project tree hierarchy configurations", 'success');
        respondRaw("  cat [file]   Print static content layouts from targeted workspace files", 'success');
        respondRaw("  neofetch     Print hardware system specifications and runtime stats", 'success');
        respondRaw("  clear        Flush workspace CLI logs", 'success');
        respondRaw("  whoami       Information of currently enrolled user profile", 'success');
        break;
      case 'clear':
        setTerminalHistory([
          { text: "🖥️ Vertex Online Sandbox Shell flushtastic.", type: 'raw' },
          { text: "guest@vertex-sandbox:~$ ", type: 'raw' }
        ]);
        break;
      case 'whoami':
        respondRaw(`Currently Active Student Node: Alex Mercer (student@vertex.edu)`, 'info');
        respondRaw(`Enrolled Roll Code: VTX-2026-9481 | Level: Academic Year 1`, 'info');
        break;
      case 'ls':
        respondRaw(`Listing workspace directory map of "${activeProj.title}":`, 'info');
        activeProj.files.forEach(f => {
          respondRaw(`  - ${f.name}   (${f.language})   [${f.content.length} characters]`);
        });
        break;
      case 'cat':
        if (commandArray.length < 2) {
          respondRaw("Error code: Missing path parameter. usage: cat [filename]", 'error');
        } else {
          const targetName = commandArray[1];
          const found = activeProj.files.find(f => f.name === targetName);
          if (found) {
            respondRaw(`--- File stream view: ${targetName} ---`, 'info');
            respondRaw(found.content);
          } else {
            respondRaw(`Command terminated. No file matched path: "${targetName}"`, 'error');
          }
        }
        break;
      case 'neofetch':
        respondRaw("   __      __             _               ", 'raw');
        respondRaw("   \\ \\    / /            | |              ", 'raw');
        respondRaw("    \\ \\  / /___ _ __ |_   _ _ _   _      VERTEX ONLINE COMPILER PLATFORM", 'raw');
        respondRaw("     \\ \\/ /_  _\\ | _\\ __| | | | | |      ===============================", 'raw');
        respondRaw("      \\  /|  __/| |  | |_ | |_| |_|      OS: VM Sandbox (Secure Docker Cluster Instance)", 'raw');
        respondRaw("       \\/  \\___||_|   \\__| \\__, \\__,     Kernel: Alpine Linux v3.19.1", 'raw');
        respondRaw("                            __/ |        Active Host Server: express-applet-proxy", 'raw');
        respondRaw("                           |___/         Uptime: 45 minutes", 'raw');
        respondRaw("                                         CPU: Intel Xeon Cascade Lake (2 cores @ 3.4GHz)", 'raw');
        respondRaw("                                         Memory footprint: 1.4 GB / 8.0 GB virtual alloc", 'raw');
        respondRaw("                                         Active language runtime: " + activeProj.language.toUpperCase(), 'raw');
        break;
      case 'run':
      case 'compile':
        respondRaw("Dispatched execute trigger from local terminal pipe...", 'info');
        await handleExecuteCompiler();
        break;
      default:
        respondRaw(`vertex-sh: unknown command token: "${primCommand}". Type 'help' for support diagnostics.`, 'error');
    }

    setTerminalHistory(prev => [...prev, { text: "guest@vertex-sandbox:~$ ", type: 'raw' }]);
  };

  // Google Gemini integration hooks
  const handleQueryGeminiAssistant = async () => {
    if (!aiInputText.trim()) return;
    const userPrompt = aiInputText.trim();
    setAiChatLogs(prev => [...prev, { role: 'user', text: userPrompt }]);
    setAiInputText('');
    setIsAiProcessing(true);

    try {
      const response = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userPrompt,
          files: activeProj.files,
          language: activeProj.language,
          activeFileName: activeProj.activeFileName
        })
      });

      const parsed = await response.json();
      if (parsed.error) {
        setAiChatLogs(prev => [...prev, { role: 'assistant', text: `Failed to query Gemini assistant pipeline: ${parsed.error}` }]);
      } else {
        setAiChatLogs(prev => [...prev, { role: 'assistant', text: parsed.text || 'The AI assistant provided no further explanation.' }]);
      }
    } catch (err: any) {
      setAiChatLogs(prev => [...prev, { role: 'assistant', text: `Diagnostic pipeline thread interrupted: ${err.message || err}` }]);
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleDiagnoseErrorWithAi = async () => {
    if (!stderrLogs) {
      triggerToastNotification("No exceptions to track! Stderr is clean.");
      return;
    }
    setIsAiProcessing(true);
    setActiveSidebarTab('copilot');
    setIsSidebarCollapsed(false);
    triggerToastNotification("Forwarding crash traces to Gemini Auto-doctor...");

    try {
      const response = await fetch('/api/gemini/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          errorText: stderrLogs,
          files: activeProj.files,
          language: activeProj.language,
          activeFileName: activeProj.activeFileName
        })
      });

      const parsed = await response.json();
      if (parsed.error) {
        setAiChatLogs(prev => [...prev, { role: 'assistant', text: `Doctor connection lost: ${parsed.error}` }]);
      } else {
        setAiChatLogs(prev => [...prev, { role: 'assistant', text: `🧪 **Gemini Autodiagnose Error Report**:\n\n${parsed.text}` }]);
      }
    } catch (err: any) {
      setAiChatLogs(prev => [...prev, { role: 'assistant', text: `Link failure: ${err.message || err}` }]);
    } finally {
      setIsAiProcessing(false);
    }
  };

  // Instantly create template project from the lists of 16 supported languages
  const handleAddNewProjectFromTemplate = (lang: ProgrammingLanguage) => {
    const rawId = `proj_${lang}_${Math.floor(Math.random() * 900 + 100)}`;
    const starterBoilers: Record<string, string> = {
      python: `def main():\n    print("🐍 Welcome to Python Virtual Compiler!")\n    numbers = [5, 2, 9, 1, 5, 6]\n    print(f"Sorted sequence: {sorted(numbers)}")\n\nif __name__ == "__main__":\n    main()\n`,
      javascript: `console.log("⚡ JavaScript Online Compiler initialized.");\n\nconst greet = (user) => \`Greetings, \${user}!\`;\nconsole.log(greet("Alex Mercer"));\n`,
      typescript: `const compilerType: string = "TypeScript Virtual VM";\nconst compileVersion: number = 5.2;\n\nfunction showDetails(system: string, ver: number): void {\n    console.log(\`📦 \${system} Running on node - vtx_v\${ver}\`);\n}\n\nshowDetails(compilerType, compileVersion);\n`,
      c: `#include <stdio.h>\n\nint main() {\n    printf("⚙️ Compiler Target: GCC 14.1 (C Engine)\\n");\n    printf("Output stream resolved. Done.\\n");\n    return 0;\n}\n`,
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    std::cout << "🚀 C++20 standard Sandbox loaded successfully." << std::endl;\n    std::vector<int> ages = {23, 19, 45, 12};\n    std::sort(ages.begin(), ages.end());\n    std::cout << "Least index sorted value: " << ages[0] << std::endl;\n    return 0;\n}\n`,
      java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("☕ Java OpenJDK Virtual Machine Online.");\n        System.out.println("Processing student classes...");\n    }\n}\n`,
      go: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("🐹 Go compiler tools initialized.")\n    fmt.Println("Welcome, Alex Mercer")\n}\n`,
      rust: `fn main() {\n    println!("🦀 Rust Compiler Sandbox v1.75 - cargo binary parsed.");\n    let language_index = "safety";\n    println!("Value: {}", language_index);\n}\n`,
      kotlin: `fun main() {\n    println("📱 Kotlin multi-platform learning sandbox launched.")\n    val currentGpa = 3.92\n    println("Enrolled Gpa index: $currentGpa")\n}\n`,
      swift: `import Foundation\n\nprint("🍎 Swift compiler CLI simulation launched.")\nlet deviceType = "Main Virtual Processor"\nprint("Bound target: \\(deviceType)")\n`,
      csharp: `using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("🌐 Microsoft .NET 8.0 C# Core runtime active.");\n        Console.WriteLine("Compilation successful!");\n    }\n}\n`,
      ruby: `puts "💎 Ruby scripts compiler online."\ndef perform_multiplication(factor_one, factor_two)\n  factor_one * factor_two\nend\nputs "Result: #{perform_multiplication(7, 6)}"\n`,
      php: `<?php\necho "🐘 PHP CLI Engine 8.3 dynamic parser.";\n$status = "Online";\necho "\\nInfrastructure status: " . $status;\n?>\n`,
      sql: `CREATE TABLE IF NOT EXISTS inventory (\n    item_id INT PRIMARY KEY,\n    item_name VARCHAR(50),\n    stock INT\n);\n\nINSERT INTO inventory VALUES (1, 'Integrated Core Board', 12);\nINSERT INTO inventory VALUES (2, 'Auxiliary Capacitor', 45);\n\nSELECT * FROM inventory;\n`,
      html: `<!-- Quick Single File Web Previewer -->\n<div style="background: #0d0b26; padding: 30px; border-radius: 15px; color: #fff; font-family: sans-serif; text-align: center; border: 1px solid #1e1a4f;">\n    <h3>🌋 Web Page Sandbox Preview</h3>\n    <p style="color: #a5b4fc;">Tailwind elements rendered dynamically below.</p>\n    <button style="background: #6366f1; border: none; padding: 8px 16px; border-radius: 8px; color: #fff; cursor: pointer;">Click Alert</button>\n</div>\n`,
      css: `/* Default template stylesheet styling rules */\nbody {\n    background-color: #03020c;\n    color: #e0e0e0;\n}\n`
    };

    const ext: string = lang === 'typescript' ? 'ts' : lang === 'rust' ? 'rs' : lang === 'kotlin' ? 'kt' : lang === 'csharp' ? 'cs' : lang === 'cpp' ? 'cpp' : lang === 'html' ? 'html' : lang === 'css' ? 'css' : lang === 'sql' ? 'sql' : lang === 'php' ? 'php' : lang === 'ruby' ? 'rb' : lang === 'java' ? 'java' : lang === 'swift' ? 'swift' : lang === 'go' ? 'go' : lang === 'javascript' ? 'js' : lang === 'c' ? 'c' : 'py';

    const cleanName = starterBoilers[lang] ? `main.${ext}` : `source.${ext}`;
    const starterFile: WorkspaceFile = {
      name: cleanName,
      content: starterBoilers[lang] || `// Source file created for ${lang}\n`,
      language: lang
    };

    const newProj: CompilerProject = {
      id: rawId,
      title: `Quick ${lang.toUpperCase()} Sandbox`,
      language: lang,
      activeFileName: cleanName,
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleTimeString(),
      files: [starterFile]
    };

    setProjects(prev => [...prev, newProj]);
    setActiveProjectId(newProj.id);
    setOpenTabs([cleanName]);
    triggerToastNotification(`Initialized fresh compiler sandbox template for: ${lang.toUpperCase()}`);
  };

  const activeFileObj = activeProj?.files.find(f => f.name === activeProj.activeFileName) || activeProj?.files[0];

  // Target Monaco language support
  const monacoLanguageMap: Record<ProgrammingLanguage, string> = {
    javascript: 'javascript',
    typescript: 'typescript',
    python: 'python',
    c: 'c',
    cpp: 'cpp',
    java: 'java',
    html: 'html',
    css: 'css',
    php: 'php',
    sql: 'sql',
    go: 'go',
    rust: 'rust',
    kotlin: 'kotlin',
    swift: 'swift',
    csharp: 'csharp',
    ruby: 'ruby'
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-[#040212] border border-zinc-900 rounded-3xl overflow-hidden shadow-2xl relative" id="vs_code_ultimate_workspace">
      
      {/* Hidden Upload Interface Trigger */}
      <input 
        type="file" 
        multiple
        ref={uploadInputRef} 
        onChange={handleFileUploadHandle} 
        className="hidden" 
        accept=".txt,.js,.py,.cpp,.java,.ts,.tsx,.html,.css,.sql,.php,.go,.rs,.kt,.swift,.cs,.rb"
      />

      {/* Primary Workspace container */}
      <div className="flex flex-1 overflow-hidden min-h-[450px]">
        
        {/* ================= SECTION A: NARROW VERTICAL ACTIVITY BAR (VS CODE) ================= */}
        <div className="w-14 bg-[#060413] border-r border-zinc-900 flex flex-col justify-between items-center py-4 shrink-0 select-none z-20">
          <div className="flex flex-col items-center space-y-4 w-full">
            
            {/* File explorer activity icon */}
            <button
              onClick={() => handleTabClick('explorer')}
              className={`p-2.5 w-10 h-10 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                activeSidebarTab === 'explorer' && !isSidebarCollapsed
                  ? 'bg-blue-600/25 border-l-[3px] border-blue-500 text-blue-450' 
                  : 'text-zinc-500 hover:text-zinc-200'
              }`}
              title="File Explorer tree folders"
            >
              <Layers className="w-5 h-5" />
            </button>

            {/* Search and Replace */}
            <button
              onClick={() => handleTabClick('search')}
              className={`p-2.5 w-10 h-10 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                activeSidebarTab === 'search' && !isSidebarCollapsed
                  ? 'bg-blue-600/25 border-l-[3px] border-blue-500 text-blue-450' 
                  : 'text-zinc-500 hover:text-zinc-200'
              }`}
              title="Global search and replace variables scope"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Gemini Copilot Panel */}
            <div className="relative">
              <button
                onClick={() => handleTabClick('copilot')}
                className={`p-2.5 w-10 h-10 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                  activeSidebarTab === 'copilot' && !isSidebarCollapsed
                    ? 'bg-blue-600/25 border-l-[3px] border-blue-500 text-blue-450' 
                    : 'text-zinc-500 hover:text-zinc-200'
                }`}
                title="Google Gemini AI integration"
              >
                <Sparkles className="w-5 h-5 animate-pulse text-[#00df9a]" />
              </button>
            </div>

            {/* Projects list templates manager */}
            <button
              onClick={() => handleTabClick('projects')}
              className={`p-2.5 w-10 h-10 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                activeSidebarTab === 'projects' && !isSidebarCollapsed
                  ? 'bg-blue-600/25 border-l-[3px] border-blue-500 text-blue-450' 
                  : 'text-zinc-500 hover:text-zinc-200'
              }`}
              title="16 Multi-Language Projects Database templates"
            >
              <FolderPlus className="w-5 h-5" />
            </button>

            {/* Submissions stats logs */}
            <button
              onClick={() => handleTabClick('history')}
              className={`p-2.5 w-10 h-10 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                activeSidebarTab === 'history' && !isSidebarCollapsed
                  ? 'bg-blue-600/25 border-l-[3px] border-blue-500 text-blue-450' 
                  : 'text-zinc-500 hover:text-zinc-200'
              }`}
              title="Submission metrics ledgers"
            >
              <History className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col items-center space-y-4 w-full">
            {/* Split View button */}
            <button
              onClick={() => {
                setSplitActive(!splitActive);
                if (!splitActive) {
                  setSplitActiveFileName(activeProj.files[1]?.name || activeProj.files[0]?.name);
                }
                triggerToastNotification(splitActive ? "Hiding side editor split." : "Activated parallel split editor layout.");
              }}
              className={`p-2.5 w-10 h-10 rounded-xl transition-all hover:text-white cursor-pointer ${splitActive ? 'text-blue-400 bg-zinc-9D0/30' : 'text-zinc-650'}`}
              title="Toggles Parallel Split Area Editor View"
            >
              <Split className="w-5 h-5" />
            </button>

            {/* Workspace settings */}
            <button
              onClick={() => handleTabClick('settings')}
              className={`p-2.5 w-10 h-10 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                activeSidebarTab === 'settings' && !isSidebarCollapsed
                  ? 'bg-blue-600/25 border-l-[3px] border-blue-500 text-blue-450' 
                  : 'text-zinc-500 hover:text-zinc-200'
              }`}
              title="Workspace Editor Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= SECTION B: DYNAMIC SIDEBAR DRAWER PANEL (COLLAPSIBLE) ================= */}
        {!isSidebarCollapsed && (
          <div className="w-[280px] bg-[#09071c] border-r border-zinc-900 flex flex-col justify-between shrink-0 ease-in-out transition-all animate-fade-in relative z-10 text-left">
            <div className="flex flex-col flex-1 overflow-hidden">
              
              {/* Explorer Tab Header */}
              {activeSidebarTab === 'explorer' && (
                <div className="flex flex-col flex-1 overflow-hidden p-4 space-y-4">
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                    <span className="text-[10px] font-mono tracking-widest font-extrabold uppercase text-slate-350">
                      Explorer File Tree
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleStartNodeCreation('', false)}
                        className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded transition-colors"
                        title="Create New File"
                      >
                        <FilePlus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleStartNodeCreation('', true)}
                        className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded transition-colors"
                        title="Create New Folder"
                      >
                        <FolderPlus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <select
                    value={activeProjectId}
                    onChange={(e) => {
                      setActiveProjectId(e.target.value);
                      const currentProj = projects.find(p => p.id === e.target.value);
                      if (currentProj) {
                        setOpenTabs([currentProj.activeFileName]);
                        triggerToastNotification(`Active framework selected: ${currentProj.title}`);
                      }
                    }}
                    className="w-full bg-[#050315] border border-zinc-800 focus:border-indigo-650 font-sans font-bold text-xs text-white py-1.5 px-2.5 rounded-xl outline-none cursor-pointer"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.language.toUpperCase()})
                      </option>
                    ))}
                  </select>

                  {/* Node creation dynamic input form prompt */}
                  {creationPath && (
                    <form 
                      onSubmit={handleCreateNodeSubmit}
                      className="bg-[#050315] border border-blue-500/30 p-2 rounded-xl flex flex-col gap-2 animate-fade-in text-xs font-mono"
                    >
                      <span className="text-[9px] text-zinc-500 uppercase font-semibold">
                        In: {creationPath.parentDirPath || 'root'} ({creationPath.isFolderCreation ? 'Folder' : 'File'})
                      </span>
                      <div className="flex gap-1.5 justify-between">
                        <input
                          type="text"
                          required
                          autoFocus
                          placeholder={creationPath.isFolderCreation ? "e.g. src" : "e.g. script.py"}
                          value={creationName}
                          onChange={e => setCreationName(e.target.value)}
                          className="w-full bg-[#120f2b] text-[11px] border border-zinc-800 rounded px-2 py-1 text-white outline-none"
                        />
                        <button type="submit" className="text-[10px] font-bold text-blue-400 font-mono">OK</button>
                      </div>
                    </form>
                  )}

                  {/* Root Trees mapping */}
                  <div className="flex-1 overflow-y-auto space-y-1">
                    {rootTreeItems.length === 0 ? (
                      <span className="text-[10px] font-mono select-none text-zinc-650">No files registered on directory.</span>
                    ) : (
                      renderTreeNodes(rootTreeItems)
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="border-t border-zinc-800/80 pt-3 space-y-2">
                    <button
                      onClick={handleTriggerUpload}
                      className="w-full py-1.5 px-3 bg-[#110e2d] hover:bg-zinc-800 text-zinc-300 font-mono text-[10.5px] font-bold rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Files</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Search Tab Panel */}
              {activeSidebarTab === 'search' && (
                <div className="p-4 space-y-4 flex flex-col h-full shrink-0">
                  <span className="text-[10px] font-mono tracking-widest font-extrabold uppercase text-slate-350 border-b border-zinc-800 pb-2">
                    Search and Replace
                  </span>
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wide">Find Query string</label>
                      <input
                        type="text"
                        placeholder="Search key..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-[#050315] border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 text-xs font-mono outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wide">Replace Value</label>
                      <input
                        type="text"
                        placeholder="Replace code..."
                        value={replaceQuery}
                        onChange={e => setReplaceQuery(e.target.value)}
                        className="w-full bg-[#050315] border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 text-xs font-mono outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex gap-2 pt-1 font-mono text-[10px]">
                      <button
                        onClick={() => handleGlobalSearchReplace(false)}
                        className="flex-1 py-1.5 bg-[#120f2e] hover:bg-zinc-800 text-zinc-350 hover:text-white rounded-lg font-bold"
                      >
                        Replace One
                      </button>
                      <button
                        onClick={() => handleGlobalSearchReplace(true)}
                        className="flex-1 py-1.5 bg-[#120f2e] text-blue-400 hover:bg-zinc-800 rounded-lg font-bold"
                      >
                        Replace All
                      </button>
                    </div>
                  </div>

                  <p className="text-[9.5px] text-zinc-500 leading-normal font-sans">
                    Find and replace queries apply to the currently focus file on the Monaco tab frame.
                  </p>
                </div>
              )}

              {/* AI Copilot Panel */}
              {activeSidebarTab === 'copilot' && (
                <div className="p-4 flex flex-col h-full overflow-hidden">
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-2 mb-3 shrink-0">
                    <span className="text-[10px] font-mono tracking-widest font-extrabold uppercase text-[#00df9a] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Gemini Workspace AI</span>
                    </span>
                    <button 
                      onClick={() => setAiChatLogs([{ role: 'assistant', text: 'Chat logs reset. What can I verify for you?' }])}
                      className="text-[9px] font-mono text-zinc-500 hover:text-white cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>

                  {/* Scrollable messages area */}
                  <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
                    {aiChatLogs.map((chat, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-2xl leading-relaxed text-left max-w-[90%] selection:bg-purple-900/30 ${
                          chat.role === 'user' 
                            ? 'bg-blue-600/15 border border-blue-500/10 text-slate-200 ml-auto' 
                            : 'bg-zinc-900/40 border border-zinc-800 text-zinc-300'
                        }`}
                      >
                        <strong className="text-[9.5px] font-mono tracking-wider block opacity-75 uppercase mb-1">
                          {chat.role === 'user' ? 'alex' : 'gemini doctor'}
                        </strong>
                        <p className="whitespace-pre-wrap">{chat.text}</p>
                      </div>
                    ))}
                    {isAiProcessing && (
                      <div className="p-3 bg-zinc-9D0/20 border border-zinc-800 rounded-2xl flex items-center space-x-2 text-purple-400 animate-pulse text-[11px] font-mono shrink-0">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Compiling token suggestions...</span>
                      </div>
                    )}
                  </div>

                  {/* Input stream */}
                  <div className="mt-3 pt-3 border-t border-zinc-800/80 shrink-0">
                    <div className="flex gap-1 bg-[#050315] border border-zinc-800 rounded-xl px-2.5 py-1.5 focus-within:border-blue-500">
                      <textarea
                        value={aiInputText}
                        onChange={e => setAiInputText(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleQueryGeminiAssistant();
                          }
                        }}
                        placeholder="Ask resident AI compiler code logic..."
                        className="w-full bg-transparent border-none text-zinc-200 placeholder-zinc-700 font-sans text-xs min-h-[40px] resize-none outline-none focus:ring-0 p-0"
                      />
                      <button
                        onClick={handleQueryGeminiAssistant}
                        disabled={isAiProcessing || !aiInputText.trim()}
                        className="p-1 hover:text-blue-400 text-zinc-500 self-end disabled:opacity-50"
                        title="Submit code queries"
                      >
                        <Play className="w-4 h-4 fill-current rotate-90" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Projects templates manager panel */}
              {activeSidebarTab === 'projects' && (
                <div className="p-4 space-y-4 flex flex-col h-full overflow-hidden text-left shrink-0">
                  <span className="text-[10px] font-mono tracking-widest font-extrabold uppercase text-slate-350 border-b border-zinc-800 pb-2">
                    Template Generator
                  </span>

                  <p className="text-[11px] text-zinc-500 leading-normal font-sans p-0.5">
                    Spawn a fully functioning compiler project structured in any of the 16 languages requested. This loads instant source scripts and compiles immediately!
                  </p>

                  <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                    {[
                      { l: 'python', n: 'Python Sandbox' },
                      { l: 'javascript', n: 'JavaScript runtime' },
                      { l: 'typescript', n: 'TypeScript Workspace' },
                      { l: 'c', n: 'C (GCC 14.1)' },
                      { l: 'cpp', n: 'C++ Modern Engine' },
                      { l: 'java', n: 'Java Compiler' },
                      { l: 'go', n: 'Go tools' },
                      { l: 'rust', n: 'Rust Cargo' },
                      { l: 'kotlin', n: 'Kotlin Mobile' },
                      { l: 'swift', n: 'Swift Apple' },
                      { l: 'csharp', n: 'C# .NET' },
                      { l: 'ruby', n: 'Ruby runtime' },
                      { l: 'php', n: 'PHP Server' },
                      { l: 'sql', n: 'SQLite Database' },
                      { l: 'html', n: 'HTML Frontend' },
                      { l: 'css', n: 'CSS Swatch' }
                    ].map(lang => (
                      <button
                        key={lang.l}
                        onClick={() => handleAddNewProjectFromTemplate(lang.l as ProgrammingLanguage)}
                        className="w-full text-left py-2 px-3 bg-[#110e2d] hover:bg-[#1a1745] active:scale-95 text-zinc-300 hover:text-white rounded-xl transition-all flex items-center justify-between font-mono text-[11px] border border-zinc-800/40 cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          <Code className="w-3.5 h-3.5 text-blue-400" />
                          <span>{lang.n}</span>
                        </div>
                        <Plus className="w-3.5 h-3.5 text-zinc-500" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Submission Logs Tab Panel */}
              {activeSidebarTab === 'history' && (
                <div className="p-4 space-y-4 flex flex-col h-full overflow-hidden text-left shrink-0">
                  <span className="text-[10px] font-mono tracking-widest font-extrabold uppercase text-slate-350 border-b border-zinc-800 pb-2">
                    System Sandbox Health
                  </span>

                  <div className="bg-[#050315] p-3 rounded-xl border border-zinc-850 space-y-2.5">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wide block">Virtual Resources Load</span>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-zinc-400">Memory footprint</span>
                        <span className="text-zinc-200">1.4 GB / 8.0 GB</span>
                      </div>
                      <div className="w-full bg-[#1c1a32] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full w-[18%]" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-zinc-400">Containers Load</span>
                        <span className="text-zinc-200">12% Cpu clock</span>
                      </div>
                      <div className="w-full bg-[#1c1a32] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#00df9a] h-full w-[12%]" />
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-wide text-zinc-500">Virtual Environment Details</span>
                  <div className="grow space-y-2 text-zinc-400 text-xs font-mono">
                    <p className="flex justify-between">
                      <span>Server Engine:</span>
                      <strong className="text-slate-200 font-bold">Node.js Express</strong>
                    </p>
                    <p className="flex justify-between">
                      <span>Sandbox VM:</span>
                      <strong className="text-slate-200 font-bold">Secure Jail sandbox</strong>
                    </p>
                    <p className="flex justify-between">
                      <span>Active PID:</span>
                      <strong className="text-slate-200 font-bold">6725 (Stable)</strong>
                    </p>
                    <p className="flex justify-between">
                      <span>Storage:</span>
                      <strong className="text-slate-200 font-bold">Local File Cache</strong>
                    </p>
                  </div>
                </div>
              )}

              {/* Workspace Settings Tab Panel */}
              {activeSidebarTab === 'settings' && (
                <div className="p-4 space-y-4 flex flex-col h-full shrink-0">
                  <span className="text-[10px] font-mono tracking-widest font-extrabold uppercase text-slate-350 border-b border-zinc-800 pb-2">
                    Editor Config settings
                  </span>

                  <div className="space-y-3.5 text-xs text-left">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-zinc-500">Font size: {editorFontSize}px</label>
                      <div className="flex gap-1 bg-[#050315] border border-zinc-800 rounded-xl p-1">
                        <button
                          onClick={() => setEditorFontSize(prev => Math.max(9, prev - 1))}
                          className="flex-1 py-1 text-center bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 rounded text-white font-mono cursor-pointer"
                        >
                          Decrease
                        </button>
                        <button
                          onClick={() => setEditorFontSize(prev => Math.min(24, prev + 1))}
                          className="flex-1 py-1 text-center bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 rounded text-white font-mono cursor-pointer"
                        >
                          Increase
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-zinc-400 font-sans">Minimap view</span>
                      <input 
                        type="checkbox" 
                        checked={minimapEnabled} 
                        onChange={e => setMinimapEnabled(e.target.checked)} 
                        className="rounded bg-zinc-950 border-zinc-800 text-blue-500 outline-none w-4 h-4 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-zinc-400 font-sans">Toggle word wrap</span>
                      <select
                        value={wordWrap}
                        onChange={e => setWordWrap(e.target.value as 'on' | 'off')}
                        className="bg-zinc-950 border border-zinc-800 text-xs text-white rounded p-1 outline-none"
                      >
                        <option value="on">On</option>
                        <option value="off">Off</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-zinc-400 font-sans font-bold text-amber-400 flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${autoSaveEnabled ? 'bg-emerald-400 animate-ping' : 'bg-zinc-700'}`} />
                        <span>Continuous Autosave</span>
                      </span>
                      <input 
                        type="checkbox" 
                        checked={autoSaveEnabled} 
                        onChange={e => setAutoSaveEnabled(e.target.checked)} 
                        className="rounded bg-zinc-950 border-zinc-800 text-amber-500 outline-none w-4 h-4 cursor-pointer"
                      />
                    </div>

                    <div className="border-t border-zinc-850/80 pt-3.5 space-y-2">
                      <span className="text-[10px] uppercase font-mono text-zinc-500">Project Backups</span>
                      <div className="flex gap-2">
                        <button
                          onClick={handleExportFullProject}
                          className="flex-1 py-2 bg-[#110e2d] hover:bg-zinc-800 text-zinc-300 rounded-xl flex items-center justify-center gap-1 font-mono text-[10px] font-bold active:scale-95 transition-transform cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                          <span>Export Config</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Quick stats indicators in footer sidebar pane */}
            <div className="p-3 bg-[#050315] border-t border-zinc-900 border-r border-zinc-900 flex justify-between items-center text-[10px] font-mono text-zinc-500 select-none">
              <span className="flex items-center gap-1.5 text-blue-400 font-bold">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                <span>workspace: sync</span>
              </span>
              <span>100% cloud</span>
            </div>
          </div>
        )}

        {/* ================= SECTION C: MULTI-TAB CODE EDITOR CANVAS (VS CODE STYLE) ================= */}
        <div className="flex-1 flex flex-col bg-[#04010b] overflow-hidden min-w-[280px]">
          
          {/* Tabs row */}
          <div className="bg-[#060412] border-b border-zinc-900 flex items-center justify-between h-[38px] select-none z-10 shrink-0">
            <div className="flex-1 flex overflow-x-auto h-full scrollbar-none items-end" id="editor_horizontal_tabs">
              {openTabs.map(fileName => {
                const isActiveTab = activeProj?.activeFileName === fileName;
                return (
                  <div
                    key={fileName}
                    onClick={() => handleSelectFile(fileName)}
                    className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono h-full border-r border-zinc-950 cursor-pointer select-none transition-all ${
                      isActiveTab 
                        ? 'bg-[#04010b] text-blue-300 font-bold border-t-2 border-t-blue-500' 
                        : 'bg-[#070517] text-zinc-500 hover:text-zinc-200 hover:bg-[#0a0720]/60'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 text-blue-400" />
                    <span className="max-w-[120px] truncate">{fileName}</span>
                    <button 
                      onClick={(e) => handleCloseTab(fileName, e)}
                      className="p-0.5 rounded-full hover:bg-zinc-800 text-zinc-500 hover:text-white shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
              {openTabs.length === 0 && (
                <div className="p-2.5 text-zinc-650 text-[11px] font-mono shrink-0">No editors opened. Choose files from the Explorer branch.</div>
              )}
            </div>

            {/* Quick header action icons */}
            <div className="flex items-center space-x-2 px-3">
              <button 
                onClick={handleBeautifyFormatter}
                className="p-1 hover:bg-zinc-850 hover:text-blue-300 text-zinc-550 rounded font-mono text-[10px] font-bold flex items-center gap-1 shrink-0 transition-transform cursor-pointer"
                title="Re-indent code nicely"
              >
                <Code className="w-4 h-4 text-blue-400" />
                <span className="hidden sm:inline">Format</span>
              </button>

              <button
                onClick={handleExecuteCompiler}
                disabled={runStatus === 'running'}
                className="py-1.5 px-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-mono text-[10px] font-extrabold rounded-lg flex items-center gap-1 active:scale-95 transition-transform cursor-pointer shadow-lg shadow-blue-500/10 shrink-0"
              >
                <Play className="w-3 h-3 fill-current text-white shrink-0" />
                <span>compile &amp; run</span>
              </button>
            </div>
          </div>

          {/* Editors panels (Supports Parallel Splits) */}
          <div className="flex-1 flex overflow-hidden min-h-[220px]">
            {openTabs.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4 text-center">
                <FileText className="w-16 h-16 text-zinc-700 animate-bounce" />
                <div className="space-y-1">
                  <h4 className="font-display font-black text-white text-sm uppercase">Active terminal is vacant</h4>
                  <p className="text-zinc-500 text-xs max-w-sm">
                    Open a module inside the Virtual Workspace File Explorer to load dynamic syntax classes.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex divide-x divide-zinc-900 overflow-hidden relative">
                
                {/* Panel A: Main Core editor */}
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                  <Editor
                    height="100%"
                    theme={editorTheme}
                    language={monacoLanguageMap[activeFileObj?.language || 'javascript']}
                    value={activeFileObj?.content || ''}
                    onChange={(val) => handleCodeChange(val || '')}
                    loading={
                      <div className="h-full flex flex-col items-center justify-center space-y-4 text-xs font-mono text-purple-400 bg-black/40">
                        <RefreshCw className="w-8 h-8 animate-spin" />
                        <span>Initializing Monaco Compiler Engine...</span>
                      </div>
                    }
                    options={{
                      fontSize: editorFontSize,
                      minimap: { enabled: minimapEnabled },
                      wordWrap: wordWrap,
                      lineNumbers: 'on',
                      roundedSelection: true,
                      scrollBeyondLastLine: false,
                      readOnly: false,
                      automaticLayout: true,
                    }}
                  />
                </div>

                {/* Split Parallel Pane (Displays second selected file parallelly!) */}
                {splitActive && (
                  <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#060412]">
                    <div className="bg-[#0d0b26] p-2 flex justify-between items-center text-xs border-b border-zinc-900 shrink-0 select-none">
                      <span className="font-mono text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-blue-400" />
                        <span>Split Screen Pane: {splitActiveFileName || 'Select file'}</span>
                      </span>
                      <select
                        value={splitActiveFileName}
                        onChange={(e) => setSplitActiveFileName(e.target.value)}
                        className="bg-black/45 border border-zinc-800 text-[10.5px] font-mono text-white p-0.5 rounded outline-none"
                      >
                        {activeProj.files.map(f => (
                          <option key={f.name} value={f.name}>{f.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <Editor
                        height="100%"
                        theme={editorTheme}
                        language={monacoLanguageMap[activeProj.files.find(f => f.name === splitActiveFileName)?.language || 'javascript']}
                        value={activeProj.files.find(f => f.name === splitActiveFileName)?.content || ''}
                        onChange={(val) => handleCodeChange(val || '', splitActiveFileName)}
                        options={{
                          fontSize: editorFontSize - 1,
                          minimap: { enabled: false },
                          wordWrap: wordWrap,
                          lineNumbers: 'on',
                          roundedSelection: true,
                          scrollBeyondLastLine: false,
                          readOnly: false,
                          automaticLayout: true,
                        }}
                      />
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* ================= SECTION D: MULTI-TAB BOTTOM CONSOLE / TERMINAL / PROBLEMS ================= */}
          <div className="h-[210px] bg-[#050314] border-t border-zinc-900 flex flex-col overflow-hidden shrink-0">
            
            {/* Headers row tabs selection */}
            <div className="bg-[#08061b] border-b border-zinc-950 px-4 h-9 flex items-center justify-between select-none shrink-0" id="console_tabs_pane_row">
              <div className="flex items-center gap-4 text-xs font-mono h-full items-end">
                
                <button
                  onClick={() => setConsoleActiveTab('stdout')}
                  className={`py-2 px-1 transition-all flex items-center gap-1 cursor-pointer h-full border-b-2 ${
                    consoleActiveTab === 'stdout' 
                      ? 'border-blue-500 text-blue-300 font-bold' 
                      : 'border-transparent text-zinc-500 hover:text-zinc-200'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Output stream</span>
                </button>

                <button
                  onClick={() => setConsoleActiveTab('stderr')}
                  className={`py-2 px-1 transition-all flex items-center gap-1 cursor-pointer h-full border-b-2 ${
                    consoleActiveTab === 'stderr' 
                      ? 'border-amber-500 text-amber-500 font-bold' 
                      : 'border-transparent text-zinc-500 hover:text-zinc-200'
                  }`}
                >
                  <Bug className="w-3.5 h-3.5" />
                  <span className="flex items-center gap-1">
                    <span>Errors console</span>
                    {stderrLogs && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />}
                  </span>
                </button>

                <button
                  onClick={() => setConsoleActiveTab('terminal')}
                  className={`py-2 px-1 transition-all flex items-center gap-1 cursor-pointer h-full border-b-2 ${
                    consoleActiveTab === 'terminal' 
                      ? 'border-emerald-500 text-emerald-400 font-bold' 
                      : 'border-transparent text-zinc-500 hover:text-zinc-200'
                  }`}
                >
                  <TerminalIcon className="w-3.5 h-3.5" />
                  <span>Simulated Terminal</span>
                </button>

                <button
                  onClick={() => setConsoleActiveTab('stdin')}
                  className={`py-2 px-1 transition-all flex items-center gap-1 cursor-pointer h-full border-b-2 ${
                    consoleActiveTab === 'stdin' 
                      ? 'border-amber-500 text-amber-400 font-bold' 
                      : 'border-transparent text-zinc-500 hover:text-zinc-200'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Inputs (Stdin)</span>
                </button>
              </div>

              {/* Status information right alignment */}
              <div className="flex items-center space-x-2 text-[10px] font-mono text-zinc-500">
                <span>CPU load : 12%</span>
                <span>•</span>
                <span>Threads: idle</span>
              </div>
            </div>

            {/* Active view component output layouts */}
            <div className="flex-1 p-3.5 overflow-y-auto bg-black/60 scrollbar-thin">
              
              {/* Output Tab stream details */}
              {consoleActiveTab === 'stdout' && (
                <div className="font-mono text-xs text-zinc-300 leading-relaxed text-left whitespace-pre-wrap select-text selection:bg-zinc-800">
                  {runStatus === 'idle' && (
                    <span className="text-zinc-605 italic block py-4 text-center">Output panel is empty. Deploy scripts to start.</span>
                  )}
                  {runStatus === 'running' && (
                    <span className="text-blue-400 animate-pulse block py-4 text-center">⏳ Allocating virtual registers and parsing script blocks...</span>
                  )}
                  {stdoutLogs && (
                    <div className="space-y-1">
                      <p className="text-emerald-400 font-bold">--- TARGET PROCESS LOGGED OUTPUTS ---</p>
                      <p>{stdoutLogs}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Errors console Tab layout */}
              {consoleActiveTab === 'stderr' && (
                <div className="font-mono text-xs leading-relaxed text-left select-text space-y-3">
                  {!stderrLogs ? (
                    <span className="text-zinc-650 italic block py-4 text-center">No build diagnostic warnings found. Static code is green.</span>
                  ) : (
                    <div className="bg-red-950/15 border border-red-500/10 p-3.5 rounded-xl space-y-3 animate-fade-in text-red-400">
                      <div className="flex justify-between items-center gap-4">
                        <strong className="text-[11px] uppercase tracking-wide">Build stack process threw Exception:</strong>
                        <button
                          onClick={handleDiagnoseErrorWithAi}
                          className="px-3 py-1 bg-gradient-to-r from-red-600 to-indigo-750 text-white font-mono text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1 active:scale-95 transition-transform"
                        >
                          <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
                          <span>Instantly Diagnose with Gemini</span>
                        </button>
                      </div>
                      <p className="whitespace-pre-wrap block text-zinc-300 font-medium bg-black/45 p-2 rounded-lg border border-red-900/30 font-mono text-[11px]">{stderrLogs}</p>
                    </div>
                  )}
                </div>
              )}

              {/* STDIN Inputs panel Tab details */}
              {consoleActiveTab === 'stdin' && (
                <div className="space-y-2 text-left h-full flex flex-col justify-between shrink-0">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500">Provide user input streams for standard class execution:</span>
                  <textarea
                    value={stdinBuffer}
                    onChange={e => setStdinBuffer(e.target.value)}
                    placeholder="e.g. 100&#10;Vertex User&#10;5.95"
                    className="w-full bg-[#050314] flex-1 text-zinc-200 p-2.5 rounded-xl border border-zinc-850 font-mono text-xs resize-none outline-none focus:border-indigo-650 focus:ring-0 p-2"
                  />
                </div>
              )}

              {/* Terminal Tab component implementation details */}
              {consoleActiveTab === 'terminal' && (
                <div className="font-mono text-xs text-left h-full flex flex-col justify-between shrink-0">
                  
                  {/* Scrolling CLI histories lines */}
                  <div className="flex-1 overflow-y-auto space-y-1 pr-1 pb-2">
                    {terminalHistory.map((line, idx) => {
                      let col = 'text-zinc-350';
                      if (line.type === 'success') col = 'text-emerald-400';
                      if (line.type === 'error') col = 'text-red-400 font-bold';
                      if (line.type === 'info') col = 'text-indigo-300';
                      if (line.type === 'input') col = 'text-blue-300 font-bold';
                      return (
                        <p key={idx} className={`${col} leading-relaxed whitespace-pre-wrap`}>
                          {line.text}
                        </p>
                      );
                    })}
                    <div ref={terminalBottomRef} />
                  </div>

                  <form onSubmit={handleTerminalSubmit} className="flex gap-2 bg-black/30 border-t border-zinc-950 py-1.5 shrink-0 select-text">
                    <span className="text-zinc-550 shrink-0 select-none">guest@vtx-sh:~$</span>
                    <input
                      type="text"
                      value={terminalInputValue}
                      onChange={e => setTerminalInputValue(e.target.value)}
                      className="grow bg-transparent border-none focus:ring-0 outline-none text-zinc-200 font-mono text-xs p-0"
                      placeholder="Type command here (e.g. 'help', 'neofetch', 'ls', 'run')..."
                    />
                  </form>
                </div>
              )}

            </div>
          </div>

          {/* Status Bar at the bottom limit edge of IDE */}
          <div className="h-6 bg-[#0477bf]/90 border-t border-zinc-900 bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-800 px-4 flex justify-between items-center text-[10.5px] font-mono select-none text-slate-100 shrink-0">
            <div className="flex items-center space-x-3">
              <span className="flex items-center gap-1.5 font-extrabold uppercase">
                <Laptop className="w-3.5 h-3.5" />
                <span>Compiler Status: Ready</span>
              </span>
              <span>|</span>
              <span className="flex items-center gap-1 text-slate-350">
                <Activity className="w-3.5 h-3.5" />
                <span>CPU load : 12%</span>
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <span>Lines: {activeFileObj?.content.split('\n').length || 1}</span>
              <span>Spacer: UTF-8</span>
              <span>Indentation: 2 Spaces</span>
              <span className="hidden sm:inline bg-white/10 px-2 py-0.5 rounded font-extrabold transition-opacity">
                STD: {monacoLanguageMap[activeFileObj?.language || 'javascript'].toUpperCase()}
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
