import { currentUser } from "@clerk/nextjs/server";

import { SidebarProvider } from "@/components/ui/sidebar";
import prismadb from "@/lib/prismadb";
import AppSidebar from "./components/app-sidebar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Header from "./components/header";

export default async function Layout({
  children,
  params,
}: {
  params: { storeId: string };
  children: React.ReactNode;
}) {
  if (!params.storeId) return null;
  const user = await currentUser();

  const userDb = await prismadb.user.findUnique({
    where: {
      clerk_id: user?.id,
    },
  });

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      ownerId: userDb?.id,
    },
  });

  if (!store) {
    return (
      <div className="h-dvh flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="size-4" />
          <AlertTitle>Tienda no encontrada</AlertTitle>
          <AlertDescription>
            La tienda que estás buscando no existe o fue eliminada.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const stores = await prismadb.store.findMany({
    where: {
      owner: {
        clerk_id: user?.id,
      },
    },
  });

  return (
    <div className="flex h-dvh">
      <SidebarProvider>
        <AppSidebar
          store={store}
          stores={stores}
          userType={userDb?.user_type}
          username={userDb?.username}
          profileImage={user?.imageUrl}
        />
        <div className="w-full">
          <Header />
          <div className="animate-fade-up">{children}</div>
        </div>
      </SidebarProvider>
    </div>
  );
}
