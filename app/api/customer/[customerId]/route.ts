import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  params: { params: { customerId: string } }
) {
  try {
    const body = await request.json();
    const { customerId } = params.params;
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

    const customer = await prismadb.customer.update({
      where: {
        id: customerId,
      },
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
      },
    });

    return NextResponse.json({ customer }, { status: 200 });
  } catch (err) {
    console.log("[CUSTOMER_PATCH]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  params: { params: { customerId: string } }
) {
  try {
    const { customerId } = params.params;

    if (!customerId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const customer = await prismadb.customer.delete({
      where: {
        id: customerId,
      },
    });

    return NextResponse.json({ customer }, { status: 200 });
  } catch (err) {
    console.log("[CUSTOMER_DELETE]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
