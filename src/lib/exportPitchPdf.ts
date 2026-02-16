import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * Renders every slide off-screen at 1920×1080, captures it,
 * and compiles all images into a landscape PDF.
 */
export async function exportPitchPdf(
  slides: React.FC[],
  onProgress?: (current: number, total: number) => void
) {
  const { createRoot } = await import("react-dom/client");
  const { createElement } = await import("react");

  const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [1920, 1080] });

  // Create an off-screen container
  const container = document.createElement("div");
  container.style.cssText =
    "position:fixed;left:-9999px;top:0;width:1920px;height:1080px;overflow:hidden;z-index:-1;";
  document.body.appendChild(container);

  // Inner wrapper that matches the slide styling
  const wrapper = document.createElement("div");
  wrapper.className = "slide-content";
  wrapper.style.cssText =
    "width:1920px;height:1080px;background:#1A1A2E;position:relative;";
  container.appendChild(wrapper);

  for (let i = 0; i < slides.length; i++) {
    onProgress?.(i + 1, slides.length);

    // Render the slide component into the wrapper
    const root = createRoot(wrapper);
    await new Promise<void>((resolve) => {
      root.render(
        createElement(
          "div",
          {
            style: { width: 1920, height: 1080, position: "relative" },
            className: "slide-content",
          },
          createElement(slides[i])
        )
      );
      // Wait for images to load and render to settle
      setTimeout(resolve, 600);
    });

    // Capture
    const canvas = await html2canvas(wrapper, {
      width: 1920,
      height: 1080,
      scale: 2,
      backgroundColor: "#1A1A2E",
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.92);

    if (i > 0) pdf.addPage([1920, 1080], "landscape");
    pdf.addImage(imgData, "JPEG", 0, 0, 1920, 1080);

    root.unmount();
  }

  document.body.removeChild(container);

  pdf.save("autozon-investor-pitch.pdf");
}
