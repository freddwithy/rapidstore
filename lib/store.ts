import prismadb from "./prismadb";

export async function getStoreSubdomain(subdomain: string) {
  if (process.env.NEXT_RUNTIME === "edge") {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/store/${subdomain}`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch store");
    }

    return res.json();
  } else {
    return prismadb.store.findUnique({
      where: {
        name: subdomain,
      },
    });
  }
}

export async function getAllStores() {
  return prismadb.store.findMany();
}
