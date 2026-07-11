import dbConnect from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import RecipeGrid from "@/components/RecipeGrid";

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
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <header className="text-center mb-16 pt-12">
        <h1 className="text-6xl font-handwritten text-pink-500 mb-4 drop-shadow-sm">
          TasteTale
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-sans">
          Welcome to our storybook of delicious recipes. Flip through the pages
          and find your next culinary adventure.
        </p>
      </header>

      <RecipeGrid initialRecipes={serializedRecipes} />
    </main>
  );
}
