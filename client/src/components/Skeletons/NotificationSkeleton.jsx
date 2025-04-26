import Skeleton from '@mui/material/Skeleton';
export function NotificationSkeleton() {
  // Create an array of 6 items for skeleton notifications
  const skeletonNotifications = Array(7).fill(null);

  return (
    <div className="flex-1 overflow-y-auto space-y-4">
      {skeletonNotifications.map((_, idx) => (
        <div key={idx} className="notification p-3">
          <div className="notification-image avatar">
          <Skeleton animation="wave" variant="circular" width={50} height={50} />
          </div>
          <div className="notification-header mb-1">
            <Skeleton animation="wave" variant="text" width={100} height={20} />
            <Skeleton animation="wave" variant="text" width={200} height={20} />
          </div>
        </div>
      ))}
    </div>
  );
}   