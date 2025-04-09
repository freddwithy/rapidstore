import { Metadata } from "next";
import { notFound } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import { generateWhatsAppMessage } from "@/lib/whatsapp";
import { Check } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Confirmación de Pedido",
  description: "Tu pedido ha sido confirmado",
};

interface ConfirmationPageProps {
  params: {
    tenant: string;
    orderId: string;
  };
}

export default async function ConfirmationPage({
  params,
}: ConfirmationPageProps) {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.tenant,
    },
  });

  if (!store) {
    return notFound();
  }

  const order = await prismadb.order.findFirst({
    where: {
      id: Number(params.orderId),
      storeId: params.tenant,
    },
    include: {
      customer: true,
      orderProducts: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  });

  if (!order) {
    return notFound();
  }

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <Card className="w-full max-w-xl mx-4 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-20 items-center animate-jump-in ease-in justify-center rounded-full bg-green-100">
            <Check className="size-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold ">
            ¡Pedido Confirmado!
          </CardTitle>
          <CardDescription className="">
            Tu pedido #{order.id} ha sido recibido
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="divide-y divide-gray-200">
            {order.orderProducts.map((item) => (
              <div
                key={item.id}
                className="flex justify-between py-4 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="font-medium ">{item.product.name}</p>
                  {item.variant && (
                    <p className="text-sm text-muted-foreground">
                      Variante: {item.variant.name}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Cantidad: {item.qty}
                  </p>
                </div>
                <p className="font-medium ">{formatter.format(item.total)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between">
              <p className="text-lg font-medium ">Total</p>
              <p className="text-lg font-semibold ">
                {formatter.format(order.total)}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <a
            href={generateWhatsAppMessage(
              order,
              store.name,
              store.id,
              store.whatsapp || ""
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button
              variant="default"
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 size-5"
              >
                <path d="M3 21l1.9-5.7a8.5 8.5 0 113.8 3.6z" />
              </svg>
              Enviar por WhatsApp
            </Button>
          </a>
          <Link href={`/${params.tenant}`} className="w-full">
            <Button variant="outline" className="w-full">
              Volver a la tienda
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
