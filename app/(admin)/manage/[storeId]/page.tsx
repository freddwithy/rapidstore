import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import StatsCard from "@/components/stats-card";
import { ClipboardCheck, Layers2, Package } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatter } from "@/lib/utils";
import { DataTable } from "@/components/data-table";
import { columns } from "./components/columns";

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
      orders: {
        where: {
          paymentStatus: "PAGADO",
        },
        include: {
          customer: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
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

  const formattedData = store.orders.map((order) => ({
    id: order.id,
    customer: order.customer.rucName,
    status: order.status,
    paymentStatus: order.paymentStatus,
    total: order.total,
  }));

  return (
    <div className="w-full flex flex-col p-4 gap-y-2">
      <div className="p-4">
        <h2 className="text-xl text-muted-foreground">Tus ingresos totales</h2>
        <p className="text-4xl font-semibold text-primary">
          {formatter.format(
            store.orders.reduce((acc, order) => acc + order.total, 0)
          )}
        </p>
      </div>
      <section className="w-full grid md:grid-cols-3 gap-2">
        <StatsCard
          title="Productos"
          value={store?.products.length.toString()}
          icon={<Package className="text-primary size-20" />}
        />
        <StatsCard
          title="Categorias"
          value={store?.categories.length.toString()}
          icon={<Layers2 className="text-primary size-20" />}
        />
        <StatsCard
          title="Pedidos"
          value={store?.orders.length.toString()}
          icon={<ClipboardCheck className="text-primary size-20" />}
        />
      </section>
      <Card>
        <CardHeader>
          <CardTitle>Ultimos pedidos</CardTitle>
          <CardDescription>Aqui puedes ver tus ultimos pedidos</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable data={formattedData} columns={columns} disabledSearch />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
