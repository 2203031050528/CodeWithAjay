import { useEffect, useRef, useState } from 'react';
import { HiDownload, HiDocumentDownload } from 'react-icons/hi';

const VideoPlayer = ({ contentUrl, contentType = 'video', videoId, courseId, videoDuration, onProgressUpdate }) => {
  const timerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [watchTime, setWatchTime] = useState(0);

  // Extract YouTube video ID from URL
  const getYouTubeId = (url) => {
    if (!url) return '';
    const match = url.match(/(?:embed\/|watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : '';
  };

  // Start/stop progress tracking timer
  useEffect(() => {
    // Auto-start timer when video loads (simplified tracking)
    timerRef.current = setInterval(() => {
      setWatchTime(prev => {
        const newTime = prev + 10;
        // Send progress update every 10 seconds
        if (onProgressUpdate) {
          onProgressUpdate({
            courseId,
            videoId,
            timeSpent: 10, // Send incremental time
            videoDuration: videoDuration || 0,
          });
        }
        return newTime;
      });
    }, 10000); // Every 10 seconds

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [videoId, courseId, videoDuration, onProgressUpdate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!contentUrl) {
    return (
      <div className="aspect-video rounded-xl flex items-center justify-center" style={{
        background: 'rgba(15, 13, 26, 0.8)',
        border: '1px solid rgba(99, 102, 241, 0.1)',
      }}>
        <p className="text-slate-500 text-sm">Purchase the course to view content</p>
      </div>
    );
  }

  const renderContent = () => {
    if (contentType === 'image') {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a0a12] relative group">
          <img src={contentUrl} alt="Course Content" className="max-w-full max-h-full object-contain p-2" />
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <a 
              href={contentUrl} 
              download
              className="gradient-btn flex items-center gap-2 !py-2 shadow-xl"
            >
              <HiDownload /> Download Full Size
            </a>
          </div>
        </div>
      );
    }
    
    if (contentType === 'pdf') {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a0a12] p-8 text-center min-h-[400px]">
          <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6">
            <HiDocumentDownload className="text-5xl text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">PDF Resource Document</h3>
          <p className="text-slate-400 max-w-md mb-8">This resource is a downloadable PDF document. Click below to safely download or view it natively in your browser.</p>
          <a 
            href={contentUrl} 
            download
            className="gradient-btn flex items-center gap-2"
          >
            <HiDownload className="text-lg" /> Download PDF File
          </a>
        </div>
      );
    }

    // Default to video
    const ytId = getYouTubeId(contentUrl);
    // If not a recognized YT URL, just use the raw URL as fallback
    const embedUrl = ytId ? `https://www.youtube.com/embed/${ytId}?enablejsapi=0&rel=0&modestbranding=1` : contentUrl;
    
    return (
      <iframe
        src={embedUrl}
        title="Course Video"
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ border: 'none' }}
      />
    );
  };

  return (
    <div>
      <div 
        className={`rounded-xl overflow-hidden relative ${contentType === 'video' ? 'aspect-video' : 'min-h-[400px]'}`} 
        style={{
          border: '1px solid rgba(99, 102, 241, 0.15)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          background: '#0a0a12'
        }}
      >
        {renderContent()}
      </div>
      <div className="flex items-center justify-between mt-3 px-1">
        <p className="text-slate-500 text-xs">
          ⏱ Time spent: <span className="text-primary-400 font-medium">{formatTime(watchTime)}</span>
        </p>
        {videoDuration > 0 && (
          <p className="text-slate-500 text-xs">
            Duration: {videoDuration} min
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
