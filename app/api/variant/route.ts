import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, storeId } = body;

    if (!storeId) {
      return NextResponse.json(
        { error: "Missing required storeId" },
        { status: 400 }
      );
    }

    if (!name || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const variant = await prismadb.variant.create({
      data: {
        name,
        description,
        storeId,
      },
    });

    return NextResponse.json({ variant }, { status: 200 });
  } catch (err) {
    console.log("[VARIANT_POST]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
