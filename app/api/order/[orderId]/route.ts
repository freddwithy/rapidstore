import { OrderProductHook } from "@/hooks/use-item";
import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const body = await request.json();
    const { orderId } = params;
    const {
      customerId,
      orderProducts,
      status,
      paymentStatus,
      total,
      isStatusUpdate,
      storeId,
    } = body;

    const user = await currentUser();

    if (!user) {
      console.log("Unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!storeId) {
      console.log("Missing storeId");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!orderId) {
      console.log("Missing orderId");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (isStatusUpdate) {
      if (status || paymentStatus) {
        const order = await prismadb.order.update({
          where: {
            id: Number(orderId),
          },
          data: {
            status,
            paymentStatus,
          },
        });
        return NextResponse.json({ order }, { status: 200 });
      } else {
        console.log("Missing status or paymentStatus");
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }
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

    await prismadb.order.update({
      where: {
        id: Number(orderId),
      },
      data: {
        customer: {
          connect: {
            id: customerId,
          },
        },
        orderProducts: {
          deleteMany: {},
        },
        total,
        status,
        paymentStatus,
      },
    });

    const order = await prismadb.order.update({
      where: {
        id: Number(orderId),
      },
      data: {
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
      },
    });

    return NextResponse.json({ order }, { status: 200 });
  } catch (err) {
    console.log("[ORDER_PATCH]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  params: { params: { orderId: string } }
) {
  try {
    const { orderId } = params.params;
    if (!orderId) {
      console.log("Missing orderId");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const product = await prismadb.order.delete({
      where: {
        id: Number(orderId),
      },
    });
    return NextResponse.json({ product }, { status: 200 });
  } catch (err) {
    console.log("[ORDER_DELETE]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
