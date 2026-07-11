"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

type RecipeCardProps = {
  _id: string;
  slug: string;
  title: string;
  backgroundImageUrl: string;
  tags: string[];
};

export default function RecipeGrid({
  initialRecipes,
}: {
  initialRecipes: RecipeCardProps[];
}) {
  const [search, setSearch] = useState("");

  const filteredRecipes = initialRecipes.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="relative max-w-md mx-auto mb-12">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border-2 border-pink-200 rounded-full bg-white/80 backdrop-blur-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-colors shadow-sm"
          placeholder="Search for a recipe or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="text-center py-20 text-slate-500 text-lg">
          No recipes found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredRecipes.map((recipe) => (
            <Link href={`/recipe/${recipe.slug}`} key={recipe._id}>
              <div className="group relative rounded-2xl overflow-hidden aspect-[3/4] shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${recipe.backgroundImageUrl})` }}
                />
                {/* Vintage overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-handwritten text-4xl text-white mb-2 leading-tight drop-shadow-md">
                    {recipe.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-white/20 backdrop-blur-md text-white rounded-md border border-white/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
