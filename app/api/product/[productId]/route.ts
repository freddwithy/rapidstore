import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  params: { params: { productId: string } }
) {
  try {
    const { productId } = params.params;
    const body = await request.json();
    const {
      name,
      description,
      price,
      discount,
      isArchived,
      storeId,
      images,
      categories,
      variants,
      colors,
    } = body;

    if (!productId) {
      console.log("Missing productId");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

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

    if (!categories || !variants || !colors) {
      console.log("Missing categories, variants or colors");
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

    await prismadb.products.update({
      where: {
        id: productId,
      },
      data: {
        name,
        description,
        price,
        discount,
        isArchived,
        storeId,
        images: {
          deleteMany: {},
        },
        categories: {
          set: [],
        },
        variants: {
          set: [],
        },
        colors: {
          set: [],
        },
      },
    });

    const product = await prismadb.products.update({
      where: {
        id: productId,
      },
      data: {
        images: {
          createMany: {
            data: images.map((image: string) => ({ url: image })),
          },
        },
        categories: {
          connect: categories.map((category: string) => ({ id: category })),
        },
        variants: {
          connect: variants.map((variant: string) => ({ id: variant })),
        },
        colors: {
          connect: colors.map((color: string) => ({ id: color })),
        },
      },
    });

    return NextResponse.json({ product }, { status: 200 });
  } catch (err) {
    console.log("[PRODUCT_PATCH]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
