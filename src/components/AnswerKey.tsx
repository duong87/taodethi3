
import React from 'react';
import { AnswerKey, ExamMetadata, ExamData } from '../types';
import Latex from './Latex';
import { exportToWord } from '../services/word-export';

interface Props {
  data: AnswerKey;
  metadata: ExamMetadata;
  fullData?: ExamData;
}

const AnswerKeyView: React.FC<Props> = ({ data, metadata, fullData }) => {
  // Defensive checks for the data structure
  const header = data?.header || {
    title: "HƯỚNG DẪN CHẤM CHI TIẾT",
    part_1_note: "Mỗi câu đúng 0,25 điểm",
    part_2_note: "Điểm tối đa mỗi câu 1,0 điểm"
  };

  const part1 = data?.part_1 || [];
  const part2 = data?.part_2 || [];
  const part3 = data?.part_3 || [];
  const essay = data?.essay || [];

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4 no-print">
        <button 
          onClick={() => fullData && exportToWord(fullData)}
          className="bg-blue-600 text-white px-3 py-1 rounded text-xs flex items-center gap-1 hover:bg-blue-700 transition"
        >
          <i className="fas fa-file-word"></i> Tải Word Đáp án
        </button>
      </div>

      <div className="text-center mb-10">
        <h3 className="font-bold uppercase text-lg">{metadata?.school_name || "THCS THỊ TRẤN GIA LỘC"}</h3>
        <h2 className="text-xl font-bold uppercase mt-2">{header.title}</h2>
        <p className="font-bold uppercase">{metadata?.exam_title}</p>
        <p className="font-bold uppercase">Năm học 2025-2026</p>
        <p className="font-bold">MÔN: {metadata?.subject?.toUpperCase() || "TOÁN HỌC"}</p>
      </div>

      {part1.length > 0 && (
        <div className="mb-8">
          <h3 className="font-bold uppercase border-b-2 border-black pb-1 mb-4">PHẦN I. Câu trắc nghiệm nhiều phương án chọn</h3>
          <p className="italic text-sm mb-4">{header.part_1_note}</p>
          <div className="grid grid-cols-5 md:grid-cols-10 border border-black text-center">
            {part1.map((ans, i) => (
              <div key={i} className="border border-black flex flex-col">
                <span className="bg-gray-100 font-bold border-b border-black py-1">{ans.id}</span>
                <span className="py-2 font-bold text-blue-700">{ans.answer}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {part2.length > 0 && (
        <div className="mb-8">
          <h3 className="font-bold uppercase border-b-2 border-black pb-1 mb-4">PHẦN II. Câu trắc nghiệm đúng sai</h3>
          <p className="italic text-sm mb-4">{header.part_2_note}</p>
          <div className="space-y-4">
            {part2.map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <span className="font-bold min-w-[60px]">{item.id}:</span>
                <div className="grid grid-cols-4 gap-4 flex-1">
                  {item.sub_answers?.map((sub, j) => (
                    <div key={j} className="border rounded p-2 text-sm text-center">
                      <span className="font-bold">{sub.label})</span> <br/>
                      <span className={sub.result === 'Đúng' || sub.result === 'True' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                        {sub.result}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {part3.length > 0 && (
        <div className="mb-8">
          <h3 className="font-bold uppercase border-b-2 border-black pb-1 mb-4">PHẦN III. Câu trắc nghiệm trả lời ngắn (Giải thích chi tiết)</h3>
          <div className="space-y-4">
            {part3.map((ans, i) => (
              <div key={i} className="border p-4 rounded bg-white shadow-sm">
                <div className="flex justify-between items-center border-b pb-2 mb-2">
                  <span className="font-bold text-blue-800">{ans.id}</span>
                  <span className="font-bold text-lg text-blue-700">Đáp số: <Latex content={ans.answer} /></span>
                </div>
                {ans.explanation && (
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    <p className="font-semibold mb-1 text-gray-600">Hướng dẫn giải:</p>
                    <Latex content={ans.explanation} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {essay.length > 0 && (
        <div className="mb-8">
          <h3 className="font-bold uppercase border-b-2 border-black pb-1 mb-4">PHẦN TỰ LUẬN (Hướng dẫn chấm chi tiết)</h3>
          {essay.map((q, i) => (
            <div key={i} className="mb-6">
              <p className="font-bold text-gray-800 bg-gray-50 p-2 mb-2">{q.id} ({q.score_total})</p>
              <table className="w-full border-collapse border border-gray-400 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-400 p-2 w-20">Bước</th>
                    <th className="border border-gray-400 p-2">Nội dung giải chi tiết</th>
                    <th className="border border-gray-400 p-2 w-20">Điểm</th>
                  </tr>
                </thead>
                <tbody>
                  {q.steps?.map((step, si) => (
                    <tr key={si}>
                      <td className="border border-gray-400 p-2 text-center font-bold">{step.part_label}</td>
                      <td className="border border-gray-400 p-2 whitespace-pre-line"><Latex content={step.content} /></td>
                      <td className="border border-gray-400 p-2 text-center">{step.score}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-bold">
                    <td className="border border-gray-400 p-2 text-center" colSpan={2}>TỔNG ĐIỂM {q.id}</td>
                    <td className="border border-gray-400 p-2 text-center">{q.score_total}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnswerKeyView;
