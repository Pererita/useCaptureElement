"use client";

import { useRef, useState } from "react";
import { useCaptureElement } from "use-capture-element";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Camera, Download, Loader2 } from "lucide-react";

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
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            useCaptureElement
          </h1>
          <p className="text-slate-600">
            Demo interactiva para capturar el DOM en Next.js
          </p>
        </div>

        <Card className="w-full shadow-xl border-0 ring-1 ring-slate-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Zona de Captura
            </CardTitle>
            <CardDescription>
              El contenido de esta tarjeta será procesado y exportado como PNG.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Elemento principal a capturar */}
            <div
              ref={ref}
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              
              <h3 className="text-lg font-bold text-slate-800">¡Hola Desarrollador! 👋</h3>
              <p className="text-sm text-slate-600">
                Este es el elemento HTML que se convertirá en una imagen utilizando tu hook personalizado.
              </p>

              {/* Elemento que será excluido */}
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 ignore-capture">
                <p className="text-xs text-amber-700 font-medium text-center">
                  ⚠️ Este recuadro será ignorado en la imagen final gracias a la clase <code>.ignore-capture</code>.
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-slate-50 border-t border-slate-100 rounded-b-xl pt-6">
            <Button
              onClick={handleCapture}
              className="w-full gap-2 transition-all"
              disabled={isCapturing}
            >
              {isCapturing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Procesando Captura...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Descargar Imagen
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}