"use client";

import { buttonVariants } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Cta() {
  return (
    <section className="py-20">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <motion.div
          className="relative overflow-hidden rounded-[2rem] bg-card px-6 py-12 sm:px-12 sm:py-16 md:px-16 md:py-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 h-full w-full overflow-hidden">
            <div className="absolute -top-1/4 -left-1/4 h-1/2 w-1/2 rounded-full bg-zinc-800/10 dark:bg-white/10 blur-3xl"></div>
            <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full border-zinc-800/10 dark:bg-white/10 blur-3xl"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <motion.h2
              className="max-w-3xl text-3xl font-bold tracking-tighter text-secondary-foreground sm:text-4xl md:text-5xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              ¿Listo para crear tu tienda online en segundos?
            </motion.h2>
            <motion.p
              className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Únete a miles de vendedores que ya están aprovechando la
              simplicidad y potencia de Tiendy.
            </motion.p>
            <motion.div
              className="mt-8 flex flex-col gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <a href="/sign-up" className={buttonVariants({ size: "lg" })}>
                Empezar gratis
              </a>
              <a
                href="/revtek"
                className={buttonVariants({ variant: "secondary", size: "lg" })}
              >
                Ver demo
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
