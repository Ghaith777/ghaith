import React from 'react';
import MosqueIcon from './icons/MosqueIcon';
import BookIcon from './icons/BookIcon';
import QuranIcon from './icons/QuranIcon';
import TasbihIcon from './icons/TasbihIcon';
import type { View } from '../App';

interface NavBarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavButton: React.FC<{
  label: string;
  view: View;
  activeView: View;
  setActiveView: (view: View) => void;
  children: React.ReactNode;
}> = ({ label, view, activeView, setActiveView, children }) => {
  const isActive = activeView === view;
  return (
    <button
      onClick={() => setActiveView(view)}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
        isActive ? 'text-green-600' : 'text-gray-500 hover:text-green-500'
      }`}
    >
      {children}
      <span className={`text-xs font-medium ${isActive ? 'font-bold' : ''}`}>{label}</span>
    </button>
  );
};

const AdhkarDropdown: React.FC<{
  activeView: View;
  setActiveView: (view: View) => void;
}> = ({ activeView, setActiveView }) => {
  const isAdhkarActive = ['morning', 'evening', 'afterPrayer', 'duas'].includes(activeView);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (view: View) => {
    setActiveView(view);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
          isAdhkarActive ? 'text-green-600' : 'text-gray-500 hover:text-green-500'
        }`}
      >
        <BookIcon />
        <span className={`text-xs font-medium ${isAdhkarActive ? 'font-bold' : ''}`}>الأذكار</span>
      </button>
      {isOpen && (
        <div className="absolute bottom-full mb-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200" onMouseLeave={() => setIsOpen(false)}>
          <a onClick={() => handleSelect('morning')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer text-right">أذكار الصباح</a>
          <a onClick={() => handleSelect('evening')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer text-right">أذكار المساء</a>
          <a onClick={() => handleSelect('afterPrayer')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer text-right">أذكار بعد الصلاة</a>
          <a onClick={() => handleSelect('duas')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer text-right">أدعية</a>
        </div>
      )}
    </div>
  );
};


const NavBar: React.FC<NavBarProps> = ({ activeView, setActiveView }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg w-full border-t border-gray-200" style={{ zIndex: 1000 }}>
      <div className="flex justify-around max-w-3xl mx-auto">
        <NavButton label="الصلاة" view="prayer" activeView={activeView} setActiveView={setActiveView}>
          <MosqueIcon />
        </NavButton>
        <AdhkarDropdown activeView={activeView} setActiveView={setActiveView} />
        <NavButton label="التسبيح" view="tasbih" activeView={activeView} setActiveView={setActiveView}>
          <TasbihIcon />
        </NavButton>
        <NavButton label="القرآن" view="quran" activeView={activeView} setActiveView={setActiveView}>
          <QuranIcon />
        </NavButton>
      </div>
    </nav>
  );
};

export default NavBar;