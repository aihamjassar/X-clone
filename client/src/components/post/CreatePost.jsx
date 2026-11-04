import { ImageIcon, SmileIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function CreatePost() {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const imgRef = useRef(null);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const {
    mutate: createPost,
    isPending,
    isError,
  } = useMutation({
    mutationFn: async ({ text, img }) => {
      const res = await fetch(`/api/v1/posts/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ text, img }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.add({
        type: "success",
        title: "Post",
        description: "Post created successfully",
      });
      setText("");
      setImg(null);
    },
    onError: (error) => {
      toast.add({
        type: "error",
        title: "Post",
        description: error.message,
      });
    },
  });

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({ text, img });
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div>
        <div className="w-8 rounded-full">
          <img src={authUser?.profileImg || "/avatar-placeholder.png"} alt="" />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <Textarea
          className="w-full h-44 text-lg resize-none border-none focus-visible:ring-0 focus-visible:outline-none"
          placeholder="What is happing?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {img && (
          <div className="relative w-72 mx-auto">
            <XIcon
              className="absolute top-0 right-0 bg-gray-800 rounded-full size-5 cursor-pointer"
              onClick={() => {
                setImg(null);
                imgRef.current.value = null;
              }}
            />
            <img
              src={img}
              className="w-full mx-auto h-72 object-contain rounded"
              alt=""
            />
          </div>
        )}
        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            <ImageIcon
              className="size-6 cursor-pointer"
              onClick={() => imgRef.current.click()}
            />
            <SmileIcon className="size-5 cursor-pointer" />
          </div>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
          />
          <Button
            type="submit"
            size="sm"
            className="rounded-ful px-4 cursor-pointer"
          >
            {isPending ? "Posting..." : "Post"}
          </Button>
        </div>
        {isError && <div className="text-red-500">Something went wrong</div>}
      </form>
    </div>
  );
}
