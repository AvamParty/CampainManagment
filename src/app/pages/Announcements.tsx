import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAnnouncements } from '../contexts/AnnouncementContext';
import { ThumbsUp, Heart, MessageCircle, Send, Smile } from 'lucide-react';

const reactionEmojis = ['👍', '❤️', '🔥', '👏', '😊', '💪'];

export default function Announcements() {
  const { user } = useAuth();
  const { announcements, addComment, addReaction } = useAnnouncements();
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [showReactions, setShowReactions] = useState<string | null>(null);

  if (!user) return null;

  const handleAddComment = (announcementId: string) => {
    const text = commentTexts[announcementId]?.trim();
    if (!text) return;

    addComment(announcementId, {
      userId: user.id,
      userName: user.name,
      content: text,
    });

    setCommentTexts({ ...commentTexts, [announcementId]: '' });
  };

  const handleAddReaction = (announcementId: string, emoji: string) => {
    addReaction(announcementId, emoji);
    setShowReactions(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">اطلاعیه‌ها</h1>
          <p className="text-gray-600">پیام‌ها و اعلامیه‌های ستاد مرکزی</p>
        </div>

        {/* Announcements List */}
        <div className="space-y-6">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Announcement Header */}
              <div className="p-4 md:p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {announcement.title}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {announcement.content}
                </p>
                {announcement.imageUrl && (
                  <img
                    src={announcement.imageUrl}
                    alt={announcement.title}
                    className="w-full rounded-lg mb-4"
                  />
                )}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="font-medium">{announcement.author}</span>
                  <span>•</span>
                  <span>{new Date(announcement.createdAt).toLocaleDateString('fa-IR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}</span>
                </div>
              </div>

              {/* Reactions */}
              <div className="px-4 md:px-6 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2 flex-wrap">
                  {Object.entries(announcement.reactions).map(([emoji, count]) => (
                    <button
                      key={emoji}
                      onClick={() => handleAddReaction(announcement.id, emoji)}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <span>{emoji}</span>
                      <span className="text-sm font-medium text-gray-700">{count}</span>
                    </button>
                  ))}
                  <div className="relative">
                    <button
                      onClick={() => setShowReactions(
                        showReactions === announcement.id ? null : announcement.id
                      )}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <Smile size={16} className="text-gray-600" />
                      <span className="text-sm text-gray-700">واکنش</span>
                    </button>
                    {showReactions === announcement.id && (
                      <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex gap-2 z-10">
                        {reactionEmojis.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => handleAddReaction(announcement.id, emoji)}
                            className="text-2xl hover:scale-125 transition-transform"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div className="p-4 md:p-6">
                <div className="flex items-center gap-2 mb-4 text-gray-700">
                  <MessageCircle size={18} />
                  <span className="font-medium">نظرات ({announcement.comments.length})</span>
                </div>

                {/* Comments List */}
                <div className="space-y-4 mb-4">
                  {announcement.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                        {comment.userName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="font-semibold text-sm text-gray-900 mb-1">
                            {comment.userName}
                          </p>
                          <p className="text-gray-700 text-sm">{comment.content}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 mr-3">
                          {new Date(comment.createdAt).toLocaleDateString('fa-IR', {
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1 flex gap-2 items-center min-w-0">
                    <input
                      type="text"
                      value={commentTexts[announcement.id] || ''}
                      onChange={(e) =>
                        setCommentTexts({
                          ...commentTexts,
                          [announcement.id]: e.target.value,
                        })
                      }
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddComment(announcement.id);
                        }
                      }}
                      placeholder="نظر خود را بنویسید..."
                      className="flex-1 min-w-0 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => handleAddComment(announcement.id)}
                      disabled={!commentTexts[announcement.id]?.trim()}
                      className="flex-shrink-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
