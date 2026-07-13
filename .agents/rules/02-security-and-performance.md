# Seguridad y Rendimiento

Este documento detalla las directrices de seguridad y rendimiento para la librería `useCaptureElement`.

## 1. Seguridad
* **Auditoría de dependencias**: Ejecutar de manera recurrente `pnpm audit` para mitigar cualquier riesgo de vulnerabilidad en la cadena de dependencias de terceros.
* **Elección de Dependencias**: Preferir dependencias ligeras y con baja superficie de ataque. Reemplazar `html2canvas` por `html-to-image` dado que esta última aprovecha el motor nativo de renderizado del navegador a través de SVG `<foreignObject>`, reduciendo el tamaño final y minimizando vulnerabilidades lógicas.
* **Control de Entrada del DOM**: Sanitizar los selectores y referencias pasadas por el desarrollador para evitar errores de ejecución o inyecciones inesperadas en el DOM.

## 2. Rendimiento y Bundle Size
* **Carga Bajo Demanda (Dynamic Imports)**: 
  * Paquetes de gran tamaño como `jspdf` (~250kB+) solo deben ser importados cuando el usuario solicite explícitamente una exportación en formato PDF.
  * No incluir estas librerías en la carga inicial (bundle principal) del hook.
* **Optimización de Recursos del DOM**:
  * Ocultar elementos (ej. a través de `visibility: hidden` o filtros de exclusión) de forma rápida y restaurarlos inmediatamente tras la captura para evitar impactos visibles en la interfaz de usuario (Layout Shifts).
