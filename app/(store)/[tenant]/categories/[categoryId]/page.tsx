import prismadb from "@/lib/prismadb";
import React from "react";
import ProductCard from "../../components/ui/product-card";
import Titles from "@/components/titles";
import BackButton from "@/components/back-button";

const CategoryPage = async ({
  params,
}: {
  params: { categoryId: string; tenant: string };
}) => {
  const { categoryId, tenant } = params;

  const store = await prismadb.store.findUnique({
    where: {
      url: tenant,
    },
  });

  const category = await prismadb.category.findFirst({
    where: {
      id: categoryId,
    },
    include: {
      products: {
        include: {
          images: true,
          variants: {
            include: {
              variant: true,
              color: true,
            },
          },
        },
      },
    },
  });

  if (!store) return <div>Tienda no encontrada</div>;
  if (!category) return <div>Categoria no encontrada</div>;

  return (
    <div className="px-2 py-4 md:py-20 w-full space-y-8 animate-fade-up">
      <BackButton />
      <div className="space-y-4">
        <Titles
          description={category?.products.length + " productos"}
          title={category?.name}
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {category?.products.map((p) => (
            <ProductCard product={p} tenant={tenant} key={p.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
