import { useState } from 'react';
import { HiChevronDown, HiChevronRight, HiCheckCircle, HiInformationCircle, HiPlay, HiLockClosed } from 'react-icons/hi';

const Syllabus = ({ data, compact = false, availableContent = [], activeVideoId = null, completedVideoIds = new Set(), onContentClick = null }) => {
  const [expandedModules, setExpandedModules] = useState(new Set());
  const [expandedSections, setExpandedSections] = useState(new Set());

  const toggleModule = (id) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSection = (key) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // Count total topics
  const totalTopics = data.reduce((acc, mod) =>
    acc + mod.sections.reduce((a, s) =>
      a + s.topics.reduce((t, topic) => t + topic.items.length, 0), 0), 0);

  const totalModules = data.length;

  return (
    <div>
      {/* Stats bar */}
      {!compact && (
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.15)',
          }}>
            <span className="text-primary-400 font-bold text-sm">{totalModules}</span>
            <span className="text-slate-400 text-sm">Modules</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{
            background: 'rgba(6, 182, 212, 0.1)',
            border: '1px solid rgba(6, 182, 212, 0.15)',
          }}>
            <span className="text-cyan-400 font-bold text-sm">{totalTopics}+</span>
            <span className="text-slate-400 text-sm">Topics</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.15)',
          }}>
            <span className="text-emerald-400 font-bold text-sm">∞</span>
            <span className="text-slate-400 text-sm">Lifetime Access</span>
          </div>
        </div>
      )}

      {/* Module list */}
      <div className="space-y-3">
        {data.map((module, moduleIndex) => {
          const isExpanded = expandedModules.has(module.id);
          const sectionCount = module.sections.length;
          const topicCount = module.sections.reduce((a, s) =>
            a + s.topics.reduce((t, topic) => t + topic.items.length, 0), 0);

          return (
            <div key={module.id} className="rounded-xl overflow-hidden" style={{
              border: isExpanded
                ? `1px solid ${module.color}30`
                : '1px solid rgba(99, 102, 241, 0.08)',
              background: isExpanded
                ? `rgba(15, 13, 26, 0.6)`
                : 'rgba(15, 13, 26, 0.3)',
              transition: 'all 0.3s ease',
            }}>
              {/* Module Header */}
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full flex items-center gap-3 p-4 sm:p-5 cursor-pointer bg-transparent border-none text-left transition-colors"
                style={{ color: 'inherit' }}
                id={`syllabus-module-${module.id}`}
              >
                <span className="text-2xl flex-shrink-0">{module.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-white font-semibold text-base sm:text-lg">{module.title}</h3>
                    {module.note && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{
                        background: `${module.color}15`,
                        color: module.color,
                      }}>
                        ⚡ {module.note.slice(0, 40)}...
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs mt-1">
                    {sectionCount} sections • {topicCount} topics
                  </p>
                </div>
                <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-transform" style={{
                  background: `${module.color}15`,
                  color: module.color,
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                }}>
                  <HiChevronDown className="text-lg" />
                </div>
              </button>

              {/* Module Content */}
              {isExpanded && (
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 animate-slide-up" style={{
                  borderTop: `1px solid ${module.color}10`,
                }}>
                  {module.sections.map((section, sIdx) => {
                    const sectionKey = `${module.id}-${sIdx}`;
                    const isSectionExpanded = expandedSections.has(sectionKey);

                    return (
                      <div key={sIdx} className="mt-3">
                        {/* Section Header */}
                        <button
                          onClick={() => toggleSection(sectionKey)}
                          className="w-full flex items-center gap-2 p-3 rounded-lg cursor-pointer bg-transparent border-none text-left transition-colors"
                          style={{
                            background: isSectionExpanded ? 'rgba(99, 102, 241, 0.06)' : 'transparent',
                            color: 'inherit',
                          }}
                        >
                          <HiChevronRight
                            className="text-sm flex-shrink-0 transition-transform"
                            style={{
                              color: module.color,
                              transform: isSectionExpanded ? 'rotate(90deg)' : 'rotate(0)',
                            }}
                          />
                          <span className="text-slate-200 font-medium text-sm">{section.title}</span>
                          <span className="text-slate-600 text-xs ml-auto">
                            {section.topics.reduce((a, t) => a + t.items.length, 0)} topics
                          </span>
                        </button>

                        {/* Section Topics */}
                        {isSectionExpanded && (
                          <div className="ml-5 mt-2 space-y-3 animate-fade-in">
                            {section.topics.map((topic, tIdx) => (
                              <div key={tIdx}>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: module.color }}></div>
                                  <span className="text-slate-300 font-medium text-sm">{topic.title}</span>
                                  {topic.optional && (
                                    <span className="badge badge-warning text-[10px] !py-0 !px-2">Optional</span>
                                  )}
                                </div>
                                {topic.note && (
                                  <div className="ml-4 mb-2 flex items-start gap-1.5 text-xs" style={{ color: module.color }}>
                                    <HiInformationCircle className="flex-shrink-0 mt-0.5" />
                                    <span>{topic.note}</span>
                                  </div>
                                )}
                                <div className="ml-4 grid grid-cols-1 sm:grid-cols-2 gap-1">
                                  {topic.items.map((item, iIdx) => {
                                    // Check if there is uploaded content matching this topicId
                                    const mappedContent = availableContent.find(c => c.topicId === item.topicId);
                                    const isClickable = !!mappedContent && !!onContentClick;
                                    const isActive = mappedContent && mappedContent._id === activeVideoId;
                                    const isCompleted = mappedContent && completedVideoIds.has(mappedContent._id);

                                    return (
                                      <div
                                        key={iIdx}
                                        onClick={() => isClickable && onContentClick(mappedContent)}
                                        className={`flex items-start gap-2 py-1.5 px-2 rounded-lg transition-colors ${
                                          isClickable ? 'cursor-pointer hover:bg-white/5' : ''
                                        }`}
                                        style={{
                                          background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                          border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                                        }}
                                      >
                                        <div className="mt-0.5 flex-shrink-0">
                                          {isCompleted ? (
                                            <HiCheckCircle className="text-emerald-400 text-sm" />
                                          ) : isActive ? (
                                            <HiPlay className="text-primary-400 text-sm" />
                                          ) : isClickable ? (
                                            <HiPlay className="text-primary-400/50 text-sm" />
                                          ) : availableContent.length > 0 ? (
                                            <HiLockClosed className="text-slate-600 text-xs" />
                                          ) : (
                                            <HiCheckCircle className="text-xs" style={{ color: `${module.color}80` }} />
                                          )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <span className={`text-xs leading-relaxed block ${isActive ? 'text-white font-medium' : isClickable ? 'text-slate-300' : 'text-slate-500'}`}>
                                            {item.title}
                                          </span>
                                          {mappedContent && mappedContent.duration > 0 && (
                                            <span className="text-[10px] text-slate-500">{mappedContent.duration} min</span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Syllabus;
