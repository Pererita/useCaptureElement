"use client";

import { useRef } from "react";
import { useCaptureElement } from "use-capture-element";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomeContainer() {
  const ref = useRef<HTMLDivElement>(null!);
  const { generateImage } = useCaptureElement();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <Card className="w-[350px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-lg font-semibold">
            Captura de Elemento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            ref={ref}
            className="bg-gray-200 p-4 rounded-md shadow-md text-center"
          >
            <p className="text-gray-700">¡Captura este elemento como imagen!</p>
          </div>
          <Button
            onClick={() => generateImage(ref, "captura.png")}
            className="w-full mt-4"
          >
            Capturar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
