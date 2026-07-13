import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import React from "react";
import { useCaptureElement } from "../src/hooks/useCaptureElement";

// Mock de html-to-image
vi.mock("html-to-image", () => ({
  toPng: vi.fn().mockResolvedValue("data:image/png;base64,mockPng"),
  toJpeg: vi.fn().mockResolvedValue("data:image/jpeg;base64,mockJpeg"),
  toSvg: vi.fn().mockResolvedValue("data:image/svg+xml;base64,mockSvg"),
}));

// Mock de jspdf
const mockAddImage = vi.fn();
const mockSave = vi.fn();
vi.mock("jspdf", () => ({
  jsPDF: vi.fn().mockImplementation(() => ({
    addImage: mockAddImage,
    save: mockSave,
  })),
}));

describe("useCaptureElement", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    if (typeof window !== "undefined") {
      window.document.body.innerHTML = "";
    }
  });

  it("debe registrar un warning si se ejecuta fuera del navegador (SSR)", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    // Montamos el hook primero en entorno normal
    const { result } = renderHook(() => useCaptureElement());

    const origWindow = global.window;
    try {
      // @ts-ignore
      delete global.window;

      const dummyRef = { current: {} as HTMLElement };
      const res = await result.current.capture(dummyRef);

      expect(res).toBeNull();
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("No se puede ejecutar en el servidor")
      );
    } finally {
      global.window = origWindow;
    }

    warnSpy.mockRestore();
  });

  it("debe mostrar error si la referencia es nula", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { result } = renderHook(() => useCaptureElement());

    const res = await result.current.capture({ current: null });
    expect(res).toBeNull();
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining("Referencia al elemento DOM inválida")
    );
    errorSpy.mockRestore();
  });

  it("debe capturar en formato PNG (por defecto) y descargar el archivo", async () => {
    const { result } = renderHook(() => useCaptureElement());

    const div = document.createElement("div");
    div.innerHTML = "Contenido a capturar";
    document.body.appendChild(div);

    const ref = { current: div };

    // Mockear createElement para verificar la descarga
    const mockLink = {
      href: "",
      download: "",
      click: vi.fn(),
    } as any;
    const createSpy = vi.spyOn(document, "createElement").mockReturnValue(mockLink);
    const appendSpy = vi.spyOn(document.body, "appendChild").mockImplementation(() => mockLink);
    const removeSpy = vi.spyOn(document.body, "removeChild").mockImplementation(() => mockLink);

    await result.current.capture(ref, { fileName: "prueba.png" });

    expect(createSpy).toHaveBeenCalledWith("a");
    expect(mockLink.download).toBe("prueba.png");
    expect(mockLink.href).toBe("data:image/png;base64,mockPng");
    expect(mockLink.click).toHaveBeenCalled();

    createSpy.mockRestore();
    appendSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it("debe ocultar elementos con excludeSelector y restaurarlos tras la captura", async () => {
    const { result } = renderHook(() => useCaptureElement());

    const div = document.createElement("div");
    const childToExclude = document.createElement("span");
    childToExclude.className = "no-capture";
    childToExclude.style.display = "block";
    div.appendChild(childToExclude);
    document.body.appendChild(div);

    const ref = { current: div };

    // Interceptar html-to-image para comprobar que el elemento fue ocultado durante el proceso
    const htmlToImage = await import("html-to-image");
    const toPngSpy = vi.spyOn(htmlToImage, "toPng").mockImplementation(async () => {
      expect(childToExclude.style.display).toBe("none");
      return "data:image/png;base64,mockPng";
    });

    await result.current.capture(ref, {
      excludeSelector: ".no-capture",
    });

    expect(childToExclude.style.display).toBe("block");
    toPngSpy.mockRestore();
  });

  it("debe capturar en formato PDF utilizando jsPDF", async () => {
    const { result } = renderHook(() => useCaptureElement());

    const div = document.createElement("div");
    div.style.width = "200px";
    div.style.height = "100px";
    document.body.appendChild(div);

    const ref = { current: div };

    await result.current.capture(ref, {
      format: "pdf",
      fileName: "documento.pdf",
    });

    expect(mockAddImage).toHaveBeenCalledWith(
      "data:image/png;base64,mockPng",
      "PNG",
      0,
      0,
      div.offsetWidth,
      div.offsetHeight
    );
    expect(mockSave).toHaveBeenCalledWith("documento.pdf");
  });

  it("debe retornar el dataUrl sin iniciar descarga si download es false", async () => {
    const { result } = renderHook(() => useCaptureElement());

    const div = document.createElement("div");
    div.innerHTML = "Contenido sin descarga";
    document.body.appendChild(div);

    const ref = { current: div };

    const createSpy = vi.spyOn(document, "createElement");

    const dataUrl = await result.current.capture(ref, {
      download: false,
      format: "png",
    });

    expect(dataUrl).toBe("data:image/png;base64,mockPng");
    expect(createSpy).not.toHaveBeenCalledWith("a");

    createSpy.mockRestore();
  });

  it("debe copiar la captura al portapapeles utilizando navigator.clipboard.write", async () => {
    const { result } = renderHook(() => useCaptureElement());

    const div = document.createElement("div");
    div.innerHTML = "Contenido para portapapeles";
    document.body.appendChild(div);

    const ref = { current: div };

    const htmlToImage = await import("html-to-image");

    const mockWrite = vi.fn().mockResolvedValue(undefined);
    const origClipboard = global.navigator.clipboard;

    Object.defineProperty(global.navigator, "clipboard", {
      value: { write: mockWrite },
      writable: true,
      configurable: true,
    });

    // @ts-ignore
    global.ClipboardItem = vi.fn().mockImplementation((obj) => obj);

    // Mock de fetch para simular retorno de blob del dataUrl
    const mockBlob = new Blob(["mockBlob"], { type: "image/png" });
    const origFetch = global.fetch;
    global.fetch = vi.fn().mockResolvedValue({
      blob: () => Promise.resolve(mockBlob),
    } as any);

    const success = await result.current.copyToClipboard(ref);

    expect(success).toBe(true);
    expect(mockWrite).toHaveBeenCalled();
    expect(htmlToImage.toPng).toHaveBeenCalled();

    Object.defineProperty(global.navigator, "clipboard", {
      value: origClipboard,
      writable: true,
      configurable: true,
    });

    global.fetch = origFetch;
    // @ts-ignore
    delete global.ClipboardItem;
  });
});
