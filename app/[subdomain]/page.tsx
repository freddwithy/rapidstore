import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prismadb from "@/lib/prismadb";
import { notFound } from "next/navigation";

export default async function SubdomainPage({
  params,
}: {
  params: { subdomain: string };
}) {
  const { subdomain } = params;
  console.log("Page: Received request for store with subdomain", subdomain);

  try {
    const store = await prismadb.store.findUnique({
      where: {
        name: subdomain,
      },
    });

    console.log("Page: Found store", store);

    if (!store) {
      console.log("Page: Store not found, returning 404");
      notFound();
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>{store.name}</CardTitle>
          <CardDescription>{store.description}</CardDescription>
        </CardHeader>
      </Card>
    );
  } catch (err) {
    console.log("[STORE_GET]", err);
    return (
      <Alert>
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>Please try again later</AlertDescription>
      </Alert>
    );
  }
}
