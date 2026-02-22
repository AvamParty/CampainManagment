import { createBrowserRouter, redirect } from 'react-router'
import AdminPanel from './pages/AdminPanel'
import Announcements from './pages/Announcements'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'
import Register from './pages/Register'
import Root from './pages/Root'
import TaskDetail from './pages/TaskDetail'
import Tasks from './pages/Tasks'

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
])
