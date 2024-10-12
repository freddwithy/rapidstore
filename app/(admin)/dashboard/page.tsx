import React from "react";
import Header from "./components/header";
import { currentUser } from "@clerk/nextjs/server";
import StoreSection from "./components/storeSection";
import prismadb from "@/lib/prismadb";

const Page = async () => {
  const user = await currentUser();

  const store = await prismadb.store.findFirst({
    where: {
      ownerId: user?.id,
    },
  });

  return (
    <section className="w-full bg-stone-100 h-dvh p-6">
      <Header username={user?.username} profileImageUrl={user?.imageUrl} />
      <StoreSection store={store} />
    </section>
  );
};

export default Page;
