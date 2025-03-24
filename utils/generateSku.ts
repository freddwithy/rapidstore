export const generateSKU = async (
  name: string,
  variantName?: string | null,
  colorId?: string | null,
  variantId?: string | null
) => {
  const productName = name
    .slice(0, 3) // Tomamos las primeras 3 letras del nombre del producto
    .toUpperCase()
    .replace(/\s+/g, ""); // Eliminamos espacios en blanco
  const colorCode = colorId?.slice(22, 25).toUpperCase() || "SINCOLOR"; // Primeros 2 caracteres del colorId
  const variantCode = variantId?.slice(22, 25).toUpperCase() || "SINVARIANT"; // Primeros 2 caracteres del variantId
  const timestamp = new Date().getTime().toString().slice(-4); // Timestamp actual
  const variantNameCode = variantName
    ?.slice(0, 3)
    .toUpperCase()
    .replace(/\s+/g, ""); // Eliminamos espacios en blanco

  return `${productName}-${colorCode}${variantCode}${variantName && variantNameCode}-${timestamp}`;
};
