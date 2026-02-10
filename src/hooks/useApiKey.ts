import { useState, useEffect } from 'react';

export const useApiKey = () => {
    const [apiKey, setApiKey] = useState('');
    const [showApiKeyInput, setShowApiKeyInput] = useState(false);

    useEffect(() => {
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) setApiKey(savedKey);
    }, []);

    const saveKey = (key: string) => {
        setApiKey(key);
        localStorage.setItem('gemini_api_key', key);
    };

    const toggleInput = () => setShowApiKeyInput(prev => !prev);

    return {
        apiKey,
        showApiKeyInput,
        saveKey,
        toggleInput,
        setShowApiKeyInput
    };
};
