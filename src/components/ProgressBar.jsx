import React from 'react';
import { motion } from 'framer-motion';

export function ProgressBar({ progress }) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Progress</span>
        <span className="text-lg font-bold text-primary">{Math.round(progress)}%</span>
      </div>
      <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-300/30 dark:border-slate-700/30">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="progress-bar-fill relative"
        >
          <div className="absolute inset-0 shimmer" />
        </motion.div>
      </div>
    </div>
  );
}
