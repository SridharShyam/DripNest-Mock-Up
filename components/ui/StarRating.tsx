import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  max?: number;
  readonly?: boolean;
  onRatingChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ 
  rating: initialRating, 
  max = 5, 
  readonly = false, 
  onRatingChange, 
  size = 'md' 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const starSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  const handleRating = (r: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(r);
    }
  };

  const renderStar = (index: number) => {
    const starIndex = index + 1;
    const currentRating = hoverRating || initialRating;
    
    let isFull = starIndex <= currentRating;
    let isHalf = !isFull && starIndex - 0.5 <= currentRating;

    return (
      <div 
        key={index}
        className={cn(
          "relative", 
          !readonly && "cursor-pointer transition-transform hover:scale-110"
        )}
        onMouseEnter={() => !readonly && setHoverRating(starIndex)}
        onMouseLeave={() => !readonly && setHoverRating(0)}
        onClick={() => handleRating(starIndex)}
      >
        <Star className={cn(starSize[size], "text-neutral-200")} />
        <div className="absolute inset-0 overflow-hidden">
          {isFull ? (
            <Star className={cn(starSize[size], "fill-gold text-gold")} />
          ) : isHalf ? (
            <div className="w-1/2 overflow-hidden">
               <Star className={cn(starSize[size], "fill-gold text-gold")} />
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => renderStar(i))}
    </div>
  );
}
