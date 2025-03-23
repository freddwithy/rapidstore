import Instagram from "@/components/icons/instagram";
import WhatsApp from "@/components/icons/whatsapp";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Store } from "@prisma/client";
import { Info } from "lucide-react";
import Link from "next/link";
import React from "react";

interface StoreInfoProps {
  store: Store;
}

const StoreInfo: React.FC<StoreInfoProps> = ({ store }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost">
          <Info className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <Link href={`/${store.url}`}>
            <h1 className="text-3xl font-medium capitalize">{store.name}</h1>
          </Link>
        </SheetHeader>
        <Separator className="my-2" />
        <div className="space-y-2">
          <p className="text-md font-semibold">Redes</p>
          <div className="flex gap-4">
            {store.whatsapp && (
              <a
                href={`https://wa.me/595${store.whatsapp}`}
                target="_blank"
                className="p-3 rounded-full bg-green-200 hover:bg-green-200/80 hover:scale-105 duration-150 transition-transform"
              >
                <WhatsApp className="size-6 text-green-800 " />
              </a>
            )}
            {store.instagram && (
              <a
                href={`https://www.instagram.com/${store.instagram}`}
                target="_blank"
                className="p-3 rounded-full bg-pink-200 hover:bg-pink-200/80 hover:scale-105 duration-150 transition-transform"
              >
                <Instagram className="size-6 text-pink-800" />
              </a>
            )}
          </div>
        </div>
        <div className="my-2">
          <p className="text-md font-semibold">Nosotros</p>
          <p className="text-muted-foreground">{store.description}</p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default StoreInfo;
