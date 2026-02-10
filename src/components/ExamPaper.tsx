import React from 'react';
import { ExamContent, ExamMetadata, ExamData } from '../types';
import Latex from './Latex';
import { exportToWord } from '../services/word-export';

interface Props {
  data: ExamContent;
  metadata: ExamMetadata;
  fullData?: ExamData;
}

const ExamPaper: React.FC<Props> = ({ data, metadata, fullData }) => {
  return (
    <div className="w-full bg-white print:p-0 font-serif">
      <div className="flex justify-end mb-4 no-print gap-2">
        <button
          onClick={() => fullData && exportToWord(fullData)}
          className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 hover:bg-blue-700 transition shadow-sm font-semibold"
        >
          <i className="fas fa-file-word"></i> Tải Đề thi (Word)
        </button>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-10 leading-snug">
        <div className="text-center w-5/12">
          <p className="font-bold text-sm uppercase">{"THCS THỊ TRẤN GIA LỘC"}</p>
          <p className="font-bold text-sm">________________</p>
          <div className="mt-4 border border-black px-4 py-1 inline-block font-bold text-sm">
            MÃ ĐỀ 101
          </div>
        </div>
        <div className="text-center w-7/12">
          <h2 className="font-bold text-lg uppercase">ĐỀ KIỂM TRA ĐỊNH KỲ</h2>
          <p className="font-bold text-md uppercase">MÔN: {metadata.subject.toUpperCase()} - KHỐI {metadata.grade}</p>
          <p className="italic text-sm">Năm học: 2025 – 2026</p>
          <p className="italic text-sm">Thời gian làm bài: {metadata.time} phút (không kể thời gian phát đề)</p>
        </div>
      </div>

      <div className="mb-6 border-b border-gray-400 pb-2">
        <p className="font-semibold text-sm">Họ và tên thí sinh: ....................................................................... Số báo danh: ....................</p>
      </div>

      {/* Part 1 */}
      <div className="mb-8">
        <h3 className="font-bold uppercase mb-2 text-md">PHẦN I. Câu trắc nghiệm nhiều phương án chọn</h3>
        <p className="italic mb-4 text-sm">Thí sinh trả lời từ câu 1 đến câu {data.part_1.length}. Mỗi câu hỏi thí sinh chỉ chọn một phương án.</p>

        <div className="space-y-6">
          {data.part_1.map((q, idx) => (
            <div key={idx} className="page-break-inside-avoid">
              <p className="font-semibold text-sm leading-relaxed"><span className="font-bold">{q.id}.</span> <Latex content={q.question} /></p>
              <div className="grid grid-cols-2 md:grid-cols-4 mt-2 gap-2 ml-4 text-sm max-w-full">
                {Object.entries(q.options).map(([key, val]) => (
                  <div key={key}>
                    <span className="font-bold">{key}.</span> <Latex content={val} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Part 2 */}
      {data.part_2 && data.part_2.length > 0 && (
        <div className="mb-8 page-break">
          <h3 className="font-bold uppercase mb-2 text-md">PHẦN II. Câu trắc nghiệm đúng sai</h3>
          <p className="italic mb-4 text-sm">Thí sinh trả lời các câu tiếp theo. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.</p>

          <div className="space-y-8">
            {data.part_2.map((q, idx) => (
              <div key={idx} className="page-break-inside-avoid">
                <p className="font-semibold mb-2 text-sm"><span className="font-bold">{q.id}.</span> <Latex content={q.context} /></p>
                <div className="ml-6 space-y-2 text-sm">
                  {q.items.map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="font-bold">{item.label})</span> <Latex content={item.text} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Part 3 */}
      {data.part_3 && data.part_3.length > 0 && (
        <div className="mb-8 page-break">
          <h3 className="font-bold uppercase mb-2 text-md">PHẦN III. Câu trắc nghiệm trả lời ngắn</h3>
          <p className="italic mb-4 text-sm">Thí sinh trả lời từ câu 1 đến câu {data.part_3.length}.</p>
          <div className="space-y-6">
            {data.part_3.map((q, idx) => (
              <div key={idx} className="page-break-inside-avoid">
                <p className="font-semibold text-sm"><span className="font-bold">{q.id}.</span> <Latex content={q.question} /></p>
                <div className="mt-2 border-b border-dotted border-gray-400 w-full h-8 flex items-end">
                  <span className="text-gray-300 text-xs italic">Đáp án: .......................................</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Essay */}
      {data.essay && data.essay.length > 0 && (
        <div className="mb-8 page-break">
          <h3 className="font-bold uppercase mb-2 text-md">PHẦN II. TỰ LUẬN</h3>
          <div className="space-y-6">
            {data.essay.map((q, idx) => (
              <div key={idx} className="page-break-inside-avoid">
                <p className="font-semibold text-sm leading-relaxed"><span className="font-bold">{q.id} ({q.points}).</span> <Latex content={q.question} /></p>
                <div className="mt-4 h-32 border border-dashed border-gray-300 rounded p-4 text-gray-400 text-xs italic">
                  Bài làm:
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center font-bold mt-16 mb-8 text-sm">
        ------------------ HẾT ------------------
        <p className="text-[11px] font-normal italic mt-2">(Thí sinh không được sử dụng tài liệu. Cán bộ coi thi không giải thích gì thêm)</p>
      </div>
    </div>
  );
};

export default ExamPaper;