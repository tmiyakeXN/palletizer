import type { Dims, Orientation } from '../types';

export function getOrientations(box: Dims): Orientation[] {
  const candidates: Orientation[] = [
    { footL: box.l, footW: box.w, upH: box.h },
    { footL: box.w, footW: box.l, upH: box.h },
    { footL: box.l, footW: box.h, upH: box.w },
    { footL: box.h, footW: box.l, upH: box.w },
    { footL: box.w, footW: box.h, upH: box.l },
    { footL: box.h, footW: box.w, upH: box.l },
  ];

  // Deduplicate
  const seen = new Set<string>();
  const unique: Orientation[] = [];
  for (const o of candidates) {
    const key = `${o.footL},${o.footW},${o.upH}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(o);
    }
  }
  return unique;
}
