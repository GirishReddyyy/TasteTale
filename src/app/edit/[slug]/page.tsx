import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import RecipeEditor from "@/components/RecipeEditor";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    redirect("/login");
  }

  const resolvedParams = await params;
  await dbConnect();
  const recipe = await Recipe.findOne({ slug: resolvedParams.slug }).lean();

  if (!recipe) {
    notFound();
  }

  const serializedRecipe = {
    ...recipe,
    _id: recipe._id.toString(),
    authorId: recipe.authorId?.toString() ?? "",
    createdAt: recipe.createdAt.toISOString(),
    updatedAt: recipe.updatedAt.toISOString(),
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7]">
      <RecipeEditor initialData={serializedRecipe} isEdit={true} />
    </div>
  );
}
