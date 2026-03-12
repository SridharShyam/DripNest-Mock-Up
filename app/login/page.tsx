'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Chrome, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(redirect);
    }
  }, [status, router, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        addToast(result.error, 'error');
      } else {
        addToast('Welcome back to DripNest!', 'success');
        router.push(redirect);
      }
    } catch (error) {
      addToast('An unexpected error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: redirect });
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left: Form */}
      <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 xl:px-32 py-20 bg-white">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.5 }}
        >
          <h1 className="font-serif text-5xl font-bold mb-4 tracking-tight">Login.</h1>
          <p className="text-neutral-500 mb-10">Welcome back to your nest. New here? <Link href="/register" className="text-violet font-bold hover:underline">Create an account</Link></p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Email Address</label>
              <div className="relative group">
                 <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300 group-focus-within:text-violet transition-colors" />
                 <input 
                   type="email" 
                   required
                   placeholder="nest@example.com"
                   className="w-full bg-transparent border-0 border-b-2 border-neutral-100 focus:border-violet focus:ring-0 py-4 pl-8 text-lg font-medium transition-all"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                 />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Password</label>
                <Link href="/forgot-password" title="Coming soon" className="text-[10px] font-bold text-neutral-400 hover:text-black uppercase tracking-widest">Forgot?</Link>
              </div>
              <div className="relative group">
                 <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300 group-focus-within:text-violet transition-colors" />
                 <input 
                   type="password" 
                   required
                   placeholder="••••••••"
                   className="w-full bg-transparent border-0 border-b-2 border-neutral-100 focus:border-violet focus:ring-0 py-4 pl-8 text-lg font-medium transition-all"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                 />
              </div>
            </div>

            <Button 
              type="submit" 
              variant="violet" 
              size="lg" 
              className="w-full py-8 text-xl font-black uppercase tracking-[0.2em] shadow-xl hover:translate-y-[-2px] transition-all group"
              isLoading={isLoading}
            >
              Sign In <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
            </Button>
          </form>

          <div className="my-8 flex items-center gap-4 text-neutral-200">
            <div className="h-px flex-1 bg-neutral-100" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">OR</span>
            <div className="h-px flex-1 bg-neutral-100" />
          </div>

          <button 
            onClick={handleGoogleSignIn}
            className="w-full py-4 border-2 border-neutral-100 rounded-sm flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-xs hover:bg-neutral-50 transition-all active:scale-[0.98]"
          >
            <Chrome className="w-5 h-5" /> Continue with Google
          </button>
        </motion.div>
      </div>

      {/* Right: Visual Section */}
      <div className="hidden lg:block relative bg-charcoal overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200" 
          alt="Login Visual" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale scale-105 group-hover:scale-110 transition-transform duration-10000 linear"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-20 left-20 right-20 text-white">
          <h2 className="font-serif text-6xl font-bold mb-6 italic leading-tight">Elevate your<br/>everyday.</h2>
          <p className="text-neutral-300 text-lg max-w-sm">DripNest is more than a store. It's a statement. Join the community and redefine your style.</p>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 right-20 w-32 h-32 border border-white/10 rounded-full animate-pulse" />
        <div className="absolute top-40 right-[10%] w-16 h-16 border border-white/5 rounded-full" />
      </div>
    </div>
  );
}
