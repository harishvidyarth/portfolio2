import type { Metadata, Viewport } from "next";
import localFont from 'next/font/local';
import "./globals.css";

const soriaFont = localFont({
  src: "../public/soria-font.ttf",
  variable: "--font-soria",
});

const vercettiFont = localFont({
  src: "../public/Vercetti-Regular.woff",
  variable: "--font-vercetti",
});

export const metadata: Metadata = {
  title: "N. Harish Vidyarth - Parallel Computing Researcher & Developer",
  description: "Emerging researcher specializing in graph theory and parallel computing. B.E. CSE Cyber Security student at Rajalakshmi Engineering College, Chennai.",
  keywords: "N. Harish Vidyarth, Harish Vidyarth, Parallel Computing, Graph Theory, Cybersecurity, Cyber Security, Researcher, Developer, Rajalakshmi Engineering College, Chennai",
  authors: [{ name: "N. Harish Vidyarth" }],
  creator: "N. Harish Vidyarth",
  publisher: "N. Harish Vidyarth",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "N. Harish Vidyarth - Parallel Computing Researcher",
    description: "Emerging researcher specializing in graph theory and parallel computing.",
    url: "https://harishvidyarth.github.io",
    siteName: "N. Harish Vidyarth's Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "N. Harish Vidyarth - Parallel Computing Researcher",
    description: "Emerging researcher specializing in graph theory and parallel computing.",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overscroll-y-none">
      <body
        className={`${soriaFont.variable} ${vercettiFont.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
