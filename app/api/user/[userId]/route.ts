import prismadb from "@/lib/prismadb";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  params: { params: { userId: string } }
) {
  try {
    const body = await request.json();
    const { username } = body;
    const userId = params.params.userId;

    if (!username || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const userDb = await prismadb.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userDb) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const res = await clerkClient.users.updateUser(userDb?.clerk_id, {
      username,
    });

    if (!res) {
      return NextResponse.json(
        { error: "Could not update username" },
        { status: 500 }
      );
    }

    const user = await prismadb.user.update({
      where: {
        id: userId,
      },
      data: {
        username,
      },
    });

    return NextResponse.json(user);
  } catch (err) {
    console.log("[USER_PATCH]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
