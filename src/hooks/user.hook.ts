import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateProfilePayload } from "@/api";
import { updateProfile } from "@/api";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
  });
}
