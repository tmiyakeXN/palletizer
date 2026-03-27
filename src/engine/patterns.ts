import type { PlacedBox } from '../types';

type PatternFn = (pL: number, pW: number, bL: number, bW: number) => PlacedBox[];

function makeBox(x: number, y: number, boxL: number, boxW: number, rotated: boolean): PlacedBox {
  return { x, y, boxL, boxW, rotated };
}

// Pattern 1: Uniform grid - all boxes same orientation
function uniformGrid(pL: number, pW: number, bL: number, bW: number): PlacedBox[] {
  const boxes: PlacedBox[] = [];
  const cols = Math.floor(pL / bL);
  const rows = Math.floor(pW / bW);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      boxes.push(makeBox(c * bL, r * bW, bL, bW, false));
    }
  }
  return boxes;
}

// Pattern 2-3: Two-section horizontal split
// Top section uses (bL x bW), bottom section uses (bW x bL)
function twoSectionH(pL: number, pW: number, bL: number, bW: number): PlacedBox[] {
  if (bL === bW) return uniformGrid(pL, pW, bL, bW);

  let best: PlacedBox[] = [];

  // Try splitting after each possible row of bW height
  const maxTopRows = Math.floor(pW / bW);
  for (let topRows = 1; topRows < maxTopRows; topRows++) {
    const topHeight = topRows * bW;
    const bottomHeight = pW - topHeight;

    // Top: bL x bW
    const topBoxes: PlacedBox[] = [];
    const topCols = Math.floor(pL / bL);
    for (let r = 0; r < topRows; r++) {
      for (let c = 0; c < topCols; c++) {
        topBoxes.push(makeBox(c * bL, r * bW, bL, bW, false));
      }
    }

    // Bottom: bW x bL (rotated)
    const bottomCols = Math.floor(pL / bW);
    const bottomRows = Math.floor(bottomHeight / bL);
    const bottomBoxes: PlacedBox[] = [];
    for (let r = 0; r < bottomRows; r++) {
      for (let c = 0; c < bottomCols; c++) {
        bottomBoxes.push(makeBox(c * bW, topHeight + r * bL, bW, bL, true));
      }
    }

    const combined = [...topBoxes, ...bottomBoxes];
    if (combined.length > best.length) best = combined;
  }

  // Also try splitting by bL rows on top, bW x bL rows on bottom
  const maxTopRows2 = Math.floor(pW / bL);
  for (let topRows = 1; topRows < maxTopRows2; topRows++) {
    const topHeight = topRows * bL;
    const bottomHeight = pW - topHeight;

    const topBoxes: PlacedBox[] = [];
    const topCols = Math.floor(pL / bW);
    for (let r = 0; r < topRows; r++) {
      for (let c = 0; c < topCols; c++) {
        topBoxes.push(makeBox(c * bW, r * bL, bW, bL, true));
      }
    }

    const bottomCols = Math.floor(pL / bL);
    const bottomRows2 = Math.floor(bottomHeight / bW);
    const bottomBoxes: PlacedBox[] = [];
    for (let r = 0; r < bottomRows2; r++) {
      for (let c = 0; c < bottomCols; c++) {
        bottomBoxes.push(makeBox(c * bL, topHeight + r * bW, bL, bW, false));
      }
    }

    const combined = [...topBoxes, ...bottomBoxes];
    if (combined.length > best.length) best = combined;
  }

  return best;
}

// Pattern 4-5: Two-section vertical split
function twoSectionV(pL: number, pW: number, bL: number, bW: number): PlacedBox[] {
  if (bL === bW) return uniformGrid(pL, pW, bL, bW);

  let best: PlacedBox[] = [];

  const maxLeftCols = Math.floor(pL / bL);
  for (let leftCols = 1; leftCols < maxLeftCols; leftCols++) {
    const leftWidth = leftCols * bL;
    const rightWidth = pL - leftWidth;

    const leftBoxes: PlacedBox[] = [];
    const leftRows = Math.floor(pW / bW);
    for (let r = 0; r < leftRows; r++) {
      for (let c = 0; c < leftCols; c++) {
        leftBoxes.push(makeBox(c * bL, r * bW, bL, bW, false));
      }
    }

    const rightCols = Math.floor(rightWidth / bW);
    const rightRows = Math.floor(pW / bL);
    const rightBoxes: PlacedBox[] = [];
    for (let r = 0; r < rightRows; r++) {
      for (let c = 0; c < rightCols; c++) {
        rightBoxes.push(makeBox(leftWidth + c * bW, r * bL, bW, bL, true));
      }
    }

    const combined = [...leftBoxes, ...rightBoxes];
    if (combined.length > best.length) best = combined;
  }

  const maxLeftCols2 = Math.floor(pL / bW);
  for (let leftCols = 1; leftCols < maxLeftCols2; leftCols++) {
    const leftWidth = leftCols * bW;
    const rightWidth = pL - leftWidth;

    const leftBoxes: PlacedBox[] = [];
    const leftRows = Math.floor(pW / bL);
    for (let r = 0; r < leftRows; r++) {
      for (let c = 0; c < leftCols; c++) {
        leftBoxes.push(makeBox(c * bW, r * bL, bW, bL, true));
      }
    }

    const rightCols = Math.floor(rightWidth / bL);
    const rightRows = Math.floor(pW / bW);
    const rightBoxes: PlacedBox[] = [];
    for (let r = 0; r < rightRows; r++) {
      for (let c = 0; c < rightCols; c++) {
        rightBoxes.push(makeBox(leftWidth + c * bL, r * bW, bL, bW, false));
      }
    }

    const combined = [...leftBoxes, ...rightBoxes];
    if (combined.length > best.length) best = combined;
  }

  return best;
}

// Pattern 6-8: Pinwheel arrangement
function pinwheel(pL: number, pW: number, bL: number, bW: number): PlacedBox[] {
  if (bL === bW) return uniformGrid(pL, pW, bL, bW);
  if (pL < bL + bW || pW < bL + bW) return uniformGrid(pL, pW, bL, bW);

  const boxes: PlacedBox[] = [];

  // Top strip: boxes oriented bL along x, bW along y
  const topCols = Math.floor((pL - bW) / bL);
  for (let c = 0; c < topCols; c++) {
    boxes.push(makeBox(c * bL, 0, bL, bW, false));
  }

  // Right strip: boxes oriented bW along x, bL along y
  const rightX = pL - bW;
  const rightRows = Math.floor((pW - bW) / bL);
  for (let r = 0; r < rightRows; r++) {
    boxes.push(makeBox(rightX, r * bL, bW, bL, true));
  }

  // Bottom strip: boxes oriented bL along x, bW along y (from right)
  const bottomY = pW - bW;
  const bottomCols = Math.floor((pL - bW) / bL);
  for (let c = 0; c < bottomCols; c++) {
    boxes.push(makeBox(bW + c * bL, bottomY, bL, bW, false));
  }

  // Left strip: boxes oriented bW along x, bL along y
  const leftRows = Math.floor((pW - bW) / bL);
  for (let r = 0; r < leftRows; r++) {
    boxes.push(makeBox(0, bW + r * bL, bW, bL, true));
  }

  // Fill center with uniform grid
  const centerL = pL - 2 * bW;
  const centerW = pW - 2 * bW;
  if (centerL > 0 && centerW > 0) {
    // Try both orientations for center
    const centerA = uniformGrid(centerL, centerW, bL, bW);
    const centerB = uniformGrid(centerL, centerW, bW, bL);
    const bestCenter = centerA.length >= centerB.length ? centerA : centerB;
    const isRotated = centerA.length >= centerB.length ? false : true;
    for (const b of bestCenter) {
      boxes.push(makeBox(bW + b.x, bW + b.y, b.boxL, b.boxW, isRotated ? !b.rotated : b.rotated));
    }
  }

  return boxes;
}

// Pattern 9-10: Brick horizontal (offset rows)
function brickH(pL: number, pW: number, bL: number, bW: number): PlacedBox[] {
  const boxes: PlacedBox[] = [];
  const rows = Math.floor(pW / bW);

  for (let r = 0; r < rows; r++) {
    const rowStart = (r % 2 === 1) ? bL / 2 : 0;
    let cx = rowStart;
    while (cx + bL <= pL) {
      boxes.push(makeBox(cx, r * bW, bL, bW, false));
      cx += bL;
    }
    // Try placing a box at the very start if offset
    if (r % 2 === 1 && bL / 2 > 0 && rowStart > 0) {
      // Check if a box fits at position 0 (it will stick out left - no, clip it)
      // In brick pattern, we just accept fewer boxes in offset rows
    }
  }

  return boxes;
}

// Brick vertical (offset columns)
function brickV(pL: number, pW: number, bL: number, bW: number): PlacedBox[] {
  const boxes: PlacedBox[] = [];
  const cols = Math.floor(pL / bL);

  for (let c = 0; c < cols; c++) {
    const offset = (c % 2 === 1) ? bW / 2 : 0;
    let cy = offset;
    while (cy + bW <= pW) {
      boxes.push(makeBox(c * bL, cy, bL, bW, false));
      cy += bW;
    }
  }

  return boxes;
}

// Pattern 11, 16-18: Grid with horizontal remainder
// Main area filled with bL x bW, horizontal remainder strip filled with rotated boxes
function gridWithRemainderH(pL: number, pW: number, bL: number, bW: number): PlacedBox[] {
  if (bL === bW) return uniformGrid(pL, pW, bL, bW);

  let best: PlacedBox[] = [];

  // Main grid: bL x bW, remainder strip at bottom filled with bW x bL
  const mainRows = Math.floor(pW / bW);
  const mainHeight = mainRows * bW;
  const remainderH = pW - mainHeight;

  const mainBoxes: PlacedBox[] = [];
  const mainCols = Math.floor(pL / bL);
  for (let r = 0; r < mainRows; r++) {
    for (let c = 0; c < mainCols; c++) {
      mainBoxes.push(makeBox(c * bL, r * bW, bL, bW, false));
    }
  }

  // Fill remainder with rotated boxes
  const remBoxes: PlacedBox[] = [];
  if (remainderH >= bL) {
    const remCols = Math.floor(pL / bW);
    const remRows = Math.floor(remainderH / bL);
    for (let r = 0; r < remRows; r++) {
      for (let c = 0; c < remCols; c++) {
        remBoxes.push(makeBox(c * bW, mainHeight + r * bL, bW, bL, true));
      }
    }
  }

  best = [...mainBoxes, ...remBoxes];

  // Also try: main grid bW x bL, remainder with bL x bW
  const mainRows2 = Math.floor(pW / bL);
  const mainHeight2 = mainRows2 * bL;
  const remainderH2 = pW - mainHeight2;

  const mainBoxes2: PlacedBox[] = [];
  const mainCols2 = Math.floor(pL / bW);
  for (let r = 0; r < mainRows2; r++) {
    for (let c = 0; c < mainCols2; c++) {
      mainBoxes2.push(makeBox(c * bW, r * bL, bW, bL, true));
    }
  }

  const remBoxes2: PlacedBox[] = [];
  if (remainderH2 >= bW) {
    const remCols2 = Math.floor(pL / bL);
    const remRows2 = Math.floor(remainderH2 / bW);
    for (let r = 0; r < remRows2; r++) {
      for (let c = 0; c < remCols2; c++) {
        remBoxes2.push(makeBox(c * bL, mainHeight2 + r * bW, bL, bW, false));
      }
    }
  }

  const candidate2 = [...mainBoxes2, ...remBoxes2];
  if (candidate2.length > best.length) best = candidate2;

  return best;
}

// Grid with vertical remainder
function gridWithRemainderV(pL: number, pW: number, bL: number, bW: number): PlacedBox[] {
  if (bL === bW) return uniformGrid(pL, pW, bL, bW);

  let best: PlacedBox[] = [];

  // Main grid: bL x bW, remainder strip at right filled with bW x bL
  const mainCols = Math.floor(pL / bL);
  const mainWidth = mainCols * bL;
  const remainderW = pL - mainWidth;

  const mainBoxes: PlacedBox[] = [];
  const mainRows = Math.floor(pW / bW);
  for (let r = 0; r < mainRows; r++) {
    for (let c = 0; c < mainCols; c++) {
      mainBoxes.push(makeBox(c * bL, r * bW, bL, bW, false));
    }
  }

  const remBoxes: PlacedBox[] = [];
  if (remainderW >= bW) {
    const remCols = Math.floor(remainderW / bW);
    const remRows = Math.floor(pW / bL);
    for (let r = 0; r < remRows; r++) {
      for (let c = 0; c < remCols; c++) {
        remBoxes.push(makeBox(mainWidth + c * bW, r * bL, bW, bL, true));
      }
    }
  }

  best = [...mainBoxes, ...remBoxes];

  // Alternate: main bW x bL
  const mainCols2 = Math.floor(pL / bW);
  const mainWidth2 = mainCols2 * bW;
  const remainderW2 = pL - mainWidth2;

  const mainBoxes2: PlacedBox[] = [];
  const mainRows2 = Math.floor(pW / bL);
  for (let r = 0; r < mainRows2; r++) {
    for (let c = 0; c < mainCols2; c++) {
      mainBoxes2.push(makeBox(c * bW, r * bL, bW, bL, true));
    }
  }

  const remBoxes2: PlacedBox[] = [];
  if (remainderW2 >= bL) {
    const remCols2 = Math.floor(remainderW2 / bL);
    const remRows2 = Math.floor(pW / bW);
    for (let r = 0; r < remRows2; r++) {
      for (let c = 0; c < remCols2; c++) {
        remBoxes2.push(makeBox(mainWidth2 + c * bL, r * bW, bL, bW, false));
      }
    }
  }

  const candidate2 = [...mainBoxes2, ...remBoxes2];
  if (candidate2.length > best.length) best = candidate2;

  return best;
}

// Pattern 19-27: Grid with remainder on both sides
function gridWithRemainderBoth(pL: number, pW: number, bL: number, bW: number): PlacedBox[] {
  if (bL === bW) return uniformGrid(pL, pW, bL, bW);

  let best: PlacedBox[] = [];

  // Main grid bL x bW in top-left, remainder right filled rotated, remainder bottom filled rotated
  const mainCols = Math.floor(pL / bL);
  const mainRows = Math.floor(pW / bW);
  const mainWidth = mainCols * bL;
  const mainHeight = mainRows * bW;
  const remW = pL - mainWidth;
  const remH = pW - mainHeight;

  const boxes: PlacedBox[] = [];

  // Main grid
  for (let r = 0; r < mainRows; r++) {
    for (let c = 0; c < mainCols; c++) {
      boxes.push(makeBox(c * bL, r * bW, bL, bW, false));
    }
  }

  // Right remainder (rotated)
  if (remW >= bW) {
    const rCols = Math.floor(remW / bW);
    const rRows = Math.floor(mainHeight / bL);
    for (let r = 0; r < rRows; r++) {
      for (let c = 0; c < rCols; c++) {
        boxes.push(makeBox(mainWidth + c * bW, r * bL, bW, bL, true));
      }
    }
  }

  // Bottom remainder (rotated)
  if (remH >= bL) {
    const bCols = Math.floor(pL / bW);
    const bRows = Math.floor(remH / bL);
    for (let r = 0; r < bRows; r++) {
      for (let c = 0; c < bCols; c++) {
        boxes.push(makeBox(c * bW, mainHeight + r * bL, bW, bL, true));
      }
    }
  }

  best = boxes;

  // Alternative: main grid bW x bL
  const mainCols2 = Math.floor(pL / bW);
  const mainRows2 = Math.floor(pW / bL);
  const mainWidth2 = mainCols2 * bW;
  const mainHeight2 = mainRows2 * bL;
  const remW2 = pL - mainWidth2;
  const remH2 = pW - mainHeight2;

  const boxes2: PlacedBox[] = [];

  for (let r = 0; r < mainRows2; r++) {
    for (let c = 0; c < mainCols2; c++) {
      boxes2.push(makeBox(c * bW, r * bL, bW, bL, true));
    }
  }

  if (remW2 >= bL) {
    const rCols = Math.floor(remW2 / bL);
    const rRows = Math.floor(mainHeight2 / bW);
    for (let r = 0; r < rRows; r++) {
      for (let c = 0; c < rCols; c++) {
        boxes2.push(makeBox(mainWidth2 + c * bL, r * bW, bL, bW, false));
      }
    }
  }

  if (remH2 >= bW) {
    const bCols = Math.floor(pL / bL);
    const bRows = Math.floor(remH2 / bW);
    for (let r = 0; r < bRows; r++) {
      for (let c = 0; c < bCols; c++) {
        boxes2.push(makeBox(c * bL, mainHeight2 + r * bW, bL, bW, false));
      }
    }
  }

  if (boxes2.length > best.length) best = boxes2;

  return best;
}

// Nested pinwheel - pinwheel with pinwheel center
function nestedPinwheel(pL: number, pW: number, bL: number, bW: number): PlacedBox[] {
  if (bL === bW) return uniformGrid(pL, pW, bL, bW);
  if (pL < 2 * (bL + bW) || pW < 2 * (bL + bW)) return pinwheel(pL, pW, bL, bW);

  const boxes: PlacedBox[] = [];

  // Outer ring (same as pinwheel)
  const topCols = Math.floor((pL - bW) / bL);
  for (let c = 0; c < topCols; c++) {
    boxes.push(makeBox(c * bL, 0, bL, bW, false));
  }

  const rightX = pL - bW;
  const rightRows = Math.floor((pW - bW) / bL);
  for (let r = 0; r < rightRows; r++) {
    boxes.push(makeBox(rightX, r * bL, bW, bL, true));
  }

  const bottomY = pW - bW;
  const bottomCols = Math.floor((pL - bW) / bL);
  for (let c = 0; c < bottomCols; c++) {
    boxes.push(makeBox(bW + c * bL, bottomY, bL, bW, false));
  }

  const leftRows = Math.floor((pW - bW) / bL);
  for (let r = 0; r < leftRows; r++) {
    boxes.push(makeBox(0, bW + r * bL, bW, bL, true));
  }

  // Inner area: apply pinwheel again
  const innerL = pL - 2 * bW;
  const innerW = pW - 2 * bW;
  if (innerL > 0 && innerW > 0) {
    const innerBoxes = pinwheel(innerL, innerW, bL, bW);
    for (const b of innerBoxes) {
      boxes.push(makeBox(bW + b.x, bW + b.y, b.boxL, b.boxW, b.rotated));
    }
  }

  return boxes;
}

// Interleaved rows: alternating row orientations
function interleavedRows(pL: number, pW: number, bL: number, bW: number): PlacedBox[] {
  if (bL === bW) return uniformGrid(pL, pW, bL, bW);

  const boxes: PlacedBox[] = [];
  let y = 0;
  let rowIdx = 0;

  while (y + Math.min(bL, bW) <= pW) {
    if (rowIdx % 2 === 0) {
      // Row of bL x bW
      if (y + bW > pW) break;
      const cols = Math.floor(pL / bL);
      for (let c = 0; c < cols; c++) {
        boxes.push(makeBox(c * bL, y, bL, bW, false));
      }
      y += bW;
    } else {
      // Row of bW x bL (rotated)
      if (y + bL > pW) break;
      const cols = Math.floor(pL / bW);
      for (let c = 0; c < cols; c++) {
        boxes.push(makeBox(c * bW, y, bW, bL, true));
      }
      y += bL;
    }
    rowIdx++;
  }

  return boxes;
}

// Interleaved columns
function interleavedCols(pL: number, pW: number, bL: number, bW: number): PlacedBox[] {
  if (bL === bW) return uniformGrid(pL, pW, bL, bW);

  const boxes: PlacedBox[] = [];
  let x = 0;
  let colIdx = 0;

  while (x + Math.min(bL, bW) <= pL) {
    if (colIdx % 2 === 0) {
      if (x + bL > pL) break;
      const rows = Math.floor(pW / bW);
      for (let r = 0; r < rows; r++) {
        boxes.push(makeBox(x, r * bW, bL, bW, false));
      }
      x += bL;
    } else {
      if (x + bW > pL) break;
      const rows = Math.floor(pW / bL);
      for (let r = 0; r < rows; r++) {
        boxes.push(makeBox(x, r * bL, bW, bL, true));
      }
      x += bW;
    }
    colIdx++;
  }

  return boxes;
}

export interface PatternResult {
  name: string;
  boxes: PlacedBox[];
}

const patternGenerators: { name: string; fn: PatternFn }[] = [
  { name: '均一配置', fn: uniformGrid },
  { name: '上下分割', fn: twoSectionH },
  { name: '左右分割', fn: twoSectionV },
  { name: '風車配置', fn: pinwheel },
  { name: 'レンガ積み(横)', fn: brickH },
  { name: 'レンガ積み(縦)', fn: brickV },
  { name: 'グリッド+横余り', fn: gridWithRemainderH },
  { name: 'グリッド+縦余り', fn: gridWithRemainderV },
  { name: 'グリッド+両余り', fn: gridWithRemainderBoth },
  { name: '二重風車', fn: nestedPinwheel },
  { name: '交互行配置', fn: interleavedRows },
  { name: '交互列配置', fn: interleavedCols },
];

export function generateAllPatterns(
  palletL: number, palletW: number,
  boxFootL: number, boxFootW: number
): PatternResult[] {
  const results: PatternResult[] = [];

  for (const { name, fn } of patternGenerators) {
    const boxes = fn(palletL, palletW, boxFootL, boxFootW);
    results.push({ name, boxes });
  }

  // Filter out any boxes that exceed pallet bounds (safety)
  return results.map(r => ({
    ...r,
    boxes: r.boxes.filter(b =>
      b.x >= 0 && b.y >= 0 &&
      b.x + b.boxL <= palletL + 0.01 &&
      b.y + b.boxW <= palletW + 0.01
    ),
  }));
}
