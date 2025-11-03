import type { Metadata } from "next";
import { Dancing_Script, Ubuntu, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
});

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  variable: "--font-noto-naskh-arabic",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Nanda & Nisa - Undangan Pernikahan",
  description: "Kami dengan senang hati mengundang Anda untuk hadir dan berbagi kebahagiaan di hari pernikahan kami. Minggu, 7 Desember 2025 di Cordela Hotel Cirebon.",
  keywords: ["pernikahan", "undangan pernikahan", "Nisa", "Nanda", "wedding", "Cirebon", "Desember 2025"],
  authors: [{ name: "Nanda & Nisa" }],
  openGraph: {
    title: "Nanda & Nisa - Undangan Pernikahan",
    description: "Kami dengan senang hati mengundang Anda untuk hadir dan berbagi kebahagiaan di hari pernikahan kami.",
    type: "website",
    locale: "id_ID",
    siteName: "Nanda & Nisa Wedding",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nanda & Nisa - Undangan Pernikahan",
    description: "Kami dengan senang hati mengundang Anda untuk hadir dan berbagi kebahagiaan di hari pernikahan kami.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${dancingScript.variable} ${ubuntu.variable} ${notoNaskhArabic.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
