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
import { Prisma, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import { Package } from "lucide-react";
import { Progress } from "./ui/progress";

type StoreWithRelations = Prisma.StoreGetPayload<{
  include: {
    categories: true;
    products: true;
    orders: true;
  };
}>;

interface StoreCardProps {
  store: StoreWithRelations;
  user: User | null;
}

const StoreCard: React.FC<StoreCardProps> = ({ store, user }) => {
  const router = useRouter();

  const maxProducts = user?.user_type === "FREE" ? 10 : 100;

  const progress = (store.products.length / maxProducts) * 100;

  return (
    <Card key={store.id} className="bg-secondary">
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
        <div className="space-y-2">
          <p className="font-semibold text-sm">Productos en tienda:</p>
          <Progress value={progress} />
          <div className="flex justify-between">
            <p className="flex items-center gap-x-1 text-sm text-muted-foreground">
              {store.products.length} <Package className="size-4" />{" "}
            </p>
            <p className="text-sm text-muted-foreground">{maxProducts}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => router.push(`/admin/${store.id}`)}>
          Administrar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StoreCard;
