import React, { useState } from 'react';
import { WorkoutPlan, PlannedExercise, Exercise } from '../types';
import { presetExercises } from '../data/exercises';
import { 
  Plus, Trash2, Edit2, Copy, Check, FileText, ChevronDown, ChevronUp, Sparkles, 
  Layers, Calendar, ChevronLeft, ChevronRight, Clock, Dumbbell, Award, Play 
} from 'lucide-react';

interface PlanTabProps {
  plans: WorkoutPlan[];
  onCreatePlan: (plan: WorkoutPlan) => void;
  onDeletePlan: (id: string) => void;
  onUpdatePlan: (plan: WorkoutPlan) => void;
  quickAddedExercise: Exercise | null;
  onClearQuickAdd: () => void;
  onSwitchTab?: (tab: 'plan' | 'log' | 'library') => void;
}

export default function PlanTab({
  plans,
  onCreatePlan,
  onDeletePlan,
  onUpdatePlan,
  quickAddedExercise,
  onClearQuickAdd,
  onSwitchTab
}: PlanTabProps) {
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

  // Form states for creating/editing physical plans
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanDescription, setNewPlanDescription] = useState('');
  const [plannedExercises, setPlannedExercises] = useState<PlannedExercise[]>([]);

  // Duration Scheduling states
  const [durationOption, setDurationOption] = useState<'none' | 'day' | 'weekly' | 'biweekly'>('none');
  const [specificDate, setSpecificDate] = useState(new Date().toISOString().substring(0, 10));
  const [startDate, setStartDate] = useState(new Date().toISOString().substring(0, 10));
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30); // Default to 30 days active range
    return d.toISOString().substring(0, 10);
  });
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([1, 3, 5]); // Default Mon, Wed, Fri

  // Search/selection states for picking exercise inside planner
  const [plannerSearchTerm, setPlannerSearchTerm] = useState('');
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState<string>('全部');

  // Triggering the custom plan editor
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Calendar states
  const [calendarMode, setCalendarMode] = useState<'week' | 'month'>('week');
  const [calendarAnchor, setCalendarAnchor] = useState<Date>(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date>(new Date());

  // Watch for quick added exercises from Library tab
  React.useEffect(() => {
    if (quickAddedExercise) {
      if (!isCreatingNew && !editingPlanId) {
        setIsCreatingNew(true);
        setNewPlanName('我的自定义计划');
        setNewPlanDescription('基于动作库快速创建的健身计划');
        setPlannedExercises([
          {
            exerciseId: quickAddedExercise.id,
            name: quickAddedExercise.name,
            sets: 3,
            reps: '12次',
            weight: '自重'
          }
        ]);
        onClearQuickAdd();
      } else {
        const alreadyExists = plannedExercises.some((pe) => pe.exerciseId === quickAddedExercise.id);
        if (!alreadyExists) {
          setPlannedExercises([
            ...plannedExercises,
            {
              exerciseId: quickAddedExercise.id,
              name: quickAddedExercise.name,
              sets: 3,
              reps: '12次',
              weight: '自重'
            }
          ]);
        }
        onClearQuickAdd();
      }
    }
  }, [quickAddedExercise, isCreatingNew, editingPlanId, plannedExercises, onClearQuickAdd]);

  const startCreateNewPlan = () => {
    setNewPlanName('');
    setNewPlanDescription('');
    setPlannedExercises([]);
    setIsCreatingNew(true);
    setEditingPlanId(null);
    setDurationOption('none');
    setSpecificDate(new Date().toISOString().substring(0, 10));
    setStartDate(new Date().toISOString().substring(0, 10));
    
    const d = new Date();
    d.setDate(d.getDate() + 30);
    setEndDate(d.toISOString().substring(0, 10));
    
    setSelectedWeekdays([1, 3, 5]);
  };

  const startEditPlan = (plan: WorkoutPlan) => {
    setNewPlanName(plan.name);
    setNewPlanDescription(plan.description);
    setPlannedExercises([...plan.exercises]);
    setEditingPlanId(plan.id);
    setIsCreatingNew(false);

    // Fetch Scheduling configurations
    setDurationOption(plan.durationOption || 'none');
    setSpecificDate(plan.specificDate || new Date().toISOString().substring(0, 10));
    setStartDate(plan.startDate || new Date().toISOString().substring(0, 10));
    
    if (plan.endDate) {
      setEndDate(plan.endDate);
    } else {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      setEndDate(d.toISOString().substring(0, 10));
    }
    
    setSelectedWeekdays(plan.weekdays || [1, 3, 5]);
  };

  const cancelEditOrCreate = () => {
    setIsCreatingNew(false);
    setEditingPlanId(null);
    setPlannedExercises([]);
  };

  const savePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanName.trim()) return;

    if (editingPlanId) {
      const updatedPlan: WorkoutPlan = {
        id: editingPlanId,
        name: newPlanName,
        description: newPlanDescription,
        exercises: plannedExercises,
        createdAt: new Date().toISOString(),
        durationOption,
        specificDate: durationOption === 'day' ? specificDate : undefined,
        startDate: (durationOption === 'weekly' || durationOption === 'biweekly') ? startDate : undefined,
        endDate: (durationOption === 'weekly' || durationOption === 'biweekly') ? endDate : undefined,
        weekdays: (durationOption === 'weekly' || durationOption === 'biweekly') ? selectedWeekdays : undefined,
      };
      onUpdatePlan(updatedPlan);
      setEditingPlanId(null);
    } else {
      const brandNewPlan: WorkoutPlan = {
        id: 'plan-' + Math.random().toString(36).substr(2, 9),
        name: newPlanName,
        description: newPlanDescription,
        exercises: plannedExercises,
        createdAt: new Date().toISOString(),
        isPreset: false,
        durationOption,
        specificDate: durationOption === 'day' ? specificDate : undefined,
        startDate: (durationOption === 'weekly' || durationOption === 'biweekly') ? startDate : undefined,
        endDate: (durationOption === 'weekly' || durationOption === 'biweekly') ? endDate : undefined,
        weekdays: (durationOption === 'weekly' || durationOption === 'biweekly') ? selectedWeekdays : undefined,
      };
      onCreatePlan(brandNewPlan);
      setIsCreatingNew(false);
    }

    setPlannedExercises([]);
    setNewPlanName('');
    setNewPlanDescription('');
  };

  const addExerciseToFormList = (ex: Exercise) => {
    const isAlreadyAdded = plannedExercises.some((pe) => pe.exerciseId === ex.id);
    if (isAlreadyAdded) return;

    setPlannedExercises([
      ...plannedExercises,
      {
        exerciseId: ex.id,
        name: ex.name,
        sets: 4,
        reps: '12次',
        weight: '自重'
      }
    ]);
  };

  const updatePlannedExercise = (index: number, field: keyof PlannedExercise, value: any) => {
    const updated = [...plannedExercises];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setPlannedExercises(updated);
  };

  const removeExerciseFromFormList = (index: number) => {
    const updated = [...plannedExercises];
    updated.splice(index, 1);
    setPlannedExercises(updated);
  };

  const duplicatePresetToCustom = (preset: WorkoutPlan) => {
    const dup: WorkoutPlan = {
      ...preset,
      id: 'plan-' + Math.random().toString(36).substr(2, 9),
      name: `${preset.name} (副本)`,
      isPreset: false,
      createdAt: new Date().toISOString(),
      durationOption: 'none'
    };
    onCreatePlan(dup);
  };

  const moveExercise = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === plannedExercises.length - 1) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...plannedExercises];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setPlannedExercises(updated);
  };

  // Helper date parsing (avoid timezone boundary issues)
  const parseLocalDate = (dateStr: string): Date => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  // Format Date to YYYY-MM-DD
  const formatDateStr = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Check if plan is active on a given day helper
  const isPlanActiveOnDate = (plan: WorkoutPlan, targetDateInput: Date | string): boolean => {
    if (!plan.durationOption || plan.durationOption === 'none') {
      return false;
    }

    let target: Date;
    if (typeof targetDateInput === 'string') {
      target = parseLocalDate(targetDateInput);
    } else {
      target = new Date(targetDateInput.getFullYear(), targetDateInput.getMonth(), targetDateInput.getDate());
    }

    const targetStr = formatDateStr(target);

    if (plan.durationOption === 'day') {
      return plan.specificDate === targetStr;
    }

    if (plan.durationOption === 'weekly' || plan.durationOption === 'biweekly') {
      if (!plan.startDate || !plan.endDate) return false;
      if (targetStr < plan.startDate || targetStr > plan.endDate) return false;

      const weekday = target.getDay() || 7; // Sunday = 7
      const hasWeekday = plan.weekdays?.includes(weekday);
      if (!hasWeekday) return false;

      if (plan.durationOption === 'weekly') {
        return true;
      }

      // biweekly check
      const start = parseLocalDate(plan.startDate);

      const getWeekDiff = (s: Date, c: Date) => {
        const sM = new Date(s.getFullYear(), s.getMonth(), s.getDate());
        const sDay = sM.getDay() || 7;
        sM.setDate(sM.getDate() - (sDay - 1));

        const cM = new Date(c.getFullYear(), c.getMonth(), c.getDate());
        const cDay = cM.getDay() || 7;
        cM.setDate(cM.getDate() - (cDay - 1));

        return Math.round((cM.getTime() - sM.getTime()) / (7 * 24 * 60 * 60 * 1000));
      };

      const diff = getWeekDiff(start, target);
      return diff >= 0 && diff % 2 === 0;
    }

    return false;
  };

  // Calendar calculators
  const getWeekDays = (anchor: Date) => {
    const current = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate());
    const day = current.getDay() || 7; // Monday = 1 ... Sunday = 7

    const monday = new Date(current);
    monday.setDate(current.getDate() - (day - 1));

    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      days.push(nextDay);
    }
    return days;
  };

  const getMonthDays = (anchor: Date) => {
    const year = anchor.getFullYear();
    const month = anchor.getMonth();

    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay() || 7;

    const gridStart = new Date(firstDay);
    gridStart.setDate(firstDay.getDate() - (firstDayOfWeek - 1));

    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      days.push(d);
    }
    return days;
  };

  // Navigations
  const handlePrevRange = () => {
    const next = new Date(calendarAnchor);
    if (calendarMode === 'week') {
      next.setDate(next.getDate() - 7);
    } else {
      next.setMonth(next.getMonth() - 1);
    }
    setCalendarAnchor(next);
  };

  const handleNextRange = () => {
    const next = new Date(calendarAnchor);
    if (calendarMode === 'week') {
      next.setDate(next.getDate() + 7);
    } else {
      next.setMonth(next.getMonth() + 1);
    }
    setCalendarAnchor(next);
  };

  const setAnchorToToday = () => {
    const today = new Date();
    setCalendarAnchor(today);
    setSelectedCalendarDate(today);
  };

  const weekDays = getWeekDays(calendarAnchor);
  const monthDays = getMonthDays(calendarAnchor);

  const getWeekRangeLabel = () => {
    const first = weekDays[0];
    const last = weekDays[6];
    return `${first.getFullYear()}年${first.getMonth() + 1}月${first.getDate()}日 - ${last.getMonth() + 1}月${last.getDate()}日`;
  };

  const getMonthLabel = () => {
    return `${calendarAnchor.getFullYear()}年 ${calendarAnchor.getMonth() + 1}月`;
  };

  // Filter selection exercises for planner pick list
  const filteredMuscleGroups = ['全部', '胸部', '背部', '腿部', '肩部', '手臂', '核心', '有氧'];
  const selectableExercises = presetExercises.filter((ex) => {
    const matchesSearch = ex.name.includes(plannerSearchTerm) || ex.englishName.toLowerCase().includes(plannerSearchTerm.toLowerCase());
    const matchesMuscle = selectedMuscleFilter === '全部' || ex.category === selectedMuscleFilter;
    return matchesSearch && matchesMuscle;
  });

  const getWeekdayChineseName = (num: number) => {
    const map: Record<number, string> = {
      1: '周一',
      2: '周二',
      3: '周三',
      4: '周四',
      5: '周五',
      6: '周六',
      7: '周日'
    };
    return map[num] || '';
  };

  const startSpecificWorkout = (planId: string) => {
    localStorage.setItem('fit_start_plan_id', planId);
    if (onSwitchTab) {
      onSwitchTab('log');
    }
  };

  // Render weekday scheduled lists for highlighted click in Month Mode
  const activePlansOnSelectedDay = plans.filter(p => isPlanActiveOnDate(p, selectedCalendarDate));

  return (
    <div className="space-y-6">
      {/* Editor Screen (Modal/Overlapping card when creating or editing a plan) */}
      {(isCreatingNew || editingPlanId) ? (
        <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-indigo-100/80 animate-fade-in text-slate-800">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-500">
                {editingPlanId ? '编辑修改计划' : '新增全新规划'}
              </span>
              <h2 className="text-xl font-bold text-slate-800">
                {editingPlanId ? `编辑: ${newPlanName}` : '定制您专属的健身规划'}
              </h2>
            </div>
            <button
              onClick={cancelEditOrCreate}
              className="text-xs hover:bg-slate-100 px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 border border-slate-200 transition-colors"
              id="btn-cancel-editor"
            >
              取消
            </button>
          </div>

          <form onSubmit={savePlan} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Plan basic information & Schedule setup */}
              <div className="md:col-span-1 space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  1. 基础与排程设置
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    计划名称 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="例如: 极致胸腹轰炸、每周一高强度腿部"
                    value={newPlanName}
                    onChange={(e) => setNewPlanName(e.target.value)}
                    className="w-full text-sm px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    id="plan-name-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    计划简介 / 备忘
                  </label>
                  <textarea
                    rows={2}
                    placeholder="例如: '注重慢速离心收缩'、'每次深蹲务必到底'..."
                    value={newPlanDescription}
                    onChange={(e) => setNewPlanDescription(e.target.value)}
                    className="w-full text-sm px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    id="plan-desc-input"
                  />
                </div>

                {/* 应用时长 selection details */}
                <div className="bg-indigo-50/40 p-4 border border-indigo-100 rounded-2xl space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-indigo-500" />
                      应用时长 (排程规划)
                    </span>
                    <span className="text-[9px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md font-semibold">
                      状态关联
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { key: 'none', label: '不选' },
                      { key: 'day', label: '仅限当日' },
                      { key: 'weekly', label: '周循环' },
                      { key: 'biweekly', label: '双周循环' }
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setDurationOption(opt.key as any)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all text-center ${
                          durationOption === opt.key
                            ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {/* Day Date Specific field */}
                  {durationOption === 'day' && (
                    <div className="space-y-1 animate-fade-in pt-1.5">
                      <label className="block text-[11px] font-bold text-slate-500">
                        执行训练的具体日期
                      </label>
                      <input
                        type="date"
                        value={specificDate}
                        onChange={(e) => setSpecificDate(e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
                      />
                    </div>
                  )}

                  {/* Cycle selections ranges */}
                  {(durationOption === 'weekly' || durationOption === 'biweekly') && (
                    <div className="space-y-3 animate-fade-in pt-1 border-t border-indigo-100/50">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">
                            循环开始日期
                          </label>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded-lg focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">
                            循环截止日期
                          </label>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded-lg focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500">
                          周内训练日 (可多选)
                        </label>
                        <div className="flex gap-1">
                          {[
                            { num: 1, label: '一' },
                            { num: 2, label: '二' },
                            { num: 3, label: '三' },
                            { num: 4, label: '四' },
                            { num: 5, label: '五' },
                            { num: 6, label: '六' },
                            { num: 7, label: '日' }
                          ].map((dayObj) => {
                            const isSel = selectedWeekdays.includes(dayObj.num);
                            return (
                              <button
                                key={dayObj.num}
                                type="button"
                                onClick={() => {
                                  if (isSel) {
                                    setSelectedWeekdays(selectedWeekdays.filter(d => d !== dayObj.num));
                                  } else {
                                    setSelectedWeekdays([...selectedWeekdays, dayObj.num].sort());
                                  }
                                }}
                                className={`h-7 w-7 rounded-full text-xs font-extrabold transition-colors border ${
                                  isSel 
                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs' 
                                    : 'bg-white border-slate-200 text-slate-600'
                                }`}
                              >
                                {dayObj.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>


              </div>

              {/* Right Column: Config sets/reps/weight with lists */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    2. 已编入动作列表 ({plannedExercises.length})
                  </h3>
                  {plannedExercises.length === 0 && (
                    <span className="text-xs text-rose-500 animate-pulse font-medium">
                      ❗ 须至少添加一个动作才能保存计划
                    </span>
                  )}
                </div>

                <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                  {plannedExercises.map((pe, idx) => (
                    <div
                      key={pe.exerciseId}
                      className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 relative hover:border-slate-300 transition-colors group"
                    >
                      <span className="absolute -top-2.5 -left-2 bg-slate-800 text-white rounded-full h-5 w-5 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-800 text-sm">{pe.name}</p>
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-1">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 mb-0.5">
                              预设组数
                            </label>
                            <select
                              value={pe.sets}
                              onChange={(e) => updatePlannedExercise(idx, 'sets', parseInt(e.target.value) || 3)}
                              className="w-full text-xs bg-white border border-slate-200 rounded-lg p-1.5 focus:outline-none font-semibold text-slate-700"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <option key={num} value={num}>
                                  {num} 组
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 mb-0.5">
                              每组次数/时长
                            </label>
                            <input
                              type="text"
                              value={pe.reps}
                              placeholder="e.g. 10-12次"
                              onChange={(e) => updatePlannedExercise(idx, 'reps', e.target.value)}
                              className="w-full text-xs bg-white border border-slate-200 rounded-lg p-1.5 focus:outline-none font-semibold text-slate-700"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 mb-0.5">
                              预设重量 (选填)
                            </label>
                            <input
                              type="text"
                              value={pe.weight || ''}
                              placeholder="e.g. 20kg"
                              onChange={(e) => updatePlannedExercise(idx, 'weight', e.target.value)}
                              className="w-full text-xs bg-white border border-slate-200 rounded-lg p-1.5 focus:outline-none font-semibold text-slate-700"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center gap-1.5 w-full sm:w-auto justify-end sm:justify-start border-t sm:border-t-0 border-slate-200/50 pt-2 sm:pt-0">
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => moveExercise(idx, 'up')}
                            disabled={idx === 0}
                            title="上移"
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white text-slate-500"
                          >
                            <ChevronUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveExercise(idx, 'down')}
                            disabled={idx === plannedExercises.length - 1}
                            title="下移"
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white text-slate-500"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeExerciseFromFormList(idx)}
                          className="p-1.5 hover:bg-rose-50 rounded-lg border border-slate-200 hover:border-rose-200 text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1.5 px-3 sm:px-1.5"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {plannedExercises.length === 0 && (
                    <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-400">
                      <Layers className="h-8 w-8 mx-auto mb-3 opacity-40 text-slate-500" />
                      <p className="text-xs font-bold text-slate-600">在此制定您的动作链</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sub-interface: Pick from preset database */}
            <div className="bg-slate-50/50 p-5 border border-slate-200/80 rounded-2xl space-y-4 mt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/50">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">快速点选动作加入计划</h4>
                    <p className="text-[10px] text-slate-400">点击动作卡片即可快速加入上方计划中</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:w-auto w-full">
                  <input
                    type="text"
                    placeholder="检索动作中英文(如: 深蹲, bench)..."
                    value={plannerSearchTerm}
                    onChange={(e) => setPlannerSearchTerm(e.target.value)}
                    className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-48"
                  />

                  {/* Muscle pill selects */}
                  <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none max-w-full sm:max-w-xs md:max-w-md">
                    {filteredMuscleGroups.map((mg) => (
                      <button
                        key={mg}
                        type="button"
                        onClick={() => setSelectedMuscleFilter(mg)}
                        className={`text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap border border-transparent transition-colors cursor-pointer ${
                          selectedMuscleFilter === mg
                            ? 'bg-indigo-600 border-indigo-600 text-white font-semibold'
                            : 'bg-slate-200/60 text-slate-600 hover:bg-slate-200 border-slate-200'
                        }`}
                      >
                        {mg}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filtered horizontal grid list inside edit/create */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 max-h-48 overflow-y-auto pr-1">
                {selectableExercises.map((ex) => {
                  const isAdded = plannedExercises.some((pe) => pe.exerciseId === ex.id);

                  return (
                    <div
                      key={ex.id}
                      onClick={() => !isAdded && addExerciseToFormList(ex)}
                      className={`flex items-center justify-between p-2 rounded-xl border text-xs transition-all cursor-pointer group ${
                        isAdded
                          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-xs text-slate-700'
                      }`}
                    >
                      <div className="truncate flex-1 pr-1">
                        <p className={`font-bold truncate text-left ${isAdded ? 'text-slate-400' : 'text-slate-700'}`}>{ex.name}</p>
                        <span className="text-[9px] text-slate-400 capitalize block truncate text-left">{ex.category} · {ex.equipment}</span>
                      </div>
                      <button
                        type="button"
                        disabled={isAdded}
                        className={`p-1 rounded-lg transition-colors ${
                          isAdded
                            ? 'text-slate-350'
                            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                        }`}
                      >
                        {isAdded ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Plus className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={cancelEditOrCreate}
                className="px-5 py-2 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={plannedExercises.length === 0}
                className={`px-6 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-sm ${
                  plannedExercises.length === 0
                    ? 'bg-slate-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
                id="btn-save-plan"
              >
                {editingPlanId ? '保存精修计划' : '创建计划'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in text-slate-800">
          
          {/* ========================================================
              MODULE 1: Calendar planning grid (Week / Month view switcher)
              ======================================================== */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900 tracking-tight">
                    训练日历
                  </h2>
                </div>
              </div>

              {/* Week/Month Switch Buttons & Today */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setCalendarMode('week')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      calendarMode === 'week'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    周模式
                  </button>
                  <button
                    onClick={() => setCalendarMode('month')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      calendarMode === 'month'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    月模式
                  </button>
                </div>
                <button
                  onClick={setAnchorToToday}
                  className="px-3 py-1.5 text-xs font-bold border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 transition-colors whitespace-nowrap"
                >
                  回到今天
                </button>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between border-t border-slate-100/80 pt-3">
              <button
                onClick={handlePrevRange}
                className="p-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors"
                title={calendarMode === 'week' ? '上一周' : '上一个月'}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-extrabold text-slate-800 font-mono">
                {calendarMode === 'week' ? getWeekRangeLabel() : getMonthLabel()}
              </span>
              <button
                onClick={handleNextRange}
                className="p-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors"
                title={calendarMode === 'week' ? '下一周' : '下一个月'}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* WEEK VIEW (DISPLAY WEEKLY SCHEDULE DETAILS FOR THE CURRENT FOCUS WEEK) */}
            {calendarMode === 'week' && (
              <div className="space-y-4 animate-fade-in">
                {/* 7 Days Quick Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((dateObj, i) => {
                    const dateStr = formatDateStr(dateObj);
                    const isToday = formatDateStr(new Date()) === dateStr;
                    const isFocused = formatDateStr(selectedCalendarDate) === dateStr;
                    const hasWorkout = plans.some((p) => isPlanActiveOnDate(p, dateObj));

                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedCalendarDate(dateObj)}
                        className={`p-2.5 rounded-2xl flex flex-col items-center gap-1 transition-all border outline-none ${
                          isFocused
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : isToday
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-transparent'
                        }`}
                      >
                        <span className="text-[10px] opacity-75 font-bold">
                          {getWeekdayChineseName(dateObj.getDay() || 7)}
                        </span>
                        <span className="text-sm font-black font-mono">
                          {dateObj.getDate()}
                        </span>
                        {hasWorkout && (
                          <span className={`h-1.5 w-1.5 rounded-full ${isFocused ? 'bg-indigo-400' : 'bg-indigo-600'}`}></span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Exercises summary of current focused date inside Week View */}
                <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      所选日期计划 ({selectedCalendarDate.getMonth() + 1}月{selectedCalendarDate.getDate()}日 {getWeekdayChineseName(selectedCalendarDate.getDay() || 7)})
                    </span>
                    <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-bold">
                      单日排程
                    </span>
                  </div>

                  {activePlansOnSelectedDay.length > 0 ? (
                    <div className="space-y-2">
                      {activePlansOnSelectedDay.map((p) => (
                        <div key={p.id} className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <h4 className="text-xs font-extrabold text-slate-800">{p.name}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">{p.description || '无备忘说明'}</p>
                            <span className="inline-block mt-1 text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">
                              {p.exercises.length}项动作
                            </span>
                          </div>
                          <button
                            onClick={() => startSpecificWorkout(p.id)}
                            className="w-full sm:w-auto px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold hover:bg-slate-900 transition-colors flex items-center justify-center gap-1"
                          >
                            <Play className="h-3 w-3 fill-white" />
                            立即开练
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 text-center text-[11px] text-slate-400 italic">
                      ☘️ 这一天暂无自定义计划，给自己安排一场放松或拉伸吧！
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MONTH VIEW (42 CELLS MONTH CALENDAR SCHEDULER GRAPHIC) */}
            {calendarMode === 'month' && (
              <div className="space-y-4 animate-fade-in">
                {/* Month Grid Header Weekdays */}
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <div>一</div>
                  <div>二</div>
                  <div>三</div>
                  <div>四</div>
                  <div>五</div>
                  <div>六</div>
                  <div>日</div>
                </div>

                {/* 42 Cells Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {monthDays.map((cellDate, idx) => {
                    const cellDateStr = formatDateStr(cellDate);
                    const isToday = formatDateStr(new Date()) === cellDateStr;
                    const isFocused = formatDateStr(selectedCalendarDate) === cellDateStr;
                    const isCurrentMonth = cellDate.getMonth() === calendarAnchor.getMonth();
                    const hasWorkout = plans.some((p) => isPlanActiveOnDate(p, cellDate));

                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedCalendarDate(cellDate)}
                        className={`h-10 md:h-12 rounded-xl flex flex-col justify-between p-1.5 border text-left outline-none relative transition-all ${
                          isFocused
                            ? 'bg-slate-900 text-white border-slate-900 z-10'
                            : isToday
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : hasWorkout
                            ? 'bg-indigo-50/50 hover:bg-indigo-100/40 text-indigo-900 border-indigo-100/60 font-semibold'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-100'
                        } ${!isCurrentMonth ? 'opacity-30' : ''}`}
                      >
                        <span className="text-[10px] font-bold font-mono">{cellDate.getDate()}</span>
                        {hasWorkout && (
                          <span className={`block w-2 h-2 rounded-full absolute bottom-1.5 right-1.5 ${
                            isFocused ? 'bg-indigo-400' : 'bg-indigo-600'
                          }`} />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Monthly active selected list details */}
                <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      所选日期计划 ({selectedCalendarDate.getMonth() + 1}月{selectedCalendarDate.getDate()}日)
                    </span>
                    <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-bold">
                      日历打卡查看
                    </span>
                  </div>

                  {activePlansOnSelectedDay.length > 0 ? (
                    <div className="space-y-2">
                      {activePlansOnSelectedDay.map((p) => (
                        <div key={p.id} className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <h4 className="text-xs font-extrabold text-slate-800">{p.name}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">{p.description || '无备忘说明'}</p>
                            <span className="inline-block mt-1 text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">
                              {p.exercises.length}项动作
                            </span>
                          </div>
                          <button
                            onClick={() => startSpecificWorkout(p.id)}
                            className="w-full sm:w-auto px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold hover:bg-slate-900 transition-colors flex items-center justify-center gap-1"
                          >
                            <Play className="h-3 w-3 fill-white" />
                            立即开练
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 text-center text-[11px] text-slate-400 italic">
                      ☘️ 这一天暂无自定义计划，放松调理充实自我。
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ========================================================
              MODULE 2: Already Saved Plans List Database
              ======================================================== */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-150/80 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-500" />
                  已保存的计划清单 ({plans.length})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  在此自由微调您专属的工作日程或复制官方推荐预设，点击下方卡片即可展开查看详情
                </p>
              </div>

              <button
                onClick={startCreateNewPlan}
                className="px-4 py-2.5 bg-slate-900 hover:bg-indigo-600 hover:shadow-md text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                id="btn-start-create-plan"
              >
                <Plus className="h-4 w-4" />
                新建自定义计划
              </button>
            </div>

            <div className="space-y-4">
              {plans.map((plan) => {
                const isExpanded = expandedPlanId === plan.id;

                return (
                  <div
                    key={plan.id}
                    className="bg-white rounded-2xl shadow-xs border border-slate-200/80 hover:border-slate-300 transition-all duration-200 max-w-full overflow-hidden"
                    id={`plan-card-item-${plan.id}`}
                  >
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1 min-w-0" onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}>
                        <div className="flex flex-wrap items-center gap-1.5 mb-1 cursor-pointer">
                          <span
                            className={`px-2 py-0.5 text-[9px] font-black rounded-md uppercase ${
                              plan.isPreset
                                ? 'bg-amber-50 text-amber-700 border border-amber-200/50'
                                : 'bg-indigo-50 text-indigo-700 border border-indigo-200/50'
                            }`}
                          >
                            {plan.isPreset ? '经典预设' : '我的规划'}
                          </span>
                          
                          {/* Apply range labels directly on plan list */}
                          {plan.durationOption && plan.durationOption !== 'none' ? (
                            <span className="text-[9px] font-black uppercase text-indigo-800 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-md">
                              {plan.durationOption === 'day' && `单日限制: ${plan.specificDate}`}
                              {plan.durationOption === 'weekly' && `周期[每周]: ${plan.weekdays?.map(w => getWeekdayChineseName(w)).join(',')}`}
                              {plan.durationOption === 'biweekly' && `周期[双周]: ${plan.weekdays?.map(w => getWeekdayChineseName(w)).join(',')}`}
                            </span>
                          ) : (
                            <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-100 border border-slate-200/50 px-1.5 py-0.5 rounded-md">
                              暂无排程
                            </span>
                          )}

                          <h3 className="font-extrabold text-slate-800 hover:text-indigo-600 transition-colors text-base ml-1">
                            {plan.name}
                          </h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1 cursor-pointer" onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}>
                          {plan.exercises.length > 0 ? (
                            plan.exercises.map((pe) => (
                              <span key={pe.exerciseId} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-md font-bold border border-slate-200/40">
                                {pe.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400 font-medium font-sans">（未添加动作）</span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-400 font-semibold uppercase">
                          <span>共计 <strong>{plan.exercises.length}</strong> 项训练动作</span>
                          <span>·</span>
                          <span>
                            预计耗时: <strong>{plan.exercises.length * 12} - {plan.exercises.length * 15}</strong> 分钟
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 justify-end">
                        {plan.isPreset ? (
                          <button
                            onClick={() => duplicatePresetToCustom(plan)}
                            title="复制并自定义本计划"
                            className="p-1 px-3 text-amber-700 hover:bg-amber-700 hover:text-white rounded-xl border border-amber-200 bg-amber-50/50 hover:border-amber-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
                            id={`btn-dup-plan-${plan.id}`}
                          >
                            <Copy className="h-3 w-3" />
                            克隆计划
                          </button>
                        ) : (
                          <button
                            onClick={() => startEditPlan(plan)}
                            className="p-1 px-3 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl border border-indigo-100 bg-indigo-50/50 hover:border-indigo-600 text-xs font-semibold flex items-center gap-1.5 transition-all"
                            id={`btn-edit-plan-${plan.id}`}
                          >
                            <Edit2 className="h-3 w-3" />
                            自定义微调
                          </button>
                        )}

                        {!plan.isPreset && (
                          <button
                            onClick={() => onDeletePlan(plan.id)}
                            title="永久删除本计划"
                            className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-xl transition-all"
                            id={`btn-delete-plan-${plan.id}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}
                          className="p-2 hover:bg-slate-50 border border-slate-200 text-slate-500 rounded-xl transition-all"
                          id={`btn-toggle-expand-${plan.id}`}
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="bg-slate-50/60 p-4 border-t border-slate-100 space-y-2.5 animate-slide-down">
                        <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                          训练顺序及预设负荷:
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          {plan.exercises.map((pe, idx) => (
                            <div
                              key={pe.exerciseId}
                              className="bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 flex items-center gap-2 text-xs hover:border-indigo-300 transition-colors"
                            >
                              <span className="h-4.5 w-4.5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-mono font-bold text-[9px]">
                                {idx + 1}
                              </span>
                              <span className="font-bold text-slate-700">{pe.name}</span>
                              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded-md">
                                <span>{pe.sets}组</span>
                                <span>·</span>
                                <span>{pe.reps}</span>
                                {pe.weight && pe.weight !== '自重' && (
                                  <>
                                    <span>·</span>
                                    <span className="text-indigo-600">{pe.weight}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {plans.length === 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-500 max-w-sm mx-auto">
                  <FileText className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                  <h3 className="font-bold text-slate-800 text-sm">暂无健身计划</h3>
                  <button
                    onClick={startCreateNewPlan}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 text-xs transition-colors animate-pulse"
                  >
                    现在创建一个
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
