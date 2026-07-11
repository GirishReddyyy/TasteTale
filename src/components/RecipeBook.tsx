"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { IRecipe } from "@/models/Recipe";
import { Clock, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from "lucide-react";

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

  useEffect(() => {
    // Open the book shortly after mounting for the effect
    const timer = setTimeout(() => setIsOpen(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const theme = recipe.theme || {
    titleFont: "Caveat",
    titleColor: "#333333",
    bodyFont: "Inter",
    bodyColor: "#444444",
    accentColor: "#fbcfe8",
  };

  return (
    <div className="w-full max-w-6xl mx-auto h-[85vh] relative perspective-[2500px]">
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

      {/* Desktop view (3D flip) */}
      <div className="hidden md:block w-full h-full relative">
        {/* Desktop Navigation Buttons */}
        {prevSlug && (
          <button
            onClick={() => handleNavigate(prevSlug)}
            onMouseEnter={() => router.prefetch(`/recipe/${prevSlug}`)}
            className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 p-4 bg-[var(--color-primary)] text-white rounded-full border-2 border-dashed border-white/50 shadow-lg hover:scale-110 hover:bg-white hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all"
            aria-label="Previous Recipe"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        {nextSlug && (
          <button
            onClick={() => handleNavigate(nextSlug)}
            onMouseEnter={() => router.prefetch(`/recipe/${nextSlug}`)}
            className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 p-4 bg-[var(--color-primary)] text-white rounded-full border-2 border-dashed border-white/50 shadow-lg hover:scale-110 hover:bg-white hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all"
            aria-label="Next Recipe"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        )}

        {/* The open book background/content */}
        <div className="absolute inset-0 flex shadow-2xl rounded-2xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${recipe.backgroundImageUrl})` }}>
          <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] z-0" />
          
          {/* Left Page (Ingredients) */}
          <div className="w-1/2 h-full z-10 p-12 overflow-y-auto border-r border-black/10 flex flex-col" style={{ color: theme.bodyColor }}>
            <h1
              className="text-7xl mb-12 drop-shadow-sm"
              style={{ fontFamily: `var(--font-${theme.titleFont.toLowerCase()})`, color: theme.titleColor }}
            >
              {recipe.title}
            </h1>
            <h2 className="text-3xl mb-6 font-bold bg-white/95 inline-block px-4 py-2 rounded-xl w-fit">Ingredients</h2>
            <div className="bg-white/95 p-6 rounded-2xl shadow-sm prose prose-lg prose-pink max-w-none" dangerouslySetInnerHTML={{ __html: recipe.ingredientsHtml }} />
          </div>

          {/* Right Page (Method & Notes) */}
          <div className="w-1/2 h-full z-10 p-12 overflow-y-auto" style={{ color: theme.bodyColor }}>
            <h2 className="text-3xl mb-6 font-bold bg-white/95 inline-block px-4 py-2 rounded-xl w-fit">Method</h2>
            <div className="bg-white/95 p-6 rounded-2xl shadow-sm mb-8 prose prose-lg prose-pink max-w-none" dangerouslySetInnerHTML={{ __html: recipe.stepsHtml }} />

            <h2 className="text-3xl mb-6 font-bold bg-white/95 inline-block px-4 py-2 rounded-xl w-fit flex items-center gap-3">
              <Clock className="w-8 h-8" style={{ color: theme.accentColor }} /> Cook Times
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {recipe.cookTimeVariants?.stove?.time && (
                <div className="p-4 bg-white/80 rounded-xl shadow-sm border border-white/80 select-text">
                  <span className="font-bold block text-lg mb-1" style={{ color: theme.accentColor }}>Stove</span>
                  <span className="block font-medium">{recipe.cookTimeVariants.stove.time}</span>
                  <span className="text-sm opacity-75 mt-1 block">{recipe.cookTimeVariants.stove.notes}</span>
                </div>
              )}
              {recipe.cookTimeVariants?.oven?.time && (
                <div className="p-4 bg-white/80 rounded-xl shadow-sm border border-white/80 select-text">
                  <span className="font-bold block text-lg mb-1" style={{ color: theme.accentColor }}>Oven</span>
                  <span className="block font-medium">{recipe.cookTimeVariants.oven.time}</span>
                  <span className="text-sm opacity-75 mt-1 block">{recipe.cookTimeVariants.oven.notes}</span>
                </div>
              )}
              {recipe.cookTimeVariants?.airfryer?.time && (
                <div className="p-4 bg-white/80 rounded-xl shadow-sm border border-white/80 select-text">
                  <span className="font-bold block text-lg mb-1" style={{ color: theme.accentColor }}>Air Fryer</span>
                  <span className="block font-medium">{recipe.cookTimeVariants.airfryer.time}</span>
                  <span className="text-sm opacity-75 mt-1 block">{recipe.cookTimeVariants.airfryer.notes}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* The Cover (flips open to the left) */}
        <div
          className={`absolute right-0 w-1/2 h-full origin-left transition-all duration-[1000ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] z-50 ${isOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          style={{
            transformStyle: "preserve-3d",
            transform: isOpen ? "rotateY(-180deg)" : "rotateY(0deg)",
          }}
          onClick={() => !isOpen && setIsOpen(true)}
        >
          {/* Front of cover */}
          <div
            className="absolute inset-0 bg-cover bg-center rounded-r-2xl shadow-[inset_5px_0_15px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center p-12 cursor-pointer group"
            style={{ backgroundImage: `url(${recipe.backgroundImageUrl})`, backfaceVisibility: "hidden" }}
          >
            <div className="absolute inset-0 bg-black/30 rounded-r-2xl transition-opacity group-hover:bg-black/20" />
            <div className="relative z-10 bg-white/80 backdrop-blur-sm p-12 rounded-xl shadow-xl text-center border border-white/50 transform transition-transform group-hover:scale-105">
              <h1
                className="text-7xl mb-4 drop-shadow-sm"
                style={{ fontFamily: `var(--font-${theme.titleFont.toLowerCase()})`, color: theme.titleColor }}
              >
                {recipe.title}
              </h1>
              <p className="text-lg uppercase tracking-widest text-slate-500 font-bold mt-4">Click to Open</p>
            </div>
            
            {/* Book spine effect (now on the left edge of the right page) */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/30 to-transparent" />
          </div>

          {/* Back of cover (Inside left page when open) */}
          <div
            className="absolute inset-0 bg-[#fdfbf7] rounded-l-2xl shadow-inner border-r border-black/10"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dcd9d1' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          >
             {/* We can leave this mostly empty since the actual content (ingredients) is rendered in the background layer underneath.
                 Wait, if this is solid, it will cover the left page's content when open! 
                 Let's make it invisible or opacity-0 when open so the content shows, OR just not give it a background!
                 Actually, since it flips -180deg, its backface is now facing us on the left. 
                 To see the left page (Ingredients), this back cover needs to be transparent, OR we render the Ingredients *on* this back cover!
                 Rendering ingredients on the back cover is better for the 3D effect! But let's just make it transparent for now to reveal the layer underneath.
             */}
             <div className="w-full h-full bg-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}
