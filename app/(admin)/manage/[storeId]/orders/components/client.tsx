"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { columns, OrderColumn } from "./columns";
import { DataTable } from "@/components/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface OrderProps {
  data: OrderColumn[];
  disableButton?: boolean;
}

const searchFilters = [
  {
    title: "Cliente",
    filter: "customer",
  },
  {
    title: "Estado",
    filter: "status",
  },
  {
    title: "Pago",
    filter: "paymentStatus",
  },
];

export const OrderClient: React.FC<OrderProps> = ({
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
          <TooltipContent>Agrega un nuevo pedido</TooltipContent>
        </Tooltip>
      </div>
      <DataTable filterOptions={searchFilters} columns={columns} data={data} />
    </TooltipProvider>
  );
};
