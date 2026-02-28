import type { Metadata } from "next";
import { DirectionProvider } from "@/components/ui/direction";
import "./globals.css";

export const metadata: Metadata = {
  title: "YakYak.dev — Translate dev speak to PM, QA & design",
  description:
    "Turn developer language into project manager, QA, and designer speak. Clear communication across your team.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className="antialiased">
        <DirectionProvider dir="ltr">{children}</DirectionProvider>
      </body>
    </html>
  );
}
