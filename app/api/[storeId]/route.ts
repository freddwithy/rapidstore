import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  params: { params: { storeId: string } }
) {
  try {
    const { storeId } = params.params;

    if (!storeId) {
      return NextResponse.json(
        { error: "Store id is required" },
        { status: 400 }
      );
    }

    const store = await prismadb.store.findUnique({
      where: {
        url: storeId,
      },
    });

    return NextResponse.json(store, { status: 200 });
  } catch (err) {
    console.log("[STORE_GET]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
