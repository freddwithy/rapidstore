import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, value, storeId } = body;

    if (!storeId) {
      return NextResponse.json(
        { error: "Missing required storeId" },
        { status: 400 }
      );
    }

    if (!name || !value) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId,
      },
    });

    return NextResponse.json({ color }, { status: 200 });
  } catch (err) {
    console.log("[COLOR_POST]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
