import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  params: { params: { storeId: string } }
) {
  try {
    const body = await request.json();
    const storeId = params.params.storeId;
    const {
      name,
      description,
      url,
      location,
      city,
      ruc,
      ownerId,
      instagram,
      whatsapp,
      logo,
    } = body;

    if (!storeId) {
      return NextResponse.json(
        { error: "Missing storeId Field" },
        { status: 400 }
      );
    }
    if (!name) {
      return NextResponse.json(
        { error: "Missing name Field" },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { error: "Missing description Field" },
        { status: 400 }
      );
    }

    if (!url) {
      return NextResponse.json({ error: "Missing url Field" }, { status: 400 });
    }
    if (!location) {
      return NextResponse.json(
        { error: "Missing location Field" },
        { status: 400 }
      );
    }

    if (!city) {
      return NextResponse.json(
        { error: "Missing city Field" },
        { status: 400 }
      );
    }

    if (!ruc) {
      return NextResponse.json({ error: "Missing ruc Field" }, { status: 400 });
    }

    if (!ownerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingStore = await prismadb.store.findFirst({
      where: {
        id: storeId,
        ownerId,
      },
    });

    if (!existingStore) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const store = await prismadb.store.update({
      where: {
        id: storeId,
      },
      data: {
        name,
        description,
        url,
        location,
        city,
        ruc,
        instagram,
        whatsapp,
        logo,
      },
    });

    return NextResponse.json(store);
  } catch (err) {
    console.log("[STORE_PATCH]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  params: { params: { storeId: string } }
) {
  try {
    const storeId = params.params.storeId;
    if (!storeId) {
      return NextResponse.json(
        { error: "Missing storeId Field" },
        { status: 400 }
      );
    }
    const store = await prismadb.store.delete({
      where: {
        id: storeId,
      },
    });
    return NextResponse.json(store);
  } catch (err) {
    console.log("[STORE_DELETE]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
