import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { Option, Values } from "../route";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

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
      storeId,
    } = body;

    const user = await prismadb.user.findUnique({
      where: {
        clerk_id: userId,
      },
    });

    if (!user) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        ownerId: user.id,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

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

    if (options.length > 1) {
      console.log("Too many options");
      return NextResponse.json({ error: "Too many options" }, { status: 400 });
    }

    // First, fetch the existing product with its relations
    const existingProduct = await prismadb.product.findUnique({
      where: { id: productId },
      include: { images: true, variants: { include: { options: true } } },
    });

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

export async function DELETE(
  request: Request,
  { params }: { params: { productId: string } }
) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthenticated", { status: 403 });
  }

  try {
    const user = await prismadb.user.findUnique({
      where: {
        clerk_id: userId,
      },
    });

    if (!user) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        ownerId: user.id,
        products: {
          some: {
            id: params.productId,
          },
        },
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const productId = params.productId;
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await prismadb.product.delete({
      where: {
        id: productId,
      },
    });

    return NextResponse.json(product, { status: 200 });
  } catch (err) {
    console.log("[PRODUCT_DELETE]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
