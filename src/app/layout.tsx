import "./globals.css";
import type { Metadata } from "next";
import Wagmi from "@/components/Wagmi";
import Profile from "../components/Profile";
import ProfileButton from "../components/ProfileButton";
import CreateCharacterButton from "../components/CreateCharacterButton";
import { IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Loot2",
  description:
    "Token bound upgrade to the original loot project. By Station Labs.",
};

const plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={plex.className}>
        <Wagmi>
          <main className="md:h-screen w-full bg-black">
            <nav className="border-b border-white/20 px-4 py-2 flex flex-row justify-between">
              <div className="flex flex-row space-x-2">
                <Link
                  href="/"
                  className="text-white text-xs border border-white/30 rounded px-2 py-1"
                >
                  Home
                </Link>
                <ProfileButton />
              </div>

              <div className="space-x-2">
                <CreateCharacterButton />
                <Profile />
              </div>
            </nav>
            <div className="h-[calc(100%-76px)]">{children}</div>
            <footer className="border-t border-white/20 px-4 py-2 flex flex-row space-x-12 text-white text-xs bg-black z-50">
              <a href="https://station.express/">Station Labs</a>
              <a href="https://github.com/mcgingras/loot2">Github</a>
              <a href="https://testnets.opensea.io/collection/loot2-tokenbound-character-6">
                Collection
              </a>
            </footer>
          </main>
        </Wagmi>
      </body>
    </html>
  );
}
