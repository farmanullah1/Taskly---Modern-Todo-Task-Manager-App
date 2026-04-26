import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';

const themes = [
  { name: 'Default', start: '#7C3AED', end: '#06B6D4' }, // Purple -> Cyan
  { name: 'Sunset', start: '#F97316', end: '#EF4444' }, // Orange -> Red
  { name: 'Ocean', start: '#0EA5E9', end: '#14B8A6' }, // Blue -> Teal
  { name: 'Neon', start: '#22C55E', end: '#4ADE80' }, // Green
  { name: 'Royal', start: '#6366F1', end: '#A855F7' }, // Indigo -> Purple
  { name: 'Pink', start: '#EC4899', end: '#F472B6' }, // Pink
  { name: 'Mono', start: '#475569', end: '#94A3B8' }, // Monochrome
  { name: 'Gold', start: '#F59E0B', end: '#EAB308' }, // Gold
];

export function ThemeSwitcher({ currentTheme, onThemeChange }) {
  return (
    <div className="flex flex-col gap-3 glass-card p-4">
      <div className="flex items-center gap-2 mb-1">
        <Palette size={16} className="text-primary" />
        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Select Skin</span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {themes.map((theme) => (
          <motion.button
            key={theme.name}
            whileHover={{ scale: 1.15, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onThemeChange(theme)}
            className={cn(
              "w-8 h-8 rounded-full transition-all border-2 flex items-center justify-center",
              currentTheme?.name === theme.name 
                ? "border-primary shadow-lg shadow-primary/20 scale-110" 
                : "border-transparent hover:border-slate-300 dark:hover:border-slate-600"
            )}
            style={{ 
              background: `linear-gradient(135deg, ${theme.start}, ${theme.end})` 
            }}
            title={theme.name}
          >
            {currentTheme?.name === theme.name && (
              <Sparkles size={12} className="text-white" />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
