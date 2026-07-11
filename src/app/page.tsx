import dbConnect from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import RecipeGrid from "@/components/RecipeGrid";
import { CornerFlourish, CherryFlourish } from "@/components/Flourish";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function Home() {
  await dbConnect();

  // Fetch recipes from DB, lean() for plain JS objects
  const recipes = await Recipe.find({})
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  // Convert ObjectIds/Dates to strings for client component serialization
  const serializedRecipes = recipes.map((recipe: any) => ({
    ...recipe,
    _id: recipe._id.toString(),
    authorId: recipe.authorId.toString(),
    createdAt: recipe.createdAt.toISOString(),
    updatedAt: recipe.updatedAt.toISOString(),
  }));

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto relative">
      <div className="absolute top-8 right-8 z-50">
        <Link
          href="/edit"
          className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-[var(--color-primary)] bg-white border-2 border-dashed border-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/10 transition-colors shadow-sm"
        >
          <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
        </Link>
      </div>

      <header className="text-center mb-16 pt-12 relative">
        <CornerFlourish className="absolute top-8 left-[10%] w-12 h-12 opacity-60 hidden md:block" />
        <CherryFlourish className="absolute bottom-0 right-[10%] w-10 h-10 opacity-70 hidden md:block" />
        <h1 className="text-6xl font-heading text-[var(--color-primary)] mb-4 drop-shadow-sm flex items-center justify-center gap-4">
          <CherryFlourish className="w-8 h-8 opacity-80 md:hidden" />
          TasteTale
          <CornerFlourish className="w-8 h-8 opacity-80 md:hidden" />
        </h1>
        <p className="text-xl text-[var(--color-text-body)] max-w-2xl mx-auto font-sans">
          Welcome to our storybook of delicious recipes. Flip through the pages
          and find your next culinary adventure.
        </p>
      </header>

      <RecipeGrid initialRecipes={serializedRecipes} />
    </main>
  );
}
