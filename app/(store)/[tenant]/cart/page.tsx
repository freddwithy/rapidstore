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
      status: "EN_VENTA",
    },
    include: {
      images: true,
      variants: {
        include: {
          options: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="px-4 py-4 md:py-20 w-full md:h-dvh space-y-8 animate-fade-up">
      <div className="flex flex-col w-1/2 gap-y-2">
        <div>
          <BackButton />
        </div>
      </div>
      <CartList products={products} tenant={tenant} storeId={store.id} />
    </div>
  );
};

export default CartPage;
