import React from 'react';
import { ExamMetadata } from '../types';

interface Props {
  metadata: ExamMetadata;
  sectionTitle: string;
  isAnswerKey?: boolean;
}

const ExamHeader: React.FC<Props> = ({ metadata, sectionTitle, isAnswerKey = false }) => {
  return (
    <div className="flex justify-between items-start mb-10 font-serif leading-tight">
      <div className="text-center w-[45%]">
        <p className="font-bold uppercase text-[12px]">{"THCS THỊ TRẤN GIA LỘC"}</p>
        <div className="border-t border-black w-32 mx-auto mt-1 mb-6"></div>
        <div className="border border-black px-4 py-1 inline-block font-bold text-[13px]">
          MÃ ĐỀ 1
        </div>
      </div>
      <div className="text-center w-[55%]">
        <h2 className="font-bold text-[14px] uppercase">{isAnswerKey ? 'HƯỚNG DẪN CHẤM' : sectionTitle}</h2>
        {isAnswerKey ? (
          <h2 className="font-bold text-[14px] uppercase mt-1">{sectionTitle}</h2>
        ) : (
          <p className="font-bold text-[13px] mt-1">Năm học: 2025 – 2026</p>
        )}
        <p className="font-bold text-[13px] uppercase mt-1">
          MÔN: {metadata.subject?.toUpperCase() || "TOÁN"} {metadata.grade || "7"}
        </p>
        <p className="text-[12px] mt-1">Thời gian làm bài: {metadata.time || 90} phút</p>
        {!isAnswerKey && <p className="text-[11px] italic mt-1">(Đề thi gồm có 02 trang)</p>}
      </div>
    </div>
  );
};

export default ExamHeader;