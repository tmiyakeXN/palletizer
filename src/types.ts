export interface Dims {
  l: number;
  w: number;
  h: number;
}

export interface PlacedBox {
  x: number;
  y: number;
  boxL: number;
  boxW: number;
  rotated: boolean; // true if box footprint is swapped from primary orientation
}

export interface Layer {
  boxes: PlacedBox[];
  layerHeight: number;
  count: number;
}

export interface Solution {
  layer: Layer;
  numLayers: number;
  totalItems: number;
  utilization: number;
  patternName: string;
  cargoOrientation: { footL: number; footW: number; upH: number };
}

export interface Orientation {
  footL: number;
  footW: number;
  upH: number;
}
