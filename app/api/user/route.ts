import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, clerkId } = body;

    if (!username || !email || !clerkId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const userFound = await prismadb.user.findUnique({
      where: {
        clerk_id: clerkId,
        username,
        email,
      },
    });

    if (userFound?.email === email) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    if (userFound?.username === username) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    if (userFound?.clerk_id === clerkId) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const user = await prismadb.user.create({
      data: {
        username,
        email,
        clerk_id: clerkId,
      },
    });

    return NextResponse.json(user);
  } catch (err) {
    console.log("[USER_POST]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
