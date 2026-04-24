import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LanguageProvider } from "@/components/LanguageProvider";
import { fullDict } from "@/lib/i18n";
import { getServerLang } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "QLD Youth KOSTA — A warm community space",
  description:
    "Share prayer requests, encouragement, and worship resources with the QLD Youth KOSTA community.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = getServerLang();

  return (
    <html lang={lang}>
      <body className="min-h-screen flex flex-col">
        <LanguageProvider initialLang={lang} dict={fullDict}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
