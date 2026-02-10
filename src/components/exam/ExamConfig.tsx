import React from 'react';
import { DifficultyConfig, QuestionConfig } from '../../types';

interface ExamConfigProps {
    topic: string;
    setTopic: (topic: string) => void;
    difficulty: DifficultyConfig;
    setDifficulty: (diff: DifficultyConfig) => void;
    qConfig: QuestionConfig;
    setQConfig: (config: QuestionConfig) => void;
    totalDifficulty: number;
    totalScore: number;
    onGenerate: () => void;
    isLoading: boolean;
    isValidDifficulty: boolean;
    isValidScore: boolean;
    hasExamData: boolean;
    onDownload: () => void;
}

const ExamConfig: React.FC<ExamConfigProps> = ({
    topic,
    setTopic,
    difficulty,
    setDifficulty,
    qConfig,
    setQConfig,
    totalDifficulty,
    totalScore,
    onGenerate,
    isLoading,
    isValidDifficulty,
    isValidScore,
    hasExamData,
    onDownload
}) => {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6 no-print">
                <h2 className="text-2xl font-bold text-gray-800">Cấu hình Đề thi</h2>
                {hasExamData && (
                    <button
                        onClick={onDownload}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-md font-bold"
                    >
                        <i className="fas fa-file-word"></i> Tải Trọn bộ Word
                    </button>
                )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 no-print">
                <label className="block text-sm font-bold text-gray-700 mb-2">Nội dung kiến thức cần kiểm tra</label>
                <textarea
                    className="w-full h-32 p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
                    placeholder="Dán nội dung bài học hoặc các yêu cầu kiến thức tại đây..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                />

                <div className="space-y-6 mt-6">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-sm font-bold mb-3 flex items-center gap-2 text-blue-800">
                            <i className="fas fa-brain"></i> 1. Phân bổ mức độ nhận thức (%)
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Biết', key: 'nb' },
                                { label: 'Hiểu', key: 'th' },
                                { label: 'Vận dụng', key: 'vd' },
                                { label: 'Vận dụng cao', key: 'vdc' }
                            ].map(item => (
                                <div key={item.key}>
                                    <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">{item.label}</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border rounded text-sm text-center bg-white"
                                        value={difficulty[item.key as keyof DifficultyConfig]}
                                        onChange={(e) => setDifficulty({ ...difficulty, [item.key]: Number(e.target.value) })}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="mt-2 text-right">
                            <span className={`text-[10px] font-bold ${isValidDifficulty ? 'text-green-600' : 'text-red-600'}`}>
                                Tổng: {totalDifficulty}% {!isValidDifficulty && '(Phải là 100%)'}
                            </span>
                        </div>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                        <p className="text-sm font-bold mb-3 flex items-center gap-2 text-purple-800">
                            <i className="fas fa-list-ol"></i> 2. Số lượng câu hỏi & Tính điểm
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-2 p-3 bg-white rounded border border-purple-200">
                                <p className="text-xs font-bold text-purple-700 border-b pb-1">Phần I (MC)</p>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <label className="text-[9px] text-gray-400 block uppercase">Số câu</label>
                                        <input type="number" className="w-full p-1 border rounded text-xs text-center" value={qConfig.p1.count} onChange={e => setQConfig({ ...qConfig, p1: { ...qConfig.p1, count: Number(e.target.value) } })} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[9px] text-gray-400 block uppercase">Điểm/câu</label>
                                        <input type="number" step="0.05" className="w-full p-1 border rounded text-xs text-center" value={qConfig.p1.score} onChange={e => setQConfig({ ...qConfig, p1: { ...qConfig.p1, score: Number(e.target.value) } })} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 p-3 bg-white rounded border border-purple-200">
                                <p className="text-xs font-bold text-purple-700 border-b pb-1">Phần II (T/F)</p>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <label className="text-[9px] text-gray-400 block uppercase">Số câu</label>
                                        <input type="number" className="w-full p-1 border rounded text-xs text-center" value={qConfig.p2.count} onChange={e => setQConfig({ ...qConfig, p2: { ...qConfig.p2, count: Number(e.target.value) } })} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[9px] text-gray-400 block uppercase">Điểm tối đa</label>
                                        <input type="number" step="0.05" className="w-full p-1 border rounded text-xs text-center" value={qConfig.p2.score} onChange={e => setQConfig({ ...qConfig, p2: { ...qConfig.p2, score: Number(e.target.value) } })} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 p-3 bg-white rounded border border-purple-200">
                                <p className="text-xs font-bold text-purple-700 border-b pb-1">Phần III (Short)</p>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <label className="text-[9px] text-gray-400 block uppercase">Số câu</label>
                                        <input type="number" className="w-full p-1 border rounded text-xs text-center" value={qConfig.p3.count} onChange={e => setQConfig({ ...qConfig, p3: { ...qConfig.p3, count: Number(e.target.value) } })} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[9px] text-gray-400 block uppercase">Điểm/câu</label>
                                        <input type="number" step="0.05" className="w-full p-1 border rounded text-xs text-center" value={qConfig.p3.score} onChange={e => setQConfig({ ...qConfig, p3: { ...qConfig.p3, score: Number(e.target.value) } })} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 p-3 bg-white rounded border border-purple-200">
                                <p className="text-xs font-bold text-purple-700 border-b pb-1">Phần Tự luận</p>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <label className="text-[9px] text-gray-400 block uppercase">Số câu</label>
                                        <input type="number" className="w-full p-1 border rounded text-xs text-center" value={qConfig.es.count} onChange={e => setQConfig({ ...qConfig, es: { ...qConfig.es, count: Number(e.target.value) } })} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[9px] text-gray-400 block uppercase">Tổng điểm</label>
                                        <input type="number" step="0.5" className="w-full p-1 border rounded text-xs text-center" value={qConfig.es.score} onChange={e => setQConfig({ ...qConfig, es: { ...qConfig.es, score: Number(e.target.value) } })} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-between items-center bg-white p-2 rounded border border-purple-200">
                            <span className="text-xs font-semibold text-gray-600">Tổng quan đề thi:</span>
                            <span className={`text-sm font-bold ${isValidScore ? 'text-green-600' : 'text-red-600'}`}>
                                Tổng cộng: {totalScore.toFixed(2)} / 10.00 điểm
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onGenerate}
                    disabled={isLoading || !isValidDifficulty || !isValidScore}
                    className={`w-full mt-6 py-4 rounded-xl font-bold text-white shadow-lg transition flex items-center justify-center gap-2 ${isLoading || !isValidDifficulty || !isValidScore ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}
                >
                    {isLoading ? <><i className="fas fa-circle-notch fa-spin"></i> ĐANG TẠO ĐỀ...</> : <><i className="fas fa-magic"></i> BẮT ĐẦU TẠO ĐỀ THI</>}
                </button>
            </div>
        </div>
    );
};

export default ExamConfig;
