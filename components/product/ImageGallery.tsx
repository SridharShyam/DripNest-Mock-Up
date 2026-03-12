'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageGalleryProps {
  images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  if (!images || images.length === 0) return null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIdx(idx)}
            className={`relative w-20 h-24 flex-shrink-0 bg-mist rounded-sm overflow-hidden border-2 transition-all ${
              selectedIdx === idx ? 'border-black' : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <Image 
              src={img} 
              alt={`Thumbnail ${idx}`} 
              fill 
              className="object-cover" 
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div 
        className="relative flex-1 aspect-[3/4] bg-mist rounded-sm overflow-hidden group cursor-zoom-in"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <Image
              src={images[selectedIdx]}
              alt="Main product image"
              fill
              priority
              className={`object-cover transition-transform duration-200 ${isZoomed ? 'scale-[2]' : 'scale-100'}`}
              style={isZoomed ? {
                transformOrigin: `${mousePos.x}% ${mousePos.y}%`
              } : undefined}
            />
          </motion.div>
        </AnimatePresence>

        {/* Zoom Indicator */}
        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        </div>
      </div>
    </div>
  );
}
