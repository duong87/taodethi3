import { GoogleGenAI } from "@google/genai";

// Chuyên gia Khảo thí và Đánh giá chất lượng giáo dục - Định dạng 2025
const SYSTEM_INSTRUCTION = `BẠN LÀ CHUYÊN GIA KHẢO THÍ VÀ ĐÁNH GIÁ CHẤT LƯỢNG GIÁO DỤC, CHUYÊN SOẠN THẢO ĐỀ KIỂM TRA VÀ HƯỚNG DẪN CHẤM (ĐÁP ÁN) THEO ĐỊNH DẠNG MỚI NHẤT 2025.

NHIỆM VỤ:
Tạo dữ liệu JSON bao gồm: Ma trận, Bản đặc tả (NẾU ĐƯỢC YÊU CẦU), Đề thi và Hướng dẫn chấm chi tiết.

QUY TẮC VỀ CÔNG THỨC TOÁN (QUAN TRỌNG):
1. CHỈ sử dụng LaTeX ($...$) cho các công thức toán học, biểu thức, phương trình, hoặc các ký hiệu toán học đặc biệt.
2. TUYỆT ĐỐI KHÔNG sử dụng $...$ cho:
   - Các chữ cái thông thường (ví dụ: "Gọi A là...", KHÔNG viết "Gọi $A$ là...").
   - Các đơn vị đo lường cơ bản đi kèm số (ví dụ: "5cm", KHÔNG viết "$5cm$").
   - Dấu câu hoặc từ ngữ tiếng Việt.
3. BẮT BUỘC thêm khoảng trắng (space) TRƯỚC và SAU các dấu ngoặc (), [], {} (Ví dụ: " ... ( x + 1 ) ... ").
4. Trong JSON, MỌI DẤU GẠCH CHÉO NGƯỢC (\\) CỦA LATEX PHẢI ĐƯỢC ESCAPE THÀNH HAI DẤU (\\\\).
   - Ví dụ: Hãy viết "\\\\frac{1}{2}" thay vì "\\frac{1}{2}". 
   - Phân số phải dùng lệnh \\\\frac{a}{b}, KHÔNG dùng a/b.
   - Nếu bạn viết "\\delta", JSON sẽ bị lỗi "Bad escaped character". Bạn PHẢI viết "\\\\delta".

CẤU TRÚC JSON ĐẦU RA (MẪU ĐẦY ĐỦ):
{
  "metadata": { ... },
  "matrix_data": [ ... ],
  "specification_data": [ ... ],
  "exam_content": { ... },
  "answer_key": { ... }
}

YÊU CẦU:
1. Năng lực toán học: Phải gán đúng năng lực đặc trưng của môn học.
2. Mặc định tên trường: Luôn để school_name là "THCS Thị trấn Gia Lộc".
3. YÊU CẦU ĐẶC BIỆT CHO PHẦN 2 (ĐÚNG/SAI):
   - MỖI CÂU HỎI PHẢI CÓ MỘT ĐOẠN VĂN/BỐI CẢNH DẪN NHẬP CHUNG CHO CẢ 4 Ý a, b, c, d. 
   - 4 ý a, b, c, d phải khai thác các khía cạnh khác nhau của cùng một vấn đề/bài toán đó.
   - CÁC Ý a, b, c, d PHẢI ĐƯỢC SẮP XẾP THEO MỨC ĐỘ NHẬN THỨC TĂNG DẦN (a: Nhận biết -> d: Vận dụng cao).
   - TUYỆT ĐỐI KHÔNG ĐƯỢC THIẾU Ý NÀO.
`;

/**
 * Hàm hỗ trợ parse JSON an toàn hơn cho các trường hợp LaTeX bị thiếu escape backslash
 */
const safeJsonParse = (str: string) => {
  // 1. Remove markdown code blocks if present
  let cleanStr = str.replace(/```json\s*/g, "").replace(/```\s*$/g, "").trim();
  // Also remove simple code blocks
  cleanStr = cleanStr.replace(/```/g, "").trim();

  try {
    return JSON.parse(cleanStr);
  } catch (e: any) {
    console.warn("Lỗi parse JSON lần 1, đang thử sửa lỗi backslash...");
    // 2. Try to fix escaped characters
    const fixedStr = cleanStr.replace(/\\(?![/\\bfnrtu"'])/g, "\\\\");
    try {
      return JSON.parse(fixedStr);
    } catch (e2) {
      console.error("Không thể sửa lỗi JSON. Raw:", str);
      console.error("Fixed:", fixedStr);
      throw e;
    }
  }
};

export const generateExam = async (params: any, apiKey: string): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: apiKey || process.env.API_KEY || "" });
  const isRegularExam = params.type === 'Đề thường xuyên';

  let prompt = `Hãy tạo đề thi hoàn chỉnh cho:
  - Nội dung: "${params.topic}"
  - Môn: ${params.subject}, Lớp: ${params.grade}, Sách: ${params.bookSeries}
  - Thời gian: ${params.time} phút
  - Tỉ lệ nhận thức: Biết ${params.difficulty.nb}%, Hiểu ${params.difficulty.th}%, VD ${params.difficulty.vd}%, VDC ${params.difficulty.vdc}%
  - Số câu: Phần 1 (MC): ${params.questionConfig.p1.count}, Phần 2 (T/F): ${params.questionConfig.p2.count}, Phần 3 (Short): ${params.questionConfig.p3.count}, Tự luận: ${params.questionConfig.es.count}
  
  YÊU CẦU KỸ THUẬT:
  1. Sử dụng LaTeX chuẩn cho các công thức (ví dụ: \\\\frac{a}{b}). KHÔNG dùng $...$ cho chữ cái/văn bản thường.
  2. BẮT BUỘC thêm khoảng trắng (space) TRƯỚC và SAU các dấu ngoặc (), [], {} để tránh lỗi dính chữ (Ví dụ: "tập hợp A = { 1; 2 }" thay vì "tập hợp A={1;2}").
  3. BẮT BUỘC dùng double-backslash (\\\\) cho mọi lệnh LaTeX trong JSON.
  3. Năm học 2025-2026. 
  4. Tên trường: THCS Thị trấn Gia Lộc.
  5. Câu hỏi Đúng Sai bắt buộc phải có ngữ cảnh chung và 4 ý a,b,c,d với mức độ khó tăng dần.`;

  if (isRegularExam) {
    prompt += `
      6. ĐÂY LÀ ĐỀ THƯỜNG XUYÊN:
         - KHÔNG CẦN tạo "matrix_data" và "specification_data".
         - Chỉ trả về JSON chứa "metadata", "exam_content", và "answer_key".
         - Giữ nguyên cấu trúc các trường còn lại.`;
  } else {
    prompt += `
      6. ĐÂY LÀ ĐỀ ĐỊNH KỲ:
         - BẮT BUỘC phải có "matrix_data" và "specification_data" đầy đủ và khớp với đề thi.`;
  }

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
