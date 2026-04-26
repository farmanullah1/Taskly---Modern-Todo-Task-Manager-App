import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Layout, 
  CheckCircle2, 
  ListTodo, 
  Sparkles, 
  Download, 
  Upload,
  Keyboard,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import useSound from 'use-sound';

import { TaskInput } from './components/TaskInput';
import { TaskItem } from './components/TaskItem';
import { Filters } from './components/Filters';
import { ProgressBar } from './components/ProgressBar';
import { SearchBar } from './components/SearchBar';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { CategoryStats } from './components/CategoryStats';
import { useLocalStorage } from './hooks/useLocalStorage';
import { cn } from './utils/cn';

function App() {
  const [tasks, setTasks] = useLocalStorage('taskly-tasks', []);
  const [darkMode, setDarkMode] = useLocalStorage('taskly-dark-mode', true);
  const [theme, setTheme] = useLocalStorage('taskly-theme', { name: 'Indigo', color: '#6366f1', hover: '#4f46e5' });
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3', { volume: 0.5 });
  const [playComplete] = useSound('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', { volume: 0.5 });

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', theme.color);
    document.documentElement.style.setProperty('--accent-hover', theme.hover);
  }, [theme]);

  const addTask = useCallback(({ text, category, priority, dueDate, notes }) => {
    const newTask = {
      id: Date.now().toString(),
      text,
      category,
      priority,
      dueDate,
      notes,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
  }, [tasks, setTasks]);

  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));

  const toggleTask = (id) => {
    const newTasks = tasks.map(t => {
      if (t.id === id) {
        const completed = !t.completed;
        if (completed) {
          playSuccess();
          if (t.priority === 'high') {
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors: [theme.color, '#ec4899', '#8b5cf6']
            });
          }
        }
        return { ...t, completed };
      }
      return t;
    });
    setTasks(newTasks);
  };

  const editTask = (id, newText) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, text: newText } : t));
  };

  const clearCompleted = () => setTasks(tasks.filter(t => !t.completed));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "taskly_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const statusMatch = filterStatus === 'All' || 
        (filterStatus === 'Active' && !task.completed) || 
        (filterStatus === 'Completed' && task.completed);
      const categoryMatch = filterCategory === 'All' || task.category === filterCategory;
      const searchMatch = task.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.notes?.toLowerCase().includes(searchQuery.toLowerCase());
      return statusMatch && categoryMatch && searchMatch;
    });
  }, [tasks, filterStatus, filterCategory, searchQuery]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    return { total, completed, progress };
  }, [tasks]);

  useEffect(() => {
    if (tasks.length > 0 && tasks.every(t => t.completed)) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#22c55e', theme.color, '#fbbf24']
      });
      playComplete();
    }
  }, [tasks.length, tasks.every(t => t.completed), theme.color]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-16 min-h-screen flex flex-col">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/40 relative group shrink-0"
          >
            <Layout className="text-white" size={36} />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-secondary rounded-full border-2 border-white dark:border-slate-900 group-hover:scale-125 transition-transform" />
          </motion.div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Taskly</h1>
            <p className="text-text-muted text-xs md:text-sm font-bold tracking-widest flex items-center gap-2">
              ULTIMATE WORKFLOW <Sparkles size={14} className="text-amber-400" />
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />
          
          <div className="flex gap-2">
            <button
              onClick={exportData}
              title="Export Data"
              className="p-3 glass-card text-slate-500 hover:text-primary transition-all"
            >
              <Download size={20} />
            </button>
            <button
              onClick={() => setShowHelp(!showHelp)}
              title="Help"
              className={cn(
                "p-3 glass-card transition-all",
                showHelp ? "text-primary bg-primary/10" : "text-slate-500 hover:text-primary"
              )}
            >
              <Keyboard size={20} />
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 glass-card text-slate-500 hover:text-primary"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <ProgressBar progress={stats.progress} />
          <CategoryStats tasks={tasks} />
        </div>
        <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Info size={16} /> Quick Tip
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium">
              "Focus on being productive instead of busy." Reorder your high-priority tasks to the top to stay aligned with your goals.
            </p>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800/50 flex justify-between items-end">
            <div>
              <div className="text-3xl font-black text-primary">{tasks.length - stats.completed}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tasks Remaining</div>
            </div>
            <CheckCircle2 size={32} className="text-green-500/20" />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-8 overflow-hidden"
          >
            <div className="glass-card p-6 bg-amber-500/5 border-amber-500/20">
              <h4 className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2 mb-4">
                <Keyboard size={18} /> Keyboard Shortcuts
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white dark:bg-slate-800 border rounded shadow-sm">Enter</kbd> Add / Save Task
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white dark:bg-slate-800 border rounded shadow-sm">Esc</kbd> Cancel Edit
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white dark:bg-slate-800 border rounded shadow-sm">Space</kbd> Toggle Completion
                </div>
                <div className="flex items-center gap-2 text-primary font-bold">
                  <kbd className="px-2 py-1 bg-white dark:bg-slate-800 border rounded shadow-sm">Drag</kbd> Reorder Tasks
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="sticky top-4 z-40 mb-8 space-y-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <TaskInput onAdd={addTask} />

      <Filters 
        filterStatus={filterStatus} 
        setFilterStatus={setFilterStatus}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        onClearCompleted={clearCompleted}
      />

      {/* Task List */}
      <div className="flex-1 pb-20">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={filteredTasks.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <motion.div
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-2"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95, x: 20 }}
                    >
                      <TaskItem 
                        task={task} 
                        onDelete={deleteTask} 
                        onToggle={toggleTask}
                        onEdit={editTask}
                      />
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 glass-card border-dashed"
                  >
                    <ListTodo size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-500">No tasks match your filters</h3>
                    <p className="text-sm text-slate-400">Clear your search or filters to see more tasks.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Footer */}
      <footer className="mt-auto pt-12 text-center">
        <div className="flex flex-wrap justify-center gap-8 mb-6">
          <div className="flex flex-col items-center">
            <div className="text-2xl font-black text-primary">{stats.total}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Created</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl font-black text-green-500">{stats.completed}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Completed</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl font-black text-secondary">{tasks.length - stats.completed}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending</div>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-text-muted font-bold tracking-tight">Taskly Ultimate v3.0</p>
          <div className="flex justify-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <a href="https://farmanullah1.github.io/My-Portfolio/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline decoration-primary/30">My Portfolio</a>
            <span>•</span>
            <a href="https://farmanullah1.github.io/Taskly---Modern-Todo-Task-Manager-App/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline decoration-primary/30">Live App</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
