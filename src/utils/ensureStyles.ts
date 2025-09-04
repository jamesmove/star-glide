/* eslint-disable import/no-unresolved */
// // src/utils/ensureStyles.ts
// import css from '../styles/star-glide.css';

// const STYLE_ID = 'star-glide-styles-v1';

// /**
//  * Inject CSS into the document head exactly once.
//  * Safe for SSR (no-op when `document` is undefined).
//  */
// export function ensureStyles() {
//   if (typeof document === 'undefined') return;
//   if (document.getElementById(STYLE_ID)) return;
//   const el = document.createElement('style');
//   el.id = STYLE_ID;
//   el.textContent = css.toString();
//   document.head.appendChild(el);
// }
let stylesInjected = false;

export function ensureStyles() {
  if (stylesInjected) return;  // ✅ Stops if already injected
  import('@/styles/star-glide.css'); // ✅ Loads CSS only once
  stylesInjected = true;
}