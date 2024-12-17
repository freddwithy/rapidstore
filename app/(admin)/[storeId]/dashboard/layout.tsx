import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./components/AppSidebar";
import prismadb from "@/lib/prismadb";

export default async function Layout({
  children,
  params,
}: {
  params: { storeId: string };
  children: React.ReactNode;
}) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  if (!params.storeId)
    return (
      <>
        <p>Store not found</p>
      </>
    );

  const user = await currentUser();

  const userDb = await prismadb.user.findUnique({
    where: {
      clerk_id: userId,
    },
  });

  const stores = await prismadb.store.findMany({
    where: {
      owner: {
        clerk_id: userId,
      },
    },
  });

  const store = stores.find((store) => store.id === params.storeId);

  return (
    <div>
      <SidebarProvider>
        <AppSidebar
          store={store}
          stores={stores}
          userType={userDb?.user_type}
          username={userDb?.username}
          profileImage={user?.imageUrl}
        />
        {children}
      </SidebarProvider>
    </div>
  );
}
