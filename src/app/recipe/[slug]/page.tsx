import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import RecipeBook from "@/components/RecipeBook";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  await dbConnect();

  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as any)?.role === "admin";

  const query: any = { slug: resolvedParams.slug };
  if (!isAdmin) query.isVisible = { $ne: false };

  const recipe = await Recipe.findOne(query).lean();

  if (!recipe) {
    notFound();
  }

  // Find next and previous recipes (ordered by createdAt descending)
  // "Next" means older recipe (smaller createdAt)
  const nextQuery: any = { createdAt: { $lt: recipe.createdAt } };
  if (!isAdmin) nextQuery.isVisible = { $ne: false };
  const nextRecipe = await Recipe.findOne(nextQuery)
    .sort({ createdAt: -1 })
    .select("slug")
    .lean();

  // "Previous" means newer recipe (larger createdAt)
  const prevQuery: any = { createdAt: { $gt: recipe.createdAt } };
  if (!isAdmin) prevQuery.isVisible = { $ne: false };
  const prevRecipe = await Recipe.findOne(prevQuery)
    .sort({ createdAt: 1 })
    .select("slug")
    .lean();

  const serializedRecipe = {
    ...recipe,
    _id: recipe._id.toString(),
    authorId: recipe.authorId?.toString() ?? "",
    createdAt: recipe.createdAt.toISOString(),
    updatedAt: recipe.updatedAt.toISOString(),
  };

  return (
    <main className="min-h-screen bg-[#fdfbf7] flex items-center justify-center p-4 sm:p-8">
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-pink-500 transition-colors z-50 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Recipes
      </Link>
      <RecipeBook 
        recipe={serializedRecipe as any} 
        nextSlug={nextRecipe?.slug} 
        prevSlug={prevRecipe?.slug} 
      />
    </main>
  );
}
