import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { CustomerClient } from "./components/client";
import prismadb from "@/lib/prismadb";

const CustomersPage = async ({ params }: { params: { storeId: string } }) => {
  const storeId = params.storeId;

  const customers = await prismadb.customer.findMany({
    where: {
      storeId,
    },
  });

  const formattedData = customers.map((customer) => ({
    id: customer.id,
    rucName: customer.rucName,
    ruc: customer.ruc,
    email: customer.email,
    tel: customer.tel,
  }));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes</CardTitle>
        <CardDescription>
          Aquí podrás ver y editar los clientes de tu tienda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CustomerClient data={formattedData} />
      </CardContent>
    </Card>
  );
};

export default CustomersPage;
