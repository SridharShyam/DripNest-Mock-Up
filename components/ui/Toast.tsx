'use client';

import { AnimatePresence, motion } from "framer-motion";
import { useToast, ToastType } from "@/hooks/useToast";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red" />;
      case 'info':
        return <Info className="w-5 h-5 text-violet" />;
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={cn(
              "flex items-center gap-3 px-4 py-3 bg-white rounded-md shadow-lg border pointer-events-auto min-w-[300px]",
              toast.type === 'success' && "border-green",
              toast.type === 'error' && "border-red",
              toast.type === 'info' && "border-violet"
            )}
          >
            {getIcon(toast.type)}
            <p className="text-sm font-medium text-black flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-black transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
