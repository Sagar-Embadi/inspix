export function ProfileSkeleton() {
  return (
    <div className="flex flex-col w-full h-full p-4 gap-4 space-y-4 bg-gray-100 animate-pulse">
      <div className="flex items-center gap-5 space-x-4">
        <div className="w-25 h-30 bg-gray-300 rounded-full p-3 animate-pulse"></div>
        <div className="flex flex-col w-full gap-1">
          <div className="w-1/2 h-10 bg-gray-300 rounded animate-pulse"></div>
          <div className="w-1/2 h-10 bg-gray-300 rounded animate-pulse"></div>
          <div className="w-1/2 h-15 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="w-full h-10 bg-gray-300 rounded animate-pulse"></div>
      <div className="flex items-center gap-3 space-x-4 flex-wrap">
        <div className="w-30 h-30 bg-gray-300 rounded animate-pulse"></div>
        <div className="w-30 h-30 bg-gray-300 rounded animate-pulse"></div>
        <div className="w-30 h-30 bg-gray-300 rounded animate-pulse"></div>
        <div className="w-30 h-30 bg-gray-300 rounded animate-pulse"></div>
        <div className="w-30 h-30 bg-gray-300 rounded animate-pulse"></div>
        <div className="w-30 h-30 bg-gray-300 rounded animate-pulse"></div>
        <div className="w-30 h-30 bg-gray-300 rounded animate-pulse"></div>
        <div className="w-30 h-30 bg-gray-300 rounded animate-pulse"></div>
        <div className="w-30 h-30 bg-gray-300 rounded animate-pulse"></div>
        <div className="w-30 h-30 bg-gray-300 rounded animate-pulse"></div>
        <div className="w-30 h-30 bg-gray-300 rounded animate-pulse"></div>
      </div>
    </div>
  );
}
