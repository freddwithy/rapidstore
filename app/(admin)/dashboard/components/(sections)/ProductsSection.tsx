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
import { Category, Prisma } from "@prisma/client";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import ProductForm from "../(forms)/product-form";
type ProductsWithImagesAndCategories = Prisma.ProductsGetPayload<{
  include: {
    images: true;
    categories: true;
  };
}>;

interface ProductsSectionProps {
  categories: Category[];
  products: ProductsWithImagesAndCategories[];
  storeId: string | undefined;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({
  categories,
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
            <div>
              <ScrollArea className={`${products.length > 4 && "h-[300px]"}`}>
                <div className="flex flex-col gap-y-2">
                  {products.map((product) => (
                    <div
                      className="w-full border border-stone-300 p-2 flex rounded-md gap-x-2 items-center justify-center"
                      key={product.id}
                    >
                      <div className="size-11 overflow-hidden border-stone-300 border rounded-md">
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
                        <p className="font-semibold leading-none">
                          {product.name}
                        </p>
                        <span className="text-sm text-stone-500">
                          Gs. {product.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <Button className="mt-4" onClick={() => setIsOpen(true)}>
                Añadir
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-stone-500">Todavía no hay productos</p>
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
          <ProductForm
            storeId={storeId}
            categories={categories}
            onClose={() => setIsOpen(false)}
          />
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
