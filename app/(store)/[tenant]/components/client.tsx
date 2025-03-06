import Titles from "@/components/titles";
import React, { Suspense } from "react";
import ProductByCategories from "./products";
import ProductsSkeleton from "./ui/skeletons/products-skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ClientComponentProps {
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
        <ScrollArea>
          <div className="flex gap-4">
            <Suspense fallback={<ProductsSkeleton numberOfProducts={4} />}>
              <ProductByCategories
                storeId={storeId}
                isFeatured={true}
                limit={4}
              />
            </Suspense>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <Titles
        title="Explora nuestros productos"
        description="Aqui encontraras todos los productos de la tienda"
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Suspense fallback={<ProductsSkeleton numberOfProducts={8} />}>
          <ProductByCategories storeId={storeId} />
        </Suspense>
      </div>
    </div>
  );
};

export default ProductsClientComponent;
