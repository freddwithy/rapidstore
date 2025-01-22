import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import prismadb from "@/lib/prismadb";
import CustomerForm from "./components/customer-form";

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
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crea un pedido</CardTitle>
        <CardDescription>Crea un pedido</CardDescription>
      </CardHeader>
      <CardContent>
        <CustomerForm
          products={products}
          storeId={storeId}
          customers={customers}
        />
      </CardContent>
    </Card>
  );
};

export default OrderPage;
