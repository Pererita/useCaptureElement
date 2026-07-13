"use client";

import { useRef, useState } from "react";
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
} from "lucide-react";

type ExportFormat = "png" | "jpeg" | "svg" | "pdf" | "webp";

export default function HomeContainer() {
  const ref = useRef<HTMLDivElement>(null);
  const { capture, copyToClipboard } = useCaptureElement();
  const [isCapturing, setIsCapturing] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [format, setFormat] = useState<ExportFormat>("png");
  const [download, setDownload] = useState(true);
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);

  const handleCapture = async () => {
    setIsCapturing(true);
    setCapturedUrl(null);
    try {
      const dataUrl = await capture(ref, {
        format,
        fileName: `demo-use-capture.${format}`,
        excludeSelector: ".ignore-capture",
        backgroundColor: "#ffffff",
        download,
      });

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
      const success = await copyToClipboard(ref, {
        excludeSelector: ".ignore-capture",
        backgroundColor: "#ffffff",
      });
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden font-sans selection:bg-blue-200">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 -left-4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute top-0 -right-4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute -bottom-8 left-10 sm:left-20 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative z-10 w-full max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12 max-w-2xl px-2 sm:px-4">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs sm:text-sm font-semibold mb-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" />
            <span>Soporte Multiformato Completo, Portapapeles y SSR Ready</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm leading-[1.1]">
            useCapture
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Element
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed font-medium mt-3 sm:mt-4">
            La forma más elegante y sencilla de capturar el DOM y exportarlo a PNG, JPEG, SVG y PDF
            o copiarlo directamente a tu portapapeles.
          </p>
        </div>

        {/* Demo Card Section */}
        <div className="w-full max-w-xl mx-auto">
          <Card className="w-full shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] border border-white/60 bg-white/70 backdrop-blur-xl ring-1 ring-slate-200/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.12)]">
            <CardHeader className="bg-white/50 border-b border-slate-100/80 p-5 sm:p-6 pb-5 sm:pb-6">
              <CardTitle className="flex items-start sm:items-center gap-2.5 sm:gap-2 text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 leading-tight">
                <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500 shrink-0 mt-0.5 sm:mt-0" />
                <span>Zona de Demostración Interactiva</span>
              </CardTitle>
              <CardDescription className="text-slate-500 text-xs sm:text-sm font-medium mt-1.5 sm:mt-2">
                Elige el formato, copia al portapapeles o desactiva la descarga automática para
                obtener el Base64.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 md:p-8">
              {/* Selector de formatos Premium */}
              <div className="flex justify-center gap-1.5 p-1 bg-slate-100/80 rounded-xl max-w-sm mx-auto backdrop-blur-sm border border-slate-200/40 mb-4">
                {(["png", "jpeg", "svg", "pdf", "webp"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => {
                      setFormat(fmt);
                      setCapturedUrl(null);
                    }}
                    className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg capitalize transition-all duration-300 flex items-center justify-center gap-1.5 ${
                      format === fmt
                        ? "bg-white text-indigo-600 shadow-sm border border-slate-200/50"
                        : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
                    }`}
                  >
                    {fmt.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Opciones de descarga (Modo Servidor) */}
              <div className="flex items-center justify-between p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/60 max-w-sm mx-auto mb-6">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={download}
                    onChange={(e) => {
                      setDownload(e.target.checked);
                      setCapturedUrl(null);
                    }}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 accent-indigo-600"
                  />
                  <span className="text-xs sm:text-sm font-semibold text-slate-700">
                    Descargar archivo localmente
                  </span>
                </label>
              </div>

              {/* Elemento principal a capturar */}
              <div
                ref={ref}
                className="bg-white p-5 sm:p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 space-y-5 sm:space-y-6 relative overflow-hidden transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
              >
                <div className="absolute top-0 left-0 w-full h-1 sm:h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                      ¡Hola Desarrollador! 👋
                    </h3>
                    <p className="text-slate-500 font-medium leading-relaxed text-sm sm:text-base">
                      Este elemento HTML se transformará dinámicamente en el formato vectorial o
                      rasterizado que hayas seleccionado arriba.
                    </p>
                  </div>
                  <div className="p-2.5 sm:p-3 bg-indigo-50 rounded-xl hidden sm:block">
                    <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                  </div>
                </div>

                {/* Elemento que será excluido */}
                <div className="p-3 sm:p-4 bg-amber-50/80 rounded-xl border border-amber-200/60 ignore-capture backdrop-blur-sm">
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    <span className="text-lg sm:text-xl shrink-0 mt-0.5 sm:mt-0">⚠️</span>
                    <p className="text-xs sm:text-sm text-amber-800/90 font-medium leading-relaxed">
                      Este recuadro se ignorará en el archivo final gracias a la clase{" "}
                      <code className="bg-amber-100/60 px-1.5 py-0.5 rounded text-amber-900 border border-amber-200/80 shadow-sm break-normal">
                        .ignore-capture
                      </code>
                      .
                    </p>
                  </div>
                </div>
              </div>

              {/* Consola Base64 para download=false */}
              {capturedUrl && (
                <div className="mt-6 p-4 bg-indigo-50/60 border border-indigo-100/80 shadow-sm rounded-2xl text-left space-y-2.5 backdrop-blur-sm">
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
              )}
            </CardContent>

            <CardFooter className="bg-white/50 border-t border-slate-100/80 rounded-b-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleCapture}
                size="lg"
                className="flex-1 h-12 sm:h-14 text-sm sm:text-base font-semibold gap-2 transition-all duration-300 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-600/20 hover:shadow-xl hover:shadow-indigo-600/30 hover:-translate-y-0.5 rounded-xl group"
                disabled={isCapturing}
              >
                {isCapturing ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span className="truncate">Procesando {format.toUpperCase()}...</span>
                  </>
                ) : (
                  <>
                    {download ? (
                      getFormatIcon(format, "text-white")
                    ) : (
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
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
                className="h-12 sm:h-14 px-5 text-sm sm:text-base font-semibold gap-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl hover:-translate-y-0.5 transition-all duration-300"
                disabled={isCopying}
              >
                {isCopying ? (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                ) : copySuccess ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                ) : (
                  <Clipboard className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                )}
                <span>{copySuccess ? "Copiado" : "Copiar"}</span>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 bg-white/80 backdrop-blur-md relative z-10 py-6 sm:py-8 mt-8 sm:mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 hidden sm:block" />
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              <span className="sm:hidden">✨ </span>Diseñado y desarrollado con dedicación por{" "}
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

          <div className="flex items-center mt-2 sm:mt-0">
            <a
              href="https://github.com/pererita/useCaptureElement"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-900 transition-all hover:scale-105 flex items-center gap-2 text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 px-4 py-2 sm:px-3 sm:py-1.5 rounded-full"
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
