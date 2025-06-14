import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import ClientWrapper from '@/components/client-wrapper'; // Import the new component

export const metadata: Metadata = {
  title: 'CBRF2002 - Developer Portfolio',
  description: 'A developer, photographer, and 3D artist portfolio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`bg-brand-white dark:bg-brand-black text-brand-black dark:text-brand-white overflow-x-auto antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <ClientWrapper>{children}</ClientWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
