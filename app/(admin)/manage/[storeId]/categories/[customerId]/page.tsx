import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import CustomerForm from "./components/customer-form";
import prismadb from "@/lib/prismadb";

const OrderPage = async ({
  params,
}: {
  params: {
    storeId: string;
    customerId: string;
  };
}) => {
  const { storeId, customerId } = params;

  const customer = await prismadb.customer.findUnique({
    where: {
      id: customerId,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {customer?.id ? "Editar cliente" : "Crear cliente"}
        </CardTitle>
        <CardDescription>
          {customer?.id
            ? "Aqui podrás editar los datos del cliente."
            : "Aqui podrás crear un nuevo cliente."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CustomerForm initialData={customer} storeId={storeId} />
      </CardContent>
    </Card>
  );
};

export default OrderPage;
