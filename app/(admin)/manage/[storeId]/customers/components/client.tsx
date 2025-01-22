"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { columns, CustomerColumn } from "./columns";
import { DataTable } from "@/components/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface CustomerProps {
  data: CustomerColumn[];
  disableButton?: boolean;
}

const searchFilters = [
  {
    title: "Razon Social",
    filter: "rucName",
  },
  {
    title: "RUC",
    filter: "ruc",
  },
  {
    title: "Email",
    filter: "email",
  },
];

export const CustomerClient: React.FC<CustomerProps> = ({
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
          <TooltipContent>Agrega un nuevo cliente</TooltipContent>
        </Tooltip>
      </div>
      <DataTable filterOptions={searchFilters} columns={columns} data={data} />
    </TooltipProvider>
  );
};
