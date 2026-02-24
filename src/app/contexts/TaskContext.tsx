import { createContext, useContext, useState, ReactNode } from 'react';

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
  status: TaskStatus;
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
  acceptTask: (taskId: string, userId: string) => void;
  submitTask: (taskId: string, userId: string, submission: any) => void;
  getUserTaskStatus: (taskId: string, userId: string) => UserTask | undefined;
  createTask: (task: Omit<Task, 'id'>) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Mock tasks data
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'نظرسنجی درباره اولویت‌های شهری',
    description: 'لطفا نظر خود را در مورد مهم‌ترین چالش‌های شهر در حوزه حمل و نقل بیان کنید',
    type: 'opinion',
    status: 'pending',
    points: 50,
    deadline: '2026-03-01',
    priority: 'high',
    requiresCompleteProfile: false,
    createdBy: 'ستاد مرکزی',
  },
  {
    id: '2',
    title: 'تحقیق درباره آلودگی هوا',
    description: 'تحقیق و جمع‌آوری اطلاعات درباره منابع اصلی آلودگی هوا در منطقه خود',
    type: 'research',
    status: 'pending',
    points: 200,
    deadline: '2026-03-15',
    priority: 'high',
    requiresCompleteProfile: true,
    createdBy: 'واحد تحقیقات',
  },
  {
    id: '3',
    title: 'جمع‌آوری اطلاعات مساجد محله',
    description: 'ثبت اطلاعات مساجد محل سکونت شامل نام، آدرس، و شماره تماس',
    type: 'database',
    status: 'pending',
    points: 100,
    deadline: '2026-03-10',
    priority: 'medium',
    requiresCompleteProfile: false,
    createdBy: 'واحد پایگاه داده',
  },
  {
    id: '4',
    title: 'هماهنگی سالن مدرسه برای سخنرانی',
    description: 'هماهنگی با مدارس محله برای برگزاری جلسات معارفه کاندیدا',
    type: 'coordination',
    status: 'pending',
    points: 150,
    deadline: '2026-02-28',
    priority: 'high',
    requiresCompleteProfile: false,
    createdBy: 'واحد هماهنگی',
  },
  {
    id: '5',
    title: 'حضور در گردهمایی محله',
    description: 'حضور در گردهمایی عصر امروز در پارک محله',
    type: 'event',
    status: 'pending',
    points: 100,
    deadline: '2026-02-19',
    priority: 'high',
    requiresCompleteProfile: false,
    createdBy: 'واحد رویدادها',
    details: {
      location: { lat: 35.7219, lng: 51.4048 },
      timeWindow: { start: '17:00', end: '20:00' },
    },
  },
  {
    id: '6',
    title: 'معرفی افراد علاقه‌مند به مشارکت',
    description: 'معرفی و دعوت افراد علاقه‌مند به همکاری با کمپین',
    type: 'referral',
    status: 'pending',
    points: 80,
    deadline: '2026-03-30',
    priority: 'medium',
    requiresCompleteProfile: false,
    createdBy: 'واحد جذب',
  },
  {
    id: '7',
    title: 'طراحی پوستر معرفی کاندیدا',
    description: 'طراحی پوستر جذاب برای معرفی کاندیدای شورای شهر',
    type: 'creative',
    status: 'pending',
    points: 250,
    deadline: '2026-02-25',
    priority: 'high',
    requiresCompleteProfile: true,
    createdBy: 'واحد تبلیغات',
  },
  {
    id: '8',
    title: 'نوشتن مقاله درباره برنامه‌های زیست محیطی',
    description: 'تولید محتوای نوشتاری درباره برنامه‌های کاندیدا در حوزه محیط زیست',
    type: 'content',
    status: 'pending',
    points: 180,
    deadline: '2026-03-05',
    priority: 'medium',
    requiresCompleteProfile: false,
    createdBy: 'واحد محتوا',
  },
  {
    id: '9',
    title: 'اشتراک‌گذاری پست در شبکه‌های اجتماعی',
    description: 'اشتراک‌گذاری آخرین پست کمپین در حساب‌های شخصی',
    type: 'distribution',
    status: 'pending',
    points: 30,
    deadline: '2026-02-20',
    priority: 'low',
    requiresCompleteProfile: false,
    createdBy: 'واحد رسانه',
  },
  {
    id: '10',
    title: 'تماس با لیست اعضا',
    description: 'تماس تلفنی با 20 نفر از لیست اعضا و اطلاع‌رسانی برنامه‌ها',
    type: 'communication',
    status: 'pending',
    points: 120,
    deadline: '2026-02-22',
    priority: 'medium',
    requiresCompleteProfile: false,
    createdBy: 'واحد ارتباطات',
  },
];

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [userTasks, setUserTasks] = useState<UserTask[]>([]);

  const acceptTask = (taskId: string, userId: string) => {
    const existingTask = userTasks.find(
      ut => ut.taskId === taskId && ut.userId === userId
    );
    
    if (!existingTask) {
      setUserTasks([
        ...userTasks,
        {
          taskId,
          userId,
          acceptedAt: new Date().toISOString(),
          status: 'in-progress',
        },
      ]);
    }
  };

  const submitTask = (taskId: string, userId: string, submission: any) => {
    setUserTasks(
      userTasks.map(ut =>
        ut.taskId === taskId && ut.userId === userId
          ? {
              ...ut,
              status: 'completed',
              completedAt: new Date().toISOString(),
              submission,
            }
          : ut
      )
    );
  };

  const getUserTaskStatus = (taskId: string, userId: string) => {
    return userTasks.find(ut => ut.taskId === taskId && ut.userId === userId);
  };

  const createTask = (task: Omit<Task, 'id'>) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
    };
    setTasks([newTask, ...tasks]);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        userTasks,
        acceptTask,
        submitTask,
        getUserTaskStatus,
        createTask,
      }}
    >
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
