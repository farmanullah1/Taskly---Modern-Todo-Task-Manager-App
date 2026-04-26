import React from 'react';
import { motion } from 'framer-motion';

export function CategoryStats({ tasks }) {
  const categories = ['Personal', 'Work', 'Shopping', 'Health'];
  
  const stats = categories.map(cat => {
    const catTasks = tasks.filter(t => t.category === cat);
    const completed = catTasks.filter(t => t.completed).length;
    const total = catTasks.length;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    return { name: cat, total, completed, progress };
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-4 flex flex-col items-center text-center"
        >
          <div className="relative w-12 h-12 mb-3">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-slate-100 dark:text-slate-800"
              />
              <motion.circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray="125.6"
                initial={{ strokeDashoffset: 125.6 }}
                animate={{ strokeDashoffset: 125.6 - (125.6 * stat.progress) / 100 }}
                className="text-primary"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
              {Math.round(stat.progress)}%
            </div>
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.name}</span>
          <span className="text-[10px] text-slate-400 mt-1">{stat.completed}/{stat.total} Done</span>
        </motion.div>
      ))}
    </div>
  );
}
