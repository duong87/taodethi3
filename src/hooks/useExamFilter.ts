import { useState } from 'react';
import { SUBJECTS, GRADES, BOOK_SERIES, EXAM_TYPES } from '../constants';

export const useExamFilter = () => {
    const [examType, setExamType] = useState(EXAM_TYPES.PERIODIC);
    const [grade, setGrade] = useState('7');
    const [subject, setSubject] = useState(SUBJECTS[0]);
    const [bookSeries, setBookSeries] = useState(BOOK_SERIES[0]);
    const [time, setTime] = useState(90);
    const [topic, setTopic] = useState('');

    const resetFilters = () => {
        setExamType(EXAM_TYPES.PERIODIC);
        // Keep other filters as they might be relevant
    };

    return {
        examType,
        setExamType,
        grade,
        setGrade,
        subject,
        setSubject,
        bookSeries,
        setBookSeries,
        time,
        setTime,
        topic,
        setTopic,
        resetFilters
    };
};
