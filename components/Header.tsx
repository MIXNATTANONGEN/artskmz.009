import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
      <div>
        <p className="text-subtitle text-sm tracking-[0.35em] uppercase mb-2">Mix-Image</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-cyber-pink drop-shadow-md">
          AI Photo Studio Pro
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl">
          สร้างภาพถ่ายหน้าตรงแบบมืออาชีพได้ในไม่กี่ขั้นตอน เลือกเสื้อผ้า ฉากหลัง และการปรับแต่งที่ต้องการ จากนั้นให้ AI ดูแลส่วนที่เหลือ
        </p>
      </div>
      <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
        <span className="cyber-tag-button">เวอร์ชันทดลอง</span>
        <span className="cyber-tag-button">รองรับ Gemini</span>
      </div>
    </header>
  );
};

export default Header;
