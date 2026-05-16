import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export default function CursorText() {
  const [text, setText] = useState<string | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 300 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      
      // Look for data-cursor-text attribute in target or its parents
      let current: HTMLElement | null = target;
      let foundText: string | null = null;
      
      while (current && current !== document.body) {
        const t = current.getAttribute('data-cursor-text');
        if (t) {
          foundText = t;
          break;
        }
        current = current.parentElement;
      }
      
      setText(foundText);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        x: cursorX,
        y: cursorY,
        pointerEvents: 'none',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      className="hidden lg:flex"
    >
      <motion.div
        animate={{
          scale: text ? 1 : 0,
          opacity: text ? 1 : 0,
          y: text ? -40 : -20,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="bg-brand-primary/95 backdrop-blur-md text-white px-3 py-1.5 rounded-xl shadow-2xl border border-white/20 whitespace-nowrap overflow-hidden flex items-center justify-center origin-bottom"
      >
        <span className="text-[9px] font-black uppercase tracking-[0.2em] leading-none">
          {text}
        </span>
      </motion.div>
      
      <motion.div 
        animate={{
          scale: text ? 2 : 1,
          opacity: text ? 0.3 : 0.15
        }}
        className="w-6 h-6 border-2 border-brand-primary rounded-full absolute transition-colors"
      />
    </motion.div>
  );
}
