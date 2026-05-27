import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "We Live in Bangalore | No Brokerage Flats",
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
        className={`${quicksand.variable} antialiased font-sans`}
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
