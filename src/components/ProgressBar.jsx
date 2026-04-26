import React from 'react';
import { motion } from 'framer-motion';

export function ProgressBar({ progress }) {
  return (
    <div className="w-full">
      <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative group">
        <div className="absolute inset-0 shimmer-bg opacity-30" />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="h-full relative rounded-full"
          style={{ 
            background: 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 50%, #06B6D4 100%)',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)'
          }}
        >
          <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/20 blur-md translate-x-1/2" />
        </motion.div>
      </div>
    </div>
  );
}
