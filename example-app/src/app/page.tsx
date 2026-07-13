"use client";

import { useRef, useState } from "react";
import { useCaptureElement } from "@pererita/use-capture-element";
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
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Estados de características avanzadas
  const [fullScroll, setFullScroll] = useState(false);
  const [watermarkText, setWatermarkText] = useState("");
  const [watermarkPosition, setWatermarkPosition] = useState<
    "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center"
  >("bottom-right");

  // Función para mostrar Toast personalizado elegante y claro
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const getActiveOptions = () => {
    return {
      format,
      fileName: `capture-element-demo.${format}`,
      excludeSelector: ".ignore-capture",
      backgroundColor: "#ffffff",
      download,
      quality,
      fullScrollCapture: fullScroll,
      // Marca de agua de color sólido visible (Indigo 600) y tamaño de letra legible
      watermark: watermarkText
        ? {
            text: watermarkText,
            color: "#4f46e5",
            opacity: 0.35,
            fontSize: 24,
            position: watermarkPosition,
          }
        : null,
    };
  };

  const handleCapture = async () => {
    setIsCapturing(true);
    setCapturedUrl(null);
    try {
      const dataUrl = await capture(ref, getActiveOptions());
      if (!download && dataUrl) {
        setCapturedUrl(dataUrl);
        showToast("¡Base64 generado con éxito! 🔮");
      }
    } catch (error) {
      console.error("Error durante la captura:", error);
      showToast("Error al generar la captura ❌");
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
        showToast("¡Imagen copiada al portapapeles! 📋");
        setTimeout(() => setCopySuccess(false), 2000);
      } else {
        showToast("No se pudo copiar la imagen ❌");
      }
    } catch (error) {
      console.error("Error al copiar al portapapeles:", error);
      showToast("Error al copiar la imagen ❌");
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden font-sans selection:bg-indigo-100">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 -left-4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute top-0 -right-4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute -bottom-8 left-10 sm:left-20 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

      {/* Toast personalizado elegante claro */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-white/95 backdrop-blur-md text-indigo-950 text-xs sm:text-sm font-bold px-5 py-4 rounded-2xl shadow-[0_15px_40px_rgba(99,102,241,0.15)] border border-indigo-100/80 flex items-center gap-2.5 z-[999] animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="p-1 bg-indigo-50 rounded-lg">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

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
          <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed font-semibold mt-2">
            Captura elementos HTML a PNG, JPEG, SVG, PDF, WEBP, añade marcas de agua y fuerza scroll
            completo de forma instantánea.
          </p>
        </div>

        {/* Layout de dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
          {/* Panel de Ajustes */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="shadow-lg border border-slate-200/50 bg-white/80 backdrop-blur-md rounded-2xl">
              <CardHeader className="border-b border-slate-100 p-5">
                <CardTitle className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-500" />
                  Configuración del Hook
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 font-semibold">
                  Modifica las opciones avanzadas del hook para ver su impacto en la captura.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 space-y-6">
                {/* 1. Selector de Formato */}
                <div className="space-y-2 text-left">
                  <label className="text-xs sm:text-sm font-semibold text-slate-700 block">
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
                        className={`flex-1 min-w-[55px] py-2 text-xs sm:text-sm font-bold rounded-lg capitalize transition-all duration-300 ${
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
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <label className="text-xs sm:text-sm font-semibold text-slate-700 block">
                      Calidad de Compresión:
                    </label>
                    <span className="text-xs font-semibold bg-indigo-55/80 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100/50">
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
                  <p className="text-[10px] text-slate-400 font-normal">
                    Aplica a formatos JPEG, WEBP y PDF.
                  </p>
                </div>

                {/* 3. Checkboxes de Ajustes */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  {/* Interruptor Descarga */}
                  <label className="flex items-start justify-between cursor-pointer select-none">
                    <div className="space-y-0.5 pr-4 text-left">
                      <span className="text-xs sm:text-sm font-semibold text-slate-700 block">
                        Descargar archivo localmente
                      </span>
                      <span className="text-[10px] text-indigo-600 block leading-tight">
                        Si lo desactivas, generará el Base64 en la consola inferior en lugar de
                        descargar el archivo.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={download}
                      onChange={(e) => {
                        setDownload(e.target.checked);
                        setCapturedUrl(null);
                      }}
                      className="w-4 h-4 mt-0.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 accent-indigo-600"
                    />
                  </label>

                  {/* Interruptor Scroll Completo */}
                  <label className="flex items-start justify-between cursor-pointer select-none">
                    <div className="space-y-0.5 pr-4 text-left">
                      <span className="text-xs sm:text-sm font-semibold text-slate-700 block">
                        Capturar Scroll Completo
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal block leading-tight">
                        Expande las zonas con barra de scroll para capturarlas en su totalidad.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={fullScroll}
                      onChange={(e) => setFullScroll(e.target.checked)}
                      className="w-4 h-4 mt-0.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 accent-indigo-600"
                    />
                  </label>
                </div>

                {/* 4. Marca de Agua */}
                <div className="space-y-3 pt-4 border-t border-slate-100 text-left">
                  <label className="text-xs sm:text-sm font-semibold text-slate-700 block flex items-center gap-1">
                    <Type className="w-4 h-4 text-indigo-500" />
                    Marca de Agua Automática:
                  </label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="Ej. useCaptureElement"
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:ring-1 focus:ring-indigo-500 focus:outline-none bg-slate-50/50 font-normal"
                  />
                  {watermarkText && (
                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-400 font-semibold block">
                        POSICIÓN EN LA IMAGEN:
                      </span>
                      <div className="grid grid-cols-3 gap-1.5 w-full max-w-[220px] mx-auto bg-slate-100/60 p-1.5 rounded-xl border border-slate-200/40">
                        {[
                          { pos: "top-left", label: "↖" },
                          { pos: "disabled-1", label: "·" },
                          { pos: "top-right", label: "↗" },
                          { pos: "disabled-2", label: "·" },
                          { pos: "center", label: "☉" },
                          { pos: "disabled-3", label: "·" },
                          { pos: "bottom-left", label: "↙" },
                          { pos: "disabled-4", label: "·" },
                          { pos: "bottom-right", label: "↘" },
                        ].map((item, idx) => {
                          const isDisabled = item.pos.startsWith("disabled");
                          const isSelected = watermarkPosition === item.pos;
                          return (
                            <button
                              key={idx}
                              type="button"
                              disabled={isDisabled}
                              onClick={() =>
                                setWatermarkPosition(item.pos as typeof watermarkPosition)
                              }
                              className={`h-9 text-xs font-bold rounded-lg flex items-center justify-center transition-all ${
                                isDisabled
                                  ? "opacity-20 cursor-default"
                                  : isSelected
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10 scale-105"
                                    : "bg-white hover:bg-slate-50 text-slate-500 border border-slate-200/40 hover:text-slate-800"
                              }`}
                              title={isDisabled ? "" : `Posición: ${item.pos}`}
                            >
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Zona de Demostración */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="w-full shadow-lg border border-slate-200/50 bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden">
              <CardHeader className="bg-white/50 border-b border-slate-100/80 p-5">
                <CardTitle className="text-sm sm:text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-indigo-500" />
                  Elemento de Captura
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 font-semibold">
                  Este es el elemento HTML interactivo que procesará el hook.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 relative">
                {/* Elemento principal a capturar */}
                <div
                  ref={ref}
                  className="bg-white text-slate-800 p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 space-y-4 relative overflow-hidden transition-all duration-300 text-left"
                >
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-800">
                        Tarjeta de Datos Dinámicos
                      </h3>
                      <p className="font-semibold text-slate-500 text-xs">
                        Captura de pantalla limpia, modular y segura.
                      </p>
                    </div>
                    <div className="p-2 bg-indigo-50 rounded-xl">
                      <Code2 className="w-5 h-5 text-indigo-600" />
                    </div>
                  </div>

                  {/* Caja de scroll para probar fullScrollCapture */}
                  <div className="border border-slate-100 rounded-xl overflow-hidden mt-2">
                    <div className="bg-slate-50/80 px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                        <Grid className="w-3 h-3 text-slate-400" />
                        Historial de Versiones (Contenido Scrollable)
                      </span>
                      <span className="text-[9px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                        Desplázame 👇
                      </span>
                    </div>
                    <div className="max-h-36 overflow-y-auto p-3 text-[11px] space-y-1.5 bg-white text-slate-650 scrollbar-thin transition-colors duration-300">
                      <p className="font-semibold text-slate-800">
                        🚀 Registro de Características del Proyecto:
                      </p>
                      <p>• v1.0.0 - Lanzamiento inicial del hook de captura DOM.</p>
                      <p>• v1.0.5 - Optimización de selectores excluidos en el DOM.</p>
                      <p>• v1.1.0 - Soporte multiformato (PNG, JPEG, SVG, PDF, WEBP).</p>
                      <p>• v1.1.0 - Modo sin descarga (Base64/dataUrl).</p>
                      <p>• v1.1.0 - Copiado al portapapeles nativo de imágenes.</p>
                      <p>• v1.1.0 - Marcas de agua por texto/imagen configurables.</p>
                      <p>• v1.1.0 - Captura de scroll completo en elementos de altura fija.</p>
                      <p className="text-indigo-600 font-bold">
                        🎯 ¡Fin de la lista de características avanzadas!
                      </p>
                    </div>
                  </div>

                  {/* Elemento excluido de la captura */}
                  <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/60 ignore-capture backdrop-blur-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-sm shrink-0">⚠️</span>
                      <p className="text-[10px] sm:text-xs text-amber-800 font-semibold leading-normal">
                        Este aviso amarillo se omitirá en la descarga gracias al filtro de exclusión{" "}
                        <code className="bg-amber-100/60 px-1 py-0.5 rounded font-mono border border-amber-200/50 font-bold">
                          .ignore-capture
                        </code>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>

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
                          showToast("¡Código Base64 copiado con éxito! 🚀");
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
                    <p className="text-[10px] text-indigo-600 font-bold">
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
                  className="flex-1 h-12 text-sm font-bold gap-2 transition-all duration-300 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-600/15 hover:shadow-xl hover:shadow-indigo-600/25 hover:-translate-y-0.5 rounded-xl group"
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
                  className="h-12 px-5 text-sm font-bold gap-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl hover:-translate-y-0.5 transition-all duration-300"
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
