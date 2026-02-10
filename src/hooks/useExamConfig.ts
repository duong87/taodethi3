import { useState, useMemo } from 'react';
import { DEFAULT_DIFFICULTY, DEFAULT_QUESTION_CONFIG } from '../constants';

export const useExamConfig = () => {
    const [difficulty, setDifficulty] = useState(DEFAULT_DIFFICULTY);
    const [qConfig, setQConfig] = useState(DEFAULT_QUESTION_CONFIG);

    const totalDifficulty = useMemo(() => {
        return difficulty.nb + difficulty.th + difficulty.vd + difficulty.vdc;
    }, [difficulty]);

    const totalScore = useMemo(() => {
        return (qConfig.p1.count * qConfig.p1.score) +
            (qConfig.p2.count * qConfig.p2.score) +
            (qConfig.p3.count * qConfig.p3.score) +
            qConfig.es.score;
    }, [qConfig]);

    const isValidDifficulty = totalDifficulty === 100;
    const isValidScore = Math.abs(totalScore - 10) < 0.01;

    return {
        difficulty,
        setDifficulty,
        qConfig,
        setQConfig,
        totalDifficulty,
        totalScore,
        isValidDifficulty,
        isValidScore
    };
};
