import prismadb from "@/lib/prismadb";
import { notFound } from "next/navigation";
import React from "react";
import CartList from "./components/cart-list";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

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
    <div className="py-20 w-full h-dvh space-y-4">
      <div className="flex flex-col w-1/2 gap-y-2">
        <div>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href={`/${tenant}`}
          >
            <ArrowLeft />
            Volver
          </Link>
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Carrito</h1>
          <p className="text-md text-muted-foreground">
            Estás comprando en la tienda de {store.name}
          </p>
        </div>
      </div>
      <CartList products={products} tenant={tenant} />
    </div>
  );
};
export const dynamic = "force-dynamic"; // ⚡ Desactiva la caché estática
export default CartPage;
