export interface WatermarkOptions {
  text?: string;
  imageUrl?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  fontSize?: number;
  color?: string;
  opacity?: number;
  xOffset?: number;
  yOffset?: number;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CaptureOptions {
  format?: "png" | "jpeg" | "svg" | "pdf" | "webp";
  fileName?: string;
  excludeSelector?: string | null;
  quality?: number;
  backgroundColor?: string;
  width?: number;
  height?: number;
  download?: boolean;
  styleOverrides?: Partial<CSSStyleDeclaration> | null;
  watermark?: WatermarkOptions | null;
  fullScrollCapture?: boolean;
  crop?: CropArea | null;
}

/**
 * Utilidad interna para ocultar temporalmente elementos del DOM por selector CSS usando display: none.
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
      display: htmlEl.style.display,
    };
  });

  excludedElements.forEach((el) => {
    (el as HTMLElement).style.display = "none";
  });

  return () => {
    originalStyles.forEach(({ element, display }) => {
      element.style.display = display;
    });
  };
};

/**
 * Aplica temporalmente estilos CSS en línea sobre un elemento y retorna la función de restauración.
 * Además, inyecta la clase temporal .use-capture-active para desencadenar las anulaciones de Tailwind.
 */
export const applyStyleOverrides = (
  element: HTMLElement,
  styleOverrides: Partial<CSSStyleDeclaration> | null
): (() => void) => {
  element.classList.add("use-capture-active");

  if (!styleOverrides) {
    return () => {
      element.classList.remove("use-capture-active");
    };
  }

  const originalStyles: { [key: string]: string } = {};

  Object.keys(styleOverrides).forEach((key) => {
    const styleKey = key as any;
    originalStyles[styleKey] = element.style[styleKey];
    element.style[styleKey] = (styleOverrides as any)[styleKey];
  });

  return () => {
    Object.keys(styleOverrides).forEach((key) => {
      const styleKey = key as any;
      element.style[styleKey] = originalStyles[styleKey];
    });
    element.classList.remove("use-capture-active");
  };
};

/**
 * Expande de forma recursiva el elemento y todos sus descendientes que contengan
 * scroll vertical activo para capturar la totalidad del contenido.
 */
export const applyFullScrollCapture = (element: HTMLElement, enabled: boolean): (() => void) => {
  if (!enabled) return () => {};

  const scrollableElements: Array<{
    element: HTMLElement;
    height: string;
    maxHeight: string;
    overflow: string;
  }> = [];

  const expandElement = (el: HTMLElement) => {
    if (typeof window === "undefined") return;
    const style = window.getComputedStyle(el);
    const hasScrollableOverflow = style.overflowY === "auto" || style.overflowY === "scroll";

    if (hasScrollableOverflow && el.scrollHeight > el.clientHeight) {
      scrollableElements.push({
        element: el,
        height: el.style.height,
        maxHeight: el.style.maxHeight,
        overflow: el.style.overflow,
      });
      el.style.height = `${el.scrollHeight}px`;
      el.style.maxHeight = "none";
      el.style.overflow = "visible";
    }
  };

  expandElement(element);

  const descendants = Array.from(element.querySelectorAll("*")) as HTMLElement[];
  descendants.forEach(expandElement);

  return () => {
    scrollableElements.forEach(({ element: el, height, maxHeight, overflow }) => {
      el.style.height = height;
      el.style.maxHeight = maxHeight;
      el.style.overflow = overflow;
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
 * Convierte un dataUrl (Base64) de imagen a formato WebP utilizando un canvas temporal.
 */
export const convertToWebp = (dataUrl: string, quality: number): Promise<string> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      return resolve(dataUrl);
    }
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = window.document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return resolve(dataUrl);
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/webp", quality));
    };
    img.onerror = () => {
      resolve(dataUrl);
    };
    img.src = dataUrl;
  });
};

/**
 * Aplica una marca de agua (texto o imagen) sobre una captura de pantalla.
 * Escala automáticamente el tamaño de fuente y coordenadas según el pixelRatio real de la imagen.
 */
export const applyWatermark = (dataUrl: string, options: WatermarkOptions): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      return resolve(dataUrl);
    }
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = window.document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return resolve(dataUrl);
      }
      ctx.drawImage(img, 0, 0);

      const {
        text,
        imageUrl,
        position = "bottom-right",
        fontSize = 16,
        color = "rgba(128, 128, 128, 0.5)",
        opacity = 0.5,
        xOffset = 20,
        yOffset = 20,
      } = options;

      ctx.save();
      ctx.globalAlpha = opacity;

      // Compensamos el pixelRatio (asumiendo pixelRatio de 2, escalamos los tamaños relativos)
      const scaleFactor = canvas.width > 600 ? 2 : 1;
      const actualFontSize = fontSize * scaleFactor;
      const actualXOffset = xOffset * scaleFactor;
      const actualYOffset = yOffset * scaleFactor;

      const drawWatermark = (
        watermarkWidth: number,
        watermarkHeight: number,
        renderFn: (x: number, y: number) => void
      ) => {
        let x = actualXOffset;
        let y = actualYOffset;
        switch (position) {
          case "top-right":
            x = canvas.width - watermarkWidth - actualXOffset;
            y = actualYOffset;
            break;
          case "bottom-left":
            x = actualXOffset;
            y = canvas.height - watermarkHeight - actualYOffset;
            break;
          case "bottom-right":
            x = canvas.width - watermarkWidth - actualXOffset;
            y = canvas.height - watermarkHeight - actualYOffset;
            break;
          case "center":
            x = (canvas.width - watermarkWidth) / 2;
            y = (canvas.height - watermarkHeight) / 2;
            break;
          case "top-left":
          default:
            x = actualXOffset;
            y = actualYOffset;
            break;
        }
        renderFn(x, y);
      };

      if (imageUrl) {
        const watermarkImg = new window.Image();
        watermarkImg.crossOrigin = "anonymous";
        watermarkImg.onload = () => {
          const w = watermarkImg.width * scaleFactor;
          const h = watermarkImg.height * scaleFactor;
          drawWatermark(w, h, (x, y) => {
            ctx.drawImage(watermarkImg, x, y, w, h);
            ctx.restore();
            resolve(canvas.toDataURL());
          });
        };
        watermarkImg.onerror = () => {
          ctx.restore();
          resolve(dataUrl);
        };
        watermarkImg.src = imageUrl;
      } else if (text) {
        ctx.font = `bold ${actualFontSize}px sans-serif`;
        ctx.fillStyle = color;
        ctx.textBaseline = "top";
        const textWidth = ctx.measureText(text).width;
        const textHeight = actualFontSize;
        drawWatermark(textWidth, textHeight, (x, y) => {
          ctx.fillText(text, x, y);
          ctx.restore();
          resolve(canvas.toDataURL());
        });
      } else {
        ctx.restore();
        resolve(dataUrl);
      }
    };
    img.onerror = () => reject(new Error("Error al cargar la imagen original para marca de agua"));
    img.src = dataUrl;
  });
};

/**
 * Recorta una sección específica de la imagen.
 * Calcula la escala de píxeles real comparando el tamaño de la imagen con las dimensiones CSS del elemento original.
 */
export const cropImage = (
  dataUrl: string,
  crop: CropArea,
  element?: HTMLElement
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      return resolve(dataUrl);
    }
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = window.document.createElement("canvas");

      let scaleX = 1;
      let scaleY = 1;

      // Si se pasa el elemento DOM, calculamos la proporción real de escalado (pixelRatio)
      if (element) {
        scaleX = img.width / element.offsetWidth;
        scaleY = img.height / element.offsetHeight;
      }

      const realX = crop.x * scaleX;
      const realY = crop.y * scaleY;
      const realWidth = crop.width * scaleX;
      const realHeight = crop.height * scaleY;

      canvas.width = realWidth;
      canvas.height = realHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return resolve(dataUrl);
      }

      ctx.drawImage(img, realX, realY, realWidth, realHeight, 0, 0, realWidth, realHeight);
      resolve(canvas.toDataURL());
    };
    img.onerror = () => reject(new Error("Error al cargar la imagen original para recortar"));
    img.src = dataUrl;
  });
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
