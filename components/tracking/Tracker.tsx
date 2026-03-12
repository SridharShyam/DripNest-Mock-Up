'use client';

import { Check, Clock, MapPin, Package, Truck, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface TrackerProps {
  order: any;
}

const STATUS_STEPS = [
  { status: 'ORDER_PLACED', label: 'Order Placed' },
  { status: 'CONFIRMED', label: 'Confirmed' },
  { status: 'PROCESSING', label: 'Processing' },
  { status: 'PACKED', label: 'Packed' },
  { status: 'HANDED_TO_COURIER', label: 'Handed to Courier' },
  { status: 'IN_TRANSIT', label: 'In Transit' },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { status: 'DELIVERED', label: 'Delivered' },
];

const STATUS_ICONS: Record<string, any> = {
  ORDER_PLACED: Package,
  CONFIRMED: Check,
  PROCESSING: Clock,
  PACKED: Package,
  HANDED_TO_COURIER: Truck,
  IN_TRANSIT: MapPin,
  OUT_FOR_DELIVERY: Truck,
  DELIVERED: Check,
  FAILED_DELIVERY: Package,
  RETURNED: Package,
};

export function Tracker({ order }: TrackerProps) {
  const [showItems, setShowItems] = useState(false);
  const currentStatusIndex = STATUS_STEPS.findIndex(s => s.status === order.currentStatus);

  return (
    <div className="space-y-12">
      {/* Header Info */}
      <div className="bg-white border border-neutral-100 rounded-sm p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between gap-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2">Order Information</p>
          <h2 className="font-serif text-3xl font-bold mb-4 font-mono">#DN-{order.id.slice(0, 8).toUpperCase()}</h2>
          <div className="space-y-1 text-sm">
            <p><span className="text-neutral-500">Placed on:</span> <span className="font-bold">{format(new Date(order.createdAt), 'MMMM dd, yyyy')}</span></p>
            <p><span className="text-neutral-500">Items:</span> <span className="font-bold">{order.items.length} products</span></p>
          </div>
        </div>

        <div className="md:text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2">Tracking Details</p>
          {order.carrierName ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold text-violet">{order.carrierName}</p>
                <p className="text-xs font-mono text-neutral-500">{order.trackingNumber}</p>
              </div>
              {order.estimatedDelivery && (
                <div className="bg-mist p-3 rounded-sm inline-block md:ml-auto">
                  <p className="text-[10px] font-black uppercase tracking-widest text-violet mb-1">Estimated Delivery</p>
                  <p className="text-lg font-black text-violet">{format(new Date(order.estimatedDelivery), 'MMM do, yyyy')}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm font-medium text-neutral-500 italic">Tracking info will be available once shipped.</p>
          )}
        </div>
      </div>

      {/* Visual Stepper */}
      <div className="relative pt-8 pb-12 px-4 overflow-x-auto overflow-y-hidden">
        <div className="min-w-[800px] flex justify-between relative">
          {/* Connector Line Base */}
          <div className="absolute top-5 left-0 w-full h-1 bg-neutral-100 -z-10" />
          
          {/* Connector Line Progress */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(currentStatusIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
            className="absolute top-5 left-0 h-1 bg-violet -z-10"
            transition={{ duration: 1, ease: "easeOut" }}
          />

          {STATUS_STEPS.map((step, index) => {
            const isCompleted = index < currentStatusIndex || order.currentStatus === 'DELIVERED';
            const isCurrent = step.status === order.currentStatus;
            
            return (
              <div key={step.status} className="flex flex-col items-center gap-4 w-1/8 text-center px-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                  isCompleted 
                    ? 'bg-violet border-violet text-white' 
                    : isCurrent
                      ? 'bg-white border-violet text-violet ring-4 ring-violet/10 scale-110'
                      : 'bg-white border-neutral-200 text-neutral-300'
                }`}>
                  {isCompleted ? <Check className="w-5 h-5 stroke-[3px]" /> : index + 1}
                  {isCurrent && (
                    <motion.div 
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 rounded-full bg-violet/20 -z-10"
                    />
                  )}
                </div>
                <p className={`text-[10px] font-black uppercase tracking-widest max-w-[80px] leading-tight ${
                  isCompleted || isCurrent ? 'text-black' : 'text-neutral-400'
                }`}>
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline & Order Items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <h3 className="font-serif text-2xl font-bold mb-8">Detailed History</h3>
          <div className="space-y-0 relative before:absolute before:top-2 before:bottom-2 before:left-6 before:w-[2px] before:bg-neutral-100">
            {order.trackingEvents.map((event: any, index: number) => {
              const Icon = STATUS_ICONS[event.status] || Package;
              return (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={event.id} 
                  className="relative pl-16 pb-10 last:pb-0"
                >
                  <div className={`absolute left-4 top-2 w-4 h-4 rounded-full border-2 bg-white z-10 ${
                    index === 0 ? 'border-violet' : 'border-neutral-200'
                  }`} />
                  
                  <div className={`p-6 rounded-sm border ${index === 0 ? 'border-violet/20 bg-mist' : 'border-neutral-100 bg-white'}`}>
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-violet text-white' : 'bg-neutral-100 text-neutral-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold">{event.title}</h4>
                      </div>
                      <span className="text-xs font-medium text-neutral-400">
                        {format(new Date(event.timestamp), 'MMM dd, h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 mb-2 pl-11">{event.description}</p>
                    {event.location && (
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-11">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white border border-neutral-100 rounded-sm p-8">
            <button 
              onClick={() => setShowItems(!showItems)}
              className="w-full flex justify-between items-center group"
            >
              <h3 className="font-serif text-2xl font-bold">Order Items</h3>
              {showItems ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            <AnimatePresence>
              {showItems && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-8 space-y-6">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-20 bg-mist rounded-sm overflow-hidden flex-shrink-0">
                          <img src={item.productImage} className="w-full h-full object-cover" alt={item.productName} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm leading-tight mb-1">{item.productName}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                            {item.size || 'OS'} / {item.colour || 'N/A'} × {item.qty}
                          </p>
                        </div>
                        <p className="font-black text-sm">{formatPrice(item.priceAtPurchase)}</p>
                      </div>
                    ))}
                    <div className="pt-6 border-t border-neutral-100 flex justify-between items-center">
                      <span className="text-sm font-bold uppercase tracking-widest text-neutral-400">Total Charged</span>
                      <span className="text-xl font-black">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-neutral-900 text-white rounded-sm p-8 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-violet/30 transition-colors" />
            <h3 className="font-serif text-2xl font-bold mb-4">Need Help?</h3>
            <p className="text-neutral-400 text-sm mb-8 leading-relaxed">Something wrong with your order? Our support team is available 24/7 to assist you with tracking, returns, or any questions.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="violet" className="flex-1 font-bold uppercase tracking-widest text-xs py-4">Contact Support</Button>
              <Button variant="outline" className="flex-1 font-bold uppercase tracking-widest text-xs py-4 border-white/20 hover:bg-white hover:text-black">Returns Portal</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
