import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Sinergia Soluciones",
  description: "Catálogo oficial",
};

// Configuramos Gilroy como fuente local
const gilroy = localFont({
  src: [
    {
      path: './fonts/Gilroy-Heavy.woff2',
      weight: '1000',
      style: 'normal',
    },
    {
      path: './fonts/Gilroy-Black.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: './fonts/Gilroy-Extrabold.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: './fonts/Gilroy-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/Gilroy-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/Gilroy-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Gilroy-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Gilroy-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/Gilroy-UltraLight.woff',
      weight: '200',
      style: 'normal',
    },
    {
      path: './fonts/Gilroy-Thin.woff',
      weight: '100',
      style: 'normal',
    },
  ],
  variable: '--font-gilroy',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${gilroy.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-gray-900 bg-white">
      <Header />
      {children}
      </body>
    </html>
  );
}
