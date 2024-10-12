import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Store } from "@prisma/client";
import { AlertCircle } from "lucide-react";
import React from "react";

interface StoreSectionProps {
  store: Store | null;
}

const StoreSection: React.FC<StoreSectionProps> = ({ store }) => {
  return (
    <Card className="mt-4 p-2">
      <CardHeader>
        <CardTitle>Tu tienda</CardTitle>
        <CardDescription>
          Aquí podrás ver y editar la información de tu tienda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!store && (
          <>
            <Alert variant="default">
              <AlertCircle className="size-4" />
              <AlertTitle className="text-stone-900 font-semibold">
                Todavía no tienes una tienda
              </AlertTitle>
              <AlertDescription className="text-stone-700">
                Por favor, crea una.
              </AlertDescription>
            </Alert>
            <Button className="mt-4">
              <a href="/dashboard/create-store">Crear una tienda</a>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StoreSection;
