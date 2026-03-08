import { useCallback, RefObject } from 'react';

export const useCaptureElement = () => {
  const generateImage = useCallback(
    async (
      ref: RefObject<HTMLElement | null>,
      fileName: string = "image.png",
      excludeSelector: string | null = null
    ) => {
      if (!ref.current) {
        console.error("Referencia no válida");
        return;
      }

      const excludedElements = excludeSelector
        ? Array.from(ref.current.querySelectorAll(excludeSelector))
        : [];

      try {
        const html2canvas = (await import('html2canvas')).default;

        excludedElements.forEach((el) => {
          (el as HTMLElement).style.visibility = "hidden";
        });

        const canvas = await html2canvas(ref.current, {
          scale: 1.5,
          useCORS: true,
        } as any);

        excludedElements.forEach((el) => {
          (el as HTMLElement).style.visibility = "";
        });

        const imgData = canvas.toDataURL("image/png");
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