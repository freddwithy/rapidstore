import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ClerkProvider afterSignOutUrl={"/sign-in"}>{children}</ClerkProvider>;
}
