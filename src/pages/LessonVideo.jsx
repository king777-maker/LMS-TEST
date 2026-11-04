import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaPlay,
  FaBookOpen,
  FaImages,
  FaCheckCircle,
  FaExternalLinkAlt,
} from "react-icons/fa";

import { resolveCourse } from "../data/coursesResolver";
import { FREE_COURSE_DB_MAP } from "../constants/courseAvailability";
import { getCourseVideo, resolveVideoEmbedUrl } from "../constants/courseVideoCatalog";
import { getCourseProgress, toggleLessonCompleted, resolveUserId } from "../utils/progressTracker";
import { useAuth } from "../context/AuthContext";

const LessonVideo = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { courseId, lessonId } = useParams();

  const resolvedCourseId = FREE_COURSE_DB_MAP[String(courseId).toLowerCase().trim()] || courseId;
  const course = resolveCourse(resolvedCourseId) || resolveCourse(courseId);

  const [completed, setCompleted] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

  const courseVideo = getCourseVideo(resolvedCourseId);
  const videoUrl = resolveVideoEmbedUrl(courseVideo?.embedUrl || "", resolvedCourseId);

  // Sync completion status from progress tracker
  useEffect(() => {
    if (!resolvedCourseId) return;
    const userId = resolveUserId(user?.id);
    const progress = getCourseProgress(userId, resolvedCourseId, 5);
    const currentLessonNum = Number(lessonId) || 1;
    const isDone = (progress.completedLessonIds || []).includes(currentLessonNum) || Boolean(progress.isCompleted);
    setCompleted(isDone);
  }, [user, resolvedCourseId, lessonId]);

  const handleToggleComplete = () => {
    const userId = resolveUserId(user?.id);
    const currentLessonNum = Number(lessonId) || 1;
    const updated = toggleLessonCompleted(userId, resolvedCourseId, currentLessonNum, 5);
    setCompleted((updated.completedLessonIds || []).includes(currentLessonNum));
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-[#F4F7FC] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-[#183B73] mb-2">Course Not Found</h2>
        <p className="text-gray-500 mb-6">The requested course module could not be identified.</p>
        <button
          onClick={() => navigate("/free-courses")}
          className="px-6 py-2.5 bg-[#1E5FA8] hover:bg-[#164C82] text-white font-semibold rounded-xl transition shadow"
        >
          View Free Courses Catalog
        </button>
      </div>
    );
  }

  const courseTitle = course.name || course.title || "Course Program";
  const chapterNumber = lessonId || "1";

  return (
    <section className="bg-[#F4F7FC] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => navigate(`/learning/${resolvedCourseId}`)}
            className="flex items-center gap-2 text-[#1E5FA8] hover:text-[#183B73] font-semibold transition cursor-pointer"
          >
            <FaArrowLeft className="text-sm" />
            <span>Back to Full Curriculum</span>
          </button>

          <span className="text-xs font-semibold px-3 py-1 bg-white border border-gray-200 text-gray-600 rounded-full shadow-xs">
            Broadbeach LMS Player
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* HEADER */}
          <div className="px-6 py-5 border-b border-gray-100 bg-white">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-[#1E5FA8] uppercase tracking-wider">
                    Chapter {chapterNumber}
                  </span>
                  {courseVideo && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      Official HD Stream
                    </span>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#183B73]">
                  {courseTitle}
                </h1>
              </div>

              {/* Resource Tabs */}
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-2 bg-[#1E5FA8] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm"
                >
                  <FaPlay size={11} />
                  <span>Video Lecture</span>
                </button>

                <button
                  onClick={() => navigate(`/content/${resolvedCourseId}/${chapterNumber}`)}
                  className="flex items-center gap-2 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 transition cursor-pointer"
                >
                  <FaBookOpen size={12} />
                  <span>Syllabus</span>
                </button>

                <button
                  onClick={() => navigate(`/slides/${resolvedCourseId}/${chapterNumber}`)}
                  className="flex items-center gap-2 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 transition cursor-pointer"
                >
                  <FaImages size={12} />
                  <span>Slides</span>
                </button>
              </div>
            </div>
          </div>

          {/* VIDEO CONTAINER */}
          <div className="p-6">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-inner">
              {videoUrl ? (
                <>
                  <iframe
                    key={videoUrl}
                    src={videoUrl}
                    title={`${courseTitle} - Chapter ${chapterNumber} Lecture`}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    onLoad={() => setVideoLoading(false)}
                  />
                  {videoLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 text-white z-10 pointer-events-none">
                      <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                      <p className="text-sm font-medium">Loading HD Lecture Stream...</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
                  <p className="font-semibold text-lg mb-2">Video Stream Staged</p>
                  <p className="text-sm text-gray-400 max-w-md">
                    This lecture video is currently being updated. Please refer to course slides or proceed to the knowledge assessment.
                  </p>
                </div>
              )}
            </div>

            {/* Video Controls & Completion Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-5 border-t border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-[#183B73]">
                  Lecture: Chapter {chapterNumber} Overview
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Watch the complete training module before marking this chapter finished.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {courseVideo?.viewUrl && (
                  <a
                    href={courseVideo.viewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-blue-300 text-xs font-semibold text-gray-700 hover:text-blue-700 bg-white hover:bg-blue-50/50 transition shadow-xs"
                    title="Open stream in dedicated Google Drive tab"
                  >
                    <span>Full HD Player</span>
                    <FaExternalLinkAlt size={10} />
                  </a>
                )}

                <button
                  type="button"
                  onClick={handleToggleComplete}
                  className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition cursor-pointer ${
                    completed
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-green-600 hover:bg-green-700 text-white shadow-sm"
                  }`}
                >
                  <FaCheckCircle />
                  <span>{completed ? "Completed" : "Mark Complete"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default LessonVideo;
