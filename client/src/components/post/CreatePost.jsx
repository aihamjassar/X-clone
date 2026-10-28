import { ImageIcon, SmileIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export function CreatePost() {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const imgRef = useRef(null);

  const isPending = false;
  const isError = false;

  const data = {
    profileImg: "/avatars/boy1.png",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Post create successfully");
  };

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

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div>
        <div className="w-8 rounded-full">
          <img src={data.profileImg || "/avatar-placeholder.png"} alt="" />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <Textarea
          className="w-full h-44 text-lg resize-none border-none focus:outline-none border-gray-800"
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
          <Button type="button" size="sm" className="rounded-ful px-4 cursor-pointer">
            {isPending ? "Posting..." : "Post"}
          </Button>
        </div>
        {isError && <div className="text-read-500">Something went wrong</div>}
      </form>
    </div>
  );
}
