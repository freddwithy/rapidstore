"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Store } from "@prisma/client";
import { AlertCircle, Link2 } from "lucide-react";
import React, { useState } from "react";
import StoreForm from "../(forms)/store-form";
interface StoreSectionProps {
  store: Store | null;
  ownerId: string | undefined;
}

const StoreSection: React.FC<StoreSectionProps> = ({ store, ownerId }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section>
      <Card className="mt-4">
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
              <Button className="mt-4" onClick={() => setIsOpen(true)}>
                Crear una tienda
              </Button>
            </>
          )}
          {store && (
            <>
              <a
                href={`http://localhost:3000/${store.url}`}
                className="border border-blue-200 p-4 rounded-md flex items-center"
              >
                <div className="flex-1">
                  <h3 className="text-lg text-primary font-semibold">
                    {store.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    https://rapidstore.vercel.app/{store.url}
                  </p>
                </div>
                <Link2 className="text-muted-foreground" />
              </a>
              <Button className="mt-4 w-full">Editar</Button>
            </>
          )}
        </CardContent>
      </Card>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Crea tu tienda</DrawerTitle>
            <DrawerDescription>
              Detalla la información de tu tienda.
            </DrawerDescription>
          </DrawerHeader>
          <StoreForm ownerId={ownerId} onClose={() => setIsOpen(false)} />
          <DrawerFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </section>
  );
};

export default StoreSection;
