"use client";

import { useRef, useState, MouseEvent } from "react";
import { useCaptureElement } from "use-capture-element";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
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
  Scissors,
  Trash2,
  Sliders,
  Type,
  Grid,
} from "lucide-react";

type ExportFormat = "png" | "jpeg" | "svg" | "pdf" | "webp";

export default function HomeContainer() {
  const ref = useRef<HTMLDivElement>(null);
  const { capture, copyToClipboard } = useCaptureElement();

  // Estados generales
  const [isCapturing, setIsCapturing] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [format, setFormat] = useState<ExportFormat>("png");
  const [download, setDownload] = useState(true);
  const [quality, setQuality] = useState(0.95);
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);

  // Estados de características avanzadas
  const [fullScroll, setFullScroll] = useState(false);
  const [applyDarkTheme, setApplyDarkTheme] = useState(false);
  const [watermarkText, setWatermarkText] = useState("");
  const [watermarkPosition, setWatermarkPosition] = useState<
    "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center"
  >("bottom-right");

  // Estados de recorte visual (Snipping Tool)
  const [isCropMode, setIsCropMode] = useState(false);
  const [cropArea, setCropArea] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [isDrawingCrop, setIsDrawingCrop] = useState(false);
  const [cropStart, setCropStart] = useState<{ x: number; y: number } | null>(null);
  const [cropEnd, setCropEnd] = useState<{ x: number; y: number } | null>(null);

  const getActiveOptions = () => {
    return {
      format,
      fileName: `capture-element-demo.${format}`,
      excludeSelector: ".ignore-capture",
      backgroundColor: "#ffffff",
      download,
      quality,
      fullScrollCapture: fullScroll,
      styleOverrides: applyDarkTheme
        ? {
            backgroundColor: "#0f172a",
            color: "#f8fafc",
            padding: "40px",
            borderRadius: "24px",
            borderColor: "#38bdf8",
            borderStyle: "dashed",
            borderWidth: "3px",
          }
        : null,
      watermark: watermarkText
        ? {
            text: watermarkText,
            color: applyDarkTheme ? "rgba(255, 255, 255, 0.4)" : "rgba(99, 102, 241, 0.4)",
            fontSize: 18,
            position: watermarkPosition,
          }
        : null,
      crop: cropArea,
    };
  };

  const handleCapture = async () => {
    setIsCapturing(true);
    setCapturedUrl(null);
    try {
      const dataUrl = await capture(ref, getActiveOptions());
      if (!download && dataUrl) {
        setCapturedUrl(dataUrl);
      }
    } catch (error) {
      console.error("Error durante la captura:", error);
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
        styleOverrides: options.styleOverrides,
        watermark: options.watermark,
        crop: options.crop,
      };
      const success = await copyToClipboard(ref, copyOptions);
      if (success) {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    } catch (error) {
      console.error("Error al copiar al portapapeles:", error);
    } finally {
      setIsCopying(false);
    }
  };

  const getFormatIcon = (fmt: ExportFormat, className: string = "") => {
    switch (fmt) {
      case "pdf":
        return <FileText className={`w-4 h-4 sm:w-5 sm:h-5 ${className || "text-red-500"}`} />;
      case "svg":
        return <Code2 className={`w-4 h-4 sm:w-5 sm:h-5 ${className || "text-emerald-500"}`} />;
      default:
        return <ImageIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${className || "text-blue-500"}`} />;
    }
  };

  // Manejadores de eventos para Snipping Tool
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!isCropMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawingCrop(true);
    setCropStart({ x, y });
    setCropEnd({ x, y });
    setCropArea(null);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isCropMode || !isDrawingCrop || !cropStart) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
    setCropEnd({ x, y });
  };

  const handleMouseUp = () => {
    if (!isCropMode || !isDrawingCrop || !cropStart || !cropEnd) return;
    setIsDrawingCrop(false);

    const x = Math.min(cropStart.x, cropEnd.x);
    const y = Math.min(cropStart.y, cropEnd.y);
    const width = Math.abs(cropStart.x - cropEnd.x);
    const height = Math.abs(cropStart.y - cropEnd.y);

    // Evitar recortes microscópicos accidentales
    if (width > 10 && height > 10) {
      setCropArea({ x, y, width, height });
    } else {
      setCropArea(null);
      setCropStart(null);
      setCropEnd(null);
    }
  };

  const cancelCropMode = () => {
    setIsCropMode(false);
    setCropArea(null);
    setCropStart(null);
    setCropEnd(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden font-sans selection:bg-indigo-100">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 -left-4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-35"></div>
      <div className="absolute top-0 -right-4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-35"></div>
      <div className="absolute -bottom-8 left-10 sm:left-20 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-35"></div>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative z-10 w-full max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-10 max-w-2xl px-2 sm:px-4">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs sm:text-sm font-semibold shadow-sm animate-pulse">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" />
            <span>useCaptureElement v1.1.0 - Características Premium</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm leading-[1.1]">
            useCapture
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Element
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed font-medium mt-2">
            Captura elementos HTML a PNG, JPEG, SVG, PDF, WEBP, inyecta estilos inline, añade marcas
            de agua, fuerza scroll completo y recorta visualmente.
          </p>
        </div>

        {/* Layout de dos columnas: Izquierda (Ajustes avanzados), Derecha (Demo e interactivos) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
          {/* Panel de Ajustes */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="shadow-lg border border-slate-200/50 bg-white/80 backdrop-blur-md rounded-2xl">
              <CardHeader className="border-b border-slate-100 p-5">
                <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Sliders className="w-4.5 h-4.5 text-indigo-500" />
                  Configuración del Hook
                </CardTitle>
                <CardDescription className="text-xs">
                  Modifica las opciones avanzadas del hook para ver su impacto en la captura.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 space-y-5">
                {/* 1. Selector de Formato */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    Formato de Exportación:
                  </label>
                  <div className="flex flex-wrap gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200/30">
                    {(["png", "jpeg", "svg", "pdf", "webp"] as const).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => {
                          setFormat(fmt);
                          setCapturedUrl(null);
                        }}
                        className={`flex-1 min-w-[50px] py-1.5 text-xs font-bold rounded-lg capitalize transition-all duration-300 ${
                          format === fmt
                            ? "bg-white text-indigo-600 shadow-sm border border-slate-200/40"
                            : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
                        }`}
                      >
                        {fmt.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Calidad de imagen */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 block">
                      Calidad de Compresión:
                    </label>
                    <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
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
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <p className="text-[9px] text-slate-400">Aplica a formatos JPEG, WEBP y PDF.</p>
                </div>

                {/* 3. Checkboxes de Ajustes */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  {/* Interruptor Descarga */}
                  <label className="flex items-center justify-between cursor-pointer select-none">
                    <div className="space-y-0.5 pr-2">
                      <span className="text-xs font-bold text-slate-700 block">Descarga Local</span>
                      <span className="text-[10px] text-slate-400 block">
                        Descarga el archivo en el navegador.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={download}
                      onChange={(e) => {
                        setDownload(e.target.checked);
                        setCapturedUrl(null);
                      }}
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 accent-indigo-600"
                    />
                  </label>

                  {/* Interruptor Scroll Completo */}
                  <label className="flex items-center justify-between cursor-pointer select-none">
                    <div className="space-y-0.5 pr-2">
                      <span className="text-xs font-bold text-slate-700 block">
                        Capturar Scroll Completo
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Expande las zonas con barra de scroll para capturarlas completas.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={fullScroll}
                      onChange={(e) => setFullScroll(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 accent-indigo-600"
                    />
                  </label>

                  {/* Interruptor Inyección de Estilos */}
                  <label className="flex items-center justify-between cursor-pointer select-none">
                    <div className="space-y-0.5 pr-2">
                      <span className="text-xs font-bold text-slate-700 block">
                        Aplicar Tema Oscuro (Styles)
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Fuerza temporalmente un estilo oscuro moderno en la captura.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={applyDarkTheme}
                      onChange={(e) => setApplyDarkTheme(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 accent-indigo-600"
                    />
                  </label>
                </div>

                {/* 4. Marca de Agua */}
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-700 block flex items-center gap-1">
                    <Type className="w-3.5 h-3.5 text-indigo-500" />
                    Marca de Agua Automática:
                  </label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="Ej. useCaptureElement"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-1 focus:ring-indigo-500 focus:outline-none bg-slate-50/50"
                  />
                  {watermarkText && (
                    <div className="flex gap-2 items-center">
                      <span className="text-[10px] text-slate-500 font-bold whitespace-nowrap">
                        Posición:
                      </span>
                      <select
                        value={watermarkPosition}
                        onChange={(e) =>
                          setWatermarkPosition(e.target.value as typeof watermarkPosition)
                        }
                        className="w-full text-[10px] p-1.5 bg-slate-100 rounded-lg border border-slate-200/50 font-bold focus:outline-none"
                      >
                        <option value="bottom-right">Abajo Derecha</option>
                        <option value="bottom-left">Abajo Izquierda</option>
                        <option value="top-right">Arriba Derecha</option>
                        <option value="top-left">Arriba Izquierda</option>
                        <option value="center">Centro</option>
                      </select>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Zona de Demostración e Interactivos */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="w-full shadow-lg border border-slate-200/50 bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden">
              <CardHeader className="bg-white/50 border-b border-slate-100/80 p-5 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-indigo-500" />
                    Elemento de Captura
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Este es el elemento HTML interactivo que procesará el hook.
                  </CardDescription>
                </div>

                {/* Botones de Recorte Interactivo (Snipping Tool) */}
                <div className="flex items-center gap-1.5">
                  {!isCropMode ? (
                    <Button
                      onClick={() => setIsCropMode(true)}
                      size="sm"
                      variant="outline"
                      className="text-xs h-8 px-2.5 gap-1.5 border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      <span>Recorte Visual</span>
                    </Button>
                  ) : (
                    <div className="flex gap-1">
                      <Button
                        onClick={cancelCropMode}
                        size="sm"
                        variant="ghost"
                        className="text-xs h-8 px-2.5 text-slate-500 hover:bg-slate-100"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={() => {
                          if (!cropArea) {
                            alert(
                              "Dibuja un rectángulo sobre la tarjeta manteniendo el clic y arrastrando."
                            );
                          } else {
                            setIsCropMode(false);
                          }
                        }}
                        size="sm"
                        className="text-xs h-8 px-2.5 bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        Fijar Recorte
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-6 relative">
                {/* Elemento principal a capturar */}
                <div
                  ref={ref}
                  className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 space-y-4 relative overflow-hidden transition-all duration-300"
                >
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 text-left">
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight">
                        Tarjeta de Datos Dinámicos
                      </h3>
                      <p className="text-slate-500 font-semibold text-xs">
                        Captura de pantalla limpia, modular y segura.
                      </p>
                    </div>
                    <div className="p-2 bg-indigo-50 rounded-xl">
                      <Code2 className="w-5 h-5 text-indigo-600" />
                    </div>
                  </div>

                  {/* Caja de scroll para probar fullScrollCapture */}
                  <div className="border border-slate-100 rounded-xl overflow-hidden mt-2 text-left">
                    <div className="bg-slate-50/80 px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                        <Grid className="w-3 h-3 text-slate-400" />
                        Historial de Versiones (Contenido Scrollable)
                      </span>
                      <span className="text-[9px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                        Desplázame 👇
                      </span>
                    </div>
                    <div className="max-h-36 overflow-y-auto p-3 bg-white text-[11px] text-slate-600 space-y-1.5 scrollbar-thin">
                      <p className="font-semibold text-slate-800">
                        🚀 Registro de Características del Proyecto:
                      </p>
                      <p>• v1.0.0 - Lanzamiento inicial del hook de captura DOM.</p>
                      <p>• v1.0.5 - Optimización de selectores excluidos en el DOM.</p>
                      <p>• v1.1.0 - Soporte multiformato (PNG, JPEG, SVG, PDF, WEBP).</p>
                      <p>• v1.1.0 - Modo sin descarga (Base64/dataUrl).</p>
                      <p>• v1.1.0 - Copiado al portapapeles nativo de imágenes.</p>
                      <p>• v1.1.0 - Inyección temporal de estilos CSS (styleOverrides).</p>
                      <p>• v1.1.0 - Marcas de agua por texto/imagen configurables.</p>
                      <p>• v1.1.0 - Captura de scroll completo en elementos de altura fija.</p>
                      <p>• v1.1.0 - Herramienta de recorte visual integrado (Crop area).</p>
                      <p className="text-indigo-600 font-bold">
                        🎯 ¡Fin de la lista de características avanzadas!
                      </p>
                    </div>
                  </div>

                  {/* Elemento excluido de la captura */}
                  <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/60 ignore-capture backdrop-blur-sm text-left">
                    <div className="flex items-start gap-2">
                      <span className="text-sm shrink-0">⚠️</span>
                      <p className="text-[10px] sm:text-xs text-amber-800 font-medium leading-normal">
                        Este aviso amarillo se omitirá en la descarga gracias al filtro de exclusión{" "}
                        <code className="bg-amber-100/60 px-1 py-0.5 rounded font-mono border border-amber-200/50 font-bold">
                          .ignore-capture
                        </code>
                        .
                      </p>
                    </div>
                  </div>
                </div>

                {/* Overlay Oscuro para Snipping Tool (Modo Recorte) */}
                {isCropMode && (
                  <div
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    className="absolute inset-0 bg-slate-950/60 rounded-2xl cursor-crosshair flex flex-col items-center justify-center select-none"
                    style={{ margin: "1.5rem" }} // Alínea con el padding del CardContent
                  >
                    {!cropStart && (
                      <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-slate-200/60 text-slate-800 text-center shadow-lg pointer-events-none max-w-xs space-y-1">
                        <p className="text-xs font-bold flex items-center gap-1.5 justify-center text-indigo-600">
                          <Scissors className="w-4 h-4 animate-bounce" /> Mode Recorte Visual Activo
                        </p>
                        <p className="text-[10px] text-slate-500 leading-normal">
                          Mantén presionado el clic y arrastra sobre la tarjeta para dibujar el área
                          a recortar.
                        </p>
                      </div>
                    )}

                    {/* Rectángulo de selección claro dibujado en pantalla */}
                    {cropStart && cropEnd && (
                      <div
                        className="absolute border-2 border-dashed border-sky-400 bg-sky-400/10 shadow-[0_0_0_9999px_rgba(15,23,42,0.6)] overflow-hidden"
                        style={{
                          left: Math.min(cropStart.x, cropEnd.x),
                          top: Math.min(cropStart.y, cropEnd.y),
                          width: Math.abs(cropStart.x - cropEnd.x),
                          height: Math.abs(cropStart.y - cropEnd.y),
                        }}
                      >
                        <div className="absolute top-1 left-1 bg-sky-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                          {Math.round(Math.abs(cropStart.x - cropEnd.x))} x{" "}
                          {Math.round(Math.abs(cropStart.y - cropEnd.y))}px
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>

              {/* Botón flotante para restablecer el recorte si ya hay uno fijado */}
              {cropArea && !isCropMode && (
                <div className="px-6 pb-2 text-left flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-1 rounded-lg font-bold">
                    <Scissors className="w-3 h-3 text-sky-500" />
                    Recorte activo: {Math.round(cropArea.width)}x{Math.round(cropArea.height)}px
                  </span>
                  <button
                    onClick={cancelCropMode}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-slate-100"
                    title="Restablecer recorte"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Consola Base64 para download=false */}
              {capturedUrl && (
                <div className="px-6 pb-4">
                  <div className="p-4 bg-indigo-50/60 border border-indigo-100/80 shadow-sm rounded-2xl text-left space-y-2.5 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-950">
                        Salida Base64 (Data URL) generada:
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(capturedUrl);
                          alert("Texto Base64 copiado");
                        }}
                        className="text-[10px] bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold px-2.5 py-1 rounded-lg border border-indigo-200/50 transition"
                      >
                        Copiar texto
                      </button>
                    </div>
                    <textarea
                      readOnly
                      value={capturedUrl}
                      className="w-full h-24 bg-white/90 text-indigo-950 font-mono text-xs p-3 rounded-xl border border-indigo-200/50 shadow-inner focus:outline-none resize-none scrollbar-thin"
                    />
                    <p className="text-[10px] text-indigo-600/80 font-medium">
                      ✓ download desactivado. String Base64 listo para subirse a S3, base de datos o
                      API.
                    </p>
                  </div>
                </div>
              )}

              <CardFooter className="bg-white/50 border-t border-slate-100/80 rounded-b-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleCapture}
                  size="lg"
                  className="flex-1 h-12 text-sm font-semibold gap-2 transition-all duration-300 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-600/15 hover:shadow-xl hover:shadow-indigo-600/25 hover:-translate-y-0.5 rounded-xl group"
                  disabled={isCapturing}
                >
                  {isCapturing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="truncate">Procesando {format.toUpperCase()}...</span>
                    </>
                  ) : (
                    <>
                      {download ? (
                        getFormatIcon(format, "text-white")
                      ) : (
                        <Eye className="w-4 h-4 text-white" />
                      )}
                      <span className="truncate">
                        {download
                          ? `Descargar ${format.toUpperCase()}`
                          : `Generar Base64 ${format.toUpperCase()}`}
                      </span>
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="lg"
                  className="h-12 px-5 text-sm font-semibold gap-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl hover:-translate-y-0.5 transition-all duration-300"
                  disabled={isCopying}
                >
                  {isCopying ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : copySuccess ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Clipboard className="w-4 h-4 text-slate-500" />
                  )}
                  <span>{copySuccess ? "Copiado" : "Copiar"}</span>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 bg-white/80 backdrop-blur-md relative z-10 py-6 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 hidden sm:block" />
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              ✨ Diseñado y desarrollado con dedicación por{" "}
              <a
                href="https://www.pererita.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-900 font-bold hover:text-indigo-600 transition-colors bg-clip-text hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 whitespace-nowrap"
              >
                Pererita
              </a>
            </p>
          </div>

          <div className="flex items-center">
            <a
              href="https://github.com/pererita/useCaptureElement"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-900 transition-all hover:scale-105 flex items-center gap-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full"
            >
              <Github className="w-4 h-4" />
              <span>Ver código fuente</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
