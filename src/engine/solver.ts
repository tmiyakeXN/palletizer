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

  // Max height for cargo = total max height minus pallet height
  const cargoMaxHeight = maxHeight - pallet.h;
  if (cargoMaxHeight <= 0) return [];

  // Step 1: Find the best orientation (the one that yields the most items)
  let bestOri = null;
  let bestCount = 0;
  let bestNumLayers = 0;

  for (const ori of orientations) {
    if (ori.upH > cargoMaxHeight) continue;
    const numLayers = Math.floor(cargoMaxHeight / ori.upH);
    if (numLayers <= 0) continue;

    const patterns = generateAllPatterns(pallet.l, pallet.w, ori.footL, ori.footW);
    for (const pattern of patterns) {
      const total = pattern.boxes.length * numLayers;
      if (total > bestCount) {
        bestCount = total;
        bestOri = ori;
        bestNumLayers = numLayers;
      }
    }
  }

  if (!bestOri) return [];

  // Step 2: Using the best orientation, collect all distinct layout patterns
  const patterns = generateAllPatterns(pallet.l, pallet.w, bestOri.footL, bestOri.footW);
  const numLayers = bestNumLayers;

  const candidates: Solution[] = [];
  const seenCounts = new Set<number>();

  for (const pattern of patterns) {
    const count = pattern.boxes.length;
    if (count === 0) continue;

    // Deduplicate patterns that yield the same number of boxes per layer
    if (seenCounts.has(count)) continue;
    seenCounts.add(count);

    const totalItems = count * numLayers;
    const boxVolume = cargo.l * cargo.w * cargo.h * totalItems;
    const palletVolume = pallet.l * pallet.w * cargoMaxHeight;
    const utilization = (boxVolume / palletVolume) * 100;

    candidates.push({
      layer: {
        boxes: pattern.boxes,
        layerHeight: bestOri.upH,
        count,
      },
      numLayers,
      totalItems,
      utilization,
      patternName: pattern.name,
      cargoOrientation: bestOri,
    });
  }

  // Sort by total items descending
  candidates.sort((a, b) => b.totalItems - a.totalItems);

  // Return top N
  return candidates.slice(0, n);
}
