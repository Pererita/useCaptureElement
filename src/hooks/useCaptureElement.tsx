import { useCallback, RefObject } from 'react';
import html2canvas from 'html2canvas';

export const useCaptureElement = () => {
  const generateImage = useCallback(
    async (
      ref: RefObject<HTMLElement>, // Referencia al elemento HTML
      fileName: string = "image.png", // Nombre del archivo
      excludeSelector: string | null = null // Selector para excluir elementos
    ) => {
      if (!ref.current) {
        console.error("Referencia no válida");
        return;
      }

      // Obtener elementos excluidos
      const excludedElements = excludeSelector
        ? Array.from(ref.current.querySelectorAll(excludeSelector))
        : [];

      try {
        // Ocultar temporalmente los elementos excluidos
        excludedElements.forEach((el) => {
          (el as HTMLElement).style.visibility = "hidden";
        });

        const canvas = await html2canvas(ref.current, {
          scale: 1.5, // Escala para ajustar calidad
          useCORS: true, // Permitir imágenes externas
        } as any); // Usar `any` como solución para propiedades no tipadas

        // Restaurar visibilidad de los elementos excluidos
        excludedElements.forEach((el) => {
          (el as HTMLElement).style.visibility = "";
        });

        const imgData = canvas.toDataURL("image/png");

        // Crear un enlace para descargar la imagen
        const link = document.createElement("a");
        link.href = imgData;
        link.download = fileName;
        link.click();
      } catch (error) {
        console.error("Error al generar la imagen:", error);
      }
    },
    []
  );

  return { generateImage };
};
