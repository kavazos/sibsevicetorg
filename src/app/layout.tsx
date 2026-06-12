import type { Metadata } from "next";
import "./globals.css";
import BackToTop from "@/components/ui/BackToTop";
import TrpcProvider from "@/components/TrpcProvider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sibservistorg.ru"),
  title: "Сибсервисторг — Надёжная обработка данных и хостинг в Омске",
  description:
    "ООО «Сибсервисторг» — размещение информации, аренда серверов, обработка и структурирование данных, облачное хранение. Работаем с 2006 года.",
  keywords: "хостинг Омск, обработка данных, VDS сервер, IT аутсорсинг Омск, Сибсервисторг",
  icons: {
    icon: "/sibservistorg-logo.svg",
    shortcut: "/sibservistorg-logo.svg",
    apple: "/sibservistorg-logo.svg",
  },
  openGraph: {
    title: "Сибсервисторг — Надёжная обработка данных и хостинг в Омске",
    description:
      "ООО «Сибсервисторг» — размещение информации, аренда серверов, обработка и структурирование данных, облачное хранение.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://sibservistorg.ru",
    siteName: "Сибсервисторг",
    images: [{ url: "/sibservistorg-og.png", width: 1200, height: 630 }],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Сибсервисторг — Надёжная обработка данных и хостинг в Омске",
    description:
      "ООО «Сибсервисторг» — размещение информации, аренда серверов, обработка и структурирование данных, облачное хранение.",
    images: ["/sibservistorg-og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="bg-cream text-ink antialiased">
        <TrpcProvider>
          {children}
        </TrpcProvider>
        {/* JSON-LD схема компании для поисковых систем */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ООО Сибсервисторг",
              url: process.env.NEXT_PUBLIC_SITE_URL || "https://sibservistorg.ru",
              logo: process.env.NEXT_PUBLIC_SITE_URL
                ? `${process.env.NEXT_PUBLIC_SITE_URL}/sibservistorg-logo.svg`
                : "https://sibservistorg.ru/sibservistorg-logo.svg",
              sameAs: [
                "https://www.facebook.com/your-company",
                "https://vk.com/your-company"
              ],
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: "+7",
                  contactType: "customer service",
                  areaServed: "RU",
                  availableLanguage: ["Russian"]
                }
              ],
            }),
          }}
        />
        <BackToTop />
      </body>
    </html>
  );
}
