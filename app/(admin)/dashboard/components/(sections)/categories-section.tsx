"use client";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Category } from "@prisma/client";
import React, { useState } from "react";
import CategoryForm from "../(forms)/category-form";
interface CategoriesSectionProps {
  categories: Category[];
  storeId: string | undefined;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  storeId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>Categorias</CardTitle>
          <CardDescription>
            Aquí podrás ver y editar las categorías de tu tienda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length > 0 ? (
            <ScrollArea className="h-[300px]">
              <div className="flex flex-col gap-y-2">
                {categories.map((category) => (
                  <div
                    className="w-full border border-stone-300 p-2 flex flex-col rounded-md gap-x-2 items-start justify-center"
                    key={category.id}
                  >
                    <p className="font-semibold leading-none">
                      {category.name}
                    </p>
                    <span className="text-sm text-stone-500">
                      {category.description}
                    </span>
                  </div>
                ))}
              </div>
              <Button className="mt-4" onClick={() => setIsOpen(true)}>
                Añadir
              </Button>
            </ScrollArea>
          ) : (
            <div className="space-y-2">
              <p className="text-stone-500">Todavía no hay categorías</p>
            </div>
          )}
        </CardContent>
      </Card>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Añadir una Categoría</DrawerTitle>
            <DrawerDescription>
              Aquí podrás añadir una categoría a tu tienda.
            </DrawerDescription>
          </DrawerHeader>
          <CategoryForm onClose={() => setIsOpen(false)} ownerId={storeId} />
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

export default CategoriesSection;
