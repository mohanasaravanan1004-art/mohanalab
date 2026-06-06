/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PageId = 
  | 'landing' 
  | 'auth' 
  | 'dashboard' 
  | 'workspace' 
  | 'blueprints' 
  | 'admin' 
  | 'ai-copilot' 
  | 'settings';

export type ProgrammingLanguage = 
  | 'javascript' 
  | 'typescript'
  | 'python' 
  | 'cpp' 
  | 'c' 
  | 'java' 
  | 'html' 
  | 'css' 
  | 'php' 
  | 'sql'
  | 'go'
  | 'rust'
  | 'kotlin'
  | 'swift'
  | 'csharp'
  | 'ruby';

export interface UserProfile {
  name: string;
  email: string;
  rollNo?: string;
  avatarSeed: string;
  completedChallenges: number;
  xpCoins: number;
  grade: string;
  enrolledDate: string;
  role: 'student' | 'admin';
}

export interface WorkspaceFile {
  name: string;
  content: string;
  language: ProgrammingLanguage;
}

export interface CompilerProject {
  id: string;
  title: string;
  language: ProgrammingLanguage;
  files: WorkspaceFile[];
  activeFileName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CodingChallenge {
  id: string;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  language: ProgrammingLanguage;
  startingCode: string;
  testInput: string;
  expectedOutput: string;
  points: number;
  isSolved: boolean;
  assignedDate: string;
}

export interface SubmissionHistory {
  id: string;
  challengeTitle: string;
  language: ProgrammingLanguage;
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Compilation Error';
  executionTime: string;
  memoryUsed: string;
  score: number;
  timestamp: string;
}

export interface ManagedStudent {
  id: string;
  name: string;
  email: string;
  rollNo: string;
  challengesSolved: number;
  xp: number;
  gpa: number;
  status: 'active' | 'suspended';
}

export interface CompilerMetrics {
  cpuLoad: number;
  memoryUsage: string;
  lastRunTime: string;
  currentActiveThreads: number;
}
