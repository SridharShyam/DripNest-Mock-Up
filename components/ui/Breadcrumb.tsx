import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          {idx !== 0 && <ChevronRight className="w-3 h-3" />}
          {idx === items.length - 1 ? (
            <span className="text-black">{item.label}</span>
          ) : (
            <Link 
              href={item.href} 
              className="hover:text-violet transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
