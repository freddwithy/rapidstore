import prismadb from "@/lib/prismadb";

import { auth } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";
import React from "react";
import ProfileForm from "./components/profile-form";

const ProfilePage = async () => {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");

  const userDb = await prismadb.user.findUnique({
    where: {
      clerk_id: userId,
    },
  });

  return (
    <div className=" gap-4 flex flex-col">
      <ProfileForm userDb={userDb} />
    </div>
  );
};

export default ProfilePage;
