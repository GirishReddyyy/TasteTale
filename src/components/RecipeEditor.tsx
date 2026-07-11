"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import TiptapEditor from "./TiptapEditor";
import RecipeBook from "./RecipeBook";
import { CornerFlourish } from "@/components/Flourish";
import { ImagePlus, Save, Eye, Edit3, LogOut, ArrowLeft, CheckCircle2, Flame, Fan, Thermometer } from "lucide-react";

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
    ingredientsHtml: initialData?.ingredientsHtml || "",
    stepsHtml: initialData?.stepsHtml || "",
    cookTimeVariants: {
      stove: { time: initialData?.cookTimeVariants?.stove?.time || "", notes: initialData?.cookTimeVariants?.stove?.notes || "" },
      oven: { time: initialData?.cookTimeVariants?.oven?.time || "", notes: initialData?.cookTimeVariants?.oven?.notes || "" },
      airfryer: { time: initialData?.cookTimeVariants?.airfryer?.time || "", notes: initialData?.cookTimeVariants?.airfryer?.notes || "" },
    },
    theme: initialData?.theme || {
      titleFont: "Fredoka",
      titleColor: "#D94F5C",
      bodyFont: "Nunito",
      bodyColor: "#6B4C3B",
      accentColor: "#F4B8C1",
    },
  });

  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Mark as dirty on any recipe change
  useEffect(() => {
    setIsDirty(true);
  }, [recipe]);

  // Remove dirty status if just mounted
  useEffect(() => {
    setIsDirty(false);
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    
    setUploadingImage(true);
    try {
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

  const validate = () => {
    const newErrors = [];
    if (!recipe.title.trim()) newErrors.push("Title is required.");
    if (!recipe.ingredientsHtml || recipe.ingredientsHtml === "<p></p>") newErrors.push("At least one ingredient is required.");
    if (!recipe.stepsHtml || recipe.stepsHtml === "<p></p>") newErrors.push("At least one method step is required.");
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    
    setIsSaving(true);
    setErrors([]);
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
      setSaveSuccess(true);
      setIsDirty(false);
      
      // Show toast briefly before redirecting
      setTimeout(() => {
        router.push(`/recipe/${savedRecipe.slug}`);
        router.refresh();
      }, 1500);
      
    } catch (error: any) {
      setErrors([error.message]);
    } finally {
      setIsSaving(false);
    }
  };

  const previewRecipeData = {
    ...recipe,
    tags: recipe.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
  };

  const handleCancelClick = () => {
    if (isDirty) {
      setShowCancelConfirm(true);
    } else {
      router.push("/edit");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-paper)] p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header / Chrome */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 pb-8 border-b-2 border-dashed border-[var(--color-secondary)]">
          <div>
            <h1 className="text-5xl font-heading text-[var(--color-primary)]">TasteTale</h1>
            <p className="text-[var(--color-text-body)] font-bold mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-supporting)]"></span>
              Logged in as Admin
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {showCancelConfirm ? (
              <div className="flex items-center gap-2 bg-white px-4 py-2 border-2 border-dashed border-[var(--color-secondary)] rounded-xl relative">
                <CornerFlourish className="absolute top-1 left-1 w-3 h-3 opacity-50" />
                <CornerFlourish className="absolute bottom-1 right-1 w-3 h-3 opacity-50" />
                <span className="font-bold text-[var(--color-text-body)] text-sm mr-2 z-10 relative">Discard unsaved changes?</span>
                <button
                  onClick={() => router.push("/edit")}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg font-bold text-sm hover:bg-red-600 z-10 relative"
                >
                  Discard
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-300 z-10 relative"
                >
                  Keep Editing
                </button>
              </div>
            ) : (
              <button
                onClick={handleCancelClick}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-[var(--color-text-body)] border-2 border-dashed border-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/10 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" /> Dashboard
              </button>
            )}

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-[var(--color-text-body)] hover:bg-[var(--color-secondary)]/10 transition-colors"
            >
              <LogOut className="w-5 h-5" /> Log Out
            </button>
          </div>
        </header>

        {/* Success Toast */}
        {saveSuccess && (
          <div className="fixed bottom-8 right-8 bg-[var(--color-supporting)] text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 font-bold z-50 animate-bounce">
            <CheckCircle2 className="w-6 h-6" />
            Recipe saved successfully!
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold font-heading text-[var(--color-primary)]">
            {isEdit ? "Edit Recipe" : "Write a New Recipe"}
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center gap-2 px-6 py-3 border-2 border-dashed border-[var(--color-secondary)] text-[var(--color-text-body)] rounded-full hover:bg-[var(--color-secondary)]/10 transition-colors font-bold bg-white"
            >
              {isPreview ? <><Edit3 className="w-4 h-4" /> Edit Mode</> : <><Eye className="w-4 h-4" /> Live Preview</>}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || saveSuccess}
              className="flex items-center gap-2 px-8 py-3 bg-[var(--color-primary)] text-white rounded-full hover:opacity-90 transition-opacity font-bold disabled:opacity-50"
            >
              <Save className="w-5 h-5" /> {isSaving ? "Saving..." : "Save Recipe"}
            </button>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="bg-[var(--color-secondary)]/20 border-2 border-dashed border-[var(--color-primary)] text-[var(--color-primary)] p-4 rounded-xl mb-8 font-bold">
            <ul className="list-disc pl-5">
              {errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </div>
        )}

        {isPreview ? (
          <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-[var(--color-secondary)] overflow-hidden relative">
            <CornerFlourish className="absolute top-4 left-4 w-6 h-6 opacity-50" />
            <CornerFlourish className="absolute top-4 right-4 w-6 h-6 opacity-50" />
            <CornerFlourish className="absolute bottom-4 left-4 w-6 h-6 opacity-50" />
            <CornerFlourish className="absolute bottom-4 right-4 w-6 h-6 opacity-50" />
            <RecipeBook recipe={previewRecipeData} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Editor Zones */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Title & Slug */}
              <div className="relative bg-white p-8 rounded-2xl shadow-sm border-2 border-dashed border-[var(--color-secondary)] space-y-6">
                <CornerFlourish className="absolute top-3 left-3 w-5 h-5 opacity-60 pointer-events-none" />
                <CornerFlourish className="absolute top-3 right-3 w-5 h-5 opacity-60 pointer-events-none" />
                
                <div>
                  <label className="block font-bold text-[var(--color-text-body)] mb-2 text-lg">Recipe Title</label>
                  <input
                    type="text"
                    value={recipe.title}
                    onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
                    className="w-full px-4 py-3 text-3xl font-heading border-2 border-dashed border-[var(--color-secondary)] rounded-xl focus:outline-none focus:border-[var(--color-primary)]"
                    placeholder="e.g. Grandma's Apple Pie"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--color-text-body)] mb-2">URL Slug</label>
                  <input
                    type="text"
                    value={recipe.slug}
                    onChange={(e) => setRecipe({ ...recipe, slug: e.target.value })}
                    className="w-full px-4 py-2 font-mono text-sm border-2 border-dashed border-[var(--color-secondary)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    placeholder="e.g. grandmas-apple-pie"
                  />
                </div>
              </div>

              {/* Ingredients Zone */}
              <div className="relative bg-white p-8 rounded-2xl shadow-sm border-2 border-dashed border-[var(--color-secondary)]">
                <CornerFlourish className="absolute top-3 left-3 w-5 h-5 opacity-60 pointer-events-none" />
                <CornerFlourish className="absolute top-3 right-3 w-5 h-5 opacity-60 pointer-events-none" />
                <label className="block font-bold text-[var(--color-text-body)] mb-4 text-xl font-heading">Ingredients</label>
                <TiptapEditor
                  content={recipe.ingredientsHtml}
                  onChange={(html) => setRecipe({ ...recipe, ingredientsHtml: html })}
                />
              </div>

              {/* Method Zone */}
              <div className="relative bg-white p-8 rounded-2xl shadow-sm border-2 border-dashed border-[var(--color-secondary)]">
                <CornerFlourish className="absolute top-3 left-3 w-5 h-5 opacity-60 pointer-events-none" />
                <CornerFlourish className="absolute top-3 right-3 w-5 h-5 opacity-60 pointer-events-none" />
                <label className="block font-bold text-[var(--color-text-body)] mb-4 text-xl font-heading">Method & Steps</label>
                <TiptapEditor
                  content={recipe.stepsHtml}
                  onChange={(html) => setRecipe({ ...recipe, stepsHtml: html })}
                />
              </div>
            </div>

            {/* Sidebar Settings */}
            <div className="space-y-8">
              
              {/* Background Image Drop Zone */}
              <div className="relative bg-white p-8 rounded-2xl shadow-sm border-2 border-dashed border-[var(--color-secondary)]">
                <CornerFlourish className="absolute top-3 left-3 w-5 h-5 opacity-60 pointer-events-none" />
                <CornerFlourish className="absolute top-3 right-3 w-5 h-5 opacity-60 pointer-events-none" />
                <label className="block font-bold text-[var(--color-text-body)] mb-4 font-heading text-xl">Illustration</label>
                
                <input
                  type="file"
                  accept="image/*"
                  id="bg-upload"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                
                {recipe.backgroundImageUrl ? (
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden mb-4 border-2 border-dashed border-[var(--color-secondary)] group">
                    <img src={recipe.backgroundImageUrl} alt="Background" className="object-cover w-full h-full" />
                    <label
                      htmlFor="bg-upload"
                      className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer font-bold"
                    >
                      <ImagePlus className="w-8 h-8 mb-2" />
                      Replace Image
                    </label>
                  </div>
                ) : (
                  <label
                    htmlFor="bg-upload"
                    className="aspect-[3/4] w-full rounded-xl bg-[var(--color-bg-paper)] border-4 border-dashed border-[var(--color-secondary)] flex flex-col items-center justify-center text-[var(--color-primary)] mb-4 cursor-pointer hover:bg-[var(--color-secondary)]/10 transition-colors"
                  >
                    <ImagePlus className="w-12 h-12 mb-4 opacity-80" />
                    <span className="font-bold text-center px-4">Drop an image or click to upload</span>
                  </label>
                )}

                {uploadingImage && <p className="text-center text-[var(--color-supporting)] font-bold animate-pulse">Uploading...</p>}
                
                <input
                  type="text"
                  value={recipe.backgroundImageUrl}
                  onChange={(e) => setRecipe({ ...recipe, backgroundImageUrl: e.target.value })}
                  className="w-full mt-2 px-3 py-2 text-sm border-2 border-dashed border-[var(--color-secondary)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  placeholder="Or paste an image URL directly"
                />
              </div>

              {/* Tags */}
              <div className="relative bg-white p-8 rounded-2xl shadow-sm border-2 border-dashed border-[var(--color-secondary)] space-y-4">
                <CornerFlourish className="absolute top-3 left-3 w-5 h-5 opacity-60 pointer-events-none" />
                <CornerFlourish className="absolute top-3 right-3 w-5 h-5 opacity-60 pointer-events-none" />
                <div>
                  <label className="block font-bold text-[var(--color-text-body)] mb-2 font-heading text-xl">Metadata Tags</label>
                  <p className="text-sm text-[var(--color-text-body)] mb-3 opacity-80">Separate tags with commas</p>
                  <input
                    type="text"
                    value={recipe.tags}
                    onChange={(e) => setRecipe({ ...recipe, tags: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-dashed border-[var(--color-secondary)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    placeholder="Dessert, Baking, Cozy"
                  />
                </div>
              </div>

              {/* Cook Time Variants */}
              <div className="relative bg-white p-8 rounded-2xl shadow-sm border-2 border-dashed border-[var(--color-secondary)] space-y-6">
                <CornerFlourish className="absolute top-3 left-3 w-5 h-5 opacity-60 pointer-events-none" />
                <CornerFlourish className="absolute top-3 right-3 w-5 h-5 opacity-60 pointer-events-none" />
                <label className="block font-bold text-[var(--color-text-body)] font-heading text-xl">Cook Times</label>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold mb-1">
                      <Flame className="w-4 h-4" /> Stove
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={recipe.cookTimeVariants.stove.time}
                        onChange={(e) => setRecipe({ ...recipe, cookTimeVariants: { ...recipe.cookTimeVariants, stove: { ...recipe.cookTimeVariants.stove, time: e.target.value } } })}
                        className="w-1/3 px-3 py-2 border-2 border-dashed border-[var(--color-secondary)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)]"
                        placeholder="Time (20m)"
                      />
                      <input
                        type="text"
                        value={recipe.cookTimeVariants.stove.notes}
                        onChange={(e) => setRecipe({ ...recipe, cookTimeVariants: { ...recipe.cookTimeVariants, stove: { ...recipe.cookTimeVariants.stove, notes: e.target.value } } })}
                        className="w-2/3 px-3 py-2 border-2 border-dashed border-[var(--color-secondary)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)]"
                        placeholder="Notes (Medium heat)"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold mb-1">
                      <Thermometer className="w-4 h-4" /> Oven
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={recipe.cookTimeVariants.oven.time}
                        onChange={(e) => setRecipe({ ...recipe, cookTimeVariants: { ...recipe.cookTimeVariants, oven: { ...recipe.cookTimeVariants.oven, time: e.target.value } } })}
                        className="w-1/3 px-3 py-2 border-2 border-dashed border-[var(--color-secondary)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)]"
                        placeholder="Time (45m)"
                      />
                      <input
                        type="text"
                        value={recipe.cookTimeVariants.oven.notes}
                        onChange={(e) => setRecipe({ ...recipe, cookTimeVariants: { ...recipe.cookTimeVariants, oven: { ...recipe.cookTimeVariants.oven, notes: e.target.value } } })}
                        className="w-2/3 px-3 py-2 border-2 border-dashed border-[var(--color-secondary)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)]"
                        placeholder="Notes (350°F / 175°C)"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold mb-1">
                      <Fan className="w-4 h-4" /> Air Fryer
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={recipe.cookTimeVariants.airfryer.time}
                        onChange={(e) => setRecipe({ ...recipe, cookTimeVariants: { ...recipe.cookTimeVariants, airfryer: { ...recipe.cookTimeVariants.airfryer, time: e.target.value } } })}
                        className="w-1/3 px-3 py-2 border-2 border-dashed border-[var(--color-secondary)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)]"
                        placeholder="Time (15m)"
                      />
                      <input
                        type="text"
                        value={recipe.cookTimeVariants.airfryer.notes}
                        onChange={(e) => setRecipe({ ...recipe, cookTimeVariants: { ...recipe.cookTimeVariants, airfryer: { ...recipe.cookTimeVariants.airfryer, notes: e.target.value } } })}
                        className="w-2/3 px-3 py-2 border-2 border-dashed border-[var(--color-secondary)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)]"
                        placeholder="Notes (400°F, shake half)"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
