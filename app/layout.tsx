import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

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
        <body>
          <ThemeProvider attribute="class" defaultTheme="system">
            {children}
          </ThemeProvider>

          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
