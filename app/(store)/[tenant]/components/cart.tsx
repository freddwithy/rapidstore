"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useCart from "@/hooks/use-cart";
import { ShoppingCart } from "lucide-react";
import React from "react";

const Cart = () => {
  const { items } = useCart();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" className="fixed bottom-10 right-8 z-20">
          {items.length}
          <ShoppingCart />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Carrito</SheetTitle>
          <SheetDescription>{items.length} productos</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
