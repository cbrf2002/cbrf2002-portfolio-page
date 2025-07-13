import React from 'react';
import PhotoGrid from '@/components/facebook-photo-grid';
import { photos } from '@/lib/photo-data';

export default function WorksPhotoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-4xl font-bold">Photography</h1>
      <PhotoGrid photos={photos} />
    </div>
  );
}
