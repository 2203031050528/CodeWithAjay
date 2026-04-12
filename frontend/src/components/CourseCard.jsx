import { Link } from 'react-router-dom';
import { HiPlay, HiClock, HiCollection } from 'react-icons/hi';

const CourseCard = ({ course, hasPurchased, progress }) => {
  return (
    <div className="glass-card overflow-hidden group" id={`course-card-${course._id}`}>
      {/* Thumbnail */}
      <div className="aspect-video relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #1a1730, #252240)',
      }}>
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-3" style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(6, 182, 212, 0.3))',
              }}>
                <HiPlay className="text-3xl text-primary-400" />
              </div>
              <p className="text-slate-500 text-xs">{course.videoCount || 0} Videos</p>
            </div>
          </div>
        )}

        {/* Price Badge */}
        {!hasPurchased && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-lg text-xs font-bold" style={{
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
          }}>
            ₹{course.price}
          </div>
        )}

        {hasPurchased && (
          <div className="absolute top-3 right-3 badge badge-success">
            ✓ Enrolled
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
          background: 'rgba(0, 0, 0, 0.5)',
        }}>
          <Link to={`/course/${course._id}`} className="gradient-btn text-sm !py-2 !px-5 no-underline">
            {hasPurchased ? 'Continue Learning' : 'View Course'}
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-white font-semibold text-base mb-2 line-clamp-2 leading-snug">{course.title}</h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{course.description}</p>

        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <HiCollection className="text-primary-400" />
            {course.videoCount || 0} videos
          </span>
          <span className="flex items-center gap-1">
            <HiClock className="text-cyan-400" />
            {course.totalDuration || 0} min
          </span>
        </div>

        {progress !== undefined && progress > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Progress</span>
              <span className="text-primary-400 font-medium">{progress}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
              <div className="h-full rounded-full" style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
              }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
