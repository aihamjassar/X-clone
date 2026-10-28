import { BellIcon, HomeIcon, LogOutIcon, User2Icon } from "lucide-react";
import { Link } from "react-router";
import { XSvg } from "../svgs/X";

const data = {
  fullName: "John Doe",
  username: "johndoe",
  profileImg: "/avatars/boy1.png",
};

const SIDEBAR_ITEMS = [
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
    href: `/profile/${data.username}`,
    Icon: User2Icon,
    text: "Profile",
  },
];

export function Sidebar() {
  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
        <Link to="/" className="flex justify-center md:justify-start">
          <XSvg className="px-2 size-12 rounded-full fill-white hover:bg-stone-900" />
        </Link>
        <ul className="flex flex-col gap3 mt-4">
          {SIDEBAR_ITEMS.map(({ href, Icon, text }) => (
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
        {data && (
          <Link
            to={`/profile/${data.username}`}
            className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full"
          >
            <div className="hidden md:inline-flex">
              <div className="w-8 rounded-full">
                <img src={data?.profileImg || "/avatar-placeholder.png"} />
              </div>
            </div>
            <div className="flex justify-between flex-1">
              <div className="hidden md:block">
                <p className="text-white font-bold text-sm w-20 truncate">
                  {data?.fullName}
                </p>
                <p className="text-slate-500">@{data?.username}</p>
              </div>
              <LogOutIcon className="size-5 cursor-pointer" />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
