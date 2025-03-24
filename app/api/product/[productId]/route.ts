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

    // Validación de campos requeridos
    const requiredFields = {
      name,
      description,
      storeId,
      images,
      category,
      options,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      console.log(`Missing fields: ${missingFields.join(", ")}`);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Procesar variantes
    const variants = await Promise.all(
      options.map(async (option: VariantProduct) => ({
        ...option,
        sku: await generateSKU(
          name,
          option.name,
          option.colorId,
          option.variantId
        ),
        price: Number(option.price),
        salePrice: option.salePrice ? Number(option.salePrice) : null,
        stock: Number(option.stock),
      }))
    );

    // Actualización en una sola transacción
    const product = await prismadb.$transaction(async (prisma) => {
      // Primero eliminar relaciones existentes
      await prisma.product.update({
        where: { id: productId },
        data: {
          images: { deleteMany: {} },
          variants: { deleteMany: {} },
        },
      });

      // Luego actualizar el producto y crear nuevas relaciones
      return await prisma.product.update({
        where: { id: productId },
        data: {
          name,
          description,
          isArchived,
          isFeatured,
          category: { connect: { id: category } },
          images: {
            create: images.map((image: string) => ({ url: image })),
          },
          variants: {
            create: variants.map((variant: VariantProduct) => {
              const variantData: any = {
                price: variant.price,
                salePrice: variant.salePrice,
                stock: variant.stock,
                sku: variant.sku,
                name: variant.name,
              };

              // Conexión condicional para color
              if (variant.colorId) {
                variantData.color = { connect: { id: variant.colorId } };
              }

              // Conexión condicional para variant
              if (variant.variantId) {
                variantData.variant = { connect: { id: variant.variantId } };
              }

              return variantData;
            }),
          },
        },
        include: {
          images: true,
          variants: {
            include: {
              color: true,
              variant: true,
            },
          },
        },
      });
    });

    return NextResponse.json(product, { status: 200 });
  } catch (err) {
    console.error("[PRODUCT_PATCH]", err);
    return NextResponse.json(
      { error: "Internal server error" },
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
