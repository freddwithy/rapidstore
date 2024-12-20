"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import { ClipboardPen, Package } from "lucide-react";

type StoreWithRelations = Prisma.StoreGetPayload<{
  include: {
    categories: true;
    products: true;
    orders: true;
  };
}>;

interface StoreCardProps {
  store: StoreWithRelations;
}

const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
  const router = useRouter();
  return (
    <Card key={store.id}>
      <CardHeader>
        <CardTitle>{store.name}</CardTitle>
        <CardDescription>{store.description}</CardDescription>
        <div className="flex gap-x-2">
          {store.categories.length > 0 &&
            store.categories
              .map((category) => (
                <Badge variant="secondary" key={category.id}>
                  {category.name}
                </Badge>
              ))
              .slice(0, 4)}
        </div>
      </CardHeader>
      <CardContent>
        <p className="flex items-center">
          <Package className="size-4 mr-2" />
          {store.products.length} Productos.
        </p>
        <p className="flex items-center">
          <ClipboardPen className="size-4 mr-2" />
          {store.orders.length} Pedidos.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => router.push(`dashboard/${store.id}`)}>
          Administrar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StoreCard;
