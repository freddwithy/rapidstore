import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { ColorClient } from "./components/client";
import prismadb from "@/lib/prismadb";

const ColorsPage = async ({ params }: { params: { storeId: string } }) => {
  const storeId = params.storeId;

  const colors = await prismadb.color.findMany({
    where: {
      storeId,
    },
  });

  const formattedData = colors.map((color) => ({
    id: color.id,
    name: color.name,
    value: color.value,
  }));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Colores</CardTitle>
        <CardDescription>
          Aqui podras ver y editar los colores para productos de tu tienda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ColorClient data={formattedData} />
      </CardContent>
    </Card>
  );
};

export default ColorsPage;
