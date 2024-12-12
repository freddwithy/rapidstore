import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./components/AppSidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();

  return (
    <div>
      <SidebarProvider>
        <AppSidebar
          username={user?.username}
          profileImageUrl={user?.imageUrl}
        />
        {children}
      </SidebarProvider>
    </div>
  );
}
