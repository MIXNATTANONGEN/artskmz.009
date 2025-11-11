import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex flex-col gap-2 mb-6 text-center sm:text-left">
      <h1 className="text-3xl sm:text-4xl font-bold text-cyber-pink">Mix Image Studio</h1>
      <p className="text-slate-300 text-base sm:text-lg">
        สร้าง ปรับแต่ง และฟื้นฟูภาพถ่ายของคุณด้วย AI ได้ในที่เดียว
      </p>
    </header>
  );
};

export default Header;
