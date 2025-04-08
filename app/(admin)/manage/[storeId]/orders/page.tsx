import prismadb from "@/lib/prismadb";
import { OrderClient } from "./components/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const OrdersPage = async ({
  params,
}: {
  params: {
    storeId: string;
  };
}) => {
  const storeId = params.storeId;

  const orders = await prismadb.order.findMany({
    where: {
      storeId,
    },
    include: {
      customer: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedData = orders.map((order) => ({
    id: order.id,
    customer: order.customer.rucName,
    status: order.status,
    paymentStatus: order.paymentStatus,
    total: order.total,
    storeId: order.storeId,
    createdAt: order.createdAt,
  }));

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Pedidos</CardTitle>
        <CardDescription>
          Aquí podrás ver y editar los pedidos de tu tienda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OrderClient data={formattedData} />
      </CardContent>
    </Card>
  );
};

export default OrdersPage;
