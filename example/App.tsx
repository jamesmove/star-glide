/* eslint-disable import/no-unresolved */
import { useState, useEffect } from "react";
import StarGlide from "@/StarGlide";
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
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="display-7 mb-1 fw-bold">StarGlide</h1>
            <a
              href="https://github.com/j9mes-lloyd/star-glide"
              rel={"noreferrer"}
              aria-label="Visit GitHub repository"
              title="Visit GitHub repository"
              target="_blank"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
              </svg>
            </a>
          </div>
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
                setFixedRating(2.4);
                setFinal(3);
                setSize(28);
                setIconsCount(5);
                setFillColor("gold");
                setStaleOnClick(false);
                setReadOnly(false);
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
                <div className="text-live">
                  <div className="small text-muted">Live value</div>
                  <div className="h5 mb-0">{Number(live).toFixed(1)}</div>
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
                    onPointerClick={(v) => {
                      setFinal(v);
                      setFixedRating(v);
                    }}
                  />
                </div>
              </div>

              <div className="mt-3 d-flex gap-3 flex-wrap">
                <div className="me-3">
                  <small className="text-muted">Final rating:</small>
                  <div className="fw-bold">{Number(final).toFixed(1)}</div>
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
                        1
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
                    // setFinal(rnd);
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
        StarGlide — Fractional star ratings • MIT Licensed © 2025{" "}
        <a
          href="https://changebyweb.com"
          rel="noreferrer"
          aria-label="Visit James Move Portfolio"
          title="Visit James Move Portfolio"
          target="_blank"
        >
          James Move
        </a>
      </footer>
    </div>
  );
}
