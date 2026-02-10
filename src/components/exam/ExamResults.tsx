import React from 'react';
import { ExamData } from '../../types';
import MatrixTable from '../MatrixTable';
import SpecTable from '../SpecTable';
import ExamPaper from '../ExamPaper';
import AnswerKeyView from '../AnswerKey';
import { EXAM_TYPES } from '../../constants';

interface ExamResultsProps {
    examData: ExamData;
    activeTab: number;
    setActiveTab: (tab: number) => void;
    examType: string;
}

const ExamResults: React.FC<ExamResultsProps> = ({
    examData,
    activeTab,
    setActiveTab,
    examType
}) => {
    const tabs = React.useMemo(() => {
        if (examType === EXAM_TYPES.REGULAR) {
            return ['Xem trước Đề thi', 'Đáp án'];
        }
        return ['Ma trận', 'Bản đặc tả', 'Xem trước Đề thi', 'Đáp án'];
    }, [examType]);

    const renderContent = () => {
        if (examType === EXAM_TYPES.PERIODIC) {
            switch (activeTab) {
                case 0: return examData.matrix_data ? <MatrixTable data={examData.matrix_data} metadata={examData.metadata} fullData={examData} /> : <div className="p-4 text-center text-gray-500 italic">Không có dữ liệu Ma trận cho đề thi này</div>;
                case 1: return examData.specification_data ? <SpecTable data={examData.specification_data} metadata={examData.metadata} fullData={examData} /> : <div className="p-4 text-center text-gray-500 italic">Không có dữ liệu Bản đặc tả cho đề thi này</div>;
                case 2: return <ExamPaper data={examData.exam_content} metadata={examData.metadata} fullData={examData} />;
                case 3: return <AnswerKeyView data={examData.answer_key} metadata={examData.metadata} fullData={examData} />;
                default: return null;
            }
        } else {
            switch (activeTab) {
                case 0: return <ExamPaper data={examData.exam_content} metadata={examData.metadata} fullData={examData} />;
                case 1: return <AnswerKeyView data={examData.answer_key} metadata={examData.metadata} fullData={examData} />;
                default: return null;
            }
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden min-h-[600px]">
            <div className="flex border-b bg-gray-50 no-print overflow-x-auto">
                {tabs.map((label, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveTab(idx)}
                        className={`px-6 py-4 font-semibold text-sm transition-colors border-b-2 whitespace-nowrap ${activeTab === idx ? 'text-blue-600 border-blue-600 bg-white' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="p-8">
                {renderContent()}
            </div>
        </div>
    );
};

export default ExamResults;
