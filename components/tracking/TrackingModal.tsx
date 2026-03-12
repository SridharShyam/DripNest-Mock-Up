'use client';

import { X } from 'lucide-react';
import { Tracker } from './Tracker';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

export function TrackingModal({ isOpen, onClose, orderId }: TrackingModalProps) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && orderId) {
      const fetchTracking = async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/orders/${orderId}/tracking`);
          if (res.ok) {
            const data = await res.json();
            setOrder(data);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchTracking();
    }
  }, [isOpen, orderId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl max-h-[90vh] bg-cream rounded-sm shadow-2xl overflow-y-auto"
          >
            <div className="sticky top-0 z-20 bg-cream/80 backdrop-blur-md px-8 py-6 border-b border-neutral-100 flex justify-between items-center">
              <div>
                <h2 className="font-serif text-3xl font-bold tracking-tight">Track Your Order</h2>
                {order && <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mt-1">Order #DN-{order.id.slice(0, 8).toUpperCase()}</p>}
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8">
              {loading ? (
                <div className="h-96 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-mist border-t-violet rounded-full animate-spin" />
                </div>
              ) : order ? (
                <Tracker order={order} />
              ) : (
                <div className="h-96 flex flex-col items-center justify-center gap-4">
                  <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Failed to load tracking data</p>
                  <button onClick={onClose} className="text-violet underline text-sm font-bold">Close</button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
