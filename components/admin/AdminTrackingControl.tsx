'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Truck, MapPin, Calendar, Plus, Check, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface AdminTrackingControlProps {
  order: any;
  onUpdate: () => void;
}

const STATUS_OPTIONS = [
  'ORDER_PLACED',
  'CONFIRMED',
  'PROCESSING',
  'PACKED',
  'HANDED_TO_COURIER',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'FAILED_DELIVERY',
  'RETURNED'
];

export function AdminTrackingControl({ order, onUpdate }: AdminTrackingControlProps) {
  const [loading, setLoading] = useState(false);
  const [carrierInfo, setCarrierInfo] = useState({
    carrierName: order.carrierName || '',
    trackingNumber: order.trackingNumber || '',
    estimatedDelivery: order.estimatedDelivery ? format(new Date(order.estimatedDelivery), 'yyyy-MM-dd') : '',
  });

  const [newEvent, setNewEvent] = useState({
    status: 'IN_TRANSIT',
    title: '',
    description: '',
    location: '',
  });

  const updateCarrier = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/carrier`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carrierInfo),
      });
      if (res.ok) onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/tracking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });
      if (res.ok) {
        setNewEvent({ status: 'IN_TRANSIT', title: '', description: '', location: '' });
        onUpdate();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Carrier Info Section */}
      <div className="bg-white border border-neutral-100 rounded-sm p-8 shadow-sm">
        <h3 className="font-serif text-2xl font-bold mb-6 flex items-center gap-3">
          <Truck className="w-6 h-6 text-violet" /> Shipment & Carrier Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Carrier Name</label>
            <input
              type="text"
              value={carrierInfo.carrierName}
              onChange={(e) => setCarrierInfo({ ...carrierInfo, carrierName: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-sm focus:outline-none focus:border-violet"
              placeholder="e.g. FedEx, Blue Dart"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Tracking Number</label>
            <input
              type="text"
              value={carrierInfo.trackingNumber}
              onChange={(e) => setCarrierInfo({ ...carrierInfo, trackingNumber: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-sm focus:outline-none focus:border-violet"
              placeholder="e.g. FDX12345678"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Est. Delivery</label>
            <input
              type="date"
              value={carrierInfo.estimatedDelivery}
              onChange={(e) => setCarrierInfo({ ...carrierInfo, estimatedDelivery: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-sm focus:outline-none focus:border-violet"
            />
          </div>
        </div>
        <Button 
          onClick={updateCarrier} 
          disabled={loading}
          variant="violet"
          className="font-bold uppercase tracking-widest text-xs py-4 px-8"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />} 
          Update Shipment Info
        </Button>
      </div>

      {/* Add New Event Section */}
      <div className="bg-white border border-neutral-100 rounded-sm p-8 shadow-sm">
        <h3 className="font-serif text-2xl font-bold mb-6 flex items-center gap-3">
          <Plus className="w-6 h-6 text-violet" /> Add Tracking Event
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Event Status</label>
            <select
              value={newEvent.status}
              onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-sm focus:outline-none focus:border-violet"
            >
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Location (Optional)</label>
            <input
              type="text"
              value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-sm focus:outline-none focus:border-violet"
              placeholder="e.g. Mumbai Sorting Hub"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Event Title</label>
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-sm focus:outline-none focus:border-violet"
              placeholder="e.g. Arrived at Facility"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Description</label>
            <textarea
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-sm focus:outline-none focus:border-violet min-h-[100px]"
              placeholder="Provide more context for the customer..."
            />
          </div>
        </div>
        <Button 
          onClick={addEvent} 
          disabled={loading || !newEvent.title}
          variant="violet"
          className="font-bold uppercase tracking-widest text-xs py-4 px-8"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />} 
          Post Tracking Update
        </Button>
      </div>

      {/* History Preview */}
      <div className="bg-neutral-50 border border-neutral-100 rounded-sm p-8">
        <h3 className="font-serif text-xl font-bold mb-6">Current Event History</h3>
        <div className="space-y-4">
          {order.trackingEvents?.map((event: any) => (
            <div key={event.id} className="flex gap-4 items-start bg-white p-4 rounded-sm border border-neutral-100 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-mist flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 bg-violet rounded-full" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm">{event.title}</h4>
                  <span className="text-[10px] text-neutral-400 font-mono">{format(new Date(event.timestamp), 'MMM dd, HH:mm')}</span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">{event.description}</p>
                {event.location && (
                  <div className="flex items-center gap-1 text-[9px] font-black uppercase text-violet mt-2">
                    <MapPin className="w-3 h-3" /> {event.location}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
