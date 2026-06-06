/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageId, UserProfile, CompilerProject, WorkspaceFile, ProgrammingLanguage, ManagedStudent } from './types';
import Navbar from './components/Navbar';
import LandingView from './components/LandingView';
import AuthView from './components/AuthView';
import DashboardView from './components/DashboardView';
import WorkspaceView from './components/WorkspaceView';
import BlueprintsView from './components/BlueprintsView';
import AdminView from './components/AdminView';
import AiCopilotView from './components/AiCopilotView';
import SettingsView from './components/SettingsView';

// Core preloaded template codes
const INITIAL_HTML = `<!-- Dynamic Client Sandbox Playground -->
<div class="welcome-box">
  <h2 class="welcome-title">🚀 Vertex Web Compiler Workspace</h2>
  <p class="welcome-desc">Modify HTML codes on index.html, alter styles.css classes, trigger events inside main.js, and monitor output compilations here!</p>
  
  <div class="academic-stats">
    <span class="status-indicator">● Active Sandbox Instance</span>
    <span class="version-badge">Version 1.2</span>
  </div>
  
  <button id="event_test_btn" class="action-btn">Trigger Click Listener</button>
  <p id="event_msg" class="event-message">Clicks recorded: 0</p>
</div>`;

const INITIAL_CSS = `/* Custom Compiler Swatch stylesheet */
body {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: radial-gradient(circle, #0e0524 0%, #03010b 100%);
  font-family: system-ui, sans-serif;
  color: #fff;
  padding: 1rem;
}

.welcome-box {
  background: #08051e;
  padding: 2.5rem;
  border-radius: 2rem;
  box-shadow: 0 15px 35px rgba(124, 58, 237, 0.25);
  max-w-md;
  text-align: center;
  border: 1px solid rgba(124, 58, 237, 0.2);
}

.welcome-title {
  color: #c084fc;
  margin: 0 0 0.8rem;
  font-size: 1.5rem;
  font-weight: 800;
}

.welcome-desc {
  font-size: 0.85rem;
  color: #a1a1aa;
  line-height: 1.6;
}

.academic-stats {
  display: flex;
  justify-content: space-around;
  font-size: 0.75rem;
  font-weight: bold;
  color: #ec4899;
  margin: 1.5rem 0;
}

.status-indicator {
  color: #34d399;
}

.action-btn {
  background-color: #7c3aed;
  color: #ffffff;
  border: none;
  padding: 0.8rem 1.6rem;
  border-radius: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.action-btn:hover {
  background-color: #6d28d9;
  transform: scale(1.02);
}

.event-message {
  font-size: 0.8rem;
  font-weight: 500;
  color: #c084fc;
  margin-top: 1rem;
}`;

const INITIAL_JS = `// Register in-line DOM interactive callbacks below
(function() {
  const button = document.getElementById('event_test_btn');
  const text = document.getElementById('event_msg');
  let counter = 0;

  if (button && text) {
    button.onclick = function() {
      counter += 1;
      text.innerText = "Clicks recorded: " + counter;
      console.log("Success: Trigger click event called! Click index sum is " + counter);
    };
  } else {
    console.warn("Element references during initialization returned empty properties.");
  }
})();`;

export default function App() {
  
  // Default logged-in student configuration so students see functional dashboards instantly
  const [user, setUser] = useState<UserProfile | null>({
    name: "Alex Mercer",
    email: "student@vertex.edu",
    rollNo: "VTX-2026-9481",
    avatarSeed: "alex",
    completedChallenges: 3,
    xpCoins: 450,
    grade: "A+ (3.92)",
    enrolledDate: "Sept 12, 2024",
    role: "student"
  });

  // Pages routing ID. If logged-in, standard starts with dashboard; otherwise landing page.
  const [activePage, setActivePage] = useState<PageId>(user ? 'dashboard' : 'landing');

  // Multi-Language Projects cache repository
  const [projects, setProjects] = useState<CompilerProject[]>([
    {
      id: "proj_web_001",
      title: "My Creative Web Project",
      language: "html",
      activeFileName: "index.html",
      createdAt: "06/05/2026",
      updatedAt: "06/06/2026",
      files: [
        { name: "index.html", content: INITIAL_HTML, language: "html" },
        { name: "styles.css", content: INITIAL_CSS, language: "css" },
        { name: "main.js", content: INITIAL_JS, language: "javascript" }
      ]
    },
    {
      id: "proj_py_bfs",
      title: "Python Solver Framework",
      language: "python",
      activeFileName: "main.py",
      createdAt: "06/06/2026",
      updatedAt: "06/06/2026",
      files: [
        { 
          name: "main.py", 
          language: "python",
          content: `# Multi-Language Virtual Sandbox\ndef greet_student(name):\n    print(f"👋 Greetings, {name}! Virtual python compile online.")\n\nstudent = input("Enter standard name: ") or "Alex Mercer"\ngreet_student(student)\n`
        }
      ]
    },
    {
      id: "proj_sql_select",
      title: "SQLite Database Ledger",
      language: "sql",
      activeFileName: "query.sql",
      createdAt: "06/06/2026",
      updatedAt: "06/06/2026",
      files: [
        { 
          name: "query.sql", 
          language: "sql",
          content: `-- SQLite dynamic relational query\nSELECT id, name, enrolledDate, grade \nFROM students \nWHERE grade LIKE 'A%'\nORDER BY id ASC;\n`
        }
      ]
    }
  ]);

  const [activeProjectId, setActiveProjectId] = useState<string>("proj_web_001");

  // Admin roster students lists
  const [students, setStudents] = useState<ManagedStudent[]>([
    { id: "VTX-001", name: "Alex Mercer", email: "student@vertex.edu", rollNo: "VTX-2026-9481", challengesSolved: 4, xp: 450, gpa: 3.92, status: "active" },
    { id: "VTX-002", name: "Charlie Finch", email: "charlie@vertex.edu", rollNo: "VTX-2026-1184", challengesSolved: 3, xp: 320, gpa: 3.52, status: "active" },
    { id: "VTX-003", name: "Jaden Brooks", email: "jaden@vertex.edu", rollNo: "VTX-2026-0045", challengesSolved: 5, xp: 580, gpa: 4.00, status: "active" }
  ]);

  // Legacy variables synced for standard HTML Preview frame
  const [htmlCode, setHtmlCode] = useState<string>(INITIAL_HTML);
  const [cssCode, setCssCode] = useState<string>(INITIAL_CSS);
  const [jsCode, setJsCode] = useState<string>(INITIAL_JS);

  const [useTailwind, setUseTailwind] = useState<boolean>(true);
  const [logs, setLogs] = useState<any[]>([]);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [fontPreference, setFontPreference] = useState<'mono' | 'sans' | 'display'>('mono');
  const [lastCompiledAt, setLastCompiledAt] = useState<string | null>(null);

  // Floating notifications feedback center
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToastNotification = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Intercept events transmitted from our compiler Preview Frame sandboxes
  useEffect(() => {
    const handleSandboxMessageEvent = (event: MessageEvent) => {
      if (event.data && event.data.source === 'compiler_terminal_sandbox') {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        let typeVal: 'log' | 'warn' | 'error' = 'log';
        if (event.data.type === 'warn') typeVal = 'warn';
        if (event.data.type === 'error') typeVal = 'error';

        setLogs(prev => [...prev, { 
          type: typeVal, 
          text: event.data.text, 
          time: timestamp 
        }]);
      }
    };

    window.addEventListener('message', handleSandboxMessageEvent);
    return () => window.removeEventListener('message', handleSandboxMessageEvent);
  }, []);

  // Standard static workspace template override resets
  const handleClearWorkspace = () => {
    setHtmlCode('<!-- Empty draft -->\n');
    setCssCode('/* Empty stylesheet */\n');
    setJsCode('// Empty script\n');
    setLogs([]);
    triggerToastNotification("Workspace cleared successfully!");
  };

  // Compile runner for index.html, main.js, styles.css
  const runCompilerCompilation = () => {
    const iframe = document.getElementById('compiler_preview_iframe') as HTMLIFrameElement;
    if (!iframe) return;

    // Direct JS overrides inside preview container for mirroring prints at parent level
    const loggerScript = `
      <script>
        (function() {
          const origLog = console.log;
          const origWarn = console.warn;
          const origError = console.error;

          console.log = function(...args) {
            origLog.apply(console, args);
            window.parent.postMessage({
              source: 'compiler_terminal_sandbox',
              type: 'log',
              text: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')
            }, '*');
          };

          console.warn = function(...args) {
            origWarn.apply(console, args);
            window.parent.postMessage({
              source: 'compiler_terminal_sandbox',
              type: 'warn',
              text: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')
            }, '*');
          };

          console.error = function(...args) {
            origError.apply(console, args);
            window.parent.postMessage({
              source: 'compiler_terminal_sandbox',
              type: 'error',
              text: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')
            }, '*');
          };

          window.addEventListener('error', function(e) {
            window.parent.postMessage({
              source: 'compiler_terminal_sandbox',
              type: 'error',
              text: 'Uncaught Exception: ' + e.message
            }, '*');
          });
        })();
      </script>
    `;

    const tailwindCdn = useTailwind 
      ? '<script src="https://cdn.tailwindcss.com"></script><script>tailwind.config = { theme: { extend: {} } }</script>' 
      : '';

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          ${tailwindCdn}
          ${loggerScript}
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode}
          <script>
            try {
              ${jsCode}
            } catch(e) {
              console.error(e.message);
            }
          </script>
        </body>
      </html>
    `;

    iframe.srcdoc = content;
    setLastCompiledAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    triggerToastNotification("Bundled sandbox HTML compiled in preview frame! 🟢");
  };

  // Create customized user defined code playground projects
  const handleCreateNewProject = (title: string, language: string) => {
    const defaultContents: Record<string, string> = {
      python: `# Python 3 module\nprint("Hello World!")\n`,
      cpp: `// C++ system\n#include <iostream>\nint main() {\n    std::cout << "Gnu compiler active" << std::endl;\n    return 0;\n}\n`,
      c: `// C language standard\n#include <stdio.h>\nint main() {\n    printf("Compiled C Binary Loaded\\n");\n    return 0;\n}\n`,
      java: `// JDK 21 Application\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("JVM Initialized");\n    }\n}\n`,
      javascript: `// Node environment\nconsole.log("Interactive ES6 callback compiled successfully.");\n`,
      php: `<?php\n// PHP CLI script\necho "Hello from hyper-text container\\n";\n`,
      sql: `-- SQL statements\nCREATE TABLE students (id INT, name TEXT);\nINSERT INTO students VALUES (1, "Alex Mercer");\nSELECT * FROM students;\n`,
      html: `<!-- Quick HTML templates -->\n<h2>Markup Draft</h2>\n`,
      css: `/* layout stylesheet */\nbody { background: #000; }\n`
    };

    const ext: Record<string, string> = {
      python: "main.py", cpp: "main.cpp", c: "main.c", java: "Main.java", 
      javascript: "main.js", php: "index.php", sql: "query.sql", html: "index.html"
    };

    const fileExt = ext[language] || "index.js";
    const starterStr = defaultContents[language] || "// Starter files\n";

    const targetProject: CompilerProject = {
      id: `proj_${Date.now()}`,
      title,
      language: language as ProgrammingLanguage,
      activeFileName: fileExt,
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleTimeString(),
      files: [{ name: fileExt, content: starterStr, language: language as ProgrammingLanguage }]
    };

    setProjects(prev => [...prev, targetProject]);
    setActiveProjectId(targetProject.id);
    setActivePage('workspace');
  };

  const handleSelectRecentProject = (proj: CompilerProject) => {
    setActiveProjectId(proj.id);
    setActivePage('workspace');
    triggerToastNotification(`Swapped active IDE directory path to: "${proj.title}"`);
  };

  // Loads Homework problem straight into Editor workspace
  const handleLoadChallengeIntoWorkspace = (title: string, language: ProgrammingLanguage, content: string, fileName: string) => {
    const loadedProj: CompilerProject = {
      id: `task_${Date.now()}`,
      title: `Assignment: ${title.split(':')[0]}`,
      language,
      activeFileName: fileName,
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleTimeString(),
      files: [{ name: fileName, content, language }]
    };

    setProjects(prev => [...prev, loadedProj]);
    setActiveProjectId(loadedProj.id);
  };

  // Login handler
  const handleLogin = (email: string, name: string, role: 'student' | 'admin') => {
    const isTeacher = role === 'admin' || email.toLowerCase().includes("admin");
    const matchedProfile: UserProfile = {
      name,
      email,
      rollNo: isTeacher ? "FACULTY-ADM-241" : "VTX-2026-9481",
      avatarSeed: "alex",
      completedChallenges: isTeacher ? 5 : 3,
      xpCoins: isTeacher ? 950 : 450,
      grade: isTeacher ? "PHD (Dean)" : "A+ (3.92)",
      enrolledDate: "Sept 12, 2024",
      role: isTeacher ? "admin" : "student"
    };

    setUser(matchedProfile);
    setActivePage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setActivePage('landing');
  };

  const handleUpdateProfile = (name: string, avatarSeed: string) => {
    if (!user) return;
    setUser({
      ...user,
      name,
      avatarSeed
    });
  };

  // Admin handles: award student XP points
  const handleAwardXP = (studentId: string, amount: number) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, xp: s.xp + amount };
      }
      return s;
    }));
  };

  // Admin handles: publish curriculum task
  const handlePostNewTask = (title: string, language: ProgrammingLanguage) => {
    // Simulated add task alerts
    triggerToastNotification(`Successfully broadcasted academic task: "${title}" across class groups!`);
  };

  // CSS mappings
  const fontStyles = {
    mono: 'font-mono',
    sans: 'font-sans',
    display: 'font-display'
  };

  return (
    <div className={`min-h-screen bg-[#040212] text-[#f1f5f9] relative pb-10 ${fontStyles[fontPreference]}`} id="app_root_layout">
      
      {/* Visual background gradients */}
      <div className="absolute top-0 left-0 right-0 h-[450px] bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.18),rgba(0,0,0,0))] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),rgba(0,0,0,0))] pointer-events-none" />

      {/* Unified top logo and page selector menus Navbar */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        onRunCompile={runCompilerCompilation} 
        user={user}
      />

      {/* Primary Main Routing Engine Layout */}
      <main className="relative z-10 pt-24 px-4 md:px-8 max-w-7xl mx-auto min-h-[75vh]">
        
        {/* VIEW 1: LANDING */}
        {activePage === 'landing' && (
          <div className="animate-fade-in">
            <LandingView 
              onLaunchWorkspace={(lang) => {
                if (lang) {
                  const fitProj = projects.find(p => p.language === lang);
                  if (fitProj) setActiveProjectId(fitProj.id);
                }
                setActivePage('workspace');
              }}
              onOpenAuth={(isRegister) => {
                setActivePage('auth');
              }}
              isAuthenticated={user !== null}
            />
          </div>
        )}

        {/* VIEW 2: AUTHENTICATION / USER ACCOUNT VIEWS */}
        {activePage === 'auth' && (
          <div className="animate-fade-in">
            <AuthView 
              user={user}
              onLogin={handleLogin}
              onLogout={handleLogout}
              onUpdateProfile={handleUpdateProfile}
              triggerToastNotification={triggerToastNotification}
            />
          </div>
        )}

        {/* VIEW 3: STUDENT DASHBOARD PLATFORMS */}
        {activePage === 'dashboard' && user && (
          <div className="animate-fade-in">
            <DashboardView 
              user={user}
              projects={projects}
              onCreateNewProject={handleCreateNewProject}
              onSelectProject={handleSelectRecentProject}
              onNavigateToPage={setActivePage}
              triggerToastNotification={triggerToastNotification}
            />
          </div>
        )}

        {/* VIEW 4: CODE EDITOR COMPILER WORKSPACE */}
        {activePage === 'workspace' && (
          <div className="animate-fade-in">
            <WorkspaceView 
              htmlCode={htmlCode}
              setHtmlCode={setHtmlCode}
              cssCode={cssCode}
              setCssCode={setCssCode}
              jsCode={jsCode}
              setJsCode={setJsCode}
              logs={logs}
              setLogs={setLogs}
              useTailwind={useTailwind}
              setUseTailwind={setUseTailwind}
              viewportMode={viewportMode}
              setViewportMode={setViewportMode}
              lastCompiledAt={lastCompiledAt}
              runCompilerCompilation={runCompilerCompilation}
              triggerToastNotification={triggerToastNotification}
              setActivePage={setActivePage}
              projects={projects}
              setProjects={setProjects}
              activeProjectId={activeProjectId}
              setActiveProjectId={setActiveProjectId}
            />
          </div>
        )}

        {/* VIEW 5: CURRICULUM BLUEPRINTS & ASSIGNMENTS LEDGERS */}
        {activePage === 'blueprints' && (
          <div className="animate-fade-in">
            <BlueprintsView 
              onLoadChallenge={handleLoadChallengeIntoWorkspace}
              triggerToastNotification={triggerToastNotification}
              setActivePage={setActivePage}
            />
          </div>
        )}

        {/* VIEW 6: FACULTY / DEAN CONTROL PANELS */}
        {activePage === 'admin' && user && (
          <div className="animate-fade-in">
            <AdminView 
              students={students}
              onAwardXP={handleAwardXP}
              onPostNewTask={handlePostNewTask}
              triggerToastNotification={triggerToastNotification}
            />
          </div>
        )}

        {/* VIEW 7: RESIDENT AI COPILOT AND ASSISTANT CHATS */}
        {activePage === 'ai-copilot' && (
          <div className="animate-fade-in">
            <AiCopilotView 
              htmlCode={htmlCode}
              setHtmlCode={setHtmlCode}
              cssCode={cssCode}
              setCssCode={setCssCode}
              jsCode={jsCode}
              setJsCode={setJsCode}
              triggerToastNotification={triggerToastNotification}
              runCompilerCompilation={runCompilerCompilation}
            />
          </div>
        )}

        {/* VIEW 8: COMPILER SETTINGS AND SYSTEM MODES */}
        {activePage === 'settings' && (
          <div className="animate-fade-in">
            <SettingsView 
              useTailwind={useTailwind}
              setUseTailwind={setUseTailwind}
              viewportMode={viewportMode}
              setViewportMode={setViewportMode}
              fontPreference={fontPreference}
              setFontPreference={setFontPreference}
              onClearWorkspace={handleClearWorkspace}
              htmlCode={htmlCode}
              cssCode={cssCode}
              jsCode={jsCode}
              triggerToastNotification={triggerToastNotification}
            />
          </div>
        )}



      </main>

      {/* Toast Notification Alert systems */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-950 to-indigo-950 border border-purple-500/35 px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2.5 animate-slide-up text-left max-w-sm font-mono">
          <span className="text-purple-400 font-bold select-none">📢</span>
          <p className="text-xs text-purple-200 font-medium leading-normal">{toastMessage}</p>
        </div>
      )}

      {/* Modern footer details */}
      <footer className="mt-20 border-t border-indigo-950/40 pt-6 font-mono text-[10px] text-zinc-600 max-w-7xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span>© 2026 Vertex Online Compiler. Constructed in secure Sandboxed environment.</span>
        </div>
        <div className="flex space-x-4">
          <span>Target Architecture: Web-ASM Multilingual</span>
          <span>● Environment Health: Operating</span>
        </div>
      </footer>

    </div>
  );
}
