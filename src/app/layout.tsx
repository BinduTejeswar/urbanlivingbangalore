import type { Metadata } from "next";
import { Work_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "UrbanLivingBangalore | Bangalore Rentals, Minus the Agent",
  description: "Find your perfect home in Bangalore — no agents, no brokerage, just homes directly from owners.",
};

import { ThemeProvider } from "@/providers/ThemeProvider";
import { AppErrorBoundary, RecoverableErrorListener } from "@/components/ui/AppErrorBoundary";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${workSans.variable} ${instrumentSerif.variable} antialiased font-sans`}
      >
        <ThemeProvider>
          <AppErrorBoundary>
            {children}
          </AppErrorBoundary>
          <RecoverableErrorListener />
        </ThemeProvider>
      </body>
    </html>
  );
}
