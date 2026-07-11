"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { CornerFlourish } from "@/components/Flourish";
import { Edit, Trash2, Plus, LogOut, Search, Eye } from "lucide-react";

type Recipe = {
  _id: string;
  slug: string;
  title: string;
  backgroundImageUrl: string;
  tags: string[];
};

export default function AdminDashboard() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await fetch("/api/recipes");
      if (res.ok) {
        const data = await res.json();
        setRecipes(data);
      }
    } catch (error) {
      console.error("Failed to fetch recipes", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string, id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/recipes/${slug}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setRecipes((prev) => prev.filter((r) => r._id !== id));
      } else {
        alert("Failed to delete recipe");
      }
    } catch (error) {
      alert("Error deleting recipe");
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-paper)] flex flex-col items-center justify-center p-4">
        <div className="relative p-8 bg-white border-2 border-dashed border-[var(--color-secondary)] rounded-2xl shadow-sm animate-pulse flex flex-col items-center">
          <CornerFlourish className="absolute top-2 left-2 w-5 h-5 opacity-50" />
          <CornerFlourish className="absolute top-2 right-2 w-5 h-5 opacity-50" />
          <CornerFlourish className="absolute bottom-2 left-2 w-5 h-5 opacity-50" />
          <CornerFlourish className="absolute bottom-2 right-2 w-5 h-5 opacity-50" />
          <div className="w-12 h-12 border-4 border-[var(--color-secondary)] border-t-[var(--color-primary)] rounded-full animate-spin mb-4"></div>
          <p className="text-[var(--color-text-body)] font-heading text-xl">Loading your book...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-paper)] p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header / Chrome */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16 pb-8 border-b-2 border-dashed border-[var(--color-secondary)]">
          <div>
            <h1 className="text-5xl font-heading text-[var(--color-primary)]">TasteTale</h1>
            <p className="text-[var(--color-text-body)] font-bold mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-supporting)]"></span>
              Logged in as Admin
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link
              href="/edit/new"
              className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-6 py-3 rounded-full font-bold hover:opacity-90 transition-opacity shadow-sm"
            >
              <Plus className="w-5 h-5" /> New Recipe
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-[var(--color-text-body)] border-2 border-dashed border-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/10 transition-colors"
            >
              <LogOut className="w-5 h-5" /> Log Out
            </button>
          </div>
        </header>

        {recipes.length > 0 && (
          <div className="relative max-w-md mx-auto mb-12">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-3 border-2 border-dashed border-[var(--color-secondary)] rounded-full bg-white text-[var(--color-text-body)] placeholder-slate-400 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all shadow-sm"
              placeholder="Search by title or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {/* Content */}
        {recipes.length === 0 ? (
          <div className="text-center py-20 max-w-lg mx-auto">
            <div className="relative inline-block p-10 bg-white rounded-2xl border-2 border-dashed border-[var(--color-secondary)] shadow-sm mb-6">
              <CornerFlourish className="absolute top-2 left-2 w-5 h-5 opacity-50" />
              <CornerFlourish className="absolute top-2 right-2 w-5 h-5 opacity-50" />
              <CornerFlourish className="absolute bottom-2 left-2 w-5 h-5 opacity-50" />
              <CornerFlourish className="absolute bottom-2 right-2 w-5 h-5 opacity-50" />
              <span className="text-6xl">📖</span>
            </div>
            <h2 className="text-3xl font-heading text-[var(--color-primary)] mb-4">Your book is empty!</h2>
            <p className="text-[var(--color-text-body)] text-lg mb-8">Write your very first recipe to start filling the pages.</p>
            <Link
              href="/edit/new"
              className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" /> Create Recipe
            </Link>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-20 text-[var(--color-text-body)] text-lg">
            No recipes match your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredRecipes.map((recipe) => (
              <div key={recipe._id} className="relative group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border-2 border-dashed border-[var(--color-secondary)] flex flex-col">
                <CornerFlourish className="absolute top-2 left-2 w-5 h-5 opacity-90 z-10" />
                <CornerFlourish className="absolute top-2 right-2 w-5 h-5 opacity-90 z-10" />
                
                <div 
                  className="aspect-video w-full bg-cover bg-center border-b-2 border-dashed border-[var(--color-secondary)]"
                  style={{ backgroundImage: `url(${recipe.backgroundImageUrl})` }}
                />
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-heading text-2xl text-[var(--color-primary)] mb-3 leading-tight">
                    {recipe.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {recipe.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-[var(--color-supporting)]/10 text-[var(--color-supporting)] font-bold rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-auto grid grid-cols-3 gap-2 pt-4 border-t-2 border-dashed border-[var(--color-secondary)]/50">
                    <Link
                      href={`/recipe/${recipe.slug}`}
                      target="_blank"
                      title="View Live"
                      className="flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-[var(--color-supporting)] hover:bg-[var(--color-supporting)]/10 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    
                    <Link
                      href={`/edit/${recipe.slug}`}
                      title="Edit Recipe"
                      className="flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    
                    {confirmDeleteId === recipe._id ? (
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleDelete(recipe.slug, recipe._id)}
                          disabled={deletingId === recipe._id}
                          className="flex-1 py-2 bg-red-500 text-white rounded-lg font-bold text-sm hover:bg-red-600 disabled:opacity-50"
                        >
                          {deletingId === recipe._id ? "..." : "Yes"}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="flex-1 py-2 bg-slate-200 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-300"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(recipe._id)}
                        className="flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
