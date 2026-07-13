# Arquitectura y Estructura del Proyecto

Este documento establece las reglas de arquitectura para el monorepo `useCaptureElement`.

## 1. Estructura de Monorepo
* El proyecto utiliza **pnpm workspaces** para gestionar de forma independiente la librería (`library/`) y la aplicación de demostración (`example-app/`).
* Las dependencias compartidas se deben declarar de forma adecuada en cada paquete. Para dependencias locales del workspace, usar la sintaxis `"workspace:*"`.

## 2. Compatibilidad con Next.js y SSR (Server-Side Rendering)
* El hook `useCaptureElement` debe ser **SSR-ready**. Dado que las dependencias de captura del DOM (como `html-to-image` o `jspdf`) acceden a APIs del navegador (`window`, `document`, `HTMLElement`), estas **no deben ser importadas de forma estática en la raíz del archivo**.
* Las dependencias del navegador deben ser **importadas dinámicamente** en el momento de la ejecución de la función callback:
  ```typescript
  const { toPng } = await import('html-to-image');
  ```
* Proteger cualquier acceso directo a variables globales del cliente mediante:
  ```typescript
  if (typeof window === 'undefined') return;
  ```

## 3. Modularización del Hook
* Mantener el archivo principal del hook (`useCaptureElement.tsx`) limpio y legible.
* Delegar la lógica compleja de transformación de formatos (por ejemplo, configuración del canvas, generación del blob, empaquetado del PDF o SVG) a funciones utilitarias en un archivo auxiliar (ej. `utils.ts`).

## 4. Commits y Mensajes de Control de Versión
* Todos los commits deben seguir estrictamente el estándar de **Conventional Commits 1.0.0** y estar escritos en **español**.
