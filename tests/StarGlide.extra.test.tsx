/**
 * tests/StarGlide.extra.test.tsx
 *
 * Additional coverage tests:
 * 1) Tooltip appears when showTooltip=true.
 * 2) Custom fillColor is applied.
 * 3) disableAutoStyle=true disables style injection.
 * 4) check if iconsCount/size would exceed viewport width or height.
 */

import { render, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import StarGlide from "../src/StarGlide";

const containerId = "test-stars-container-coverage";

function makeHost() {
  const host = document.createElement("div");
  host.id = containerId;
  document.body.appendChild(host);
  return host;
}

describe("StarGlide additional props behavior", () => {
  beforeEach(() => {
    // ensure clean DOM
    const existing = document.getElementById("star-glide-styles-v1");
    if (existing && existing.parentNode)
      existing.parentNode.removeChild(existing);

    const host = document.getElementById(containerId);
    if (host) host.remove();
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("shows tooltip when showTooltip is true (on hover)", async () => {
    const host = makeHost();

    render(
      <StarGlide
        containerKey={containerId}
        rating={3.5}
        iconsCount={5}
        showTooltip={true}
      />,
      { container: host }
    );

    const hoverLayer = await waitFor(() => {
      const el = host.querySelector(".sb-hover-layer") as HTMLElement | null;
      if (!el) throw new Error("Hover layer not present");
      return el;
    });

    // Trigger hover to show overlay tooltip (react-bootstrap overlay)
    fireEvent.mouseOver(hoverLayer);

    // Wait for the tooltip to appear in the document (portal)
    const tooltip = await waitFor(() => {
      const node = document.querySelector(
        '[role="tooltip"]'
      ) as HTMLElement | null;
      if (!node) throw new Error("Tooltip not found yet");
      return node;
    });

    expect(tooltip).toBeTruthy();
    expect(tooltip.textContent).toContain("3.5");

    // Now hide the tooltip before the test ends so react-bootstrap can remove its portal node
    fireEvent.mouseLeave(hoverLayer);

    // Wait for the tooltip to be removed from the document
    await waitFor(() => {
      const node = document.querySelector('[role="tooltip"]');
      if (node) throw new Error("Tooltip still present");
      return true;
    });
  });

  it('applies known fillColor key (e.g., "green") causing a non-empty filter on gold layer', async () => {
    const host = makeHost();

    render(<StarGlide containerKey={containerId} fillColor="green" />, {
      container: host,
    });

    const goldLayer = await waitFor(() => {
      const el = host.querySelector(".sb-gold-layer") as HTMLElement | null;
      if (!el) throw new Error("Gold layer not present");
      return el;
    });

    // Wait briefly for styles/filters to be applied by effects
    await new Promise((r) => setTimeout(r, 20));

    // Expect the gold layer's style.filter was set (component maps known colors to CSS filter strings)
    expect(goldLayer.style.filter).toBeTruthy();
    expect(goldLayer.style.filter.length).toBeGreaterThan(0);
  });

  it("does not auto-inject styles when disableAutoStyle is true", async () => {
    const host = makeHost();

    render(<StarGlide containerKey={containerId} disableAutoStyle={true} />, {
      container: host,
    });

    // Wait a tick to allow effects to run if any
    await new Promise((r) => setTimeout(r, 20));

    const injectedStyle = document.getElementById("star-glide-styles-v1");
    expect(injectedStyle).toBeNull();
  });
  it("logs an error when iconsCount/size would exceed viewport width or height", async () => {
    const host = makeHost();
    // Spy console.log to capture the logged Error
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    // Save original viewport sizes to restore later
    const origInnerWidth = window.innerWidth;
    const origInnerHeight = window.innerHeight;

    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.innerWidth = 80;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.innerHeight = 60;

      // Render with a very large size to force exceedVPWidth/exceedVPHeight
      // size x iconsCount will be larger than innerWidth / innerHeight
      render(
        <StarGlide
          containerKey={containerId}
          iconsCount={5}
          size={100} // large size -> newWidthStars will exceed innerWidth
        />,
        { container: host }
      );

      // wait for effects to run and for the component to (caught) throw and log
      await new Promise((r) => setTimeout(r, 50));

      // Expect console.log to have been called with an Error object that contains the width message
      expect(consoleSpy).toHaveBeenCalled();

      const firstArg = consoleSpy.mock.calls[0][0];
      // The component logs an Error instance; check message contents
      expect(firstArg).toBeInstanceOf(Error);
      expect(firstArg.message).toEqual(
        expect.stringMatching(/of your stars container must not exceed/i)
      );
    } finally {
      // restore
      consoleSpy.mockRestore();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.innerWidth = origInnerWidth;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.innerHeight = origInnerHeight;
      host.remove();
    }
  });
});
