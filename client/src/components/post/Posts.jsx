import { useQuery } from "@tanstack/react-query";
import { Post } from "../post/Post";
import { PostSkeleton } from "../skeletons/PostSkeleton";
import { useEffect } from "react";

export function Posts({ feedType, userId, username }) {
  let endpoint;
  switch (feedType) {
    case "following":
      endpoint = "following";
      break;
    case "likes":
      endpoint = `likes/${userId}`;
      break;
    case "posts":
      endpoint = `user/${username}`;
      break;
    default:
      endpoint = "all";
  }

  const {
    data: posts,
    refetch,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts", feedType],
    queryFn: async () => {
      const res = await fetch(`/api/v1/posts/${endpoint}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      return data;
    },
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    refetch();
  }, [feedType, username, userId, refetch]);

  return (
    <>
      {isLoading && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && posts?.length === 0 && (
        <p className="p-4 text-center">No posts in this tab. Switch 👻</p>
      )}
      {isError && (
        <p className="p-4 text-center text-red-500">Error: {error.message}</p>
      )}
      {!isLoading && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
