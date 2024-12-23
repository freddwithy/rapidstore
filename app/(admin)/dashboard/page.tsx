import { ModeToggle } from "@/components/mode-toggle";
import StoreCard from "@/components/stores-card";

import { Badge } from "@/components/ui/badge";

import UserMenu from "@/components/user-menu";
import prismadb from "@/lib/prismadb";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const DashboardPage = async () => {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");

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
    include: {
      categories: true,
      products: true,
      orders: true,
    },
  });

  return (
    <div className="p-4 gap-4 flex flex-col">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <UserMenu imageUrl={user?.imageUrl} userDb={userDb} />
          <div>
            <h2 className="text-lg md:text-2xl font-semibold flex items-center gap-x-2">
              Bienvenido {userDb?.username}!<Badge>{userDb?.user_type}</Badge>
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Desde aquí podrás gestionar tus tiendas.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-x-2">
          <ModeToggle />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stores &&
          stores.map((store) => {
            return <StoreCard user={userDb} store={store} key={store.id} />;
          })}
        {userDb?.user_type === "PRO" ? (
          <Link
            href=""
            className="border rounded-xl flex flex-col items-center justify-center text-muted-foreground min-h-40"
          >
            <Plus className="size-20" />
            <p>Agregar tienda</p>
          </Link>
        ) : (
          <div className="border rounded-xl flex flex-col items-center justify-center text-muted-foreground min-h-40">
            <Plus className="size-20" />
            <p className="text-center">
              Actualiza al{" "}
              <a
                href="/dashboard/upgrade"
                className="hover:underline text-primary"
              >
                Plan Pro
              </a>{" "}
              para agregar más tiendas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
