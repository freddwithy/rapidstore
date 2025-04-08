import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, storeId } = body;
    const user = await currentUser();
    const userDb = await prismadb.user.findFirst({
      where: {
        clerk_id: user?.id,
      },
    });

    if (!storeId) {
      return NextResponse.json(
        { error: "Missing required storeId" },
        { status: 400 }
      );
    }

    const existingCategories = await prismadb.category.findMany({
      where: {
        storeId,
      },
    });

    if (existingCategories.length >= 3 && userDb?.user_type === "FREE") {
      return NextResponse.json(
        { error: "You can't add more than 3 categories" },
        { status: 400 }
      );
    }

    if (!name || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const category = await prismadb.category.create({
      data: {
        name,
        description,
        storeId,
      },
    });

    return NextResponse.json({ category }, { status: 200 });
  } catch (err) {
    console.log("[CATEGORY_POST]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
