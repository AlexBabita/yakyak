import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "App — YakYak.dev",
  description: "Translate dev speak to your team's language.",
};

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
