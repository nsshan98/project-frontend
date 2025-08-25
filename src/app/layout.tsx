import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project Unknown",
  description: "Nothing to describe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen w-full relative">
          {/* Dark Horizon Glow */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(125% 125% at 50% 10%, #000000 40%, #0d1a36 100%)",
            }}
          />
          {/* Your Content/Components */}
          {children}
        </div>
      </body>
    </html>
  );
}
