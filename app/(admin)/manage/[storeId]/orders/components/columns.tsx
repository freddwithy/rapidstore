"use client";

import { formatter } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { OrderStatus, OrderPayment } from "@prisma/client";
import PaymentStatusBadge from "./paymentStatusBadge";
import StatusBadge from "./statusBadge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrderColumn = {
  id: number;
  customer: string;
  status: OrderStatus;
  paymentStatus: OrderPayment;
  total: number;
  storeId: string;
  createdAt: Date;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha de creacion
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) =>
      row.original.createdAt.toLocaleDateString("es-PY", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
  },
  {
    accessorKey: "customer",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cliente
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Estado
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <StatusBadge
        status={row.original.status}
        orderId={row.original.id}
        storeId={row.original.storeId}
      />
    ),
  },
  {
    accessorKey: "paymentStatus",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Pago
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <PaymentStatusBadge
        paymentStatus={row.original.paymentStatus}
        orderId={row.original.id}
        storeId={row.original.storeId}
      />
    ),
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => formatter.format(row.original.total),
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
