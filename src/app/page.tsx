import MobileShowcase from '@/components/mobile-showcase';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-24 pb-12 sm:px-6 sm:pb-16 md:pb-20 lg:pb-24">
      {/* Hero Section */}
      <div className="mx-auto w-full max-w-4xl text-center">
        <p className="text-brand-black/80 dark:text-brand-white/80 merriweather-light mb-8 text-lg sm:mb-10 sm:text-xl md:mb-12 md:text-2xl lg:mb-14">
          a developer. a photographer. a 3D artist.
        </p>
        <MobileShowcase />
      </div>
    </div>
  );
}
