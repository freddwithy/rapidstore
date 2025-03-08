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

    const products = await prismadb.store.findUnique({
      where: {
        url: storeId,
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.log("[PRODUCTS_GET]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
