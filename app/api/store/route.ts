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
    const { name, description, url, location, city, ruc, ownerId } = body;

    if (!name) {
      console.log("Missing Name Field");
      return NextResponse.json(
        { error: "Missing Name Field" },
        { status: 400 }
      );
    }

    if (!description) {
      console.log("Missing description Field");
      return NextResponse.json(
        { error: "Missing description Field" },
        { status: 400 }
      );
    }

    if (!url) {
      console.log("Missing url Field");
      return NextResponse.json({ error: "Missing url Field" }, { status: 400 });
    }

    if (!location) {
      console.log("Missing location Field");
      return NextResponse.json(
        { error: "Missing location Field" },
        { status: 400 }
      );
    }

    if (!city) {
      console.log("Missing city Field");
      return NextResponse.json(
        { error: "Missing city Field" },
        { status: 400 }
      );
    }

    if (!ruc) {
      console.log("Missing ruc Field");
      return NextResponse.json({ error: "Missing ruc Field" }, { status: 400 });
    }

    if (!ownerId) {
      console.log("Missing ownerId Field");
      return NextResponse.json(
        { error: "Missing ownerId Field" },
        { status: 400 }
      );
    }

    const existingStore = await prismadb.store.findFirst({
      where: {
        url,
      },
    });

    if (existingStore) {
      return NextResponse.json(
        { error: "Store already exists" },
        { status: 402 }
      );
    }

    const store = await prismadb.store.create({
      data: {
        name,
        description,
        url,
        location,
        city,
        ruc,
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
