import React, { useState, useEffect } from 'react';
import { WorkoutPlan, WorkoutLog, Exercise } from './types';
import { presetPlans } from './data/exercises';
import LibraryTab from './components/LibraryTab';
import PlanTab from './components/PlanTab';
import LogTab from './components/LogTab';
import { Sparkles, Calendar, BookOpen, Layers, CheckSquare } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'plan' | 'log' | 'library'>('log'); // default to check in tab
  
  // Plans state loaded from local or initialized with default templates
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  
  // History logs state
  const [logs, setLogs] = useState<WorkoutLog[]>([]);

  // Intermediate state for adding exercises from Library to Plan editor
  const [quickAddedExercise, setQuickAddedExercise] = useState<Exercise | null>(null);

  // Load state on mount
  useEffect(() => {
    // 1. Load plans
    const storedPlans = localStorage.getItem('fit_workout_plans');
    if (storedPlans) {
      try {
        setPlans(JSON.parse(storedPlans));
      } catch (e) {
        setPlans(presetPlans);
      }
    } else {
      setPlans(presetPlans);
      localStorage.setItem('fit_workout_plans', JSON.stringify(presetPlans));
    }

    // 2. Load historical logs
    const storedLogs = localStorage.getItem('fit_workout_logs');
    if (storedLogs) {
      try {
        setLogs(JSON.parse(storedLogs));
      } catch (e) {
        setLogs([]);
      }
    }
  }, []);

  // Update methods
  const handleCreatePlan = (newPlan: WorkoutPlan) => {
    const updated = [...plans, newPlan];
    setPlans(updated);
    localStorage.setItem('fit_workout_plans', JSON.stringify(updated));
  };

  const handleDeletePlan = (id: string) => {
    const updated = plans.filter((p) => p.id !== id);
    setPlans(updated);
    localStorage.setItem('fit_workout_plans', JSON.stringify(updated));
  };

  const handleUpdatePlan = (updatedPlan: WorkoutPlan) => {
    const updated = plans.map((p) => (p.id === updatedPlan.id ? updatedPlan : p));
    setPlans(updated);
    localStorage.setItem('fit_workout_plans', JSON.stringify(updated));
  };

  const handleAddLog = (newLog: WorkoutLog) => {
    const updated = [...logs, newLog];
    setLogs(updated);
    localStorage.setItem('fit_workout_logs', JSON.stringify(updated));
  };

  const handleClearLogs = () => {
    setLogs([]);
    localStorage.removeItem('fit_workout_logs');
  };

  // Safe handler to pipe exercise added from Action Library into Plan edit mode
  const handleQuickAddExercise = (exercise: Exercise) => {
    setQuickAddedExercise(exercise);
    setActiveTab('plan'); // route user automatically to planner to finalize layout
  };

  // Get current formatted date string (CN format)
  const getTodayChineseStr = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('zh-CN', options);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col selection:bg-indigo-600/15 selection:text-indigo-800">
      {/* Elegantly Crafted Premium Top Nav Bar Banner */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Title Block */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-tr from-slate-900 to-indigo-950 rounded-2xl flex items-center justify-center shadow-md">
                <Sparkles className="h-5 w-5 text-indigo-400 fill-indigo-400/20" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-slate-900 font-sans">
                  泵感健身计划板
                </h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  FITNESS TRACKER & PLANNING HUD
                </p>
              </div>
            </div>

            {/* Date Display Section */}
            <div className="flex items-center gap-2 text-slate-500 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 self-start sm:self-auto">
              <Calendar className="h-4 w-4 text-indigo-500" />
              <span className="text-xs font-semibold font-mono" id="current-date-view">
                {getTodayChineseStr()}
              </span>
            </div>
          </div>
        </div>
      </header>
      {/* Primary tab views nested frame container (with bottom padding for bottom nav space) */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-28">
        <div className="h-full">
          {activeTab === 'log' && (
            <LogTab
              plans={plans}
              logs={logs}
              onAddLog={handleAddLog}
              onClearLogs={handleClearLogs}
              onSwitchTab={setActiveTab}
            />
          )}

          {activeTab === 'plan' && (
            <PlanTab
              plans={plans}
              onCreatePlan={handleCreatePlan}
              onDeletePlan={handleDeletePlan}
              onUpdatePlan={handleUpdatePlan}
              quickAddedExercise={quickAddedExercise}
              onClearQuickAdd={() => setQuickAddedExercise(null)}
              onSwitchTab={setActiveTab}
            />
          )}

          {activeTab === 'library' && (
            <LibraryTab onAddExerciseToPlan={handleQuickAddExercise} />
          )}
        </div>
      </main>



      {/* iOS Style Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100/90 shadow-[0_-4px_24px_rgba(0,0,0,0.04)] pb-safe">
        <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-around">
          <button
            onClick={() => setActiveTab('log')}
            className="flex flex-col items-center justify-center gap-1.5 py-1 px-4 cursor-pointer transition-transform duration-100 active:scale-95"
            id="nav-tab-log"
          >
            <CheckSquare className={`h-[18px] w-[18px] transition-all duration-200 ${
              activeTab === 'log'
                ? 'text-indigo-600 scale-110 stroke-[2.5px]'
                : 'text-slate-400 hover:text-slate-600 stroke-2'
            }`} />
            <span className={`text-[10px] tracking-wide transition-all font-sans ${
              activeTab === 'log'
                ? 'text-indigo-600 font-black'
                : 'text-slate-400 font-medium'
            }`}>
              打卡记录
            </span>
          </button>

          <button
            onClick={() => setActiveTab('plan')}
            className="flex flex-col items-center justify-center gap-1.5 py-1 px-4 cursor-pointer transition-transform duration-100 active:scale-95"
            id="nav-tab-plan"
          >
            <Layers className={`h-[18px] w-[18px] transition-all duration-200 ${
              activeTab === 'plan'
                ? 'text-indigo-600 scale-110 stroke-[2.5px]'
                : 'text-slate-400 hover:text-slate-600 stroke-2'
            }`} />
            <span className={`text-[10px] tracking-wide transition-all font-sans ${
              activeTab === 'plan'
                ? 'text-indigo-600 font-black'
                : 'text-slate-400 font-medium'
            }`}>
              训练规划
            </span>
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className="flex flex-col items-center justify-center gap-1.5 py-1 px-4 cursor-pointer transition-transform duration-100 active:scale-95"
            id="nav-tab-library"
          >
            <BookOpen className={`h-[18px] w-[18px] transition-all duration-200 ${
              activeTab === 'library'
                ? 'text-indigo-600 scale-110 stroke-[2.5px]'
                : 'text-slate-400 hover:text-slate-600 stroke-2'
            }`} />
            <span className={`text-[10px] tracking-wide transition-all font-sans ${
              activeTab === 'library'
                ? 'text-indigo-600 font-black'
                : 'text-slate-400 font-medium'
            }`}>
              动作图鉴
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
