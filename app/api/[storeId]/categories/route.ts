import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, storeId } = body;

    if (!storeId) {
      return NextResponse.json(
        { error: "Missing required storeId" },
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

export async function GET(
  request: Request,
  params: { params: { storeId: string } }
) {
  try {
    const { storeId } = params.params;
    if (!storeId) {
      return NextResponse.json(
        { error: "Store id is required" },
        { status: 400 }
      );
    }

    const categories = await prismadb.category.findMany({
      where: {
        storeId,
      },
      include: {
        products: {
          select: {
            id: true,
          },
        },
      },
    });

    return NextResponse.json(categories, { status: 200 });
  } catch (err) {
    console.log("[CATEGORY_GET]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
