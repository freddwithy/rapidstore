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
import { formatter } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { Plus, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";
import ProductByCategories from "./products";

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

interface ClientComponentProps {
  destacados: ProductWithVariants[];
  products?: ProductWithVariants[];
  storeId: string;
}

const ProductsClientComponent: React.FC<ClientComponentProps> = ({
  destacados,
  storeId,
}) => {
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
                        {/* {p.variants.map((v) => (
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
                        ))} */}
                      </div>
                      <DialogFooter>
                        {/* <Button variant="default" onClick={onAddToCart}>
                          Añadir al carrito
                        </Button> */}
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
      <Suspense fallback={<div>Loading...</div>}>
        <ProductByCategories storeId={storeId} />
      </Suspense>
    </div>
  );
};

export default ProductsClientComponent;
