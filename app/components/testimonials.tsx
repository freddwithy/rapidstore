"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "María González",
      role: "Artesana",
      content:
        "Tiendy me permitió crear mi tienda en minutos. Ahora puedo vender mis productos artesanales sin preocuparme por la tecnología.",
      avatar: "/avatar2.webp",
      stars: 5,
      color: "border-blue-500",
    },
    {
      name: "Carlos Rodríguez",
      role: "Emprendedor",
      content:
        "Probé varias plataformas antes, pero ninguna era tan sencilla como Tiendy. El plan Pro me da todo lo que necesito para mi negocio.",
      avatar: "/avatar3.webp",
      stars: 5,
      color: "border-blue-500",
    },
    {
      name: "Laura Martínez",
      role: "Diseñadora",
      content:
        "Como diseñadora, valoro mucho la estética. Tiendy me permite tener una tienda bonita sin tener que programar nada.",
      avatar: "/avatar1.webp",
      stars: 4,
      color: "border-blue-500",
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-secondary-foreground">
            Lo que dicen nuestros clientes
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl max-w-3xl mx-auto">
            Miles de vendedores ya confían en Tiendy para sus negocios online
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-card p-8 rounded-3xl shadow-sm border  card-hover"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`relative h-14 w-14 overflow-hidden rounded-full border-2 ${testimonial.color}`}
                >
                  <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < testimonial.stars ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <p className="text-muted-foreground">{testimonial.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
