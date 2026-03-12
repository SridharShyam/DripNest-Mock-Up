'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Package, 
  Search, 
  Filter, 
  ChevronRight, 
  Truck, 
  ExternalLink,
  ChevronLeft,
  X
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { AdminTrackingControl } from '@/components/admin/AdminTrackingControl';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated' || (status === 'authenticated' && (session?.user as any).role !== 'ADMIN')) {
      router.push('/');
    }
  }, [status, session, router]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders'); // Re-using existing route or adjust if needed
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchOrders();
  }, [session]);

  const handleUpdate = () => {
    // Refresh the selected order data
    const refreshOrder = async () => {
      const res = await fetch(`/api/orders/${selectedOrder.id}/tracking`);
      if (res.ok) {
        const data = await res.json();
        setSelectedOrder(data);
        fetchOrders();
      }
    };
    refreshOrder();
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === 'loading' || loading) return (
    <div className="h-screen flex items-center justify-center font-serif text-2xl font-bold animate-pulse">DripNest Admin.</div>
  );

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <Link href="/admin" className="text-violet text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1 hover:gap-2 transition-all">
            <ChevronLeft className="w-3 h-3" /> Back to Dashboard
          </Link>
          <h1 className="font-serif text-4xl font-bold tracking-tight">Order Management</h1>
          <p className="text-neutral-500">Manage fulfillment and real-time tracking.</p>
        </div>
      </div>

      <div className="bg-white border border-neutral-100 rounded-sm shadow-sm overflow-hidden mb-12">
         <div className="p-6 border-b border-neutral-100 flex flex-col md:flex-row gap-4 justify-between bg-mist/20">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input 
                type="text" 
                placeholder="Search by Order ID or Customer Name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-100 rounded-sm focus:outline-none focus:border-violet text-sm"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="text-xs font-bold uppercase tracking-widest px-6 h-auto py-3">
                <Filter className="w-3 h-3 mr-2" /> Filters
              </Button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100 text-[10px] uppercase font-black tracking-widest text-neutral-400 bg-neutral-50">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Carrier</th>
                  <th className="px-6 py-4">Latest Tracking</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-mono text-sm font-bold">#DN-{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-[10px] text-neutral-400 font-mono mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold">{order.user?.name || 'Guest'}</p>
                      <p className="text-xs text-neutral-400 truncate max-w-[150px]">{order.user?.email || 'No email'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        order.status === 'DELIVERED' ? 'bg-green/10 text-green' : 'bg-violet/10 text-violet'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {order.carrierName ? (
                         <div>
                           <p className="text-violet font-bold">{order.carrierName}</p>
                           <p className="text-[10px] text-neutral-400 font-mono">{order.trackingNumber}</p>
                         </div>
                      ) : (
                        <span className="text-neutral-300 italic">No info</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                        {order.currentStatus?.replace(/_/g, ' ') || 'Order Placed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                          variant="outline" 
                          className="h-9 px-4 text-[10px] font-black uppercase tracking-widest border-violet/20 text-violet hover:bg-violet hover:text-white"
                        >
                          <Truck className="w-3 h-3 mr-2" /> Track
                        </Button>
                        <Link href={`/order/${order.id}/confirmation`}>
                           <Button variant="ghost" className="h-9 w-9 p-0 text-neutral-400 hover:text-black">
                             <ExternalLink className="w-4 h-4" />
                           </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </div>

      {/* Admin Tracking Modal */}
      <AnimatePresence>
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-cream rounded-sm shadow-2xl overflow-y-auto"
            >
              <div className="sticky top-0 z-20 bg-cream/80 backdrop-blur-md px-8 py-6 border-b border-neutral-100 flex justify-between items-center">
                <div>
                  <h2 className="font-serif text-3xl font-bold tracking-tight">Order Tracking Control</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mt-1">Managing #DN-{selectedOrder.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8">
                <AdminTrackingControl order={selectedOrder} onUpdate={handleUpdate} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

