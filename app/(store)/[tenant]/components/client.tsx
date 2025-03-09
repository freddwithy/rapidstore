import Titles from "@/components/titles";
import React, { Suspense } from "react";
import ProductByCategories from "./products";
import ProductsSkeleton from "./ui/skeletons/products-skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import getCategories from "@/actions/get-categories";

interface ClientComponentProps {
  storeId: string;
}

const ProductsClientComponent: React.FC<ClientComponentProps> = async ({
  storeId,
}) => {
  const categories = await getCategories({ storeId });
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
      {categories.map((cat) => (
        <div key={cat.id} className="space-y-4">
          {cat.products.length > 0 && (
            <Titles
              title={cat.name}
              description={
                cat.description
                  ? cat.description[0].toUpperCase() + cat.description.slice(1)
                  : "Categoría de productos"
              }
            />
          )}
          <ScrollArea>
            <div className="flex gap-4">
              <Suspense fallback={<ProductsSkeleton numberOfProducts={4} />}>
                <ProductByCategories storeId={storeId} categoryId={cat.id} />
              </Suspense>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      ))}
    </div>
  );
};

export default ProductsClientComponent;
