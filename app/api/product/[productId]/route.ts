import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { Option, Values } from "../route";

export async function PATCH(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const productId = params.productId;
    const body = await request.json();
    const {
      name,
      description,
      status,
      isFeatured,
      images,
      category,
      options,
      price,
      salePrice,
    } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!images || !images.length) {
      return NextResponse.json(
        { error: "Images are required" },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    if (!options || !price) {
      return NextResponse.json(
        { error: "Options are required" },
        { status: 400 }
      );
    }

    // First, fetch the existing product with its relations
    const existingProduct = await prismadb.product.findUnique({
      where: { id: productId },
      include: { images: true, variants: { include: { options: true } } },
    });

    console.log("Existing Product", existingProduct);

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Use a transaction to ensure all operations succeed or fail together
    const updatedProduct = await prismadb.$transaction(async (prisma) => {
      // Delete existing images and variants
      await prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          images: {
            deleteMany: {},
          },
          variants: {
            deleteMany: {},
          },
        },
      });

      // Update the product with new data
      return await prisma.product.update({
        where: { id: productId },
        data: {
          name,
          description,
          status,
          isFeatured,
          price,
          salePrice,
          images: {
            create: images.map((image: string) => ({ url: image })),
          },
          category: { connect: { id: category } },
          variants: {
            create: options.map((option: Option) => ({
              name: option.name,
              options: {
                create: option.values.map((value: Values) => ({
                  name: value.name,
                  price: value.price,
                  salePrice: value.salePrice,
                  status: value.status,
                })),
              },
            })),
          },
        },
        include: {
          images: true,
          variants: {
            include: {
              options: true,
            },
          },
        },
      });
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (err) {
    console.log("[PRODUCT_PATCH]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
