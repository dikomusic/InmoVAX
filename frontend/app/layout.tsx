import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InmoVax | Anticréticos y Alquileres",
  description: "Encuentra tu hogar ideal en La Paz.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {/* Este es el molde base, sin Navbar ni Footer. Ideal para el Login. */}
      <body className={`${inter.className} bg-surface-light text-content-main antialiased`}>
        {children}
      </body>
    </html>
  );
}