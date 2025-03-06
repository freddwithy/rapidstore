
import Titles from "@/components/titles";
import { Prisma } from "@prisma/client";
import React, { Suspense } from "react";
import ProductByCategories from "./products";
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
  products?: ProductWithVariants[];
  storeId: string;
}

const ProductsClientComponent: React.FC<ClientComponentProps> = async ({
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
