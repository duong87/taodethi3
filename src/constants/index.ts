export const SUBJECTS = [
  'Toán học',
  'Vật lí',
  'Hóa học',
  'Sinh học',
  'Ngữ văn',
  'Tiếng Anh',
  'Lịch sử',
  'Địa lí',
  'GDCD',
  'Công Nghệ',
  'HĐTN-HN'
];

export const GRADES = Array.from({ length: 12 }, (_, i) => String(i + 1));

export const BOOK_SERIES = [
  'Kết nối tri thức',
  'Chân trời sáng tạo',
  'Cánh diều'
];

export const EXAM_TYPES = {
  REGULAR: 'Đề thường xuyên',
  PERIODIC: 'Đề định kỳ'
};

export const DEFAULT_DIFFICULTY = {
  nb: 40,
  th: 30,
  vd: 20,
  vdc: 10
};

export const DEFAULT_QUESTION_CONFIG = {
  p1: { count: 12, score: 0.25 },
  p2: { count: 2, score: 1.0 },
  p3: { count: 4, score: 0.5 },
  es: { count: 3, score: 3.0 }
};
