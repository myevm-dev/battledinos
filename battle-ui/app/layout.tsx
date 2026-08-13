import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPECIMEN",
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
