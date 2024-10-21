import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { UserButton } from "@clerk/nextjs";
import ProductsSection from "./components/ProductsSection";
import Header from "./components/Header";
import StoreSection from "./components/StoreSection";

const Page = async () => {
  const user = await currentUser();

  const store = await prismadb.store.findFirst({
    where: {
      ownerId: user?.id,
    },
  });

  const products = await prismadb.products.findMany({
    where: {
      storeId: store?.id,
    },
    include: {
      images: true,
    },
  });

  return (
    <section className="w-full h-dvh p-4 space-y-6">
      <Header username={user?.username} profileImageUrl={user?.imageUrl} />
      <StoreSection store={store} ownerId={user?.id} />
      {store && <ProductsSection products={products} storeId={store.id} />}
      <UserButton afterSwitchSessionUrl="/sign-in" />
    </section>
  );
};

export default Page;
