# Calidad de Frontend y Evitar Sobreingeniería

Este documento contiene directrices sobre accesibilidad, SEO y el control de complejidad mediante la mentalidad `ponytail`.

## 1. Calidad del Frontend
* **Accesibilidad (a11y)**: 
  * Los elementos de control que desencadenan las capturas de pantalla deben ser totalmente accesibles mediante teclado, tener etiquetas semánticas claras (`aria-label`, `button` semánticos) y no interferir con el foco de navegación del usuario.
  * Durante el proceso de ocultar y mostrar elementos para la captura (`excludeSelector`), asegurar que no se produzcan cambios de foco permanentes ni se rompa la estructura de accesibilidad del DOM.
* **SEO**: 
  * Garantizar que las interfaces de demostración (`example-app/`) implementen etiquetas semánticas, títulos correctos y sigan las pautas de optimización web.

## 2. Evitar la Sobreingeniería (Mentalidad Ponytail)
* Escribir código minimalista y directo. Si una funcionalidad puede implementarse de manera limpia en 10 líneas, no crear abstracciones de 100 líneas.
* Evitar sobrediseñar patrones de diseño (como factories complejas de conversión) si una estructura `switch` simple o funciones utilitarias directas cumplen con creces los requerimientos.
* Mantener el tamaño de la librería bajo mínimos indispensables, abstrayendo componentes pesados hacia dependencias opcionales de carga dinámica.
