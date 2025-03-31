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
import { formatter, usdFormatter } from "@/lib/utils";
import { Currency, Prisma } from "@prisma/client";
import { Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import CartForm from "./cart-form";

type ProductWithVariants = Prisma.ProductGetPayload<{
  include: {
    variants: true;
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
  //mapear productos mezclando items con productos
  const productos = items.map((item) => {
    const product = products.find((product) =>
      product.variants.find((variant) => variant.id === item.variantId)
    );
    return {
      ...product,
      quantity: item.quantity,
      price:
        product?.variants.find((variant) => variant.id === item.variantId)
          ?.price || 0,

      variant: product?.variants.find(
        (variant) => variant.id === item.variantId
      ),
    };
  });

  const total = () => {
    const variantsUSD = productos.filter(
      (item) => item.variant?.currency === "USD"
    );
    const variantsPYG = productos.filter(
      (item) => item.variant?.currency === "PYG"
    );

    const sumUSD = variantsUSD.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const sumPYG = variantsPYG.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const pygConverted = Number(sumPYG / 8000);
    const usdConverted = sumUSD * 8000;

    const totalUSD = sumUSD + pygConverted;
    const totalPYG = sumPYG + usdConverted;
    return {
      usdConverted,
      pygConverted,
      sumUSD,
      sumPYG,
      totalUSD,
      totalPYG,
    };
  };
  const onRemove = (variantId: string) => {
    const cartItem = items.find((item) => item.variantId === variantId);
    console.log(cartItem);
    updateItem(variantId, (cartItem?.quantity ?? 1) - 1 || 0);
  };

  const onAdd = (variantId: string) => {
    const cartItem = items.find((item) => item.variantId === variantId);
    updateItem(variantId, (cartItem?.quantity ?? 0) + 1);
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
                      {item.variant?.currency === Currency.USD
                        ? usdFormatter.format(item.variant?.price || 0)
                        : formatter.format(item.variant?.price || 0)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-x-2 items-center justify-around">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(item.variant?.id || "")}
                  >
                    -
                  </Button>
                  <p>{item.quantity}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onAdd(item.variant?.id || "")}
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
              <p className="text-base text-muted-foreground">Total USD:</p>
              <p className="text-base font-semibold">
                {usdFormatter.format(total().totalUSD)}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-base text-muted-foreground">Total Gs:</p>
              <p className="text-base font-semibold">
                {formatter.format(total().totalPYG)}
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
