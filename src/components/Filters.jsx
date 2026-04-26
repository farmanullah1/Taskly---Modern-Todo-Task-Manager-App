import React from 'react';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

export function Filters({ 
  filterStatus, 
  setFilterStatus, 
  filterCategory, 
  setFilterCategory,
  onClearCompleted 
}) {
  const statuses = ['All', 'Active', 'Completed'];
  const categories = ['All', 'Personal', 'Work', 'Shopping', 'Health'];

  return (
    <div className="flex flex-col gap-6 mb-8 px-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex gap-1.5 p-1.5 cosmic-card bg-white/5 border-white/5 rounded-[20px] w-fit">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                "relative px-6 py-2 rounded-[14px] text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                filterStatus === status 
                  ? "text-white" 
                  : "text-white/30 hover:text-white/60"
              )}
            >
              {filterStatus === status && (
                <motion.div 
                  layoutId="status-pill"
                  className="absolute inset-0 bg-white/10 rounded-[14px] shadow-sm shadow-white/5"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{status}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onClearCompleted}
          className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-red-400 transition-colors pl-2"
        >
          Clear Finished Missions
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-500",
              filterCategory === cat
                ? "bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                : "border-white/5 text-white/20 hover:border-white/20 hover:text-white/40"
            )}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
