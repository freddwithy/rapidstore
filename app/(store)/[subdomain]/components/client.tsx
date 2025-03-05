
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
import getCategories from "@/actions/get-categories";
import ProductCardSkeleton from "./ui/skeletons/product-card-skeleton";
import ProductsSkeleton from "./ui/skeletons/products-skeleton";

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

const ProductsClientComponent: React.FC<ClientComponentProps> = async ({
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
        <Suspense fallback={<ProductsSkeleton numberOfProducts={4} />}>
          <ProductByCategories storeId={storeId} isFeatured={true} limit={4}  />
        </Suspense>
      </div>
      <Titles title="Explora nuestros prductos" description="Aqui encontraras todos los productos de la tienda" />
      <Suspense fallback={<ProductsSkeleton numberOfProducts={8} />}>
        <ProductByCategories storeId={storeId} />
      </Suspense>
    </div>
  );
};

export default ProductsClientComponent;
