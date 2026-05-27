'use client'

export default function ListingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-orange-100 h-[450px] animate-pulse">
          <div className="aspect-[4/3] bg-orange-50" />
          <div className="p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-6 w-3/4 bg-orange-50 rounded" />
              <div className="h-4 w-12 bg-orange-50 rounded" />
            </div>
            <div className="h-4 w-1/2 bg-orange-50 rounded" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-4 bg-orange-50 rounded" />
              <div className="h-4 bg-orange-50 rounded" />
              <div className="h-4 bg-orange-50 rounded" />
              <div className="h-4 bg-orange-50 rounded" />
            </div>
            <div className="flex gap-4 mt-auto">
              <div className="h-8 w-1/3 bg-orange-50 rounded" />
              <div className="h-10 w-2/3 bg-orange-50 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
