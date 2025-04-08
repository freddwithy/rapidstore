import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function PATCH(
  request: Request,
  params: { params: { categoryId: string } }
) {
  try {
    const body = await request.json();
    const { categoryId } = params.params;
    const { name, description, storeId } = body;
    const user = await currentUser();
    const userDb = await prismadb.user.findFirst({
      where: {
        clerk_id: user?.id,
      },
    });

    //user-store validation
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        ownerId: userDb?.id,
      },
    });

    if (!storeByUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!name || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const category = await prismadb.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json({ category }, { status: 200 });
  } catch (err) {
    console.log("[CATEGORY_PATCH]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  params: { params: { categoryId: string } }
) {
  try {
    const { categoryId } = params.params;
    const user = await currentUser();
    const userDb = await prismadb.user.findFirst({
      where: {
        clerk_id: user?.id,
      },
    });

    //user-store validation
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        ownerId: userDb?.id,
        categories: {
          some: {
            id: categoryId,
          },
        },
      },
    });

    if (!storeByUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!categoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const category = await prismadb.category.delete({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json({ category }, { status: 200 });
  } catch (err) {
    console.log("[CATEGORY_DELETE]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
