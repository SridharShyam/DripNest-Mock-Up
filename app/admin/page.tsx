import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DollarSign, ShoppingCart, Users, Package, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== 'ADMIN') {
    redirect('/');
  }

  const [orderCount, productCount, userCount, latestOrders, revenueData] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { user: true } }),
    prisma.order.aggregate({ _sum: { total: true } }),
  ]);

  const stats = [
    { label: 'Total Revenue', value: formatPrice(revenueData._sum.total || 0), icon: DollarSign, trend: '+12.5%', isUp: true },
    { label: 'Total Orders', value: orderCount.toString(), icon: ShoppingCart, trend: '+8.2%', isUp: true },
    { label: 'Total Users', value: userCount.toString(), icon: Users, trend: '+4.1%', isUp: true },
    { label: 'Active Products', value: productCount.toString(), icon: Package, trend: '-2.4%', isUp: false },
  ];

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="font-serif text-4xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-neutral-500 mt-1">Operational overview of DripNest.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/admin/products" className="contents">
            <Button variant="outline">Manage Catalog</Button>
          </Link>
          <Button variant="violet">Download Reports</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 border border-neutral-100 rounded-sm shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-mist rounded-sm">
                <s.icon className="w-6 h-6 text-violet" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-black ${s.isUp ? 'text-green' : 'text-red'}`}>
                {s.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {s.trend}
              </div>
            </div>
            <p className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-1">{s.label}</p>
            <p className="text-3xl font-black">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-neutral-100 rounded-sm shadow-sm overflow-hidden">
          <div className="p-6 border-b border-black flex justify-between items-center bg-mist/30">
             <h2 className="font-serif text-xl font-bold uppercase tracking-tight">Recent Orders</h2>
             <Link href="/admin/orders" className="text-xs font-black uppercase tracking-widest text-violet hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100 text-[10px] uppercase font-black tracking-widest text-neutral-400 bg-neutral-50">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {latestOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm font-bold">#DN-{order.id.slice(0, 6)}</td>
                    <td className="px-6 py-4 text-sm font-medium">{order.user?.name || 'Guest'}</td>
                    <td className="px-6 py-4 text-sm font-bold">{formatPrice(order.total)}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-violet/10 text-violet">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border border-neutral-100 rounded-sm shadow-sm overflow-hidden">
          <div className="p-6 border-b border-black flex items-center gap-2 bg-mist/30">
             <h2 className="font-serif text-xl font-bold uppercase tracking-tight">Low Stock</h2>
             <div className="px-2 py-0.5 bg-red text-white text-[10px] font-black uppercase rounded-sm animate-pulse">Alert</div>
          </div>
          <div className="p-6 space-y-6">
             <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Inventory requiring attention</p>
             <div className="space-y-4">
                {[
                  { name: 'Oversized Graphic Tee', stock: 3, img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=100&h=100' },
                  { name: 'Baggy Denim Jeans', stock: 0, img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=100&h=100' },
                  { name: 'Bucket Hat Black', stock: 5, img: 'https://images.unsplash.com/photo-1611634560934-297059728461?auto=format&fit=crop&q=80&w=100&h=100' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-center border-b border-neutral-50 pb-4 last:border-0">
                    <img src={item.img} className="w-12 h-16 object-cover rounded-sm grayscale" alt="p" />
                    <div className="flex-1">
                      <p className="font-bold text-sm leading-tight">{item.name}</p>
                      <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${item.stock === 0 ? 'text-red' : 'text-gold'}`}>
                        {item.stock === 0 ? 'Out of Stock' : `${item.stock} Units Left`}
                      </p>
                    </div>
                  </div>
                ))}
             </div>
             <Button variant="outline" className="w-full mt-4">Inventory Manager</Button>
          </div>
        </div>

      </div>
    </div>
  );
}
