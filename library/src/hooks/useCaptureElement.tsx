import { useCallback, RefObject } from "react";
import {
  CaptureOptions,
  tempHideElements,
  downloadFile,
  exportToPdf,
  applyStyleOverrides,
  applyFullScrollCapture,
  applyWatermark,
  cropImage,
  convertToWebp,
} from "./utils";

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
        styleOverrides = null,
        watermark = null,
        fullScrollCapture = false,
        crop = null,
      } = options;

      const element = ref.current;

      // 1. Cargar dinámicamente las dependencias de forma asíncrona ANTES de alterar el DOM.
      // Esto evita que el DOM quede modificado visiblemente en pantalla mientras se descargan los archivos.
      const htmlToImagePromise = format !== "pdf" ? import("html-to-image") : null;

      // 2. Aplicar estados y estilos temporales del DOM de forma síncrona justo antes de capturar
      const restoreVisibility = tempHideElements(element, excludeSelector);
      const restoreStyles = applyStyleOverrides(element, styleOverrides);
      const restoreScroll = applyFullScrollCapture(element, fullScrollCapture);

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

        const { toPng, toJpeg, toSvg } = await htmlToImagePromise!;
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
          case "webp":
            const pngTemp = await toPng(element, imageOptions);
            dataUrl = await convertToWebp(pngTemp, quality);
            break;
          case "png":
          default:
            dataUrl = await toPng(element, imageOptions);
            break;
        }

        // --- Procesamiento Gráfico Posterior (Canvas) ---

        // 1. Aplicar Recorte si se especifica (pasamos element para ajustar el escalado pixelRatio)
        if (crop) {
          dataUrl = await cropImage(dataUrl, crop, element);
        }

        // 2. Aplicar Marca de agua si se especifica
        if (watermark) {
          dataUrl = await applyWatermark(dataUrl, watermark);
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
        // Restaurar todos los estados del DOM en orden inverso de forma síncrona
        restoreScroll();
        restoreStyles();
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
        styleOverrides = null,
        watermark = null,
        fullScrollCapture = false,
        crop = null,
      } = options;

      const element = ref.current;

      const htmlToImagePromise = import("html-to-image");

      const restoreVisibility = tempHideElements(element, excludeSelector);
      const restoreStyles = applyStyleOverrides(element, styleOverrides);
      const restoreScroll = applyFullScrollCapture(element, fullScrollCapture);

      try {
        await htmlToImagePromise; // Asegura que la librería esté cargada antes de capturar

        // Obtenemos la captura procesada como dataUrl Base64
        let dataUrl = await capture(ref, {
          format: "png",
          download: false,
          excludeSelector,
          quality,
          backgroundColor,
          width,
          height,
          styleOverrides,
          watermark,
          fullScrollCapture,
          crop,
        });

        if (!dataUrl) {
          throw new Error("No se pudo generar el dataUrl para copiar.");
        }

        const response = await fetch(dataUrl);
        const blob = await response.blob();

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
        restoreScroll();
        restoreStyles();
        restoreVisibility();
      }
    },
    [capture]
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
