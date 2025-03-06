import Titles from "@/components/titles";
import React, { Suspense } from "react";
import ProductByCategories from "./products";
import ProductsSkeleton from "./ui/skeletons/products-skeleton";

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
        <Suspense fallback={<ProductsSkeleton numberOfProducts={4} />}>
          <ProductByCategories storeId={storeId} isFeatured={true} limit={4} />
        </Suspense>
      </div>
      <Titles
        title="Explora nuestros prductos"
        description="Aqui encontraras todos los productos de la tienda"
      />
      <Suspense fallback={<ProductsSkeleton numberOfProducts={8} />}>
        <ProductByCategories storeId={storeId} />
      </Suspense>
    </div>
  );
};

export default ProductsClientComponent;
