import type { Solution } from '../types';

interface Props {
  solution: Solution;
}

export default function ResultsSummary({ solution }: Props) {
  const { layer, numLayers, totalItems, utilization, patternName, cargoOrientation } = solution;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">計算結果</h3>

      {/* メイン数値 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-700">{layer.count}</div>
          <div className="text-sm text-blue-600 mt-1">個/段</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-700">{numLayers}</div>
          <div className="text-sm text-green-600 mt-1">段数</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-orange-700">{totalItems}</div>
          <div className="text-sm text-orange-600 mt-1">合計</div>
        </div>
      </div>

      {/* 詳細 */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">積み付けパターン</span>
          <span className="font-medium text-gray-800">{patternName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">荷物の向き（底面）</span>
          <span className="font-medium text-gray-800">
            {cargoOrientation.footL} x {cargoOrientation.footW} mm
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">1段の高さ</span>
          <span className="font-medium text-gray-800">{cargoOrientation.upH} mm</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">総積載高さ</span>
          <span className="font-medium text-gray-800">
            {cargoOrientation.upH * numLayers} mm
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">体積利用率</span>
          <span className="font-medium text-gray-800">{utilization.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}
