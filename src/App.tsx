import React, { useState } from 'react';
import { generateExam } from './services/gemini';
import { exportToWord } from './services/word-export';
import { ExamData } from './types';
import Sidebar from './components/layout/Sidebar';
import ExamConfig from './components/exam/ExamConfig';
import ExamResults from './components/exam/ExamResults';
import { useApiKey } from './hooks/useApiKey';
import { useExamFilter } from './hooks/useExamFilter';
import { useExamConfig } from './hooks/useExamConfig';
import { EXAM_TYPES } from './constants';

const App: React.FC = () => {
    // Custom Hooks
    const { apiKey, showApiKeyInput, saveKey, toggleInput, setShowApiKeyInput } = useApiKey();
    const {
        examType, setExamType, grade, setGrade, subject, setSubject,
        bookSeries, setBookSeries, time, setTime, topic, setTopic
    } = useExamFilter();
    const {
        difficulty, setDifficulty, qConfig, setQConfig,
        totalDifficulty, totalScore, isValidDifficulty, isValidScore
    } = useExamConfig();

    // Local State
    const [isLoading, setIsLoading] = useState(false);
    const [examData, setExamData] = useState<ExamData | null>(null);
    const [activeTab, setActiveTab] = useState(0);

    const handleGenerate = async () => {
        if (!apiKey.trim()) {
            alert("Vui lòng nhập API Key để tiếp tục!");
            setShowApiKeyInput(true);
            return;
        }
        if (!topic.trim()) {
            alert("Vui lòng nhập nội dung kiến thức!");
            return;
        }

        setIsLoading(true);
        try {
            const result = await generateExam({
                topic,
                grade,
                subject,
                type: examType,
                time,
                bookSeries,
                difficulty,
                questionConfig: qConfig
            }, apiKey);
            setExamData(result);
            setActiveTab(examType === EXAM_TYPES.REGULAR ? 0 : 2);
        } catch (error) {
            console.error("Failed to generate exam:", error);
            alert("Có lỗi xảy ra trong quá trình tạo đề. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadWord = async () => {
        if (!examData) return;
        try {
            await exportToWord(examData);
        } catch (error) {
            console.error("Failed to export Word:", error);
            alert("Lỗi khi xuất file Word.");
        }
    };

    // Reset exam data when exam type changes
    const handleSetExamType = (type: string) => {
        setExamType(type);
        setExamData(null);
        setActiveTab(0);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar
                apiKey={apiKey}
                showApiKeyInput={showApiKeyInput}
                onToggleApiKey={toggleInput}
                onSaveApiKey={saveKey}
                examType={examType}
                setExamType={handleSetExamType}
                grade={grade}
                setGrade={setGrade}
                subject={subject}
                setSubject={setSubject}
                bookSeries={bookSeries}
                setBookSeries={setBookSeries}
                time={time}
                setTime={setTime}
                onReset={() => { }}
            />

            <main className="flex-1 p-8 overflow-y-auto">
                <ExamConfig
                    topic={topic}
                    setTopic={setTopic}
                    difficulty={difficulty}
                    setDifficulty={setDifficulty}
                    qConfig={qConfig}
                    setQConfig={setQConfig}
                    totalDifficulty={totalDifficulty}
                    totalScore={totalScore}
                    onGenerate={handleGenerate}
                    isLoading={isLoading}
                    isValidDifficulty={isValidDifficulty}
                    isValidScore={isValidScore}
                    hasExamData={!!examData}
                    onDownload={handleDownloadWord}
                />

                {examData && (
                    <ExamResults
                        examData={examData}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        examType={examType}
                    />
                )}
            </main>
        </div>
    );
};

export default App;
