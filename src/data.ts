/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ServiceItem, ProjectItem, LabExperiment, Testimonial, Technology } from './types';

export const STUDIO_SERVICES: ServiceItem[] = [
  {
    id: 'dashboards',
    title: 'Custom Dashboard Development',
    description: 'We compile unstructured multi-channel streams into high-performance, real-time command dashboards featuring custom interaction models, lightning-fast rendering, and intuitive user ergonomics.',
    iconName: 'LayoutDashboard',
    capabilities: ['Real-time Telemetry', 'Rich SVG Canvas Rendering', 'Actionable Analytical Overlays', 'Dynamic Filtering Engines']
  },
  {
    id: 'saas',
    title: 'SaaS Platform Engineering',
    description: 'Engineering resilient, scalable SaaS applications that accommodate high multi-tenant loads. Built with modular server structures, reliable database transaction lifecycles, and rapid API layers.',
    iconName: 'Cpu',
    capabilities: ['Flexible Stripe Subscriptions', 'Strict Tenant Data Isolation', 'Tiered Role-Based Access Controls', 'Stateless, High-Throughput APIs']
  },
  {
    id: 'webapps',
    title: 'Bespoke Web Applications',
    description: 'Developing high-fidelity custom web experiences that combine modern reactivity with pixel-perfect visual art. Designed for blazing speed, robust state synchronization, and reliable search optimization.',
    iconName: 'Sparkles',
    capabilities: ['SEO-Optimized Architectures', 'Advanced Application Lifecycles', 'Fluid, Custom-Motion User Experiences', 'Highly Configurable UI Systems']
  },
  {
    id: 'analytics',
    title: 'Business Analytics & BI Platforms',
    description: 'Convert vast, dark databases into predictive intelligence assets. We develop complex data processing layers and embed gorgeous, informative chart overlays powered by d3.js and recharts.',
    iconName: 'BarChart3',
    capabilities: ['Predictive Cohort Analysis', 'Custom Spreadsheet Generators', 'Complex Filter and Segment Builders', 'BigQuery & Clickhouse Integrations']
  },
  {
    id: 'ai',
    title: 'Cognitive AI & Agent Solutions',
    description: 'Integrating state-of-the-art Large Language Models into custom business workflows using context-aware agent loops, complex document embeddings, search-grounded analytics, and semantic parsing systems.',
    iconName: 'Brain',
    capabilities: ['Context-Aware Vector Routing', 'Gemini API Integrations', 'RAG Document Retrieval Networks', 'Autonomous Workflow Automation']
  }
];

export const STUDIO_PROJECTS: ProjectItem[] = [
  {
    id: 'freelanceros',
    title: 'High-Fidelity Developer Portfolio & WebGL Canvas',
    category: 'Creative Front-End Web Application',
    description: 'An advanced, premium portfolio framework featuring ultra-smooth physics-supported page transitions, interactive coordinate sandbox grids, mathematical vector shaders, and custom-motion showcase overlays.',
    thumbnail: 'slate-blue',
    tech: ['React 19 Core', 'WebGL Shader Rig', 'Motion API', 'Tailwind CSS v4'],
    metrics: { label: 'Interactive Framerate', value: '120 FPS / Smooth' },
    isLiveSandbox: true
  },
  {
    id: 'collegeerp',
    title: 'Full-Stack SaaS Subscription & Analytics Engine',
    category: 'Enterprise SaaS Engine architecture',
    description: 'A comprehensive starter framework containing multi-tenant data isolations, live Stripe subscription webhooks, scalable JWT user sessions, and pre-integrated analytics trackers with gorgeous, responsive charting dashboards.',
    thumbnail: 'indigo-purple',
    tech: ['PostgreSQL Database', 'Express API Tier', 'JWT Sessions', 'Recharts Graphics'],
    metrics: { label: 'Data Processing Speed', value: '12ms Response' },
    isLiveSandbox: true
  },
  {
    id: 'restaurant-analytics',
    title: 'DevOps Edge Telemetry & Container Monitor',
    category: 'DevOps Systems & Server Infrastructure',
    description: 'A real-time DevOps operations portal displaying active cloud server diagnostics, high-throughput Websocket API event brokers, client rendering latency calculations, and automatic container crash handlers.',
    thumbnail: 'amber-yellow',
    tech: ['Node.js Backend', 'Websocket Streams', 'Redis Cache Tier', 'Google Cloud Run'],
    metrics: { label: 'Streaming Latency', value: 'Sub-millisecond' },
    isLiveSandbox: true
  },
  {
    id: 'icecream-shop',
    title: 'High-Performance E-Commerce Portal & Cart Hub',
    category: 'E-Commerce Platform Architecture',
    description: 'A lightning-fast modern e-commerce storefront featuring optimized catalog image grids, centralized multi-item reactive state managers, local storage checkout memory pools, and automatic invoice engines.',
    thumbnail: 'rose-gold',
    tech: ['React State Context', 'Local Storage Sync', 'Braintree Gateway', 'CSS Grids'],
    metrics: { label: 'Core Web Vital Score', value: '99/100 Mobile' },
    isLiveSandbox: true
  },
  {
    id: 'ai-notes',
    title: 'MD Headless CMS & Generative Blog Architect',
    category: 'Content Platforms & Generative AI Tools',
    description: 'A smart editorial content workspace featuring Markdown syntax parsers, auto-generation of structured JSON-LD SEO metadata tags, and integrated Gemini semantic analysis triggers to refine editorial posts.',
    thumbnail: 'cyan-teal',
    tech: ['Gemini Cognitive SDK', 'Markdown Parser Core', 'Structured JSON-LD', 'IndexedDB Storage'],
    metrics: { label: 'SEO Integration Score', value: '100% Compliant' },
    isLiveSandbox: true
  }
];

export const LAB_EXPERIMENTS: LabExperiment[] = [
  {
    id: 'neural-sandbox',
    title: 'Neural Node Flow Sandbox',
    status: 'beta',
    description: 'An interactive, visual node designer that represents real-time agent workflow routing, conditional logic filters, and LLM text generation steps in a draggable canvas format.',
    tech: ['SVG Canvas', 'Matrix Math', 'Motion Physics'],
    version: 'v0.8.2'
  },
  {
    id: 'canvas-generator',
    title: 'Mathematical SVG Shader Rig',
    status: 'alpha',
    description: 'A clean, high-performance mathematics render playground generating beautiful, futuristic vector matrices and parametric particle equations in the browser using custom React hooks.',
    tech: ['Trigonometry Physics', 'GPU Compositor', 'Ref Anchors'],
    version: 'v0.4.0'
  },
  {
    id: 'telemetry-stream',
    title: 'Live Edge Log Streamer',
    status: 'stable',
    description: 'A raw visual telemetry log stream simulator that filters mock diagnostic web server logs at up to 10k items per minute, measuring browser painting performance.',
    tech: ['Virtual Scrolling', 'Array Buffers', 'Terminal Render'],
    version: 'v1.0.5'
  }
];

export const CLIENT_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Sarah Jenkins',
    role: 'VP of Product Engineering',
    company: 'Solotech Corp',
    content: 'Mohana Labs delivered our core tracking dashboard 3 weeks ahead of schedule. The visual polish and smooth animations are unmatched—it felt more like a fluid video game HUD than a standard Enterprise tracker.',
    avatarSeed: 'sarah',
    rating: 5
  },
  {
    id: 't2',
    name: 'Vikram Mehta',
    role: 'Founder & CEO',
    company: 'AltFinance',
    content: 'We contracted Mohana Labs to rebuild our entire B2B SaaS onboarding portal. Their mastery of responsive layouts and glassmorphic card designs has directly resulted in an 18% improvement in customer sign-up conversion.',
    avatarSeed: 'vikram',
    rating: 5
  },
  {
    id: 't3',
    name: 'Evelyn Choi',
    role: 'Head of Operations',
    company: 'BiteStack Group',
    content: 'The custom point-of-sale restaurant dashboard they created is now deployed inside 40+ restaurant venues. The speed of the live tables status and interactive reporting has significantly improved our floor management agility.',
    avatarSeed: 'evelyn',
    rating: 5
  }
];

export const STUDIO_TECHNOLOGIES: Technology[] = [
  { name: 'React 19 & Vite', category: 'frontend', level: 'Core', description: 'Interactive render-heavy client hubs with lightning-fast modular reloading layouts.', iconColor: 'text-indigo-400' },
  { name: 'TypeScript', category: 'frontend', level: 'Strict Type', description: 'Static type verification preventing runtime edge-case data crashes.', iconColor: 'text-blue-400' },
  { name: 'Tailwind CSS v4', category: 'frontend', level: 'Utility CSS', description: 'Advanced next-gen CSS compiler crafting cohesive startup identities.', iconColor: 'text-cyan-400' },
  { name: 'Motion / Framer', category: 'frontend', level: 'Fluid UI', description: 'Smooth, physics-supported page transitions and feedback animations.', iconColor: 'text-fuchsia-400' },
  { name: 'Express / Node.js', category: 'backend', level: 'High-Scale', description: 'Server processes running ultra-clean cluster routes and API adapters.', iconColor: 'text-emerald-400' },
  { name: 'PostgreSQL Core', category: 'backend', level: 'Relational DB', description: 'Strict transaction lifecycles holding customer matrices securely.', iconColor: 'text-indigo-500' },
  { name: 'Redis Caching', category: 'backend', level: 'Sub-Millisecond', description: 'Distributed high-speed session storage supporting high user load spikes.', iconColor: 'text-red-400' },
  { name: 'Google Cloud Run', category: 'cloud', level: 'Containers', description: 'Automated stateless server scaling, handling direct global ingress endpoints.', iconColor: 'text-blue-500' },
  { name: 'Gemini Cognitive SDK', category: 'ai', level: 'Cognitive LLM', description: 'Leveraging contextual generative AI routing and structured system parsing.', iconColor: 'text-violet-400' },
  { name: 'Recharts & D3.js', category: 'analytics', level: 'BI Portal', description: 'Visual analytical canvases turning databases into high-end graphs.', iconColor: 'text-amber-400' }
];

export const STUDIO_STATS = [
  { id: 'stat1', number: '72+', label: 'Digital Products Designed' },
  { id: 'stat2', number: '99.6%', label: 'On-Time Project Delivery' },
  { id: 'stat3', number: '18M+', label: 'End User Transactions Managed' },
  { id: 'stat4', number: '14+', label: 'Global SaaS Platforms Launched' }
];
