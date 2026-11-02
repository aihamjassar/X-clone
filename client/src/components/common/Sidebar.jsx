import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BellIcon, HomeIcon, LogOutIcon, UserIcon } from "lucide-react";
import { XSvg } from "../svgs/X";
import { toast } from "../ui/toast";

export function Sidebar() {
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const sidebarItems = [
    {
      href: "/",
      Icon: HomeIcon,
      text: "Home",
    },
    {
      href: "/notifications",
      Icon: BellIcon,
      text: "Notifications",
    },
    {
      href: authUser ? `/profile/${authUser.username}` : "/",
      Icon: UserIcon,
      text: "Profile",
    },
  ];

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to logout");
    },
    onSuccess: () => {
      toast.add({
        type: "success",
        title: "Logout",
        description: "Logged out successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.add({
        type: "error",
        title: "Logout",
        description: error.message,
      });
    },
  });

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
        <Link to="/" className="flex justify-center md:justify-start">
          <XSvg className="px-2 size-12 rounded-full fill-white hover:bg-stone-900" />
        </Link>
        <ul className="flex flex-col gap3 mt-4">
          {sidebarItems.map(({ href, Icon, text }) => (
            <li className="flex justify-center md:justify-start" key={href}>
              <Link
                to={href}
                className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
              >
                <Icon className="size-8" />
                <span className="text-lg hidden md:block">{text}</span>
              </Link>
            </li>
          ))}
        </ul>
        {authUser && (
          <Link
            to={`/profile/${authUser.username}`}
            className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full"
          >
            <div className="hidden rounded-full md:inline-flex">
              <div className="size-8 rounded-full">
                <img
                  src={authUser?.profileImg || "/avatar-placeholder.png"}
                  className="rounded-full"
                />
              </div>
            </div>
            <div className="flex justify-between flex-1">
              <div className="hidden md:block">
                <p className="text-white font-bold text-sm w-20 truncate">
                  {authUser?.fullName}
                </p>
                <p className="text-slate-500">@{authUser?.username}</p>
              </div>
              <LogOutIcon
                className="size-5 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
