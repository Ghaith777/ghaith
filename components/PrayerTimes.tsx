import React, { useState, useEffect, useCallback } from 'react';
import { getPrayerTimes, getCityAndCountry } from '../services/geminiService';
import type { PrayerTimesData, Coords } from '../types';

const PrayerTimeCard: React.FC<{ name: string; time: string; isNext: boolean }> = ({ name, time, isNext }) => {
  const cardClasses = isNext
    ? 'bg-green-600 text-white shadow-lg scale-105'
    : 'bg-white text-gray-700 shadow-md';
  return (
    <div className={`flex justify-between items-center p-4 rounded-lg transition-all duration-300 ${cardClasses}`}>
      <p className="text-lg font-semibold">{name}</p>
      <p className="text-xl font-bold font-mono tracking-wider">{time}</p>
    </div>
  );
};

const PrayerTimes: React.FC = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [location, setLocation] = useState<{ city: string; country: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<string>('جاري تحديد موقعك...');
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: Date } | null>(null);
  const [countdown, setCountdown] = useState<string>('');
  const [manualCity, setManualCity] = useState('');
  const [manualCountry, setManualCountry] = useState('');
  
  const prayerNames: { [key in keyof PrayerTimesData]: string } = {
    fajr: 'الفجر',
    shuruq: 'الشروق',
    dhuhr: 'الظهر',
    asr: 'العصر',
    maghrib: 'المغرب',
    isha: 'العشاء',
  };

  const prayerOrder: (keyof PrayerTimesData)[] = ['fajr', 'shuruq', 'dhuhr', 'asr', 'maghrib', 'isha'];

  const calculateNextPrayer = useCallback((times: PrayerTimesData) => {
    const now = new Date();
    let nextPrayerInfo = null;
    let minDiff = Infinity;

    for (const key of prayerOrder) {
      if (key === 'shuruq') continue; // Skip sunrise as a prayer
      const prayerKey = key as keyof PrayerTimesData;
      const timeStr = times[prayerKey];
      if(!timeStr) continue;

      const [hours, minutes] = timeStr.split(':').map(Number);
      const prayerTime = new Date();
      prayerTime.setHours(hours, minutes, 0, 0);

      const diff = prayerTime.getTime() - now.getTime();
      
      if (diff > 0 && diff < minDiff) {
        minDiff = diff;
        nextPrayerInfo = { name: prayerNames[prayerKey], time: prayerTime };
      }
    }
    
    // If all prayers for today have passed, next prayer is Fajr of tomorrow
    if (!nextPrayerInfo) {
        const fajrTimeStr = times.fajr;
        const [hours, minutes] = fajrTimeStr.split(':').map(Number);
        const tomorrowFajr = new Date();
        tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
        tomorrowFajr.setHours(hours, minutes, 0, 0);
        nextPrayerInfo = { name: prayerNames.fajr, time: tomorrowFajr };
    }

    setNextPrayer(nextPrayerInfo);
  }, [prayerNames, prayerOrder]);

  const fetchLocationAndTimes = useCallback(async (coords: Coords) => {
    try {
      setLoading('جاري جلب اسم المدينة...');
      const locationData = await getCityAndCountry(coords.latitude, coords.longitude);
      setLocation(locationData);
      
      setLoading(`جاري جلب أوقات الصلاة لـ ${locationData.city}...`);
      const times = await getPrayerTimes(locationData.city, locationData.country);
      setPrayerTimes(times);
      calculateNextPrayer(times);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading('');
    }
  }, [calculateNextPrayer]);

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCity.trim() || !manualCountry.trim()) {
      setError("يرجى إدخال المدينة والدولة.");
      return;
    }
    setLoading(`جاري جلب أوقات الصلاة لـ ${manualCity}...`);
    setError(null);
    setPrayerTimes(null); // Clear previous times
    try {
      const times = await getPrayerTimes(manualCity, manualCountry);
      setPrayerTimes(times);
      setLocation({ city: manualCity, country: manualCountry });
      calculateNextPrayer(times);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading('');
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchLocationAndTimes(position.coords);
      },
      (geoError) => {
        setError('لم يتم السماح بالوصول إلى الموقع. يمكنك البحث عن مدينتك يدوياً.');
        setLoading('');
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!nextPrayer) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = nextPrayer.time.getTime() - now;
      if (diff <= 0) {
        setCountdown('00:00:00');
        if(prayerTimes) calculateNextPrayer(prayerTimes);
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [nextPrayer, prayerTimes, calculateNextPrayer]);

  const currentDate = new Date().toLocaleDateString('ar-EG-u-nu-latn', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  if (loading && !prayerTimes) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="mt-4 text-lg text-gray-600">{loading}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {location && (
        <div className="text-center p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-green-700">{location.city}, {location.country}</h2>
          <p className="text-gray-500">{currentDate}</p>
        </div>
      )}
      
      <form onSubmit={handleManualSearch} className="p-4 bg-white rounded-lg shadow-md space-y-3">
        <p className="text-center text-gray-600 font-medium">البحث اليدوي</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={manualCountry}
            onChange={(e) => setManualCountry(e.target.value)}
            placeholder="ادخل الدولة (مثال: مصر)"
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Country Input"
          />
          <input
            type="text"
            value={manualCity}
            onChange={(e) => setManualCity(e.target.value)}
            placeholder="ادخل المدينة (مثال: القاهرة)"
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="City Input"
          />
        </div>
        <button type="submit" disabled={!!loading} className="w-full bg-green-600 text-white p-2 rounded-lg font-bold hover:bg-green-700 transition-colors disabled:bg-green-400">
          {loading ? '...جاري البحث' : 'بحث'}
        </button>
      </form>

      {error && <div className="text-center p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
      
      {nextPrayer && (
        <div className="text-center p-4 bg-green-100 border-2 border-green-600 rounded-lg shadow-lg">
          <p className="text-lg text-gray-700">الصلاة القادمة: <span className="font-bold text-green-800">{nextPrayer.name}</span></p>
          <p className="text-3xl font-mono font-bold text-green-800 tracking-widest">{countdown}</p>
        </div>
      )}

      {prayerTimes && (
        <div className="space-y-3">
          {prayerOrder.map((key) => {
            const time = prayerTimes[key];
            if (!time) return null;
            return (
              <PrayerTimeCard 
                key={key} 
                name={prayerNames[key]} 
                time={time}
                isNext={nextPrayer?.name === prayerNames[key]}
              />
            )
          })}
        </div>
      )}
    </div>
  );
};

export default PrayerTimes;