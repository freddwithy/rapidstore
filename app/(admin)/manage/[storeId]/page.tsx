import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import StatsCard from "@/components/stats-card";
import { Layers2, Package } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Page = async ({
  params,
}: {
  params: {
    storeId: string;
  };
}) => {
  const storeId = params.storeId;
  const user = await currentUser();

  const userDb = await prismadb.user.findUnique({
    where: {
      clerk_id: user?.id,
    },
  });

  const store = await prismadb.store.findFirst({
    where: {
      id: storeId,
      ownerId: userDb?.id,
    },
    include: {
      products: true,
      categories: true,
      orders: true,
    },
  });

  if (!store) {
    return (
      <Alert>
        <AlertTitle>Tienda no encontrada</AlertTitle>
        <AlertDescription>
          La tienda no ha sido encontrada o no pertenece al usuario.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <section className="w-full p-2 grid md:grid-cols-3 gap-2 grid-rows-2">
        <StatsCard
          title="Productos"
          value={store?.products.length.toString()}
          icon={<Package className="text-zinc-700 size-20" />}
        />
        <StatsCard
          title="Categorias"
          value={store?.categories.length.toString()}
          icon={<Layers2 className="text-zinc-700 size-20" />}
        />
        <StatsCard
          title="Pedidos"
          value={store?.orders.length.toString()}
          icon={<Layers2 className="text-zinc-700 size-20" />}
        />
      </section>
    </div>
  );
};

export default Page;
