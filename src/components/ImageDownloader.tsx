"use client";

import { useState } from "react";
import { Download } from "lucide-react";

const MICRO_WATERMARK_OPACITY = 0.07;
const SIGNATURE_OPACITY = 0.38;
const SEAL_OPACITY = 0.5;
const PRIMARY_COLOR = "#D94F5C";

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

      const width = img.width;
      const height = img.height;
      const minDim = Math.min(width, height);

      // --- Layer 1: Micro-repeat pattern ---
      ctx.save();
      ctx.globalAlpha = MICRO_WATERMARK_OPACITY;
      const microFontSize = Math.max(12, Math.floor(minDim * 0.015));
      ctx.font = `bold ${microFontSize}px sans-serif`;
      ctx.fillStyle = "#ffffff";
      
      const angle = -25 * Math.PI / 180;
      ctx.rotate(angle);
      
      const stepX = microFontSize * 8;
      const stepY = microFontSize * 4;
      
      const diag = Math.sqrt(width * width + height * height);
      for (let x = -diag; x < diag * 2; x += stepX) {
        for (let y = -diag; y < diag * 2; y += stepY) {
          ctx.fillText("TasteTale", x, y);
        }
      }
      ctx.restore();

      // --- Layer 3: Corner seal ---
      ctx.save();
      ctx.globalAlpha = SEAL_OPACITY;
      const sealRadius = Math.max(20, Math.floor(minDim * 0.04));
      const sealX = sealRadius * 1.5;
      const sealY = sealRadius * 1.5;

      ctx.beginPath();
      ctx.arc(sealX, sealY, sealRadius, 0, 2 * Math.PI);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.lineWidth = Math.max(2, Math.floor(sealRadius * 0.1));
      ctx.strokeStyle = PRIMARY_COLOR;
      ctx.stroke();

      // LOGO_ICON_PLACEHOLDER: draw actual logo icon centered inside this circle later
      
      ctx.fillStyle = PRIMARY_COLOR;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const sealFontSize = sealRadius * 0.8;
      ctx.font = `bold ${sealFontSize}px Fredoka, sans-serif`;
      ctx.fillText("TT", sealX, sealY);
      ctx.restore();

      // --- Layer 2: Signature mark ---
      ctx.save();
      ctx.globalAlpha = SIGNATURE_OPACITY;
      const sigFontSize = Math.max(24, Math.floor(minDim * 0.05));
      ctx.font = `bold ${sigFontSize}px Fredoka, sans-serif`;
      ctx.fillStyle = PRIMARY_COLOR;
      ctx.textAlign = "left";
      ctx.textBaseline = "bottom";
      
      const sigX = sealRadius * 1.5;
      const sigY = height - (sealRadius * 1.5);
      
      // LOGO_ICON_PLACEHOLDER: draw scaled icon here at x: sigX, y: sigY - sigFontSize before wordmark
      
      ctx.fillText("TasteTale", sigX, sigY);
      ctx.restore();

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
