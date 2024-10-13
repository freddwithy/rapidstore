import React from "react";
import Header from "./components/header";
import { currentUser } from "@clerk/nextjs/server";
import StoreSection from "./components/storeSection";
import prismadb from "@/lib/prismadb";
import { UserButton } from "@clerk/nextjs";

const Page = async () => {
  const user = await currentUser();

  const store = await prismadb.store.findFirst({
    where: {
      ownerId: user?.id,
    },
  });

  return (
    <section className="w-full h-dvh p-4">
      <Header username={user?.username} profileImageUrl={user?.imageUrl} />
      <StoreSection store={store} />
      <UserButton />
    </section>
  );
};

export default Page;
