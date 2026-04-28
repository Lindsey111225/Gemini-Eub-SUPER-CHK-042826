import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { VisualEffectType } from "../types";

interface VisualEffectsProps {
  type: VisualEffectType | null;
  onComplete: () => void;
}

export const VisualEffects: React.FC<VisualEffectsProps> = ({ type, onComplete }) => {
  useEffect(() => {
    if (type) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [type, onComplete]);

  if (!type) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      <AnimatePresence>
        {type === "ripple" && (
          <motion.div
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-64 h-64 border-8 border-blue-500 rounded-full" />
          </motion.div>
        )}

        {type === "glitch" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 1, 0] }}
            transition={{ duration: 0.5, repeat: 3 }}
            className="absolute inset-0 bg-red-500/20 mix-blend-overlay"
          />
        )}

        {type === "scanline" && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: "100%" }}
            transition={{ duration: 1.5, ease: "linear" }}
            className="absolute inset-x-0 h-1 bg-cyan-400 shadow-[0_0_20px_cyan]"
          />
        )}

        {type === "sparkle" && (
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: Math.random() * 100 + "%", y: "100%" }}
                animate={{ scale: [0, 1.5, 0], y: "-10%" }}
                transition={{ duration: 2, delay: Math.random() * 0.5 }}
                className="absolute w-2 h-2 bg-yellow-400 rotate-45"
              />
            ))}
          </div>
        )}

        {type === "shockwave" && (
          <motion.div
            initial={{ scale: 0, opacity: 1, filter: "invert(0)" }}
            animate={{ scale: 10, opacity: 0, filter: "invert(1)" }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center bg-white rounded-full"
          />
        )}

        {type === "datastream" && (
          <div className="absolute inset-0 flex justify-around opacity-30">
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: "-100%" }}
                animate={{ y: "100%" }}
                transition={{ duration: 1 + Math.random(), repeat: Infinity, ease: "linear" }}
                className="font-mono text-green-500 text-xs break-all w-2"
              >
                {Array.from({ length: 40 }).map(() => Math.floor(Math.random() * 2))}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
