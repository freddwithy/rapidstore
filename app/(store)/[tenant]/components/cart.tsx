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
import { formatter } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { ShoppingCart, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

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

const Cart: React.FC<CartItem> = ({ products, tenant }) => {
  const { items, updateItem, removeAll } = useCart();
  const totalProducts = items.reduce((acc, item) => acc + item.quantity, 0);
  //mapear productos mezclando items con productos
  const productos = items.map((item) => {
    let product;
    let price = 0;
    let variant = null;
    
    if (item.optionId) {
      // Es un producto con variantes
      product = products.find((p) =>
        p.variants.some((v) =>
          v.options.some((o) => o.id === item.optionId)
        )
      );
      
      if (product) {
        // Buscar la variante y opción correcta
        const foundVariant = product.variants.find((v) =>
          v.options.some((o) => o.id === item.optionId)
        );
        
        const option = foundVariant?.options.find((o) => o.id === item.optionId);
        
        price = option?.salePrice || option?.price || 0;
        variant = foundVariant;
      }
    } else if (item.productId) {
      // Es un producto sin variantes
      product = products.find((p) => p.id === item.productId);
      price = product?.salePrice || product?.price || 0;
    }
    
    return {
      ...product,
      quantity: item.quantity,
      price,
      variant,
      optionId: item.optionId,
      productId: item.productId,
    };
  }).filter(item => item.id); // Filtrar items que no se pudieron encontrar

  const total = () => {
    const sum = productos.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    return sum;
  };

  const onRemove = (itemId: string, isProductId: boolean = false) => {
    const cartItem = isProductId
      ? items.find((item) => item.productId === itemId)
      : items.find((item) => item.optionId === itemId);
      
    if (cartItem) {
      const newQuantity = (cartItem.quantity ?? 1) - 1;
      // Si es producto sin variante (solo productId)
      if (isProductId) {
        updateItem('', itemId, newQuantity);
      } else {
        // Si es producto con variante (tiene optionId)
        updateItem(itemId, '', newQuantity);
      }
    }
  };

  const onAdd = (itemId: string, isProductId: boolean = false) => {
    const cartItem = isProductId
      ? items.find((item) => item.productId === itemId)
      : items.find((item) => item.optionId === itemId);
    
    const newQuantity = (cartItem?.quantity ?? 0) + 1;
    // Si es producto sin variante (solo productId)
    if (isProductId) {
      updateItem('', itemId, newQuantity);
    } else {
      // Si es producto con variante (tiene optionId)
      updateItem(itemId, '', newQuantity);
    }
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
              key={item.optionId || item.productId}
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
                    className="text-sm md:text-md line-clamp-3"
                  >
                    {item.name?.slice(0, 25)}
                    {item.variant?.name && item.variant.name !== item.name && (
                      <span className="text-xs text-muted-foreground"> - {item.variant.name}</span>
                    )}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {formatter.format(item.price)}
                  </p>
                </div>
              </div>
              <div className="flex gap-x-2 items-center justify-around">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (item.optionId) {
                      // Es un producto con variante
                      onRemove(item.optionId);
                    } else if (item.productId) {
                      // Es un producto sin variante
                      onRemove(item.productId, true);
                    }
                  }}
                >
                  -
                </Button>
                <p>{item.quantity}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (item.optionId) {
                      // Es un producto con variante
                      onAdd(item.optionId);
                    } else if (item.productId) {
                      // Es un producto sin variante
                      onAdd(item.productId, true);
                    }
                  }}
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
            <div className="mt-10">
              <div className="flex items-center justify-between">
                <p className="text-base text-muted-foreground">Total Gs:</p>
                <p className="text-base font-semibold">
                  {formatter.format(total())}
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
