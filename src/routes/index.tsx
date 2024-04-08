import { ComponentType, ReactNode } from 'react';
import Login from '../pages/Auth/login';
import Home from '../pages/Home';
import Course from '../pages/Course';
import NotSidebarLayout from '../layouts/NotSidebarLayout';
import Register from '../pages/Auth/register';
import Exam from '../pages/Exam';
import CourseDetail from '../components/course-detail';

interface Route {
  path: string;
  layout?: ComponentType<{
    children: ReactNode;
  }> | null; // Sử dụng ComponentType cho layout
  component: ComponentType; // Sử dụng ComponentType cho component
}

const publicRoutes: Route[] = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/login',
    component: Login,
    layout: NotSidebarLayout // Đặt layout là null cho trường hợp này
  },
  {
    path: '/register',
    component: Register,
    layout: NotSidebarLayout // Đặt layout là null cho trường hợp này
  },
  {
    path: '/course',
    component: Course
  },
  {
    path: '/exam',
    component: Exam
  },
  {
    path: '/course/:id',
    component: CourseDetail
  }
];

const privateRoutes: Route[] = [];

export { publicRoutes, privateRoutes };
