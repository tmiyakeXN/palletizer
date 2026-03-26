import type { PlacedBox } from '../types';
import { BOX_COLOR_A, BOX_COLOR_B, BOX_STROKE, PALLET_COLOR, PALLET_STROKE } from '../utils/colors';

interface Props {
  palletL: number;
  palletW: number;
  boxes: PlacedBox[];
}

export default function TopDownView({ palletL, palletW, boxes }: Props) {
  const padding = Math.max(palletL, palletW) * 0.05;
  const viewW = palletL + padding * 2;
  const viewH = palletW + padding * 2;
  const showLabels = boxes.length <= 80;
  const strokeWidth = Math.max(palletL, palletW) * 0.002;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">上面図（1段）</h3>
      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        className="w-full border border-gray-200 rounded-lg bg-white"
        style={{ maxHeight: '500px' }}
      >
        {/* Pallet */}
        <rect
          x={padding}
          y={padding}
          width={palletL}
          height={palletW}
          fill={PALLET_COLOR}
          stroke={PALLET_STROKE}
          strokeWidth={strokeWidth * 2}
        />

        {/* Boxes */}
        {boxes.map((box, i) => (
          <g key={i}>
            <rect
              x={padding + box.x}
              y={padding + box.y}
              width={box.boxL}
              height={box.boxW}
              fill={box.rotated ? BOX_COLOR_B : BOX_COLOR_A}
              stroke={BOX_STROKE}
              strokeWidth={strokeWidth}
              opacity={0.85}
            />
            {showLabels && (
              <text
                x={padding + box.x + box.boxL / 2}
                y={padding + box.y + box.boxW / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={Math.min(box.boxL, box.boxW) * 0.22}
                fill="#1e293b"
                fontWeight="500"
              >
                {box.boxL}x{box.boxW}
              </text>
            )}
          </g>
        ))}

        {/* Dimension labels */}
        <text
          x={padding + palletL / 2}
          y={padding * 0.6}
          textAnchor="middle"
          fontSize={padding * 0.5}
          fill="#64748b"
          fontWeight="600"
        >
          {palletL} mm
        </text>
        <text
          x={padding * 0.5}
          y={padding + palletW / 2}
          textAnchor="middle"
          fontSize={padding * 0.5}
          fill="#64748b"
          fontWeight="600"
          transform={`rotate(-90, ${padding * 0.5}, ${padding + palletW / 2})`}
        >
          {palletW} mm
        </text>

        {/* Legend */}
        <rect x={padding} y={viewH - padding * 0.8} width={padding * 0.5} height={padding * 0.4} fill={BOX_COLOR_A} stroke={BOX_STROKE} strokeWidth={strokeWidth} />
        <text x={padding + padding * 0.65} y={viewH - padding * 0.5} fontSize={padding * 0.35} fill="#475569">通常向き</text>
        <rect x={padding + padding * 3} y={viewH - padding * 0.8} width={padding * 0.5} height={padding * 0.4} fill={BOX_COLOR_B} stroke={BOX_STROKE} strokeWidth={strokeWidth} />
        <text x={padding + padding * 3.65} y={viewH - padding * 0.5} fontSize={padding * 0.35} fill="#475569">回転</text>
      </svg>
    </div>
  );
}
