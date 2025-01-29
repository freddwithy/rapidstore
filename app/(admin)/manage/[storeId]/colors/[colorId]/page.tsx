import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import prismadb from "@/lib/prismadb";
import ColorForm from "./components/color-form";

const OrderPage = async ({
  params,
}: {
  params: {
    storeId: string;
    colorId: string;
  };
}) => {
  const { storeId, colorId } = params;

  const color = await prismadb.color.findUnique({
    where: {
      id: colorId,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{color?.id ? "Editar color" : "Crear color"}</CardTitle>
        <CardDescription>
          {color?.id
            ? "Aqui podrás editar los datos del color."
            : "Aqui podrás crear un nuevo color."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ColorForm initialData={color} storeId={storeId} />
      </CardContent>
    </Card>
  );
};

export default OrderPage;
