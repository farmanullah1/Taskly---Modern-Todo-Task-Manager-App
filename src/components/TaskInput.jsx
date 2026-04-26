import React, { useState } from 'react';
import { Plus, Tag, Flag, Calendar, AlignLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function TaskInput({ onAdd }) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('Personal');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd({
        text: text.trim(),
        category,
        priority,
        dueDate,
        notes: notes.trim(),
      });
      setText('');
      setNotes('');
      setDueDate('');
      setIsExpanded(false);
    }
  };

  return (
    <motion.div
      layout
      className="glass-card p-6 mb-8 overflow-hidden"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="What needs to be done?"
            className="input-field text-lg"
          />
          <button type="submit" className="btn-primary px-6 shadow-lg shadow-primary/20 shrink-0">
            <Plus size={24} />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-col gap-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Tag size={12} /> Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-slate-100 dark:bg-slate-800 rounded-lg p-2 text-sm outline-none border border-transparent focus:border-primary/50 transition-all"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Work">Work</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Health">Health</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Flag size={12} /> Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="bg-slate-100 dark:bg-slate-800 rounded-lg p-2 text-sm outline-none border border-transparent focus:border-primary/50 transition-all"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Calendar size={12} /> Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="bg-slate-100 dark:bg-slate-800 rounded-lg p-2 text-sm outline-none border border-transparent focus:border-primary/50 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <AlignLeft size={12} /> Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add some details..."
                  className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 text-sm outline-none border border-transparent focus:border-primary/50 transition-all min-h-[80px] resize-none"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center gap-1"
              >
                Show Less <ChevronUp size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {!isExpanded && (
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 w-fit"
          >
            Add details <ChevronDown size={14} />
          </button>
        )}
      </form>
    </motion.div>
  );
}
