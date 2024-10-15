import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, url, location, city, ownerId } = body;

    if (!name || !description || !url || !location || !city || !ownerId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const store = await prismadb.store.create({
      data: {
        name,
        description,
        url,
        location,
        city,
        ownerId,
      },
    });

    return NextResponse.json({ store }, { status: 200 });
  } catch (err) {
    console.log("[STORE_POST]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
