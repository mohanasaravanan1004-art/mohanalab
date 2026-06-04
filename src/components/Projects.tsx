/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  Award, 
  Sparkles, 
  Check, 
  ChevronRight, 
  Copy, 
  RotateCcw, 
  Terminal, 
  Play, 
  Calendar,
  Layers,
  Code2,
  Cpu
} from 'lucide-react';

interface DayItem {
  day: number;
  title: string;
  category: 'HTML' | 'CSS' | 'JavaScript' | 'Advanced JS & APIs' | 'Full Projects & Deployment';
  week: number;
  description: string;
  practicalQuiz: string;
  codeSnippet: string;
}

const ROADMAP_DAYS: DayItem[] = [
  {
    day: 1,
    title: 'Setup VS Code',
    category: 'HTML',
    week: 1,
    description: 'Install Visual Studio Code, set up useful extensions like Live Server, Prettier, and Auto Rename Tag. Learn how to open workspaces and run real-time local servers.',
    practicalQuiz: 'Install Live Server extension and boot a Hello World HTML file on port 5500.',
    codeSnippet: '<!-- Open folder in VS Code, right click index.html and press "Open with Live Server" -->'
  },
  {
    day: 2,
    title: 'HTML Basics',
    category: 'HTML',
    week: 1,
    description: 'Learn fundamental document structures. Understand tags, paragraph headers, anchor tags, paragraph groupings, semantic divisions, and line break structures.',
    practicalQuiz: 'Create a structure containing tags for h1-h6 headers, 3 paragraphs, and a relative link.',
    codeSnippet: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My First HTML Page</title>\n</head>\n<body>\n  <h1>Welcome to Web Dev</h1>\n  <p>Learning basics step-by-step.</p>\n</body>\n</html>'
  },
  {
    day: 3,
    title: 'Forms',
    category: 'HTML',
    week: 1,
    description: 'Understand input types, labels, radio elements, checkbox collections, selectors, textareas, and submit buttons. Learn target attributes.',
    practicalQuiz: 'Build a contact form containing text inputs, a dropdown Selector, and Submit button.',
    codeSnippet: '<form action="/submit" method="POST">\n  <label for="student">Student Name:</label>\n  <input type="text" id="student" name="student" required>\n  <button type="submit">Submit Details</button>\n</form>'
  },
  {
    day: 4,
    title: 'Tables',
    category: 'HTML',
    week: 1,
    description: 'Organize modular data using table headers (th), table rows (tr), cells (td), headers, footers, colspans, and rowspans.',
    practicalQuiz: 'Generate a 3-column academic exam marksheet showcasing score matrices.',
    codeSnippet: '<table border="1">\n  <thead>\n    <tr>\n      <th>Subject</th>\n      <th>Internal Mark</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Physics</td>\n      <td>92%</td>\n    </tr>\n  </tbody>\n</table>'
  },
  {
    day: 5,
    title: 'CSS Basics',
    category: 'CSS',
    week: 1,
    description: 'Understand inline, internal, and external CSS style rules. Learn font families, basic text-align formatting, colors, and background hex codes.',
    practicalQuiz: 'Create an index.css file and link it to style parent bodies with deep violet tones.',
    codeSnippet: '/* index.css stylesheet file example */\nbody {\n  background-color: #0b0a1a;\n  color: #f3f4f6;\n  font-family: sans-serif;\n}'
  },
  {
    day: 6,
    title: 'Box Model',
    category: 'CSS',
    week: 1,
    description: 'Master the fundamental architectural layout block. Study borders, relative paddings, outer margins, content dimension calculations, and box-sizing constraints.',
    practicalQuiz: 'Adjust margins on 3 nested custom container blocks to keep padding values uniform.',
    codeSnippet: '.box-block {\n  width: 300px;\n  padding: 20px;\n  border: 1px solid #7c3aed;\n  margin: 15px;\n  box-sizing: border-box;\n}'
  },
  {
    day: 7,
    title: 'Landing Page',
    category: 'HTML',
    week: 1,
    description: 'Combine all HTML structures and inline/external CSS to draft a complete, clean responsive landing page presentation for a student laboratory.',
    practicalQuiz: 'Draft a visual preview with center headings, navigation anchors, forms, contact cards, and image assets.',
    codeSnippet: '<header>\n  <nav>\n    <a href="#about">About</a> | <a href="#courses">Courses</a>\n  </nav>\n</header>'
  },
  {
    day: 8,
    title: 'Flexbox',
    category: 'CSS',
    week: 2,
    description: 'Build responsive grids using flexible boxes. Understand flex justifications, items alignment, wraps, direction coordinates, dynamic flex rates, and absolute priorities.',
    practicalQuiz: 'Align 4 menu buttons horizontally to spread evenly on broad desktop layouts.',
    codeSnippet: '.flex-navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 12px;\n}'
  },
  {
    day: 9,
    title: 'Grid',
    category: 'CSS',
    week: 2,
    description: 'Harness two-dimensional grids. Configure template rows, column structures, gap spacing alignments, auto-flows, responsive screen adaptation formulas.',
    practicalQuiz: 'Design a 3-column mock catalog grid layout using CSS grid parameters.',
    codeSnippet: '.grid-layout {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 16px;\n}'
  },
  {
    day: 10,
    title: 'Animations',
    category: 'CSS',
    week: 2,
    description: 'Configure interactive visual movements on key hover inputs using transitions, transforms, keyframes modifiers, scale loops, and fade rotations.',
    practicalQuiz: 'Animate a submit button to double scale on hovering state.',
    codeSnippet: '.btn-animate {\n  transition: transform 0.2s ease;\n}\n.btn-animate:hover {\n  transform: scale(1.05);\n}'
  },
  {
    day: 11,
    title: 'Responsive Design',
    category: 'CSS',
    week: 2,
    description: 'Utilize CSS Media Queries, fluid percentage lengths, viewport tags, max-widths, and conditional styles.',
    practicalQuiz: 'Define custom grid columns that shift from double to single block stacks under 768px.',
    codeSnippet: '@media (max-width: 768px) {\n  .sidebar-layout {\n    display: none; /* Hide on smaller viewports */\n  }\n}'
  },
  {
    day: 12,
    title: 'Navbar',
    category: 'CSS',
    week: 2,
    description: 'Construct a sticky header featuring menu transitions, floating elements, brand headers, responsive links, and mobile-responsive alignment logic.',
    practicalQuiz: 'Assemble a sticky header fixed perfectly to top heights.',
    codeSnippet: '.sticky-nav {\n  position: sticky;\n  top: 0;\n  z-index: 50;\n  backdrop-filter: blur(12px);\n}'
  },
  {
    day: 13,
    title: 'Dashboard UI',
    category: 'CSS',
    week: 2,
    description: 'Assemble multi-panel screen grids containing progress boards, visual stat charts, tables, sidebar navigators, and clean custom action icons.',
    practicalQuiz: 'Assemble clean responsive card widgets framed in structured borders.',
    codeSnippet: '/* UI Frame wrapper */\n.dashboard-card {\n  background: #0f0a2e;\n  border-radius: 16px;\n  padding: 24px;\n}'
  },
  {
    day: 14,
    title: 'Portfolio',
    category: 'CSS',
    week: 2,
    description: 'Synthesize standard display properties into a beautiful, personalized, responsive portfolio presentation outlining contact links and project cards.',
    practicalQuiz: 'Refactor spacing margins, font size hierarchies, visual contrast levels, and interactive tags.',
    codeSnippet: '<!-- Showcase Section -->\n<section id="portfolio-showcase">\n  <h2>My Web Showcase</h2>\n</section>'
  },
  {
    day: 15,
    title: 'Variables',
    category: 'JavaScript',
    week: 3,
    description: 'Step into logic engines. Understand how variables retain memory states. Study string formatting, numeric mathematics, logical let vs const declarations, block scopes.',
    practicalQuiz: 'Initialize dynamic state parameters calculating cumulative mark averages inside a template console.',
    codeSnippet: 'const rawScores = 85;\nlet finalGrade = rawScores + 5;\nconsole.log(`Updated Mark is: ${finalGrade}`);'
  },
  {
    day: 16,
    title: 'Functions',
    category: 'JavaScript',
    week: 3,
    description: 'Design modular code blocks. Setup parameter inputs, return expressions, scope constraints, modern arrow configurations, functional declarations.',
    practicalQuiz: 'Draft a conversion script analyzing target parameters to output calculated percentages.',
    codeSnippet: 'const computePercentage = (score, total) => {\n  return Math.round((score / total) * 100);\n};'
  },
  {
    day: 17,
    title: 'DOM',
    category: 'JavaScript',
    week: 3,
    description: 'Interact with visual elements in real-time. Understand DOM query selections, innerText updates, classList styling edits, and listening to mouse interactions.',
    practicalQuiz: 'Write a script listening to user click parameters on buttons to toggle high contrast layout states.',
    codeSnippet: 'const actionBtn = document.querySelector("#action");\nactionBtn.addEventListener("click", () => {\n  document.body.classList.toggle("light-mode");\n});'
  },
  {
    day: 18,
    title: 'Validation',
    category: 'JavaScript',
    week: 3,
    description: 'Establish smart rules to intercept dynamic form submissions. Verify input string lengths, valid emails formats, numerical dimensions, and output real-time validation warnings.',
    practicalQuiz: 'Inhibit standard submission events on contact forms if text queries enter empty values.',
    codeSnippet: 'const regForm = document.querySelector("form");\nregForm.addEventListener("submit", (e) => {\n  if(!input.value) e.preventDefault();\n});'
  },
  {
    day: 19,
    title: 'Arrays',
    category: 'JavaScript',
    week: 3,
    description: 'Manage rich list states. Harness iteration loops, collection sorting, items filter queries, mapping conversions, find structures, indexes.',
    practicalQuiz: 'Create a list of 5 course subjects and filter out assignments with deadlines older than today.',
    codeSnippet: 'const tasks = [{id: 1, status: "pending"}];\nconst urgent = tasks.filter(t => t.status === "pending");'
  },
  {
    day: 20,
    title: 'Local Storage',
    category: 'JavaScript',
    week: 3,
    description: 'Maintain persistent memory across reloading queries using browser storage APIs. Learn how to transform data tables via JSON stringification.',
    practicalQuiz: 'Write user input text directly into storage buffers to recall the saved configuration on reload.',
    codeSnippet: 'localStorage.setItem("user_theme_index", "dark");\nconst currentTheme = localStorage.getItem("user_theme_index");'
  },
  {
    day: 21,
    title: 'To-Do App',
    category: 'JavaScript',
    week: 3,
    description: 'Draft an interactive, persistence-supported interactive list to manage daily user action items.',
    practicalQuiz: 'Assemble a fully responsive, stateful item manager dashboard that automatically stores entries inside local memory systems.',
    codeSnippet: '/* Combine array state tracking with localStorage and DOM query selectors */'
  },
  {
    day: 22,
    title: 'API Basics',
    category: 'Advanced JS & APIs',
    week: 4,
    description: 'Understand how internet requests work. Analyze server states, response JSON schemas, query headers, request method coordinates (GET, POST).',
    practicalQuiz: 'Study standard HTTP response structures and response codes (e.g. 200 OK, 404 Not Found).',
    codeSnippet: '// JSON format placeholder sample\n{\n  "status": "success",\n  "data": { "userId": 101 }\n}'
  },
  {
    day: 23,
    title: 'Fetch API',
    category: 'Advanced JS & APIs',
    week: 4,
    description: 'Master async/await patterns. Pull server information using fetch parameters and map JSON objects directly into interactive UI lists dynamic components.',
    practicalQuiz: 'Run an async function pulling sample resource data lists from mock online endpoints.',
    codeSnippet: 'async function downloadResources() {\n  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");\n  const obj = await res.json();\n}'
  },
  {
    day: 24,
    title: 'Weather App',
    category: 'Advanced JS & APIs',
    week: 4,
    description: 'Pull operational thermodynamic coordinates from weather parameters. Read temperature grades and convert them into live display visual blocks inside cards.',
    practicalQuiz: 'Create a clean layout showing relative wind metrics, local names, and temperatures.',
    codeSnippet: '/* Connect city inputs with fetch queries targeting public climate servers */'
  },
  {
    day: 25,
    title: 'Student Dashboard',
    category: 'Advanced JS & APIs',
    week: 4,
    description: 'Create an integrated workspace portal managing academic assignments, marks spreadsheets, event calendars, and progress tickers.',
    practicalQuiz: 'Construct status metrics matching attendance percentages linked to interactive input scales.',
    codeSnippet: '/* Dynamic student spreadsheet calculations */'
  },
  {
    day: 26,
    title: 'Expense Tracker',
    category: 'Advanced JS & APIs',
    week: 4,
    description: 'Track, sum, and format monthly numeric expense logs. Understand how to push individual items and recalculate aggregate balances mathematically.',
    practicalQuiz: 'Formulate lists dividing debit entries while tracking ongoing overall cumulative balance sums.',
    codeSnippet: 'const expenseList = [500, 1200, 310];\nconst aggregateExpense = expenseList.reduce((acc, curr) => acc + curr, 0);'
  },
  {
    day: 27,
    title: 'E-Commerce Page',
    category: 'Advanced JS & APIs',
    week: 4,
    description: 'Create interactive web store designs. Implement interactive shopping cart structures, update total cost metrics, clear items checklists.',
    practicalQuiz: 'Build dynamic items arrays that update counters whenever click actions add them to shopping baskets.',
    codeSnippet: '/* Manage multi-item cart aggregates in storage */'
  },
  {
    day: 28,
    title: 'College Portal',
    category: 'Advanced JS & APIs',
    week: 4,
    description: 'Establish unified hubs logging academic announcements, lab evaluations scheduling dates, and course syllabi folders.',
    practicalQuiz: 'Group calendar events side-by-side using responsive columns.',
    codeSnippet: '<!-- Announcement card structure -->'
  },
  {
    day: 29,
    title: 'Portfolio Final',
    category: 'Full Projects & Deployment',
    week: 5,
    description: 'Integrate your achievements into a finalized clean main hub website. Ensure optimal contrast, speed performance, search indexes optimization.',
    practicalQuiz: 'Add quick direct navigators, clean transition hooks, beautiful negative spaces, and customized typography.',
    codeSnippet: '/* Standardized CSS font configurations and layout blocks compilation */'
  },
  {
    day: 30,
    title: 'Deployment',
    category: 'Full Projects & Deployment',
    week: 5,
    description: 'Deploy files online live to global hosting distributions like Netlify, Vercel, or GitHub Pages. Map your public access links.',
    practicalQuiz: 'Publish your workspace portfolio to production branch distributions on HTTPS domains.',
    codeSnippet: '# Build production static distributions directory\nnpm run build'
  }
];

export default function Projects() {
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayItem>(ROADMAP_DAYS[0]);
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize and load completed list from local storage
  useEffect(() => {
    const saved = localStorage.getItem('webdev_30day_roadmap_completed');
    if (saved) {
      try {
        setCompletedDays(JSON.parse(saved));
      } catch (e) {
        setCompletedDays([]);
      }
    }
  }, []);

  // Save changes to Local Storage
  const saveChange = (updated: number[]) => {
    setCompletedDays(updated);
    localStorage.setItem('webdev_30day_roadmap_completed', JSON.stringify(updated));
  };

  // Toggle single day click
  const handleToggleDay = (day: number) => {
    let next: number[];
    if (completedDays.includes(day)) {
      next = completedDays.filter(d => d !== day);
      triggerToast(`Day ${day} marked as continuous learning.`);
    } else {
      next = [...completedDays, day].sort((a,b) => a-b);
      triggerToast(`🎉 Awesome! Day ${day} completed!`);
    }
    saveChange(next);
  };

  // Helper to mark everything completed or reset
  const handleMarkAll = () => {
    const all = ROADMAP_DAYS.map(d => d.day);
    saveChange(all);
    triggerToast('All 30 Days successfully marked as Shipped!');
  };

  const handleResetAll = () => {
    saveChange([]);
    triggerToast('Roadmap progress successfully reset.');
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Copy code utility
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    triggerToast('Code snippet copied to clipboard!');
  };

  // Filter calculations
  const filteredDays = ROADMAP_DAYS.filter(d => {
    const matchesWeek = selectedWeek === 'all' || d.week === selectedWeek;
    const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;
    return matchesWeek && matchesCategory;
  });

  const completionPercent = Math.round((completedDays.length / ROADMAP_DAYS.length) * 100);

  // Quick stat grouping
  const statsByWeek = [1, 2, 3, 4, 5].map(wk => {
    const daysInWeek = ROADMAP_DAYS.filter(d => d.week === wk).map(d => d.day);
    const completedInWeek = completedDays.filter(day => daysInWeek.includes(day)).length;
    return {
      week: wk,
      total: daysInWeek.length,
      completed: completedInWeek
    };
  });

  return (
    <div id="projects_view_wrapper" className="w-full">
      <section className="relative py-16 px-4 md:px-8 bg-[#040212]" id="labs_master_container">
        
        {/* Futuristic Grid Overlay Matching branding styles */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#150e41_1px,transparent_1px),linear-gradient(to_bottom,#150e41_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />
        <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-violet-900/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] rounded-full bg-indigo-950/20 blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-10 relative z-10">
          
          {/* Header Banner Block containing interactive progress metrics */}
          <div className="bg-[#07051e]/90 border border-indigo-950/80 p-6 md:p-8 rounded-3xl relative overflow-hidden backdrop-blur-md">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Title descriptions */}
              <div className="lg:col-span-7 space-y-3 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[9px] tracking-widest text-[#a855f7] font-semibold bg-purple-950/60 px-2.5 py-1 rounded-md uppercase border border-purple-800/40">
                    Syllabus Planner
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#fbd38d] animate-pulse" />
                  <span className="text-[10px] text-gray-400 font-mono">Offline Progress Tracking</span>
                </div>
                <h2 id="main_title_section" className="font-display font-medium text-3xl text-white tracking-tight">
                  30-Day Web Development Masterclass
                </h2>
                <p className="text-gray-400 text-xs max-w-xl leading-relaxed">
                  Focus on one dedicated lesson daily. Learn step-by-step from raw VS Code setup, HTML tags, responsive CSS layouts, interactive JavaScript, server APIs integration, up to cloud web deployment.
                </p>
              </div>

              {/* Progress visual widgets */}
              <div className="lg:col-span-5 bg-[#0a0729]/80 border border-indigo-950 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-mono text-slate-300">Total Completed Sprints</span>
                  </div>
                  <span className="text-xl font-mono font-bold text-amber-400">
                    {completedDays.length} <span className="text-stone-500 text-sm">/ 30 Days</span>
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="w-full bg-[#12102e] rounded-full h-2.5 overflow-hidden border border-indigo-950/80">
                    <div 
                      className="bg-gradient-to-r from-purple-500 via-amber-500 to-emerald-500 h-full transition-all duration-500"
                      style={{ width: `${completionPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                    <span>{completionPercent}% Completed</span>
                    <span>{30 - completedDays.length} Days Remain</span>
                  </div>
                </div>

                {/* Reset or fill actions */}
                <div className="flex gap-2">
                  <button 
                    onClick={handleMarkAll}
                    className="flex-1 py-1.5 bg-[#7c3aed]/10 hover:bg-[#7c3aed]/20 text-[#a855f7] border border-[#a855f7]/30 rounded-lg text-[10px] font-mono transition-colors cursor-pointer"
                  >
                    Mark All 30 Days Done
                  </button>
                  <button
                    onClick={handleResetAll}
                    className="py-1.5 px-3 bg-white/5 hover:bg-red-950/40 text-gray-400 hover:text-red-400 border border-white/5 hover:border-red-500/20 rounded-lg text-[10px] font-mono transition-all cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] px-5 py-2.5 rounded-full max-w-md mx-auto text-center flex items-center justify-center space-x-2 shadow-xl animate-fade-in backdrop-blur-md">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Task Filters & Interactive Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left side list containing 30-Day list */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Navigation Filters */}
              <div className="bg-[#08051e]/90 border border-indigo-950 p-4 rounded-2xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest block font-bold">
                    Filter By Lesson Module
                  </span>
                  
                  <div className="flex flex-wrap gap-1">
                    {['all', 'HTML', 'CSS', 'JavaScript', 'Advanced JS & APIs', 'Full Projects & Deployment'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2.5 py-1 rounded text-[10.5px] font-mono transition-all cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-[#a855f7]/20 text-[#c084fc] border border-[#a855f7]/50'
                            : 'text-gray-500 hover:text-stone-300'
                        }`}
                      >
                        {cat === 'all' ? 'All Subjects' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2 border-t border-indigo-950/50">
                  <span className="font-mono text-[10px] text-gray-500 uppercase shrink-0">Weeks:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setSelectedWeek('all')}
                      className={`px-2.5 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                        selectedWeek === 'all' ? 'bg-indigo-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'
                      }`}
                    >
                      All Weeks
                    </button>
                    {[1, 2, 3, 4, 5].map((wk) => {
                      const stats = statsByWeek.find(s => s.week === wk);
                      return (
                        <button
                          key={wk}
                          onClick={() => setSelectedWeek(wk)}
                          className={`px-2.5 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer flex items-center space-x-1.5 ${
                            selectedWeek === wk ? 'bg-indigo-600 text-white font-bold' : 'bg-[#0f0c30] text-gray-400 hover:text-white border border-indigo-950/60'
                          }`}
                        >
                          <span>Wk {wk}</span>
                          <span className="text-[8px] bg-black/40 px-1 py-0.1 rounded text-[#a855f7]">
                            {stats?.completed}/{stats?.total}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Day items lists stack */}
              <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
                {filteredDays.length === 0 ? (
                  <div className="py-20 text-center text-xs text-gray-500 border border-dashed border-indigo-950 rounded-2xl flex flex-col items-center justify-center space-y-3">
                    <BookOpen className="w-10 h-10 text-indigo-900" />
                    <span>No days match current selection metrics.</span>
                  </div>
                ) : (
                  filteredDays.map((d) => {
                    const isCompleted = completedDays.includes(d.day);
                    const isSelected = selectedDay.day === d.day;
                    
                    return (
                      <div
                        key={d.day}
                        onClick={() => setSelectedDay(d)}
                        className={`group p-3.5 rounded-xl border transition-all flex items-center justify-between gap-4 cursor-pointer ${
                          isSelected 
                            ? 'bg-[#120e3a] border-purple-500/40 shadow-lg shadow-[#7C3AED]/5' 
                            : 'bg-[#08051e] border-indigo-950/80 hover:border-indigo-900 hover:bg-[#0c092c]'
                        }`}
                      >
                        <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                          {/* Checked Checkbox Icon */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleDay(d.day);
                            }}
                            className="p-1 rounded-md border border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                            )}
                          </button>

                          {/* Titles */}
                          <div className="text-left min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-[10px] text-[#a855f7] bg-purple-950/50 px-1.5 py-0.2 rounded-md">
                                Day {d.day}
                              </span>
                              <span className="text-[9px] text-[#f59e0b] font-mono">
                                Week {d.week}
                              </span>
                            </div>
                            <h4 className={`text-xs font-semibold text-white mt-1 truncate ${isCompleted ? 'line-through text-slate-500' : ''}`}>
                              {d.title}
                            </h4>
                          </div>
                        </div>

                        {/* Category Badge & Detail Arrow */}
                        <div className="flex items-center space-x-2 shrink-0">
                          <span className="hidden md:inline bg-[#1c123f]/80 text-[#d8b4FE] border border-purple-900/40 text-[9px] font-mono px-2 py-0.5 rounded">
                            {d.category}
                          </span>
                          <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform group-hover:translate-x-1 ${
                            isSelected ? 'text-amber-400 translate-x-1' : ''
                          }`} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>

            {/* Right side Detail Dashboard Panel */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Daily Syllabus Content Drawer */}
              <div className="bg-[#08051e] border border-purple-950/50 rounded-3xl p-6 space-y-6 relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
                
                {/* Visual Header card */}
                <div className="flex items-start justify-between pb-4 border-b border-indigo-950">
                  <div className="space-y-1 text-left">
                    <span className="bg-amber-950/40 border border-amber-900/40 text-amber-400 text-[10px] font-mono px-2 py-0.5 rounded uppercase">
                      Active Day {selectedDay.day} Study File
                    </span>
                    <h3 className="font-display font-medium text-white text-lg mt-2">
                      {selectedDay.title}
                    </h3>
                    <p className="text-[10px] text-gray-500 font-mono">
                      Module Category: <span className="text-purple-400">{selectedDay.category}</span>
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-indigo-950/60 border border-indigo-900/60 flex items-center justify-center shrink-0">
                    <Code2 className="w-5 h-5 text-[#a855f7]" />
                  </div>
                </div>

                {/* Lesson Description */}
                <div className="space-y-2 text-left">
                  <span className="font-mono text-[9px] text-gray-400 uppercase tracking-widest block font-bold">
                    Lesson Overview
                  </span>
                  <p className="text-xs text-stone-300 leading-relaxed font-sans">
                    {selectedDay.description}
                  </p>
                </div>

                {/* Practical Milestone Challenge */}
                <div className="p-4 bg-purple-950/20 border border-purple-900/30 rounded-2xl text-left space-y-2">
                  <span className="font-mono text-[9px] text-[#a855f7] uppercase tracking-widest block font-bold">
                    Daily Homework/Milestone Check
                  </span>
                  <p className="text-xs text-stone-200">
                    {selectedDay.practicalQuiz}
                  </p>
                </div>

                {/* Sample Code Editor Block */}
                <div className="space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] text-gray-400 uppercase tracking-widest block font-bold">
                      Interactive Practice Blueprint
                    </span>
                    <button
                      onClick={() => handleCopyCode(selectedDay.codeSnippet)}
                      className="text-[9px] text-amber-400 hover:text-white font-mono flex items-center space-x-1 cursor-pointer"
                      title="Copy code to clipboards"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy Template</span>
                    </button>
                  </div>

                  <div className="bg-[#040212] p-4 rounded-xl border border-indigo-950/80 max-h-48 overflow-y-auto relative group">
                    <pre className="text-[11px] font-mono text-purple-300 leading-normal block whitespace-pre-wrap">
                      {selectedDay.codeSnippet}
                    </pre>
                  </div>
                </div>

                {/* Quick Task completion slider trigger card */}
                <div className="pt-4 border-t border-indigo-950 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gray-400">
                    Day status: {completedDays.includes(selectedDay.day) ? (
                      <span className="text-emerald-400 font-bold">● Completed</span>
                    ) : (
                      <span className="text-rose-400">○ Pending Completion</span>
                    )}
                  </span>

                  <button
                    onClick={() => handleToggleDay(selectedDay.day)}
                    className={`px-4 py-2 text-xs font-mono rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                      completedDays.includes(selectedDay.day)
                        ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/20'
                        : 'bg-indigo-600 hover:bg-[#7c3aed] text-white'
                    }`}
                  >
                    {completedDays.includes(selectedDay.day) ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Toggle Status</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-current" />
                        <span>Mark as Completed</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* Motivational Sprint Stats Cards */}
              <div className="bg-gradient-to-br from-indigo-950/30 to-purple-950/20 border border-indigo-950 rounded-2xl p-4 text-left">
                <div className="flex items-start space-x-3.5">
                  <span className="text-xl">🏆</span>
                  <div>
                    <span className="text-[10px] text-amber-400 font-mono uppercase block">Syllabus Certificate Milestones</span>
                    <p className="text-stone-300 text-xs font-semibold mt-0.5">
                      {completionPercent >= 100 
                        ? '🏆 Level 5: Master Developer Cert Shipped!' 
                        : completionPercent >= 75 
                          ? '🚀 Level 4: Project Pro Ready (Weeks 1-4 completed!)' 
                          : completionPercent >= 50 
                            ? '💻 Level 3: Javascript Engine Complete!' 
                            : completionPercent >= 25 
                              ? '🎨 Level 2: CSS Layout Shipped!' 
                              : '📘 Level 1: Ready to Begin'}
                    </p>
                    <p className="text-[9px] text-[#a855f7] font-mono mt-1">
                      Check off 30 distinct daily syllabus boxes to complete the masterclass.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
