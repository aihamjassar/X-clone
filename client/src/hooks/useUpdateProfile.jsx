import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "../components/ui/toast";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  const {
    mutate: updateProfile,
    isPending: isUpdatingProfile,
    isSuccess,
  } = useMutation({
    mutationFn: async (userProfile) => {
      const res = await fetch(`/api/v1/users/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userProfile),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong");
    },
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
      ]);
      toast.add({
        type: "success",
        title: "Update profile",
        description: "Profile updated successfully",
      });
    },
    onError: (error) => {
      toast.add({
        type: "error",
        title: "Update profile",
        description: error?.message,
      });
    },
  });

  return { updateProfile, isUpdatingProfile, isSuccess };
}
