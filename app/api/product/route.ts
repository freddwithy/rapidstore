import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export type Option = {
  values: Values[];
  name: string;
};

export type Values = {
  name: string | undefined;
  price?: number;
  salePrice?: number | null;
  status: string | "DISPONIBLE";
};

export async function POST(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthenticated", { status: 403 });
  }

  try {
    const body = await request.json();
    const {
      name,
      description,
      status,
      isFeatured,
      storeId,
      images,
      category,
      options,
      price,
      salePrice,
    } = body;

    if (!storeId) {
      console.log("Missing storeId");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

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

    if (options.length > 1) {
      console.log("Too many options");
      return NextResponse.json({ error: "Too many options" }, { status: 400 });
    }

    const existingProducts = await prismadb.product.findMany({
      where: {
        storeId,
      },
    });

    if (existingProducts.length >= 10 && user.user_type === "FREE") {
      return NextResponse.json(
        { error: "Free users can only have 10 products" },
        { status: 400 }
      );
    }

    const product = await prismadb.product.create({
      data: {
        name,
        description,
        status,
        isFeatured,
        price,
        salePrice,
        store: {
          connect: {
            id: storeId,
          },
        },
        images: {
          create: images.map((image: string) => ({
            url: image,
          })),
        },
        category: {
          connect: {
            id: category,
          },
        },
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
    });

    return NextResponse.json({ product }, { status: 200 });
  } catch (err) {
    console.log("[PRODUCT_POST]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
