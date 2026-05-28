import React, { useState, useEffect, useRef } from 'react';
import { WorkoutPlan, WorkoutLog, ActiveExerciseSession, LogSet } from '../types';
import { Play, Check, Clock, Calendar, MessageSquare, Flame, BarChart3, Dumbbell, Award, Timer, ChevronRight, Ban, Eye, Smile, RefreshCw, X, Zap } from 'lucide-react';

interface LogTabProps {
  plans: WorkoutPlan[];
  logs: WorkoutLog[];
  onAddLog: (log: WorkoutLog) => void;
  onClearLogs: () => void;
  onSwitchTab: (tab: 'plan' | 'log' | 'library') => void;
}

export default function LogTab({ plans, logs, onAddLog, onClearLogs, onSwitchTab }: LogTabProps) {
  // Session tracking states
  const [activePlan, setActivePlan] = useState<WorkoutPlan | null>(null);
  const [activeExercises, setActiveExercises] = useState<ActiveExerciseSession[]>([]);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [stopwatch, setStopwatch] = useState<number>(0); // in seconds
  const stopwatchRef = useRef<NodeJS.Timeout | null>(null);

  // Rest Timer states
  const [isResting, setIsResting] = useState(false);
  const [restDuration, setRestDuration] = useState(60); // default 60s
  const [restTimeLeft, setRestTimeLeft] = useState(60);
  const restTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Finishing form states
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState('😊');
  const [noteText, setNoteText] = useState('');

  // Local component views: 'new' (start), 'active' (tracking), 'history' (viewing logs)
  const [viewState, setViewState] = useState<'new' | 'active'>('new');

  // Load active session on mount if there's one in-progress
  useEffect(() => {
    const savedActive = localStorage.getItem('fit_active_session');
    if (savedActive) {
      try {
        const parsed = JSON.parse(savedActive);
        setActivePlan(parsed.plan);
        setActiveExercises(parsed.exercises);
        setStartTime(parsed.startTime);
        setStopwatch(parsed.stopwatch || 0);
        setViewState('active');

        // Resume stopwatch
        const elapsedSinceStart = Math.floor((Date.now() - new Date(parsed.startTime).getTime()) / 1000);
        setStopwatch(elapsedSinceStart > 0 ? elapsedSinceStart : parsed.stopwatch || 0);

        startStopwatch();
      } catch (e) {
        localStorage.removeItem('fit_active_session');
      }
    }
  }, []);

  // Monitor for external workout triggers (e.g. from the planner tab)
  useEffect(() => {
    const triggerStartWorkout = () => {
      const startPlanId = localStorage.getItem('fit_start_plan_id');
      if (startPlanId) {
        const planToStart = plans.find((p) => p.id === startPlanId);
        if (planToStart) {
          if (viewState === 'active' && activePlan) {
            if (activePlan.id !== startPlanId && confirm('您当前已有正在进行中的训练。确定要结束当前训练并开始这项新计划吗？')) {
              startWorkoutSession(planToStart);
            }
          } else {
            startWorkoutSession(planToStart);
          }
        }
        localStorage.removeItem('fit_start_plan_id');
      }
    };

    triggerStartWorkout();
    const interval = setInterval(triggerStartWorkout, 500);
    return () => clearInterval(interval);
  }, [plans, viewState, activePlan]);

  // Save active session state in-progress
  const saveStateToLocalStorage = (exercises: ActiveExerciseSession[], stopwatchVal: number) => {
    if (activePlan && startTime) {
      localStorage.setItem(
        'fit_active_session',
        JSON.stringify({
          plan: activePlan,
          exercises,
          startTime,
          stopwatch: stopwatchVal
        })
      );
    }
  };

  // Live stopwatch effect
  const startStopwatch = () => {
    if (stopwatchRef.current) clearInterval(stopwatchRef.current);
    stopwatchRef.current = setInterval(() => {
      setStopwatch((prev) => {
        const next = prev + 1;
        // Periodically save state to local for refresh safety
        if (next % 5 === 0) {
          saveStateToLocalStorage(activeExercises, next);
        }
        return next;
      });
    }, 1000);
  };

  const stopStopwatch = () => {
    if (stopwatchRef.current) {
      clearInterval(stopwatchRef.current);
      stopwatchRef.current = null;
    }
  };

  // Rest Timer effects
  useEffect(() => {
    if (isResting && restTimeLeft > 0) {
      restTimerRef.current = setTimeout(() => {
        setRestTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isResting && restTimeLeft === 0) {
      setIsResting(false);
      // Play a short systemic beep sound if allowed, or just let users skip
      if (typeof window !== 'undefined' && 'AudioContext' in window) {
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
          gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 0.15);
        } catch (e) {}
      }
    }

    return () => {
      if (restTimerRef.current) clearTimeout(restTimerRef.current);
    };
  }, [isResting, restTimeLeft]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      stopStopwatch();
      if (restTimerRef.current) clearTimeout(restTimerRef.current);
    };
  }, []);

  // Format seconds to text: e.g. 01:23:45
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return [
      hrs > 0 ? String(hrs).padStart(2, '0') : null,
      String(mins).padStart(2, '0'),
      String(secs).padStart(2, '0')
    ]
      .filter(Boolean)
      .join(':');
  };

  // Start Session handler
  const startWorkoutSession = (plan: WorkoutPlan) => {
    const preparedExercises: ActiveExerciseSession[] = plan.exercises.map((pe) => {
      // Find default details from database to know muscle groups if available
      const setsList: LogSet[] = Array.from({ length: pe.sets }, () => ({
        reps: parseInt(pe.reps) || 10,
        weight: parseInt(pe.weight || '0') || 0,
        completed: false
      }));

      return {
        exerciseId: pe.exerciseId,
        name: pe.name,
        sets: setsList,
        category: '核心' // fallback, will refine if matches
      };
    });

    setActivePlan(plan);
    setActiveExercises(preparedExercises);
    const now = new Date().toISOString();
    setStartTime(now);
    setStopwatch(0);
    setViewState('active');

    // Store active progress
    localStorage.setItem(
      'fit_active_session',
      JSON.stringify({
        plan,
        exercises: preparedExercises,
        startTime: now,
        stopwatch: 0
      })
    );

    startStopwatch();
  };

  // Terminate/cancel session
  const abortWorkoutSession = () => {
    if (confirm('确定要放弃本次已经记录的数据吗？')) {
      stopStopwatch();
      setIsResting(false);
      localStorage.removeItem('fit_active_session');
      setActivePlan(null);
      setActiveExercises([]);
      setStopwatch(0);
      setViewState('new');
    }
  };

  // Handle checking/toggling a specific set
  const toggleSetCompleted = (exerciseIndex: number, setIndex: number) => {
    const updatedExercises = [...activeExercises];
    const targetSet = updatedExercises[exerciseIndex].sets[setIndex];
    const newCompleted = !targetSet.completed;

    targetSet.completed = newCompleted;
    setActiveExercises(updatedExercises);
    saveStateToLocalStorage(updatedExercises, stopwatch);

    // Trigger Rest Timer when checking a set (from false to true)
    if (newCompleted) {
      setRestTimeLeft(60); // 60 seconds rest duration
      setIsResting(true);
    }
  };

  const updateSetValues = (exerciseIndex: number, setIndex: number, field: keyof LogSet, value: number) => {
    const updatedExercises = [...activeExercises];
    updatedExercises[exerciseIndex].sets[setIndex] = {
      ...updatedExercises[exerciseIndex].sets[setIndex],
      [field]: value
    };
    setActiveExercises(updatedExercises);
    saveStateToLocalStorage(updatedExercises, stopwatch);
  };

  // Calculate overall progress stats
  const totalSetsCount = activeExercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const completedSetsCount = activeExercises.reduce(
    (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
    0
  );

  const handleFinishWorkout = () => {
    setShowFinishModal(true);
  };

  const submitWorkoutLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startTime) return;

    stopStopwatch();
    setIsResting(false);

    // Parse logs
    const completedExercises = activeExercises.map((ae) => ({
      exerciseId: ae.exerciseId,
      name: ae.name,
      sets: ae.sets.map((s) => ({
        reps: s.reps,
        weight: s.weight,
        completed: s.completed
      }))
    }));

    const finalLog: WorkoutLog = {
      id: 'log-' + Math.random().toString(36).substr(2, 9),
      planId: activePlan?.id,
      planName: activePlan?.name || '自主肌肉训练',
      date: new Date().toISOString().split('T')[0],
      startTime: startTime,
      endTime: new Date().toISOString(),
      durationMinutes: Math.ceil(stopwatch / 60),
      exercises: completedExercises,
      notes: noteText,
      mood: selectedMood
    };

    onAddLog(finalLog);

    // Clear active session in state and localStorage
    localStorage.removeItem('fit_active_session');
    setActivePlan(null);
    setActiveExercises([]);
    setStopwatch(0);
    setShowFinishModal(false);
    setNoteText('');
    setViewState('new');
  };

  // STATISTICS CALCULATIONS (Based on history logs list)
  const totalCompletedSessions = logs.length;
  const totalDurationMinutes = logs.reduce((sum, l) => sum + l.durationMinutes, 0);
  const totalSetsPumped = logs.reduce(
    (sum, l) => sum + l.exercises.reduce((exSum, ex) => exSum + ex.sets.filter((s) => s.completed).length, 0),
    0
  );

  // Consecutive active streak calculation
  const getStreakCount = () => {
    if (logs.length === 0) return 0;
    const dates = Array.from(new Set(logs.map((l) => l.date))).sort();
    let currentStreak = 0;
    let today = new Date().toISOString().split('T')[0];
    let yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // If no log today or yesterday, streak is broken
    const lastLogDate = dates[dates.length - 1];
    if (lastLogDate !== today && lastLogDate !== yesterday) return 0;

    let checkDateStr = lastLogDate;
    while (dates.includes(checkDateStr)) {
      currentStreak++;
      const checkDateObj = new Date(checkDateStr);
      checkDateObj.setDate(checkDateObj.getDate() - 1);
      checkDateStr = checkDateObj.toISOString().split('T')[0];
    }
    return currentStreak;
  };

  const currentStreak = getStreakCount();

  // Calculate Best Performance (maximum weight of completed set in any exercise grouped by action)
  const getBestPerformances = () => {
    const map = new Map<string, { weight: number; date: string }>();

    logs.forEach((log) => {
      log.exercises.forEach((ex) => {
        ex.sets.forEach((set) => {
          if (set.completed && typeof set.weight === 'number' && set.weight > 0) {
            const current = map.get(ex.name);
            if (!current || set.weight > current.weight) {
              map.set(ex.name, { weight: set.weight, date: log.date });
            }
          }
        });
      });
    });

    const list: Array<{ name: string; weight: number; date: string }> = [];
    map.forEach((value, key) => {
      list.push({
        name: key,
        weight: value.weight,
        date: value.date
      });
    });

    return list.sort((a, b) => b.weight - a.weight);
  };

  const bestPerformancesList = getBestPerformances();

  // Muscle group split count (estimate by aggregating workout logs)
  const getMuscleSplit = () => {
    const counts: { [key: string]: number } = { 胸部: 0, 背部: 0, 腿部: 0, 肩部: 0, 手臂: 0, 核心: 0, 有氧: 0 };
    // Cross matches lookup from database
    const exerciseCategoryMap: { [key: string]: string } = {
      'barbell-bench-press': '胸部',
      'dumbbell-chest-flye': '胸部',
      'push-up': '胸部',
      'pull-up': '背部',
      'dumbbell-row': '背部',
      'barbell-deadlift': '背部',
      'barbell-squat': '腿部',
      'dumbbell-lunge': '腿部',
      'overhead-press': '肩部',
      'lateral-raise': '肩部',
      'dumbbell-bicep-curl': '手臂',
      'tricep-pushdown': '手臂',
      'crunch': '核心',
      'plank': '核心',
      'burpee': '有氧'
    };

    logs.forEach((log) => {
      log.exercises.forEach((ex) => {
        const cat = exerciseCategoryMap[ex.exerciseId] || '核心';
        counts[cat] = (counts[cat] || 0) + ex.sets.filter((s) => s.completed).length;
      });
    });

    return counts;
  };

  const muscleSplit = getMuscleSplit();
  const maxMuscleCount = Math.max(...Object.values(muscleSplit), 1);

  // Quick Rest time modifiers
  const modifyRestTime = (seconds: number) => {
    setRestTimeLeft((prev) => Math.max(0, prev + seconds));
  };

  return (
    <div className="space-y-6">
      {/* 1. START WORKOUT SELECT PANEL (ViewState == 'new') */}
      {viewState === 'new' && (
        <div className="space-y-6 animate-fade-in">
          {/* Dashboard Overall Stats Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950 text-white rounded-2xl p-5 shadow-sm border border-slate-900 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">训练足迹</span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-3xl font-black font-mono text-indigo-400">{totalCompletedSessions}</span>
                <span className="text-xs text-slate-300 font-bold">次打卡</span>
              </div>
              <span className="text-[10px] text-indigo-300 mt-2 font-medium">不积跬步，无以至千里</span>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">暴汗时长</span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-3xl font-black font-mono text-slate-800">{totalDurationMinutes}</span>
                <span className="text-xs text-slate-500 font-bold">分钟</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-2 font-medium">每一次计时都见证精进</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Box: Choose plan & start */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Play className="h-4 w-4 text-emerald-500 fill-emerald-100" />
                    今日开启健身打卡
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    点选一个已经规划好的训练大纲，开始追踪打卡，系统会记录时长、组数并提示休息间隔。
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                  {plans.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => startWorkoutSession(p)}
                      className="bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-slate-50/20 rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between gap-3 group"
                    >
                      <div>
                        <span className="text-[9px] font-bold text-indigo-500 tracking-wider">
                          {p.isPreset ? '预设模版' : '我的自配'}
                        </span>
                        <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors text-sm mt-0.5">
                          {p.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {p.description || '暂无说明...'}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-bold">
                          {p.exercises.length} 个动作 · 预计 {p.exercises.length * 15}分钟
                        </span>
                        <span className="text-[11px] font-bold text-indigo-600 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          开启训练 <ChevronRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  ))}

                  {plans.length === 0 && (
                    <div className="sm:col-span-2 bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400">
                      <Dumbbell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs font-bold text-slate-600">目前没有可用计划</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">请先到“健身计划”标签页中导入或配置一个计划日程！</p>
                      <button
                        onClick={() => onSwitchTab('plan')}
                        className="mt-3 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold px-3 py-1.5 rounded-lg border border-indigo-100"
                      >
                        去配置计划
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* History logs foot prints */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-indigo-500" />
                    历史打卡日志
                  </h3>
                  {logs.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm('确定要清空本地所有历史打卡记录码？')) {
                          onClearLogs();
                        }
                      }}
                      className="text-[10px] font-bold text-slate-400 hover:text-rose-600 border border-slate-200 rounded-md p-1 px-2.5 hover:bg-rose-50/30 transition-colors"
                      id="btn-clear-logs"
                    >
                      清空历史记录
                    </button>
                  )}
                </div>

                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {logs.slice().reverse().map((log) => {
                    const completedSets = log.exercises.reduce((sum, ex) => sum + ex.sets.filter((s) => s.completed).length, 0);
                    const totalSets = log.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);

                    return (
                      <div
                        key={log.id}
                        className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                        id={`log-item-${log.id}`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{log.mood}</span>
                            <span className="text-xs font-bold text-slate-500 font-mono">{log.date}</span>
                            <span className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-bold font-mono">
                              泵持{log.durationMinutes}分钟
                            </span>
                          </div>

                          <h4 className="font-bold text-slate-800 text-sm">{log.planName}</h4>

                          <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                            已打卡: {log.exercises.map((ex) => `${ex.name}(${ex.sets.filter(s=>s.completed).length}/${ex.sets.length}组)`).join(' · ')}
                          </p>

                          {log.notes && (
                            <p className="text-xs text-slate-400 italic flex items-center gap-1 mt-1">
                              <MessageSquare className="h-3 w-3" />
                              &ldquo;{log.notes}&rdquo;
                            </p>
                          )}
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between font-mono shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-200/50">
                          <span className="text-xs text-slate-500">组数完成度</span>
                          <span className="text-sm font-bold text-slate-800">
                            {completedSets} / {totalSets} 组
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {logs.length === 0 && (
                    <div className="bg-slate-50 rounded-xl p-8 text-center text-slate-400 border border-dashed border-slate-200">
                      <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs font-bold text-slate-600">尚无健身打卡记录</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">快启动一个计划，开始挥洒汗水打卡吧！</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Box: Workout Analytics Splitting breakdown */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <BarChart3 className="h-4 w-4 text-indigo-500" />
                    训练量肌肉分布比例
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    基于您历史上所有打卡成功组数的累计肌肉群锻炼比例。
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {Object.keys(muscleSplit).map((muscle) => {
                    const count = muscleSplit[muscle];
                    const percent = count > 0 ? Math.round((count / maxMuscleCount) * 100) : 0;

                    return (
                      <div key={muscle} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700">{muscle}</span>
                          <span className="font-semibold text-slate-500 font-mono">
                            {count} 组
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}

                  {totalSetsPumped === 0 && (
                    <p className="text-xs text-slate-400 italic text-center pt-8">
                      暂无累计柱状比例，请先打卡！
                    </p>
                  )}
                </div>
              </div>

              {/* Best Performance Widget */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
                <div className="flex items-center gap-1.5">
                  <span className="p-1 px-1.5 bg-amber-50 border border-amber-100 rounded-lg text-amber-600 text-xs font-bold flex items-center gap-1">
                    <Award className="h-4 w-4 fill-amber-500/10 text-amber-500" /> 最佳表现
                  </span>
                </div>
                {bestPerformancesList.length > 0 ? (
                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {/* Header Row */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-extrabold pb-2 border-b border-slate-100 px-1.5">
                      <span className="w-2/5 text-left">动作</span>
                      <span className="w-1/4 text-center">最大重量</span>
                      <span className="w-1/3 text-right">完成日期</span>
                    </div>
                    {/* Data Rows */}
                    <div className="divide-y divide-slate-50">
                      {bestPerformancesList.map((perf, i) => (
                        <div key={i} className="flex items-center justify-between py-2 text-xs hover:bg-slate-50/50 px-1.5 rounded-lg transition-colors">
                          <span className="w-2/5 font-bold text-slate-800 truncate text-left" title={perf.name}>
                            {perf.name}
                          </span>
                          <span className="w-1/4 font-mono font-black text-indigo-600 text-sm text-center">
                            {perf.weight} <span className="text-[9px] font-bold text-slate-400">KG</span>
                          </span>
                          <span className="w-1/3 font-mono text-slate-400 text-[10px] text-right">
                            {perf.date}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-400 italic">暂无重量负荷数据</p>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      请在打卡训练时点选动作并完成包含重量的组数，极限将在此完美呈现！
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ACTIVE WORKOUT HUD SCREEN (ViewState == 'active') */}
      {viewState === 'active' && activePlan && (
        <div className="space-y-6 animate-fade-in relative">
          {/* Top Panel summary stopwatch ticker */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-500/20 p-2.5 rounded-2xl border border-indigo-400/30 text-indigo-400 animate-pulse">
                <Timer className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                  正在进行中的训练
                </span>
                <h2 className="text-base font-bold text-white truncate max-w-xs transition-all">
                  {activePlan.name}
                </h2>
              </div>
            </div>

            {/* Current stopwatch display */}
            <div className="flex items-center gap-4 bg-slate-800/80 p-2 px-4 rounded-2xl border border-slate-700 justify-between md:justify-start">
              <div className="text-left md:text-right">
                <span className="text-[9px] font-semibold text-slate-400 block uppercase">暴汗时间</span>
                <span className="text-lg font-black font-mono text-indigo-400">
                  {formatTime(stopwatch)}
                </span>
              </div>
              <div className="h-6 w-px bg-slate-700 hidden sm:block" />
              <div>
                <span className="text-[9px] font-semibold text-slate-400 block uppercase">综合进度</span>
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  已做完 {completedSetsCount} / {totalSetsCount} 组
                </span>
              </div>
            </div>

            {/* Quick Abort / End workout controller */}
            <div className="flex items-center gap-2">
              <button
                onClick={abortWorkoutSession}
                className="p-2 bg-slate-800 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-xl transition-all border border-slate-700 flex items-center gap-1.5 text-xs font-bold"
                id="btn-abort-workout"
              >
                <Ban className="h-4 w-4" />
                放弃
              </button>

              <button
                onClick={handleFinishWorkout}
                className="p-2 px-4 bg-indigo-600 hover:bg-indigo-500 hover:shadow-md text-white rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold"
                id="btn-finish-workout"
              >
                <Check className="h-4 w-4" />
                结束打卡
              </button>
            </div>
          </div>

          {/* ACTIVE REST TIMER FLOATER CARD */}
          {isResting && (
            <div className="bg-indigo-950 text-white rounded-2xl p-4 shadow-xl border border-indigo-700/50 flex flex-col sm:flex-row items-center justify-between gap-3 animate-slide-up sticky top-24 z-30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center animate-spin">
                  <Timer className="h-5 w-5 text-indigo-200" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-indigo-300">组间休息倒计时</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    静息调理心率，补充水分，保持专注。
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono">
                <button
                  type="button"
                  onClick={() => modifyRestTime(-10)}
                  className="px-2 py-1 text-[11px] bg-slate-800 hover:bg-indigo-900 rounded-lg"
                >
                  -10s
                </button>
                <span className="text-2xl font-black text-indigo-400 select-none">
                  {restTimeLeft}s
                </span>
                <button
                  type="button"
                  onClick={() => modifyRestTime(10)}
                  className="px-2 py-1 text-[11px] bg-slate-800 hover:bg-indigo-900 rounded-lg"
                >
                  +10s
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsResting(false)}
                className="px-3.5 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold transition-colors shadow-sm"
              >
                跳过休息
              </button>
            </div>
          )}

          {/* Core Exercise Active list */}
          <div className="space-y-6">
            {activeExercises.map((ae, exIdx) => (
              <div
                key={ae.exerciseId}
                className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80"
                id={`active-exercise-block-${ae.exerciseId}`}
              >
                {/* Movement top info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">{ae.name}</h3>
                  </div>

                  {/* Status checklist metrics */}
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                    完工度 ({ae.sets.filter((s) => s.completed).length} / {ae.sets.length} 组)
                  </span>
                </div>

                {/* Sub-rows: Each Individual Sets tracker line */}
                <div className="mt-4 space-y-2">
                  {ae.sets.map((set, setIdx) => (
                    <div
                      key={setIdx}
                      className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-3 rounded-xl border transition-all ${
                        set.completed
                          ? 'bg-slate-50/50 border-slate-200/60'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                      }`}
                      id={`set-row-${exIdx}-${setIdx}`}
                    >
                      {/* Set count index badge */}
                      <div className="flex items-center gap-3">
                        <span
                          className={`h-6 w-6 rounded-full flex items-center justify-center font-mono text-[10px] font-black tracking-tighter ${
                            set.completed
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {setIdx + 1}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">第 {setIdx + 1} 组</span>
                      </div>

                      {/* Overwrite input forms */}
                      <div className="flex items-center gap-4 mt-3 sm:mt-0">
                        {/* Weight Input Box */}
                        <div className="flex items-center gap-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">
                            重量
                          </label>
                          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
                            <input
                              type="number"
                              disabled={set.completed}
                              value={set.weight || ''}
                              onChange={(e) =>
                                updateSetValues(exIdx, setIdx, 'weight', parseFloat(e.target.value) || 0)
                              }
                              className="w-10 text-center text-xs font-bold text-slate-700 bg-transparent focus:outline-none"
                            />
                            <span className="text-[10px] font-bold text-slate-400">kg</span>
                          </div>
                        </div>

                        {/* Reps Input Box */}
                        <div className="flex items-center gap-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">
                            次数
                          </label>
                          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
                            <input
                              type="number"
                              disabled={set.completed}
                              value={set.reps || ''}
                              onChange={(e) =>
                                updateSetValues(exIdx, setIdx, 'reps', parseInt(e.target.value) || 0)
                              }
                              className="w-10 text-center text-xs font-bold text-slate-700 bg-transparent focus:outline-none"
                            />
                            <span className="text-[10px] font-bold text-slate-400">次</span>
                          </div>
                        </div>

                        {/* Interactive check-in action button for individual sets */}
                        <button
                          onClick={() => toggleSetCompleted(exIdx, setIdx)}
                          className={`p-1.5 rounded-lg border transition-all flex items-center justify-center ${
                            set.completed
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'bg-indigo-50 border-indigo-100 hover:border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                          }`}
                          id={`btn-toggle-set-${exIdx}-${setIdx}`}
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Info Box */}
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl text-xs text-amber-800 leading-relaxed">
            💡 <strong>智能贴士:</strong> 每次勾选某个组数打卡完成后，正处于黄金组间重置期，自动弹出
            <strong>“组间休息计时器”</strong>。喝口水调节呼吸能显著提高下一组的动作质量。
          </div>
        </div>
      )}

      {/* 3. WORKOUT COMPLETED CHECK-IN MODAL DIALOG (showFinishModal == true) */}
      {showFinishModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <form
            onSubmit={submitWorkoutLog}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100 space-y-5"
            id="finish-workout-form"
          >
            <div className="text-center space-y-1">
              <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-slate-800 text-lg">打卡结算报告</h3>
              <p className="text-xs text-slate-500">
                恭喜，您已完成本次高能泵感训练！评个印象，写下感想保存到我的打卡足迹中。
              </p>
            </div>

            {/* Quick summary stats in modal */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">暴汗时间</span>
                <span className="text-base font-bold text-slate-800 font-mono">
                  {Math.ceil(stopwatch / 60)} 分钟
                </span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">总收工组数</span>
                <span className="text-base font-bold text-slate-800 font-mono">
                  {completedSetsCount} 组
                </span>
              </div>
            </div>

            {/* Vibe/Mood selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-600">
                本轮训练主观状态 / Vibe
              </label>
              <div className="grid grid-cols-5 gap-2">
                {['😊', '🥵', '😐', '😴', '🤕'].map((face) => (
                  <button
                    key={face}
                    type="button"
                    onClick={() => setSelectedMood(face)}
                    className={`p-2.5 text-xl rounded-xl border transition-all ${
                      selectedMood === face
                        ? 'bg-indigo-50 border-indigo-500 scale-105'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {face}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes content */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600">
                训练随笔 (选填)
              </label>
              <textarea
                rows={3}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="记录身体信号，例如: '二头有点酸度'、'卧推不抖了，稳步突破拉力限度！'"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold text-slate-700 resize-none"
                id="workout-notes-input"
              />
            </div>

            {/* Form actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowFinishModal(false)}
                className="w-full py-2 bg-slate-50 text-slate-600 hover:text-slate-800 rounded-xl text-xs font-bold border border-slate-200 transition-colors"
                id="btn-modal-back-to-hud"
              >
                继续训练
              </button>
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-transform shadow-sm shadow-indigo-100"
                id="btn-modal-submit-log"
              >
                确认打卡成功
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
