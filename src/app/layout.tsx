import "./globals.css";
import type { Metadata } from "next";
import Wagmi from "@/components/Wagmi";
import Profile from "../components/Profile";
import { IBM_Plex_Mono } from "next/font/google";

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
      {/* god this looks so much worse without IBM plex */}
      <body className={plex.className}>
        <Wagmi>
          <main className="md:h-screen w-full bg-black">
            <nav className="border-b border-white/20 px-4 py-2 flex flex-row justify-between">
              <div className="flex flex-row space-x-2">
                <a
                  href="/"
                  className="text-white text-xs border border-white/30 rounded px-2 py-1"
                >
                  Home
                </a>
                {/* <a
                  href="/store"
                  className="text-white text-xs border border-white/30 rounded px-2 py-1"
                >
                  Store
                </a> */}
              </div>
              <Profile />
            </nav>
            <div className="h-[calc(100%-76px)]">{children}</div>
            <footer className="border-t border-white/20 px-4 py-2 flex flex-row space-x-12 text-white text-xs bg-black z-50">
              <a href="#">Group OS</a>
              <a href="#">Github</a>
              <a href="#">Opensea</a>
            </footer>
          </main>
        </Wagmi>
      </body>
    </html>
  );
}
