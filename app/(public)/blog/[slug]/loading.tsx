export default function Loading() {
  return (
    <div className="container py-12 max-w-4xl">
      <div className="space-y-4">
        <div className="h-12 bg-muted animate-pulse rounded w-3/4" />
        <div className="h-6 bg-muted animate-pulse rounded w-1/2" />
        <div className="h-64 bg-muted animate-pulse rounded" />
        <div className="space-y-2">
          <div className="h-4 bg-muted animate-pulse rounded" />
          <div className="h-4 bg-muted animate-pulse rounded" />
          <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
        </div>
      </div>
    </div>
  );
}
