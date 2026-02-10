import React from 'react';
import { SUBJECTS, GRADES, BOOK_SERIES, EXAM_TYPES } from '../../constants';

interface SidebarProps {
    apiKey: string;
    showApiKeyInput: boolean;
    onToggleApiKey: () => void;
    onSaveApiKey: (key: string) => void;
    examType: string;
    setExamType: (type: string) => void;
    grade: string;
    setGrade: (grade: string) => void;
    subject: string;
    setSubject: (subject: string) => void;
    bookSeries: string;
    setBookSeries: (series: string) => void;
    time: number;
    setTime: (time: number) => void;
    onReset: () => void; // Optional reset
}

const Sidebar: React.FC<SidebarProps> = ({
    apiKey,
    showApiKeyInput,
    onToggleApiKey,
    onSaveApiKey,
    examType,
    setExamType,
    grade,
    setGrade,
    subject,
    setSubject,
    bookSeries,
    setBookSeries,
    time,
    setTime
}) => {
    return (
        <aside className="w-72 bg-white border-r border-gray-200 p-6 flex flex-col space-y-6 no-print overflow-y-auto max-h-screen">
            <div>
                <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
                    <i className="fas fa-file-signature"></i> AI Exam 2025
                </h1>
                <p className="text-xs text-gray-500 mt-1">Hệ thống tạo đề bằng AI</p>
            </div>

            <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-yellow-800">API Key (Gemini)</label>
                    <button
                        onClick={onToggleApiKey}
                        className="text-xs text-blue-600 underline"
                    >
                        {showApiKeyInput ? 'Ẩn' : 'Cài đặt'}
                    </button>
                </div>
                {(showApiKeyInput || !apiKey) && (
                    <>
                        <input
                            type="password"
                            className="w-full p-2 border rounded-md text-xs"
                            placeholder="Nhập API Key..."
                            value={apiKey}
                            onChange={(e) => onSaveApiKey(e.target.value)}
                        />
                        <p className="mt-1 text-[10px] text-gray-500">
                            Chưa có key? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Lấy key tại đây</a>
                        </p>
                    </>
                )}
                {!showApiKeyInput && apiKey && (
                    <p className="text-[10px] text-green-600 font-semibold"><i className="fas fa-check-circle"></i> Đã lưu API Key</p>
                )}
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold mb-1">Loại đề</label>
                    <div className="flex gap-2">
                        {[EXAM_TYPES.REGULAR, EXAM_TYPES.PERIODIC].map(t => (
                            <button
                                key={t}
                                onClick={() => setExamType(t)}
                                className={`flex-1 py-2 px-1 text-xs rounded-md border ${examType === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1">Lớp</label>
                    <select
                        className="w-full p-2 border rounded-md text-sm bg-white"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                    >
                        {GRADES.map((g) => (
                            <option key={g} value={g}>Lớp {g}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1">Môn học</label>
                    <select
                        className="w-full p-2 border rounded-md text-sm bg-white"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    >
                        {SUBJECTS.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1">Bộ sách</label>
                    <select
                        className="w-full p-2 border rounded-md text-sm bg-white"
                        value={bookSeries}
                        onChange={(e) => setBookSeries(e.target.value)}
                    >
                        {BOOK_SERIES.map(b => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1">Thời gian (phút)</label>
                    <input
                        type="number"
                        className="w-full p-2 border rounded-md text-sm"
                        value={time}
                        onChange={(e) => setTime(Number(e.target.value))}
                    />
                </div>
            </div>

            <div className="pt-4 border-t">
                <p className="text-xs text-gray-400">© 2025 AI Exam Tool</p>
            </div>
        </aside>
    );
};

export default Sidebar;
