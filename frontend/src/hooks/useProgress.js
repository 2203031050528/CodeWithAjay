import { useCallback } from 'react';
import API from '../api/axios';

const useProgress = () => {
  const updateProgress = useCallback(async ({ courseId, videoId, timeSpent, videoDuration }) => {
    try {
      await API.post('/progress/update', {
        courseId,
        videoId,
        timeSpent,
        videoDuration,
      });
    } catch (error) {
      // Silently fail — don't disrupt video watching
      console.error('Progress update failed:', error);
    }
  }, []);

  const getProgress = useCallback(async (courseId) => {
    try {
      const { data } = await API.get(`/progress/${courseId}`);
      return data.data;
    } catch (error) {
      console.error('Failed to fetch progress:', error);
      return null;
    }
  }, []);

  const getDailyStats = useCallback(async () => {
    try {
      const { data } = await API.get('/progress/daily/stats');
      return data.data;
    } catch (error) {
      console.error('Failed to fetch daily stats:', error);
      return [];
    }
  }, []);

  return { updateProgress, getProgress, getDailyStats };
};

export default useProgress;
