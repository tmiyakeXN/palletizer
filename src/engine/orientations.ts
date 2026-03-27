import type { Dims, Orientation } from '../types';

export function getOrientations(box: Dims): Orientation[] {
  // 荷物の高さ(h)は常に高さ方向。底面は長さ(l)×幅(w)のみ。
  // パレット上での水平回転(l×w と w×l)は各パターンジェネレータが内部で処理する。
  return [{ footL: box.l, footW: box.w, upH: box.h }];
}
