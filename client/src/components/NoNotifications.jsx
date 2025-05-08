import { MdNotificationsActive } from "react-icons/md";

const NoNotifications = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50 h-1/2">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce"
            >
              <MdNotificationsActive className="w-8 h-8 text-primary " />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold">No Notifications</h2>
        <p className="text-base-content/60">
        You currently have no notifications. Stay tuned for updates,
        or check back later to see if there's something new for you!
        </p>
      </div>
    </div>
  );
};

export default NoNotifications;