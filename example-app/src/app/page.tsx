"use client";

// useCaptureElement — Developer Studio & Interactive Playground
// Design System: Obsidian Precision Studio (Google Stitch generated)

import { useRef, useState } from "react";
import { useCaptureElement } from "@pererita/use-capture-element";
import {
  Camera,
  Loader2,
  Github,
  Code2,
  Sparkles,
  FileText,
  Image as ImageIcon,
  Clipboard,
  Check,
  Eye,
  EyeOff,
  Sliders,
  Type,
  Maximize2,
  Copy,
  Terminal,
  Activity,
  Calendar,
  RotateCcw,
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  ShieldAlert,
  ArrowUpRight,
} from "lucide-react";

type ExportFormat = "png" | "jpeg" | "svg" | "pdf" | "webp";
type ViewportMode = "desktop" | "tablet" | "mobile";
type WatermarkPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";

export default function StudioPlayground() {
  const ref = useRef<HTMLDivElement>(null);
  const { capture, copyToClipboard } = useCaptureElement();

  // Estados generales de captura
  const [isCapturing, setIsCapturing] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [format, setFormat] = useState<ExportFormat>("png");
  const [download, setDownload] = useState(true);
  const [quality, setQuality] = useState(0.95);
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
  const [captureMetadata, setCaptureMetadata] = useState<{
    timeMs: number;
    sizeKb: number;
    dimensions: string;
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [npmCopied, setNpmCopied] = useState(false);

  // Estados de opciones avanzadas
  const [fullScroll, setFullScroll] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#0f172a");
  const [watermarkText, setWatermarkText] = useState("Captured with useCaptureElement");
  const [watermarkPosition, setWatermarkPosition] = useState<WatermarkPosition>("bottom-right");
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.45);

  // Estados del lienzo / Canvas HUD
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [inspectMode, setInspectMode] = useState(true);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const isMobileCard = viewport === "mobile";
  const isCompactCard = isMobileCard;

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2800);
  };

  const copyNpmInstall = () => {
    navigator.clipboard.writeText("npm i @pererita/use-capture-element");
    setNpmCopied(true);
    showToast("¡Comando copiado al portapapeles! ⚡");
    setTimeout(() => setNpmCopied(false), 2000);
  };

  const getActiveOptions = () => {
    return {
      format,
      fileName: `capture-element-studio.${format}`,
      excludeSelector: ".ignore-capture",
      backgroundColor: backgroundColor === "transparent" ? undefined : backgroundColor,
      download,
      quality,
      fullScrollCapture: fullScroll,
      watermark: watermarkText.trim()
        ? {
            text: watermarkText.trim(),
            color: "#818cf8",
            opacity: watermarkOpacity,
            fontSize: 18,
            position: watermarkPosition,
          }
        : null,
    };
  };

  const handleCapture = async () => {
    setIsCapturing(true);
    const startTime = performance.now();
    try {
      const dataUrl = await capture(ref, getActiveOptions());
      const endTime = performance.now();
      const elapsedMs = Math.round(endTime - startTime);

      if (dataUrl) {
        setCapturedUrl(dataUrl);
        const estimatedKb = Math.round((dataUrl.length * (3 / 4)) / 1024);
        setCaptureMetadata({
          timeMs: elapsedMs,
          sizeKb: estimatedKb,
          dimensions: ref.current
            ? `${ref.current.offsetWidth} × ${ref.current.offsetHeight}px`
            : "840 × 520px",
        });
      }

      if (!download) {
        showToast("¡Data URL (Base64) generada en consola! 🚀");
      } else {
        showToast(`¡Archivo .${format.toUpperCase()} descargado con éxito! 💾`);
      }
    } catch (error) {
      console.error("Error durante la captura:", error);
      showToast("Error al procesar la captura ❌");
    } finally {
      setIsCapturing(false);
    }
  };

  const handleCopy = async () => {
    setIsCopying(true);
    setCopySuccess(false);
    try {
      const options = getActiveOptions();
      const copyOptions = {
        excludeSelector: options.excludeSelector,
        backgroundColor: options.backgroundColor,
        quality: options.quality,
        fullScrollCapture: options.fullScrollCapture,
        watermark: options.watermark,
      };
      const success = await copyToClipboard(ref, copyOptions);
      if (success) {
        setCopySuccess(true);
        showToast("¡Imagen copiada al portapapeles nativo! 📋");
        setTimeout(() => setCopySuccess(false), 2500);
      } else {
        showToast("No se pudo copiar la imagen al portapapeles ❌");
      }
    } catch (error) {
      console.error("Error al copiar al portapapeles:", error);
      showToast("Error al copiar imagen ❌");
    } finally {
      setIsCopying(false);
    }
  };

  const getFormatBadge = (fmt: ExportFormat) => {
    switch (fmt) {
      case "png":
        return "lossless";
      case "jpeg":
        return "small";
      case "svg":
        return "vector";
      case "pdf":
        return "doc";
      case "webp":
        return "next-gen";
    }
  };

  const getFormatIcon = (fmt: ExportFormat) => {
    switch (fmt) {
      case "pdf":
        return <FileText className="w-3.5 h-3.5 text-rose-400" />;
      case "svg":
        return <Code2 className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  const getWatermarkPositionClasses = (pos: WatermarkPosition) => {
    switch (pos) {
      case "top-left":
        return "top-3 left-3 sm:top-4 sm:left-4";
      case "top-right":
        return "top-3 right-3 sm:top-4 sm:right-4";
      case "bottom-left":
        return "bottom-3 left-3 sm:bottom-4 sm:left-4";
      case "bottom-right":
        return "bottom-3 right-3 sm:bottom-4 sm:right-4";
      case "center":
        return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-[#DAE2FD] flex flex-col font-sans selection:bg-[#6366F1]/30 selection:text-white relative w-full overflow-x-hidden">
      {/* Toast Notification HUD */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-[#171F33] border border-[#6366F1]/50 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl shadow-2xl shadow-indigo-950/60 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="p-1 rounded-lg bg-[#6366F1]/20 text-[#C0C1FF]">
            <Sparkles className="w-4 h-4" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= TOP NAVIGATION BAR ================= */}
      <header className="h-14 border-b border-white/10 bg-[#0F172A]/90 backdrop-blur-md sticky top-0 z-50 px-3 sm:px-4 lg:px-6 flex items-center justify-between w-full max-w-full overflow-hidden">
        {/* Brand & Version Badge */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 p-[1px] shadow-sm flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#0F172A] rounded-[7px] flex items-center justify-center">
              <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
            </div>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-bold text-xs sm:text-base tracking-tight text-white truncate">
              useCapture<span className="text-indigo-400">Element</span>
            </span>
            <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>v1.1.0</span>
            </div>
          </div>

          {/* Quick install micro-terminal pill */}
          <button
            onClick={copyNpmInstall}
            className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#0B0F17] border border-white/10 text-slate-400 hover:text-white hover:border-indigo-500/50 transition text-xs font-mono group shrink-0"
            title="Copiar comando de instalación"
          >
            <Terminal className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition" />
            <span>npm i @pererita/use-capture-element</span>
            {npmCopied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3 text-slate-500 group-hover:text-slate-300 transition" />
            )}
          </button>
        </div>

        {/* Action Controls & External Links (Strictly sized for mobile) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            onClick={() => {
              setWatermarkText("Captured with useCaptureElement");
              setQuality(0.95);
              setFormat("png");
              setFullScroll(false);
              showToast("Ajustes restaurados a valores por defecto");
            }}
            className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition shrink-0"
            title="Restablecer configuración"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <a
            href="https://github.com/pererita/useCaptureElement"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition flex items-center gap-1.5 shrink-0"
            title="Repositorio en GitHub"
          >
            <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline text-xs font-medium">GitHub</span>
          </a>

          <button
            onClick={handleCapture}
            disabled={isCapturing}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-[11px] sm:text-xs font-bold shadow-md shadow-indigo-600/30 transition disabled:opacity-50 shrink-0"
          >
            {isCapturing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Camera className="w-3.5 h-3.5" />
            )}
            <span className="inline">Capturar</span>
          </button>
        </div>
      </header>

      {/* ================= WORKBENCH MAIN LAYOUT ================= */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full max-w-full">
        {/* ================= LEFT SIDEBAR (TOOL SPEC INSPECTOR) ================= */}
        <aside className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-white/10 bg-[#0B0F17] flex flex-col flex-shrink-0 z-20 overflow-y-auto custom-scrollbar max-h-[50vh] lg:max-h-[calc(100vh-3.5rem)]">
          {/* Inspector Header */}
          <div className="px-4 py-3 border-b border-white/10 bg-[#0F172A]/70 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Capture Spec Engine
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
              Ready
            </span>
          </div>

          <div className="p-3.5 sm:p-4 space-y-4 sm:space-y-5">
            {/* 1. Selector de Formato */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  Formato de Salida
                </label>
                <span className="text-[11px] font-mono text-indigo-400 capitalize">{format}</span>
              </div>
              <div className="grid grid-cols-5 gap-1 p-1 bg-[#131B2E] rounded-lg border border-white/5">
                {(["png", "jpeg", "svg", "pdf", "webp"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => {
                      setFormat(fmt);
                      setCapturedUrl(null);
                    }}
                    className={`flex flex-col items-center justify-center py-1.5 px-0.5 sm:px-1 rounded-md text-[11px] sm:text-xs font-bold transition-all ${
                      format === fmt
                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 border border-indigo-400/40"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>{fmt.toUpperCase()}</span>
                    <span
                      className={`text-[8px] sm:text-[9px] font-mono truncate max-w-full ${
                        format === fmt ? "text-indigo-200" : "text-slate-500"
                      }`}
                    >
                      {getFormatBadge(fmt)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Calidad de Compresión */}
            <div className="p-3 bg-[#131B2E] rounded-lg border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">Calidad de Compresión</span>
                <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {Math.round(quality * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <p className="text-[10px] text-slate-500">Aplica a formatos JPEG, WEBP y PDF.</p>
            </div>

            {/* 3. Destino de Salida (Download vs Base64) */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Destino de Exportación
              </span>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#131B2E] rounded-lg border border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setDownload(true);
                    setCapturedUrl(null);
                  }}
                  className={`py-2 px-2 rounded-md text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    download
                      ? "bg-[#1E293B] text-white border border-white/10 shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Descargar Archivo</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDownload(false);
                    setCapturedUrl(null);
                  }}
                  className={`py-2 px-2 rounded-md text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    !download
                      ? "bg-[#1E293B] text-white border border-white/10 shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Generar Base64</span>
                </button>
              </div>
            </div>

            {/* 4. Opciones Avanzadas del Hook */}
            <div className="p-3 bg-[#131B2E] rounded-lg border border-white/5 space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block border-b border-white/5 pb-2">
                Virtualizador & Filtros DOM
              </span>

              {/* Full Scroll Toggle */}
              <label className="flex items-center justify-between cursor-pointer select-none">
                <div className="space-y-0.5 pr-2">
                  <span className="text-xs font-semibold text-slate-200 block">
                    Captura con Scroll Completo
                  </span>
                  <span className="text-[10px] text-slate-500 block leading-snug">
                    Expande contenedores scrollables para clonar su altura total.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={fullScroll}
                  onChange={(e) => setFullScroll(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded bg-slate-900 border-white/10 focus:ring-indigo-500 accent-indigo-600 shrink-0"
                />
              </label>

              {/* Background Color Swatches */}
              <div className="pt-2 border-t border-white/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Fondo del Lienzo:</span>
                  <span className="text-[10px] font-mono text-indigo-300">{backgroundColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  {[
                    { val: "#0f172a", label: "Dark Slate", cls: "bg-[#0f172a]" },
                    { val: "#000000", label: "Pure Black", cls: "bg-black" },
                    { val: "#ffffff", label: "White", cls: "bg-white" },
                    { val: "transparent", label: "Transparent", cls: "checker-pattern" },
                  ].map((color) => (
                    <button
                      key={color.val}
                      onClick={() => setBackgroundColor(color.val)}
                      className={`w-7 h-7 rounded-md border transition-all ${color.cls} ${
                        backgroundColor === color.val
                          ? "ring-2 ring-indigo-500 scale-105 border-white"
                          : "border-white/20 hover:border-white/50"
                      }`}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>

              {/* Exclude Selector Badge */}
              <div className="pt-2 border-t border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Filtro de Exclusión:</span>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                    1 regla activa
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono text-amber-300 bg-[#0B0F17] px-2 py-1 rounded border border-amber-500/20">
                    .ignore-capture
                  </code>
                  <span className="text-[10px] text-slate-500 leading-tight">
                    Subárboles omitidos durante la rasterización.
                  </span>
                </div>
              </div>
            </div>

            {/* 5. Marca de Agua Studio */}
            <div className="p-3 bg-[#131B2E] rounded-lg border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-indigo-400" />
                  Marca de Agua
                </span>
                <span className="text-[10px] font-mono text-slate-500">Opcional</span>
              </div>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="Texto de marca de agua..."
                className="w-full text-xs p-2 rounded-md bg-[#0B0F17] border border-white/10 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />

              {watermarkText.trim() && (
                <div className="flex items-center justify-between gap-3 pt-2">
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Opacidad:</span>
                      <span className="font-mono text-indigo-400">
                        {Math.round(watermarkOpacity * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={watermarkOpacity}
                      onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  {/* Matriz 3x3 de Posición */}
                  <div className="w-16 h-16 grid grid-cols-3 gap-1 p-1 bg-[#0B0F17] rounded-md border border-white/10 shrink-0">
                    {[
                      { pos: "top-left", label: "↖" },
                      { pos: "dis-1", label: "·" },
                      { pos: "top-right", label: "↗" },
                      { pos: "dis-2", label: "·" },
                      { pos: "center", label: "☉" },
                      { pos: "dis-3", label: "·" },
                      { pos: "bottom-left", label: "↙" },
                      { pos: "dis-4", label: "·" },
                      { pos: "bottom-right", label: "↘" },
                    ].map((slot, idx) => {
                      const isDisabled = slot.pos.startsWith("dis");
                      const isSelected = watermarkPosition === slot.pos;
                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => setWatermarkPosition(slot.pos as WatermarkPosition)}
                          className={`w-full h-full rounded text-[9px] font-bold flex items-center justify-center transition-all ${
                            isDisabled
                              ? "opacity-15 cursor-default text-slate-600"
                              : isSelected
                                ? "bg-indigo-600 text-white font-extrabold shadow-md scale-105"
                                : "hover:bg-white/10 text-slate-500 hover:text-white"
                          }`}
                        >
                          {slot.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Action Footer */}
          <div className="p-3.5 sm:p-4 border-t border-white/10 bg-[#0F172A]/90 sticky bottom-0 z-10 space-y-2 mt-auto">
            <button
              onClick={handleCapture}
              disabled={isCapturing}
              className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
            >
              {isCapturing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Procesando {format.toUpperCase()}...</span>
                </>
              ) : (
                <>
                  {getFormatIcon(format)}
                  <span>
                    {download
                      ? `Descargar ${format.toUpperCase()}`
                      : `Generar Base64 ${format.toUpperCase()}`}
                  </span>
                </>
              )}
            </button>

            <button
              onClick={handleCopy}
              disabled={isCopying}
              className="w-full py-2 px-4 rounded-lg bg-[#131B2E] hover:bg-[#1E293B] border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {isCopying ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : copySuccess ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Clipboard className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>
                {copySuccess ? "¡Copiado al Portapapeles!" : "Copiar Imagen al Portapapeles"}
              </span>
            </button>
          </div>
        </aside>

        {/* ================= CENTER CANVAS & WORKBENCH ================= */}
        <main className="flex-1 flex flex-col bg-[#0B0F17] blueprint-dots relative overflow-y-auto custom-scrollbar w-full max-w-full">
          {/* Canvas Floating HUD Toolbar */}
          <div className="sticky top-0 z-20 w-full px-3 sm:px-6 py-2 border-b border-white/10 bg-[#0F172A]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 max-w-full overflow-hidden">
            {/* Viewport Width Controls */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#0B0F17] border border-white/10 shrink-0">
              <button
                onClick={() => setViewport("desktop")}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded text-[11px] sm:text-xs font-mono font-medium transition ${
                  viewport === "desktop"
                    ? "bg-[#1E293B] text-white shadow-xs border border-white/10"
                    : "text-slate-500 hover:text-slate-300"
                }`}
                title="Desktop View (100% full width)"
              >
                <Monitor className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                onClick={() => setViewport("tablet")}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded text-[11px] sm:text-xs font-mono font-medium transition ${
                  viewport === "tablet"
                    ? "bg-[#1E293B] text-white shadow-xs border border-white/10"
                    : "text-slate-500 hover:text-slate-300"
                }`}
                title="Tablet View (768px)"
              >
                <Tablet className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="hidden sm:inline">768px</span>
              </button>
              <button
                onClick={() => setViewport("mobile")}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded text-[11px] sm:text-xs font-mono font-medium transition ${
                  viewport === "mobile"
                    ? "bg-[#1E293B] text-white shadow-xs border border-white/10"
                    : "text-slate-500 hover:text-slate-300"
                }`}
                title="Mobile View (380px)"
              >
                <Smartphone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="hidden sm:inline">380px</span>
              </button>
            </div>

            {/* Target DOM Element Info Tag */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-[#131B2E] border border-white/10 text-xs font-mono shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-slate-400">Target:</span>
              <code className="text-indigo-300 font-semibold">#analytics-billing-card</code>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">
                {ref.current
                  ? `${ref.current.offsetWidth} × ${ref.current.offsetHeight}px`
                  : "Live DOM"}
              </span>
            </div>

            {/* Inspect Mode Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setInspectMode(!inspectMode)}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-mono font-semibold transition border ${
                  inspectMode
                    ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
                    : "bg-[#0B0F17] border-white/10 text-slate-500 hover:text-slate-300"
                }`}
              >
                {inspectMode ? (
                  <Eye className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>Inspect: {inspectMode ? "ON" : "OFF"}</span>
              </button>
            </div>
          </div>

          {/* Canvas Center Area (Container with responsive width simulation) */}
          <div className="flex-1 p-3 sm:p-6 lg:p-10 flex flex-col items-center justify-center w-full max-w-full">
            <div
              className={`w-full transition-all duration-300 ${
                viewport === "mobile"
                  ? "max-w-[360px] sm:max-w-[390px]"
                  : viewport === "tablet"
                    ? "max-w-[768px]"
                    : "max-w-4xl"
              }`}
            >
              {/* TARGET DOM ELEMENT TO CAPTURE (#analytics-billing-card) */}
              <div
                ref={ref}
                id="analytics-billing-card"
                className={`w-full bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl relative transition-all duration-300 overflow-hidden ${
                  inspectMode ? "inspect-box-border laser-glow" : ""
                }`}
                style={{
                  backgroundColor: backgroundColor === "transparent" ? "#0F172A" : backgroundColor,
                }}
              >
                {/* Inspect Mode Coordinate Badge */}
                {inspectMode && (
                  <div className="absolute top-2 right-3 z-20 flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0B0F17]/90 border border-emerald-500/40 text-[9px] sm:text-[10px] font-mono text-emerald-400 shadow-sm pointer-events-none">
                    <span>#analytics-billing-card</span>
                  </div>
                )}

                {/* Card Top Accent Bar */}
                <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

                {/* Card Inner Header */}
                <div
                  className={`px-4 sm:px-5 py-3.5 sm:py-4 border-b border-white/5 bg-[#131B2E]/60 flex ${
                    isCompactCard
                      ? "flex-col items-start gap-2"
                      : "flex-wrap items-center justify-between gap-3"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-lg font-bold tracking-tight text-white">
                        Monthly Revenue & Usage
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] sm:text-[11px] font-mono flex items-center gap-1 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live Synced
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                      Telemetría de captura de alta fidelidad en DOM.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-mono text-slate-400 bg-[#0B0F17] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-white/10 shrink-0">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-400 shrink-0" />
                    <span>Oct 1 – Oct 31</span>
                  </div>
                </div>

                {/* Metric Cards Triad (Responsive: stacks in mobile viewport or small screens) */}
                <div
                  className={`p-3.5 sm:p-5 grid gap-2.5 sm:gap-3 ${
                    isCompactCard ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"
                  }`}
                >
                  <div className="p-3 sm:p-3.5 rounded-xl bg-[#0B0F17] border border-white/5 flex flex-col justify-between">
                    <span className="text-[11px] sm:text-xs text-slate-400 font-medium">
                      ARR Invoiced
                    </span>
                    <div className="mt-1 sm:mt-2">
                      <div className="text-lg sm:text-2xl font-bold font-mono text-white whitespace-nowrap overflow-hidden text-ellipsis">
                        $48,290.00
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-[10px] sm:text-[11px] text-emerald-400 font-mono whitespace-nowrap">
                        <ArrowUpRight className="w-3 h-3 shrink-0" />
                        <span>+14.2% vs ciclo anterior</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 sm:p-3.5 rounded-xl bg-[#0B0F17] border border-white/5 flex flex-col justify-between">
                    <span className="text-[11px] sm:text-xs text-slate-400 font-medium">
                      API Invocations
                    </span>
                    <div className="mt-1 sm:mt-2">
                      <div className="text-lg sm:text-2xl font-bold font-mono text-indigo-300 whitespace-nowrap overflow-hidden text-ellipsis">
                        1,428,902
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-[10px] sm:text-[11px] text-emerald-400 font-mono whitespace-nowrap">
                        <ArrowUpRight className="w-3 h-3 shrink-0" />
                        <span>+28.4% p99 speed</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 sm:p-3.5 rounded-xl bg-[#0B0F17] border border-white/5 flex flex-col justify-between">
                    <span className="text-[11px] sm:text-xs text-slate-400 font-medium">
                      Tasa de Éxito Snapshot
                    </span>
                    <div className="mt-1 sm:mt-2">
                      <div className="text-lg sm:text-2xl font-bold font-mono text-emerald-400 whitespace-nowrap overflow-hidden text-ellipsis">
                        99.98%
                      </div>
                      <span className="inline-block mt-1 text-[10px] sm:text-[11px] text-slate-400 font-mono whitespace-nowrap">
                        0 frames descartados
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sparkline Histogram Visual */}
                <div className="px-3.5 sm:px-5 pb-3 sm:pb-4">
                  <div className="p-3 sm:p-3.5 rounded-xl bg-[#0B0F17] border border-white/5 space-y-2">
                    <div
                      className={`flex ${
                        isCompactCard
                          ? "flex-col items-start gap-1"
                          : "items-center justify-between"
                      } text-xs`}
                    >
                      <span className="text-slate-400 font-medium uppercase font-mono text-[9px] sm:text-[10px]">
                        Frecuencia de Capturas por Día
                      </span>
                      <div className="flex items-center gap-2.5 text-[9px] sm:text-[10px] font-mono text-slate-500">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded bg-indigo-500" />{" "}
                          Canvas 2D
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded bg-emerald-400" />{" "}
                          Vector SVG
                        </span>
                      </div>
                    </div>
                    {/* CSS Histogram bars */}
                    <div className="h-10 sm:h-14 flex items-end gap-1 sm:gap-1.5 pt-1 sm:pt-2">
                      {[40, 65, 50, 80, 70, 95, 85, 60, 75, 90, 55, 100].map((height, i) => (
                        <div
                          key={i}
                          style={{ height: `${height}%` }}
                          className={`flex-1 rounded-t transition-all hover:brightness-125 ${
                            i === 5 ? "bg-indigo-500" : i === 11 ? "bg-emerald-400" : "bg-[#1E293B]"
                          }`}
                          title={`Día ${i + 1}: ${height}% throughput`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Scrollable Activity Log (Demonstrates fullScrollCapture) */}
                <div className="px-3.5 sm:px-5 pb-3 sm:pb-4">
                  <div className="rounded-xl border border-white/5 bg-[#0B0F17] overflow-hidden">
                    <div className="px-3 sm:px-4 py-2 bg-[#131B2E] border-b border-white/5 flex items-center justify-between gap-2">
                      <span className="text-[11px] sm:text-xs font-semibold text-slate-300 flex items-center gap-1.5 truncate">
                        <Activity className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate">Historial de Transacciones</span>
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/30 shrink-0">
                        {fullScroll ? "✓ Scroll Completo" : "Desplázame 👇"}
                      </span>
                    </div>
                    <div className="max-h-36 overflow-y-auto custom-scrollbar divide-y divide-white/5 text-xs font-mono">
                      {[
                        { event: "stripe.subscription.updated", id: "inv_88192a", time: "12s ago" },
                        { event: "dom.capture.rasterized.png", id: "node_card", time: "48s ago" },
                        { event: "telemetry.benchmark.p95", id: "perf_trace", time: "2m ago" },
                        { event: "auth.session.rotate_token", id: "usr_arch", time: "5m ago" },
                        { event: "webhook.delivery.success", id: "wh_392019", time: "12m ago" },
                        { event: "snapshot.export.pdf_ok", id: "doc_sum", time: "18m ago" },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className={`px-3 sm:px-4 py-2 flex ${
                            isMobileCard
                              ? "flex-col items-start gap-0.5"
                              : "items-center justify-between gap-2"
                          } hover:bg-white/5 transition`}
                        >
                          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 max-w-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                            <span className="text-slate-300 text-[11px] sm:text-xs truncate">
                              {item.event}
                            </span>
                            <span className="text-slate-600 text-[10px] shrink-0 font-mono">
                              ({item.id})
                            </span>
                          </div>
                          <span className="text-slate-500 text-[10px] shrink-0 font-mono ml-auto sm:ml-0">
                            {item.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Excluded Element Banner (.ignore-capture) */}
                <div className="px-3.5 sm:px-5 pb-3.5 sm:pb-5">
                  <div className="ignore-capture p-3 sm:p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 sm:gap-3 relative overflow-hidden">
                    <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className="text-[11px] sm:text-xs font-bold text-amber-300">
                          Aviso de Elemento Omitido
                        </span>
                        <code className="text-[9px] sm:text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/40 shrink-0">
                          .ignore-capture
                        </code>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-amber-200/80 mt-1 leading-relaxed">
                        Este aviso amarillo se omite en la imagen gracias al selector{" "}
                        <strong className="text-amber-200">.ignore-capture</strong> configurado en
                        el hook.
                      </p>
                    </div>
                    <span className="hidden xs:inline-block text-[9px] sm:text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded shrink-0">
                      Excluido
                    </span>
                  </div>
                </div>

                {/* Real-Time Watermark Overlay Preview */}
                {watermarkText.trim() && (
                  <div
                    className={`absolute ${getWatermarkPositionClasses(
                      watermarkPosition
                    )} pointer-events-none text-[10px] sm:text-xs font-mono font-bold text-indigo-400 select-none z-10 max-w-[85%] truncate px-2`}
                    style={{ opacity: watermarkOpacity }}
                  >
                    {watermarkText}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================= BOTTOM OUTPUT CONSOLE / DRAWER ================= */}
          {capturedUrl && (
            <section className="border-t border-white/10 bg-[#0F172A] p-3.5 sm:p-4 lg:px-6 shadow-2xl relative z-20 animate-in fade-in slide-in-from-bottom-4 duration-300 w-full max-w-full overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400 shrink-0" />
                    <span className="text-[11px] sm:text-xs font-bold text-white font-mono">
                      Capture Output (Data URL Base64)
                    </span>
                  </div>
                  {captureMetadata && (
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono">
                      <span className="px-1.5 sm:px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {captureMetadata.timeMs}ms
                      </span>
                      <span className="text-slate-400">{captureMetadata.dimensions}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-indigo-300 font-semibold">
                        {captureMetadata.sizeKb} KB
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(capturedUrl);
                      showToast("¡Data URL copiada al portapapeles! 📋");
                    }}
                    className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] sm:text-xs font-mono font-semibold transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Base64</span>
                  </button>
                  <button
                    onClick={() => setPreviewModalOpen(true)}
                    className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-[11px] sm:text-xs font-mono transition"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Previsualizar</span>
                  </button>
                </div>
              </div>

              {/* Code Snippet Box & Preview Grid */}
              <div className="mt-3 grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 items-center">
                <div className="lg:col-span-3 rounded-lg bg-[#0B0F17] border border-white/5 p-2 sm:p-2.5 font-mono text-[11px] sm:text-xs overflow-x-auto text-slate-400 flex items-center gap-2">
                  <span className="text-slate-600 select-none pr-2 border-r border-white/10">
                    01
                  </span>
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                    <span className="text-indigo-400">const</span>{" "}
                    <span className="text-white">dataUrl</span> ={" "}
                    <span className="text-emerald-300">
                      &quot;{capturedUrl.substring(0, 85)}...&quot;
                    </span>
                    ;
                  </div>
                </div>

                <div className="lg:col-span-1 flex items-center justify-between p-2 rounded-lg bg-[#0B0F17] border border-white/5">
                  <div className="flex items-center gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={capturedUrl}
                      alt="Thumbnail Snapshot"
                      className="w-10 h-7 object-cover rounded bg-[#131B2E] border border-white/10"
                    />
                    <div className="leading-tight font-mono">
                      <div className="text-xs text-white font-semibold capitalize">
                        snapshot.{format}
                      </div>
                      <div className="text-[10px] text-slate-500">image/{format}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setPreviewModalOpen(true)}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 transition"
                    title="Ver en grande"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* ================= PREVIEW MODAL ================= */}
      {previewModalOpen && capturedUrl && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#0F172A] border border-white/10 rounded-2xl max-w-4xl w-full p-4 sm:p-5 space-y-3 sm:space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs sm:text-sm font-bold text-white font-mono">
                  Snapshot Preview ({format.toUpperCase()})
                </h3>
              </div>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-mono px-2 py-1 rounded bg-white/5 hover:bg-white/10"
              >
                ✕ Cerrar
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto rounded-xl border border-white/5 flex items-center justify-center p-3 sm:p-4 bg-[#0B0F17]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={capturedUrl}
                alt="Captured Preview"
                className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-lg"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <a
                href={capturedUrl}
                download={`captured-element.${format}`}
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Guardar archivo en disco</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="h-10 border-t border-white/10 bg-[#0F172A] px-3 sm:px-4 lg:px-6 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 font-mono w-full max-w-full overflow-hidden">
        <div className="flex items-center gap-2 truncate">
          <span className="truncate">
            © 2026 useCaptureElement OSS por{" "}
            <a
              href="https://www.pererita.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-indigo-400 transition"
            >
              Pererita
            </a>
          </span>
          <span className="hidden sm:inline text-slate-700">•</span>
          <span className="hidden sm:inline">MIT Licensed</span>
        </div>
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <a
            href="https://github.com/pererita/useCaptureElement"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-300 transition flex items-center gap-1"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-slate-700">•</span>
          <a
            href="https://www.npmjs.com/package/@pererita/use-capture-element"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-300 transition flex items-center gap-1"
          >
            <span>npm</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </div>
  );
}
