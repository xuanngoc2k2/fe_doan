import { ComponentType, ReactNode } from 'react';
import Login from '../pages/Auth/login';
import Home from '../pages/Home';
import Course from '../pages/Course';
import NotSidebarLayout from '../layouts/NotSidebarLayout';

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
    path: '/course',
    component: Course,
    layout: NotSidebarLayout
  }
];

const privateRoutes: Route[] = [];

export { publicRoutes, privateRoutes };
