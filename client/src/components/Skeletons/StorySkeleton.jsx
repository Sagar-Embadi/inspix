import { useEffect, useState } from "react";

export const StorySkeleton = () => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    // Example dummy profiles
    setProfiles([1,2,3,4,5,6,7,8,9,10]);
  }, []);

  return (
    <div className="w-full p-4 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: "none" }}>
      <div className="flex gap-4">
        {profiles.map((profile) => (
          <div key={profile.id} className="flex flex-col items-center min-w-[60px]">
            <div className="w-14 h-14 rounded-full border-2 border-emerald-500 overflow-hidden">
              <div className="w-full h-full animate-pulse bg-gray-200 rounded-full"></div>
            </div>
            <div className="w-16 h-4 mt-2 animate-pulse bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

