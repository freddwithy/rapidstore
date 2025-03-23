import Titles from "@/components/titles";
import React, { Suspense } from "react";
import ProductByCategories from "./products";
import ProductsSkeleton from "./ui/skeletons/products-skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
        <ScrollArea>
          <div className="md:grid md:grid-cols-4 flex gap-4">
            <Suspense fallback={<ProductsSkeleton numberOfProducts={4} />}>
              <ProductByCategories
                storeId={storeId}
                tenant={tenant}
                isFeatured={true}
                limit={4}
                forScroll={true}
              />
            </Suspense>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      {categories.map((cat) => (
        <div
          key={cat.id}
          className="space-y-4 animate-fade-up delay-150"
          id={cat.name}
        >
          {cat.products.length > 0 && (
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
                  className: "text-muted-foreground",
                })}
              >
                Ver todo
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          )}
          <ScrollArea className="">
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
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      ))}
    </div>
  );
};

export default ProductsClientComponent;
