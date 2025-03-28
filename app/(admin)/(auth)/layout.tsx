import { auth } from "@clerk/nextjs/server";
import Image from "next/image";

import { redirect } from "next/navigation";
import React from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  if (userId) redirect("/admin");
  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 ">
      <div className="bg-blue-900 w-full h-full hidden lg:block p-14 space-y-4 overflow-hidden relative">
        <h1 className="text-6xl font-bold text-white">
          Maneja tu tienda <br /> desde un solo lugar
        </h1>
        <p className="text-xl max-w-xl text-blue-200">
          Crea tu tienda <strong>sin complicaciones.</strong> Ideal para
          vendedores que quieren resultados rápidos{" "}
          <strong>sin invertir tiempo y dinero </strong>
          en otras soluciones más complejas.{" "}
        </p>
        <Image
          src="/hero2.webp"
          alt="hero"
          className="absolute right-0 w-auto h-[750px] -bottom-10"
          width={800}
          height={800}
        />
      </div>
      <div className="px-4">{children}</div>
    </div>
  );
}
