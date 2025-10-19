import React, { useState } from 'react';
import Header from './components/Header';
import NavBar from './components/NavBar';
import PrayerTimes from './components/PrayerTimes';
import AdhkarList from './components/AdhkarList';
import QuranReader from './components/QuranReader';
import TasbihCounter from './components/TasbihCounter';
import { morningAdhkar, eveningAdhkar, afterPrayerAdhkar, generalDuas } from './constants';

export type View = 'prayer' | 'morning' | 'evening' | 'afterPrayer' | 'duas' | 'quran' | 'tasbih';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('prayer');

  const renderContent = () => {
    switch (activeView) {
      case 'prayer':
        return <PrayerTimes />;
      case 'morning':
        return <AdhkarList title="أذكار الصباح" adhkar={morningAdhkar} />;
      case 'evening':
        return <AdhkarList title="أذكار المساء" adhkar={eveningAdhkar} />;
      case 'afterPrayer':
        return <AdhkarList title="أذكار بعد الصلاة" adhkar={afterPrayerAdhkar} />;
      case 'duas':
        return <AdhkarList title="أدعية متنوعة" adhkar={generalDuas} />;
      case 'quran':
        return <QuranReader />;
      case 'tasbih':
        return <TasbihCounter />;
      default:
        return <PrayerTimes />;
    }
  };

  return (
    <div dir="rtl" className="bg-gray-100 min-h-screen font-sans pb-20">
      <Header />
      <main className="container mx-auto p-4 max-w-3xl">
        {renderContent()}
      </main>
      <NavBar activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
};

export default App;