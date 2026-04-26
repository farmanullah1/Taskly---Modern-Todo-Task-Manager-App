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
  Zap, 
  Settings,
  CheckCircle2, 
  ListTodo, 
  Sparkles, 
  Download, 
  X,
  Keyboard,
  Rocket,
  Flame,
  LayoutGrid,
  Search,
  Filter,
  Trash2,
  MoreVertical,
  Plus,
  ArrowRight,
  User,
  Globe,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import useSound from 'use-sound';

import { TaskInput } from './components/TaskInput';
import { TaskItem } from './components/TaskItem';
import { Filters } from './components/Filters';
import { ProgressBar } from './components/ProgressBar';
import { useLocalStorage } from './hooks/useLocalStorage';
import { cn } from './utils/cn';

function App() {
  const [tasks, setTasks] = useLocalStorage('taskly-tasks', []);
  const [darkMode, setDarkMode] = useLocalStorage('taskly-dark-mode', true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3', { volume: 0.3 });

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    const streak = tasks.filter(t => t.completed && new Date(t.createdAt).toDateString() === new Date().toDateString()).length;
    return { total, completed, progress, streak };
  }, [tasks]);

  const toggleTask = (id) => {
    const newTasks = tasks.map(t => {
      if (t.id === id) {
        const completed = !t.completed;
        if (completed) {
          playSuccess();
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#8B5CF6', '#EC4899', '#06B6D4']
          });
        }
        return { ...t, completed };
      }
      return t;
    });
    setTasks(newTasks);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const statusMatch = filterStatus === 'All' || 
        (filterStatus === 'Active' && !task.completed) || 
        (filterStatus === 'Completed' && task.completed);
      const categoryMatch = filterCategory === 'All' || task.category === filterCategory;
      const searchMatch = task.text.toLowerCase().includes(searchQuery.toLowerCase());
      return statusMatch && categoryMatch && searchMatch;
    });
  }, [tasks, filterStatus, filterCategory, searchQuery]);

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

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen relative overflow-hidden px-4 py-8 md:py-16">
      <div className="nebula-bg" />
      
      {/* HUD - Floating Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="cosmic-card p-2 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 pl-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 rotate-12">
              <Rocket className="text-white" size={20} />
            </div>
            <span className="font-black text-xl tracking-tighter glow-text">TASKLY</span>
          </div>
          
          <div className="flex items-center gap-2">
            <a 
              href="https://farmanullah1.github.io/My-Portfolio/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 hover:bg-primary/10 rounded-2xl text-white/40 hover:text-primary transition-all flex items-center gap-2"
              title="My Portfolio"
            >
              <User size={20} />
              <span className="hidden lg:inline text-xs font-bold uppercase tracking-widest">Portfolio</span>
            </a>
            <a 
              href="https://github.com/farmanullah1/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 hover:bg-primary/10 rounded-2xl text-white/40 hover:text-primary transition-all flex items-center gap-2"
              title="GitHub Profile"
            >
              <svg 
                viewBox="0 0 24 24" 
                width="20" 
                height="20" 
                stroke="currentColor" 
                strokeWidth="2" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              <span className="hidden lg:inline text-xs font-bold uppercase tracking-widest">GitHub</span>
            </a>
            <div className="w-[1px] h-6 bg-white/10 mx-1" />
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 hover:bg-primary/10 rounded-2xl text-white/40 hover:text-primary transition-all"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="w-[1px] h-6 bg-white/10 mx-1" />
            <button 
              onClick={() => setIsFocusMode(!isFocusMode)}
              className={cn(
                "p-3 rounded-2xl transition-all",
                isFocusMode ? "bg-primary text-white" : "hover:bg-primary/10 text-white/40"
              )}
            >
              <Zap size={20} />
            </button>
            <div className="hidden xl:flex items-center gap-2 bg-white/5 rounded-2xl px-4 py-2 border border-white/5">
              <Flame size={16} className="text-orange-500 animate-pulse" />
              <span className="font-bold text-sm">{stats.streak}</span>
            </div>
          </div>
        </motion.div>
      </nav>

      <main className="max-w-4xl mx-auto pt-24 pb-32">
        <header className="mb-12 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black mb-4 tracking-tighter"
          >
            Cosmic <span className="logo-gradient">Productivity</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 text-lg font-medium"
          >
            Manage your universe of tasks with style.
          </motion.p>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="cosmic-card p-8 lg:col-span-2 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
            <div className="relative z-10">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="text-sm font-bold text-white/30 uppercase tracking-[0.2em] mb-2">Completion Rate</h3>
                  <div className="text-6xl font-black glow-text">{Math.round(stats.progress)}%</div>
                </div>
                <div className="text-right">
                  <div className="text-primary font-bold text-lg">{stats.completed} / {stats.total}</div>
                  <div className="text-white/20 text-xs font-bold uppercase">Tasks Finished</div>
                </div>
              </div>
              <ProgressBar progress={stats.progress} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="cosmic-card p-8 flex flex-col justify-between bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/20"
          >
            <Sparkles className="text-primary mb-4" size={32} />
            <div>
              <h4 className="text-xl font-bold mb-2 leading-tight">Ready for a productive mission?</h4>
              <p className="text-white/50 text-sm">You have {stats.total - stats.completed} pending tasks today.</p>
            </div>
            <button className="mt-6 btn-cosmic w-full">
              Start Focus Session <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>

        <div className="space-y-6">
          {/* Quick Actions & Search */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find your next task..." 
                className="input-cosmic pl-16"
              />
            </div>
            <div className="flex gap-2">
              <button className="cosmic-card px-6 py-4 flex items-center gap-2 hover:bg-white/5">
                <Filter size={18} className="text-white/40" />
                <span className="font-bold text-sm">Filter</span>
              </button>
              <button className="btn-cosmic px-8">
                <Plus size={24} strokeWidth={3} />
              </button>
            </div>
          </div>

          <TaskInput onAdd={(task) => setTasks([ { ...task, id: Date.now().toString(), createdAt: new Date().toISOString(), completed: false }, ...tasks ])} />

          <Filters 
            filterStatus={filterStatus} 
            setFilterStatus={setFilterStatus}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            onClearCompleted={() => setTasks(tasks.filter(t => !t.completed))}
          />

          {/* Task List */}
          <div className="space-y-4 min-h-[400px]">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={filteredTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <AnimatePresence mode="popLayout">
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -30, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8, x: 50 }}
                        transition={{ delay: index * 0.05 }}
                        layout
                      >
                        <TaskItem 
                          task={task} 
                          onDelete={(id) => setTasks(tasks.filter(t => t.id !== id))} 
                          onToggle={toggleTask}
                          onEdit={(id, text) => setTasks(tasks.map(t => t.id === id ? { ...t, text } : t))}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-32 cosmic-card border-dashed"
                    >
                      <ListTodo size={64} className="mx-auto text-white/10 mb-6" strokeWidth={1} />
                      <h3 className="text-2xl font-bold text-white/40">The sky is clear.</h3>
                      <p className="text-white/20 mt-2">No tasks found in this orbit.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </main>

      {/* Focus Mode Overlay */}
      <AnimatePresence>
        {isFocusMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-cosmic-bg/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center"
          >
            <button 
              onClick={() => setIsFocusMode(false)}
              className="absolute top-12 right-12 p-4 hover:bg-white/5 rounded-full transition-all"
            >
              <X size={32} />
            </button>
            
            <div className="max-w-2xl w-full space-y-12">
              <div className="space-y-4">
                <Sparkles className="text-primary mx-auto mb-8" size={64} />
                <h2 className="text-6xl font-black tracking-tighter">Focus Mode</h2>
                <p className="text-white/40 text-xl font-medium italic">"One mission at a time."</p>
              </div>

              {filteredTasks.length > 0 ? (
                <motion.div 
                  layoutId={filteredTasks[0].id}
                  className="cosmic-card p-12 text-left bg-gradient-to-br from-white/10 to-transparent"
                >
                  <span className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-4 block">Current Objective</span>
                  <h3 className="text-4xl font-bold mb-6">{filteredTasks[0].text}</h3>
                  <button 
                    onClick={() => toggleTask(filteredTasks[0].id)}
                    className="btn-cosmic w-full py-6 text-xl"
                  >
                    Complete Objective
                  </button>
                </motion.div>
              ) : (
                <div className="text-white/20 text-2xl font-bold">No active missions.</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="max-w-4xl mx-auto border-t border-white/10 pt-12 text-center pb-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          <div className="flex gap-12">
            <div className="text-center">
              <div className="text-3xl font-black glow-text text-primary">{stats.total}</div>
              <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-2">Missions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black glow-text text-secondary">{stats.completed}</div>
              <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-2">Completed</div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button onClick={() => {
              const data = JSON.stringify(tasks);
              const blob = new Blob([data], {type: 'application/json'});
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'taskly_cosmic_backup.json';
              link.click();
            }} className="p-4 hover:bg-white/5 rounded-2xl text-white/40 transition-all flex items-center gap-2">
              <Download size={20} /> <span className="font-bold text-sm uppercase">Backup</span>
            </button>
            <button className="p-4 hover:bg-white/5 rounded-2xl text-white/40 transition-all">
              <Settings size={20} />
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm font-black text-white/10 tracking-[0.5em] uppercase">Taskly Cosmic Pro v4.0</p>
          <div className="flex justify-center gap-6 text-[10px] font-bold text-white/20 uppercase tracking-widest">
            <a href="https://farmanullah1.github.io/My-Portfolio/" target="_blank" className="hover:text-primary transition-colors">Portfolio</a>
            <a href="https://farmanullah1.github.io/Taskly---Modern-Todo-Task-Manager-App/" target="_blank" className="hover:text-primary transition-colors">Live View</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
