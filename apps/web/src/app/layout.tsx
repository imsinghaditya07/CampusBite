import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CampusBite · Tap.Order.Eat · Campus Food Operating System',
  description: 'India-wide digital operating system for college food. Order campus favourites ahead of time with zero waiting.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-charcoal-950 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
