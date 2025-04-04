"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useCart from "@/hooks/use-cart";
import { formatter } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import CartForm from "./cart-form";

type ProductWithVariants = Prisma.ProductGetPayload<{
  include: {
    variants: {
      include: {
        options: true;
      };
    };
    images: true;
  };
}>;

interface CartItem {
  products: ProductWithVariants[];
  tenant: string;
}

const CartList: React.FC<CartItem> = ({ products }) => {
  const { items, updateItem, removeAll } = useCart();
  const totalProducts = items.reduce((acc, item) => acc + item.quantity, 0);

  console.log(items);
  //mapear productos mezclando items con productos
  const productos = items.map((item) => {
    const product = products.find((product) => product.id === item.productId);
    //filtrar dentro de variants las opciones
    const variants = product?.variants.find((variant) =>
      variant.options.find((option) => option.id === item.optionId)
    );

    const option = variants?.options.find(
      (option) => option.id === item.optionId
    );

    const precios = () => {
      if (option?.id) {
        if (option?.salePrice) {
          return { price: Number(option?.salePrice) };
        }

        return { price: Number(option?.price || 0) };
      }

      if (product?.id) {
        if (product?.salePrice) {
          return { price: Number(product?.salePrice) };
        }

        return { price: Number(product?.price || 0) };
      }
    };

    console.log(precios());
    return {
      ...product,
      quantity: item.quantity,
      price: precios()?.price || 0,
      option: item.optionId,
    };
  });

  const total = () => {
    const sum = productos.reduce(
      (acc, item) => acc + Number(item.price) * item.quantity,
      0
    );
    return sum;
  };
  const onRemove = (optionId: string) => {
    const cartItem = items.find((item) => item.optionId === optionId);
    console.log(cartItem);
    updateItem(optionId, (cartItem?.quantity ?? 1) - 1 || 0);
  };

  const onAdd = (optionId: string) => {
    const cartItem = items.find((item) => item.optionId === optionId);
    updateItem(optionId, (cartItem?.quantity ?? 0) + 1);
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full animate-fade-up delay-100">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Tu carrito ({totalProducts})</CardTitle>
            <CardDescription>Estos son tus productos.</CardDescription>
          </div>
          {items.length > 0 && (
            <Button variant="destructive" onClick={removeAll}>
              <Trash /> Limpiar
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {items.length > 0 ? (
            productos.map((item) => (
              <div
                key={item.id}
                className="border-b flex justify-between items-center py-4"
              >
                <div className="flex gap-x-2">
                  <div className="rounded-md bg-white overflow-hidden aspect-square size-14">
                    <Image
                      src={item.images?.[0]?.url || ""}
                      width={56}
                      height={56}
                      className="object-cover object-center"
                      alt={item.name || "Producto"}
                    />
                  </div>

                  <div>
                    <Link href={`${item.id}`} className="text-sm">
                      {item.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {formatter.format(Number(item.price))}
                    </p>
                  </div>
                </div>
                <div className="flex gap-x-2 items-center justify-around">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(item.option || "")}
                  >
                    -
                  </Button>
                  <p>{item.quantity}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onAdd(item.option || "")}
                  >
                    +
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                No hay productos en el carrito
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <div>
        <CardHeader>
          <CardTitle>Resumen</CardTitle>
          <CardDescription>Total al pagar</CardDescription>
        </CardHeader>
        <CardContent>
          <CartForm />
          <div className="mt-10">
            <div className="flex items-center justify-between">
              <p className="text-base text-muted-foreground">Total Gs:</p>
              <p className="text-base font-semibold">
                {formatter.format(total())}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Realizar pedido</Button>
        </CardFooter>
      </div>
    </div>
  );
};

export default CartList;
