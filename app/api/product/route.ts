import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, discount, storeId, images, categories } =
      body;

    if (
      !name ||
      !description ||
      !price ||
      !discount ||
      !storeId ||
      !images ||
      !categories
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await prismadb.products.create({
      data: {
        name,
        description,
        price,
        discount,
        storeId,
        images,
        categories,
      },
    });

    return NextResponse.json({ product }, { status: 200 });
  } catch (err) {
    console.log("[STORE_POST]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
