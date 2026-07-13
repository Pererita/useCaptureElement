export interface CaptureOptions {
  format?: "png" | "jpeg" | "svg" | "pdf";
  fileName?: string;
  excludeSelector?: string | null;
  quality?: number;
  backgroundColor?: string;
  width?: number;
  height?: number;
  download?: boolean;
}

/**
 * Utilidad interna para ocultar temporalmente elementos del DOM por selector CSS.
 * Retorna una función para restaurar su estado original.
 */
export const tempHideElements = (
  rootElement: HTMLElement,
  excludeSelector: string | null
): (() => void) => {
  if (!excludeSelector) return () => {};

  const excludedElements = Array.from(rootElement.querySelectorAll(excludeSelector));
  const originalStyles = excludedElements.map((el) => {
    const htmlEl = el as HTMLElement;
    return {
      element: htmlEl,
      visibility: htmlEl.style.visibility,
    };
  });

  excludedElements.forEach((el) => {
    (el as HTMLElement).style.visibility = "hidden";
  });

  return () => {
    originalStyles.forEach(({ element, visibility }) => {
      element.style.visibility = visibility;
    });
  };
};

/**
 * Realiza la descarga de un recurso en el navegador mediante un enlace temporal.
 */
export const downloadFile = (href: string, fileName: string) => {
  if (typeof window === "undefined") return;
  const link = window.document.createElement("a");
  link.href = href;
  link.download = fileName;
  window.document.body.appendChild(link);
  link.click();
  window.document.body.removeChild(link);
};

/**
 * Procesa la exportación en formato PDF de un elemento HTML utilizando jsPDF y html-to-image.
 * Se importa jsPDF dinámicamente para optimizar el bundle.
 */
export const exportToPdf = async (
  element: HTMLElement,
  fileName: string,
  quality: number,
  backgroundColor?: string,
  download: boolean = true
): Promise<string | null> => {
  // Importaciones dinámicas del lado del cliente
  const { toPng } = await import("html-to-image");
  const { jsPDF } = await import("jspdf");

  const dataUrl = await toPng(element, {
    quality,
    backgroundColor: backgroundColor || "#ffffff",
    pixelRatio: 2,
  });

  const pdf = new jsPDF({
    orientation: element.offsetWidth > element.offsetHeight ? "landscape" : "portrait",
    unit: "px",
    format: [element.offsetWidth, element.offsetHeight],
  });

  pdf.addImage(dataUrl, "PNG", 0, 0, element.offsetWidth, element.offsetHeight);

  if (download) {
    pdf.save(fileName);
    return null;
  }

  return pdf.output("datauristring");
};
