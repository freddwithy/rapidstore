import React from "react";
import StoreForm from "./components/store-form";
import { currentUser } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import DeleteStore from "./components/delete-store";

const ConfigPage = async ({ params }: { params: { storeId: string } }) => {
  const storeId = params.storeId;
  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
  }
  const userDb = await prismadb.user.findUnique({
    where: {
      clerk_id: user.id,
    },
  });

  const store = await prismadb.store.findUnique({
    where: {
      id: storeId,
    },
  });

  if (!store) {
    return redirect("/admin");
  }
  return (
    <div className="space-y-4">
      <StoreForm store={store} ownerId={userDb?.id} storeId={storeId} />
      <DeleteStore storeId={storeId} />
    </div>
  );
};

export default ConfigPage;
