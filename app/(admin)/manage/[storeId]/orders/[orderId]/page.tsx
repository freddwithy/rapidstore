import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

import prismadb from "@/lib/prismadb";
import OrderForm from "./components/order-form";
import { Button } from "@/components/ui/button";

const OrderPage = async ({
  params,
}: {
  params: {
    storeId: string;
    orderId: string;
  };
}) => {
  const storeId = params.storeId;
  const orderId = params.orderId;

  const order = await prismadb.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderProducts: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

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
          initialData={order}
        />
      </CardContent>
    </Card>
  );
};

export default OrderPage;
