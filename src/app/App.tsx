import { RouterProvider } from 'react-router'
import { AnnouncementProvider } from './contexts/AnnouncementContext'
import { AuthProvider } from './contexts/AuthContext'
import { TaskProvider } from './contexts/TaskContext'
import { router } from './routes'

export default function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <TaskProvider>
        <AnnouncementProvider>
          <RouterProvider router={router} />
        </AnnouncementProvider>
      </TaskProvider>
    </AuthProvider>
  )
}
