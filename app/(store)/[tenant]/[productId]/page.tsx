import prismadb from "@/lib/prismadb";
import React, { Suspense } from "react";
import Gallery from "./components/gallery";
import Options from "./components/options";
import ProductByCategories from "../components/products";
import Titles from "@/components/titles";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ProductsSkeleton from "../components/ui/skeletons/products-skeleton";
import BackButton from "@/components/back-button";

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
    <div className="px-4 py-4 md:py-20 w-full space-y-8 animate-fade-up">
      <BackButton />
      <div className="flex flex-col md:flex-row gap-4 w-full animate-fade-up delay-100">
        <div>
          <Gallery images={product?.images || []} />
        </div>

        <Options product={product} />
      </div>
      <div className="space-y-4 animate-fade-up delay-200">
        <Titles
          title="Productos relacionados"
          description="Otros productos que podrían interesarte"
        />
        <Suspense fallback={<ProductsSkeleton numberOfProducts={4} />}>
          <ScrollArea>
            <div className="md:grid md:grid-cols-4 flex gap-4">
              <ProductByCategories
                categoryId={product.categoryId}
                storeId={store?.id}
                tenant={tenant}
                limit={4}
                forScroll={true}
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
