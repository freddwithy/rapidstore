import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      lastName,
      ruc,
      rucName,
      tel,
      city,
      direction1,
      direction2,
      email,
      storeId,
    } = body;

    if (!storeId) {
      return NextResponse.json(
        { error: "Missing required storeId" },
        { status: 400 }
      );
    }

    if (!name || !lastName || !ruc || !rucName || !tel || !city || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const customer = await prismadb.customer.create({
      data: {
        name,
        lastName,
        ruc,
        rucName,
        tel,
        city,
        direction1,
        direction2,
        email,
        storeId,
      },
    });

    return NextResponse.json({ customer }, { status: 200 });
  } catch (err) {
    console.log("[CUSTOMER_POST]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
