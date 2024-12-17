import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import Header from "./components/Header";
import StatsCard from "@/components/stats-card";
import { Layers2, Package } from "lucide-react";

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
      categories: true,
    },
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId: store?.id,
    },
  });

  return (
    <div className="w-full flex flex-col">
      <Header />
      <section className="w-full p-2 grid md:grid-cols-3 gap-2 grid-rows-2">
        <StatsCard
          title="Productos"
          value={products.length.toString()}
          icon={<Package className="text-zinc-700 size-20" />}
        />
        <StatsCard
          title="Categorias"
          value={categories.length.toString()}
          icon={<Layers2 className="text-zinc-700 size-20" />}
        />
        <StatsCard
          title="Categorias"
          value={categories.length.toString()}
          icon={<Layers2 className="text-zinc-700 size-20" />}
        />
      </section>
    </div>
  );
};

export default Page;
