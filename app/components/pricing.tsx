"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Pricing() {
  const plans = [
    {
      name: "Gratuito",
      link: "/sign-up",
      price: "0",
      description: "Perfecto para comenzar tu negocio online",
      features: [
        "Máximo 10 productos",
        "3 categorías",
        "1 opción por producto",
        "Soporte por email",
        "Panel de control básico",
      ],
      cta: "Comenzar gratis",
      popular: false,
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      buttonClass:
        "bg-white border border-zinc-300 hover:bg-zinc-50 text-blue-700",
    },
    {
      name: "Pro",
      price: "79.000",
      link: "https://wa.me/595994151009",
      description: "Ideal para negocios en crecimiento",
      features: [
        "Productos ilimitados",
        "Categorías ilimitadas",
        "Hasta 10 opciones por producto",
        "Soporte prioritario",
        "Estadísticas avanzadas",
        "Personalización de diseño",
      ],
      cta: "Contactar ventas",
      popular: true,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      buttonClass: "bg-blue-500 hover:bg-blue-600 text-white",
    },
    {
      name: "Empresarial",
      price: "149.000",
      link: "https://wa.me/595994151009",
      description: "Para vendedores profesionales",
      features: [
        "Todo lo del plan Pro",
        "Hasta 3 tiendas",
        "Dominio personalizado",
        "Soporte telefónico",
        "Integraciones avanzadas",
        "Reportes personalizados",
      ],
      cta: "Contactar ventas",
      popular: false,
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      buttonClass: "bg-blue-700 hover:bg-blue-800 text-white",
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-secondary-foreground">
            Planes simples y transparentes
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl max-w-3xl mx-auto">
            Elige el plan que mejor se adapte a tus necesidades. Sin sorpresas
            ni costos ocultos.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={`relative flex flex-col p-8 rounded-3xl ${plan.popular ? "border-2 border-primary shadow-xl" : "border shadow-sm"} bg-card`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Más popular
                  </div>
                </div>
              )}
              <div className="mb-5">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className={`text-4xl font-extrabold ${plan.color}`}>
                    Gs. {plan.price}
                  </span>
                  <span className="ml-1 text-primary">/mes</span>
                </div>
                <p className="mt-2 text-muted-foreground">{plan.description}</p>
              </div>
              <ul className="mb-8 space-y-3 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <div
                      className={`flex items-center justify-center h-5 w-5 rounded-full ${plan.bgColor} mr-2`}
                    >
                      <Check className={`h-3 w-3 ${plan.color}`} />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.link}
                className={`w-full rounded-full transition-all py-2 flex items-center justify-center gap-4  ${plan.buttonClass} `}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
