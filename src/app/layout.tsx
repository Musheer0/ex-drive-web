import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const font = DM_Sans({
  subsets: ['latin', 'latin-ext']
})

export const metadata: Metadata = {
  title: "Ex drive",
  description: "a mini mini google drive clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${font.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
