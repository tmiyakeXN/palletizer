import type { Dims, Solution } from '../types';
import { getOrientations } from './orientations';
import { generateAllPatterns } from './patterns';

export function solve(
  pallet: Dims,
  cargo: Dims,
  maxHeight: number
): Solution | null {
  const results = solveTopN(pallet, cargo, maxHeight, 1);
  return results.length > 0 ? results[0] : null;
}

export function solveTopN(
  pallet: Dims,
  cargo: Dims,
  maxHeight: number,
  n: number = 5
): Solution[] {
  const orientations = getOrientations(cargo);
  const allSolutions: Solution[] = [];
  const seen = new Set<string>();

  for (const ori of orientations) {
    if (ori.upH > maxHeight) continue;

    const numLayers = Math.floor(maxHeight / ori.upH);
    if (numLayers <= 0) continue;

    const patterns = generateAllPatterns(pallet.l, pallet.w, ori.footL, ori.footW);

    for (const pattern of patterns) {
      const count = pattern.boxes.length;
      if (count === 0) continue;

      const totalItems = count * numLayers;
      const boxVolume = cargo.l * cargo.w * cargo.h * totalItems;
      const palletVolume = pallet.l * pallet.w * maxHeight;
      const utilization = (boxVolume / palletVolume) * 100;

      // Deduplicate by count + orientation + layer height
      const key = `${count}-${ori.footL}x${ori.footW}x${ori.upH}-${pattern.name}`;
      if (seen.has(key)) continue;
      seen.add(key);

      allSolutions.push({
        layer: {
          boxes: pattern.boxes,
          layerHeight: ori.upH,
          count,
        },
        numLayers,
        totalItems,
        utilization,
        patternName: pattern.name,
        cargoOrientation: ori,
      });
    }
  }

  // Sort by total items descending, then utilization
  allSolutions.sort((a, b) => {
    if (b.totalItems !== a.totalItems) return b.totalItems - a.totalItems;
    return b.utilization - a.utilization;
  });

  // Return top N, but deduplicate solutions with the same totalItems
  // by keeping different patterns/orientations
  const results: Solution[] = [];
  const seenTotals = new Set<string>();

  for (const sol of allSolutions) {
    // Use count + layers + pattern layout as dedup key
    const layoutKey = `${sol.layer.count}-${sol.numLayers}-${sol.cargoOrientation.footL}x${sol.cargoOrientation.footW}`;
    if (seenTotals.has(layoutKey)) continue;
    seenTotals.add(layoutKey);
    results.push(sol);
    if (results.length >= n) break;
  }

  return results;
}
