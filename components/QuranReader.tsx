import React, { useState, useEffect } from 'react';
import { getSurahList, getSurahDetail } from '../services/quranService';
import type { Surah, SurahDetail } from '../types';

const QuranReader: React.FC = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        setLoading(true);
        setError(null);
        const surahList = await getSurahList();
        setSurahs(surahList);
      } catch (err) {
        setError('فشل في تحميل قائمة السور. يرجى التحقق من اتصالك بالإنترنت.');
      } finally {
        setLoading(false);
      }
    };
    fetchSurahs();
  }, []);

  const handleSelectSurah = async (surahNumber: number) => {
    try {
      setLoading(true);
      setError(null);
      const surahDetail = await getSurahDetail(surahNumber);
      setSelectedSurah(surahDetail);
    } catch (err) {
      setError('فشل في تحميل السورة. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    setSelectedSurah(null);
  };

  if (loading && !selectedSurah && surahs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="mt-4 text-lg text-gray-600">...جاري تحميل قائمة السور</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>;
  }

  if (selectedSurah) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-green-200">
           <h2 className="text-3xl font-bold text-green-700">{selectedSurah.name}</h2>
           <button 
             onClick={handleGoBack}
             className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
           >
            → العودة للفهرس
           </button>
        </div>
        <div 
          className="space-y-6 text-right leading-loose" 
          style={{ fontFamily: "'Amiri Quran', serif", fontSize: '1.8rem', lineHeight: '3.5rem'}}
        >
          {selectedSurah.ayahs.map((ayah) => (
            <span key={ayah.number} className="text-gray-800">
              {ayah.text}
              <span className="text-green-600 font-bold mx-2">﴿{ayah.numberInSurah}﴾</span>
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">فهرس القرآن الكريم</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {surahs.map((surah) => (
          <button 
            key={surah.number} 
            onClick={() => handleSelectSurah(surah.number)}
            className="text-right w-full p-4 bg-white rounded-lg shadow-md hover:shadow-xl hover:bg-green-50 transition-all duration-200"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">{surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
                  <span className="text-lg font-bold text-green-600 bg-green-100 rounded-full h-8 w-8 flex items-center justify-center">{surah.number}</span>
              </div>
              <div>
                <p className="text-xl font-semibold text-gray-800">{surah.name}</p>
                <p className="text-sm text-gray-600">{surah.englishName}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuranReader;