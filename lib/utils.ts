import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatter = new Intl.NumberFormat("es-PY", {
  style: "currency",
  currency: "PYG",
});

export const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const phoneFormatter = new Intl.NumberFormat("es-PY", {
  style: "decimal",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
  useGrouping: false,
});

export const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ruqmlhen");
  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dxyfhaiu2/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    toast.error("Error al subir la imagen");
    return;
  } else {
    toast.success("Imagen subida correctamente");
    const data = await response.json();
    return data.secure_url;
  }
};
