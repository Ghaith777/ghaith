import React, { useState, useMemo } from 'react';

const dhikrOptions = [
  'سبحان الله',
  'الحمد لله',
  'الله أكبر',
  'أستغفر الله',
  'لا إله إلا الله',
];

const TasbihCounter: React.FC = () => {
  const [selectedDhikr, setSelectedDhikr] = useState<string>(dhikrOptions[0]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [totalCount, setTotalCount] = useState<number>(0);

  const currentCount = counts[selectedDhikr] || 0;

  const handleIncrement = () => {
    setCounts(prevCounts => ({
      ...prevCounts,
      [selectedDhikr]: (prevCounts[selectedDhikr] || 0) + 1,
    }));
    setTotalCount(prevTotal => prevTotal + 1);
  };

  const handleResetCurrent = () => {
    const countToSubtract = counts[selectedDhikr] || 0;
    setTotalCount(prevTotal => prevTotal - countToSubtract);
    setCounts(prevCounts => ({
      ...prevCounts,
      [selectedDhikr]: 0,
    }));
  };
  
  const handleResetAll = () => {
      setCounts({});
      setTotalCount(0);
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-4">المسبحة الإلكترونية</h2>

        <div className="w-full max-w-xs mb-6">
            <label htmlFor="dhikr-select" className="block mb-2 text-sm font-medium text-gray-700">اختر الذكر:</label>
            <select
                id="dhikr-select"
                value={selectedDhikr}
                onChange={(e) => setSelectedDhikr(e.target.value)}
                className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
            >
                {dhikrOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </div>

        <div className="relative mb-6">
            <p className="text-2xl font-semibold text-gray-800 mb-4 h-8">{selectedDhikr}</p>
            <button
                onClick={handleIncrement}
                className="w-52 h-52 bg-green-600 text-white rounded-full flex items-center justify-center text-6xl font-bold shadow-2xl transform active:scale-95 transition-transform duration-100 focus:outline-none focus:ring-4 focus:ring-green-400"
                aria-label={`Increment count for ${selectedDhikr}`}
            >
                {currentCount}
            </button>
        </div>

        <div className="flex items-center justify-center gap-4 mb-6">
            <button
                onClick={handleResetCurrent}
                className="py-2 px-5 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
                تصفير العداد
            </button>
            <button
                onClick={handleResetAll}
                className="py-2 px-5 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
            >
                تصفير المجموع
            </button>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-md w-full max-w-xs">
            <p className="text-lg text-gray-600">المجموع الكلي:</p>
            <p className="text-3xl font-bold text-green-700">{totalCount}</p>
        </div>
    </div>
  );
};

export default TasbihCounter;
