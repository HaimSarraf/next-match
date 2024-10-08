import type { Metadata } from "next";
import "./globals.css";
import TopNav from "@/components/navabr/TopNav";
import Providers from "@/components/Providers";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Match",
  description: "Generated by Sarraf",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const userId = session?.user?.id || null;
  const profileComplete = session?.user.profileComplete as boolean;

  return (
    <html lang="en">
      <body>
        <Providers userId={userId} profileComplete={profileComplete}>
          <TopNav />
          <main className="container mx-auto px-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
