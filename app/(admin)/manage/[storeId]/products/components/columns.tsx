"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import Image from "next/image";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
  id: string;
  name: string;
  category: string;
  isArchived: boolean;
  isFeatured: boolean;
  image: string;
  variants: number;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "image",
    header: "Imagen",
    cell: ({ row }) => (
      <div className="border bg-background rounded-md overflow-hidden size-16">
        <Image src={row.original.image} alt="" width={96} height={96} />
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "variants",
    header: "Variantes",
  },
  {
    accessorKey: "category",
    header: "Categoria",
  },
  {
    accessorKey: "isArchived",
    header: "Archivado",
    cell: ({ row }) => (row.original.isArchived ? "Si" : "No"),
  },
  {
    accessorKey: "id",
    header: "Acciones",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
