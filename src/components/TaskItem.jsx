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
  ChevronDown, 
  ChevronUp,
  StickyNote
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

export function TaskItem({ task, onDelete, onToggle, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleEdit();
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(task.text);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group mb-4 tilt-card relative",
        isDragging && "z-50"
      )}
    >
      <div className={cn(
        "tilt-card-inner glass-card p-4 flex flex-col gap-3",
        isDragging && "opacity-50 scale-105 rotate-1",
        task.completed && "opacity-80"
      )}>
        <div className="flex items-center gap-3">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-primary transition-colors shrink-0"
          >
            <GripVertical size={20} />
          </button>

          {/* Complete Toggle */}
          <button
            onClick={() => onToggle(task.id)}
            className={cn(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0",
              task.completed 
                ? "bg-green-500 border-green-500 text-white" 
                : "border-slate-300 dark:border-slate-600 hover:border-primary"
            )}
          >
            {task.completed && <Check size={14} strokeWidth={3} />}
          </button>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="flex items-center gap-2"
                >
                  <input
                    autoFocus
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent border-b border-primary outline-none py-1 text-lg"
                  />
                  <div className="flex items-center gap-1">
                    <button onClick={handleEdit} className="p-1 text-green-500 hover:bg-green-500/10 rounded">
                      <Save size={18} />
                    </button>
                    <button onClick={() => setIsEditing(false)} className="p-1 text-red-500 hover:bg-red-500/10 rounded">
                      <X size={18} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col"
                >
                  <span className={cn(
                    "text-lg font-semibold truncate transition-all duration-300",
                    task.completed && "line-through text-slate-400 dark:text-slate-500"
                  )}>
                    {task.text}
                  </span>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                      task.priority === 'high' && "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
                      task.priority === 'medium' && "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
                      task.priority === 'low' && "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    )}>
                      {task.priority}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      {task.category}
                    </span>
                    {task.dueDate && (
                      <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        <Calendar size={12} />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            {task.notes && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isExpanded ? "text-primary bg-primary/10" : "text-slate-400 hover:text-primary hover:bg-primary/10"
                )}
              >
                <StickyNote size={18} />
              </button>
            )}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-slate-400 hover:text-primary transition-colors hover:bg-primary/10 rounded-lg"
              >
                <Edit2 size={18} />
              </button>
            )}
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors hover:bg-red-500/10 rounded-lg"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Expanded Notes */}
        <AnimatePresence>
          {isExpanded && task.notes && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-700/50">
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">
                  {task.notes}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
