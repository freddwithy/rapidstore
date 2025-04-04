import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  params: { params: { colorId: string } }
) {
  try {
    const body = await request.json();
    const { colorId } = params.params;
    const { name, value } = body;

    if (!name || !value) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const color = await prismadb.color.update({
      where: {
        id: colorId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json({ color }, { status: 200 });
  } catch (err) {
    console.log("[COLOR_PATCH]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  params: { params: { colorId: string } }
) {
  try {
    const { colorId } = params.params;

    if (!colorId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const color = await prismadb.color.delete({
      where: {
        id: colorId,
      },
    });

    return NextResponse.json({ color }, { status: 200 });
  } catch (err) {
    console.log("[COLOR_DELETE]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
