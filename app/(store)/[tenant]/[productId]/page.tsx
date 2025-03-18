import prismadb from "@/lib/prismadb";
import React, { Suspense } from "react";
import Gallery from "./components/gallery";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Options from "./components/options";
import ProductByCategories from "../components/products";
import Titles from "@/components/titles";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ProductsSkeleton from "../components/ui/skeletons/products-skeleton";

const ProductPage = async ({
  params,
}: {
  params: { productId: string; tenant: string };
}) => {
  const { productId, tenant } = params;

  const store = await prismadb.store.findUnique({
    where: {
      url: tenant,
    },
    select: {
      id: true,
    },
  });

  const product = await prismadb.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      images: true,
      variants: {
        include: {
          variant: true,
          color: true,
        },
      },
    },
  });
  if (!store) return <div>Tienda no encontrada</div>;
  if (!product) return <div>Producto no encontrado</div>;
  return (
    <div className="px-2 py-4 md:py-20 w-full space-y-8 animate-fade-up">
      <div>
        <Link
          className={buttonVariants({ variant: "outline" })}
          href={`/${tenant}`}
        >
          <ArrowLeft />
          Volver
        </Link>
      </div>
      <div className="flex flex-col md:flex-row gap-4 w-full animate-fade-up delay-100">
        <Gallery images={product?.images || []} />
        <Options product={product} />
      </div>
      <div className="space-y-4 animate-fade-up delay-200">
        <Titles
          title="Productos relacionados"
          description="Otros productos que podrían interesarte"
        />
        <Suspense fallback={<ProductsSkeleton numberOfProducts={4} />}>
          <ScrollArea>
            <div className="flex gap-4">
              <ProductByCategories
                categoryId={product.categoryId}
                storeId={store?.id}
                tenant={tenant}
                limit={4}
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </Suspense>
      </div>
    </div>
  );
};

export default ProductPage;
