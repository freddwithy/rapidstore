import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

import prismadb from "@/lib/prismadb";
import OrderForm from "./components/order-form";

const OrderPage = async ({
  params,
}: {
  params: {
    storeId: string;
    orderId: string;
  };
}) => {
  const storeId = params.storeId;

  const customers = await prismadb.customer.findMany({
    where: {
      storeId,
    },
  });

  const products = await prismadb.product.findMany({
    where: {
      storeId,
    },
    include: {
      variants: {
        include: {
          color: true,
          variant: true,
        },
      },
      images: true,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crea un pedido</CardTitle>
        <CardDescription>Crea un pedido</CardDescription>
      </CardHeader>
      <CardContent>
        <OrderForm
          customers={customers}
          products={products}
          storeId={storeId}
        />
      </CardContent>
    </Card>
  );
};

export default OrderPage;
