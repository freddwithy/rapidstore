"use client";

import React, { useState } from "react";
import { OrderProductColumn } from "./columns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash } from "lucide-react";
import { toast } from "sonner";

import { AlertModal } from "@/components/modals/alert-modal";
import useItem from "@/hooks/use-item";

interface CellActionProps {
  data: OrderProductColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { removeItem } = useItem();

  const onDelete = async () => {
    try {
      setLoading(true);
      removeItem(data.variantId);
      toast.success("Producto eliminado");
      setLoading(false);
      setOpen(false);
    } catch {
      setLoading(false);
      setOpen(false);
      toast.error("No se pudo eliminar el producto");
    }
  };

  return (
    <div>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Abrir Menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Opciones</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 size-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
