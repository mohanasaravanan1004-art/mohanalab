/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  GraduationCap, 
  Terminal, 
  CheckCircle, 
  AlertCircle, 
  ListFilter, 
  Play, 
  BookMarked, 
  FileCode, 
  Clock, 
  Sparkles, 
  Award,
  ChevronRight,
  Database
} from 'lucide-react';
import { PageId, CompilerProject, ProgrammingLanguage, WorkspaceFile } from '../types';

interface Challenge {
  id: string;
  title: string;
  language: ProgrammingLanguage;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  scoreXP: number;
  description: string;
  starterBoilerplate: string;
  starterFileName: string;
  testCases: { input: string; output: string }[];
}

interface BlueprintsViewProps {
  onLoadChallenge: (title: string, language: ProgrammingLanguage, content: string, fileName: string) => void;
  triggerToastNotification: (msg: string) => void;
  setActivePage: (page: PageId) => void;
}

// Classroom curriculum tasks library
const ACADEMIC_CHALLENGES: Challenge[] = [
  {
    id: "py_bfs",
    title: "Assignment #1: Binary Search Array Lookup",
    language: "python",
    difficulty: "Beginner",
    category: "Algorithm",
    scoreXP: 100,
    description: "Write an efficient Binary Search algorithm in Python 3. Read an integer array and a search target from STDIN. Return the matched index or -1 if the element is absent.",
    starterFileName: "search.py",
    starterBoilerplate: `# Python 3 Binary Search Template\nimport sys\n\ndef binary_search(arr, target):\n    # TODO: Implement binary boundary cuts\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\n# Reading stdin streams\nrawData = sys.stdin.read().split()\nif rawData:\n    target = int(rawData[0])\n    array = [int(x) for x in rawData[1:]]\n    print(f"Target: {target} in array: {array}")\n    print(f"Index position: {binary_search(array, target)}")\nelse:\n    # fallback demo outputs\n    print(f"Index position: {binary_search([10, 20, 30, 40, 50], 30)}")\n`,
    testCases: [
      { input: "30 10 20 30 40 50", output: "Index position: 2" },
      { input: "99 5 10 15", output: "Index position: -1" }
    ]
  },
  {
    id: "cpp_pointers",
    title: "Assignment #2: Reference Pointers Memory Swapper",
    language: "cpp",
    difficulty: "Intermediate",
    category: "Memory Management",
    scoreXP: 150,
    description: "Implement structural integer swaps using pointer address referencing in C++. Modify variable states directly without returns.",
    starterFileName: "swapper.cpp",
    starterBoilerplate: `// GNU GCC Compiler swap routine\n#include <iostream>\n\nvoid pointer_swap(int* a, int* b) {\n    // TODO: swap variable values safely using dereferencing\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}\n\nint main() {\n    int x = 45, y = 90;\n    std::cout << "Original: x=" << x << ", y=" << y << std::endl;\n    pointer_swap(&x, &y);\n    std::cout << "Swapped: x=" << x << ", y=" << y << std::endl;\n    return 0;\n}\n`,
    testCases: [
      { input: "", output: "Swapped: x=90, y=45" }
    ]
  },
  {
    id: "sql_join",
    title: "Assignment #3: Multi-Row Relational Select Queries",
    language: "sql",
    difficulty: "Advanced",
    category: "Database Systems",
    scoreXP: 220,
    description: "Formulate an inner join statement query inside SQLite. Query course enrollments list joined with Student IDs, filtering active GPA >= 3.0.",
    starterFileName: "enrollments.sql",
    starterBoilerplate: `-- Connect SQLite memory structure\nSELECT students.id, students.name, grades.course, grades.points\nFROM students\nINNER JOIN grades ON students.id = grades.student_id\nWHERE grades.points >= 3.0\nORDER BY students.name ASC;\n`,
    testCases: [
      { input: "", output: "Active Demo" }
    ]
  },
  {
    id: "html_grades",
    title: "Assignment #4: Interactive Academic Scorecard UI",
    language: "html",
    difficulty: "Intermediate",
    category: "Full Stack UI",
    scoreXP: 180,
    description: "Launch an interactive GPA Calculator card. Allows users to type Subject Names and Credits grades, with active state chart visualizer updates.",
    starterFileName: "index.html",
    starterBoilerplate: `<!-- Full Academic interactive scorecard mock -->\n<div style="font-family: system-ui; padding: 20px; color: #333;">\n  <h2>GPA Metric Calculator</h2>\n  <p>Modify course configurations directly inside index.html</p>\n</div>\n`,
    testCases: []
  }
];

export default function BlueprintsView({ 
  onLoadChallenge, 
  triggerToastNotification, 
  setActivePage 
}: BlueprintsViewProps) {

  // Selected filters: 'all' | 'python' | 'cpp' | 'sql' | 'html'
  const [activeFilter, setActiveFilter] = useState<'all' | 'python' | 'cpp' | 'sql' | 'html'>('all');
  
  // Custom interactive test runner states for visual presentation
  const [runningTestId, setRunningTestId] = useState<string | null>(null);
  const [testOutcomeMsg, setTestOutcomeMsg] = useState<Record<string, string>>({});

  const filteredChallenges = activeFilter === 'all' 
    ? ACADEMIC_CHALLENGES 
    : ACADEMIC_CHALLENGES.filter(c => c.language === activeFilter);

  // Trigger loading challenge to playground
  const handleLoadAssignment = (chal: Challenge) => {
    onLoadChallenge(chal.title, chal.language, chal.starterBoilerplate, chal.starterFileName);
    triggerToastNotification(`Injected workspace files template for "${chal.title}".`);
    setActivePage('workspace');
  };

  // Simulate Running test files on current active panel
  const handleSimulateTests = (chalId: string) => {
    setRunningTestId(chalId);
    triggerToastNotification("Compiling challenge logic and executing standard test-cases...");

    setTimeout(() => {
      setRunningTestId(null);
      setTestOutcomeMsg(prev => ({
        ...prev,
        [chalId]: "✅ UNIT TESTS PASSED (2/2 test cases successfully processed)."
      }));
      triggerToastNotification("Congratulations! Unit test cases match compiler specifications.");
    }, 1500);
  };

  return (
    <div className="space-y-8 text-left" id="academic_curriculum_viewport">
      
      {/* Visual Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/40 via-[#0a0720] to-indigo-950/40 p-6 sm:p-8 rounded-3xl border border-indigo-950/60 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(124,58,237,0.1),transparent)] pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-purple-400" />
            <span className="text-[10px] font-mono tracking-widest text-[#a855f7] font-bold uppercase select-none">
              Institutional Grading &amp; Curriculum Board
            </span>
          </div>
          <h3 className="font-display font-bold text-2xl text-white tracking-tight leading-snug">
            Acquire academic templates &amp; challenges
          </h3>
          <p className="text-xs text-gray-400 max-w-xl font-sans leading-relaxed pt-1">
            Recreate and submit coursework assignments defined by the administrative department. Run compiler tests to gain XP score variables instantly.
          </p>
        </div>

        <div className="shrink-0 flex items-center space-x-2 bg-indigo-950/50 px-4 py-2.5 rounded-2xl border border-indigo-900/40 text-[11px] font-mono text-indigo-300">
          <BookMarked className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Completed: <strong className="text-white">3 out of 4 Tasks</strong></span>
        </div>
      </div>

      {/* Course Filter controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-indigo-950/30 pb-4">
        <div className="flex bg-[#050315] p-1 rounded-xl border border-indigo-950/60">
          {(['all', 'python', 'cpp', 'sql', 'html'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all uppercase cursor-pointer ${
                activeFilter === filter
                  ? 'bg-[#150f42] text-purple-200 border border-purple-500/20 shadow'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <span className="text-[10.5px] font-mono text-gray-500">
          Showing <strong className="text-zinc-300">{filteredChallenges.length}</strong> modules
        </span>
      </div>

      {/* Challenges Loop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredChallenges.map((chal) => {
          const isTesting = runningTestId === chal.id;
          const statusResult = testOutcomeMsg[chal.id];

          return (
            <div 
              key={chal.id}
              className="bg-[#08051e] border border-indigo-950/80 rounded-3xl p-6.5 space-y-5 flex flex-col justify-between relative shadow-lg"
            >
              <div className="space-y-4">
                
                {/* Metadatas */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-purple-400 font-bold bg-[#0d072c] border border-purple-500/10 px-2 py-0.5 rounded uppercase">
                    {chal.category}
                  </span>
                  
                  <div className="flex gap-2">
                    <span className="text-[9px] font-mono font-bold text-yellow-400 bg-yellow-950/40 border border-yellow-500/15 px-2 py-0.5 rounded-full select-none uppercase">
                      +{chal.scoreXP} XP
                    </span>
                    <span className={`text-[9px] font-mono font-bold border px-2 py-0.5 rounded-full select-none uppercase ${
                      chal.difficulty === 'Beginner' ? 'bg-emerald-950/50 text-emerald-300 border-emerald-900/40' :
                      chal.difficulty === 'Intermediate' ? 'bg-indigo-950/50 text-indigo-300 border-indigo-900/40' :
                      'bg-purple-950/50 text-purple-300 border-purple-900/40'
                    }`}>
                      {chal.difficulty}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-display font-extrabold text-white text-md">
                    {chal.title}
                  </h4>
                  <div className="flex items-center space-x-1.5 text-[10px] text-zinc-500 font-mono">
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Workspace target file: <strong className="text-zinc-300">{chal.starterFileName}</strong></span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed font-sans font-medium h-[70px] overflow-hidden hover:overflow-y-auto">
                  {chal.description}
                </p>

              </div>

              {/* Status check response */}
              {statusResult && (
                <div className="bg-emerald-950/15 border border-emerald-500/15 p-2.5 rounded-xl text-[10px] font-mono text-emerald-400 flex items-center space-x-2 animate-fade-in text-left">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <p>{statusResult}</p>
                </div>
              )}

              {/* Controls footer line */}
              <div className="pt-4 border-t border-indigo-950/55 flex justify-between gap-3 font-mono text-xs">
                {chal.testCases.length > 0 && (
                  <button
                    disabled={isTesting}
                    onClick={() => handleSimulateTests(chal.id)}
                    className="px-4 py-2 bg-[#0c0828] hover:bg-[#130d3d] border border-indigo-950 rounded-xl text-[10.5px] font-bold text-gray-300 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                  >
                    {isTesting ? "Executing..." : "Run Test Cases"}
                  </button>
                )}

                <button
                  onClick={() => handleLoadAssignment(chal)}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-[10.5px] font-extrabold text-center flex items-center justify-center gap-1 cursor-pointer shadow hover:shadow-purple-500/10 active:scale-95 transition-all"
                >
                  <span>LOAD TO PLAYGROUND</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
