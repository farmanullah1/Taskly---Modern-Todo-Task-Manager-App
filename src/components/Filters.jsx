import React from 'react';
import { cn } from '../utils/cn';

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
    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8 p-1">
      <div className="flex flex-col gap-4 w-full sm:w-auto">
        <div className="flex gap-2 p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl w-fit">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                filterStatus === status 
                  ? "bg-white dark:bg-slate-700 text-primary shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold border transition-all",
                filterCategory === cat
                  ? "bg-primary/10 border-primary text-primary"
                  : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onClearCompleted}
        className="text-sm font-medium text-slate-400 hover:text-red-500 transition-colors whitespace-nowrap"
      >
        Clear Completed
      </button>
    </div>
  );
}
