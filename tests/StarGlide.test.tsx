/**
 * tests/StarGlide.test.tsx
 *
 * Tests for StarGlide component (TSX).
 * - Ensures the component  throw an error when is rendered without the host container 
 * - Ensures the component is rendered *into* the host container (render(..., { container: host }))
 * - Hover (mouseMove) calls onPointerMove and updates size/rating logic
 * - Click calls onPointerClick
 * - MouseLeave calls onPointerLeave
 * - readOnly prevents hover/click callbacks
 * - staleOnClick prevents hover updates after clicking
 */

import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import StarGlide from '../src/StarGlide';

function makeHost(containerId: string) {
  const host = document.createElement('div');
  host.id = containerId;
  // attach to document.body before render so the component can find it by ID
  document.body.appendChild(host);
  return host;
}

function removeHost(host: HTMLElement | null) {
  if (!host) return;
  if (host.parentNode) host.parentNode.removeChild(host);
}

describe('StarGlide component', () => {
  beforeEach(() => {
    // ensure no leftover style tags between tests
    const existingStyle = document.getElementById('star-glide-styles-v1');
    if (existingStyle && existingStyle.parentNode) existingStyle.parentNode.removeChild(existingStyle);
  });

  afterEach(() => {
    // cleanup any hosts created during tests and reset DOM
    const hosts = document.querySelectorAll('[id^="test-stars-container"]');
    hosts.forEach(h => h.remove());
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('does not render anything when container is missing', async () => {
    // render with a containerKey that does not exist in the DOM
    const { container: rendered } = render(<StarGlide containerKey="non-existing-container" />);
    // the component returns null until it finds a container (original behavior)
    await waitFor(() => {
      expect(rendered.childElementCount).toBe(0);
    });
  });

  it('mounts and renders layers when host container exists', async () => {
    const cid = 'test-stars-container-mount';
    const host = makeHost(cid);

    // render into the host so the component's DOM is inside the host
    render(<StarGlide containerKey={cid} />, { container: host });

    // Wait for component to find container and render internal nodes
    await waitFor(() => {
      const hover = host.querySelector('.sb-hover-layer');
      const gray = host.querySelector('.sb-gray-layer');
      const gold = host.querySelector('.sb-gold-layer');
      if (!hover || !gray || !gold) throw new Error('layers not rendered yet');
      expect(hover).toBeTruthy();
      expect(gray).toBeTruthy();
      expect(gold).toBeTruthy();
    });

    removeHost(host);
  });

  it('calls onPointerMove during hover with sensible live rating', async () => {
    const cid = 'test-stars-container-hover';
    const host = makeHost(cid);

    const onMove = vi.fn();
    const maxIcons = 5;
    render(<StarGlide containerKey={cid} iconsCount={maxIcons} onPointerMove={onMove} />, { container: host });

    // wait until component renders its layers inside the host
    const hoverLayer = await waitFor(() => {
      const el = host.querySelector('.sb-hover-layer') as HTMLElement | null;
      if (!el) throw new Error('Hover layer not yet present');
      return el;
    });

    const grayLayer = host.querySelector('.sb-gray-layer') as HTMLElement;
    expect(grayLayer).toBeTruthy();

    // Provide deterministic geometry
    Object.defineProperty(hoverLayer!, 'getBoundingClientRect', {
      value: () => ({ left: 0, width: 100, top: 0, height: 10, right: 100, bottom: 10 }),
      configurable: true,
    });
    Object.defineProperty(grayLayer!, 'clientWidth', { value: 100, configurable: true });

    // Simulate mouse move in the middle (clientX = 50)
    fireEvent.mouseMove(hoverLayer!, { clientX: 50 });

    // onPointerMove should have been called
    await waitFor(() => {
      expect(onMove).toHaveBeenCalled();
      const callArg0 = onMove.mock.calls[0]?.[0]; // liveRating
      expect(typeof callArg0).toBe('number');
      expect(callArg0).toBeGreaterThan(0);
      expect(callArg0).toBeLessThanOrEqual(maxIcons);
    });

    removeHost(host);
  });

  it('calls onPointerClick when clicking the hover layer', async () => {
    const cid = 'test-stars-container-click';
    const host = makeHost(cid);

    const onClick = vi.fn();
    const maxIcons = 5;
    render(<StarGlide containerKey={cid} iconsCount={maxIcons} onPointerClick={onClick} />, { container: host });

    const hoverLayer = await waitFor(() => {
      const el = host.querySelector('.sb-hover-layer') as HTMLElement | null;
      if (!el) throw new Error('Hover layer not yet present');
      return el;
    });
    const grayLayer = host.querySelector('.sb-gray-layer') as HTMLElement;
    expect(hoverLayer).toBeTruthy();
    expect(grayLayer).toBeTruthy();

    // Provide geometry
    Object.defineProperty(hoverLayer!, 'getBoundingClientRect', {
      value: () => ({ left: 0, width: 200, top: 0, height: 10, right: 200, bottom: 10 }),
      configurable: true,
    });
    Object.defineProperty(grayLayer!, 'clientWidth', { value: 200, configurable: true });

    // Click near 25% position -> expect a small rating
    fireEvent.click(hoverLayer!, { clientX: 50 });

    await waitFor(() => {
      expect(onClick).toHaveBeenCalled();
      const calledWithRating = onClick.mock.calls[0][0];
      expect(typeof calledWithRating).toBe('number');
      expect(calledWithRating).toBeGreaterThanOrEqual(0);
      expect(calledWithRating).toBeLessThanOrEqual(maxIcons);
    });

    removeHost(host);
  });

  it('calls onPointerLeave when mouse leaves hover area', async () => {
    const cid = 'test-stars-container-leave';
    const host = makeHost(cid);

    const onLeave = vi.fn();
    render(<StarGlide containerKey={cid} onPointerLeave={onLeave} />, { container: host });

    const hoverLayer = await waitFor(() => {
      const el = host.querySelector('.sb-hover-layer') as HTMLElement | null;
      if (!el) throw new Error('Hover layer not yet present');
      return el;
    });
    expect(hoverLayer).toBeTruthy();

    // mouse leave
    fireEvent.mouseLeave(hoverLayer!);

    await waitFor(() => {
      expect(onLeave).toHaveBeenCalled();
    });

    removeHost(host);
  });

  it('does not call move/click callbacks when readOnly is true and rating non-zero', async () => {
     const cid = 'test-stars-container-readonly';
    const host = makeHost(cid);

    const onMove = vi.fn();
    const onClick = vi.fn();

    // render with rating non-zero and readOnly true
    render(
      <StarGlide containerKey={cid} readOnly={true} rating={3} onPointerMove={onMove} onPointerClick={onClick} />,
      { container: host }
    );

    // wait until layers are created
    const hoverLayer = await waitFor(() => {
      const el = host.querySelector('.sb-hover-layer') as HTMLElement | null;
      if (!el) throw new Error('Hover layer not yet present');
      return el;
    });
    const grayLayer = host.querySelector('.sb-gray-layer') as HTMLElement;
    expect(hoverLayer).toBeTruthy();
    expect(grayLayer).toBeTruthy();

    // Clear any calls that might have been invoked during mount/sizing logic
    onMove.mockClear();
    onClick.mockClear();

    Object.defineProperty(hoverLayer!, 'getBoundingClientRect', {
      value: () => ({ left: 0, width: 100, top: 0, height: 10, right: 100, bottom: 10 }),
      configurable: true,
    });
    Object.defineProperty(grayLayer!, 'clientWidth', { value: 100, configurable: true });

    fireEvent.mouseMove(hoverLayer!, { clientX: 40 });
    fireEvent.click(hoverLayer!, { clientX: 40 });

    // small wait
    await new Promise((r) => setTimeout(r, 50));

    expect(onMove).not.toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();

    removeHost(host);
  });

  it('staleOnClick prevents hover updates after clicking a value', async () => {
    const cid = 'test-stars-container-stale';
    const host = makeHost(cid);

    const onMove = vi.fn();
    const onClick = vi.fn();

    // initial currentRating = 0 (so triggerRating === currentRating initially)
    render(
      <StarGlide containerKey={cid} iconsCount={5} onPointerMove={onMove} onPointerClick={onClick} staleOnClick={true} rating={0} />,
      { container: host }
    );

    const hoverLayer = await waitFor(() => {
      const el = host.querySelector('.sb-hover-layer') as HTMLElement | null;
      if (!el) throw new Error('Hover layer not yet present');
      return el;
    });
    const grayLayer = host.querySelector('.sb-gray-layer') as HTMLElement;
    const goldLayer = host.querySelector('.sb-gold-layer') as HTMLElement;

    expect(hoverLayer).toBeTruthy();
    expect(grayLayer).toBeTruthy();
    expect(goldLayer).toBeTruthy();

    // Provide geometry for click
    Object.defineProperty(hoverLayer!, 'getBoundingClientRect', {
      value: () => ({ left: 0, width: 200, top: 0, height: 10, right: 200, bottom: 10 }),
      configurable: true,
    });
    Object.defineProperty(grayLayer!, 'clientWidth', { value: 200, configurable: true });

    // Click at position -> this should set triggerRating to a non-zero value
    fireEvent.click(hoverLayer!, { clientX: 100 }); // middle, so rating ~ 2.5
    await waitFor(() => {
      expect(onClick).toHaveBeenCalled();
    });

    // Capture goldLayer width after click (could be "0" or px). We'll assert it doesn't change after hover.
    const widthAfterClick = goldLayer.style.width;

    // Attempt to hover at a different position that would normally change live rating
    fireEvent.mouseMove(hoverLayer!, { clientX: 180 });

    // onPointerMove should NOT be called because staleOnClick true and triggerRating !== currentRating
    await new Promise((r) => setTimeout(r, 50));
    expect(onMove).not.toHaveBeenCalled();

    // goldLayer width should not have changed due to hover
    expect(goldLayer.style.width).toBe(widthAfterClick);

    removeHost(host);
  });
});
