import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, X } from "lucide-react";
import React from "react";

const freePlan = {
  name: "FREE",
  description: "Para comenzar tu negocio en línea",
  price: "0",
  features: [
    { text: "Crear 1 tienda", available: true },
    { text: "Hasta 10 productos", available: true },
    { text: "3 categorías", available: true },
    { text: "Crear pedidos manualmente", available: false },
    { text: "Variantes de productos", available: false },
  ],
};

const PlanCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{freePlan.name}</CardTitle>
        <CardDescription>{freePlan.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold mb-4">
          Gs. {freePlan.price}
          <span className="text-sm font-normal">/mes</span>
        </p>
        <ul className="space-y-2">
          {freePlan.features.map((feature, index) => (
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
        <Button className="w-full" variant="default">
          Plan actual
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlanCard;
