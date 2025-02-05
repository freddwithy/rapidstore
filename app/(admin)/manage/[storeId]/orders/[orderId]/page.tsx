import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import OrderForm from "./components/order-form";
import prismadb from "@/lib/prismadb";

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

  const products = await prismadb.products.findMany({
    where: {
      storeId,
    },
    include: {
      variants: true,
      colors: true,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crea un pedido</CardTitle>
        <CardDescription>Crea un pedido</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};

export default OrderPage;
