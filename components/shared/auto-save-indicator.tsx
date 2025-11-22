"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

export function AutoSaveIndicator({ saved }: { saved: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (saved) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [saved]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed top-20 right-4 z-50 flex items-center gap-2.5 rounded-2xl border border-[--aqua-teal]/50 bg-[--aqua-teal]/10 px-5 py-3 text-sm font-medium text-[--aqua-teal] shadow-glow-aqua shadow-[0_12px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl backdrop-saturate-180"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
          >
            <Check className="h-4 w-4" />
          </motion.div>
          <span>Saved</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


