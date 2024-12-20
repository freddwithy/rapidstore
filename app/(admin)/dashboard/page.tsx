import { ModeToggle } from "@/components/mode-toggle";
import StoreCard from "@/components/stores-card";
import prismadb from "@/lib/prismadb";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const DashboardPage = async () => {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");

  const user = await prismadb.user.findUnique({
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
        <div>
          <h2 className="text-2xl font-semibold">Bienvenido Fredd!</h2>
          <p className="text-muted-foreground">
            Desde aquí podrás gestionar tus tiendas.
          </p>
        </div>
        <div className="flex items-center gap-x-2">
          <UserButton />
          <ModeToggle />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stores &&
          stores.map((store) => {
            return <StoreCard store={store} key={store.id} />;
          })}
        {user?.user_type === "PRO" && (
          <Link
            href=""
            className="border rounded-xl flex flex-col items-center justify-center text-muted-foreground min-h-40"
          >
            <Plus className="size-20" />
            <p>Agregar tienda</p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
