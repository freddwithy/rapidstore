export const generateSKU = async (
  name: string,
  colorId: string,
  variantId: string
) => {
  const productName = name
    .slice(0, 3) // Tomamos las primeras 3 letras del nombre del producto
    .toUpperCase()
    .replace(/\s+/g, ""); // Eliminamos espacios en blanco
  const colorCode = colorId.slice(22, 25).toUpperCase(); // Primeros 2 caracteres del colorId
  const variantCode = variantId.slice(22, 25).toUpperCase(); // Primeros 2 caracteres del variantId
  const timestamp = new Date().getTime().toString().slice(-4); // Timestamp actual

  return `${productName}-${colorCode}${variantCode}-${timestamp}`;
};
