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
  title: "useCaptureElement - Hook para capturar elementos en Next.js",
  description:
    "useCaptureElement es un hook de React y Next.js que permite capturar cualquier elemento HTML como imagen utilizando html2canvas.",
  keywords: [
    "Next.js",
    "React",
    "html2canvas",
    "captura de pantalla",
    "screenshot",
    "hook",
    "ShadCN",
    "imagen",
  ],
  authors: [
    { name: "Jesús Alfonso Perera Angel", url: "https://github.com/Pererita" },
  ],
  openGraph: {
    title: "useCaptureElement - Captura elementos HTML como imagen",
    description:
      "Hook de React y Next.js para capturar cualquier elemento HTML y descargarlo como imagen en formato PNG.",
    url: "https://github.com/Pererita/useCaptureElement",
    siteName: "useCaptureElement",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "Preview de useCaptureElement",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
