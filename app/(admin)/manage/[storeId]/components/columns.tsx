"use client";

import { formatter } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import StatusBadge from "../orders/components/statusBadge";
import { OrderPayment, OrderStatus } from "@prisma/client";
import PaymentStatusBadge from "../orders/components/paymentStatusBadge";

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
    accessorKey: "id",
    header: "Numero de Pedido",
  },
  {
    accessorKey: "customer",
    header: "Ciente",
  },
  {
    accessorKey: "status",
    header: "Estado",
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
    header: "Pago",
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
];
