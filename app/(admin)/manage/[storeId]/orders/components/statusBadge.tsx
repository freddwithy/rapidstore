"use client";
import React, { useState } from "react";
import { OrderStatus } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface StatusBadgeProps {
  status: OrderStatus;
  orderId: number;
  storeId: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  orderId,
  storeId,
}) => {
  const [loading, setLoading] = useState(false);
  const colorBy = {
    PENDIENTE:
      "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-700",
    ENTREGADO:
      "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-700",
    CANCELADO:
      "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-700",
    PAGADO:
      "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-700",
    PREPARANDO:
      "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-700",
  };
  const router = useRouter();

  const onSubmit = async (value: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/order/${orderId}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: value,
          storeId,
          isStatusUpdate: true,
        }),
      });
      if (res.ok) {
        setLoading(false);
        router.refresh();
        toast.success("Estado actualizado");
      }
    } catch (err: unknown) {
      console.log(err);
      toast.error("Error al actualizar el estado");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Select value={status} onValueChange={onSubmit}>
      <SelectTrigger
        disabled={loading}
        className={cn(
          colorBy[status],
          "w-36 ",
          loading && "cursor-not-allowed disabled:opacity-50"
        )}
      >
        <SelectValue placeholder="Selecciona una opcion" />
      </SelectTrigger>
      <SelectContent>
        {Object.values(OrderStatus).map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StatusBadge;
