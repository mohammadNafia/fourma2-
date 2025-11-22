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
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-20 right-4 z-50 flex items-center gap-2 rounded-lg border border-green-500/50 bg-green-500/20 px-4 py-2 text-sm text-green-400 shadow-[0_10px_40px_rgba(0,0,0,0.3)] backdrop-blur-md"
        >
          <Check className="h-4 w-4" />
          <span>Saved</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

