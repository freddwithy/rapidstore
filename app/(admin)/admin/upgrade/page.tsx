import {
  Card,
  CardContent,
  CardDescription,
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
    </Card>
  );
};

export default UpgradePage;
