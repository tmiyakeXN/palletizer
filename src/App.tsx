import { useState } from 'react';
import type { Dims, Solution } from './types';
import { solve } from './engine/solver';
import InputForm from './components/InputForm';
import ResultsSummary from './components/ResultsSummary';
import TopDownView from './components/TopDownView';
import SideView from './components/SideView';

function App() {
  const [solution, setSolution] = useState<Solution | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [palletDims, setPalletDims] = useState<Dims | null>(null);
  const [maxH, setMaxH] = useState<number>(0);

  const handleCalculate = (pallet: Dims, cargo: Dims, maxHeight: number) => {
    setError(null);

    if (pallet.l <= 0 || pallet.w <= 0 || pallet.h <= 0) {
      setError('パレットの寸法は正の値を入力してください。');
      setSolution(null);
      return;
    }
    if (cargo.l <= 0 || cargo.w <= 0 || cargo.h <= 0) {
      setError('荷物の寸法は正の値を入力してください。');
      setSolution(null);
      return;
    }
    if (maxHeight <= 0) {
      setError('最大積載高さは正の値を入力してください。');
      setSolution(null);
      return;
    }

    const result = solve(pallet, cargo, maxHeight);

    if (!result) {
      setError('この寸法では荷物をパレットに積載できません。荷物がパレットより大きいか、高さ制限を超えています。');
      setSolution(null);
    } else {
      setSolution(result);
      setPalletDims(pallet);
      setMaxH(maxHeight);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">パレット積載計算ツール</h1>
          <p className="text-sm text-gray-500 mt-1">
            荷物の寸法に基づいて最適な積み付けパターンを計算します
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <InputForm onCalculate={handleCalculate} />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                {error}
              </div>
            )}

            {solution && palletDims && (
              <>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <ResultsSummary solution={solution} />
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <TopDownView
                    palletL={palletDims.l}
                    palletW={palletDims.w}
                    boxes={solution.layer.boxes}
                  />
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <SideView
                    palletL={palletDims.l}
                    palletH={palletDims.h}
                    layerHeight={solution.layer.layerHeight}
                    numLayers={solution.numLayers}
                    maxHeight={maxH}
                  />
                </div>
              </>
            )}

            {!solution && !error && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-400">
                <p className="text-5xl mb-4">📦</p>
                <p>寸法を入力して「計算する」を押してください</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
