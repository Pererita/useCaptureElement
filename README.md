# useCaptureElement
Un hook personalizado para React y Next.js que facilita la captura de imágenes de elementos HTML utilizando `html2canvas`. Ideal para generar capturas de pantalla de componentes o secciones específicas de tu aplicación.

## 🚀 Instalación
Para instalar el paquete en tu proyecto, ejecuta:

```sh
npm install use-capture-element
```

## 📌 Uso Básico
Importa el hook `useCaptureElement` en tu componente y úsalo para capturar cualquier elemento HTML.

### 📝 Ejemplo: Capturar un elemento HTML

```sh
import { useRef } from "react";
import { useCaptureElement } from "use-capture-element";

export default function Example() {
  const ref = useRef<HTMLDivElement>(null);
  const { generateImage } = useCaptureElement();

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={ref}
        className="p-4 border rounded-lg shadow-md bg-gray-100 text-center"
      >
        Este elemento será capturado como una imagen.
      </div>
      <button
        onClick={() => generateImage(ref, "captura.png")}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Capturar Elemento
      </button>
    </div>
  );
}
```

## ⚙️ API del Hook
El hook `useCaptureElement` expone la siguiente función:

### 📌 `generateImage(ref, fileName, excludeSelector?)`

| Parámetro         | Tipo                         | Descripción |
|------------------|----------------------------|-------------|
| `ref`           | `RefObject<HTMLElement>`     | Referencia al elemento HTML que se va a capturar. |
| `fileName`      | `string` _(opcional)_       | Nombre del archivo de la imagen generada. *(Por defecto: `"image.png"`)* |
| `excludeSelector` | `string` _(opcional)_       | Selector CSS para excluir elementos específicos de la captura. |

📌 **Nota:** Si `excludeSelector` se proporciona, todos los elementos que coincidan con el selector serán excluidos de la captura.

## 🛠 Ejemplo Avanzado: Excluir elementos específicos
Si deseas excluir ciertos elementos de la captura, puedes usar `excludeSelector`:

```sh
import { useRef } from "react";
import { useCaptureElement } from "use-capture-element";

export default function AdvancedExample() {
  const ref = useRef<HTMLDivElement>(null);
  const { generateImage } = useCaptureElement();

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={ref}
        className="p-4 border rounded-lg shadow-md bg-gray-100 text-center"
      >
        <p>Este elemento será capturado con alta calidad.</p>
        <div className="hidden-element text-red-500">Este no aparecerá en la captura.</div>
      </div>
      <button
        onClick={() => generateImage(ref, "high-quality-capture.png", ".hidden-element")}
        className="px-4 py-2 bg-green-500 text-white rounded-md"
      >
        Capturar sin elementos ocultos
      </button>
    </div>
  );
}
```
📢 **Nota**: Todos los elementos con la clase .hidden-element serán excluidos de la captura.

## 🎨 Características

* 📸 **Captura de elementos HTML** → Convierte cualquier elemento HTML en una imagen en formato PNG.
* ✂️ **Exclusión de elementos** → Permite excluir elementos específicos de la captura mediante un selector CSS.
* 🖼️ **Escalado de calidad** → Usa scale: 1.5 por defecto para mejorar la calidad de la imagen.
* ⚡ **Fácil de usar** → Solo necesitas una referencia (ref) y un botón para capturar el contenido.

## 🤝 Contribuciones
¡Las contribuciones son bienvenidas! 🎉

Si tienes ideas para mejorar este hook, puedes:

* Abrir un Issue para reportar un problema o sugerir una mejora.
* Crear un Pull Request con mejoras en el código o documentación.

## 📜 Licencia
Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](./LICENSE) para más detalles.
