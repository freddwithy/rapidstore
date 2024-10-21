"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Prisma } from "@prisma/client";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import ProductForm from "../create-store/components/product-form";
type ProductsWithImages = Prisma.ProductsGetPayload<{
  include: {
    images: true;
  };
}>;

interface ProductsSectionProps {
  products: ProductsWithImages[];
  storeId: string | undefined;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({
  products,
  storeId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
          <CardDescription>
            Aquí podrás ver y editar los productos de tu tienda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {products.length > 0 ? (
            <ScrollArea className="h-[300px]">
              <div className="flex flex-col gap-y-2">
                {products.map((product) => (
                  <div
                    className="w-full border border-stone-300 p-2 flex rounded-md gap-x-2 items-center justify-center"
                    key={product.id}
                  >
                    <div>
                      {product.images.length > 0 ? (
                        <Image
                          src={product.images[0].url}
                          width={44}
                          height={44}
                          alt="product image"
                        />
                      ) : (
                        <ImageIcon className="size-11 text-stone-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold leading-none">Telefono 2</p>
                      <span className="text-sm text-stone-500">Gs. 30.000</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="space-y-2">
              <p className="text-stone-500">Todavía no hay productos</p>
              <Button onClick={() => setIsOpen(true)}>Añadir</Button>
            </div>
          )}
        </CardContent>
      </Card>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Añadir un producto</DrawerTitle>
            <DrawerDescription>
              Detalla el producto que quieras añadir
            </DrawerDescription>
          </DrawerHeader>
          <ProductForm storeId={storeId} />
          <DrawerFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </section>
  );
};

export default ProductsSection;
