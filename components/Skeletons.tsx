// Loading skeleton components for better UX

export function BookingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Header skeleton */}
            <div className="flex items-center gap-3 mb-3">
              <div className="h-6 w-32 bg-gray-200 rounded"></div>
              <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
            </div>
            {/* Content skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-48 bg-gray-200 rounded"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
          {/* Buttons skeleton */}
          <div className="flex gap-2">
            <div className="h-9 w-24 bg-gray-200 rounded-lg"></div>
            <div className="h-9 w-20 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function BookingListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <BookingSkeleton key={i} />
      ))}
    </div>
  )
}

export function StatsSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function CalendarSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div key={day} className="h-8 bg-gray-200 rounded"></div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </div>
  )
}

export function TimeSlotSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
      ))}
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-10 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
        <div className="h-12 w-36 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Stats skeleton */}
      <StatsSkeleton />

      {/* Tabs skeleton */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="flex border-b px-6 py-3">
          <div className="h-8 w-24 bg-gray-200 rounded mr-4"></div>
          <div className="h-8 w-28 bg-gray-200 rounded mr-4"></div>
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
        </div>
        
        {/* Content skeleton */}
        <div className="p-6">
          <BookingListSkeleton count={3} />
        </div>
      </div>
    </div>
  )
}

export function BookingPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Progress skeleton */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                {i < 3 && <div className="w-32 h-1 bg-gray-200 mx-2"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-8 animate-pulse"></div>
        
        {/* Lesson type cards skeleton */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-full bg-gray-200 rounded mb-1"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
