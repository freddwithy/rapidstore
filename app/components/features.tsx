"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Tag, Layers, Palette, Clock, Globe } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <ShoppingCart className="h-10 w-10 text-cyan-500" />,
      title: "Gestión de Productos",
      description:
        "Añade productos con imágenes, descripciones y opciones de manera sencilla e intuitiva.",
      bgColor: "bg-cyan-50",
    },
    {
      icon: <Tag className="h-10 w-10 text-cyan-500" />,
      title: "Categorías Personalizables",
      description:
        "Organiza tus productos en categorías para que tus clientes encuentren lo que buscan rápidamente.",
      bgColor: "bg-cyan-50",
    },
    {
      icon: <Layers className="h-10 w-10 text-sky-700" />,
      title: "Opciones de Productos",
      description:
        "Configura variantes como tallas, colores y otras opciones según tus necesidades.",
      bgColor: "bg-sky-50",
    },
    {
      icon: <Palette className="h-10 w-10 text-sky-700" />,
      title: "Personalización Sencilla",
      description:
        "Adapta el aspecto de tu tienda con temas prediseñados sin necesidad de conocimientos técnicos.",
      bgColor: "bg-sky-50",
    },
    {
      icon: <Clock className="h-10 w-10 text-cyan-500" />,
      title: "Configuración Rápida",
      description:
        "Crea tu tienda en menos de un minuto y empieza a vender inmediatamente.",
      bgColor: "bg-cyan-50",
    },
    {
      icon: <Globe className="h-10 w-10 text-sky-700" />,
      title: "Dominio Personalizado",
      description:
        "Conecta tu propio dominio para dar una imagen más profesional a tu negocio.",
      bgColor: "bg-sky-50",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-sky-700">
            Características que te encantarán
          </h2>
          <p className="mt-4 text-zinc-600 md:text-xl max-w-3xl mx-auto">
            Tiendy ofrece todo lo que necesitas para crear y gestionar tu tienda
            online sin complicaciones
          </p>
        </motion.div>

        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow card-hover"
              variants={itemVariants}
            >
              <div
                className={`mb-4 p-3 ${feature.bgColor} inline-block rounded-2xl`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-zinc-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
