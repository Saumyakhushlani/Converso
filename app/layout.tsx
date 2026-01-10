import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {ClerkProvider} from '@clerk/nextjs'

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Converso",
  description: "Real-time AI Teaching Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} antialiased flex flex-col min-h-screen`}>
        <ClerkProvider appearance={{variables:{colorPrimary:"#fe5933"}}}>
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}
