import type { StyleCategory, Style, GenderSpecificStyles, ColorOption } from './types';

const FACE_PREVIEW = 'https://placehold.co/100x100/ffedd5/333/png?text=Face';

const SUIT_COLORS: ColorOption[] = [
  { label: 'ดำ', value: 'สีดำ', hex: '#262626' },
  { label: 'กรมท่า', value: 'สีกรมท่า', hex: '#1e3a8a' },
  { label: 'เทาเข้ม', value: 'สีเทาเข้ม', hex: '#404040' },
  { label: 'เทาอ่อน', value: 'สีเทาอ่อน', hex: '#a3a3a3' },
  { label: 'น้ำตาล', value: 'สีน้ำตาล', hex: '#78350f' },
  { label: 'ครีม', value: 'สีครีม', hex: '#fef3c7' },
  { label: 'ขาว', value: 'สีขาว', hex: '#ffffff' },
];

const SHIRT_COLORS: ColorOption[] = [
  { label: 'ขาว', value: 'สีขาว', hex: '#ffffff' },
  { label: 'ฟ้าอ่อน', value: 'สีฟ้าอ่อน', hex: '#bae6fd' },
  { label: 'ดำ', value: 'สีดำ', hex: '#262626' },
  { label: 'เทา', value: 'สีเทา', hex: '#a3a3a3' },
  { label: 'ชมพูอ่อน', value: 'สีชมพูอ่อน', hex: '#fce7f3' },
  { label: 'ครีม', value: 'สีครีม', hex: '#fef3c7' },
  { label: 'กรมท่า', value: 'สีกรมท่า', hex: '#1e3a8a' },
];

export const CATEGORIES: { id: StyleCategory; label:string }[] = [
    { id: 'saved', label: 'สไตล์ที่บันทึก' },
    { id: 'clothes', label: 'เปลี่ยนเสื้อ' },
    { id: 'background', label: 'เปลี่ยนฉาก' },
    { id: 'pose', label: 'ท่าโพส' },
    { id: 'lighting', label: 'แสง/เอฟเฟค' },
    { id: 'hair_color', label: 'เปลี่ยนสีผม' },
    { id: 'hairstyle', label: 'เปลี่ยนทรงผม' },
    { id: 'retouching', label: 'ปรับแต่งใบหน้า' },
];

export const STYLES: {
  clothes: GenderSpecificStyles;
  background: Style[];
  retouching: GenderSpecificStyles;
  hair_color: Style[];
  hairstyle: GenderSpecificStyles;
  lighting: Style[];
  pose: Style[];
  saved: Style[]; // Placeholder for dynamic user-saved styles
} = {
  clothes: {
    male: [
      { label: 'สูทคลาสสิก', prompt: 'เปลี่ยนเป็นชุดสูทสากล {color} ทับเสื้อเชิ้ตขาวเรียบ และผูกเนคไทสีที่เข้ากัน', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/374151/FFF/png?text=Suit'], colors: SUIT_COLORS },
      { label: 'ชุดสูท (ไม่ผูกไท)', prompt: 'เปลี่ยนเป็นชุดสูท {color} ทับเสื้อเชิ้ตขาว ปลดกระดุมบน ไม่ผูกเนคไท', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/374151/FFF/png?text=Open+Suit'], colors: SUIT_COLORS },
      { label: 'เสื้อเบลเซอร์', prompt: 'เปลี่ยนเป็นเสื้อเบลเซอร์สไตล์ business casual {color} ทับเสื้อตัวในสีพื้น', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/374151/FFF/png?text=Blazer'], colors: SUIT_COLORS },
      { label: 'ชุดข้าราชการ', prompt: 'เปลี่ยนเป็นชุดข้าราชการพลเรือนสีกากีคอพับสำหรับผู้ชาย (ปลอดเครื่องหมายและตราสัญลักษณ์จริง)', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/a1887f/FFF/png?text=Official'] },
      { label: 'ชุดปกติขาว', prompt: 'เปลี่ยนเป็นชุดเครื่องแบบปกติขาวสำหรับผู้ชาย (ปลอดเครื่องหมายและตราสัญลักษณ์จริง)', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/f1f5f9/333/png?text=White+Uniform'] },
      { label: 'ชุดซาฟารี', prompt: 'เปลี่ยนเป็นชุดซาฟารีสีกากีหรือสีสุภาพสำหรับผู้ชาย', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/a1887f/FFF/png?text=Safari'] },
      { label: 'ชุดครุย', prompt: 'เปลี่ยนเป็นชุดครุยรับปริญญาสำหรับผู้ชาย (รูปแบบทั่วไป ปลอดตราสัญลักษณ์จริง)', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/111827/FFF/png?text=Gown'] },
      { label: 'ชุดตำรวจ', prompt: 'เปลี่ยนเป็นชุดเครื่องแบบตำรวจชายไทย (รูปแบบทั่วไป ปลอดเครื่องหมายยศและตราจริง)', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/5d4037/FFF/png?text=Police'] },
      { label: 'ชุดทหาร', prompt: 'เปลี่ยนเป็นชุดเครื่องแบบทหารชาย (รูปแบบทั่วไป ปลอดเครื่องหมายยศและตราจริง)', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/4d7c0f/FFF/png?text=Army'] },
      { label: 'นักเรียนประถม (ชาย)', prompt: 'เปลี่ยนเป็นชุดนักเรียนชายระดับประถม เสื้อเชิ้ตขาวคอปก แขนสั้น ปล่อยชายเสื้อ (อ้างอิง: Untitled-1.jpg แถว 1, ภาพ 1)', previewImages: ['https://placehold.co/100x100/ffedd5/333/png?text=Face', 'https://placehold.co/100x100/f8fafc/333/png?text=Elem+Boy'] },
      { label: 'นักเรียน ม.ต้น (ชาย)', prompt: 'เปลี่ยนเป็นชุดนักเรียนชายระดับมัธยมต้น เสื้อเชิ้ตขาวคอปก แขนสั้น ไม่มีกระเป๋าเสื้อ ใส่ชายเสื้อในกางเกง (อ้างอิง: Untitled-1.jpg แถว 1, ภาพ 2)', previewImages: ['https://placehold.co/100x100/ffedd5/333/png?text=Face', 'https://placehold.co/100x100/f8fafc/333/png?text=Mid+Boy'] },
      { label: 'นักเรียน ม.ปลาย (ชาย)', prompt: 'เปลี่ยนเป็นชุดนักเรียนชายระดับมัธยมปลาย เสื้อเชิ้ตขาวคอปก แขนสั้น มีกระเป๋าเสื้อด้านซ้าย ใส่ชายเสื้อในกางเกง (อ้างอิง: Untitled-1.jpg แถว 1, ภาพ 3)', previewImages: ['https://placehold.co/100x100/ffedd5/333/png?text=Face', 'https://placehold.co/100x100/f8fafc/333/png?text=High+Boy'] },
      { label: 'นักศึกษา (ชาย)', prompt: 'เปลี่ยนเป็นชุดนักศึกษาชาย เสื้อเชิ้ตขาวแขนยาวพับแขน มีกระเป๋าเสื้อด้านซ้าย ใส่ชายเสื้อในกางเกง (อ้างอิง: Untitled-1.jpg แถว 1, ภาพ 4)', previewImages: ['https://placehold.co/100x100/ffedd5/333/png?text=Face', 'https://placehold.co/100x100/f8fafc/333/png?text=Uni+Boy'] },
      { label: 'ชุด ร.ด. (นักศึกษาวิชาทหาร)', prompt: 'เปลี่ยนเป็นชุดนักศึกษาวิชาทหาร (ร.ด.) สีดำ แขนยาว พร้อมเครื่องหมาย (อ้างอิง: Untitled-1.jpg แถว 3, ภาพ 1)', previewImages: ['https://placehold.co/100x100/ffedd5/333/png?text=Face', 'https://placehold.co/100x100/171717/FFF/png?text=R.D.'] },
      { label: 'นักศึกษา (ไทแดงเลือดหมู)', prompt: 'เปลี่ยนเป็นชุดนักศึกษาชาย เสื้อเชิ้ตขาวแขนยาว ผูกเนคไทสีแดงเลือดหมู (อ้างอิง: Untitled-1.jpg แถว 3, ภาพ 2)', previewImages: ['https://placehold.co/100x100/ffedd5/333/png?text=Face', 'https://placehold.co/100x100/7f1d1d/FFF/png?text=Red+Tie'] },
      { label: 'เสื้อเชิ้ต', prompt: 'เปลี่ยนเป็นเสื้อเชิ้ต {color} เรียบสุภาพสำหรับผู้ชาย', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/f8fafc/333/png?text=Shirt'], colors: SHIRT_COLORS },
      { label: 'เสื้อโปโลสีสุภาพ', prompt: 'เปลี่ยนเป็นเสื้อโปโลมีปกสีสุภาพเรียบๆ เช่น สีกรมท่า, สีขาว, หรือสีเทา', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/4b5563/FFF/png?text=Polo'] },
      { label: 'เสื้อคอจีน', prompt: 'เปลี่ยนเป็นเสื้อคอจีนสีขาวหรือสีอ่อนสำหรับผู้ชาย ดูสุภาพเรียบร้อย', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/e5e7eb/333/png?text=Mandarin'] },
      { label: 'เสื้อคอเต่า', prompt: 'เปลี่ยนเป็นเสื้อคอเต่าสีพื้นเรียบๆ (เช่น สีดำ, เทา) ดูอบอุ่นและเป็นมืออาชีพ', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/171717/FFF/png?text=Turtleneck'] },
      { label: 'เสื้อสเวตเตอร์', prompt: 'เปลี่ยนเป็นเสื้อสเวตเตอร์ไหมพรมคอกลมสีสุภาพ ทับบนเสื้อเชิ้ต', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/9ca3af/FFF/png?text=Sweater'] },
      { label: 'เชิ้ตออกซ์ฟอร์ด', prompt: 'เปลี่ยนเป็นเสื้อเชิ้ตผ้าออกซ์ฟอร์ดสีพื้น เช่น สีฟ้าอ่อน หรือสีขาว', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/a5f3fc/333/png?text=Oxford'] },
      { label: 'แจ็คเก็ตลำลอง', prompt: 'เปลี่ยนเป็นแจ็คเก็ตสไตล์ลำลองที่ดูดี เช่น บอมเบอร์แจ็คเก็ต หรือฟิลด์แจ็คเก็ตสีเข้ม', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/57534e/FFF/png?text=Jacket'] },
      { label: 'เสื้อพระราชทาน', prompt: 'เปลี่ยนเป็นชุดเสื้อพระราชทานสำหรับผู้ชาย (ปลอดเครื่องหมายและตราสัญลักษณ์)', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/fcd34d/333/png?text=Thai'] },
      { label: 'เสื้อยืดแขนกุด', prompt: 'เปลี่ยนเป็นเสื้อยืดแขนกุดสีพื้นเรียบๆ เช่น สีขาว, สีดำ, หรือสีเทา', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/f8fafc/333/png?text=Sleeveless'] },
    ],
    female: [
      { label: 'สูททำงาน', prompt: 'เปลี่ยนเป็นชุดสูททำงาน {color} สำหรับผู้หญิงที่ดูสุภาพและเป็นมืออาชีพ', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/374151/FFF/png?text=Suit'], colors: SUIT_COLORS },
      { label: 'เสื้อเบลเซอร์', prompt: 'เปลี่ยนเป็นเสื้อเบลเซอร์สไตล์ business casual {color} ทับเสื้อตัวในสีพื้น', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/374151/FFF/png?text=Blazer'], colors: SUIT_COLORS },
      { label: 'เสื้อเบลาส์ทำงาน', prompt: 'เปลี่ยนเป็นเสื้อเบลาส์ทำงาน {color} ดูสุภาพและเป็นมืออาชีพ', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/e9d5ff/333/png?text=Blouse'], colors: SHIRT_COLORS },
      { label: 'ชุดข้าราชการ', prompt: 'เปลี่ยนเป็นชุดข้าราชการพลเรือนสีกากีสำหรับผู้หญิง (ปลอดเครื่องหมายและตราสัญลักษณ์จริง)', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/a1887f/FFF/png?text=Official'] },
      { label: 'ชุดปกติขาว', prompt: 'เปลี่ยนเป็นชุดเครื่องแบบปกติขาวสำหรับผู้หญิง (ปลอดเครื่องหมายและตราสัญลักษณ์จริง)', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/f1f5f9/333/png?text=White+Uniform'] },
      { label: 'ชุดครุย', prompt: 'เปลี่ยนเป็นชุดครุยรับปริญญาสำหรับผู้หญิง (รูปแบบทั่วไป ปลอดตราสัญลักษณ์จริง)', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/111827/FFF/png?text=Gown'] },
      { label: 'ชุดตำรวจ', prompt: 'เปลี่ยนเป็นชุดเครื่องแบบตำรวจหญิงไทย (รูปแบบทั่วไป ปลอดเครื่องหมายยศและตราจริง)', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/5d4037/FFF/png?text=Police'] },
      { label: 'ชุดทหาร', prompt: 'เปลี่ยนเป็นชุดเครื่องแบบทหารหญิง (รูปแบบทั่วไป ปลอดเครื่องหมายยศและตราจริง)', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/4d7c0f/FFF/png?text=Army'] },
      { label: 'ชุดพยาบาล', prompt: 'เปลี่ยนเป็นชุดพยาบาลสีขาว (รูปแบบมาตรฐาน ปลอดตราสถาบัน)', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/ecfccb/333/png?text=Nurse'] },
      { label: 'นักเรียนประถม (หญิง)', prompt: 'เปลี่ยนเป็นชุดนักเรียนหญิงระดับประถม เสื้อเชิ้ตขาวคอบัว แขนสั้นจีบ ปล่อยชายเสื้อ (อ้างอิง: Untitled-1.jpg แถว 2, ภาพ 1)', previewImages: ['https://placehold.co/100x100/ffedd5/333/png?text=Face', 'https://placehold.co/100x100/f8fafc/333/png?text=Elem+Girl'] },
      { label: 'นักเรียน ม.ต้น (หญิง)', prompt: 'เปลี่ยนเป็นชุดนักเรียนหญิงระดับมัธยมต้น เสื้อคอบัวสีขาว แขนสั้น ผูกโบว์สีน้ำเงินกรมท่า ปล่อยชายเสื้อ (อ้างอิง: Untitled-1.jpg แถว 2, ภาพ 2)', previewImages: ['https://placehold.co/100x100/ffedd5/333/png?text=Face', 'https://placehold.co/100x100/f8fafc/333/png?text=Mid+Girl'] },
      { label: 'นักเรียน ม.ปลาย (หญิง)', prompt: 'เปลี่ยนเป็นชุดนักเรียนหญิงระดับมัธยมปลาย เสื้อเชิ้ตขาวคอปก แขนสั้น ปล่อยชายเสื้อ (อ้างอิง: Untitled-1.jpg แถว 2, ภาพ 3)', previewImages: ['https://placehold.co/100x100/ffedd5/333/png?text=Face', 'https://placehold.co/100x100/f8fafc/333/png?text=High+Girl'] },
      { label: 'นักศึกษา (หญิง)', prompt: 'เปลี่ยนเป็นชุดนักศึกษาหญิง เสื้อเชิ้ตขาวเข้ารูป แขนสั้น ติดกระดุมมหาวิทยาลัย ใส่ชายเสื้อในกระโปรง (อ้างอิง: Untitled-1.jpg แถว 2, ภาพ 4)', previewImages: ['https://placehold.co/100x100/ffedd5/333/png?text=Face', 'https://placehold.co/100x100/f8fafc/333/png?text=Uni+Girl'] },
      { label: 'เชิ้ตขาวผู้หญิง (คอปก)', prompt: 'เปลี่ยนเป็นเสื้อเชิ้ตสีขาวคอปก แขนสั้น สำหรับผู้หญิง ดูสุภาพ (อ้างอิง: Untitled-1.jpg แถว 3, ภาพ 3)', previewImages: ['https://placehold.co/100x100/ffedd5/333/png?text=Face', 'https://placehold.co/100x100/f8fafc/333/png?text=W+Shirt'] },
      { label: 'เสื้อเชิ้ต', prompt: 'เปลี่ยนเป็นเสื้อเชิ้ต {color} เรียบสุภาพสำหรับผู้หญิง', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/f8fafc/333/png?text=Shirt'], colors: SHIRT_COLORS },
      { label: 'เสื้อโปโลสีสุภาพ', prompt: 'เปลี่ยนเป็นเสื้อโปโลมีปกสีสุภาพเรียบๆ เช่น สีกรมท่า, สีขาว, หรือสีเทา', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/4b5563/FFF/png?text=Polo'] },
      { label: 'เสื้อคอจีน', prompt: 'เปลี่ยนเป็นเสื้อคอจีนสีขาวหรือสีอ่อนสำหรับผู้หญิง ดูสุภาพเรียบร้อย', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/e5e7eb/333/png?text=Mandarin'] },
      { label: 'เสื้อคอเต่า', prompt: 'เปลี่ยนเป็นเสื้อคอเต่าสีพื้นเรียบๆ (เช่น สีดำ, ครีม) ดูอบอุ่นและเป็นมืออาชีพ', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/171717/FFF/png?text=Turtleneck'] },
      { label: 'เสื้อสเวตเตอร์', prompt: 'เปลี่ยนเป็นเสื้อสเวตเตอร์ไหมพรมคอกลมหรือคอวีสีสุภาพ', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/9ca3af/FFF/png?text=Sweater'] },
      { label: 'แจ็คเก็ตลำลอง', prompt: 'เปลี่ยนเป็นแจ็คเก็ตสไตล์ลำลองที่ดูดีสำหรับผู้หญิง', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/57534e/FFF/png?text=Jacket'] },
      { label: 'ชุดไทยประยุกต์', prompt: 'เปลี่ยนเป็นชุดไทยประยุกต์ที่ดูสุภาพและทันสมัย เช่น เสื้อลูกไม้สวยงาม (ปลอดเครื่องหมายและตราสัญลักษณ์)', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/fcd34d/333/png?text=Thai'] },
      { label: 'ชุดกิโมโน/ยูกาตะ', prompt: 'เปลี่ยนเป็นชุดกิโมโนหรือยูกาตะของญี่ปุ่นสำหรับผู้หญิง (รูปแบบทั่วไป)', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/fecaca/333/png?text=Kimono'] },
      { label: 'ชุดฮันบก', prompt: 'เปลี่ยนเป็นชุดฮันบกของเกาหลีสำหรับผู้หญิง (รูปแบบทั่วไป)', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/dbeafe/333/png?text=Hanbok'] },
      { label: 'ชุดพื้นเมืองอินเดีย', prompt: 'เปลี่ยนเป็นส่วนบนของชุดส่าหรีสำหรับหญิง (รูปแบบทั่วไป)', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/fde68a/333/png?text=Indian'] },
      { label: 'ชุดกี่เพ้า', prompt: 'เปลี่ยนเป็นชุดกี่เพ้าสำหรับหญิง (รูปแบบทั่วไป)', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/ef4444/FFF/png?text=Qipao'] },
      { label: 'เสื้อแขนกุด', prompt: 'เปลี่ยนเป็นเสื้อเบลาส์แขนกุดที่ดูสุภาพ หรือเสื้อยืดแขนกุดเข้ารูป', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/f8fafc/333/png?text=Sleeveless'] },
    ]
  },
  background: [
    { label: 'พื้นหลังสีฟ้า', prompt: 'ลบพื้นหลังเดิมทั้งหมดและแทนที่ด้วยฉากสตูดิโอถ่ายภาพแบบไล่ระดับสี (Gradient) จากสีฟ้าสดใสไปเป็นสีฟ้าที่อ่อนลง มีการจัดแสงเงาอย่างมืออาชีพ ทำให้ตัวแบบดูกลืนไปกับฉากหลังอย่างสมจริง', previewImages: ['https://placehold.co/100x100/3b82f6/FFF/png?text=Blue'] },
    { label: 'พื้นหลังสีขาว', prompt: 'ลบพื้นหลังเดิมทั้งหมดและแทนที่ด้วยสีขาวล้วน (#FFFFFF) สำหรับวีซ่าหรือรูปทางการ', previewImages: ['https://placehold.co/100x100/ffffff/333/png?text=White'] },
    { label: 'สีเทากลาง', prompt: 'ลบพื้นหลังเดิมทั้งหมดและแทนที่ด้วยสีเทากลาง (#F2F2F2 หรือใกล้เคียง) เรียบ สะอาด', previewImages: ['https://placehold.co/100x100/6b7280/FFF/png?text=Grey'] },
    { label: 'สตูดิโอเรียบ', prompt: 'ลบพื้นหลังเดิมทั้งหมดและแทนที่ด้วยฉากสตูดิโอถ่ายภาพแบบเรียบง่าย อาจมีแสงเงาตกกระทบเล็กน้อย', previewImages: ['https://placehold.co/100x100/a3a3a3/FFF/png?text=Studio'] },
    { label: 'พื้นหลังสีน้ำเงิน', prompt: 'ลบพื้นหลังเดิมทั้งหมดและแทนที่ด้วยฉากหลังสตูดิโอถ่ายภาพสีน้ำเงินเข้ม (Navy Blue) ที่ดูสมจริง มีแสงเงาตกกระทบเล็กน้อยเพื่อสร้างมิติ ไม่ใช่สีพื้นเรียบ', previewImages: ['https://placehold.co/100x100/1e3a8a/FFF/png?text=Navy'] },
    { label: 'สีชมพูอ่อน', prompt: 'ลบพื้นหลังเดิมทั้งหมดและแทนที่ด้วยพื้นหลังสีชมพูอ่อน (#FFDFE1) สำหรับรูปโปรไฟล์', previewImages: ['https://placehold.co/100x100/fbcfe8/333/png?text=Pink'] },
    { label: 'Gradient ฟ้า-ขาว', prompt: 'ลบพื้นหลังเดิมทั้งหมดและแทนที่ด้วยพื้นหลังแบบไล่ระดับสี (Gradient) จากสีฟ้าอ่อนไปเป็นสีขาว', previewImages: ['https://placehold.co/100x100/bfdbfe/333/png?text=Grad'] },
    { label: 'ออฟฟิศ (เบลอ)', prompt: 'ลบพื้นหลังเดิมทั้งหมดและแทนที่ด้วยฉากหลังเป็นออฟฟิศที่ดูทันสมัยและถูกเบลอไว้ (Bokeh effect)', previewImages: ['https://placehold.co/100x100/a3a3a3/FFF/png?text=Office'] },
    { label: 'ชั้นหนังสือ (เบลอ)', prompt: 'ลบพื้นหลังเดิมทั้งหมดและแทนที่ด้วยฉากหลังเป็นชั้นหนังสือที่ดูดีและถูกเบลอไว้ (Bokeh effect)', previewImages: ['https://placehold.co/100x100/8c6d5d/FFF/png?text=Books'] },
    { label: 'ธรรมชาติ (เบลอ)', prompt: 'ลบพื้นหลังเดิมทั้งหมดและแทนที่ด้วยฉากหลังที่เป็นสวนหรือต้นไม้สีเขียวที่ถูกเบลอไว้อย่างสวยงาม', previewImages: ['https://placehold.co/100x100/4d7c0f/FFF/png?text=Nature'] },
    { label: 'กำแพงพื้นผิว', prompt: 'ลบพื้นหลังเดิมทั้งหมดและแทนที่ด้วยกำแพงสีเทาอ่อนที่มีพื้นผิว (texture) เล็กน้อย', previewImages: ['https://placehold.co/100x100/d4d4d8/333/png?text=Wall'] },
  ],
  pose: [
    { label: 'หน้าตรง (ทางการ)', prompt: 'ไม่ว่าภาพต้นฉบับจะเป็นท่าทางใดก็ตาม, ให้เปลี่ยนท่าทางของบุคคลในภาพให้เป็นท่าหน้าตรง (Straight-on portrait pose) มองตรงมาที่กล้อง', previewImages: ['https://placehold.co/100x100/a3a3a3/FFF/png?text=Straight'] },
    { label: 'เอียงเล็กน้อย (3/4)', prompt: 'ไม่ว่าภาพต้นฉบับจะเป็นท่าทางใดก็ตาม, ให้เปลี่ยนท่าทางของบุคคลในภาพให้หันหน้าและลำตัวเอียงทำมุมเล็กน้อย (Three-quarter view) แต่ยังคงมองมาที่กล้อง เพื่อให้ดูเป็นธรรมชาติมากขึ้น', previewImages: ['https://placehold.co/100x100/a3a3a3/FFF/png?text=3/4+View'] },
  ],
  lighting: [
    { label: 'แสงนุ่ม (Softbox)', prompt: 'ใช้แสงสตูดิโอแบบ softbox ที่นุ่มนวล ลดเงาบนใบหน้าให้เหลือน้อยที่สุด', previewImages: ['https://placehold.co/100x100/a3a3a3/FFF/png?text=Softbox'] },
    { label: 'แสงริมไลท์', prompt: 'เพิ่ม Rim light เพื่อสร้างขอบแสงรอบตัวแบบบางๆ ทำให้ตัวแบบเด่นขึ้นจากพื้นหลัง', previewImages: ['https://placehold.co/100x100/a3a3a3/FFF/png?text=Rim+Light'] },
    { label: 'แสงธรรมชาติ', prompt: 'ใช้แสงธรรมชาติจากหน้าต่าง ให้ความรู้สึกสมจริงและสบายตา', previewImages: ['https://placehold.co/100x100/a3a3a3/FFF/png?text=Window'] },
    { label: 'แสงแข็ง/เงาชัด', prompt: 'ใช้แสงแข็ง (Hard light) เพื่อสร้างเงาที่คมชัด เพิ่มความดราม่าและมิติให้กับภาพ', previewImages: ['https://placehold.co/100x100/a3a3a3/FFF/png?text=Hard+Light'] },
    { label: 'แสงเรมบรันดท์', prompt: 'จัดแสงแบบ Rembrandt lighting ให้เกิดสามเหลี่ยมแสงเล็กๆ บนแก้มด้านที่อยู่ในเงา', previewImages: ['https://placehold.co/100x100/a3a3a3/FFF/png?text=Rembrandt'] },
    { label: 'โทนสีอบอุ่น', prompt: 'ปรับโทนสีของภาพรวมให้อบอุ่น (Warm tone)', previewImages: ['https://placehold.co/100x100/fbbf24/333/png?text=Warm'] },
    { label: 'โทนสีเย็น', prompt: 'ปรับโทนสีของภาพรวมให้เย็นตา (Cool tone)', previewImages: ['https://placehold.co/100x100/38bdf8/333/png?text=Cool'] },
  ],
  hair_color: [
    { label: 'สีดำธรรมชาติ', prompt: 'เปลี่ยนสีผมเป็นสีดำธรรมชาติ', previewImages: ['https://placehold.co/100x100/262626/FFF/png?text=Black'] },
    { label: 'สีน้ำตาลเข้ม', prompt: 'เปลี่ยนสีผมเป็นสีน้ำตาลเข้ม', previewImages: ['https://placehold.co/100x100/594338/FFF/png?text=D.Brown'] },
    { label: 'สีน้ำตาลอ่อน', prompt: 'เปลี่ยนสีผมเป็นสีน้ำตาลอ่อน', previewImages: ['https://placehold.co/100x100/a67c52/FFF/png?text=L.Brown'] },
    { label: 'สีบลอนด์', prompt: 'เปลี่ยนสีผมเป็นสีบลอนด์', previewImages: ['https://placehold.co/100x100/f0e1a1/333/png?text=Blonde'] },
    { label: 'น้ำตาลประกายแดง', prompt: 'เปลี่ยนสีผมเป็นสีน้ำตาลประกายแดง (Auburn)', previewImages: ['https://placehold.co/100x100/9b4c34/FFF/png?text=Auburn'] },
    { label: 'บลอนด์หม่น/เทา', prompt: 'เปลี่ยนสีผมเป็นสีบลอนด์หม่นหรือบลอนด์เทา (Ash Blonde)', previewImages: ['https://placehold.co/100x100/d1c5b4/333/png?text=Ash+Blonde'] },
    { label: 'สีเทา/เงิน', prompt: 'เปลี่ยนสีผมเป็นสีเทาหรือสีเงินอย่างดูเป็นธรรมชาติ', previewImages: ['https://placehold.co/100x100/c0c0c0/333/png?text=Silver'] },
    { label: 'ไฮไลท์', prompt: 'เพิ่มไฮไลท์สีอ่อนเล็กน้อยเพื่อเพิ่มมิติให้กับเส้นผม', previewImages: ['https://placehold.co/100x100/a67c52/FFF/png?text=Highlights'] },
  ],
  hairstyle: {
    male: [
      { label: 'ผมสั้นรองทรง', prompt: 'เปลี่ยนเป็นทรงผมสั้นเกรียนแบบรองทรง ดูสะอาดและเป็นระเบียบ', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=Short+Cut'] },
      { label: 'ผมเสย/ปัดขึ้น', prompt: 'เปลี่ยนเป็นทรงผมสั้นเซ็ตปัดขึ้นหรือเสยไปด้านหลัง (Slicked back/Quiff) ดูเป็นทางการ', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=Slick+Back'] },
      { label: 'ผมแสกข้าง', prompt: 'เปลี่ยนเป็นทรงผมสั้นแสกข้างหวีเรียบ (Side Part) ดูสุภาพ', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=Side+Part'] },
      { label: 'อันเดอร์คัต', prompt: 'เปลี่ยนเป็นทรงผมสั้นแบบอันเดอร์คัต (Undercut) ที่ไถด้านข้างและด้านหลังสั้น', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=Undercut'] },
      { label: 'ทรงคอมม่า', prompt: 'เปลี่ยนเป็นทรงผมสั้นแบบคอมม่า (Comma hair) ที่มีปอยผมด้านหน้าโค้งงอ', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=Comma'] },
      { label: 'ทรงทูบล็อค', prompt: 'เปลี่ยนเป็นทรงผมสั้นแบบทูบล็อค (Two Block) ที่มีผมด้านบนยาวกว่าด้านข้าง', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=Two+Block'] },
    ],
    female: [
      { label: 'ผมตรงยาว', prompt: 'เปลี่ยนเป็นทรงผมยาวตรงสลวย ดูเป็นธรรมชาติและเรียบร้อย', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=Long+Straight'] },
      { label: 'ผมลอน', prompt: 'เปลี่ยนเป็นทรงผมยาวดัดลอนคลายๆ ดูมีวอลลุ่มและสวยงาม', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=Wavy'] },
      { label: 'ผมประบ่า', prompt: 'เปลี่ยนเป็นทรงผมยาวประบ่า (Shoulder-length) ดูแลง่ายและสุภาพ', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=Shoulder'] },
      { label: 'ผมบ๊อบ', prompt: 'เปลี่ยนเป็นทรงผมบ๊อบสั้นหรือประบ่า ดูทันสมัยและสะอาดตา', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=Bob'] },
      { label: 'ผมสั้นดัด', prompt: 'เปลี่ยนเป็นทรงผมสั้นประบ่าดัดลอนเล็กน้อยให้ดูเป็นธรรมชาติ', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=Short+Perm'] },
      { label: 'รวบหางม้า', prompt: 'เปลี่ยนเป็นทรงผมรวบหางม้าต่ำหรือกลาง ดูสุภาพและเรียบร้อย', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=Ponytail'] },
      { label: 'มวยผม', prompt: 'เปลี่ยนเป็นทรงผมเกล้ามวยต่ำ (Low Bun) ดูเรียบร้อยและเป็นทางการ', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=Bun'] },
      { label: 'รวบผมครึ่งหัว', prompt: 'เปลี่ยนเป็นทรงผมรวบครึ่งหัว (Half-up) ดูสุภาพและอ่อนหวาน', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=Half-up'] },
    ]
  },
  retouching: {
      male: [
        { label: 'ผิวเนียนพอดี', prompt: 'ปรับผิวให้เรียบเนียนอย่างเป็นธรรมชาติ ลบสิวและริ้วรอยเล็กน้อย แต่ยังคงสภาพผิวเดิมไว้', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=Smooth+Skin'] },
        { label: 'ลดหน้ามัน', prompt: 'ลดแสงสะท้อนและความมันวาวบนใบหน้า ให้ดูเป็นธรรมชาติ', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=Matte'] },
        { label: 'ปรับผมเรียบร้อย', prompt: 'จัดเก็บไรผมที่ไม่เรียบร้อย ทำให้ทรงผมดูเป็นระเบียบมากขึ้น', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=Tidy+Hair'] },
        { label: 'ฟันขาวธรรมชาติ', prompt: 'ปรับสีฟันให้ขาวขึ้นเล็กน้อยอย่างเป็นธรรมชาติ (ถ้าเห็นฟัน)', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=White+Teeth'] },
        { label: 'ประกายตา', prompt: 'เพิ่มประกายในดวงตา (catchlight) เพื่อให้ดูสดใสและมีชีวิตชีวา', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=Bright+Eyes'] },
        { label: 'แต่งหน้าเบาๆ (ชาย)', prompt: 'เพิ่มการแต่งหน้าโทนธรรมชาติบางๆ (men\'s grooming) เพื่อให้ใบหน้าดูสดใสและคมชัดขึ้น', previewImages: ['https://placehold.co/100x100/fbcfe8/333/png?text=Makeup'] },
        { label: 'ลดรอยคล้ำใต้ตา', prompt: 'ลดรอยคล้ำใต้ตา ทำให้ใบหน้าดูสดใสและพักผ่อนเพียงพอ', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=No+Circles'] },
        { label: 'ลบแว่นตา', prompt: 'ลบแว่นตาออกจากใบหน้า ปรับแก้ดวงตาให้ดูเป็นธรรมชาติ', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=No+Glasses'] },
        { label: 'เพิ่มแว่นตาสุภาพ', prompt: 'เพิ่มแว่นตากรอบสุภาพที่ไม่บดบังดวงตา', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=Glasses'] },
        { label: 'ไม่แก้ไฝ/แผลเป็น', prompt: 'คงไฝ แผลเป็น หรือเอกลักษณ์บุคคลอื่นๆ ไว้ตามเดิมทั้งหมด', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=Keep+Marks'] },
      ],
      female: [
        { label: 'ผิวเนียนพอดี', prompt: 'ปรับผิวให้เรียบเนียนอย่างเป็นธรรมชาติ ลบสิวและริ้วรอยเล็กน้อย แต่ยังคงสภาพผิวเดิมไว้', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=Smooth+Skin'] },
        { label: 'ลดหน้ามัน', prompt: 'ลดแสงสะท้อนและความมันวาวบนใบหน้า ให้ดูเป็นธรรมชาติ', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=Matte'] },
        { label: 'ปรับผมเรียบร้อย', prompt: 'จัดเก็บไรผมที่ไม่เรียบร้อย ทำให้ทรงผมดูเป็นระเบียบมากขึ้น', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=Tidy+Hair'] },
        { label: 'ฟันขาวธรรมชาติ', prompt: 'ปรับสีฟันให้ขาวขึ้นเล็กน้อยอย่างเป็นธรรมชาติ (ถ้าเห็นฟัน)', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=White+Teeth'] },
        { label: 'ประกายตา', prompt: 'เพิ่มประกายในดวงตา (catchlight) เพื่อให้ดูสดใสและมีชีวิตชีวา', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=Bright+Eyes'] },
        { label: 'แต่งหน้าเบาๆ', prompt: 'เพิ่มการแต่งหน้าโทนธรรมชาติบางๆ เพื่อให้ใบหน้าดูสดใสขึ้น', previewImages: ['https://placehold.co/100x100/fbcfe8/333/png?text=Makeup'] },
        { label: 'ลดรอยคล้ำใต้ตา', prompt: 'ลดรอยคล้ำใต้ตา ทำให้ใบหน้าดูสดใสและพักผ่อนเพียงพอ', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=No+Circles'] },
        { label: 'ลบแว่นตา', prompt: 'ลบแว่นตาออกจากใบหน้า ปรับแก้ดวงตาให้ดูเป็นธรรมชาติ', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=No+Glasses'] },
        { label: 'เพิ่มแว่นตาสุภาพ', prompt: 'เพิ่มแว่นตากรอบสุภาพที่ไม่บดบังดวงตา', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=Glasses'] },
        { label: 'ไม่แก้ไฝ/แผลเป็น', prompt: 'คงไฝ แผลเป็น หรือเอกลักษณ์บุคคลอื่นๆ ไว้ตามเดิมทั้งหมด', previewImages: ['https://placehold.co/100x100/374151/FFF/png?text=Keep+Marks'] },
      ]
  },
  saved: [],
};

// --- New Constants for Repair Mode ---

export const MEMORIAL_OUTFITS = [
    { label: 'สูทสากล (ผูกไท)', prompt: 'เปลี่ยนเป็นชุดสูทสากลสีดำทับเสื้อเชิ้ตขาว ผูกเนคไทสีดำสุภาพ' },
    { label: 'สูทสากล (ไม่ผูกไท)', prompt: 'เปลี่ยนเป็นชุดสูทสากลสีดำทับเสื้อเชิ้ตขาว ปลดกระดุมบน ไม่ผูกเนคไท' },
    { label: 'เสื้อเชิ้ตขาว (สุภาพ)', prompt: 'เปลี่ยนเป็นเสื้อเชิ้ตสีขาวเรียบสุภาพ คอปก' },
    { label: 'ชุดผ้าไหม / คอจีน', prompt: 'เปลี่ยนเป็นชุดผ้าไหมคอจีนสีสุภาพ (เช่น สีครีม, สีเทาอ่อน) สำหรับผู้สูงอายุ' },
    { label: 'ชุดลูกไม้ (สุภาพสตรี)', prompt: 'เปลี่ยนเป็นชุดลูกไม้สีขาวหรือสีดำสุภาพ (สำหรับผู้หญิง)' }
];

export const MEMORIAL_BACKGROUNDS = [
    { label: 'ไล่เฉดสีเทา', prompt: 'เปลี่ยนฉากหลังเป็นแบบไล่เฉดสีเทา (Gray Gradient) สำหรับภาพทางการ' },
    { label: 'ไล่เฉดสีฟ้า', prompt: 'เปลี่ยนฉากหลังเป็นแบบไล่เฉดสีฟ้าอ่อน (Light Blue Gradient) ที่ดูสมจริงเหมือนฉากสตูดิโอ' },
    { label: 'ไล่เฉดสีครีม', prompt: 'เปลี่ยนฉากหลังเป็นแบบไล่เฉดสีครีม (Cream Gradient)' },
    { label: 'พื้นหลังขาว', prompt: 'เปลี่ยนฉากหลังเป็นสีขาวล้วน (#FFFFFF) สำหรับภาพทางการ' },
    { label: 'พื้นหลังน้ำเงิน', prompt: 'เปลี่ยนฉากหลังเป็นฉากสตูดิโอถ่ายภาพสีน้ำเงินเข้ม (Navy Blue) ที่ดูสมจริง มีแสงเงาเล็กน้อย' }
];