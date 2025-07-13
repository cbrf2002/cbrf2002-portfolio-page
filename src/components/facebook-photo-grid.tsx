'use client';

import React from 'react';
import Masonry from 'react-masonry-css';
import Image from 'next/image';
import { Photo } from '@/lib/photo-data';

interface PhotoGridProps {
  photos: Photo[];
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos }) => {
  const breakpointColumnsObj = {
    default: 4,
    1280: 3,
    1024: 2,
    768: 1,
  };

  if (photos.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold">No Photos Yet</h2>
        <p className="text-brand-black/60 dark:text-brand-white/60">
          Add your photo data to <code>src/lib/photo-data.ts</code> to display
          them here.
        </p>
      </div>
    );
  }

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex w-auto gap-4"
      columnClassName="bg-clip-padding flex flex-col gap-4"
    >
      {photos.map(photo => (
        <div key={photo.id} className="group relative">
          <a
            href={photo.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block h-full w-full"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="rounded-lg object-cover"
              unoptimized
            />
            <div className="bg-opacity-0 group-hover:bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-lg bg-black p-4 transition-all duration-300">
              <p className="text-center text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {photo.caption}
              </p>
            </div>
          </a>
        </div>
      ))}
    </Masonry>
  );
};

export default PhotoGrid;
