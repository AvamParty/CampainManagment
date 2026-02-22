import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../api/client';
import { useAuth } from './AuthContext';

export type TaskType =
  | 'opinion'
  | 'research'
  | 'database'
  | 'coordination'
  | 'event'
  | 'referral'
  | 'creative'
  | 'content'
  | 'distribution'
  | 'communication'
  | 'resource';

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'approved' | 'rejected';

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  status?: TaskStatus;
  points: number;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  requiresCompleteProfile: boolean;
  createdBy: string;
  section?: string;
  details?: any;
}

export interface UserTask {
  taskId: string;
  userId: string;
  acceptedAt: string;
  completedAt?: string;
  status: TaskStatus;
  submission?: any;
}

interface TaskContextType {
  tasks: Task[];
  userTasks: UserTask[];
  isLoading: boolean;
  acceptTask: (taskId: string, userId: string) => void;
  submitTask: (taskId: string, userId: string, submission: any) => void;
  getUserTaskStatus: (taskId: string, userId: string) => UserTask | undefined;
  createTask: (task: Omit<Task, 'id'>) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);
const mapStatus = (status: string): TaskStatus => status.replace('_', '-') as TaskStatus;

export function TaskProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userTasks, setUserTasks] = useState<UserTask[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest<{ data: any[] }>('/tasks');
      setTasks(
        response.data.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          type: task.type,
          status: task.status ? mapStatus(task.status) : 'pending',
          points: task.points,
          deadline: task.deadline,
          priority: task.priority,
          requiresCompleteProfile: task.requiresCompleteProfile,
          createdBy: task.createdByUserId,
          section: task.section,
          details: task.details,
        })),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadAssignments = async () => {
    setIsLoading(true);
    try {
      const assignments = await apiRequest<any[]>('/tasks/my/assignments');
      setUserTasks(
        assignments.map(assignment => ({
          taskId: assignment.taskId,
          userId: assignment.userId,
          acceptedAt: assignment.acceptedAt,
          completedAt: assignment.completedAt ?? undefined,
          status: mapStatus(assignment.status),
          submission: assignment.submission?.submissionData,
        })),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      void loadTasks();
      void loadAssignments();
    }
  }, [isAuthenticated]);

  const acceptTask = (taskId: string, userId: string) => {
    void apiRequest(`/tasks/${taskId}/accept`, {
      method: 'POST',
    }).then(() => {
      void loadTasks();
      void loadAssignments();
    });
  };

  const submitTask = (taskId: string, userId: string, submission: any) => {
    void apiRequest(`/tasks/${taskId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ submissionData: submission }),
    }).then(() => {
      void loadTasks();
      void loadAssignments();
    });
  };

  const getUserTaskStatus = (taskId: string, userId: string) => {
    return userTasks.find(ut => ut.taskId === taskId && ut.userId === userId);
  };

  const createTask = (task: Omit<Task, 'id'>) => {
    void apiRequest('/admin/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        type: task.type,
        points: task.points,
        deadline: task.deadline,
        priority: task.priority,
        requiresCompleteProfile: task.requiresCompleteProfile,
        section: task.section,
        details: task.details,
      }),
    }).then(() => {
      void loadTasks();
    });
  };

  const contextValue = useMemo(() => ({
    tasks,
    userTasks,
    isLoading,
    acceptTask,
    submitTask,
    getUserTaskStatus,
    createTask,
  }), [tasks, userTasks, isLoading, acceptTask, submitTask, getUserTaskStatus, createTask]);

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
