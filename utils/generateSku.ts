import prismadb from "@/lib/prismadb"
// utils/generateSKU.js
export const generateSKU = async (index: number = 0) => {
  const prefix = "PROD";
  const timestamp = new Date().getTime().toString().slice(-6); // Últimos 6 dígitos del timestamp
  const count = await prismadb.variantProduct.count(); // Número total de productos
  const sequentialNumber = (count + 1 + index).toString().padStart(4, "0"); // Número secuencial
  return `${prefix}-${timestamp}-${sequentialNumber}`;
};
