import RecipeEditor from "@/components/RecipeEditor";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export default async function NewRecipePage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7]">
      <RecipeEditor />
    </div>
  );
}
