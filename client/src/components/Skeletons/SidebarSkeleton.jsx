import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  // Create 8 skeleton items
  const skeletonContacts = Array(8).fill(null);

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex items-center gap-2 p-2 rounded-md bg-gray-200 animate-pulse">
        <Users className="w-5 h-5 text-gray-400" />
        <span className="h-10 w-24 bg-gray-300 rounded-md"></span>
      </div>
      {skeletonContacts.map((_, index) => (
        <div key={index} className="flex items-center gap-2 p-2 rounded-md bg-gray-200 animate-pulse">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <span className="h-4 w-24 bg-gray-300 rounded-md"></span>
        </div>
      ))}
      </div>
  );
};

export default SidebarSkeleton;