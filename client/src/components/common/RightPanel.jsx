import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { RightPanelSkeleton } from "../skeletons/RightPanelSkeleton";
import { useQuery } from "@tanstack/react-query";

import { useFollowUser } from "../../hooks/useFollowUser";
import { Spinner } from "../ui/spinner";

export function RightPanel() {
  const { followUser, isPending } = useFollowUser();
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/suggested`,
        {
          credentials: "include",
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong");

      return data;
    },
  });

  if (suggestedUsers?.length === 0) {
    return <div className="md:w-64 w-0"></div>;
  }

  return (
    <div className="hidden lg:block my-4 mx-2">
      <div className="bg-[#16181C] p-4 rounded-md sticky top-2">
        <p className="font-bold">Who to follow</p>
        <div className="flex flex-col gap-4">
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {!isLoading &&
            suggestedUsers?.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between gap-4"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div>
                    <div className="w-8 rounded-full">
                      <img
                        src={user.profileImg || "/avatar-placeholder.png"}
                        alt=""
                        className="rounded-full"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-28">
                      {user.fullName}
                    </span>
                    <span className="text-sm text-slate-500">
                      @{user.username}
                    </span>
                  </div>
                </div>
                <div>
                  <Button
                    type="button"
                    className="cursor-pointer"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      followUser(user?._id);
                    }}
                  >
                    {isPending ? <Spinner /> : "Follow"}
                  </Button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
