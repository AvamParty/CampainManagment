import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../api/client';
import { useAuth } from './AuthContext';

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
  isLoading: boolean;
  addComment: (announcementId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  addReaction: (announcementId: string, reaction: string) => void;
  createAnnouncement: (announcement: Omit<Announcement, 'id' | 'comments' | 'reactions' | 'createdAt'>) => void;
}

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(undefined);

export function AnnouncementProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadAnnouncements = async () => {
    setIsLoading(true);
    try {
      const data = await apiRequest<Announcement[]>('/announcements');
      setAnnouncements(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      void loadAnnouncements();
    }
  }, [isAuthenticated]);

  const addComment = (
    announcementId: string,
    comment: Omit<Comment, 'id' | 'createdAt'>
  ) => {
    void apiRequest(`/announcements/${announcementId}/comments`, {
      method: 'POST',
      body: JSON.stringify({
        content: comment.content,
      }),
    }).then(() => {
      void loadAnnouncements();
    });
  };

  const addReaction = (announcementId: string, reaction: string) => {
    void apiRequest(`/announcements/${announcementId}/reactions`, {
      method: 'POST',
      body: JSON.stringify({
        emoji: reaction,
      }),
    }).then(() => {
      void loadAnnouncements();
    });
  };

  const createAnnouncement = (
    announcement: Omit<Announcement, 'id' | 'comments' | 'reactions' | 'createdAt'>
  ) => {
    void apiRequest('/announcements', {
      method: 'POST',
      body: JSON.stringify({
        title: announcement.title,
        content: announcement.content,
        imageUrl: announcement.imageUrl,
      }),
    }).then(() => {
      void loadAnnouncements();
    });
  };

  const contextValue = useMemo(() => ({
    announcements,
    isLoading,
    addComment,
    addReaction,
    createAnnouncement,
  }), [announcements, isLoading, addComment, addReaction, createAnnouncement]);

  return (
    <AnnouncementContext.Provider value={contextValue}>
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
