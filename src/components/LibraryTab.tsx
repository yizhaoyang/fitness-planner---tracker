import React, { useState } from 'react';
import { presetExercises } from '../data/exercises';
import { Exercise, MuscleGroup } from '../types';
import { Search, Info, Award, Dumbbell, Play, Sparkles, Filter, ChevronRight, X, PlusCircle, Check } from 'lucide-react';

interface LibraryTabProps {
  onAddExerciseToPlan?: (exercise: Exercise) => void;
}

export default function LibraryTab({ onAddExerciseToPlan }: LibraryTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MuscleGroup | '全部'>('全部');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | '全部'>('全部');
  const [selectedEquipment, setSelectedEquipment] = useState<string | '全部'>('全部');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  // Filter exercises
  const filteredExercises = presetExercises.filter((exercise) => {
    const matchesSearch =
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '全部' || exercise.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === '全部' || exercise.difficulty === selectedDifficulty;
    const matchesEquipment = selectedEquipment === '全部' || exercise.equipment === selectedEquipment;

    return matchesSearch && matchesCategory && matchesDifficulty && matchesEquipment;
  });

  const categories: (MuscleGroup | '全部')[] = ['全部', '胸部', '背部', '腿部', '肩部', '手臂', '核心', '有氧'];
  const difficulties = ['全部', '入门', '进阶', '高阶'];
  const equipments = ['全部', '自重', '哑铃', '杠铃', '器械'];

  const getDifficultyColor = (diff: Exercise['difficulty']) => {
    switch (diff) {
      case '入门':
        return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case '进阶':
        return 'text-amber-600 bg-amber-50 border-amber-100';
      case '高阶':
        return 'text-rose-600 bg-rose-50 border-rose-100';
    }
  };

  const getCategoryTheme = (cat: MuscleGroup) => {
    switch (cat) {
      case '胸部': return 'from-teal-500/10 to-emerald-500/10 text-teal-700 border-teal-200/50';
      case '背部': return 'from-blue-500/10 to-indigo-500/10 text-blue-700 border-blue-200/50';
      case '腿部': return 'from-orange-500/10 to-amber-500/10 text-orange-700 border-orange-200/50';
      case '肩部': return 'from-purple-500/10 to-pink-500/10 text-purple-700 border-purple-200/50';
      case '手臂': return 'from-violet-500/10 to-purple-500/10 text-violet-700 border-violet-200/50';
      case '核心': return 'from-cyan-500/10 to-sky-500/10 text-cyan-700 border-cyan-200/50';
      case '有氧': return 'from-rose-500/10 to-red-500/10 text-rose-700 border-rose-200/50';
    }
  };

  const handleQuickAdd = (ex: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddExerciseToPlan) {
      onAddExerciseToPlan(ex);
      setAddedNotice(ex.name);
      setTimeout(() => setAddedNotice(null), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Quick Header */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-indigo-600" />
              运动动作库
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              探索详尽的健身动作指引。点击卡片查看步骤、呼吸诀窍及防伤安全提示。
            </p>
          </div>

          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="搜索动作名称、发力部位、说明..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50/50"
              id="exercise-search-input"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filters Grid */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          {/* Categories Horizontal Scroll */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Filter className="h-3 w-3" /> 部位选择
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all border ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-100'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                  id={`filter-cat-${cat}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            {/* Equipment Filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-400">器械类型:</span>
              <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1 border border-slate-200/60">
                {equipments.map((eq) => (
                  <button
                    key={eq}
                    onClick={() => setSelectedEquipment(eq)}
                    className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                      selectedEquipment === eq
                        ? 'bg-white text-slate-800 shadow-xs ring-1 ring-black/5'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                    id={`filter-eq-${eq}`}
                  >
                    {eq}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-400">难度等级:</span>
              <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1 border border-slate-200/60">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                      selectedDifficulty === diff
                        ? 'bg-white text-slate-800 shadow-xs ring-1 ring-black/5'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                    id={`filter-diff-${diff}`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Adding Exercise Toast Notice */}
      {addedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-sm px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-slide-up">
          <div className="bg-emerald-500 rounded-full p-0.5">
            <Check className="h-3.5 w-3.5 text-white" />
          </div>
          <span>已将 <strong>{addedNotice}</strong> 暂存至自定义计划编辑器中</span>
        </div>
      )}

      {/* Grid of Exercises */}
      {filteredExercises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map((ex) => {
            const hasQuickAdd = !!onAddExerciseToPlan;
            const theme = getCategoryTheme(ex.category);

            return (
              <div
                key={ex.id}
                onClick={() => setSelectedExercise(ex)}
                className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/60 hover:shadow-md hover:border-indigo-200 transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                id={`exercise-card-${ex.id}`}
              >
                {/* Visual Accent Corner background */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-slate-50 to-transparent -z-0 opacity-40 rounded-bl-3xl group-hover:scale-105 transition-transform" />

                <div className="z-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md bg-gradient-to-r border ${theme}`}>
                      {ex.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold rounded-md border ${getDifficultyColor(ex.difficulty)}`}>
                        {ex.difficulty}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] text-slate-500 bg-slate-100 rounded-md">
                        {ex.equipment}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-800 transition-colors group-hover:text-indigo-600 flex items-center gap-1">
                    {ex.name}
                    <span className="text-[10px] font-normal text-slate-400 truncate max-w-[120px] ml-1">
                      {ex.englishName}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed h-8">
                    {ex.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between z-10">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400 font-medium">主打肌群:</span>
                    <span className="text-[10px] text-slate-600 bg-slate-100/80 px-1.5 py-0.5 rounded-md font-medium">
                      {ex.primaryMuscles[0]}
                    </span>
                    {ex.primaryMuscles.length > 1 && (
                      <span className="text-[9px] text-slate-400">
                        +{ex.primaryMuscles.length - 1}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {hasQuickAdd && (
                      <button
                        onClick={(e) => handleQuickAdd(ex, e)}
                        title="添加到自定义计划"
                        className="p-1 px-2.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white transition-all duration-200 text-[11px] font-semibold flex items-center gap-1 border border-indigo-100 hover:border-indigo-600"
                        id={`btn-quick-add-${ex.id}`}
                      >
                        <PlusCircle className="h-3 w-3" />
                        添加
                      </button>
                    )}
                    <span className="p-1 rounded-lg bg-slate-50 group-hover:bg-indigo-50 text-slate-400 group-hover:text-indigo-600 transition-colors">
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 max-w-md mx-auto">
          <div className="h-12 w-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">未找到符合条件的动作</h3>
          <p className="text-xs text-slate-500 mt-1">
            试试更换过滤器选项或缩短搜索关键词。
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('全部');
              setSelectedDifficulty('全部');
              setSelectedEquipment('全部');
            }}
            className="mt-4 px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-100"
            id="btn-reset-filters"
          >
            清除全部筛选项
          </button>
        </div>
      )}

      {/* Exercise Detail Modal (Fullscreen drawer on mobile, central dialog on desktop) */}
      {selectedExercise && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative border border-slate-100 flex flex-col"
            id="exercise-modal-wrapper"
          >
            {/* Modal Header banner */}
            <div className={`p-6 pb-4 bg-gradient-to-r flex items-start justify-between border-b border-slate-100 sticky top-0 bg-white z-20`}>
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${getCategoryTheme(selectedExercise.category)}`}>
                    {selectedExercise.category}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border ${getDifficultyColor(selectedExercise.difficulty)}`}>
                    {selectedExercise.difficulty}级别
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-slate-100 text-slate-600 border border-slate-200/50">
                    器械: {selectedExercise.equipment}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {selectedExercise.name}
                  <span className="text-xs font-normal text-slate-400 block sm:inline sm:ml-2">
                    {selectedExercise.englishName}
                  </span>
                </h2>
              </div>

              <button
                onClick={() => setSelectedExercise(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                id="btn-close-exercise-modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Muscle Schematic Animation/Visual Box */}
              <div className="bg-gradient-to-br from-indigo-50/50 to-slate-50 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4 border border-indigo-100/50">
                <div className="h-20 w-20 flex-shrink-0 bg-white shadow-sm rounded-xl flex flex-col items-center justify-center border border-indigo-100 text-indigo-600">
                  <Dumbbell className="h-8 w-8 animate-bounce" />
                  <span className="text-[10px] font-black tracking-widest uppercase mt-1">FIT</span>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-indigo-900">拉伸与肌肉募集区域</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    <strong>主激活肌肉: </strong>
                    {selectedExercise.primaryMuscles.join(', ')}。
                    健身打卡时，将意念集中在这些发力点能令力量传导倍增。
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-indigo-500" />
                  动作要领概述
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  {selectedExercise.description}
                </p>
              </div>

              {/* Steps (Ordered) */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Play className="h-3.5 w-3.5 text-emerald-500" />
                  分步动作步骤
                </h3>
                <ol className="divide-y divide-slate-100">
                  {selectedExercise.steps.map((step, idx) => (
                    <li key={idx} className="flex gap-3 py-3 items-start select-none first:pt-0 last:pb-0">
                      <span className="flex-shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-indigo-50 text-indigo-600 font-mono text-[11px] font-bold mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-sm text-slate-600 leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Pro Tips / Safety Cautions (Warnings) */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  黄金提示与防伤安全区
                </h3>
                <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-4 gap-3 flex flex-col">
                  {selectedExercise.tips.map((tip, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <span className="text-amber-500 font-bold select-none text-[11px] mt-0.5">✦</span>
                      <p className="text-xs text-slate-700 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer quick add */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0 z-20">
              <button
                onClick={() => setSelectedExercise(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 font-medium rounded-xl text-xs hover:bg-slate-100 transition-colors"
                id="btn-modal-cancel"
              >
                关闭
              </button>
              {onAddExerciseToPlan && (
                <button
                  onClick={(e) => {
                    handleQuickAdd(selectedExercise, e);
                    setSelectedExercise(null);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-sm shadow-indigo-100"
                  id="btn-modal-quick-add"
                >
                  <PlusCircle className="h-4 w-4" />
                  添加到我的计划
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
