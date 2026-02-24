import { createBrowserRouter, redirect } from 'react-router';
import Root from './pages/Root';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import TaskDetail from './pages/TaskDetail';
import Profile from './pages/Profile';
import Announcements from './pages/Announcements';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, loader: () => redirect('/tasks') },
      { path: 'dashboard', Component: Dashboard },
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
      { path: 'tasks', Component: Tasks },
      { path: 'tasks/:taskId', Component: TaskDetail },
      { path: 'profile', Component: Profile },
      { path: 'announcements', Component: Announcements },
      { path: 'admin', Component: AdminPanel },
      { path: '*', Component: NotFound },
    ],
  },
]);
