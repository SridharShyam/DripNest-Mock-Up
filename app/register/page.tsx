'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        addToast('Account created successfully! Please login.', 'success');
        router.push('/login');
      } else {
        addToast(data.error || 'Registration failed', 'error');
      }
    } catch (error) {
      addToast('An unexpected error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left: Visual */}
      <div className="hidden lg:block relative bg-charcoal overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1200" 
          alt="Register Visual" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale scale-105 group-hover:scale-110 transition-transform duration-10000 linear"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-20 left-20">
          <Link href="/" className="font-serif text-3xl font-bold tracking-tighter text-white">DripNest.</Link>
        </div>
        <div className="absolute bottom-20 left-20 right-20 text-white">
          <h2 className="font-serif text-6xl font-bold mb-6 italic leading-tight">Start your<br/>journey.</h2>
          <p className="text-neutral-300 text-lg max-w-sm">Join the nest today and get exclusive access to drops, member-only pricing, and personalized styling recommendations.</p>
        </div>
      </div>

      {/* Right: Form Area */}
      <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 xl:px-32 py-20 bg-white">
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.5 }}
        >
          <h1 className="font-serif text-5xl font-bold mb-4 tracking-tight">Join.</h1>
          <p className="text-neutral-500 mb-10">Create your account and start your drip. Already have one? <Link href="/login" className="text-violet font-bold hover:underline">Sign in</Link></p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Full Name</label>
              <div className="relative group">
                 <User className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300 group-focus-within:text-violet transition-colors" />
                 <input 
                   type="text" 
                   required
                   placeholder="Alexander Drip"
                   className="w-full bg-transparent border-0 border-b-2 border-neutral-100 focus:border-violet focus:ring-0 py-4 pl-8 text-lg font-medium transition-all"
                   value={formData.name}
                   onChange={(e) => setFormData({...formData, name: e.target.value})}
                 />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Email Address</label>
              <div className="relative group">
                 <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300 group-focus-within:text-violet transition-colors" />
                 <input 
                   type="email" 
                   required
                   placeholder="nest@example.com"
                   className="w-full bg-transparent border-0 border-b-2 border-neutral-100 focus:border-violet focus:ring-0 py-4 pl-8 text-lg font-medium transition-all"
                   value={formData.email}
                   onChange={(e) => setFormData({...formData, email: e.target.value})}
                 />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300 group-focus-within:text-violet transition-colors" />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full bg-transparent border-0 border-b-2 border-neutral-100 focus:border-violet focus:ring-0 py-4 pl-8 text-lg font-medium transition-all"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300 group-focus-within:text-violet transition-colors" />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full bg-transparent border-0 border-b-2 border-neutral-100 focus:border-violet focus:ring-0 py-4 pl-8 text-lg font-medium transition-all"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 py-2">
              <input type="checkbox" required className="mt-1 w-4 h-4 rounded-sm border-neutral-200 text-violet focus:ring-violet" />
              <p className="text-xs text-neutral-500 leading-relaxed">
                By creating an account, you agree to our <Link href="/terms" className="text-black font-bold hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-black font-bold hover:underline">Privacy Policy</Link>.
              </p>
            </div>

            <Button 
              type="submit" 
              variant="violet" 
              size="lg" 
              className="w-full py-8 text-xl font-black uppercase tracking-[0.2em] shadow-xl hover:translate-y-[-2px] transition-all group"
              isLoading={isLoading}
            >
              Create Account <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-neutral-100 flex items-center justify-center gap-2 text-neutral-400">
             <ShieldCheck className="w-4 h-4" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Member Registration</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
