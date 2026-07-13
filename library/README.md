# useCaptureElement

Un hook de React y Next.js moderno, ligero y altamente seguro para capturar elementos del DOM y exportarlos a múltiples formatos como **PNG**, **JPEG**, **SVG** y **PDF**.

Es compatible con SSR (Server-Side Rendering) y está optimizado para evitar sobreingeniería y penalizaciones en el tamaño de los bundles del cliente importando dinámicamente sus librerías motor.

---

## 🎨 Características

- 🚀 **Soporte Multiformato**: Exporta elementos a imágenes rasterizadas (**PNG**, **JPEG**), vectores vectoriales (**SVG**) y documentos (**PDF**).
- 📋 **Copiar al Portapapeles**: Permite copiar la captura directamente en el portapapeles para pegarla en otras aplicaciones sin descargar archivos.
- ☁️ **Captura sin Descarga (Modo Servidor)**: Permite desactivar la descarga automática y obtener el string Base64 (`dataUrl`) para subir la imagen a tu base de datos o servidor de almacenamiento.
- ⚡ **Ultra Ligero y Rápido**: Utiliza `html-to-image` en lugar de `html2canvas`, logrando capturas mucho más rápidas a través de renderizado nativo del navegador SVG (`<foreignObject>`) y reduciendo el bundle de ~140kB a ~30kB.
- 📦 **SSR Ready (Next.js Compatible)**: Las dependencias del cliente (`jspdf`, `html-to-image`) se importan de manera dinámica sólo cuando se invoca la captura, previniendo errores durante la compilación en el servidor.
- ✂️ **Exclusión de Elementos**: Permite ocultar selectivamente componentes del DOM (ej. botones de descarga) usando selectores CSS.
- 🛡️ **Seguridad Garantizada**: Cadena de dependencias auditada frecuentemente y libre de vulnerabilidades críticas.

---

## 🚀 Instalación

```sh
npm install use-capture-element
# o
pnpm add use-capture-element
# o
yarn add use-capture-element
```

---

## 📌 Uso Básico

Importa el hook `useCaptureElement` en tu componente. Puedes usar la nueva función modular `capture` o la función clásica compatible `generateImage`.

### 📝 Ejemplo: Exportación en Múltiples Formatos

```tsx
"use client";

import { useRef, useState } from "react";
import { useCaptureElement } from "use-capture-element";

export default function CaptureCard() {
  const elementRef = useRef<HTMLDivElement>(null);
  const { capture } = useCaptureElement();
  const [format, setFormat] = useState<"png" | "pdf" | "svg">("png");

  const handleCapture = async () => {
    await capture(elementRef, {
      format,
      fileName: `mi-componente.${format}`,
      excludeSelector: ".no-exportar", // oculta elementos con esta clase
      backgroundColor: "#ffffff",
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div ref={elementRef} className="p-8 bg-slate-100 border rounded-xl">
        <h2 className="text-xl font-bold">Tarjeta de Presentación</h2>
        <p>Este componente se convertirá en imagen o PDF.</p>

        {/* Elemento que será excluido del resultado final */}
        <div className="no-exportar p-2 bg-yellow-100 text-yellow-800 rounded mt-4">
          ⚠️ Este aviso de control no saldrá en la captura.
        </div>
      </div>

      <div className="flex gap-2">
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value as any)}
          className="border p-2 rounded"
        >
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
          <option value="svg">SVG (Vectores)</option>
          <option value="pdf">PDF (Documento)</option>
        </select>

        <button
          onClick={handleCapture}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Exportar Elemento
        </button>
      </div>
    </div>
  );
}
```

---

## ⚙️ Referencia de la API

El hook expone las siguientes funciones modernas:

### 1. `capture(ref, options)`

Captura el elemento y lo exporta en el formato especificado. Retorna una promesa con el string Base64 (`dataUrl`) del recurso generado (`Promise<string | null>`).

| Propiedad del Objeto `options` | Tipo                                | Por defecto          | Descripción                                                                                                                                                |
| :----------------------------- | :---------------------------------- | :------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `format`                       | `'png' \| 'jpeg' \| 'svg' \| 'pdf'` | `'png'`              | El formato de exportación de la captura.                                                                                                                   |
| `fileName`                     | `string`                            | `'capture.{format}'` | Nombre del archivo a descargar (relevante si `download` es `true`).                                                                                        |
| `excludeSelector`              | `string \| null`                    | `null`               | Selector CSS para ocultar elementos durante la exportación.                                                                                                |
| `quality`                      | `number`                            | `0.95`               | Nivel de calidad para compresión en formatos JPEG/PDF.                                                                                                     |
| `backgroundColor`              | `string`                            | `undefined`          | Color de fondo de la imagen (ej: `'#ffffff'`).                                                                                                             |
| `width` / `height`             | `number`                            | `undefined`          | Dimensiones personalizadas para el renderizado.                                                                                                            |
| `download`                     | `boolean`                           | `true`               | Si es `true`, descarga el archivo en el navegador. Si es `false`, evita la descarga y solo retorna el `dataUrl` Base64 (ideal para subirlo a tu servidor). |

### 2. `copyToClipboard(ref, options)`

Captura el elemento como una imagen PNG y la copia directamente al portapapeles del sistema operativo (`Promise<boolean>`).

| Propiedad del Objeto `options` | Tipo             | Por defecto | Descripción                                                 |
| :----------------------------- | :--------------- | :---------- | :---------------------------------------------------------- |
| `excludeSelector`              | `string \| null` | `null`      | Selector CSS para ocultar elementos durante la exportación. |
| `quality`                      | `number`         | `0.95`      | Nivel de calidad para la compresión.                        |
| `backgroundColor`              | `string`         | `undefined` | Color de fondo.                                             |
| `width` / `height`             | `number`         | `undefined` | Dimensiones personalizadas.                                 |

---

## 🛠️ Ejemplos Avanzados

### A. Subir la Captura a un Servidor (sin descargar archivo)

```tsx
const { capture } = useCaptureElement();

const handleUpload = async () => {
  // Genera el Base64 sin descargar el archivo localmente
  const base64Image = await capture(ref, {
    format: "png",
    download: false,
  });

  if (base64Image) {
    // Enviar a tu API o servidor de almacenamiento
    await fetch("/api/upload", {
      method: "POST",
      body: JSON.stringify({ image: base64Image }),
      headers: { "Content-Type": "application/json" },
    });
  }
};
```

### B. Copiar Imagen al Portapapeles (para pegar en Slack, Figma, etc.)

```tsx
const { copyToClipboard } = useCaptureElement();

const handleCopy = async () => {
  const success = await copyToClipboard(ref, {
    excludeSelector: ".no-print",
  });

  if (success) {
    alert("¡Imagen copiada al portapapeles!");
  }
};
```

---

## 🔄 Compatibilidad con Versiones Anteriores (Legacy API)

Para evitar romper proyectos existentes que ya utilicen la versión `1.0.x`, se mantiene disponible la firma original:

### `generateImage(ref, fileName?, excludeSelector?)`

Internamente mapea a la función `capture` configurada con formato PNG.

```tsx
const { generateImage } = useCaptureElement();
await generateImage(ref, "captura.png", ".ignore-me");
```

---

## 📜 Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](./LICENSE) para más detalles.
