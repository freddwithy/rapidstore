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
import React, { useState } from "react";
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
  storeId: string;
}

const CartList: React.FC<CartItem> = ({ products, storeId }) => {
  const { items, updateItem, removeAll } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const totalProducts = items.reduce((acc, item) => acc + item.quantity, 0);

  // Definir un tipo para los productos procesados
  type CartProduct = {
    id: string;
    name: string;
    images?: { url: string }[];
    quantity: number;
    price: number;
    option?: string;
    productId: string | undefined; // Permitir que productId sea undefined
    variantName?: string; // Ahora contiene '{tipo}: {opción}' (ej: 'Color: Rojo')
  };

  //mapear productos mezclando items con productos
  const productos: CartProduct[] = items
    .map((item): CartProduct | null => {
      // Buscar el producto base por su productId
      const product = products.find((product) => product.id === item.productId);
      if (!product) return null; // Si no encontramos el producto, retornamos null

      let price = 0;
      let variantName = "";

      // Determinar si es un producto con variantes o sin variantes
      if (item.optionId) {
        // Producto con variantes - buscar la variante y opción
        const variants = product.variants.find((variant) =>
          variant.options.some((option) => option.id === item.optionId)
        );

        const option = variants?.options.find(
          (option) => option.id === item.optionId
        );

        if (option) {
          // Usar el precio de la opción (con descuento si aplica)
          price = Number(option.salePrice || option.price || 0);
          // Guardar tanto el nombre de la variante como el nombre de la opción
          variantName = `${variants?.name || ""}: ${option.name || ""}`;
        }
      } else {
        // Producto sin variantes - usar el precio del producto
        price = Number(product.salePrice || product.price || 0);
      }

      return {
        id: product.id,
        name: product.name,
        images: product.images,
        quantity: item.quantity,
        price: price,
        option: item.optionId,
        productId: item.productId,
        variantName: variantName,
      };
    })
    .filter((item): item is CartProduct => item !== null); // Filtrar elementos nulos con type guard

  const total = () => {
    // Ya no necesitamos convertir el precio a Number de nuevo pues ya está como número
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
        updateItem("", itemId, newQuantity);
      } else {
        // Si es producto con variante (tiene optionId)
        updateItem(itemId, "", newQuantity);
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
      updateItem("", itemId, newQuantity);
    } else {
      // Si es producto con variante (tiene optionId)
      updateItem(itemId, "", newQuantity);
    }
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
                key={item.option || item.productId}
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
                      {item.variantName && (
                        <span className="text-xs text-muted-foreground ml-1">
                          - {item.variantName}
                        </span>
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
                      if (item.option) {
                        // Es un producto con variante
                        onRemove(item.option);
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
                      if (item.option) {
                        // Es un producto con variante
                        onAdd(item.option);
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
        </CardContent>
      </Card>
      <div>
        <CardHeader>
          <CardTitle>Datos adicionales</CardTitle>
          <CardDescription>
            Por favor, completa los siguientes datos para finalizar el pedido.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CartForm storeId={storeId} onLoadingChange={setIsLoading} />
          <div className="mt-10">
            <div className="space-y-4">
              <div className="space-y-1">
                <CardTitle>Resumen</CardTitle>
                <CardDescription>Resumen de la compra.</CardDescription>
              </div>

              <div className="flex items-center justify-between mt-4">
                <p className="text-base text-muted-foreground">Total Gs:</p>
                <p className="text-base font-semibold">
                  {formatter.format(total())}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" form="cart-form" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Realizar pedido"}
          </Button>
        </CardFooter>
      </div>
    </div>
  );
};

export default CartList;
