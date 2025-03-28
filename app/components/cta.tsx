"use client";

import { motion } from "framer-motion";

export default function Cta() {
  return (
    <section className="py-20">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <motion.div
          className="relative overflow-hidden rounded-[2rem] bg-sky-700 px-6 py-12 sm:px-12 sm:py-16 md:px-16 md:py-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 h-full w-full overflow-hidden">
            <div className="absolute -top-1/4 -left-1/4 h-1/2 w-1/2 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-white/10 blur-3xl"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <motion.h2
              className="max-w-3xl text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              ¿Listo para crear tu tienda online en segundos?
            </motion.h2>
            <motion.p
              className="mx-auto mt-4 max-w-[700px] text-white/80 md:text-xl"
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
              <a
                href="/sign-up"
                className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-full transition-colors h-10 px-8 flex items-center justify-center text-base font-medium"
              >
                Empezar gratis
              </a>
              <a
                href="/revtek"
                className="border-white bg-white hover:bg-zinc-100 rounded-full transition-colors h-10 px-8 flex items-center justify-center text-base font-medium"
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
