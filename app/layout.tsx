import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

const roboto = Poppins({
  weight: ["200", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tiendy",
  description:
    "Crea tu tienda sin complicaciones. Ideal para vendedores que quieren resultados rápidos sin invertir tiempo y dinero en otras soluciones más complejas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={roboto.className}>
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
          <Analytics />
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
