import React, { useState } from 'react';
import { Plus, Tag, Flag, Calendar, AlignLeft, ChevronDown, ChevronUp, Sparkles, Rocket } from 'lucide-react';
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
      className="cosmic-card p-2 md:p-3 mb-8 bg-white/5 border-white/10"
    >
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex gap-2 p-2">
          <div className="relative flex-1 group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2">
              <Sparkles className="text-primary/40 group-focus-within:text-primary transition-colors" size={20} />
            </div>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder="Deploy a new mission..."
              className="w-full pl-16 pr-6 py-4 bg-white/5 border border-transparent focus:border-primary/20 rounded-[24px] outline-none transition-all font-bold text-lg text-white"
            />
          </div>
          <button 
            type="submit" 
            disabled={!text.trim()}
            className="btn-cosmic px-10 rounded-[24px] disabled:opacity-50 disabled:grayscale disabled:scale-100 shadow-2xl"
          >
            <Plus size={24} strokeWidth={3} />
            <span className="hidden sm:inline">Launch</span>
          </button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6 pt-2 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] flex items-center gap-2 pl-1">
                      <Tag size={12} className="text-primary" /> Orbit/Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-white/5 rounded-2xl p-4 text-sm font-bold outline-none border border-white/5 focus:border-primary/50 transition-all text-white/80"
                    >
                      <option value="Personal">Personal</option>
                      <option value="Work">Work</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Health">Health</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] flex items-center gap-2 pl-1">
                      <Flag size={12} className="text-secondary" /> Priority Level
                    </label>
                    <div className="flex gap-2">
                      {['low', 'medium', 'high'].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={cn(
                            "flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all",
                            priority === p 
                              ? "bg-primary/20 border-primary text-white shadow-lg shadow-primary/20" 
                              : "bg-white/5 border-white/5 text-white/30 hover:bg-white/10"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] flex items-center gap-2 pl-1">
                      <Calendar size={12} className="text-accent" /> Completion Date
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full bg-white/5 rounded-2xl p-4 text-sm font-bold outline-none border border-white/5 focus:border-primary/50 transition-all text-white/80"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] flex items-center gap-2 pl-1">
                    <AlignLeft size={12} className="text-white/40" /> Mission Briefing / Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe the mission details here..."
                    className="w-full bg-white/5 rounded-2xl p-6 text-sm font-medium outline-none border border-white/5 focus:border-primary/50 transition-all min-h-[120px] resize-none text-white/70"
                  />
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <p className="text-[10px] font-bold text-white/20 italic italic">
                    All data is persisted in your local cosmic storage.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="text-[10px] font-black text-white/20 hover:text-white transition-colors flex items-center gap-2 uppercase tracking-[0.2em]"
                  >
                    Hide Details <ChevronUp size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
}
