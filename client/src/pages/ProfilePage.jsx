import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, CalendarIcon, EditIcon, LinkIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { EditProfileModal } from "../components/common/EditProfileModal";
import { Posts } from "../components/post/Posts";
import { ProfileHeaderSkeleton } from "../components/skeletons/ProfileHeaderSkeleton";
import { Button } from "../components/ui/button";
import { Spinner } from "../components/ui/spinner";
import { useFollowUser } from "../hooks/useFollowUser";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { formatMemberSinceDate } from "../utils/formatDate";

export function ProfilePage() {
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("posts");

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);
  let isMyProfile;

  const { username } = useParams();

  const { followUser, isPending } = useFollowUser();

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const {
    data: user,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/profile/${username}`,
        {
          credentials: "include",
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong");

      return data;
    },
  });

  const { updateProfile, isUpdatingProfile, isSuccess } = useUpdateProfile();

  useEffect(() => {
    refetch();
  }, [refetch, username]);

  if (user) {
    isMyProfile = user?._id === authUser._id;
  }

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "coverImg" && setCoverImg(reader.result);
        state === "profileImg" && setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCoverImg(null);
      setProfileImg(null);
    }
  }, [isSuccess]);

  return (
    <>
      <div className="flex-[4_4_0]  border-r border-gray-700 min-h-screen ">
        {/* HEADER */}
        {isLoading && isRefetching && <ProfileHeaderSkeleton />}
        {!isLoading && !isRefetching && !user && (
          <p className="text-center text-lg mt-4">User not found</p>
        )}
        <div className="flex flex-col">
          {!isLoading && !isRefetching && user && (
            <>
              <div className="flex gap-10 px-4 py-2 items-center">
                <Link to="/">
                  <ArrowLeftIcon className="w-4 h-4" />
                </Link>
                <div className="flex flex-col">
                  <p className="font-bold text-lg">{user?.fullName}</p>
                  <span className="text-sm text-slate-500">{4} posts</span>
                </div>
              </div>
              {/* COVER IMG */}
              <div className="relative group/cover">
                <img
                  src={coverImg || user?.coverImg || "/cover.png"}
                  className="h-52 w-full object-cover"
                  alt="cover image"
                />
                {isMyProfile && (
                  <div
                    className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                    onClick={() => coverImgRef.current.click()}
                  >
                    <EditIcon className="w-5 h-5" />
                  </div>
                )}

                <input
                  type="file"
                  accept="images/*"
                  hidden
                  ref={coverImgRef}
                  onChange={(e) => handleImgChange(e, "coverImg")}
                />
                <input
                  type="file"
                  accept="images/*"
                  hidden
                  ref={profileImgRef}
                  onChange={(e) => handleImgChange(e, "profileImg")}
                />
                {/* USER AVATAR */}
                <div className="avatar absolute -bottom-16 left-4">
                  <div className="w-32 rounded-full relative group/avatar">
                    <img
                      src={
                        profileImg ||
                        user?.profileImg ||
                        "/avatar-placeholder.png"
                      }
                      className="rounded-full"
                    />
                    <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                      {isMyProfile && (
                        <EditIcon
                          className="size-5 text-black"
                          onClick={() => profileImgRef.current.click()}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end px-4 mt-5 gap-2">
                {isMyProfile && <EditProfileModal />}
                {!isMyProfile && (
                  <Button
                    onClick={() => followUser(user?._id)}
                    className="cursor-pointer"
                  >
                    {isPending ? (
                      <Spinner />
                    ) : authUser?.following.includes(user?._id) ? (
                      "Unfollow"
                    ) : (
                      "Follow"
                    )}
                  </Button>
                )}
                {(coverImg || profileImg) && (
                  <Button
                    disabled={isUpdatingProfile}
                    onClick={() => updateProfile({ coverImg, profileImg })}
                  >
                    {isUpdatingProfile ? "Updating..." : "Update"}
                  </Button>
                )}
              </div>

              <div className="flex flex-col gap-4 mt-14 px-4">
                <div className="flex flex-col">
                  <span className="font-bold text-lg">{user?.fullName}</span>
                  <span className="text-sm text-slate-500">
                    @{user?.username}
                  </span>
                  <span className="text-sm my-1">{user?.bio}</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {user?.link && (
                    <div className="flex gap-1 items-center ">
                      <>
                        <LinkIcon className="w-3 h-3 text-slate-500" />
                        <a
                          href={user.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          {user.link}
                        </a>
                      </>
                    </div>
                  )}
                  <div className="flex gap-2 items-center">
                    <CalendarIcon className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-500">
                      {formatMemberSinceDate(user.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {user?.following.length}
                    </span>
                    <span className="text-slate-500 text-xs">Following</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {user?.followers.length}
                    </span>
                    <span className="text-slate-500 text-xs">Followers</span>
                  </div>
                </div>
              </div>
              <div className="flex w-full border-b border-gray-700 mt-4">
                <div
                  className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer"
                  onClick={() => setFeedType("posts")}
                >
                  Posts
                  {feedType === "posts" && (
                    <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
                  )}
                </div>
                <div
                  className="flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer"
                  onClick={() => setFeedType("likes")}
                >
                  Likes
                  {feedType === "likes" && (
                    <div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary" />
                  )}
                </div>
              </div>
            </>
          )}

          <Posts feedType={feedType} username={username} userId={user?._id} />
        </div>
      </div>
    </>
  );
}
