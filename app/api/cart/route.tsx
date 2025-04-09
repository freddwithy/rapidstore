import { OrderProductHook } from "@/hooks/use-item";
import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      items,
      storeId,
      name,
      lastName,
      ruc,
      rucName,
      tel,
      city,
      direction1,
      direction2,
      email,
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

    if (!items) {
      console.log("Missing items");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!name || !lastName || !tel || !city || !direction1 || !email) {
      console.log("Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingCustomer = await prismadb.customer.findFirst({
      where: {
        store: {
          id: storeId,
        },
        email,
      },
    });

    if (existingCustomer) {
      const updatedCustomer = await prismadb.customer.update({
        where: {
          id: existingCustomer.id,
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

      const order = await prismadb.order.create({
        data: {
          customer: {
            connect: {
              id: updatedCustomer.id,
            },
          },
          store: {
            connect: {
              id: storeId,
            },
          },
          orderProducts: {
            create: await Promise.all(
              items.map(async (p: OrderProductHook) => {
                // Verificar si el producto tiene variantes
                const product = await prismadb.product.findUnique({
                  where: { id: p.productId },
                  include: {
                    variants: {
                      include: {
                        options: true,
                      },
                    },
                  },
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
                    total: p.total * p.quantity,
                  };
                }

                // Producto con variantes
                const variant = product.variants[0];
                const option = p.optionId
                  ? variant.options.find((opt) => opt.id === p.optionId)
                  : variant.options[0];

                if (!option) {
                  throw new Error(
                    `No se encontró la opción para el producto ${p.productId}`
                  );
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
                  total: p.total * p.quantity,
                };
              })
            ),
          },
          total: items.reduce(
            (acc: number, item: OrderProductHook) =>
              acc + item.total * item.quantity,
            0
          ),
        },
      });

      return NextResponse.json({ order }, { status: 200 });
    }

    const order = await prismadb.order.create({
      data: {
        customer: {
          create: {
            store: {
              connect: {
                id: storeId,
              },
            },
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
        },
        store: {
          connect: {
            id: storeId,
          },
        },
        orderProducts: {
          create: await Promise.all(
            items.map(async (p: OrderProductHook) => {
              // Verificar si el producto tiene variantes
              const product = await prismadb.product.findUnique({
                where: { id: p.productId },
                include: {
                  variants: {
                    include: {
                      options: true,
                    },
                  },
                },
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
                  total: p.total * p.quantity, // Usar el total que viene del carrito
                };
              }

              // Producto con variantes
              const variant = product.variants[0];
              const option = p.optionId
                ? variant.options.find((opt) => opt.id === p.optionId)
                : variant.options[0];

              if (!option) {
                throw new Error(
                  `No se encontró la opción para el producto ${p.productId}`
                );
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
                total: p.total * p.quantity, // Usar el total que viene del carrito
              };
            })
          ),
        },
        total: items.reduce(
          (acc: number, item: OrderProductHook) =>
            acc + item.total * item.quantity,
          0
        ),
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
