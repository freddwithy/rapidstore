import { OrderProductHook } from "@/hooks/use-item";
import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerId, orderProducts, status, paymentStatus, total, storeId } =
      body;

    const user = await currentUser();

    if (!user) {
      console.log("Unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
          create: await Promise.all(
            orderProducts.map(async (p: OrderProductHook) => {
              // Verificar si el producto tiene variantes
              const product = await prismadb.product.findUnique({
                where: { id: p.productId },
                include: {
                  variants: {
                    include: {
                      options: true
                    }
                  }
                }
              });

              if (!product) {
                throw new Error(`No se encontró el producto ${p.productId}`);
              }

              // Producto sin variantes
              if (product.variants.length === 0) {
                return {
                  product: {
                    connect: {
                      id: p.productId,
                    },
                  },
                  qty: p.quantity,
                  total: p.total,
                };
              }

              // Producto con variantes
              const variant = product.variants[0];
              const option = p.optionId
                ? variant.options.find(opt => opt.id === p.optionId)
                : variant.options[0];

              if (!option) {
                throw new Error(`No se encontró la opción para el producto ${p.productId}`);
              }

              return {
                product: {
                  connect: {
                    id: p.productId,
                  },
                },
                variant: {
                  connect: {
                    id: option.id,
                  },
                },
                qty: p.quantity,
                total: p.total,
              };
            })
          ),
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
