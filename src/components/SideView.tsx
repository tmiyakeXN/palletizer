import { LAYER_COLORS, PALLET_STROKE } from '../utils/colors';

interface Props {
  palletL: number;
  palletH: number;
  layerHeight: number;
  numLayers: number;
  maxHeight: number;
}

export default function SideView({ palletL, palletH, layerHeight, numLayers, maxHeight }: Props) {
  const totalCargoHeight = layerHeight * numLayers;
  const totalHeight = palletH + totalCargoHeight;
  const padding = Math.max(palletL, totalHeight) * 0.08;
  const viewW = palletL + padding * 3;
  const viewH = totalHeight + padding * 2.5;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">側面図</h3>
      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        className="w-full border border-gray-200 rounded-lg bg-white"
        style={{ maxHeight: '300px' }}
      >
        {/* Pallet base */}
        <rect
          x={padding}
          y={padding + totalCargoHeight}
          width={palletL}
          height={palletH}
          fill="#a8a29e"
          stroke={PALLET_STROKE}
          strokeWidth={Math.max(1, palletL * 0.003)}
        />
        <text
          x={padding + palletL / 2}
          y={padding + totalCargoHeight + palletH / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={padding * 0.4}
          fill="#44403c"
          fontWeight="600"
        >
          パレット ({palletH}mm)
        </text>

        {/* Cargo layers */}
        {Array.from({ length: numLayers }, (_, i) => {
          const layerY = padding + totalCargoHeight - (i + 1) * layerHeight;
          const color = LAYER_COLORS[i % LAYER_COLORS.length];
          return (
            <g key={i}>
              <rect
                x={padding}
                y={layerY}
                width={palletL}
                height={layerHeight}
                fill={color}
                stroke={PALLET_STROKE}
                strokeWidth={Math.max(1, palletL * 0.002)}
                opacity={0.8}
              />
              <text
                x={padding + palletL / 2}
                y={layerY + layerHeight / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={padding * 0.35}
                fill="#1e293b"
                fontWeight="500"
              >
                {i + 1}段目 ({layerHeight}mm)
              </text>
            </g>
          );
        })}

        {/* Total height dimension */}
        <line
          x1={padding + palletL + padding * 0.3}
          y1={padding}
          x2={padding + palletL + padding * 0.3}
          y2={padding + totalHeight}
          stroke="#64748b"
          strokeWidth={Math.max(1, palletL * 0.002)}
        />
        <text
          x={padding + palletL + padding * 0.6}
          y={padding + totalHeight / 2}
          textAnchor="middle"
          fontSize={padding * 0.35}
          fill="#64748b"
          fontWeight="600"
          transform={`rotate(-90, ${padding + palletL + padding * 0.6}, ${padding + totalHeight / 2})`}
        >
          総高さ {totalHeight}mm
        </text>

        {/* Max height line */}
        {maxHeight < totalHeight * 2 && (
          <>
            <line
              x1={padding - padding * 0.3}
              y1={padding + totalHeight - maxHeight}
              x2={padding + palletL + padding * 0.15}
              y2={padding + totalHeight - maxHeight}
              stroke="#ef4444"
              strokeWidth={Math.max(1, palletL * 0.003)}
              strokeDasharray={`${palletL * 0.02} ${palletL * 0.01}`}
            />
            <text
              x={padding - padding * 0.4}
              y={padding + totalHeight - maxHeight}
              textAnchor="end"
              dominantBaseline="central"
              fontSize={padding * 0.3}
              fill="#ef4444"
              fontWeight="600"
            >
              高さ制限 {maxHeight}mm
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
