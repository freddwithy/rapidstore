"use client";

import Image from "next/image";
import { motion } from "motion/react";

export function HeroSectionOne() {
  return (
    <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
      <div className="px-4 py-20">
        <motion.h1
          className="relative z-10 mx-auto max-w-4xl text-center text-4xl font-bold text-transparent text-sky-600 md:text-4xl lg:text-7xl"
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
            delay: 0.2,
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
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-w-xl text-sm py-4 text-center md:text-lg font-normal text-neutral-600 dark:text-neutral-400"
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
            delay: 1,
          }}
          className="relative z-10 mt-8 flex flex-col md:flex-row items-center justify-center gap-4"
        >
          <a
            href="/revtek"
            className="w-44 md:w-60 transform rounded-3xl flex items-center justify-center bg-sky-900 px-4 md:px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            Ver Demo
          </a>
          <a
            href="/sign-up"
            className="w-44 md:w-60 transform rounded-3xl flex items-center justify-center border border-gray-300 bg-white px-4 md:px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900"
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
            delay: 1.2,
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
