import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import prismadb from "@/lib/prismadb";
import VariantForm from "./components/variant-form";

const OrderPage = async ({
  params,
}: {
  params: {
    storeId: string;
    variantId: string;
  };
}) => {
  const { storeId, variantId } = params;

  const variant = await prismadb.variant.findUnique({
    where: {
      id: variantId,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {variant?.id ? "Editar variante" : "Crear variante"}
        </CardTitle>
        <CardDescription>
          {variant?.id
            ? "Aqui podrás editar los datos de la variante."
            : "Aqui podrás crear una nueva variante."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VariantForm initialData={variant} storeId={storeId} />
      </CardContent>
    </Card>
  );
};

export default OrderPage;
