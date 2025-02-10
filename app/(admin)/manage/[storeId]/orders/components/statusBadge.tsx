"use client";
import {
  CircleDashed,
  PackageCheck,
  Ban,
  Banknote,
  CircleCheck,
} from "lucide-react";
import React from "react";

interface StatusBadgeProps {
  status: "PENDIENTE" | "ENTREGADO" | "CANCELADO" | "PAGADO";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const classStatus = {
    PENDIENTE:
      "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-700",
    ENTREGADO:
      "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-700",
    CANCELADO:
      "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-700",
    PAGADO:
      "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-700",
  };
  const statusIcons = {
    PENDIENTE: CircleDashed,
    ENTREGADO: PackageCheck,
    CANCELADO: Ban,
    PAGADO: CircleCheck,
  };
  const IconComponent = statusIcons[status];
  const statusClass = classStatus[status as keyof typeof classStatus];
  return (
    <div
      className={`${statusClass} flex items-center justify-center gap-1 rounded-md py-1 px-1.5 transition-colors text-sm `}
    >
      {IconComponent && <IconComponent className="w-4 h-4" />}
      {status}
    </div>
  );
};

export default StatusBadge;
