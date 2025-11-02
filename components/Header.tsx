import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-cyber-pink">MixImage Studio</h1>
        <p className="text-sm text-slate-400">
          แพลตฟอร์มสร้างภาพแนวสตูดิโอ ซ่อมแซม และปรับแต่งด้วยพลังของ AI
        </p>
      </div>
      <div className="text-right text-xs text-slate-500 leading-relaxed">
        <p>ทดลองเวอร์ชันสาธิต</p>
        <p>Designed for MIX NATTANON</p>
      </div>
    </header>
  );
};

export default Header;
