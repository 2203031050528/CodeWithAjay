import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import CourseCard from '../components/CourseCard';
import Syllabus from '../components/Syllabus';
import syllabusData from '../data/syllabusData';
import { useAuth } from '../context/AuthContext';
import { HiAcademicCap, HiLightningBolt, HiShieldCheck, HiClock, HiCode, HiStar, HiArrowRight, HiBookOpen, HiChip } from 'react-icons/hi';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
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
    fetchCourses();
  }, []);

  const features = [
    { icon: <HiChip className="text-2xl" />, title: 'Python to AI Agents', desc: 'Complete roadmap from Python basics to building production AI agents & LLM applications', color: '#6366f1' },
    { icon: <HiClock className="text-2xl" />, title: 'Lifetime Access', desc: 'Pay once, learn forever. Access all course content anytime, anywhere', color: '#06b6d4' },
    { icon: <HiShieldCheck className="text-2xl" />, title: 'Track Progress', desc: 'Monitor your learning journey with detailed progress tracking', color: '#10b981' },
    { icon: <HiLightningBolt className="text-2xl" />, title: 'Just ₹49', desc: 'Premium AI education at an unbeatable price. No hidden fees, no subscriptions', color: '#f59e0b' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{
        background: 'linear-gradient(180deg, #0a0a12 0%, #0f0d1a 100%)',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
      }}>
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-10 animate-float" style={{
            background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
          }} />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-8" style={{
            background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
            animation: 'float 4s ease-in-out infinite reverse',
          }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5" style={{
            background: 'radial-gradient(circle, #818cf8, transparent 70%)',
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 animate-fade-in" style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
            }}>
              <HiStar className="text-amber-400" />
              <span className="text-sm text-slate-300">Complete AI Engineer Roadmap 2025</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight animate-slide-up">
              <span className="text-white">Become an</span>{' '}
              <span className="gradient-text">AI Engineer</span>
              <br />
              <span className="text-white">for Just </span>
              <span style={{
                background: 'linear-gradient(135deg, #f59e0b, #f43f5e)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>₹49</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto animate-slide-up stagger-1">
              Master Python, Machine Learning, Deep Learning, LLMs, RAG, AI Agents & more.
              One-time payment. Lifetime access. Start your AI career today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-2">
              {isAuthenticated ? (
                <Link to="/dashboard" className="gradient-btn text-lg !py-4 !px-10 no-underline">
                  Go to Dashboard <HiArrowRight className="ml-1" />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="gradient-btn text-lg !py-4 !px-10 no-underline">
                    Get Started <HiArrowRight className="ml-1" />
                  </Link>
                  <a href="#syllabus" className="text-slate-300 hover:text-white transition-colors no-underline text-base font-medium px-6 py-4 rounded-xl" style={{
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                  }}>
                    View Full Syllabus ↓
                  </a>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto animate-slide-up stagger-3">
              {[
                { num: '11', label: 'Modules' },
                { num: '200+', label: 'Topics' },
                { num: '₹49', label: 'Lifetime' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-bold text-white">{s.num}</p>
                  <p className="text-slate-500 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4" style={{ background: '#0f0d1a' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Why Choose <span className="gradient-text">CodeWithAjay?</span></h2>
            <p className="text-slate-400 max-w-xl mx-auto">Everything you need to go from beginner to AI Engineer</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="glass-card p-6 text-center">
                <div className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-4" style={{
                  background: `${f.color}15`,
                  color: f.color,
                }}>
                  {f.icon}
                </div>
                <h3 className="text-white font-semibold text-base mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SYLLABUS SECTION ═══════════════ */}
      <section id="syllabus" className="py-24 px-4" style={{
        background: 'linear-gradient(180deg, #0a0a12 0%, #0f0d1a 50%, #0a0a12 100%)',
      }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{
              background: 'rgba(168, 85, 247, 0.1)',
              border: '1px solid rgba(168, 85, 247, 0.2)',
            }}>
              <HiBookOpen className="text-purple-400" />
              <span className="text-sm text-slate-300">Complete Curriculum</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Full <span className="gradient-text">AI Engineer</span> Syllabus
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              From Python fundamentals to building production AI agents — explore every topic you'll master.
              Click on any module to see the detailed breakdown.
            </p>
          </div>

          <Syllabus data={syllabusData} />

          {/* CTA after syllabus */}
          <div className="text-center mt-12 pt-8" style={{
            borderTop: '1px solid rgba(99, 102, 241, 0.1)',
          }}>
            <p className="text-slate-400 text-lg mb-6">All this for just <span className="text-amber-400 font-bold text-2xl">₹49</span> — Lifetime Access</p>
            {isAuthenticated ? (
              <Link to="/dashboard" className="gradient-btn text-lg !py-4 !px-10 no-underline">
                Go to Dashboard <HiArrowRight className="ml-1" />
              </Link>
            ) : (
              <Link to="/register" className="gradient-btn text-lg !py-4 !px-10 no-underline animate-pulse-glow">
                Start Learning Now <HiArrowRight className="ml-1" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-24 px-4" style={{ background: '#0f0d1a' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Our <span className="gradient-text">Courses</span></h2>
            <p className="text-slate-400">Start learning with our expertly crafted courses</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 rounded-full border-3 border-primary-500 border-t-transparent animate-spin" style={{
                borderWidth: '3px',
                borderStyle: 'solid',
                borderColor: '#6366f1',
                borderTopColor: 'transparent',
              }}></div>
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  hasPurchased={user?.purchasedCourses?.includes(course._id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-500">No courses available yet. Stay tuned!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #0f0d1a, #1a1730)',
      }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[400px] h-[400px] rounded-full opacity-10" style={{
            background: 'radial-gradient(circle, #6366f1, transparent 70%)',
          }} />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Become an AI Engineer?</h2>
          <p className="text-slate-400 text-lg mb-8">Join thousands of students mastering AI. Just ₹49 for lifetime access to the complete curriculum.</p>
          {isAuthenticated ? (
            <Link to="/dashboard" className="gradient-btn text-lg !py-4 !px-10 no-underline">
              Continue Learning <HiArrowRight className="ml-1" />
            </Link>
          ) : (
            <Link to="/register" className="gradient-btn text-lg !py-4 !px-10 no-underline animate-pulse-glow">
              Sign Up Now — It's ₹49 Only <HiArrowRight className="ml-1" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
