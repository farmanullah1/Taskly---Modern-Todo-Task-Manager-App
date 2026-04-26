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
import { Sun, Moon, Layout, CheckCircle2, ListTodo, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import useSound from 'use-sound';

import { TaskInput } from './components/TaskInput';
import { TaskItem } from './components/TaskItem';
import { Filters } from './components/Filters';
import { ProgressBar } from './components/ProgressBar';
import { SearchBar } from './components/SearchBar';
import { useLocalStorage } from './hooks/useLocalStorage';
import { cn } from './utils/cn';

function App() {
  const [tasks, setTasks] = useLocalStorage('taskly-tasks', []);
  const [darkMode, setDarkMode] = useLocalStorage('taskly-dark-mode', true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sound effects (using standard web audio if files aren't provided, 
  // but for now we'll just define the hooks. Note: actual mp3s would need to be in public folder)
  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3', { volume: 0.5 });
  const [playComplete] = useSound('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', { volume: 0.5 });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

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
              colors: ['#6366f1', '#ec4899', '#8b5cf6']
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
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, text: newText } : t
    ));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(t => !t.completed));
  };

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

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const statusMatch = filterStatus === 'All' || 
        (filterStatus === 'Active' && !task.completed) || 
        (filterStatus === 'Completed' && task.completed);
      
      const categoryMatch = filterCategory === 'All' || 
        task.category === filterCategory;

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

  // All completed celebration
  useEffect(() => {
    if (tasks.length > 0 && tasks.every(t => t.completed)) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#22c55e', '#6366f1', '#fbbf24']
      });
      playComplete();
    }
  }, [tasks.length, tasks.every(t => t.completed)]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40 relative group"
          >
            <Layout className="text-white" size={32} />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-white dark:border-slate-900 group-hover:scale-125 transition-transform" />
          </motion.div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Taskly</h1>
            <p className="text-text-muted text-sm font-semibold tracking-wide flex items-center gap-1">
              PRO EDITION <Sparkles size={14} className="text-amber-400" />
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setDarkMode(!darkMode)}
          className="p-4 glass-card text-slate-500 hover:text-primary relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform" />
          {darkMode ? <Sun size={24} className="relative z-10" /> : <Moon size={24} className="relative z-10" />}
        </motion.button>
      </header>

      <ProgressBar progress={stats.progress} />

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <TaskInput onAdd={addTask} />

      <Filters 
        filterStatus={filterStatus} 
        setFilterStatus={setFilterStatus}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        onClearCompleted={clearCompleted}
      />

      {/* Task List */}
      <div className="flex-1">
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
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      variants={itemVariants}
                      layout
                      exit={{ opacity: 0, scale: 0.8, x: 50 }}
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
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-24 glass-card border-dashed"
                  >
                    <div className="inline-block p-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-6">
                      <ListTodo size={64} strokeWidth={1} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300">No tasks matched your search</h3>
                    <p className="text-slate-400 mt-2 font-medium">Try adjusting your filters or search terms.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800/50 text-center">
        <div className="flex justify-center gap-6 mb-4">
          <div className="text-center">
            <div className="text-xl font-bold text-primary">{stats.total}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Created</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-500">{stats.completed}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Finished</div>
          </div>
        </div>
        <p className="text-sm text-text-muted font-medium">Taskly Pro v2.0 • {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
