"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TiptapEditor from "./TiptapEditor";
import RecipeBook from "./RecipeBook";
import { ImagePlus, Save, Eye, Edit3 } from "lucide-react";

type RecipeEditorProps = {
  initialData?: any;
  isEdit?: boolean;
};

export default function RecipeEditor({ initialData, isEdit }: RecipeEditorProps) {
  const router = useRouter();
  
  const [recipe, setRecipe] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    tags: initialData?.tags?.join(", ") || "",
    backgroundImageUrl: initialData?.backgroundImageUrl || "",
    ingredientsHtml: initialData?.ingredientsHtml || "<ul><li>Ingredient 1</li></ul>",
    stepsHtml: initialData?.stepsHtml || "<ol><li>Step 1</li></ol>",
    cookTimeVariants: {
      stove: { time: initialData?.cookTimeVariants?.stove?.time || "", notes: initialData?.cookTimeVariants?.stove?.notes || "" },
      oven: { time: initialData?.cookTimeVariants?.oven?.time || "", notes: initialData?.cookTimeVariants?.oven?.notes || "" },
      airfryer: { time: initialData?.cookTimeVariants?.airfryer?.time || "", notes: initialData?.cookTimeVariants?.airfryer?.notes || "" },
    },
    theme: initialData?.theme || {
      titleFont: "Caveat",
      titleColor: "#333333",
      bodyFont: "Inter",
      bodyColor: "#444444",
      accentColor: "#fbcfe8",
    },
  });

  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    
    setUploadingImage(true);
    try {
      // In a real app, you might use @vercel/blob/client upload, but for simplicity we POST to our API
      // Since @vercel/blob requires a token, API routes are safer.
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      });
      const blob = await response.json();
      if (blob.url) {
        setRecipe({ ...recipe, backgroundImageUrl: blob.url });
      } else {
        alert("Upload failed: " + blob.error);
      }
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...recipe,
        tags: recipe.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
      };

      const url = isEdit ? `/api/recipes/${recipe.slug}` : "/api/recipes";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save");
      }

      const savedRecipe = await res.json();
      router.push(`/recipe/${savedRecipe.slug}`);
      router.refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const previewRecipeData = {
    ...recipe,
    tags: recipe.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-handwritten text-pink-500">
          {isEdit ? "Edit Recipe" : "Create New Recipe"}
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            {isPreview ? <><Edit3 className="w-4 h-4" /> Edit Mode</> : <><Eye className="w-4 h-4" /> Live Preview</>}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save Recipe"}
          </button>
        </div>
      </div>

      {isPreview ? (
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 overflow-hidden">
          <RecipeBook recipe={previewRecipeData} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor Zones */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Slug */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Recipe Title</label>
                <input
                  type="text"
                  value={recipe.title}
                  onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
                  className="w-full px-4 py-2 text-xl font-handwritten border border-slate-200 rounded-lg"
                  placeholder="e.g. Grandma's Apple Pie"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">URL Slug</label>
                <input
                  type="text"
                  value={recipe.slug}
                  onChange={(e) => setRecipe({ ...recipe, slug: e.target.value })}
                  className="w-full px-4 py-2 font-mono text-sm border border-slate-200 rounded-lg"
                  placeholder="e.g. grandmas-apple-pie"
                />
              </div>
            </div>

            {/* Ingredients Zone */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <label className="block text-sm font-bold text-slate-700 mb-4">Ingredients Zone</label>
              <TiptapEditor
                content={recipe.ingredientsHtml}
                onChange={(html) => setRecipe({ ...recipe, ingredientsHtml: html })}
              />
            </div>

            {/* Method Zone */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <label className="block text-sm font-bold text-slate-700 mb-4">Method / Steps Zone</label>
              <TiptapEditor
                content={recipe.stepsHtml}
                onChange={(html) => setRecipe({ ...recipe, stepsHtml: html })}
              />
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-8">
            {/* Background Image */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <label className="block text-sm font-bold text-slate-700 mb-4">Background Illustration</label>
              
              {recipe.backgroundImageUrl ? (
                <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden mb-4 border border-slate-200">
                  <img src={recipe.backgroundImageUrl} alt="Background" className="object-cover w-full h-full" />
                </div>
              ) : (
                <div className="aspect-[3/4] w-full rounded-lg bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 mb-4">
                  <ImagePlus className="w-8 h-8 mb-2" />
                  <span>No image uploaded</span>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                id="bg-upload"
                className="hidden"
                onChange={handleImageUpload}
              />
              <label
                htmlFor="bg-upload"
                className="block w-full text-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer font-medium"
              >
                {uploadingImage ? "Uploading..." : "Upload Image"}
              </label>
              {recipe.backgroundImageUrl && (
                 <input
                 type="text"
                 value={recipe.backgroundImageUrl}
                 onChange={(e) => setRecipe({ ...recipe, backgroundImageUrl: e.target.value })}
                 className="w-full mt-2 px-3 py-1 text-xs border border-slate-200 rounded-md"
                 placeholder="Or paste image URL"
               />
              )}
            </div>

            {/* Tags & Settings */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={recipe.tags}
                  onChange={(e) => setRecipe({ ...recipe, tags: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm"
                  placeholder="Dessert, Baking, Cozy"
                />
              </div>
            </div>

            {/* Cook Time Variants */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
              <label className="block text-sm font-bold text-slate-700">Cook Time Notes</label>
              
              {['stove', 'oven', 'airfryer'].map((type) => (
                <div key={type} className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">{type}</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={recipe.cookTimeVariants[type as keyof typeof recipe.cookTimeVariants].time}
                      onChange={(e) => setRecipe({
                        ...recipe,
                        cookTimeVariants: {
                          ...recipe.cookTimeVariants,
                          [type]: { ...recipe.cookTimeVariants[type as keyof typeof recipe.cookTimeVariants], time: e.target.value }
                        }
                      })}
                      className="w-1/3 px-3 py-1 border border-slate-200 rounded-lg text-sm"
                      placeholder="e.g. 20m"
                    />
                    <input
                      type="text"
                      value={recipe.cookTimeVariants[type as keyof typeof recipe.cookTimeVariants].notes}
                      onChange={(e) => setRecipe({
                        ...recipe,
                        cookTimeVariants: {
                          ...recipe.cookTimeVariants,
                          [type]: { ...recipe.cookTimeVariants[type as keyof typeof recipe.cookTimeVariants], notes: e.target.value }
                        }
                      })}
                      className="w-2/3 px-3 py-1 border border-slate-200 rounded-lg text-sm"
                      placeholder="Notes..."
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Theme Settings */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
              <label className="block text-sm font-bold text-slate-700">Theme Variables</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Title Color</label>
                  <input
                    type="color"
                    value={recipe.theme.titleColor}
                    onChange={(e) => setRecipe({ ...recipe, theme: { ...recipe.theme, titleColor: e.target.value } })}
                    className="w-full h-8 cursor-pointer rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Accent Color</label>
                  <input
                    type="color"
                    value={recipe.theme.accentColor}
                    onChange={(e) => setRecipe({ ...recipe, theme: { ...recipe.theme, accentColor: e.target.value } })}
                    className="w-full h-8 cursor-pointer rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
