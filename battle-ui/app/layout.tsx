import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Battle Dinos",
  description: "Collect, battle, and build a legendary dinosaur record.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
