import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PlanComparison from "./components/plan-comparison";
import { currentUser } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

const UpgradePage = async () => {
  const user = await currentUser();
  const userDB = await prismadb.user.findUnique({
    where: {
      clerk_id: user?.id,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actualiza tu plan</CardTitle>
        <CardDescription>
          Selecciona tu plan y empieza a vender más
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PlanComparison planProp={userDB?.user_type} />
      </CardContent>
      <CardFooter>
        <div className="flex flex-col">
          <p className="text-sm text-muted-foreground">
            Nuestros planes son flexibles y adaptados a tus necesidades. Si
            necesitas ayuda, no dudes en contactarnos. Recuerda que puedes
            cancelar tu suscripción en cualquier momento.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default UpgradePage;
