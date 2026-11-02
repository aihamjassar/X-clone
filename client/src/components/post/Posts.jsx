import { useQuery } from "@tanstack/react-query";
import { Post } from "../post/Post";
import { PostSkeleton } from "../skeletons/PostSkeleton";

export function Posts({ feedType }) {
  const endpoint = feedType === "following" ? "following" : "all";

  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts", feedType],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/posts/${endpoint}`,
        {
          credentials: "include",
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      return data;
    },
    staleTime: 1000 * 60,
  });

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
