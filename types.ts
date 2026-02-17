export type View = 'resumen' | 'progreso' | 'materias' | 'ajustes';

export type ColorKey = 'green' | 'mint' | 'red' | 'orange' | 'yellow' | 'lime' | 'cyan' | 'blue' | 'indigo' | 'violet' | 'fuchsia' | 'pink' | 'rose' | 'slate' | 'stone';

export interface Evaluation {
  id: number;
  name: string;
  isGraded: boolean;
  score: string;
  weight: string;
  date: string; // Format DD/MM or YYYY-MM-DD
  comment?: string;
  image?: string; // Base64 or URL
}

export interface Subject {
  id: number;
  name: string;
  prof: string;
  score: number;
  minScore: number;
  maxScore: number;
  color: ColorKey;
  evaluations: Evaluation[];
}

export interface AppSettings {
  studentName: string;
  section: string;
  periods: string[];
  currentPeriod: string;
  defaultEvalWeight: string;
  defaultMaxScore: number;
  defaultMinScore: number;
}