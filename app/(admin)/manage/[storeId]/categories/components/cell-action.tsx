"use client";

import React, { useState } from "react";
import { CustomerColumn } from "./columns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps {
  data: CustomerColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("ID del cliente copiado al portapapeles.");
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/customer/${data.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Cliente eliminado");
        router.refresh();
      }
    } catch (error) {
      toast.error("No se pudo eliminar el cliente");
      console.log(error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
        title="Eliminar cliente"
        description="¿Estas seguro de querer eliminar el cliente?"
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
          <DropdownMenuItem
            onClick={() => router.push(`${pathname}/${data.id}`)}
          >
            <Edit className="mr-2 size-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 size-4" />
            Copiar ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 size-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
