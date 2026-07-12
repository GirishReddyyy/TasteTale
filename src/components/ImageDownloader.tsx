"use client";

import { useState } from "react";
import { Download } from "lucide-react";

interface ImageDownloaderProps {
  imageUrl: string;
  filename?: string;
}

export default function ImageDownloader({ imageUrl, filename = "recipe" }: ImageDownloaderProps) {
  const [format, setFormat] = useState<"png" | "jpeg">("jpeg");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const img = new Image();
      // Use anonymous crossOrigin in case it's hosted elsewhere
      img.crossOrigin = "anonymous";
      img.src = imageUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Add watermark
      const watermarkText = "TasteTales";
      // Size the text proportionally to the image width
      const fontSize = Math.max(24, Math.floor(img.width * 0.05));
      ctx.font = `bold ${fontSize}px sans-serif`;
      
      // Measure text for positioning
      const textMetrics = ctx.measureText(watermarkText);
      const textWidth = textMetrics.width;
      
      // Position bottom right with some padding
      const padding = fontSize;
      const x = img.width - textWidth - padding;
      const y = img.height - padding;

      // Add shadow for better visibility on various backgrounds
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      // Draw text
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.fillText(watermarkText, x, y);

      // Get data URL
      const dataUrl = canvas.toDataURL(`image/${format}`, 0.9);

      // Trigger download
      const link = document.createElement("a");
      link.download = `${filename}-tastetales.${format}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download image:", error);
      alert("Failed to download image. The image might have CORS restrictions.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-sm border border-white/50">
      <select
        value={format}
        onChange={(e) => setFormat(e.target.value as "png" | "jpeg")}
        className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/50"
      >
        <option value="jpeg">JPG</option>
        <option value="png">PNG</option>
      </select>
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl font-bold hover:bg-[var(--color-primary)]/90 transition-colors disabled:opacity-50"
      >
        <Download className="w-4 h-4" />
        {isDownloading ? "Downloading..." : "Download Image"}
      </button>
    </div>
  );
}
