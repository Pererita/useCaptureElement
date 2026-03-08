"use client";

import { useRef, useState } from "react";
import { useCaptureElement } from "use-capture-element";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Camera, Download, Loader2, Github, Code2, Sparkles } from "lucide-react";

export default function HomeContainer() {
  const ref = useRef<HTMLDivElement>(null);
  const { generateImage } = useCaptureElement();
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = async () => {
    setIsCapturing(true);
    try {
      await generateImage(ref, "demo-use-capture.png", ".ignore-capture");
    } catch (error) {
      console.error("Error durante la captura:", error);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden font-sans selection:bg-blue-200">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 w-full max-w-5xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12 max-w-2xl px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold mb-2 shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Integración Perfecta con Next.js</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm">
            useCapture<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Element</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed font-medium mt-4">
            La forma más elegante y sencilla de capturar el DOM y convertirlo en imágenes de alta calidad en tus aplicaciones de React.
          </p>
        </div>

        {/* Demo Card Section */}
        <div className="w-full max-w-xl mx-auto">
          <Card className="w-full shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] border border-white/60 bg-white/70 backdrop-blur-xl ring-1 ring-slate-200/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.12)]">
            <CardHeader className="bg-white/50 border-b border-slate-100/80 pb-6">
              <CardTitle className="flex items-center gap-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
                <Camera className="w-6 h-6 text-indigo-500" />
                Zona de Demostración Interactiva
              </CardTitle>
              <CardDescription className="text-slate-500 text-sm font-medium mt-1.5">
                Haz clic en el botón de abajo para capturar un PNG de esta tarjeta excluyendo la zona de advertencia.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 sm:p-8">
              {/* Elemento principal a capturar */}
              <div
                ref={ref}
                className="bg-white p-6 sm:p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 space-y-6 relative overflow-hidden transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-slate-800 tracking-tight">¡Hola Desarrollador! 👋</h3>
                    <p className="text-slate-500 font-medium leading-relaxed text-sm sm:text-base">
                      Este es el elemento HTML que se convertirá en una imagen utilizando tu hook personalizado.
                    </p>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-xl hidden sm:block">
                    <Code2 className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>

                {/* Elemento que será excluido */}
                <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200/60 ignore-capture backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-xl shrink-0 mt-0.5">⚠️</span>
                    <p className="text-sm text-amber-800/90 font-medium leading-relaxed">
                      Este recuadro se ignorará en el PNG final gracias a la clase <code className="bg-amber-100/60 px-1.5 py-0.5 rounded text-amber-900 border border-amber-200/80 shadow-sm">.ignore-capture</code>.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-white/50 border-t border-slate-100/80 rounded-b-2xl p-6">
              <Button
                onClick={handleCapture}
                size="lg"
                className="w-full h-14 text-base font-semibold gap-2 transition-all duration-300 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20 hover:-translate-y-0.5 rounded-xl group"
                disabled={isCapturing}
              >
                {isCapturing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generando Imagen...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    Descargar Captura PNG
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 bg-white/80 backdrop-blur-md relative z-10 py-6 mt-12">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <p className="text-sm text-slate-600 font-medium">
              Diseñado y desarrollado con dedicación por{" "}
              <a 
                href="https://portafolio-pererita.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-900 font-bold hover:text-indigo-600 transition-colors bg-clip-text hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600"
              >
                Pererita
              </a>
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/pererita/useCaptureElement" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-900 transition-all hover:scale-105 flex items-center gap-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full"
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