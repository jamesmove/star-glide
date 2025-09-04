/* eslint-disable import/no-unresolved */
import { useState, useEffect } from "react";
/**
 * Important:
 * - We import the library source directly from src using the '@' alias configured in vite.config.ts:
 *    import StarGlide from '@/StarGlide'
 * - The vite config we set earlier resolves '@' -> ./src
 *
 * If your vite config doesn't define '@' alias, replace the import with:
 *    import StarGlide from '../src/StarGlide'
 */
import StarGlide from "@/StarGlide";
import "@/styles/star-glide.css"; // optional - import library CSS manually (if disableAutoStyle is used)

// export default function App() {
//   // live value updated during hover or click
//   const [live, setLive] = useState<number>(2.4);
//   const [final, setFinal] = useState<number>(3);
//   const [readOnly, setReadOnly] = useState<boolean>(false);

//   return (
//     <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
//       <h1>StarGlide — Complete Playground</h1>
//       <section style={{ marginBottom: 24 }}>
//         <h2>Basic (auto styles, fractional hover)</h2>
//         <div id="host-basic" style={{ margin: "8px 0" }}>
//           <StarGlide
//             containerKey="host-basic"
//             rating={live}
//             iconsCount={5}
//             size={28}
//             fillColor="orange"
//             onPointerMove={(v) => setLive(v)}
//             onPointerClick={(v) => setFinal(v)}
//           />
//         </div>
//         <div style={{ marginTop: 8 }}>
//           Live: {live.toFixed(2)} • Final: {final.toFixed(2)}
//         </div>
//       </section>{" "}

//       <section style={{ marginBottom: 24 }}>
//         <h2>Tooltip off / transition on</h2>
//         <div id="host-tooltip" style={{ margin: "8px 0" }}>
//           <StarGlide
//             containerKey="host-tooltip"
//             rating={1.2}
//             iconsCount={5}
//             size={28}
//             showTooltip={false}
//             transition
//           />
//         </div>
//          <div style={{ marginTop: 8 }}>Transition on, make the hover more slow</div>
//       </section>

//       <section style={{ marginBottom: 24 }}>
//         <h2>Large stars / more icons</h2>
//         <div id="host-large" style={{ margin: "8px 0" }}>
//           <StarGlide
//             containerKey="host-large"
//             rating={1.2}
//             iconsCount={8}
//             size={36}
//             fillColor="purple"
//             showTooltip
//           />
//         </div>
//         <div style={{ marginTop: 8 }}>8 icons, size 36px</div>
//       </section>
//       <section style={{ marginBottom: 24 }}>
//         <h2>ReadOnly / staleOnClick behaviors</h2>
//         <div style={{ marginBottom: 8 }}>
//           <button
//             className="btn btn-outline-primary"
//             onClick={() => setReadOnly((s) => !s)}
//           >
//             Toggle readOnly ({String(readOnly)})
//           </button>
//         </div>

//         <div id="host-readonly" style={{ margin: "8px 0" }}>
//           <StarGlide
//             containerKey="host-readonly"
//             rating={2.5}
//             readOnly={readOnly}
//             showTooltip
//             size={20}
//           />
//         </div>
//         <div id="host-stale" style={{ marginTop: 12 }}>
//           <StarGlide
//             containerKey="host-stale"
//             rating={0}
//             staleOnClick
//             showTooltip
//             size={20}
//             onPointerClick={(r) => alert("Clicked rating: " + r.toFixed(2))}
//           />
//         </div>
//         <div style={{ marginTop: 8 }}>
//           StaleOnClick: click to set rating, subsequent hovers {"won't"} change
//           it.
//         </div>
//       </section>
//       <section style={{ marginBottom: 24 }}>
//         <h2>Manual CSS import (disableAutoStyle)</h2>
//         <div id="host-manual" style={{ margin: "8px 0" }}>
//           <StarGlide
//             containerKey="host-manual"
//             rating={4.5}
//             disableAutoStyle={true}
//             showTooltip
//             size={20}
//           />
//         </div>
//         <div style={{ marginTop: 8 }}>
//           Here we imported the CSS manually at the top of the file.
//         </div>
//       </section>
//       <section>
//         <h2>Multiple instances on same page</h2>
//         <div id="host-a" style={{ margin: "8px 0" }}>
//           <StarGlide containerKey="host-a" rating={1.8} size={20} />
//         </div>
//         <div id="host-b" style={{ margin: "8px 0" }}>
//           <StarGlide containerKey="host-b" rating={4.2} size={20} />
//         </div>
//         <div style={{ marginTop: 8 }}>
//           Styles are injected only once even with multiple instances.
//         </div>
//       </section>
//     </div>
//   );
// }

import { ensureStyles } from "@/utils/ensureStyles";
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * A responsive, attractive playground demonstrating the main props and use cases.
 * Uses Bootstrap for quick, pleasant styling.
 */

const palette = [
  "gold", // gold
  "black", // black
  "orange", // orange
  "green", // green
  "blue", // blue
  "purple", // purple
  "red", // red
  "yellow", // yellow
];
const paletteLabels: Record<string, string> = {
  gold: "Gold",
  black: "Black",
  orange: "Orange",
  green: "Green",
  blue: "Blue",
  purple: "Purple",
  red: "Red",
  yellow: "Yellow",
};

export default function App(): JSX.Element {
  // central live values
  const [live, setLive] = useState<number>(2.4);
  const [fixedRating, setFixedRating] = useState<number>(2.4);
  const [final, setFinal] = useState<number>(3);
  const [size, setSize] = useState<number>(28);
  const [iconsCount, setIconsCount] = useState<number>(5);
  const [fillColor, setFillColor] = useState<string>("gold");
  const [readOnly, setReadOnly] = useState<boolean>(false);
  const [staleOnClick, setStaleOnClick] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(true);
  const [disableAutoStyle, setDisableAutoStyle] = useState<boolean>(false);

  // ensure styles once (no-op when already injected)
  useEffect(() => {
    if (!disableAutoStyle) ensureStyles();
  }, [disableAutoStyle]);

  // convenience host ids
  const hostIdMain = "sg-host-main";
  const hostIdPreview = "sg-host-preview";
  const hostIdManual = "sg-host-manual";

  // ensure host elements exist in DOM before components mount:
  useEffect(() => {
    [hostIdMain, hostIdPreview, hostIdManual].forEach((id) => {
      if (!document.getElementById(id)) {
        const div = document.createElement("div");
        div.id = id;
        // small wrapper so layout doesn't break
        const wrapper = document.getElementById("sg-hosts-wrapper");
        if (wrapper) wrapper.appendChild(div);
        else document.body.appendChild(div);
      }
    });
    // cleanup not needed for this example
  }, []);

  return (
    <div
      className="container py-4"
      style={{
        fontFamily:
          "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      }}
    >
      <div className="row align-items-center mb-3">
        <div className="col-md-8">
          <h1 className="display-6 mb-1">StarGlide — Playground</h1>
          <p className="text-muted mb-0">
            Smooth fractional hover ratings — try moving your pointer over the
            stars to see live fractional values.
          </p>
        </div>
        <div className="col-md-4 text-md-end mt-3 mt-md-0">
          <div className="d-inline-flex gap-2">
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                setReadOnly((v) => !v);
              }}
            >
              {readOnly ? "ReadOnly: ON" : "ReadOnly: OFF"}
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                // reset to defaults
                setLive(2.4);
                setFinal(3);
                setSize(28);
                setIconsCount(5);
                setFillColor("gold");
                setStaleOnClick(false);
                setShowTooltip(true);
                setDisableAutoStyle(false);
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-lg-8">
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap">
                <div>
                  <h5 className="card-title mb-1">Main example</h5>
                  <p className="text-muted small mb-0">
                    Live preview with controls below — host container is created
                    for you.
                  </p>
                </div>
                <div className="text-end">
                  <div className="small text-muted">Live value</div>
                  <div className="h5 mb-0">{Number(live).toFixed(2)}</div>
                </div>
              </div>

              <div id="sg-hosts-wrapper" className="mb-3">
                <div id={hostIdMain} style={{ marginBottom: 12 }}>
                  <StarGlide
                    containerKey={hostIdMain}
                    rating={fixedRating}
                    iconsCount={iconsCount}
                    size={size}
                    fillColor={fillColor}
                    showTooltip={showTooltip}
                    readOnly={readOnly}
                    staleOnClick={staleOnClick}
                    onPointerMove={(v) => setLive(v)}
                    onPointerClick={(v) => setFinal(v)}
                  />
                </div>
              </div>

              <div className="mt-3 d-flex gap-3 flex-wrap">
                <div className="me-3">
                  <small className="text-muted">Final rating:</small>
                  <div className="fw-bold">{Number(final).toFixed(2)}</div>
                </div>

                <div>
                  <small className="text-muted">Icons</small>
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <input
                      className="form-range"
                      type="range"
                      min={1}
                      max={12}
                      value={iconsCount}
                      onChange={(e) => setIconsCount(Number(e.target.value))}
                      style={{ width: 140 }}
                    />
                    <div className="badge bg-light text-dark">{iconsCount}</div>
                  </div>
                </div>

                <div>
                  <small className="text-muted">Size (px)</small>
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <input
                      className="form-range"
                      type="range"
                      min={12}
                      max={60}
                      value={size}
                      onChange={(e) => {
                        setSize(Number(e.target.value));
                      }}
                      style={{ width: 140 }}
                    />
                    <div className="badge bg-light text-dark">{size}px</div>
                  </div>
                </div>

                <div>
                  <small className="text-muted">Color</small>
             
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <select
                      className="form-select form-select-sm"
                      value={fillColor}
                      onChange={(e) => setFillColor(e.target.value)}
                      style={{ width: 160 }}
                      aria-label="Select star fill color"
                    >
                      {palette.map((c) => (
                        <option key={c} value={c}>
                          {paletteLabels[c] ?? c}
                        </option>
                      ))}
                    </select>

                    <div
                      aria-hidden
                      title={fillColor}
                      style={{
                        width: 32,
                        height: 28,
                        borderRadius: 6,
                        border: "1px solid rgba(0,0,0,0.12)",
                        background: fillColor,
                        boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                      }}
                    />
                    <div
                      className="ms-2 small text-muted"
                      style={{ minWidth: 64 }}
                    >
                      {paletteLabels[fillColor] ?? fillColor}
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <div className="form-check form-switch ms-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={staleOnClick}
                      id="staleOnClickSwitch"
                      onChange={(e) => setStaleOnClick(e.target.checked)}
                    />
                    <label
                      className="form-check-label small"
                      htmlFor="staleOnClickSwitch"
                    >
                      staleOnClick
                    </label>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <div className="form-check form-switch ms-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={showTooltip}
                      id="showTooltipSwitch"
                      onChange={(e) => setShowTooltip(e.target.checked)}
                    />
                    <label
                      className="form-check-label small"
                      htmlFor="showTooltipSwitch"
                    >
                      showTooltip
                    </label>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <div className="form-check form-switch ms-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={disableAutoStyle}
                      id="disableAutoStyleSwitch"
                      onChange={(e) => setDisableAutoStyle(e.target.checked)}
                    />
                    <label
                      className="form-check-label small"
                      htmlFor="disableAutoStyleSwitch"
                    >
                      disableAutoStyle
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview / manual import card */}
          <div className="row g-3 mb-3">
            <div className="col-sm-6">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h6 className="card-title">
                    Preview with different icon set
                  </h6>
                  <div id={hostIdPreview} style={{ marginBottom: 12 }}>
                    <StarGlide
                      containerKey={hostIdPreview}
                      rating={4.2}
                      iconsCount={8}
                      size={Math.max(20, Math.min(40, Math.round(size * 0.9)))}
                      fillColor={palette[(iconsCount - 1) % palette.length]}
                      showTooltip
                    />
                  </div>
                  <p className="small text-muted mt-2">
                    8 icons preview. Responsive size based on control.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h6 className="card-title">Manual CSS import example</h6>
                  <p className="small text-muted">
                    This instance uses `disableAutoStyle={"true"}` and relies on
                    manual import at top of file.
                  </p>
                  <div id={hostIdManual} style={{ marginBottom: 12 }}>
                    <StarGlide
                      containerKey={hostIdManual}
                      rating={3.8}
                      disableAutoStyle={true}
                      showTooltip
                    />
                  </div>
                  <div className="mt-2 small">
                    Styles were imported manually at the top of this file.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          <div className="card sticky-top" style={{ top: 18 }}>
            <div className="card-body">
              <h6 className="card-title">Quick tips</h6>
              <ul className="list-unstyled small mb-2">
                <li>
                  • Create the host element before rendering the component
                  (example does this).
                </li>
                <li>
                  • If icons overflow viewport, StarGlide will log an error and
                  fall back to safe dimensions.
                </li>
                <li>
                  • Use `disableAutoStyle` if you want to manage CSS yourself.
                </li>
              </ul>

              <div className="mb-3">
                <label className="form-label small">Demo screen width</label>
                <div className="progress" style={{ height: 8 }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${Math.min(
                        100,
                        ((size * iconsCount) / window.innerWidth) * 100
                      )}%`,
                    }}
                  />
                </div>
                <small className="text-muted">
                  Indicator shows proportion of (size × iconsCount) vs viewport
                  width
                </small>
              </div>

              <div className="d-grid gap-2">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    // Quick sample: open an alert with current values
                    alert(
                      `Live: ${live.toFixed(
                        2
                      )} / Icons: ${iconsCount} / Size: ${size}px`
                    );
                  }}
                >
                  Inspect current
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    // quick simulate: set random rating
                    const rnd =
                      Math.round(Math.random() * iconsCount * 10) / 10;
                    setFixedRating(rnd);
                    setLive(rnd);
                    setFinal(rnd);
                  }}
                >
                  Random rating
                </button>
              </div>

              <div className="mt-3 small text-muted">
                StarGlide is a library component. To test this playground
                locally use the dev server (available only in the repo).
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center text-muted small mt-4">
        StarGlide — fractional star ratings • Try multiple instances, responsive
        controls and manual CSS import.
      </footer>
    </div>
  );
}
