import { auth } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";
import React from "react";
import StoreForm from "./components/(forms)/store-form";
import prismadb from "@/lib/prismadb";

const CreatePage = async () => {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");

  const userDb = await prismadb.user.findUnique({
    where: {
      clerk_id: userId,
    },
    include: {
      store: true,
    },
  });

  if (!userDb) return redirect("/sign-in");

  if (userDb?.user_type !== "PRO" && userDb?.store.length >= 1) {
    return redirect("/admin/upgrade");
  }

  return (
    <div className=" gap-4 flex flex-col">
      <StoreForm ownerId={userDb?.id} />
    </div>
  );
};

export default CreatePage;
