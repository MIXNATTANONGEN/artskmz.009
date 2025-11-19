import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Mix Image AI Studio</h1>
        <p className="text-slate-400 text-sm sm:text-base">
          สร้าง ปรับแต่ง และฟื้นฟูภาพถ่ายหน้าตรงด้วยพลังของ Gemini
        </p>
      </div>
      <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-400">
        <span className="px-3 py-1 rounded-full border border-slate-700 bg-slate-900/60 uppercase tracking-widest">
          Beta
        </span>
        <span className="hidden sm:block">รองรับทั้งโหมดสตูดิโอและซ่อมแซมภาพ</span>
      </div>
    </header>
  );
};

export default Header;
