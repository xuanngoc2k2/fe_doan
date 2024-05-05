import { ComponentType, ReactNode } from 'react';
import Login from '../pages/Auth/login';
import Home from '../pages/Home';
import Course from '../pages/Course';
import NotSidebarLayout from '../layouts/NotSidebarLayout';
import Register from '../pages/Auth/register';
import Exam from '../pages/Exams';
import CourseDetail from '../components/course-detail';
import LessonDetail from '../components/lesson-detail';
import NotNewsLayout from '../layouts/NotNewsLayout';
import Exams from '../pages/Exams';
import ExamDetail from '../components/exam-detail';
import QuestionExam from '../components/question-exam';
import Result from '../pages/Result/result';
import ResultDetail from '../pages/Result/result-detail';
import Vocabulary from '../pages/Vocabulary';
import VocabularyDetail from '../pages/Vocabulary/vocab-detail';
import FlashcardList from '../components/flashcard-list';
import Profile from '../pages/Profile';
import AdminLayout from '../pages/Admin/admin.layout';
import Dashboard from '../pages/Admin/dashboard';
import AdminCourse from '../pages/Admin/Course/course';
import AdminLesson from '../pages/Admin/Lesson/lesson';
import AdminQuestion from '../pages/Admin/Question/question';
import QuestionDetail from '../pages/Admin/Question/question-detail';
import AdminExam from '../pages/Admin/Exam/exam';
import AdminExamDetail from '../pages/Admin/Exam/create-new-exam'
import AdminVocabulary from '../pages/Admin/Vocabulary/vocab';
import AdminNews from '../pages/Admin/News/news';
interface Route {
  path: string;
  layout?: ComponentType<{
    children: ReactNode;
  }> | null; // Sử dụng ComponentType cho layout
  component: ComponentType; // Sử dụng ComponentType cho component
}

const publicRoutes: Route[] = [
  { path: '/', component: Home },
  { path: '/login', component: Login, layout: NotSidebarLayout },
  { path: '/register', component: Register, layout: NotSidebarLayout },
  { path: '/course', component: Course },
  { path: '/exams', component: Exam },
  { path: '/vocab', component: Vocabulary },
  { path: '/vocab-detail/:idList', component: VocabularyDetail },
  { path: '/course/:id', component: CourseDetail },
  { path: '/exams/:idTypeExam', component: Exams },
  { path: '/exam/:idExam', component: ExamDetail },
  // { path: '/lesson/:courseId/:lessonId', component: LessonDetail, layout: NotNewsLayout },
  // { path: '/exam/questions/:idExam', component: QuestionExam, layout: NotNewsLayout },
  // { path: '/result/', component: Result, },
  // { path: '/result-detail/:resultId', component: ResultDetail, },
  // { path: '/flashcards/:idList', component: FlashcardList, },
  // { path: '/user', component: Profile, }
];
const protectedRouter: Route[] = [
  { path: '/flashcards/:idList', component: FlashcardList, },
  { path: '/user', component: Profile, },
  { path: '/result-detail/:resultId', component: ResultDetail, },
  { path: '/result/', component: Result, },
  { path: '/lesson/:courseId/:lessonId', component: LessonDetail, layout: NotNewsLayout },
  { path: '/exam/questions/:idExam', component: QuestionExam, layout: NotNewsLayout },
  // { path: '/course/:id', component: CourseDetail },
]
const privateRoutes: Route[] = [
  { path: '/admin', component: Dashboard, layout: AdminLayout },
  { path: '/admin/course', component: AdminCourse, layout: AdminLayout },
  { path: '/admin/question', component: AdminQuestion, layout: AdminLayout },
  { path: '/admin/question/:id', component: QuestionDetail, layout: AdminLayout },
  { path: '/admin/lesson', component: AdminLesson, layout: AdminLayout },
  { path: '/admin/exam', component: AdminExam, layout: AdminLayout },
  { path: '/admin/exam/:id', component: AdminExamDetail, layout: AdminLayout },
  { path: '/admin/vocabulary', component: AdminVocabulary, layout: AdminLayout },
  { path: '/admin/news', component: AdminNews, layout: AdminLayout },
];

export { publicRoutes, privateRoutes, protectedRouter };
