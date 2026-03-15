'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Package, Heart, User, LogOut, ChevronRight, ShoppingBag, MapPin, Settings, Bell, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { TrackingModal } from '@/components/tracking/TrackingModal';

function AccountContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/account');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (session?.user) fetchOrders();
  }, [session]);

  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  const [alerts, setAlerts] = useState<any[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoadingAlerts(true);
      try {
        const res = await fetch('/api/stock-alerts');
        if (res.ok) {
          const data = await res.json();
          setAlerts(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingAlerts(false);
      }
    };

    if (session?.user && initialTab === 'alerts') fetchAlerts();
  }, [session, initialTab]);

  const removeAlert = async (id: string) => {
    try {
      const res = await fetch(`/api/stock-alerts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAlerts(alerts.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (status === 'loading') return (
    <div className="h-screen flex items-center justify-center font-serif text-2xl font-bold">DripNest.</div>
  );

  return (
    <div className="container mx-auto px-4 md:px-8 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="font-serif text-5xl font-bold tracking-tight mb-2">My Account</h1>
          <p className="text-neutral-500">Welcome back, <span className="text-black font-bold uppercase tracking-wider text-sm">{session?.user?.name}</span></p>
        </div>
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-2 text-red font-black uppercase tracking-widest text-xs border-2 border-red/10 px-6 py-3 rounded-full hover:bg-red hover:text-white transition-all shadow-sm"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <Tabs defaultValue={initialTab} className="w-full flex flex-col md:flex-row gap-12">
        <TabsList className="flex flex-col h-auto bg-transparent border-0 p-0 md:w-64 gap-2 items-stretch">
          <TabsTrigger value="profile" className="justify-start px-6 py-4 rounded-sm data-[state=active]:bg-violet data-[state=active]:text-white text-neutral-500 font-bold uppercase tracking-widest text-xs shadow-sm border border-neutral-100">
            <User className="w-4 h-4 mr-3" /> Profile Info
          </TabsTrigger>
          <TabsTrigger value="orders" className="justify-start px-6 py-4 rounded-sm data-[state=active]:bg-violet data-[state=active]:text-white text-neutral-500 font-bold uppercase tracking-widest text-xs shadow-sm border border-neutral-100">
            <Package className="w-4 h-4 mr-3" /> Order History
          </TabsTrigger>
          <TabsTrigger value="addresses" className="justify-start px-6 py-4 rounded-sm data-[state=active]:bg-violet data-[state=active]:text-white text-neutral-500 font-bold uppercase tracking-widest text-xs shadow-sm border border-neutral-100">
            <MapPin className="w-4 h-4 mr-3" /> Saved Addresses
          </TabsTrigger>
          <TabsTrigger value="alerts" className="justify-start px-6 py-4 rounded-sm data-[state=active]:bg-violet data-[state=active]:text-white text-neutral-500 font-bold uppercase tracking-widest text-xs shadow-sm border border-neutral-100">
            <Bell className="w-4 h-4 mr-3" /> Stock Alerts
          </TabsTrigger>
          <TabsTrigger value="settings" className="justify-start px-6 py-4 rounded-sm data-[state=active]:bg-violet data-[state=active]:text-white text-neutral-500 font-bold uppercase tracking-widest text-xs shadow-sm border border-neutral-100">
            <Settings className="w-4 h-4 mr-3" /> Settings
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 bg-white border border-neutral-100 rounded-sm p-8 shadow-sm">
          
          <TabsContent value="profile" className="m-0">
            <h2 className="font-serif text-3xl font-bold mb-8">Profile Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Full Name</p>
                <p className="font-bold text-lg">{session?.user?.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Email Address</p>
                <p className="font-bold text-lg">{session?.user?.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Account Role</p>
                <p className="font-bold text-lg font-serif">{(session?.user as any)?.role || 'Customer'}</p>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-neutral-100">
              <Button variant="outline" className="font-bold uppercase tracking-widest">Edit Profile</Button>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="m-0">
            <h2 className="font-serif text-3xl font-bold mb-8">Order History</h2>
            {loadingOrders ? (
              <div className="space-y-4">
                {[1,2].map(i => <div key={i} className="h-24 bg-neutral-50 animate-pulse rounded-sm" />)}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <p className="font-bold text-neutral-500 mb-6">You haven't placed any orders yet.</p>
                <Link href="/shop" className="contents">
                  <Button variant="violet" className="font-bold uppercase tracking-widest">Shop Now</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-neutral-100 rounded-sm p-6 hover:border-violet transition-colors group">
                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Order ID</p>
                        <p className="font-bold font-mono">#DN-{order.id.slice(0, 8).toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Placed On</p>
                        <p className="font-bold">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Total</p>
                        <p className="font-black text-lg">{formatPrice(order.total)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Status</p>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] ${
                          order.status === 'DELIVERED' ? 'bg-green/10 text-green' : 'bg-violet/10 text-violet'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       {order.items.slice(0, 3).map((item: any) => (
                         <div key={item.id} className="w-10 h-14 bg-mist rounded-sm overflow-hidden flex-shrink-0">
                           <img src={item.productImage} className="w-full h-full object-cover" alt="p" />
                         </div>
                       ))}
                       {order.items.length > 3 && <div className="w-10 h-10 bg-mist flex items-center justify-center text-[10px] font-bold text-neutral-500">+{order.items.length - 3}</div>}
                       <div className="ml-auto flex items-center gap-4">
                         <button 
                           onClick={() => { setTrackingOrderId(order.id); setIsTrackingOpen(true); }}
                           className="px-4 py-2 bg-mist text-violet text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-violet hover:text-white transition-all"
                         >
                           Track Order
                         </button>
                         <Link href={`/order/${order.id}/confirmation`} className="flex items-center gap-1 font-black uppercase tracking-widest text-[10px] text-violet group-hover:gap-2 transition-all">
                           View Details <ChevronRight className="w-3 h-3" />
                         </Link>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="addresses" className="m-0">
             <h2 className="font-serif text-3xl font-bold mb-8">Saved Addresses</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-neutral-100 rounded-sm p-8 flex flex-col items-center justify-center text-neutral-400 hover:border-violet hover:text-violet transition-all cursor-pointer group">
                  <MapPin className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
                  <p className="font-black uppercase tracking-widest text-xs text-black">Add New Address</p>
                </div>
             </div>
          </TabsContent>

          <TabsContent value="alerts" className="m-0">
            <h2 className="font-serif text-3xl font-bold mb-8">Stock Alerts</h2>
            {loadingAlerts ? (
              <div className="space-y-4">
                {[1,2].map(i => <div key={i} className="h-24 bg-neutral-50 animate-pulse rounded-sm" />)}
              </div>
            ) : alerts.length === 0 ? (
              <div className="text-center py-20 bg-mist rounded-sm">
                <Bell className="w-12 h-12 text-violet/30 mx-auto mb-4" />
                <p className="font-bold text-neutral-500 mb-6 font-serif text-xl">No active restock alerts.</p>
                <p className="text-neutral-400 text-sm mb-8 max-w-xs mx-auto uppercase tracking-widest">Visit a sold-out product to get notified when it's back.</p>
                <Link href="/shop">
                  <Button variant="violet" className="font-bold uppercase tracking-widest">Shop Now</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-neutral-100">
                      <th className="pb-4 pt-0 font-black uppercase tracking-widest text-[10px] text-neutral-400">Product</th>
                      <th className="pb-4 pt-0 font-black uppercase tracking-widest text-[10px] text-neutral-400">Varaint</th>
                      <th className="pb-4 pt-0 font-black uppercase tracking-widest text-[10px] text-neutral-400">Date Set</th>
                      <th className="pb-4 pt-0 font-black uppercase tracking-widest text-[10px] text-neutral-400">Status</th>
                      <th className="pb-4 pt-0 font-black uppercase tracking-widest text-[10px] text-neutral-400 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {alerts.map((alert) => (
                      <tr key={alert.id} className="group">
                        <td className="py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-16 bg-mist rounded-sm overflow-hidden flex-shrink-0">
                              <img src={JSON.parse(alert.product.images)[0]} className="w-full h-full object-cover" alt={alert.product.name} />
                            </div>
                            <div>
                              <p className="font-bold text-sm">{alert.product.name}</p>
                              <p className="text-xs text-neutral-400 font-mono">#{alert.product.id.slice(0, 6)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-6">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold uppercase tracking-widest">{alert.size}</span>
                            <span className="text-[10px] text-neutral-500 uppercase tracking-widest">{alert.colour}</span>
                          </div>
                        </td>
                        <td className="py-6">
                          <span className="text-sm font-medium">{new Date(alert.createdAt).toLocaleDateString()}</span>
                        </td>
                        <td className="py-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            alert.isNotified ? 'bg-green/10 text-green' : 'bg-neutral-100 text-neutral-400'
                          }`}>
                            {alert.isNotified ? 'Notified' : 'Waiting'}
                          </span>
                        </td>
                        <td className="py-6 text-right">
                          <button 
                            onClick={() => removeAlert(alert.id)}
                            className="p-2 text-neutral-400 hover:text-red transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="m-0">
             <h2 className="font-serif text-3xl font-bold mb-8">Account Settings</h2>
             <div className="space-y-6">
                <div className="flex items-center justify-between py-4 border-b border-neutral-100">
                  <div>
                    <p className="font-bold">Email Notifications</p>
                    <p className="text-sm text-neutral-500">Receive order updates and newsletter</p>
                  </div>
                  <div className="w-12 h-6 bg-violet rounded-full relative"><div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full"></div></div>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-neutral-100">
                  <div>
                    <p className="font-bold">Two-Factor Authentication</p>
                    <p className="text-sm text-neutral-500">Add an extra layer of security</p>
                  </div>
                  <div className="w-12 h-6 bg-neutral-200 rounded-full relative"><div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"></div></div>
                </div>
             </div>
             <div className="mt-12">
               <Button className="font-bold uppercase tracking-widest text-red border-red hover:bg-red hover:text-white" variant="outline">Delete Account</Button>
             </div>
          </TabsContent>

        </div>
      </Tabs>

      <TrackingModal 
        isOpen={isTrackingOpen} 
        onClose={() => setIsTrackingOpen(false)} 
        orderId={trackingOrderId || ''} 
      />
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center font-serif text-2xl font-bold">DripNest.</div>
    }>
      <AccountContent />
    </Suspense>
  );
}
