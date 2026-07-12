import { useState, useEffect, useCallback } from 'react';
import { aiApi } from '../services/ai.api';

export function useAI() {
  const [status, setStatus] = useState({ running: false, provider: 'ollama', model: 'qwen2.5:3b' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkStatus = useCallback(async () => {
    try {
      const data = await aiApi.status();
      if (data && data.success) {
        setStatus({
          running: data.running,
          provider: data.provider || 'ollama',
          model: data.model || 'qwen2.5:3b'
        });
      } else {
        setStatus((prev) => ({ ...prev, running: false }));
      }
    } catch (err) {
      setStatus((prev) => ({ ...prev, running: false }));
    }
  }, []);

  const generateText = useCallback(async (type, data = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await aiApi.generate(type, data);
      if (response && response.success) {
        setLoading(false);
        return response.text;
      } else {
        const errorMsg = response?.message || 'Failed to generate text.';
        setError(errorMsg);
        setLoading(false);
        return null;
      }
    } catch (err) {
      const fallbackMsg = 'Connection error. Please start Ollama local AI server.';
      setError(fallbackMsg);
      setLoading(false);
      return null;
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  return {
    status,
    loading,
    error,
    checkStatus,
    generateText
  };
}
