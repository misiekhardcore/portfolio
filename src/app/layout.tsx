import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getPayload } from 'payload'
import config from '@payload-config'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  let companyName = 'YourCompany'
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    if ((settings as any).companyName) companyName = (settings as any).companyName
  } catch { /* use default */ }

  return {
    title: {
      default: `${companyName} — Woodworking & Renovations`,
      template: `%s | ${companyName}`,
    },
    description:
      "Expert woodworking and home renovation craftsmanship. Custom furniture, kitchen refits, decking, and complete interior transformations.",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-wood-50 text-wood-800">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
