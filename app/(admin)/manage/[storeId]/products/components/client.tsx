"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { columns, ProductColumn } from "./columns";
import { DataTable } from "@/components/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface ProductProps {
  data: ProductColumn[];
  disableButton?: boolean;
}

const searchFilters = [
  {
    title: "Nombre",
    filter: "name",
  },
  {
    title: "Categoria",
    filter: "category",
  },
  {
    title: "Colores",
    filter: "colors",
  },
  {
    title: "Variantes",
    filter: "variants",
  },
];

export const ProductClient: React.FC<ProductProps> = ({
  data,
  disableButton = false,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <TooltipProvider>
      <div className="flex items-center justify-start">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              disabled={disableButton}
              onClick={() => router.push(`${pathname}/new`)}
            >
              <Plus className="h-4 w-4" />
              Agregar nuevo
            </Button>
          </TooltipTrigger>
          <TooltipContent>Agrega un nuevo producto</TooltipContent>
        </Tooltip>
      </div>
      <DataTable filterOptions={searchFilters} columns={columns} data={data} />
    </TooltipProvider>
  );
};
