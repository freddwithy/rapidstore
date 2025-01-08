"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function PlanComparison({
  planProp,
}: {
  planProp: "FREE" | "PRO" | "PREMIUM" | undefined;
}) {
  const plans = [
    {
      subscription: {
        name: "PRIMERA TIENDA",
        key: "FREE",
      },
      description: "Para comenzar tu negocio en línea",
      price: "0",
      features: [
        { text: "Crear 1 tienda", available: true },
        { text: "Hasta 10 productos", available: true },
        { text: "3 categorías", available: true },
        { text: "Crear pedidos manualmente", available: false },
        { text: "Variantes de productos", available: false },
      ],
    },
    {
      subscription: {
        name: "EMPRENDEDOR",
        key: "PREMIUM",
      },
      description: "Para negocios en crecimiento",
      price: "59.000",
      features: [
        { text: "Crear 1 tienda", available: true },
        { text: "Hasta 50 productos por tienda", available: true },
        { text: "10 categorías por tienda", available: true },
        { text: "Crear pedidos manualmente", available: true },
        { text: "Hasta 3 variantes por producto", available: true },
      ],
    },
    {
      subscription: {
        name: "ENTUSIASTA",
        key: "PRO",
      },
      description: "Para negocios en crecimiento",
      price: "149.000",
      features: [
        { text: "Crear hasta 5 tiendas", available: true },
        { text: "Productos ilimitados", available: true },
        { text: "Categorías ilimitadas", available: true },
        { text: "Crear pedidos manualmente", available: true },
        { text: "Variantes ilimitadas", available: true },
      ],
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {plans.map((plan) => (
        <Card
          key={plan.subscription?.key}
          className={`${planProp === plan.subscription?.key ? "border-primary" : ""}`}
        >
          <CardHeader>
            <CardTitle>{plan.subscription?.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-4">
              Gs. {plan.price}
              <span className="text-sm font-normal">/mes</span>
            </p>
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  {feature.available ? (
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <X className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span className={feature.available ? "" : "text-gray-500"}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              disabled={planProp === plan.subscription.key}
              className="w-full"
              variant={`${planProp === plan.subscription.key ? "default" : "outline"}`}
            >
              {planProp === plan.subscription.key
                ? "Plan actual"
                : "Activar plan"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
