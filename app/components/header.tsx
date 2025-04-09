"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`px-4 md:px-0 sticky top-0 z-50 w-full header-scroll ${
        scrolled ? "header-scroll-active" : "header-scroll-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between  mx-auto max-w-6xl">
        <Link href="/" className="flex items-center gap-2 text-primary">
          <ShoppingBag className="h-6 w-6 " />
          <motion.span
            className="text-xl font-bold "
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Tiendy
          </motion.span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="#caracteristicas"
            className="text-sm font-medium  hover:text-primary transition-colors"
          >
            Características
          </Link>
          <Link
            href="#precios"
            className="text-sm font-medium  hover:text-primary transition-colors"
          >
            Precios
          </Link>
          <Link
            href="#testimonios"
            className="text-sm font-medium  hover:text-primary transition-colors"
          >
            Testimonios
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ModeToggle />
          <a href="/sign-in" className={buttonVariants({ variant: "outline" })}>
            Iniciar sesión
          </a>
          <a href="/revtek" className={buttonVariants({})}>
            Ver Demo
          </a>
        </div>
        <div className="md:hidden flex items-center justify-center gap-2">
          <a
            href="/sign-in"
            className={buttonVariants({
              variant: "outline",
            })}
          >
            Iniciar sesión
          </a>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden sticky top-0 z-50 overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          >
            <div className="container py-4 flex flex-col gap-4 bg-background">
              <Link
                href="#features"
                className="text-sm font-medium p-2 hover:bg-muted rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Características
              </Link>
              <Link
                href="#pricing"
                className="text-sm font-medium p-2 hover:bg-muted rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Precios
              </Link>
              <Link
                href="#testimonials"
                className="text-sm font-medium p-2 hover:bg-muted rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonios
              </Link>
              <div className="flex flex-col gap-2 pt-2 border-t">
                <a
                  href="/sign-in"
                  className={buttonVariants({ variant: "outline" })}
                >
                  Iniciar sesión
                </a>
                <a href="/tiendy" className={buttonVariants({})}>
                  Ver Demo
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
