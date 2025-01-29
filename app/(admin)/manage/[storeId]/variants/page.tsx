import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { VariantClient } from "./components/client";
import prismadb from "@/lib/prismadb";

const VariantsPage = async ({ params }: { params: { storeId: string } }) => {
  const storeId = params.storeId;

  const variants = await prismadb.variant.findMany({
    where: {
      storeId,
    },
  });

  const formattedData = variants.map((customer) => ({
    id: customer.id,
    name: customer.name,
    description: customer.description,
  }));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Variantes de productos</CardTitle>
        <CardDescription>
          Aquí podrás ver y editar las variantes de los productos de tu tienda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VariantClient data={formattedData} />
      </CardContent>
    </Card>
  );
};

export default VariantsPage;
