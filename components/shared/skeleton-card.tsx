export function SkeletonCard() {
  return (
    <div className="card-night overflow-hidden">
      <div className="skeleton bg-night-3" style={{ aspectRatio: '4/3' }} />
      <div className="p-3 space-y-2">
        <div className="skeleton h-3.5 w-3/4 rounded-md" />
        <div className="skeleton h-2.5 w-full rounded-md" />
        <div className="skeleton h-2.5 w-2/3 rounded-md" />
        <div className="flex items-center justify-between mt-3">
          <div className="skeleton h-5 w-14 rounded-md" />
          <div className="skeleton h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  )
}
