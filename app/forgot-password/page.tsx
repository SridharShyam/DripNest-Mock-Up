'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-mist/30">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 md:p-12 rounded-sm shadow-xl border border-neutral-100"
      >
        {!submitted ? (
          <>
            <div className="text-center mb-10">
              <h1 className="font-serif text-3xl font-bold mb-4">Reset Password</h1>
              <p className="text-neutral-500 text-sm">Enter the email associated with your account and we'll send a reset link.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
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

              <Button variant="violet" size="lg" className="w-full py-8 font-black uppercase tracking-widest">
                Send Reset Link
              </Button>

              <Link href="/login" className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-black transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-10 h-10 text-green" />
            </div>
            <h2 className="font-serif text-2xl font-bold mb-4">Link Sent!</h2>
            <p className="text-neutral-500 text-sm mb-10">Check your inbox for <span className="text-black font-semibold">{email}</span>. If it doesn't arrive within 5 minutes, please check your spam folder.</p>
            <Link href="/login">
              <Button variant="outline" className="w-full">Return to Login</Button>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
