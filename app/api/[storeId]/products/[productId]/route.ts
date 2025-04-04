import prismadb from "@/lib/prismadb";
import { generateSKU } from "@/utils/generateSku";
import { VariantProduct } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  params: { params: { productId: string } }
) {
  try {
    const body = await request.json();
    const { productId } = params.params;
    const {
      name,
      description,
      isArchived,
      isFeatured,
      storeId,
      images,
      category,
      options,
    } = body;

    if (!name) {
      console.log("Missing name");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!options) {
      console.log("Missing options");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!images) {
      console.log("Missing images");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!category) {
      console.log("Missing category");
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

    if (!storeId) {
      console.log("Missing storeId");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const variants = await Promise.all(
      options.map(async (option: VariantProduct) => ({
        ...option,
        sku: await generateSKU(name, option.colorId, option.variantId),
        price: Number(option.price), // Convertir a número
        salePrice: Number(option.salePrice), // Convertir a número
        stock: Number(option.stock), // Convertir a número
      }))
    );

    if (!variants) {
      console.log("Missing variants");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        description,
        isArchived,
        isFeatured,
        images: {
          deleteMany: {},
        },
        category: {
          connect: {
            id: category,
          },
        },
        variants: {
          deleteMany: {},
        },
      },
    });

    const product = await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
        images: {
          create: images.map((image: string) => ({
            url: image,
          })),
        },
        variants: {
          create: variants.map((variant: VariantProduct) => ({
            color: {
              connect: {
                id: variant.colorId,
              },
            },
            variant: {
              connect: {
                id: variant.variantId,
              },
            },
            price: variant.price,
            salePrice: variant.salePrice,
            stock: variant.stock,
            sku: variant.sku,
          })),
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

export async function DELETE(
  request: Request,
  params: { params: { productId: string } }
) {
  try {
    const { productId } = params.params;
    if (!productId) {
      console.log("Missing productId");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const product = await prismadb.product.delete({
      where: {
        id: productId,
      },
    });
    return NextResponse.json({ product }, { status: 200 });
  } catch (err) {
    console.log("[PRODUCT_DELETE]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
