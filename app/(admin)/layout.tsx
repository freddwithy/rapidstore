import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  return <>{children}</>;
}
