import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Extend tailwind-merge to recognize custom theme colors from our Tailwind v4 config
const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'text-color': [
        'text-black', 'text-charcoal', 'text-violet', 'text-lavender', 'text-mist', 'text-cream', 'text-gold', 'text-green', 'text-red',
      ],
      'bg-color': [
        'bg-black', 'bg-charcoal', 'bg-violet', 'bg-lavender', 'bg-mist', 'bg-cream', 'bg-gold', 'bg-green', 'bg-red',
      ],
      'border-color': [
        'border-black', 'border-charcoal', 'border-violet', 'border-lavender', 'border-mist', 'border-cream', 'border-gold', 'border-green', 'border-red',
      ]
    }
  }
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price * 83);
}

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
