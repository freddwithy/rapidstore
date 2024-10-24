import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, discount, storeId, images, categoryId } =
      body;

    if (!name) {
      console.log("Missing name");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!description) {
      console.log("Missing description");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!price) {
      console.log("Missing price");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!storeId) {
      console.log("Missing storeId");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!categoryId) {
      console.log("Missing categoryId");
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
        images: {
          create: images.map((image: string) => ({
            url: image,
          })),
        },
        categories: {
          connect: [{ id: categoryId }],
        },
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
