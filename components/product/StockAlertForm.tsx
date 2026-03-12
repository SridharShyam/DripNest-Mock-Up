'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Bell, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';

interface StockAlertFormProps {
  productId: string;
  variantId: string;
  size: string;
  colour: string;
}

export function StockAlertForm({ productId, variantId, size, colour }: StockAlertFormProps) {
  const { data: session } = useSession();
  const { addToast } = useToast();
  const [email, setEmail] = useState(session?.user?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/stock-alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          productId,
          variantId,
          size,
          colour,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsSubscribed(true);
        setMessage(data.message || "We'll email you when this is back ✓");
        addToast(data.message || 'Alert set successfully!', 'success');
      } else {
        addToast(data.error || 'Something went wrong', 'error');
      }
    } catch (error) {
      addToast('Failed to set alert', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="flex items-center gap-2 p-4 bg-mist rounded-sm text-violet font-medium border border-violet/20">
        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm">{message}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!session?.user ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-3 border border-neutral-200 rounded-sm focus:outline-none focus:border-violet text-sm"
          />
          <Button
            type="submit"
            variant="violet"
            className="px-6 font-bold uppercase tracking-widest text-xs"
            isLoading={isSubmitting}
          >
            Notify Me
          </Button>
        </form>
      ) : (
        <Button
          onClick={handleSubmit}
          variant="outline"
          className="w-full py-6 text-sm font-bold uppercase tracking-widest border-violet text-violet hover:bg-mist"
          isLoading={isSubmitting}
        >
          <Bell className="w-4 h-4 mr-2" />
          Notify Me When Available
        </Button>
      )}
      {session?.user && (
        <p className="text-[10px] text-neutral-400 uppercase tracking-widest text-center">
          We'll email you at <span className="text-neutral-600 font-bold">{session.user.email}</span>
        </p>
      )}
    </div>
  );
}
