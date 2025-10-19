
import React, { useState } from 'react';
import type { Adhkar } from '../types';

interface AdhkarCardProps {
  dhikr: Adhkar;
}

const AdhkarCard: React.FC<AdhkarCardProps> = ({ dhikr }) => {
  const [currentCount, setCurrentCount] = useState(dhikr.count);

  const handleClick = () => {
    if (currentCount > 0) {
      setCurrentCount(currentCount - 1);
    }
  };

  const isCompleted = currentCount === 0;

  return (
    <div className={`p-4 rounded-lg shadow-md transition-all duration-300 ${isCompleted ? 'bg-green-100' : 'bg-white'}`}>
      <p className={`text-lg leading-relaxed text-right ${isCompleted ? 'text-gray-500' : 'text-gray-800'}`}>{dhikr.text}</p>
      {dhikr.note && <p className="text-sm text-gray-500 mt-2 text-right">{dhikr.note}</p>}
      {dhikr.count > 1 && (
        <div className="flex justify-start items-center mt-3">
          <button 
            onClick={handleClick}
            disabled={isCompleted}
            className={`w-full text-center py-2 px-4 rounded-lg font-bold transition-colors duration-300
              ${isCompleted 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'}`}
          >
            {isCompleted ? 'تم' : `تكرار: ${currentCount}`}
          </button>
        </div>
      )}
    </div>
  );
};

interface AdhkarListProps {
  title: string;
  adhkar: Adhkar[];
}

const AdhkarList: React.FC<AdhkarListProps> = ({ title, adhkar }) => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-green-700 mb-4 pb-2 border-b-2 border-green-200">{title}</h2>
      <div className="space-y-4">
        {adhkar.map((dhikr) => (
          <AdhkarCard key={dhikr.id} dhikr={dhikr} />
        ))}
      </div>
    </section>
  );
};

export default AdhkarList;
