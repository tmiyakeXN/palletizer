import type { Dims, Solution, Orientation } from '../types';
import { getOrientations } from './orientations';
import { generateAllPatterns } from './patterns';

export function solve(
  pallet: Dims,
  cargo: Dims,
  maxHeight: number
): Solution | null {
  const orientations = getOrientations(cargo);
  let bestSolution: Solution | null = null;

  for (const ori of orientations) {
    // Skip if even one layer doesn't fit
    if (ori.upH > maxHeight) continue;

    const numLayers = Math.floor(maxHeight / ori.upH);
    if (numLayers <= 0) continue;

    // Generate all pattern candidates for this orientation
    const patterns = generateAllPatterns(pallet.l, pallet.w, ori.footL, ori.footW);

    for (const pattern of patterns) {
      const count = pattern.boxes.length;
      if (count === 0) continue;

      const totalItems = count * numLayers;
      const boxVolume = cargo.l * cargo.w * cargo.h * totalItems;
      const palletVolume = pallet.l * pallet.w * maxHeight;
      const utilization = (boxVolume / palletVolume) * 100;

      if (!bestSolution || totalItems > bestSolution.totalItems) {
        bestSolution = {
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
        };
      }
    }
  }

  return bestSolution;
}

export function solveAllOrientations(
  pallet: Dims,
  cargo: Dims,
  maxHeight: number
): { orientation: Orientation; solutions: { name: string; count: number; layers: number; total: number }[] }[] {
  const orientations = getOrientations(cargo);
  const results: { orientation: Orientation; solutions: { name: string; count: number; layers: number; total: number }[] }[] = [];

  for (const ori of orientations) {
    if (ori.upH > maxHeight) continue;
    const numLayers = Math.floor(maxHeight / ori.upH);
    if (numLayers <= 0) continue;

    const patterns = generateAllPatterns(pallet.l, pallet.w, ori.footL, ori.footW);
    const sols = patterns
      .filter(p => p.boxes.length > 0)
      .map(p => ({
        name: p.name,
        count: p.boxes.length,
        layers: numLayers,
        total: p.boxes.length * numLayers,
      }))
      .sort((a, b) => b.total - a.total);

    if (sols.length > 0) {
      results.push({ orientation: ori, solutions: sols });
    }
  }

  return results;
}
