"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useCart from "@/hooks/use-cart";
import { formatter, usdFormatter } from "@/lib/utils";
import { Currency, Prisma } from "@prisma/client";
import { ShoppingCart, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

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

const Cart: React.FC<CartItem> = ({ products, tenant }) => {
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
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="rounded-xl">
          {totalProducts}
          <ShoppingCart />
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-20">
        <SheetHeader>
          <SheetTitle className="md:text-xl">Carrito</SheetTitle>
          <SheetDescription className="flex justify-between items-center">
            {totalProducts} productos{" "}
            {items.length > 0 && (
              <Button
                size="sm"
                onClick={removeAll}
                type="button"
                variant="destructive"
              >
                <Trash />
                Limpiar
              </Button>
            )}
          </SheetDescription>
        </SheetHeader>
        {items.length > 0 ? (
          productos.map((item) => (
            <div
              key={item.id}
              className="border-b flex justify-between items-center py-4"
            >
              <div className="flex gap-x-2">
                <div className="rounded-md hidden md:block bg-white overflow-hidden aspect-square size-10">
                  <Image
                    src={item.images?.[0]?.url || ""}
                    width={40}
                    height={40}
                    layout="responsive"
                    alt={item.name || "Producto"}
                  />
                </div>

                <div>
                  <Link
                    href={`${tenant}/${item.id}`}
                    className="text-sm md:text-md"
                  >
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
        <SheetFooter>
          <div className="w-full py-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Productos USD:</p>
              <p className="text-sm font-semibold text-muted-foreground">
                {usdFormatter.format(total().sumUSD)}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Productos Gs:</p>
              <p className="text-sm font-semibold text-muted-foreground">
                {formatter.format(total().sumPYG)}
              </p>
            </div>

            <div className="mt-10">
              <div className="flex items-center justify-between">
                <p className="text-lg text-muted-foreground">Total USD:</p>
                <p className="text-lg font-semibold">
                  {usdFormatter.format(total().totalUSD)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-lg text-muted-foreground">Total Gs:</p>
                <p className="text-lg font-semibold">
                  {formatter.format(total().totalPYG)}
                </p>
              </div>
            </div>
            <Link
              href={`/${tenant}/cart`}
              className={buttonVariants({
                variant: "default",
                className: "w-full",
              })}
            >
              <ShoppingCart />
              Ver carrito
            </Link>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
