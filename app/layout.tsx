import type { Metadata } from "next";
import "./globals.css";
import { ConditionalSiteLayout } from "@/components/ConditionalSiteLayout";
import { Analytics } from "@/components/Analytics";
import { getFooterAboutSetting, getSocialLinksSetting, getVisibilitySetting } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: {
    default: "India's 40 Under 40 Summit & Awards 2026 | Asia Inc. 500",
    template: "%s | Asia Inc. 500",
  },
  description:
    "Recognizing the next generation of entrepreneurs, innovators, and changemakers shaping the future of India. Nominate now for India's 40 Under 40 Leaders 2026.",
  metadataBase: new URL("https://40u40-main.vercel.app"),
  icons: { icon: "/icon.png", apple: "/icon.png", shortcut: "/icon.png" },
  openGraph: {
    title: "India's 40 Under 40 Summit & Awards 2026 | Asia Inc. 500",
    description:
      "Recognizing the next generation of entrepreneurs, innovators, and changemakers shaping the future of India.",
    url: "/",
    siteName: "Asia Inc. 500",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "India's 40 Under 40 Summit & Awards 2026 | Asia Inc. 500",
    description:
      "Recognizing the next generation of entrepreneurs, innovators, and changemakers shaping the future of India.",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [footerAbout, socialLinksSetting, visibility] = await Promise.all([
    getFooterAboutSetting(),
    getSocialLinksSetting(),
    getVisibilitySetting(),
  ]);

  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased bg-primary">
        <Analytics />
        <ConditionalSiteLayout
          footerAbout={footerAbout}
          socialLinks={socialLinksSetting.links}
          showFooter={visibility.showFooter}
        >
          {children}
        </ConditionalSiteLayout>
      </body>
    </html>
  );
}
