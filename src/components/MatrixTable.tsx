import React from 'react';
import { MatrixRow, ExamMetadata, ExamData } from '../types';
import Latex from './Latex';
import { exportToWord } from '../services/word-export';

interface Props {
  data: MatrixRow[];
  metadata: ExamMetadata;
  fullData?: ExamData;
}

const MatrixTable: React.FC<Props> = ({ data, metadata, fullData }) => {
  const totals = data.reduce((acc, row) => ({
    mc: { nb: acc.mc.nb + (row.mc?.nb || 0), th: acc.mc.th + (row.mc?.th || 0), vd: acc.mc.vd + (row.mc?.vd || 0) },
    tf: { nb: acc.tf.nb + (row.tf?.nb || 0), th: acc.tf.th + (row.tf?.th || 0), vd: acc.tf.vd + (row.tf?.vd || 0) },
    sa: { nb: acc.sa.nb + (row.sa?.nb || 0), th: acc.sa.th + (row.sa?.th || 0), vd: acc.sa.vd + (row.sa?.vd || 0) },
    es: { nb: acc.es.nb + (row.es?.nb || 0), th: acc.es.th + (row.es?.th || 0), vd: acc.es.vd + (row.es?.vd || 0) },
    summary: { nb: acc.summary.nb + (row.summary?.nb || 0), th: acc.summary.th + (row.summary?.th || 0), vd: acc.summary.vd + (row.summary?.vd || 0) }
  }), {
    mc: { nb: 0, th: 0, vd: 0 },
    tf: { nb: 0, th: 0, vd: 0 },
    sa: { nb: 0, th: 0, vd: 0 },
    es: { nb: 0, th: 0, vd: 0 },
    summary: { nb: 0, th: 0, vd: 0 }
  });

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4 no-print">
        <button 
          onClick={() => fullData && exportToWord(fullData)}
          className="bg-blue-600 text-white px-3 py-1 rounded text-xs flex items-center gap-1 hover:bg-blue-700 transition"
        >
          <i className="fas fa-file-word"></i> Tải Word Ma trận
        </button>
      </div>

      <div className="text-center mb-6">
        <h3 className="text-lg font-bold uppercase">{metadata.school_name}</h3>
        <h3 className="text-xl font-bold uppercase">MA TRẬN ĐỀ KIỂM TRA {metadata.exam_title}</h3>
        <p className="font-semibold">MÔN {metadata.subject.toUpperCase()} – LỚP {metadata.grade}</p>
        <p className="text-sm">Năm học 2025-2026</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-800 text-[10px] leading-tight">
          <thead>
            <tr className="bg-gray-100 font-bold">
              <th className="border border-gray-800 p-1" rowSpan={3}>TT</th>
              <th className="border border-gray-800 p-1" rowSpan={3}>Chủ đề/ Chương</th>
              <th className="border border-gray-800 p-1" rowSpan={3}>Nội dung/ đơn vị kiến thức</th>
              <th className="border border-gray-800 p-1" colSpan={12}>Mức độ đánh giá</th>
              <th className="border border-gray-800 p-1" colSpan={3} rowSpan={2}>Tổng</th>
              <th className="border border-gray-800 p-1" rowSpan={3}>Tỉ lệ % điểm</th>
            </tr>
            <tr className="bg-gray-100 font-bold">
              <th className="border border-gray-800 p-1" colSpan={9}>TNKQ</th>
              <th className="border border-gray-800 p-1" colSpan={3} rowSpan={1}>Tự luận</th>
            </tr>
            <tr className="bg-gray-100 font-bold">
              <th className="border border-gray-800 p-1 bg-orange-50" colSpan={3}>Nhiều lựa chọn</th>
              <th className="border border-gray-800 p-1 bg-blue-50" colSpan={3}>"Đúng – Sai"</th>
              <th className="border border-gray-800 p-1 bg-green-50" colSpan={3}>Trả lời ngắn</th>
              <th className="border border-gray-800 p-1 bg-pink-50">Biết</th>
              <th className="border border-gray-800 p-1 bg-pink-50">Hiểu</th>
              <th className="border border-gray-800 p-1 bg-pink-50">Vận dụng</th>
              <th className="border border-gray-800 p-1">Biết</th>
              <th className="border border-gray-800 p-1">Hiểu</th>
              <th className="border border-gray-800 p-1">Vận dụng</th>
            </tr>
            <tr className="bg-gray-100">
              <td colSpan={3}></td>
              <td className="border border-gray-800 p-1 font-bold text-center">Biết</td>
              <td className="border border-gray-800 p-1 font-bold text-center">Hiểu</td>
              <td className="border border-gray-800 p-1 font-bold text-center">VD</td>
              <td className="border border-gray-800 p-1 font-bold text-center">Biết</td>
              <td className="border border-gray-800 p-1 font-bold text-center">Hiểu</td>
              <td className="border border-gray-800 p-1 font-bold text-center">VD</td>
              <td className="border border-gray-800 p-1 font-bold text-center">Biết</td>
              <td className="border border-gray-800 p-1 font-bold text-center">Hiểu</td>
              <td className="border border-gray-800 p-1 font-bold text-center">VD</td>
              <td colSpan={3}></td>
              <td colSpan={3}></td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td className="border border-gray-800 p-1 text-center font-bold">{i + 1}</td>
                <td className="border border-gray-800 p-1 font-bold"><Latex content={row.topic} /></td>
                <td className="border border-gray-800 p-1"><Latex content={row.knowledge_block} /></td>
                <td className="border border-gray-800 p-1 text-center bg-orange-50/30">{row.mc?.nb || ''}</td>
                <td className="border border-gray-800 p-1 text-center bg-orange-50/30">{row.mc?.th || ''}</td>
                <td className="border border-gray-800 p-1 text-center bg-orange-50/30">{row.mc?.vd || ''}</td>
                <td className="border border-gray-800 p-1 text-center bg-blue-50/30">{row.tf?.nb || ''}</td>
                <td className="border border-gray-800 p-1 text-center bg-blue-50/30">{row.tf?.th || ''}</td>
                <td className="border border-gray-800 p-1 text-center bg-blue-50/30">{row.tf?.vd || ''}</td>
                <td className="border border-gray-800 p-1 text-center bg-green-50/30">{row.sa?.nb || ''}</td>
                <td className="border border-gray-800 p-1 text-center bg-green-50/30">{row.sa?.th || ''}</td>
                <td className="border border-gray-800 p-1 text-center bg-green-50/30">{row.sa?.vd || ''}</td>
                <td className="border border-gray-800 p-1 text-center bg-pink-50/30">{row.es?.nb || ''}</td>
                <td className="border border-gray-800 p-1 text-center bg-pink-50/30">{row.es?.th || ''}</td>
                <td className="border border-gray-800 p-1 text-center bg-pink-50/30">{row.es?.vd || ''}</td>
                <td className="border border-gray-800 p-1 text-center font-bold bg-gray-50">{row.summary?.nb || ''}</td>
                <td className="border border-gray-800 p-1 text-center font-bold bg-gray-50">{row.summary?.th || ''}</td>
                <td className="border border-gray-800 p-1 text-center font-bold bg-gray-50">{row.summary?.vd || ''}</td>
                <td className="border border-gray-800 p-1 text-center font-bold">{row.percent}%</td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-bold">
              <td className="border border-gray-800 p-1 text-center" colSpan={3}>Tổng số câu</td>
              <td className="border border-gray-800 p-1 text-center">{totals.mc.nb}</td>
              <td className="border border-gray-800 p-1 text-center">{totals.mc.th}</td>
              <td className="border border-gray-800 p-1 text-center">{totals.mc.vd}</td>
              <td className="border border-gray-800 p-1 text-center">{totals.tf.nb}</td>
              <td className="border border-gray-800 p-1 text-center">{totals.tf.th}</td>
              <td className="border border-gray-800 p-1 text-center">{totals.tf.vd}</td>
              <td className="border border-gray-800 p-1 text-center">{totals.sa.nb}</td>
              <td className="border border-gray-800 p-1 text-center">{totals.sa.th}</td>
              <td className="border border-gray-800 p-1 text-center">{totals.sa.vd}</td>
              <td className="border border-gray-800 p-1 text-center">{totals.es.nb}</td>
              <td className="border border-gray-800 p-1 text-center">{totals.es.th}</td>
              <td className="border border-gray-800 p-1 text-center">{totals.es.vd}</td>
              <td className="border border-gray-800 p-1 text-center">{totals.summary.nb}</td>
              <td className="border border-gray-800 p-1 text-center">{totals.summary.th}</td>
              <td className="border border-gray-800 p-1 text-center">{totals.summary.vd}</td>
              <td className="border border-gray-800 p-1 text-center">{totals.summary.nb + totals.summary.th + totals.summary.vd}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MatrixTable;