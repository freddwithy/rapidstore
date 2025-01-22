import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

const roboto = Poppins({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RapidStore",
  description: "Create your store faster and easier",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl={"/sign-in"}>
      <html lang="es">
        <body className={roboto.className}>
          <ThemeProvider attribute="class" defaultTheme="system">
            {children}
            <Analytics />
          </ThemeProvider>

          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
