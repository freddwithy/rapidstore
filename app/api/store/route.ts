import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

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

    const user = await prismadb.user.findFirst({
      where: {
        id: ownerId,
      },
      include: {
        store: true,
      },
    });

    if (!user) {
      console.log("User not found");
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    if (user?.user_type !== "PRO" && user.store.length > 0) {
      console.log("User is not a PRO user");
      return NextResponse.json(
        { error: "User is not a PRO user" },
        { status: 401 }
      );
    }

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
        owner: {
          connect: {
            id: ownerId,
          },
        },
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
