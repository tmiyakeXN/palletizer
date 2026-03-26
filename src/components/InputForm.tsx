import { useState } from 'react';
import type { Dims } from '../types';

interface Props {
  onCalculate: (pallet: Dims, cargo: Dims, maxHeight: number) => void;
}

export default function InputForm({ onCalculate }: Props) {
  const [pallet, setPallet] = useState<Dims>({ l: 1100, w: 1100, h: 150 });
  const [cargo, setCargo] = useState<Dims>({ l: 400, w: 300, h: 200 });
  const [maxHeight, setMaxHeight] = useState(1500);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(pallet, cargo, maxHeight);
  };

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right';
  const labelClass = 'block text-sm font-medium text-gray-600 mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* パレット寸法 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-8 h-8 bg-slate-200 rounded flex items-center justify-center text-sm">P</span>
          パレット寸法
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>長さ (mm)</label>
            <input
              type="number"
              min={1}
              value={pallet.l}
              onChange={e => setPallet({ ...pallet, l: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>幅 (mm)</label>
            <input
              type="number"
              min={1}
              value={pallet.w}
              onChange={e => setPallet({ ...pallet, w: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>高さ (mm)</label>
            <input
              type="number"
              min={1}
              value={pallet.h}
              onChange={e => setPallet({ ...pallet, h: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* 荷物寸法 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-sm">C</span>
          荷物寸法
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>長さ (mm)</label>
            <input
              type="number"
              min={1}
              value={cargo.l}
              onChange={e => setCargo({ ...cargo, l: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>幅 (mm)</label>
            <input
              type="number"
              min={1}
              value={cargo.w}
              onChange={e => setCargo({ ...cargo, w: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>高さ (mm)</label>
            <input
              type="number"
              min={1}
              value={cargo.h}
              onChange={e => setCargo({ ...cargo, h: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* 最大積載高さ */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center text-sm">H</span>
          最大積載高さ
        </h3>
        <div>
          <label className={labelClass}>高さ制限 (mm)</label>
          <input
            type="number"
            min={1}
            value={maxHeight}
            onChange={e => setMaxHeight(Number(e.target.value))}
            className={inputClass}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
      >
        計算する
      </button>
    </form>
  );
}
