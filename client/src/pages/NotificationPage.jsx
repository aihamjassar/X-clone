import { Link } from "react-router-dom";
import { SettingsIcon, UserIcon, HeartIcon } from "lucide-react";
import { Spinner } from "../components/ui/spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { toast } from "../components/ui/toast";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function NotificationPage() {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch(`/api/v1/notifications`, {
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong");

      return data;
    },
  });

  const { mutate: deleteNotifications } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/v1/notifications`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Something went wrong");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.add({
        type: "success",
        title: "Notifications",
        description: "Notifications deleted successfully",
      });
    },
    onError: () => {
      toast.add({
        type: "error",
        title: "Notifications",
        description: "Failed to delete notifications",
      });
    },
  });

  return (
    <>
      <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <p className="font-bold">Notifications</p>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant={"ghost"} size="icon">
                  <SettingsIcon className="w-4" />
                </Button>
              }
            />
            <DropdownMenuContent className="w-52" onClick={deleteNotifications}>
              <DropdownMenuItem>Delete all notifications</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {isLoading && (
          <div className="flex justify-center h-full items-center">
            <Spinner className="size-5" />
          </div>
        )}
        {notifications?.length === 0 && (
          <div className="text-center p-4 font-bold">No notifications 🤔</div>
        )}
        {notifications?.map((notification) => (
          <div className="border-b border-gray-700" key={notification._id}>
            <div className="flex gap-2 p-4">
              {notification.type === "follow" && (
                <UserIcon className="w-7 h-7 text-blue-500 fill-blue-500" />
              )}
              {notification.type === "like" && (
                <HeartIcon className="w-7 h-7 text-red-500 fill-red-500" />
              )}
              <Link
                to={`/profile/${notification.from.username}`}
                className="flex gap-2"
              >
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img
                      src={
                        notification.from.profileImg ||
                        "/avatar-placeholder.png"
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-1">
                  <span className="font-bold">
                    @{notification.from.username}
                  </span>{" "}
                  {notification.type === "follow"
                    ? "followed you"
                    : "liked your post"}
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
