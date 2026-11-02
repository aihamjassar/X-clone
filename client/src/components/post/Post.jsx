import {
  BookmarkIcon,
  HeartIcon,
  MessageCircleIcon,
  Repeat2Icon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Spinner } from "../ui/spinner";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function Post({ post }) {
  const [comment, setComment] = useState("");
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const postOwner = post.user;
  const likedPosts = authUser?.likedPosts ?? [];
  const isLiked = likedPosts.includes(post._id);
  const isMyPost = authUser?._id === postOwner?._id;
  const formatDate = "1h";
  const isCommenting = false;

  const { mutate: deletePost, isPending } = useMutation({
    mutationFn: async (postId) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Something went wrong");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      toast.add({
        type: "success",
        title: "Post",
        description: "Post deleted successfully",
      });
    },
    onError: (error) => {
      toast.add({ type: "error", title: "Post", description: error.message });
    },
  });

  const { mutate: postComment } = useMutation({
    mutationFn: async ({ text, postId }) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/posts/comment/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ text }),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      setComment("");
      toast.add({
        type: "success",
        title: "Comment",
        description: "Comment added successfully",
      });
    },
    onError: (error) => {
      toast.add({
        type: "error",
        title: "Comment",
        description: error?.message,
      });
    },
  });

  const { mutate: likePost } = useMutation({
    mutationFn: async (postId) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/posts/like/${postId}`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.add({
        type: "error",
        title: "Like post",
        description: error?.message,
      });
    },
  });

  const handleDeletePost = () => {
    deletePost(post._id);
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    postComment({ text: comment, postId: post._id });
  };

  const handleLikePost = () => {
    likePost(post._id);
  };

  return (
    <>
      <div className="flex gap-2 items-start p-4 border-b border-gray-700">
        <div className="w-8">
          <Link
            to={`/profile/${postOwner.username}`}
            className="w-8 rounded-full overflow-hidden"
          >
            <img src={postOwner.profileImg || "/avatar-placeholder.png"} />
          </Link>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-2 items-center">
            <Link to={`/profile/${postOwner.username}`} className="font-bold">
              {postOwner.fullName}
            </Link>
            <span className="text-gray-700 flex gap-1 text-sm">
              <Link to={`/profile/${postOwner.username}`}>
                @{postOwner.username}
              </Link>
              <span>.</span>
              <span>{formatDate}</span>
            </span>
            {isMyPost && (
              <span className="flex-1 flex justify-end">
                {isPending ? (
                  <Spinner />
                ) : (
                  <TrashIcon
                    className="cursor-pointer hover:text-red-500"
                    onClick={handleDeletePost}
                  />
                )}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3 overflow-hidden">
            <span>{post.text}</span>
            {post.img && (
              <img
                src={post.img}
                alt=""
                className="h-80 object-contain rounded-lg border border-gray-700"
              />
            )}
          </div>
          <div className="flex gap-4 items-center justify-between pt-4">
            <Dialog>
              <DialogTrigger className="flex gap-1 items-center cursor-pointer group">
                <MessageCircleIcon className="size-4 text-slate-500 group-hover:text-sky-400" />
                <span className="text-sm text-slate-500 group-hover:text-sky-400">
                  {post.comments.length}
                </span>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>COMMENTS</DialogHeader>
                {post.comments.length === 0 && (
                  <p>No comments yet 🤔 Be the first one 😉</p>
                )}
                {post.comments.map((comment) => (
                  <div key={comment._id} className="flex gap-2 items-start">
                    <div>
                      <div className="w-8 rounded-full">
                        <img
                          src={
                            comment.user.profileImg || "/avatar-placeholder.png"
                          }
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="font-bold">
                          {comment.user.fullName}
                        </span>
                        <span className="text-gray-700 text-sm">
                          @{comment.user.username}
                        </span>
                      </div>
                      <div className="text-sm">{comment.text}</div>
                    </div>
                  </div>
                ))}
                <DialogFooter>
                  <form
                    className="w-full flex items-center gap-2"
                    onSubmit={handlePostComment}
                  >
                    <Textarea
                      className="w-full min-h-10 resize-none "
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <Button type="submit">
                      {isCommenting ? <Spinner /> : "Post"}
                    </Button>
                  </form>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <div className="flex gap-1 items-center group cursor-pointer">
              <Repeat2Icon className="w-6 h-6 text-slate-500 group-hover:text-green-500" />
              <span className="text-sm text-slate-500 group-hover:text-green-500">
                0
              </span>
            </div>
            <div
              className="flex gap-1 items-center cursor-pointer group"
              onClick={handleLikePost}
            >
              {!isLiked && (
                <HeartIcon className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500" />
              )}
              {isLiked && (
                <HeartIcon className="w-4 h-4 cursor-pointer text-pink-500 " />
              )}
              <span
                className={`text-sm text-slate-500 group-hover:text-pink-500 ${
                  isLiked ? "text-pink-500" : ""
                }`}
              >
                {post.likes.length}
              </span>
            </div>
            <div className="flex justify-end gap-2 items-center">
              <BookmarkIcon className="w-4 h-4 text-slate-500 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
