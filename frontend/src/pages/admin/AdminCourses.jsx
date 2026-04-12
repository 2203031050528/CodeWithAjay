import { useEffect, useState } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash, HiX, HiPlay, HiArrowLeft } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import syllabusData from '../../data/syllabusData';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', price: 49, thumbnail: '' });
  const [videoForm, setVideoForm] = useState({ title: '', contentUrl: '', contentType: 'video', duration: 0, topicId: '' });

  const fetchCourses = async () => {
    try {
      const { data } = await API.get('/courses');
      setCourses(data.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    try {
      if (editCourse) {
        await API.put(`/admin/course/${editCourse}`, formData);
        toast.success('Course updated');
      } else {
        await API.post('/admin/course', formData);
        toast.success('Course created');
      }
      setShowModal(false);
      setEditCourse(null);
      setFormData({ title: '', description: '', price: 49, thumbnail: '' });
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save course');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!confirm('Delete this course and all its videos?')) return;
    try {
      await API.delete(`/admin/course/${id}`);
      toast.success('Course deleted');
      fetchCourses();
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/admin/course/${selectedCourseId}/video`, videoForm);
      toast.success('Video added');
      setShowVideoModal(false);
      setVideoForm({ title: '', contentUrl: '', contentType: 'video', duration: 0, topicId: '' });
      fetchCourses();
    } catch (error) {
      toast.error('Failed to add video');
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!confirm('Delete this video?')) return;
    try {
      await API.delete(`/admin/video/${videoId}`);
      toast.success('Video deleted');
      fetchCourses();
    } catch (error) {
      toast.error('Failed to delete video');
    }
  };

  const openEditModal = (course) => {
    setEditCourse(course._id);
    setFormData({
      title: course.title,
      description: course.description || '',
      price: course.price || 49,
      thumbnail: course.thumbnail || '',
    });
    setShowModal(true);
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

  return (
    <div className="page-container">
      <div className="flex items-center gap-3 mb-2">
        <Link to="/admin" className="text-slate-400 hover:text-white transition-colors"><HiArrowLeft className="text-lg" /></Link>
        <h1 className="text-2xl font-bold text-white">Course Management</h1>
      </div>
      <p className="text-slate-400 text-sm mb-6 ml-8">Create, edit, and manage courses and their videos</p>

      <button
        onClick={() => { setEditCourse(null); setFormData({ title: '', description: '', price: 49, thumbnail: '' }); setShowModal(true); }}
        className="gradient-btn text-sm mb-6"
      >
        <HiPlus /> Add New Course
      </button>

      {/* Course List */}
      <div className="space-y-4">
        {courses.map((course) => (
          <div key={course._id} className="glass-card p-5 hover:translate-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
              <div>
                <h3 className="text-white font-semibold text-base">{course.title}</h3>
                <p className="text-slate-400 text-xs mt-1">
                  ₹{course.price} • {course.videoCount || 0} videos • {course.totalDuration || 0} min
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setSelectedCourseId(course._id); setShowVideoModal(true); }}
                  className="gradient-btn-secondary gradient-btn text-xs !py-2 !px-3"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #10b981)' }}
                >
                  <HiPlus className="text-sm" /> Add Content
                </button>
                <button
                  onClick={() => openEditModal(course)}
                  className="p-2 rounded-lg transition-colors cursor-pointer bg-transparent"
                  style={{ border: '1px solid rgba(99, 102, 241, 0.2)', color: '#818cf8' }}
                >
                  <HiPencil />
                </button>
                <button
                  onClick={() => handleDeleteCourse(course._id)}
                  className="p-2 rounded-lg transition-colors cursor-pointer bg-transparent"
                  style={{ border: '1px solid rgba(244, 63, 94, 0.2)', color: '#f43f5e' }}
                >
                  <HiTrash />
                </button>
              </div>
            </div>

            {course.description && (
              <p className="text-slate-500 text-sm mb-3 line-clamp-2">{course.description}</p>
            )}
          </div>
        ))}

        {courses.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500">No courses yet. Click "Add New Course" to create one.</p>
          </div>
        )}
      </div>

      {/* Course Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal-content">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{editCourse ? 'Edit Course' : 'New Course'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white bg-transparent border-none cursor-pointer text-xl">
                <HiX />
              </button>
            </div>
            <form onSubmit={handleSubmitCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  placeholder="Course title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  placeholder="Course description"
                  rows={3}
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                    className="input-field"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Thumbnail URL</label>
                  <input
                    type="url"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    className="input-field"
                    placeholder="Optional"
                  />
                </div>
              </div>
              <button type="submit" className="gradient-btn w-full !mt-6">
                {editCourse ? 'Update Course' : 'Create Course'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowVideoModal(false); }}>
          <div className="modal-content">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Add Content</h2>
              <button onClick={() => setShowVideoModal(false)} className="text-slate-400 hover:text-white bg-transparent border-none cursor-pointer text-xl">
                <HiX />
              </button>
            </div>
            <form onSubmit={handleAddVideo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Syllabus Topic</label>
                <select
                  value={videoForm.topicId}
                  onChange={(e) => {
                    const selTopicId = e.target.value;
                    // Auto-fill title based on selection if empty
                    let autoTitle = videoForm.title;
                    if (!autoTitle && selTopicId) {
                      const selectedItem = document.querySelector(`option[value="${selTopicId}"]`)?.innerText;
                      if (selectedItem) autoTitle = selectedItem.replace(/-/g, '').trim();
                    }
                    setVideoForm({ ...videoForm, topicId: selTopicId, title: autoTitle });
                  }}
                  className="input-field"
                  required
                >
                  <option value="">-- Select a topic --</option>
                  {syllabusData.map(module => (
                    <optgroup key={module.id} label={`${module.title}`}>
                      {module.sections.map(section => 
                        section.topics.map(topic => 
                          topic.items.map(item => (
                            <option key={item.topicId} value={item.topicId}>
                              - {item.title}
                            </option>
                          ))
                        )
                      )}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Content Title</label>
                <input
                  type="text"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Introduction to React or Roadmap PDF"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Content Type</label>
                <select
                  value={videoForm.contentType}
                  onChange={(e) => setVideoForm({ ...videoForm, contentType: e.target.value })}
                  className="input-field"
                >
                  <option value="video">Video (YouTube embed)</option>
                  <option value="pdf">PDF</option>
                  <option value="image">Image</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Content URL</label>
                <input
                  type="url"
                  value={videoForm.contentUrl}
                  onChange={(e) => setVideoForm({ ...videoForm, contentUrl: e.target.value })}
                  className="input-field"
                  placeholder="URL for video, PDF, or image"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Duration (minutes)</label>
                <input
                  type="number"
                  value={videoForm.duration}
                  onChange={(e) => setVideoForm({ ...videoForm, duration: parseInt(e.target.value) || 0 })}
                  className="input-field"
                  min="0"
                />
              </div>
              <button type="submit" className="gradient-btn w-full !mt-6">Add Content</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;
