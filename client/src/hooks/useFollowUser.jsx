import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "../components/ui/toast";

export function useFollowUser() {
  const queryClient = useQueryClient();

  const { mutate: followUser, isPending } = useMutation({
    mutationFn: async (userId) => {
      const res = await fetch(`/api/v1/users/follow/${userId}`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong");

      return data;
    },
    onSuccess: (data) => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
      ]);

      toast.add({
        type: "success",
        title: "Success",
        description: data?.message,
      });
    },
    onError: (error) => {
      toast.add({
        type: "error",
        title: "Error",
        description: error?.message,
      });
    },
  });

  return { followUser, isPending };
}
