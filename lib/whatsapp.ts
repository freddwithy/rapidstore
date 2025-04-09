interface OrderProduct {
  product: {
    name: string;
  };
  variant?: {
    name: string;
  } | null;
  qty: number;
  total: number;
}

interface Order {
  id: number;
  total: number;
  orderProducts: OrderProduct[];
  customer?: {
    name: string;
    lastName: string;
    tel?: number;
    email?: string;
  };
}

export function generateWhatsAppMessage(
  order: Order,
  storeName: string,
  tenant: string,
  storePhone: string
): string {
  // Formatear el número de teléfono (eliminar espacios, guiones, etc)
  let formattedPhone = storePhone.replace(/\D/g, "");
  // Si el número comienza con 0, eliminarlo
  formattedPhone = formattedPhone.replace(/^0+/, "");

  // Construir el mensaje
  let message = `*Nuevo pedido!*\n\n`;
  message += `Hola ${storeName}!\n\n`;
  message += `Me gustaría hacer un pedido con los siguientes productos:\n\n`;

  // Agregar cada producto
  order.orderProducts.forEach((item) => {
    message += `• ${item.product.name}`;
    if (item.variant) {
      message += ` | ${item.variant.name}`;
    }
    message += ` x ${item.qty}\n`;
  });

  // Agregar el total
  message += `\n*Total: ${new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
  }).format(order.total)}*\n`;

  message += `\n--------------------------------\n\n`;
  message += `Mis datos son:\n`;
  if (order.customer) {
    message += `• Nombre: ${order.customer.name} ${order.customer.lastName}\n`;
    if (order.customer.tel) {
      message += `• Teléfono: ${order.customer.tel}\n`;
    }
    if (order.customer.email) {
      message += `• Email: ${order.customer.email}\n`;
    }
  }

  message += `\n*Muchas gracias!*\n\n`;
  message += `Ver pedido: https://giddi.shop/${tenant}/cart/${order.id}/confirmation`;

  // Generar el enlace de WhatsApp
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;

  return whatsappUrl;
}
