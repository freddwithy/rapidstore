import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Category } from "@prisma/client";
import { Menu } from "lucide-react";
import Link from "next/link";
import React from "react";

interface LateralNavbarProps {
  tenant: string;
  storeName: string;
  categories: Category[];
}

const LateralNavbar: React.FC<LateralNavbarProps> = ({
  tenant,
  storeName,
  categories,
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="rounded-full">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <Link href={`/${tenant}`}>
            <h1 className="text-3xl font-medium capitalize">{storeName}</h1>
          </Link>
        </SheetHeader>
        <Separator className="my-2" />
        <div className="space-y-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${tenant}/#${cat.name}`}
              className="flex items-center px-4 py-2 rounded-md hover:bg-sidebar-accent active:bg-sidebar-accent"
            >
              <h1 className="text-md font-medium capitalize text-muted-foreground">
                {cat.name}
              </h1>
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LateralNavbar;
