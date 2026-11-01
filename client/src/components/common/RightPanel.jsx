import { USERS_FOR_RIGHT_PANEL } from "../../utils/db/dummy";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { RightPanelSkeleton } from "../skeletons/RightPanelSkeleton";

export function RightPanel() {
  const isLoading = false;
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
            USERS_FOR_RIGHT_PANEL?.map((user) => (
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
                    onClick={(e) => e.preventDefault()}
                  >
                    Follow
                  </Button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
