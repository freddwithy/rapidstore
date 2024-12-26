import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const subdomain = req.nextUrl.searchParams.get("subdomain");

  console.log("API: Received request for store with subdomain", subdomain);

  if (!subdomain) {
    console.log("API: Missing subdomain");
    return NextResponse.json({ error: "Missing subdomain" }, { status: 400 });
  }

  try {
    const store = prismadb.store.findUnique({
      where: {
        name: subdomain,
      },
      select: {
        id: true,
        name: true,
      },
    });

    console.log("API: Found store", store);

    if (!store) {
      console.log("API: Store not found");
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    return NextResponse.json({ store }, { status: 200 });
  } catch (err) {
    console.log("[STORE_GET]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

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

    const existingStore = await prismadb.store.findUnique({
      where: {
        name,
      },
    });

    if (existingStore) {
      return NextResponse.json(
        { error: "Store already exists" },
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
