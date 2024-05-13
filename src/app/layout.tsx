import "@/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import Navbar from "@/components/Navbar/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "NextResource?",
  description: "Creato da Gioele Vicini",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
      <Navbar />
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
