import { useCallback, RefObject } from "react";
import { CaptureOptions, tempHideElements, downloadFile, exportToPdf } from "./utils";

export const useCaptureElement = () => {
  /**
   * Captura un elemento HTML y lo exporta en el formato especificado.
   * Retorna una promesa con el string Base64 (dataUrl) del recurso capturado.
   */
  const capture = useCallback(
    async (
      ref: RefObject<HTMLElement | null>,
      options: CaptureOptions = {}
    ): Promise<string | null> => {
      if (typeof window === "undefined") {
        console.warn("useCaptureElement: No se puede ejecutar en el servidor (SSR).");
        return null;
      }

      if (!ref || !ref.current) {
        console.error("useCaptureElement: Referencia al elemento DOM inválida o nula.");
        return null;
      }

      const {
        format = "png",
        fileName = `capture.${format}`,
        excludeSelector = null,
        quality = 0.95,
        backgroundColor = undefined,
        width,
        height,
        download = true,
      } = options;

      const element = ref.current;
      const restoreVisibility = tempHideElements(element, excludeSelector);

      try {
        if (format === "pdf") {
          const pdfDataUrl = await exportToPdf(
            element,
            fileName,
            quality,
            backgroundColor,
            download
          );
          return pdfDataUrl;
        }

        const { toPng, toJpeg, toSvg } = await import("html-to-image");
        let dataUrl = "";

        const imageOptions = {
          quality,
          backgroundColor,
          width,
          height,
          pixelRatio: 2,
        };

        switch (format) {
          case "jpeg":
            dataUrl = await toJpeg(element, imageOptions);
            break;
          case "svg":
            dataUrl = await toSvg(element, imageOptions);
            break;
          case "png":
          default:
            dataUrl = await toPng(element, imageOptions);
            break;
        }

        if (download) {
          downloadFile(dataUrl, fileName);
        }

        return dataUrl;
      } catch (error) {
        console.error(
          `useCaptureElement: Error al capturar el elemento en formato ${format}:`,
          error
        );
        throw error;
      } finally {
        restoreVisibility();
      }
    },
    []
  );

  /**
   * Captura el elemento HTML especificado y lo copia como una imagen PNG
   * directamente al portapapeles del sistema operativo.
   */
  const copyToClipboard = useCallback(
    async (
      ref: RefObject<HTMLElement | null>,
      options: Omit<CaptureOptions, "format" | "fileName" | "download"> = {}
    ): Promise<boolean> => {
      if (typeof window === "undefined") {
        console.warn("useCaptureElement: No se puede copiar al portapapeles en el servidor (SSR).");
        return false;
      }

      if (!ref || !ref.current) {
        console.error("useCaptureElement: Referencia al elemento DOM inválida o nula.");
        return false;
      }

      const {
        excludeSelector = null,
        quality = 0.95,
        backgroundColor = undefined,
        width,
        height,
      } = options;

      const element = ref.current;
      const restoreVisibility = tempHideElements(element, excludeSelector);

      try {
        const { toBlob } = await import("html-to-image");

        const blob = await toBlob(element, {
          quality,
          backgroundColor,
          width,
          height,
          pixelRatio: 2,
        });

        if (!blob) {
          throw new Error("No se pudo generar el Blob de la captura.");
        }

        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ]);

        return true;
      } catch (error) {
        console.error("useCaptureElement: Error al copiar la captura al portapapeles:", error);
        return false;
      } finally {
        restoreVisibility();
      }
    },
    []
  );

  /**
   * Captura el elemento como una imagen PNG y la descarga en el cliente.
   * Mantenido únicamente para compatibilidad hacia atrás.
   */
  const generateImage = useCallback(
    async (
      ref: RefObject<HTMLElement | null>,
      fileName: string = "image.png",
      excludeSelector: string | null = null
    ) => {
      return capture(ref, {
        format: "png",
        fileName,
        excludeSelector,
      });
    },
    [capture]
  );

  return { capture, copyToClipboard, generateImage };
};

export type { CaptureOptions };
