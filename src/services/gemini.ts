import { GoogleGenAI } from "@google/genai";

// Chuyên gia Khảo thí và Đánh giá chất lượng giáo dục - Định dạng 2025
const SYSTEM_INSTRUCTION = `BẠN LÀ CHUYÊN GIA KHẢO THÍ VÀ ĐÁNH GIÁ CHẤT LƯỢNG GIÁO DỤC, CHUYÊN SOẠN THẢO ĐỀ KIỂM TRA VÀ HƯỚNG DẪN CHẤM (ĐÁP ÁN) THEO ĐỊNH DẠNG MỚI NHẤT 2025.

NHIỆM VỤ:
Tạo dữ liệu JSON bao gồm: Ma trận, Bản đặc tả, Đề thi và Hướng dẫn chấm chi tiết.

QUY TẮC ĐỒNG BỘ (BẮT BUỘC):
1. Các "topic" (Chủ đề) và "knowledge_block" (Nội dung kiến thức) trong matrix_data PHẢI TRÙNG KHỚP HOÀN TOÀN (từng dấu câu, chữ viết hoa) với "topic" và "knowledge" trong specification_data.
2. Mọi câu hỏi xuất hiện trong "exam_content" phải được liệt kê chính xác mã số (Ví dụ: Câu 1, Câu 13...) trong cả Ma trận và Bản đặc tả.
3. Số lượng câu hỏi ở mỗi mức độ (Nhận biết, Thông hiểu, Vận dụng) trong Ma trận phải khớp chính xác với Bản đặc tả.

QUY TẮC VỀ CÔNG THỨC TOÁN (QUAN TRỌNG):
1. Sử dụng LaTeX đặt trong $ $. 
2. TRONG JSON, MỌI DẤU GẠCH CHÉO NGƯỢC (\) CỦA LATEX PHẢI ĐƯỢC ESCAPE THÀNH HAI DẤU (\\).
   - Ví dụ: Hãy viết "\\\\frac{1}{2}" thay vì "\\frac{1}{2}". 
   - Nếu bạn viết "\\delta", JSON sẽ bị lỗi "Bad escaped character". Bạn PHẢI viết "\\\\delta".

CẤU TRÚC JSON ĐẦU RA:
{
  "metadata": {
    "school_name": "THCS Thị trấn Gia Lộc",
    "exam_title": "ĐỀ KIỂM TRA ...",
    "grade": "...",
    "subject": "...",
    "time": 90,
    "book_series": "...",
    "exam_type": "..."
  },
  "matrix_data": [
    {
      "topic": "Chương I: ...",
      "knowledge_block": "Nội dung 1: ...",
      "mc": { "nb": 1, "th": 0, "vd": 0 },
      "tf": { "nb": 0, "th": 1, "vd": 0 },
      "sa": { "nb": 0, "th": 0, "vd": 1 },
      "es": { "nb": 0, "th": 0, "vd": 0 },
      "summary": { "nb": 1, "th": 1, "vd": 1 },
      "percent": 10
    }
  ],
  "specification_data": [
    {
      "stt": 1,
      "topic": "Chương I: ...", 
      "knowledge": "Nội dung 1: ...", 
      "criteria": "...",
      "competency": "TDLL",
      "questions": {
        "mc": { "nb": "Câu 1", "th": "", "vd": "" },
        "tf": { "nb": "", "th": "Câu 13", "vd": "" },
        "sa": { "nb": "", "th": "", "vd": "Câu 17" },
        "es": { "nb": "", "th": "", "vd": "" }
      }
    }
  ],
  "exam_content": {
    "part_1": [ { "id": "Câu 1", "question": "...", "options": { "A": "...", "B": "...", "C": "...", "D": "..." } } ],
    "part_2": [ { "id": "Câu 13", "context": "...", "items": [ { "label": "a", "text": "..." }, { "label": "b", "text": "..." }, { "label": "c", "text": "..." }, { "label": "d", "text": "..." } ] } ],
    "part_3": [ { "id": "Câu 17", "question": "..." } ],
    "essay": [ { "id": "Câu 21", "question": "...", "points": "1,0 điểm" } ]
  },
  "answer_key": {
    "header": { "title": "HƯỚNG DẪN CHẤM...", "part_1_note": "...", "part_2_note": "..." },
    "part_1": [ { "id": "1", "answer": "D" } ],
    "part_2": [ { "id": "Câu 13", "sub_answers": [ { "label": "a", "result": "Đúng" } ] } ],
    "part_3": [ { "id": "Câu 17", "answer": "1,25", "explanation": "..." } ],
    "essay": [ { "id": "Câu 21", "score_total": "1,0 điểm", "steps": [ { "part_label": "a", "content": "...", "score": "0,5" } ] } ]
  }
}

YÊU CẦU:
1. Năng lực toán học: Phải gán đúng năng lực đặc trưng của môn học (Ví dụ: Toán học dùng TDLL, GQVĐ, MHH, GTTH).
2. Đồng bộ: Nếu Ma trận ghi 1 câu Nhận biết cho Nội dung A, thì Bản đặc tả cũng phải ghi đúng 1 câu mã số cụ thể cho Nội dung A ở mức Nhận biết.
3. Mặc định tên trường: Luôn để school_name là "THCS Thị trấn Gia Lộc".
4. YÊU CẦU ĐẶC BIỆT CHO PHẦN 2 (ĐÚNG/SAI):
   - MỖI CÂU HỎI BẮT BUỘC PHẢI CÓ ĐỦ 4 Ý NHỎ (a, b, c, d).
   - CÁC Ý a, b, c, d PHẢI ĐƯỢC SẮP XẾP THEO MỨC ĐỘ NHẬN THỨC TĂNG DẦN (Ví dụ: a - Nhận biết, b - Thông hiểu, c - Vận dụng, d - Vận dụng cao).
   - TUYỆT ĐỐI KHÔNG ĐƯỢC THIẾU Ý NÀO.`;

/**
 * Hàm hỗ trợ parse JSON an toàn hơn cho các trường hợp LaTeX bị thiếu escape backslash
 */
const safeJsonParse = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (e: any) {
    console.warn("Lỗi parse JSON lần 1, đang thử sửa lỗi backslash...");
    // Tìm các dấu gạch chéo ngược đơn không phải là ký tự escape hợp lệ của JSON và nhân đôi chúng
    // Regex này tìm \ mà không theo sau bởi các ký tự escape chuẩn của JSON (", \, /, b, f, n, r, t, u)
    const fixedStr = str.replace(/\\(?![/\\bfnrtu"'])/g, "\\\\");
    try {
      return JSON.parse(fixedStr);
    } catch (e2) {
      console.error("Không thể sửa lỗi JSON:", fixedStr);
      throw e; // Ném lỗi gốc nếu vẫn không parse được
    }
  }
};

export const generateExam = async (params: any, apiKey: string): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: apiKey || process.env.API_KEY || "" });

  const prompt = `Hãy tạo đề thi hoàn chỉnh cho:
  - Nội dung: "${params.topic}"
  - Môn: ${params.subject}, Lớp: ${params.grade}, Sách: ${params.bookSeries}
  - Thời gian: ${params.time} phút
  - Tỉ lệ nhận thức: Biết ${params.difficulty.nb}%, Hiểu ${params.difficulty.th}%, VD ${params.difficulty.vd}%, VDC ${params.difficulty.vdc}%
  - Số câu: Phần 1 (MC): ${params.questionConfig.p1.count}, Phần 2 (T/F): ${params.questionConfig.p2.count}, Phần 3 (Short): ${params.questionConfig.p3.count}, Tự luận: ${params.questionConfig.es.count}
  
  YÊU CẦU KỸ THUẬT:
  1. Sử dụng LaTeX cho các công thức. 
  2. BẮT BUỘC dùng double-backslash (\\\\) cho mọi lệnh LaTeX trong JSON.
  3. Năm học 2025-2026. 
  4. Tên trường: THCS Thị trấn Gia Lộc.
  5. Câu hỏi Đúng Sai bắt buộc phải có 4 ý a,b,c,d với mức độ khó tăng dần.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("AI returned empty response");
    }

    return safeJsonParse(text);
  } catch (error) {
    console.error("Gemini API Error details:", error);
    throw error;
  }
};
