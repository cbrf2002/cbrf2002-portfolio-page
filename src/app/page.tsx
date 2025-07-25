import IntroCard from '@/components/intro-card';

export default function Home() {
  return (
    <div className="min-h-screen px-4 pt-[calc(60px+4rem+2.5rem)] pb-12 sm:pb-16 md:pb-20 lg:pb-24">
      {/* Intro Card */}
      <div className="mx-auto w-full max-w-[900px]">
        <IntroCard />
      </div>
      <div className="mx-auto mt-10 w-full max-w-[900px]">
        <IntroCard />
      </div>
      <div className="mx-auto mt-10 w-full max-w-[900px]">
        <IntroCard />
      </div>
    </div>
  );
}
