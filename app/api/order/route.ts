import { OrderProductHook } from "@/hooks/use-item";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerId, orderProducts, status, paymentStatus, total, storeId } =
      body;

    if (!customerId) {
      console.log("Missing customerId");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!orderProducts) {
      console.log("Missing orderProducts");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!status) {
      console.log("Missing status");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!paymentStatus) {
      console.log("Missing paymentStatus");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!total) {
      console.log("Missing total");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!storeId) {
      console.log("Missing storeId");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const order = await prismadb.order.create({
      data: {
        customer: {
          connect: {
            id: customerId,
          },
        },
        store: {
          connect: {
            id: storeId,
          },
        },
        orderProducts: {
          create: orderProducts.map((p: OrderProductHook) => ({
            product: {
              connect: {
                id: p.productId,
              },
            },
            variant: {
              connect: {
                id: p.optionId,
              },
            },
            qty: p.quantity,
            total: p.total,
          })),
        },
        total,
        status,
        paymentStatus,
      },
    });

    return NextResponse.json({ order }, { status: 200 });
  } catch (err) {
    console.log("[ORDER_POST]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
