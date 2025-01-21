"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrderColumn = {
  id: string;
  customer: string;
  status: "PENDIENTE" | "ENTREGADO" | "CANCELADO";
  paymentStatus: "PENDIENTE" | "PAGADO" | "PAGO_PARCIAL";
  total: number;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "customer",
    header: "Ciente",
  },
  {
    accessorKey: "status",
    header: "Estado",
  },
  {
    accessorKey: "paymentStatus",
    header: "Pago",
  },
  {
    accessorKey: "total",
    header: "Total",
  },
];
