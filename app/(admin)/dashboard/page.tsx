import StoreCard from "@/components/stores-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import prismadb from "@/lib/prismadb";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

const DashboardPage = async () => {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");

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
        <UserButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stores &&
          stores.map((store) => {
            return <StoreCard store={store} key={store.id} />;
          })}
        <Card className="">
          <CardContent className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center">
              <Plus className="size-20 text-muted-foreground" />
              <Button variant="secondary">Agregar tienda</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
