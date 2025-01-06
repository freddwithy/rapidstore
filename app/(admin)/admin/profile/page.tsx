import prismadb from "@/lib/prismadb";

import { auth, currentUser } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";
import React from "react";
import ProfileForm from "./components/profile-form";

const ProfilePage = async () => {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");

  const user = await currentUser();

  const userDb = await prismadb.user.findUnique({
    where: {
      clerk_id: userId,
    },
  });

  return (
    <div className=" gap-4 flex flex-col">
      <ProfileForm userDb={userDb} imageUrl={user?.imageUrl} />
    </div>
  );
};

export default ProfilePage;
