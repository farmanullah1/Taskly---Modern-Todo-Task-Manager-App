import React from 'react';
import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

export function SearchBar({ value, onChange }) {
  return (
    <div className="relative mb-6">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        <Search size={18} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search tasks..."
        className="w-full pl-12 pr-12 py-3 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
