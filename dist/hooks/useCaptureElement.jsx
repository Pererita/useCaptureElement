import { useCallback } from 'react';
import html2canvas from 'html2canvas';
export const useCaptureElement = () => {
    const generateImage = useCallback(async (ref, fileName = "image.png", excludeSelector = null) => {
        if (!ref.current) {
            console.error("Referencia no válida");
            return;
        }
        const excludedElements = excludeSelector
            ? Array.from(ref.current.querySelectorAll(excludeSelector))
            : [];
        try {
            excludedElements.forEach((el) => {
                el.style.visibility = "hidden";
            });
            const canvas = await html2canvas(ref.current, {
                scale: 1.5,
                useCORS: true,
            });
            excludedElements.forEach((el) => {
                el.style.visibility = "";
            });
            const imgData = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = imgData;
            link.download = fileName;
            link.click();
        }
        catch (error) {
            console.error("Error al generar la imagen:", error);
        }
    }, []);
    return { generateImage };
};
