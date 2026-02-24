import { Skeleton } from './ui/skeleton';

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 md:p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
          </div>
          <Skeleton className="h-10 w-16 mb-2" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="p-4 border-b border-gray-100">
      <div className="flex items-start justify-between gap-3 mb-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export function TasksListSkeleton() {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {[...Array(3)].map((_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
      <div className="p-4 border-t border-gray-100">
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function MyTasksSkeleton() {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-8 w-8" />
            </div>
          ))}
          <Skeleton className="h-12 w-full rounded-xl mt-4" />
        </div>
      </div>
    </div>
  );
}

export function AnnouncementCardSkeleton() {
  return (
    <div className="p-4 border-b border-gray-100">
      <Skeleton className="h-6 w-40 mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

export function AnnouncementsListSkeleton() {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {[...Array(3)].map((_, i) => (
          <AnnouncementCardSkeleton key={i} />
        ))}
      </div>
      <div className="p-4 border-t border-gray-100">
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}
