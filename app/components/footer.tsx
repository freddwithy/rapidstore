import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-12 md:px-6 md:py-16 mx-auto max-w-6xl">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-cyan-500" />
              <span className="text-xl font-bold text-sky-700">Tiendy</span>
            </Link>
            <p className="text-sm text-zinc-500">
              La forma más rápida y sencilla de crear tu tienda online sin
              complicaciones.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-medium">Producto</h3>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li>
                <Link
                  href="#caracteristicas"
                  className="hover:text-cyan-500 transition-colors"
                >
                  Características
                </Link>
              </li>
              <li>
                <Link
                  href="#precios"
                  className="hover:text-cyan-500 transition-colors"
                >
                  Precios
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-cyan-500 transition-colors"
                >
                  Guías
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-medium">Empresa</h3>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li>
                <Link
                  href="#"
                  className="hover:text-cyan-500 transition-colors"
                >
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-cyan-500 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-cyan-500 transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-medium">Legal</h3>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li>
                <Link
                  href="#"
                  className="hover:text-cyan-500 transition-colors"
                >
                  Términos de servicio
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-cyan-500 transition-colors"
                >
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-cyan-500 transition-colors"
                >
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-zinc-500">
          <p>
            &copy; {new Date().getFullYear()} Tiendy. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
