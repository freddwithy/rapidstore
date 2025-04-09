"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { buttonVariants } from "@/components/ui/button";

export function HeroSectionOne() {
  return (
    <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
      <div className="px-4 py-20">
        <motion.h1
          className="relative z-10 mx-auto max-w-4xl text-center text-4xl font-bold text-secondary-foreground md:text-4xl lg:text-7xl"
          initial={{
            opacity: 0,
            translateY: 10,
          }}
          animate={{
            opacity: 1,
            translateY: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 0.1,
          }}
        >
          Lanza tu tienda en minutos, no días.
        </motion.h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.2,
          }}
          className="relative z-10 mx-auto max-w-xl text-sm py-4 text-center md:text-lg font-normal text-foreground dark:text-zinc-400"
        >
          Crea tu tienda <strong>sin complicaciones.</strong> Ideal para
          vendedores que quieren resultados rápidos{" "}
          <strong>sin invertir tiempo y dinero </strong>
          en otras soluciones más complejas.
        </motion.p>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.5,
          }}
          className="relative z-10 mt-8 flex flex-col md:flex-row items-center justify-center gap-4"
        >
          <a href="/tiendy" className={buttonVariants({ size: "lg" })}>
            Ver Demo
          </a>
          <a
            href="/sign-up"
            className={buttonVariants({ size: "lg", variant: "secondary" })}
          >
            Empezar
          </a>
        </motion.div>
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 0.5,
          }}
          className="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
            <Image
              src="/hero1.webp"
              alt="Landing page preview"
              className="aspect-[16/9] h-auto w-full object-cover"
              height={1000}
              width={1000}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
