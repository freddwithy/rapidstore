import prismadb from "@/lib/prismadb";
import { notFound } from "next/navigation";
import React from "react";
import CartList from "./components/cart-list";
import BackButton from "@/components/back-button";

const CartPage = async ({ params }: { params: { tenant: string } }) => {
  const tenant = params.tenant;
  if (!tenant) return notFound();
  const store = await prismadb.store.findUnique({
    where: {
      url: tenant,
    },
  });
  if (!store) return <div>Esta tienda no existe</div>;
  const products = await prismadb.product.findMany({
    where: {
      storeId: store.id,
      isArchived: false,
    },
    include: {
      images: true,
      variants: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="px-2 py-4 md:py-20 w-full md:h-dvh space-y-8 animate-fade-up">
      <div className="flex flex-col w-1/2 gap-y-2">
        <div>
          <BackButton />
        </div>
      </div>
      <CartList products={products} tenant={tenant} />
    </div>
  );
};
export const dynamic = "force-dynamic"; // ⚡ Desactiva la caché estática
export default CartPage;
