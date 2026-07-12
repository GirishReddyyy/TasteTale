"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { IRecipe } from "@/models/Recipe";
import { Clock, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, X } from "lucide-react";
import ImageDownloader from "./ImageDownloader";

export default function RecipeBook({ recipe, nextSlug, prevSlug }: { recipe: any; nextSlug?: string; prevSlug?: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Prefetch adjacent recipes on mount
  useEffect(() => {
    if (nextSlug) router.prefetch(`/recipe/${nextSlug}`);
    if (prevSlug) router.prefetch(`/recipe/${prevSlug}`);
  }, [nextSlug, prevSlug, router]);

  const handleNavigate = useCallback((slug?: string) => {
    if (!slug) return;
    
    // On mobile, just navigate immediately. On desktop, close book then navigate.
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      router.push(`/recipe/${slug}`);
    } else {
      setIsOpen(false);
      setTimeout(() => {
        router.push(`/recipe/${slug}`);
      }, 1000); // Wait for close animation
    }
  }, [router]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input (though there shouldn't be any here)
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' && nextSlug) {
        handleNavigate(nextSlug);
      } else if (e.key === 'ArrowLeft' && prevSlug) {
        handleNavigate(prevSlug);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlug, prevSlug, handleNavigate]);

  const theme = recipe.theme || {
    titleFont: "Caveat",
    titleColor: "#333333",
    bodyFont: "Inter",
    bodyColor: "#444444",
    accentColor: "#fbcfe8",
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-7xl mx-auto h-[85vh] relative px-0 md:px-24">
      <div className="w-full h-full relative perspective-[2500px]">
      {/* Mobile view (no 3D flip, just simple fade/slide) */}
      <div
        className="md:hidden w-full h-full rounded-xl overflow-hidden shadow-2xl relative bg-cover bg-center overflow-y-auto"
        style={{ backgroundImage: `url(${recipe.backgroundImageUrl})` }}
      >
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
        
        {/* Mobile Prev Button */}
        {prevSlug && (
           <div className="relative z-20 flex justify-center pt-6">
             <button
               onClick={() => handleNavigate(prevSlug)}
               className="p-3 bg-[var(--color-primary)] text-white rounded-full border-2 border-dashed border-white/50 shadow-lg hover:bg-white hover:text-[var(--color-primary)] transition-all"
               aria-label="Previous Recipe"
             >
               <ArrowUp className="w-5 h-5" />
             </button>
           </div>
        )}

        <div className="relative z-10 p-6 flex flex-col gap-8" style={{ color: theme.bodyColor }}>
          <h1
            className="text-5xl text-center mt-8 drop-shadow-sm"
            style={{ fontFamily: `var(--font-${theme.titleFont.toLowerCase()})`, color: theme.titleColor }}
          >
            {recipe.title}
          </h1>

          <div className="bg-white/95 p-6 rounded-2xl shadow-sm border border-white/40">
            <h2 className="text-2xl mb-4 font-bold">Ingredients</h2>
            <div className="prose prose-pink max-w-none" dangerouslySetInnerHTML={{ __html: recipe.ingredientsHtml }} />
          </div>

          <div className="bg-white/95 p-6 rounded-2xl shadow-sm border border-white/40">
            <h2 className="text-2xl mb-4 font-bold">Method</h2>
            <div className="prose prose-pink max-w-none" dangerouslySetInnerHTML={{ __html: recipe.stepsHtml }} />
          </div>

          <div className="bg-white/95 p-6 rounded-2xl shadow-sm border border-white/40 mb-8">
            <h2 className="text-2xl mb-4 font-bold flex items-center gap-2">
              <Clock className="w-6 h-6" /> Cook Times
            </h2>
            <div className="grid gap-4">
              {recipe.cookTimeVariants?.stove?.time && (
                <div className="p-3 bg-white/50 rounded-lg border border-white/60">
                  <span className="font-bold block">Stove: {recipe.cookTimeVariants.stove.time}</span>
                  <span className="text-sm opacity-80">{recipe.cookTimeVariants.stove.notes}</span>
                </div>
              )}
              {recipe.cookTimeVariants?.oven?.time && (
                <div className="p-3 bg-white/50 rounded-lg border border-white/60">
                  <span className="font-bold block">Oven: {recipe.cookTimeVariants.oven.time}</span>
                  <span className="text-sm opacity-80">{recipe.cookTimeVariants.oven.notes}</span>
                </div>
              )}
              {recipe.cookTimeVariants?.airfryer?.time && (
                <div className="p-3 bg-white/50 rounded-lg border border-white/60">
                  <span className="font-bold block">Air Fryer: {recipe.cookTimeVariants.airfryer.time}</span>
                  <span className="text-sm opacity-80">{recipe.cookTimeVariants.airfryer.notes}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Next Button */}
        {nextSlug && (
           <div className="relative z-20 flex justify-center pb-8 pt-2">
             <button
               onClick={() => handleNavigate(nextSlug)}
               className="p-3 bg-[var(--color-primary)] text-white rounded-full border-2 border-dashed border-white/50 shadow-lg hover:bg-white hover:text-[var(--color-primary)] transition-all"
               aria-label="Next Recipe"
             >
               <ArrowDown className="w-5 h-5" />
             </button>
           </div>
        )}
      </div>

      {/* Desktop view (Expand/Blur) */}
      <div className="hidden md:block w-full h-full relative rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Background Layer */}
        <div 
          className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out ${isOpen ? "scale-110 blur-[14px] brightness-[0.85]" : "scale-100 blur-0 brightness-100"}`}
          style={{ backgroundImage: `url(${recipe.backgroundImageUrl})` }}
        />

        {/* Closed State Overlay (Label) */}
        <div 
          className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700 cursor-pointer ${isOpen ? "opacity-0 pointer-events-none" : "opacity-100 z-40"}`}
          onClick={() => setIsOpen(true)}
        >
          <div className="bg-white/55 backdrop-blur-sm p-12 rounded-2xl shadow-xl text-center border border-white/50 transform transition-transform hover:scale-105">
            <h1
              className="text-7xl mb-4 drop-shadow-sm"
              style={{ fontFamily: `var(--font-${theme.titleFont.toLowerCase()})`, color: theme.titleColor }}
            >
              {recipe.title}
            </h1>
            <p className="text-lg uppercase tracking-widest text-[var(--color-text-body)] font-bold mt-4">Click to Open</p>
          </div>
        </div>



        {/* Open State Content (Two Columns) */}
        <div className={`absolute inset-0 flex transition-opacity duration-700 delay-100 ${isOpen ? "opacity-100 z-30" : "opacity-0 pointer-events-none"}`}>
          {/* Left Column (Title + Ingredients) */}
          <div className="w-1/2 h-full p-12 overflow-y-auto border-r border-white/20" style={{ color: theme.bodyColor }}>
            <h1
              className="text-7xl mb-12 drop-shadow-sm text-white"
              style={{ fontFamily: `var(--font-${theme.titleFont.toLowerCase()})`, textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
            >
              {recipe.title}
            </h1>
            <h2 className="text-3xl mb-6 font-bold bg-white/95 inline-block px-4 py-2 rounded-xl w-fit shadow-sm">Ingredients</h2>
            <div className="bg-white/95 p-6 rounded-2xl shadow-sm prose prose-lg prose-pink max-w-none" dangerouslySetInnerHTML={{ __html: recipe.ingredientsHtml }} />
          </div>

          {/* Right Column (Method & Notes) */}
          <div className="w-1/2 h-full p-12 overflow-y-auto" style={{ color: theme.bodyColor }}>
            <h2 className="text-3xl mb-6 font-bold bg-white/95 inline-block px-4 py-2 rounded-xl w-fit shadow-sm">Method</h2>
            <div className="bg-white/95 p-6 rounded-2xl shadow-sm mb-8 prose prose-lg prose-pink max-w-none" dangerouslySetInnerHTML={{ __html: recipe.stepsHtml }} />

            <h2 className="text-3xl mb-6 font-bold bg-white/95 inline-block px-4 py-2 rounded-xl w-fit flex items-center gap-3 shadow-sm">
              <Clock className="w-8 h-8" style={{ color: theme.accentColor }} /> Cook Times
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {recipe.cookTimeVariants?.stove?.time && (
                <div className="p-4 bg-white/95 rounded-xl shadow-sm border border-white/80 select-text">
                  <span className="font-bold block text-lg mb-1" style={{ color: theme.accentColor }}>Stove</span>
                  <span className="block font-medium">{recipe.cookTimeVariants.stove.time}</span>
                  <span className="text-sm opacity-75 mt-1 block">{recipe.cookTimeVariants.stove.notes}</span>
                </div>
              )}
              {recipe.cookTimeVariants?.oven?.time && (
                <div className="p-4 bg-white/95 rounded-xl shadow-sm border border-white/80 select-text">
                  <span className="font-bold block text-lg mb-1" style={{ color: theme.accentColor }}>Oven</span>
                  <span className="block font-medium">{recipe.cookTimeVariants.oven.time}</span>
                  <span className="text-sm opacity-75 mt-1 block">{recipe.cookTimeVariants.oven.notes}</span>
                </div>
              )}
              {recipe.cookTimeVariants?.airfryer?.time && (
                <div className="p-4 bg-white/95 rounded-xl shadow-sm border border-white/80 select-text">
                  <span className="font-bold block text-lg mb-1" style={{ color: theme.accentColor }}>Air Fryer</span>
                  <span className="block font-medium">{recipe.cookTimeVariants.airfryer.time}</span>
                  <span className="text-sm opacity-75 mt-1 block">{recipe.cookTimeVariants.airfryer.notes}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>



      {/* Controls below the book */}
      <div className={`hidden md:flex flex-wrap items-center justify-center gap-4 transition-all duration-700 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
        {prevSlug && (
          <button
            onClick={(e) => { e.stopPropagation(); handleNavigate(prevSlug); }}
            onMouseEnter={() => router.prefetch(`/recipe/${prevSlug}`)}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-2xl font-bold hover:bg-[var(--color-primary)]/90 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" /> Previous
          </button>
        )}
        
        <button
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-colors shadow-sm border border-slate-200 mx-4"
        >
          <X className="w-5 h-5" /> Close Recipe Book
        </button>

        {nextSlug && (
          <button
            onClick={(e) => { e.stopPropagation(); handleNavigate(nextSlug); }}
            onMouseEnter={() => router.prefetch(`/recipe/${nextSlug}`)}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-2xl font-bold hover:bg-[var(--color-primary)]/90 transition-colors shadow-sm"
          >
            Next <ArrowRight className="w-5 h-5" />
          </button>
        )}

        <ImageDownloader imageUrl={recipe.backgroundImageUrl} filename={recipe.title?.replace(/\s+/g, '-').toLowerCase() || "recipe"} />
      </div>
      
      {/* Mobile Controls */}
      <div className="md:hidden flex flex-wrap items-center justify-center gap-4 mt-4 w-full">
        <ImageDownloader imageUrl={recipe.backgroundImageUrl} filename={recipe.title?.replace(/\s+/g, '-').toLowerCase() || "recipe"} />
      </div>
      </div>
    </div>
  );
}
