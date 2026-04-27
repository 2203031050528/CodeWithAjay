import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import VideoPlayer from '../components/VideoPlayer';
import PaymentButton from '../components/PaymentButton';
import ProgressBar from '../components/ProgressBar';
import Syllabus from '../components/Syllabus';
import syllabusData from '../data/syllabusData';
import useProgress from '../hooks/useProgress';
import AIChatPanel from '../components/AIChatPanel';
import CommentSection from '../components/CommentSection';
import { HiPlay, HiCheckCircle, HiLockClosed, HiClock, HiCollection, HiArrowLeft, HiBookOpen } from 'react-icons/hi';

const CoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { updateProgress, getProgress } = useProgress();
  const [course, setCourse] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [completedVideos, setCompletedVideos] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const fetchCourse = async () => {
    try {
      const { data } = await API.get(`/courses/${id}`);
      setCourse(data.data);
      setHasPurchased(data.hasPurchased);

      if (data.hasPurchased && data.data.videos?.length > 0) {
        setActiveVideo(data.data.videos[0]);
      }

      // Fetch progress
      if (data.hasPurchased) {
        const progress = await getProgress(id);
        if (progress) {
          setProgressData(progress.stats);
          const completed = new Set(
            progress.progress.filter(p => p.completed).map(p => p.videoId?._id || p.videoId)
          );
          setCompletedVideos(completed);
        }
      }
    } catch (error) {
      console.error('Failed to fetch course:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const handleProgressUpdate = useCallback((data) => {
    updateProgress(data);
  }, [updateProgress]);

  const handlePaymentSuccess = async () => {
    await refreshUser();
    fetchCourse();
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 rounded-full animate-spin" style={{
          borderWidth: '3px', borderStyle: 'solid', borderColor: '#6366f1', borderTopColor: 'transparent',
        }}></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="page-container text-center py-20">
        <p className="text-slate-400 text-lg">Course not found</p>
        <button onClick={() => navigate('/')} className="gradient-btn mt-4">Go Home</button>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors mb-6 bg-transparent border-none cursor-pointer text-sm"
      >
        <HiArrowLeft /> Back
      </button>

      {!hasPurchased ? (
        /* Course Landing (not purchased) */
        <div className="max-w-3xl mx-auto">
          <div className="glass p-8 sm:p-10 text-center animate-slide-up">
            <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6" style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(6, 182, 212, 0.2))',
            }}>
              <HiPlay className="text-4xl text-primary-400" />
            </div>

            <h1 className="text-3xl font-bold text-white mb-3">{course.title}</h1>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">{course.description}</p>

            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <HiCollection className="text-primary-400" />
                {course.videos?.length || 0} Videos
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <HiClock className="text-cyan-400" />
                {course.videos?.reduce((a, v) => a + (v.duration || 0), 0)} min
              </div>
            </div>

            {/* Video list preview */}
            <div className="text-left mb-8">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Course Content:</h3>
              <div className="space-y-2">
                {course.videos?.map((video, i) => (
                  <div key={video._id} className="flex items-center gap-3 p-3 rounded-lg" style={{
                    background: 'rgba(15, 13, 26, 0.5)',
                    border: '1px solid rgba(99, 102, 241, 0.06)',
                  }}>
                    <HiLockClosed className="text-slate-600 text-sm flex-shrink-0" />
                    <span className="text-slate-400 text-sm">{video.title}</span>
                    {video.duration > 0 && (
                      <span className="text-slate-600 text-xs ml-auto">{video.duration} min</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Full Syllabus Preview */}
            <div className="text-left mb-8">
              <div className="flex items-center gap-2 mb-4">
                <HiBookOpen className="text-primary-400 text-lg" />
                <h3 className="text-base font-semibold text-white">Full AI Engineer Syllabus</h3>
              </div>
              <p className="text-slate-500 text-xs mb-4">Click on any module to explore what you'll learn:</p>
              <Syllabus data={syllabusData} compact={true} />
            </div>

            <div className="max-w-sm mx-auto">
              <PaymentButton
                courseId={course._id}
                courseName={course.title}
                price={course.price}
                onSuccess={handlePaymentSuccess}
              />
              <p className="text-slate-500 text-xs mt-3">One-time payment • Lifetime access • Instant unlock</p>
            </div>
          </div>
        </div>
      ) : (
        /* Course Player (purchased) */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="glass p-4 sm:p-6">
              <VideoPlayer
                contentUrl={activeVideo?.contentUrl || activeVideo?.youtubeUrl}
                contentType={activeVideo?.contentType}
                videoId={activeVideo?._id}
                courseId={course._id}
                videoDuration={activeVideo?.duration}
                onProgressUpdate={handleProgressUpdate}
              />
              <div className="mt-4">
                <h2 className="text-xl font-bold text-white mb-1">{activeVideo?.title || 'Select content'}</h2>
                {activeVideo?.duration > 0 && (
                  <p className="text-slate-500 text-sm">Duration: {activeVideo.duration} minutes</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar — Video List */}
          <div className="lg:col-span-1">
            <div className="glass p-4 sm:p-5 sticky top-[88px]">
              <div className="mb-4">
                <h3 className="text-base font-semibold text-white mb-3">Course Content</h3>
                {progressData && (
                  <ProgressBar percent={progressData.percentComplete} size="sm" />
                )}
              </div>

              <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                <Syllabus
                  data={syllabusData}
                  compact={true}
                  availableContent={course.videos || []}
                  activeVideoId={activeVideo?._id}
                  completedVideoIds={completedVideos}
                  onContentClick={(video) => setActiveVideo(video)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Panel — only for purchased courses */}
      {hasPurchased && (
        <AIChatPanel
          courseId={course._id}
          videoId={activeVideo?._id}
          courseName={course.title}
          videoTitle={activeVideo?.title}
        />
      )}

      {/* Comments Section — only for purchased courses */}
      {hasPurchased && (
        <CommentSection courseId={course._id} videoId={activeVideo?._id} />
      )}
    </div>
  );
};

export default CoursePage;
