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
  { path: '/course/:id', component: CourseDetail },
  { path: '/lesson/:courseId/:lessonId', component: LessonDetail, layout: NotNewsLayout },
  { path: '/exams/:idTypeExam', component: Exams },
  { path: '/exam/:idExam', component: ExamDetail },
  { path: '/exam/questions/:idExam', component: QuestionExam, layout: NotNewsLayout }
];

const privateRoutes: Route[] = [];

export { publicRoutes, privateRoutes };
