/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PageId = 'home' | 'about' | 'services' | 'projects' | 'labs' | 'technologies' | 'contact';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string; // Used to dynamic resolve lucide icon components
  capabilities: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  thumbnail: string; // Visual tag or vector theme
  tech: string[];
  metrics: { label: string; value: string };
  isLiveSandbox: boolean;
}

export interface LabExperiment {
  id: string;
  title: string;
  status: 'beta' | 'stable' | 'alpha';
  description: string;
  tech: string[];
  version: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatarSeed: string;
  rating: number;
}

export interface Technology {
  name: string;
  category: 'frontend' | 'backend' | 'cloud' | 'analytics' | 'ai';
  level: string; // e.g. "expert", "production"
  description: string;
  iconColor: string;
}

// Sandbox state properties for FreelancerOS Dashboard Sim
export interface FreelancerInvoice {
  id: string;
  client: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
}

export interface FreelancerTask {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  stage: 'todo' | 'progress' | 'review' | 'done';
}

// Sandbox state properties for Restaurant Dashboard Sim
export interface RestaurantTable {
  id: number;
  status: 'vacant' | 'occupied' | 'ordered' | 'billing';
  capacity: number;
  currentBill: number;
  waiter: string;
}

export interface RestaurantOrder {
  id: string;
  time: string;
  item: string;
  amount: number;
  status: 'pending' | 'preparing' | 'ready' | 'served';
}

// Sandbox state properties for Ice Cream Dashboard Sim
export interface IceCreamFlavor {
  id: string;
  name: string;
  sales: number;
  stock: number; // percentage
  status: 'critical' | 'normal' | 'overflow';
  color: string;
}

// School ERP interactive properties
export interface AcademicCalendarEvent {
  id: string;
  time: string;
  title: string;
  desc: string;
  department: string;
}

export interface DepartmentMetric {
  name: string;
  staff: number;
  students: number;
  budget: string;
}
