import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  type: 'circle' | 'plus' | 'dna';
}

export const BackgroundParticles: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate static list on mount to avoid hydration mismatch
    const newParticles: Particle[] = Array.from({ length: 25 }).map((_, i) => {
      const types: ('circle' | 'plus' | 'dna')[] = ['circle', 'plus', 'circle'];
      const colors = [
        'bg-cyan-500/10 dark:bg-cyan-500/15',
        'bg-indigo-500/10 dark:bg-indigo-500/15',
        'bg-violet-500/10 dark:bg-violet-500/15'
      ];
      return {
        id: i,
        x: Math.random() * 100, // percentage
        y: Math.random() * 100, // percentage
        size: Math.random() * 8 + 4, // px
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: Math.random() * 20 + 20, // seconds
        delay: Math.random() * -20, // start immediately at random frame
        type: types[Math.floor(Math.random() * types.length)]
      };
    });
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Dynamic Floating Nodes */}
      {particles.map((p) => {
        if (p.type === 'plus') {
          return (
            <motion.div
              key={p.id}
              initial={{ x: `${p.x}%`, y: '110vh', opacity: 0, rotate: 0 }}
              animate={{
                y: '-10vh',
                opacity: [0, 0.7, 0.7, 0],
                rotate: 360
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: 'linear'
              }}
              style={{
                position: 'absolute',
                left: `${p.x}%`,
                width: p.size * 1.5,
                height: p.size * 1.5
              }}
              className="text-cyan-500/10 dark:text-cyan-500/20 flex items-center justify-center font-bold text-sm"
            >
              +
            </motion.div>
          );
        }

        return (
          <motion.div
            key={p.id}
            initial={{ x: `${p.x}%`, y: '110vh', opacity: 0 }}
            animate={{
              y: '-10vh',
              opacity: [0, 0.8, 0.8, 0],
              x: [`${p.x}%`, `${p.x + (Math.random() * 10 - 5)}%`, `${p.x}%`]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeInOut'
            }}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%'
            }}
            className={`${p.color} blur-[1px]`}
          />
        );
      })}

      {/* Cyber Grid background layout dots */}
      <div className="absolute inset-0 bg-grid-dots opacity-70"></div>
    </div>
  );
};
export default BackgroundParticles;
