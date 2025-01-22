import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crea un cliente</CardTitle>
        <CardDescription>
          Controla todos los datos de tus clientes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CustomerForm storeId={storeId} />
      </CardContent>
    </Card>
  );
};

export default OrderPage;
