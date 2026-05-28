export type MuscleGroup = '胸部' | '背部' | '腿部' | '肩部' | '手臂' | '核心' | '有氧';

export interface Exercise {
  id: string;
  name: string;
  englishName: string;
  category: MuscleGroup;
  difficulty: '入门' | '进阶' | '高阶';
  equipment: '杠铃' | '哑铃' | '自重' | '器械' | '其他';
  description: string;
  steps: string[];
  tips: string[];
  primaryMuscles: string[];
}

export interface PlannedExercise {
  exerciseId: string;
  name: string;
  sets: number;
  reps: string; // can be number or string like "10-12" or "30秒"
  weight?: string; // Target weight (e.g., "40kg" or "自重")
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  exercises: PlannedExercise[];
  createdAt: string;
  isPreset?: boolean;
  durationOption?: 'none' | 'day' | 'weekly' | 'biweekly';
  specificDate?: string; // YYYY-MM-DD
  startDate?: string;    // YYYY-MM-DD
  endDate?: string;      // YYYY-MM-DD
  weekdays?: number[];   // 1 to 7 corresponding to Monday to Sunday
}

export interface LogSet {
  reps: number;
  weight: number; // in kg or 0 for bodyweight
  completed: boolean;
}

export interface ActiveExerciseSession {
  exerciseId: string;
  name: string;
  sets: LogSet[];
  category: MuscleGroup;
}

export interface WorkoutLog {
  id: string;
  planId?: string;
  planName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // ISO String
  endTime?: string; // ISO String
  durationMinutes: number;
  exercises: {
    exerciseId: string;
    name: string;
    sets: {
      reps: number;
      weight: number;
      completed: boolean;
    }[];
  }[];
  notes?: string;
  mood?: string; // 😊 😐 🥵 😴
}
