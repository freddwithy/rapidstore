import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  params: { params: { categoryId: string } }
) {
  try {
    const body = await request.json();
    const { categoryId } = params.params;
    const { name, description } = body;

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
