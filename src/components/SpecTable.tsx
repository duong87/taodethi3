import React from 'react';
import { SpecRow, ExamMetadata, ExamData } from '../types';
import Latex from './Latex';
import { exportToWord } from '../services/word-export';

interface Props {
  data: SpecRow[];
  metadata: ExamMetadata;
  fullData?: ExamData;
}

const SpecTable: React.FC<Props> = ({ data, metadata, fullData }) => {
  const formatQuestionsWithCompetency = (row: SpecRow) => {
    const questions: string[] = [];
    const qMap = row.questions;
    
    const allQs = [
      qMap.mc?.nb, qMap.mc?.th, qMap.mc?.vd,
      qMap.tf?.nb, qMap.tf?.th, qMap.tf?.vd,
      qMap.sa?.nb, qMap.sa?.th, qMap.sa?.vd,
      qMap.es?.nb, qMap.es?.th, qMap.es?.vd
    ].filter(Boolean);

    if (allQs.length === 0) return '-';
    
    return allQs.map(q => `${q} (${row.competency || 'TDLL'})`).join(", ");
  };

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4 no-print">
        <button 
          onClick={() => fullData && exportToWord(fullData)}
          className="bg-blue-600 text-white px-3 py-1 rounded text-xs flex items-center gap-1 hover:bg-blue-700 transition"
        >
          <i className="fas fa-file-word"></i> Tải Word Đặc tả
        </button>
      </div>

      <div className="text-center mb-6">
        <h3 className="text-lg font-bold uppercase">{metadata.school_name || "THCS THỊ TRẤN GIA LỘC"}</h3>
        <h3 className="text-xl font-bold uppercase">BẢN ĐẶC TẢ ĐỀ KIỂM TRA {metadata.exam_title}</h3>
        <p className="font-semibold">MÔN {metadata.subject.toUpperCase()} – LỚP {metadata.grade}</p>
        <p className="text-sm">Năm học 2025-2026</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-800 text-[11px] leading-tight font-serif">
          <thead>
            <tr className="bg-gray-100 font-bold text-center">
              <th className="border border-gray-800 p-2 w-10">TT</th>
              <th className="border border-gray-800 p-2 w-32">Chủ đề/ Chương</th>
              <th className="border border-gray-800 p-2 w-40">Nội dung/ Đơn vị kiến thức</th>
              <th className="border border-gray-800 p-2">Yêu cầu cần đạt (Mức độ đánh giá)</th>
              <th className="border border-gray-800 p-2 w-36">Câu hỏi & Năng lực</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td className="border border-gray-800 p-2 text-center font-bold">{row.stt}</td>
                <td className="border border-gray-800 p-2 font-bold"><Latex content={row.topic} /></td>
                <td className="border border-gray-800 p-2"><Latex content={row.knowledge} /></td>
                <td className="border border-gray-800 p-2 italic leading-relaxed"><Latex content={row.criteria} /></td>
                <td className="border border-gray-800 p-2 text-center font-semibold text-blue-900">
                  {formatQuestionsWithCompetency(row)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpecTable;