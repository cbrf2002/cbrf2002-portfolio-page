import MobileShowcase from '@/components/mobile-showcase'; // Import the new component

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-end px-6 pt-24 pb-10 sm:pb-16 md:pb-20">
      {/* Hero Section */}
      <div className="mx-auto w-full max-w-4xl text-center">
        <p className="text-brand-black/80 dark:text-brand-white/80 merriweather-light mb-10 text-xl sm:mb-12 md:mb-16 md:text-2xl">
          a developer. a photographer. a 3D artist.
        </p>
        <MobileShowcase />
      </div>
    </div>
  );
}
