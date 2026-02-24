import { createContext, useContext, useState, ReactNode } from 'react';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  imageUrl?: string;
  comments: Comment[];
  reactions: Record<string, number>;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  replies?: Comment[];
  hidden?: boolean;
}

interface AnnouncementContextType {
  announcements: Announcement[];
  addComment: (announcementId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  addReaction: (announcementId: string, reaction: string) => void;
  createAnnouncement: (announcement: Omit<Announcement, 'id' | 'comments' | 'reactions' | 'createdAt'>) => void;
}

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(undefined);

const initialAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'آغاز کمپین انتخاباتی',
    content: 'با سلام و احترام، کمپین انتخاباتی حزب عوام ایران برای انتخابات شورای شهر به طور رسمی آغاز شد. از همه هواداران و داوطلبان دعوت می‌کنیم تا در این مسیر با ما همراه باشند.',
    author: 'ستاد مرکزی',
    createdAt: '2026-02-15T10:00:00Z',
    comments: [
      {
        id: 'c1',
        userId: '2',
        userName: 'مریم کریمی',
        content: 'آماده همکاری هستیم!',
        createdAt: '2026-02-15T11:00:00Z',
      },
    ],
    reactions: {
      '👍': 45,
      '❤️': 32,
      '🔥': 18,
    },
  },
  {
    id: '2',
    title: 'برنامه معارفه کاندیداها',
    content: 'جلسات معارفه کاندیداها از فردا در محله‌های مختلف آغاز خواهد شد. برنامه دقیق جلسات به زودی اعلام می‌شود.',
    author: 'واحد رویدادها',
    createdAt: '2026-02-16T14:30:00Z',
    comments: [],
    reactions: {
      '👍': 28,
      '📅': 15,
    },
  },
  {
    id: '3',
    title: 'نیاز به داوطلب برای طراحی گرافیک',
    content: 'واحد تبلیغات به دنبال داوطلبانی با مهارت طراحی گرافیک و ویرایش ویدیو است. در صورت تمایل، لطفا وظایف مرتبط را بپذیرید.',
    author: 'واحد تبلیغات',
    createdAt: '2026-02-17T09:00:00Z',
    comments: [
      {
        id: 'c2',
        userId: '2',
        userName: 'مریم کریمی',
        content: 'من می‌تونم کمک کنم',
        createdAt: '2026-02-17T10:00:00Z',
      },
    ],
    reactions: {
      '👍': 12,
      '🎨': 8,
    },
  },
];

export function AnnouncementProvider({ children }: { children: ReactNode }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);

  const addComment = (
    announcementId: string,
    comment: Omit<Comment, 'id' | 'createdAt'>
  ) => {
    setAnnouncements(
      announcements.map(announcement =>
        announcement.id === announcementId
          ? {
              ...announcement,
              comments: [
                ...announcement.comments,
                {
                  ...comment,
                  id: `c${Date.now()}`,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : announcement
      )
    );
  };

  const addReaction = (announcementId: string, reaction: string) => {
    setAnnouncements(
      announcements.map(announcement =>
        announcement.id === announcementId
          ? {
              ...announcement,
              reactions: {
                ...announcement.reactions,
                [reaction]: (announcement.reactions[reaction] || 0) + 1,
              },
            }
          : announcement
      )
    );
  };

  const createAnnouncement = (
    announcement: Omit<Announcement, 'id' | 'comments' | 'reactions' | 'createdAt'>
  ) => {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      comments: [],
      reactions: {},
    };
    setAnnouncements([newAnnouncement, ...announcements]);
  };

  return (
    <AnnouncementContext.Provider
      value={{
        announcements,
        addComment,
        addReaction,
        createAnnouncement,
      }}
    >
      {children}
    </AnnouncementContext.Provider>
  );
}

export function useAnnouncements() {
  const context = useContext(AnnouncementContext);
  if (context === undefined) {
    throw new Error('useAnnouncements must be used within an AnnouncementProvider');
  }
  return context;
}
