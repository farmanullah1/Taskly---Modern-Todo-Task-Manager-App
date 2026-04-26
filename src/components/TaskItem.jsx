import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Check, 
  Trash2, 
  GripVertical, 
  Edit2, 
  X, 
  Save, 
  Calendar, 
  StickyNote,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

export function TaskItem({ task, onDelete, onToggle, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleEdit = () => {
    if (editText.trim()) {
      onEdit(task.id, editText);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative transition-all duration-300 mb-4",
        isDragging ? "z-50" : "z-10"
      )}
    >
      <div className={cn(
        "cosmic-card p-6 flex flex-col gap-4 overflow-hidden relative",
        isDragging && "opacity-50 scale-[1.02] border-primary/50 bg-primary/10",
        task.completed && "opacity-60 grayscale-[0.5]"
      )}>
        {/* Glow Background Effect */}
        <div className={cn(
          "absolute -right-20 -top-20 w-40 h-40 rounded-full blur-[60px] transition-all duration-1000 opacity-0 group-hover:opacity-20",
          task.priority === 'high' ? "bg-red-500" : task.priority === 'medium' ? "bg-amber-500" : "bg-blue-500"
        )} />

        <div className="flex items-center gap-4 relative z-10">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 text-white/10 hover:text-primary transition-colors shrink-0"
          >
            <GripVertical size={20} />
          </button>

          <button
            onClick={() => onToggle(task.id)}
            className={cn(
              "w-8 h-8 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 shrink-0",
              task.completed 
                ? "bg-gradient-to-br from-primary to-secondary border-transparent text-white shadow-lg shadow-primary/40" 
                : "border-white/10 hover:border-primary/50 bg-white/5"
            )}
          >
            <AnimatePresence mode="wait">
              {task.completed ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 45 }}
                >
                  <Check size={16} strokeWidth={4} />
                </motion.div>
              ) : (
                <motion.div
                  key="circle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-1.5 h-1.5 rounded-full bg-white/20"
                />
              )}
            </AnimatePresence>
          </button>

          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
                    className="w-full bg-white/5 rounded-xl px-4 py-2 border-b-2 border-primary outline-none font-bold text-white"
                  />
                  <div className="flex gap-1">
                    <button onClick={handleEdit} className="text-green-400 p-2 hover:bg-white/5 rounded-xl transition-all"><Save size={18} /></button>
                    <button onClick={() => setIsEditing(false)} className="text-red-400 p-2 hover:bg-white/5 rounded-xl transition-all"><X size={18} /></button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "text-xl font-bold tracking-tight transition-all duration-500",
                      task.completed ? "text-white/30 line-through decoration-primary/50" : "text-white"
                    )}>
                      {task.text}
                    </span>
                    <span className={cn(
                      "text-[9px] px-2 py-1 rounded-full font-black uppercase tracking-widest border transition-all",
                      task.priority === 'high' ? "border-red-500/20 text-red-400 bg-red-500/5" : 
                      task.priority === 'medium' ? "border-amber-500/20 text-amber-400 bg-amber-500/5" : 
                      "border-blue-500/20 text-blue-400 bg-blue-500/5"
                    )}>
                      {task.priority}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2 text-[10px] font-bold uppercase tracking-widest text-white/30">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                      {task.category}
                    </div>
                    {task.dueDate && (
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-secondary/60" />
                        {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)} 
                className="p-3 text-white/20 hover:text-primary hover:bg-white/5 rounded-2xl transition-all"
              >
                <Edit2 size={18} />
              </button>
            )}
            <button 
              onClick={() => onDelete(task.id)} 
              className="p-3 text-white/20 hover:text-red-500 hover:bg-white/5 rounded-2xl transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {task.notes && !isEditing && (
          <div className="mt-4 pt-4 border-t border-white/5 flex gap-3">
            <StickyNote size={14} className="text-white/10 shrink-0 mt-0.5" />
            <p className="text-sm text-white/40 leading-relaxed font-medium italic">
              {task.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
