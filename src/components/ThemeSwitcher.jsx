import React from 'react';
import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';
import { cn } from '../utils/cn';

const themes = [
  { name: 'Indigo', color: '#6366f1', hover: '#4f46e5' },
  { name: 'Rose', color: '#f43f5e', hover: '#e11d48' },
  { name: 'Emerald', color: '#10b981', hover: '#059669' },
  { name: 'Amber', color: '#f59e0b', hover: '#d97706' },
  { name: 'Violet', color: '#8b5cf6', hover: '#7c3aed' },
  { name: 'Sky', color: '#0ea5e9', hover: '#0284c7' },
];

export function ThemeSwitcher({ currentTheme, onThemeChange }) {
  return (
    <div className="flex items-center gap-3 glass-card p-2 px-4 w-fit">
      <Palette size={18} className="text-slate-400" />
      <div className="flex gap-2">
        {themes.map((theme) => (
          <motion.button
            key={theme.name}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onThemeChange(theme)}
            className={cn(
              "w-5 h-5 rounded-full transition-shadow",
              currentTheme?.name === theme.name ? "ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-900" : ""
            )}
            style={{ backgroundColor: theme.color }}
            title={theme.name}
          />
        ))}
      </div>
    </div>
  );
}
