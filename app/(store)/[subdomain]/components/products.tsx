"use client";
import Titles from "@/components/titles";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import useCart, { OrderProductHook } from "@/hooks/use-cart";
import { formatter } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { Plus, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

type ProductWithVariants = Prisma.ProductGetPayload<{
  include: {
    variants: {
      include: {
        variant: true;
        color: true;
      };
    };
    images: true;
  };
}>;

type CategoryWithProducts = Prisma.CategoryGetPayload<{
  include: {
    products: {
      include: {
        variants: {
          include: {
            variant: true;
            color: true;
          };
        };
        images: true;
      };
    };
  };
}>;

interface ProductsComponentProps {
  destacados: ProductWithVariants[];
  categories: CategoryWithProducts[];
  products?: ProductWithVariants[];
}

const ProductsComponent: React.FC<ProductsComponentProps> = ({
  destacados,
  categories,
  products,
}) => {
  const [variantSelected, setVariantSelected] = useState("");
  const { addItem, items } = useCart();

  const item: OrderProductHook = {
    variantId: variantSelected,
    quantity: 1,
    total:
      products
        ?.find((p) => p.variants.find((v) => v.id === variantSelected))
        ?.variants.find((v) => v.id === variantSelected)?.price ?? 0,
  };

  console.log(items);
  const onAddToCart = () => {
    addItem(item);
    toast.success("Producto añadido al carrito");
  };
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Titles
          title="Destacados"
          description="Productos destacados de la tienda"
        />
        <ScrollArea className="max-w-[1080px]">
          <div className="flex gap-4">
            {destacados.map((p) => (
              <div
                key={p.id}
                className="border rounded-xl p-4 bg-secondary relative"
              >
                <div className="flex flex-col gap-4 relative group">
                  <Link
                    className="rounded-lg size-52 bg-white overflow-hidden group relative"
                    href={`/${p.id}`}
                  >
                    <Image
                      className="group-hover:scale-105 transition-transform duration-300 object-cover"
                      src={p.images[0].url}
                      alt={p.name}
                      width={208}
                      height={208}
                    />
                    <Star className="size-4 top-2 left-2 absolute text-yellow-500" />
                  </Link>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="absolute top-1 right-1 z-10"
                        size="icon"
                      >
                        <Plus />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Selecciona una variante</DialogTitle>
                        <DialogDescription>
                          Este producto tiene varias opciones, selecciona una
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex gap-4 flex-wrap">
                        {p.variants.map((v) => (
                          <button
                            key={v.id}
                            onClick={() => setVariantSelected(v.id)}
                            className={`border rounded-lg px-2 py-1 ${
                              variantSelected === v.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-bg-primary-foreground"
                            }`}
                          >
                            {v.variant.name + " " + v.color.name}
                          </button>
                        ))}
                      </div>
                      <DialogFooter>
                        <Button variant="default" onClick={onAddToCart}>
                          Añadir al carrito
                        </Button>
                        <DialogClose asChild>
                          <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Link className="space-y-2" href={`/${p.id}`}>
                    <div>
                      <h1 className="text-xl font-semibold">{p.name}</h1>
                      <p className="text-sm text-muted-foreground">
                        {p.description}
                      </p>
                    </div>
                    <span className="text-foreground">
                      {formatter.format(p.variants[0].price)}
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" hidden />
        </ScrollArea>
      </div>

      {categories.map((cat) => (
        <div key={cat.name} className="space-y-4" id={cat.name}>
          <Titles
            title={cat.name}
            description={
              cat.products.length +
              (cat.products.length > 1 ? " productos" : " producto")
            }
          />
          <ScrollArea className="max-w-[1080px]">
            <div className="flex w-full gap-4">
              {cat.products.map((p) => (
                <Link
                  key={p.id}
                  href={`/${p.id}`}
                  className="border rounded-xl p-4 bg-primary-foreground"
                >
                  <div className="flex flex-col gap-4">
                    <div className="rounded-lg size-52 bg-white overflow-hidden group relative">
                      <Image
                        className="group-hover:scale-105 transition-transform duration-300"
                        src={p.images[0].url}
                        alt={p.name}
                        width={208}
                        height={208}
                      />
                      <Button
                        className="absolute top-1 right-1 z-10"
                        size="icon"
                      >
                        <Plus />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <h1 className="text-xl font-semibold">{p.name}</h1>
                        <p className="text-sm text-muted-foreground">
                          {p.description}
                        </p>
                      </div>
                      <span className="text-foreground">
                        {formatter.format(p.variants[0].price)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      ))}
    </div>
  );
};

export default ProductsComponent;
