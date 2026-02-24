import { RouterProvider } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import { AnnouncementProvider } from './contexts/AnnouncementContext';
import { router } from './routes';

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <AnnouncementProvider>
          <RouterProvider router={router} />
        </AnnouncementProvider>
      </TaskProvider>
    </AuthProvider>
  );
}
