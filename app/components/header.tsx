"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

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
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ShoppingBag className="h-6 w-6 text-cyan-500" />
          </motion.div>
          <motion.span
            className="text-xl font-bold text-sky-700"
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
            className="text-sm font-medium hover:text-cyan-500 transition-colors"
          >
            Características
          </Link>
          <Link
            href="#precios"
            className="text-sm font-medium hover:text-cyan-500 transition-colors"
          >
            Precios
          </Link>
          <Link
            href="#testimonios"
            className="text-sm font-medium hover:text-cyan-500 transition-colors"
          >
            Testimonios
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a
            href="/sign-in"
            className="inline-flex border rounded-3xl gap-2 font-medium h-9 px-4 py-2 items-center justify-center text-sm hover:bg-zinc-100 bg-white transition-colors"
          >
            Iniciar sesión
          </a>
          <a
            href="/revtek"
            className="inline-flex rounded-3xl gap-2 font-medium h-9 px-4 py-2 items-center justify-center text-sm text-white bg-sky-800 hover:bg-sky-700"
          >
            Ver Demo
          </a>
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          >
            <div className="container py-4 flex flex-col gap-4 bg-white">
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
                  className="inline-flex border rounded-3xl gap-2 font-medium h-9 px-4 py-2 items-center justify-center text-sm hover:bg-zinc-100 bg-white transition-colors"
                >
                  Iniciar sesión
                </a>
                <a
                  href="/revtek"
                  className="inline-flex rounded-3xl gap-2 font-medium h-9 px-4 py-2 items-center justify-center text-sm text-white bg-sky-800 hover:bg-sky-700"
                >
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
