import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  params: { params: { variantId: string } }
) {
  try {
    const body = await request.json();
    const { variantId } = params.params;
    const { name, description } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const variant = await prismadb.variant.update({
      where: {
        id: variantId,
      },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json({ variant }, { status: 200 });
  } catch (err) {
    console.log("[VARIANT_PATCH]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  params: { params: { variantId: string } }
) {
  try {
    const { variantId } = params.params;

    if (!variantId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const variant = await prismadb.variant.delete({
      where: {
        id: variantId,
      },
    });

    return NextResponse.json({ variant }, { status: 200 });
  } catch (err) {
    console.log("[VARIANT_DELETE]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
