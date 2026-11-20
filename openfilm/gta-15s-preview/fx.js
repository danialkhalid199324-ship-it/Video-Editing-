// Shared helpers for the GTA graphics pages: every picture is a function of t alone.
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const prog = (t, start, dur) => clamp((t - start) / dur);
export const easeOut = (p) => 1 - Math.pow(1 - p, 3);
export const easeIn = (p) => p * p * p;
export const easeOutBack = (p, s = 1.6) => 1 + (s + 1) * Math.pow(p - 1, 3) + s * Math.pow(p - 1, 2);
export const fontsReady = () => document.fonts.ready;
