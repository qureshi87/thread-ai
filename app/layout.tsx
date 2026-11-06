import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "THREAD AI | Fashion Mockup Studio",
  description: "Create professional fashion mockups while preserving your original garment details.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
