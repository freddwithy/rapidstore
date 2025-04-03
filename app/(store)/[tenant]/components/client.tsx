import Titles from "@/components/titles";
import React, { Suspense } from "react";
import ProductByCategories from "./products";
import ProductsSkeleton from "./ui/skeletons/products-skeleton";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import prismadb from "@/lib/prismadb";

interface ClientComponentProps {
  storeId: string;
  tenant: string;
}

const ProductsClientComponent: React.FC<ClientComponentProps> = async ({
  storeId,
  tenant,
}) => {
  const categories = await prismadb.category.findMany({
    where: {
      storeId,
    },
    include: {
      products: true,
    },
  });
  return (
    <div className="space-y-8">
      <div className="space-y-4 animate-fade-up delay-100">
        <Titles
          title="Destacados"
          description="Productos destacados de la tienda"
        />
        <div className="flex gap-4 overflow-x-scroll no-scrollbar">
          <Suspense fallback={<ProductsSkeleton numberOfProducts={6} />}>
            <ProductByCategories
              storeId={storeId}
              tenant={tenant}
              isFeatured={true}
              limit={10}
              forScroll={true}
            />
          </Suspense>
        </div>
      </div>
      {categories.map((cat) => (
        <div
          key={cat.id}
          className="space-y-4 animate-fade-up delay-150"
          id={cat.name}
        >
          {
            -(
              <div className="flex gap-2 items-center">
                <Titles
                  title={cat.name}
                  description={
                    cat.description
                      ? cat.description[0].toUpperCase() +
                        cat.description.slice(1)
                      : "Categoría de productos"
                  }
                />
                <Link
                  href={`/${tenant}/categories/${cat.id}`}
                  className={buttonVariants({
                    variant: "link",
                    className: "text-secondary-foreground",
                  })}
                >
                  Ver todo
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            )
          }
          <div className=" grid grid-cols-2 md:grid-cols-4 gap-4">
            <Suspense fallback={<ProductsSkeleton numberOfProducts={10} />}>
              <ProductByCategories
                storeId={storeId}
                categoryId={cat.id}
                tenant={tenant}
                limit={20}
              />
            </Suspense>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsClientComponent;
