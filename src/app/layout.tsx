import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import configPromise from "@payload-config";
import { rtlLanguages } from "@payloadcms/translations";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "YourCompany — Woodworking & Renovations",
    template: "%s | YourCompany",
  },
  description:
    "Expert woodworking and home renovation craftsmanship. Custom furniture, kitchen refits, decking, and complete interior transformations.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const lang = cookieStore.get('payload-lng')?.value
  const dir = lang && (rtlLanguages as readonly string[]).includes(lang) ? 'RTL' : 'LTR'
  const config = await configPromise

  return (
    <html
      lang="en"
      dir={dir}
      suppressHydrationWarning={config?.admin?.suppressHydrationWarning ?? true}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){try{var t=document.cookie.split("; ").find(function(r){return r.indexOf("payload-theme=")===0});var v=t?t.split("=")[1]:null;var m=v==="light"||v==="dark"?v:window.matchMedia&&window.matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",m)}catch(e){}})()',
          }}
        />
        <style>{`@layer payload-default, payload;`}</style>
      </head>
      <body className="min-h-full bg-wood-50 text-wood-800">
        {children}
      </body>
    </html>
  );
}
