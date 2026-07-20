"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface AccordionItem {
  id: string | number;
  title: string;
  subtitle?: string;
  content: string | React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

export default function Accordion({ items, allowMultiple = false }: AccordionProps) {
  const [activeIds, setActiveIds] = useState<(string | number)[]>([]);

  const toggleItem = (id: string | number) => {
    if (allowMultiple) {
      setActiveIds((prev) =>
        prev.includes(id) ? prev.filter((activeId) => activeId !== id) : [...prev, id]
      );
    } else {
      setActiveIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const isOpen = activeIds.includes(item.id);
        return (
          <div
            key={item.id}
            className="border border-gray-200/60 bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-350"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center justify-between p-5 text-left font-sans hover:bg-brand-warm-bg/50 transition-colors"
            >
              <div className="space-y-1">
                <span className="text-base font-bold text-brand-dark-text block">
                  {item.title}
                </span>
                {item.subtitle && (
                  <span className="text-xs text-gray-500 font-medium tracking-wide">
                    {item.subtitle}
                  </span>
                )}
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="shrink-0 p-1 rounded-full bg-brand-forest/5 text-brand-forest"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="p-5 pt-0 border-t border-gray-100 text-sm text-gray-600 leading-relaxed font-sans">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
